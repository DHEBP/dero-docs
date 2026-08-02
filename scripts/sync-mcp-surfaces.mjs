#!/usr/bin/env node

import { readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'

const roots = ['derod-main', 'tela-main', 'hologram-main', 'deropay-main']
const cardPaths = roots.map((root) => path.join(root, 'public', '.well-known', 'mcp-server-card.json'))
const skillPaths = roots.map((root) => path.join(root, 'public', 'SKILL.md'))
const pagePath = path.join('derod-main', 'pages', 'tools', 'mcp-server.mdx')
const agentsPath = path.join('derod-main', 'public', 'agents.md')
const pageMarkers = ['{/* mcp-release-surface:start */}', '{/* mcp-release-surface:end */}']
const agentsMarkers = ['<!-- mcp-release-surface:start -->', '<!-- mcp-release-surface:end -->']

function fail(message) {
  throw new Error(`[sync-mcp-surfaces] ${message}`)
}

function validateSurface(surface) {
  if (surface?.schemaVersion !== 1) fail('unsupported schemaVersion')
  if (surface?.source?.repository !== 'DHEBP/dero-mcp-server') fail('unexpected source repository')
  if (!/^v\d+\.\d+\.\d+$/.test(surface?.source?.tag ?? '')) fail('invalid source tag')
  if (!/^[0-9a-f]{40}$/.test(surface?.source?.commit ?? '')) fail('invalid source commit')
  if (!/^\d+\.\d+\.\d+$/.test(surface?.server?.version ?? '')) fail('invalid server version')
  if (surface.source.tag !== `v${surface.server.version}`) fail('tag and server version differ')
  if (!Number.isInteger(surface?.docs?.pageCount) || surface.docs.pageCount < 1) fail('invalid docs page count')
  for (const key of ['tools', 'resources', 'prompts']) {
    if (!Array.isArray(surface[key]) || surface[key].some((item) => !item || typeof item.name !== 'string')) {
      fail(`invalid ${key}`)
    }
    if (new Set(surface[key].map(({ name }) => name)).size !== surface[key].length) fail(`duplicate ${key}`)
  }
  if (!Array.isArray(surface.composites) || surface.composites.some((name) => typeof name !== 'string')) fail('invalid composites')
  const tools = new Set(surface.tools.map(({ name }) => name))
  for (const name of surface.composites) if (!tools.has(name)) fail(`unknown composite ${name}`)
  if (!Array.isArray(surface.protocols) || !surface.protocols.includes('2026-07-28')) fail('modern protocol missing')
  return surface
}

function replaceBlock(text, [start, end], body, label) {
  const first = text.indexOf(start)
  const last = text.indexOf(end)
  if (first < 0 || last < first || text.indexOf(start, first + start.length) >= 0 || text.indexOf(end, last + end.length) >= 0) {
    fail(`${label} markers are missing or duplicated`)
  }
  return `${text.slice(0, first + start.length)}\n${body}\n${text.slice(last)}`
}

function replaceOnce(text, pattern, replacement, label) {
  const matches = text.match(new RegExp(pattern.source, pattern.flags.includes('g') ? pattern.flags : `${pattern.flags}g`)) ?? []
  if (matches.length !== 1) fail(`${label}: expected one match, found ${matches.length}`)
  return text.replace(pattern, replacement)
}

async function writeIfChanged(file, content) {
  const current = await readFile(file, 'utf8')
  if (current !== content) await writeFile(file, content)
}

function makeCard(surface) {
  return {
    name: surface.server.registryName,
    title: surface.server.title,
    description: `Read-only DERO MCP: ${surface.tools.length} tools (${surface.composites.length} composites), ${surface.resources.length} resources, ${surface.prompts.length} prompts, ${surface.docs.pageCount} bundled docs pages.`,
    version: surface.server.version,
    websiteUrl: surface.server.websiteUrl,
    repository: { url: surface.server.repositoryUrl, source: 'github' },
    packages: [{
      registryType: 'npm',
      registryBaseUrl: 'https://registry.npmjs.org',
      identifier: 'dero-mcp-server',
      version: surface.server.version,
      transport: { type: 'stdio' },
    }],
    remotes: [{ transport: { type: surface.transport.type }, url: surface.transport.url }],
    capabilities: { tools: true, resources: true, prompts: true },
    tools: surface.tools.map(({ name, description }) => ({ name, description })),
    resources: surface.resources.map(({ uri, name, description }) => ({ uri, name, description })),
    prompts: surface.prompts.map(({ name, description }) => ({ name, description })),
    annotations: { readOnlyHint: true, destructiveHint: false, idempotentHint: false, openWorldHint: false },
    discovery: {
      llms_txt: 'https://derod.org/llms.txt',
      agents_md: 'https://derod.org/agents.md',
      skill_md: 'https://derod.org/SKILL.md',
      openapi: 'https://derod.org/api/openapi.json',
    },
    contact: { url: 'https://derod.org' },
  }
}

function pageSummary(surface) {
  const docsTools = surface.tools.filter(({ name }) => name.startsWith('dero_docs_')).length
  const primitives = surface.tools.length - surface.composites.length
  const daemonTools = primitives - docsTools
  const resources = surface.resources.map(({ uri }) => `\`${uri.replace('dero://mcp/', '')}\``).join(', ')
  const protocols = surface.protocols.map((version) => `\`${version}\``).join(', ')
  return [
    '| Surface | Count | Notes |',
    '|---|---:|---|',
    `| **Release** | **v${surface.server.version}** | Hosted at [mcp.derod.org](https://mcp.derod.org/health) after legacy + modern client verification |`,
    `| **Tools** | **${surface.tools.length}** | ${primitives} read-only primitives + ${surface.composites.length} composites |`,
    `| ↳ Daemon/local primitives | ${daemonTools} | Daemon reads plus local proof/address decoding |`,
    `| ↳ Docs primitives | ${docsTools} | Search, fetch-by-slug, and enumerate the bundled docs index |`,
    `| ↳ Composite tools | ${surface.composites.length} | Intent-shaped flows that combine primitives and cited docs |`,
    `| **Resources** | ${surface.resources.length} | ${resources} |`,
    `| **Prompts** | ${surface.prompts.length} | Composite-first guided flows |`,
    `| **Protocols** | ${surface.protocols.length} | ${protocols}; hosted HTTP is stateless |`,
    '| **Transports** | 2 | Local stdio + streamable HTTP; both expose the same server surface |',
    `| **Bundled docs index** | ${surface.docs.pageCount} pages | \`derod\`, \`tela\`, \`hologram\`, and \`deropay\` |`,
  ].join('\n')
}

function agentsSummary(surface) {
  const primitives = surface.tools.length - surface.composites.length
  const names = (values) => values.map((value) => `\`${value}\``).join(', ')
  return [
    `- Hosted release: \`v${surface.server.version}\` (${names(surface.protocols)}; stateless streamable HTTP)`,
    `- ${primitives} read-only primitive tools (daemon RPC, local decode, and docs lookup)`,
    `- ${surface.composites.length} composite tools (${names(surface.composites)})`,
    `- ${surface.resources.length} resources (${names(surface.resources.map(({ uri }) => uri))})`,
    `- ${surface.prompts.length} prompts (${names(surface.prompts.map(({ name }) => name))})`,
    '- Read-only — no writes, fund movement, or contract invocation',
    '- Local stdio and hosted stateless streamable-HTTP transports',
  ].join('\n')
}

async function sync(surfaceFile, skillFile) {
  const surface = validateSurface(JSON.parse(await readFile(surfaceFile, 'utf8')))
  const skill = await readFile(skillFile, 'utf8')
  if (!skill.includes(`  version: ${surface.server.version}`)) fail('SKILL.md version differs from release')

  const card = `${JSON.stringify(makeCard(surface), null, 2)}\n`
  await Promise.all(cardPaths.map((file) => writeIfChanged(file, card)))
  await Promise.all(skillPaths.map((file) => writeIfChanged(file, skill)))

  let page = await readFile(pagePath, 'utf8')
  page = replaceBlock(page, pageMarkers, pageSummary(surface), pagePath)
  page = replaceOnce(page, /\d+ composite tools/, `${surface.composites.length} composite tools`, 'page composite count')
  page = replaceOnce(page, /bundled DERO documentation index \(\d+ pages/, `bundled DERO documentation index (${surface.docs.pageCount} pages`, 'page docs count')
  await writeIfChanged(pagePath, page)

  const agents = replaceBlock(await readFile(agentsPath, 'utf8'), agentsMarkers, agentsSummary(surface), agentsPath)
  await writeIfChanged(agentsPath, agents)
}

async function verify() {
  const cards = await Promise.all(cardPaths.map((file) => readFile(file, 'utf8')))
  const skills = await Promise.all(skillPaths.map((file) => readFile(file, 'utf8')))
  if (new Set(cards).size !== 1) fail('MCP cards differ across sites')
  if (new Set(skills).size !== 1) fail('SKILL.md differs across sites')
  if ('$schema' in JSON.parse(cards[0])) fail('MCP card references an unpublished schema')
  replaceBlock(await readFile(pagePath, 'utf8'), pageMarkers, '', pagePath)
  replaceBlock(await readFile(agentsPath, 'utf8'), agentsMarkers, '', agentsPath)
  process.stdout.write('[sync-mcp-surfaces] OK\n')
}

const args = process.argv.slice(2)
if (args[0] === '--verify' && args.length === 1) await verify()
else if (args.length === 2) {
  await sync(args[0], args[1])
  await verify()
} else fail('usage: sync-mcp-surfaces.mjs <mcp-surface.json> <SKILL.md> | --verify')
