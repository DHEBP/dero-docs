# derod - DERO daemon documentation

Official community documentation for DERO daemon (`derod`), nodes, mining, and blockchain infrastructure.

🌐 **Live Site:** [derod.org](https://derod.org)

## About derod.org

**derod** = **DERO daemon** - The domain name reflects the core DERO node software executable (`derod`).

This site provides comprehensive documentation for DERO blockchain infrastructure, covering:

- **Basics**: Getting started with DERO, running nodes, wallets, mining
- **Features**: AstroBWT mining, Bulletproofs, Graviton DB, encrypted network
- **Privacy Suite**: Homomorphic encryption, ring signatures, transaction privacy
- **DVM**: DERO Virtual Machine and smart contract development
- **Engram**: Web3 wallet and dApp platform
- **RPC APIs**: Daemon and Wallet API references
- **Smart Contracts**: Development guides and examples
- **Tools**: Explorer, CLI tools, and utilities

## Local Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Open http://localhost:3000
```

## Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) 13+ with App Router
- **Documentation**: [Nextra](https://nextra.site/) 2.x
- **Styling**: Tailwind CSS
- **Language**: TypeScript
- **Deployment**: Vercel

## Project Structure

```
derod-main/
├── pages/          # Documentation content (MDX files)
│   ├── basics/     # Getting started guides
│   ├── features/   # DERO feature documentation
│   ├── privacy/    # Privacy suite documentation
│   ├── dvm/        # Smart contract guides
│   ├── engram/     # Engram wallet docs
│   ├── rpc-api/    # API references
│   └── tools/      # Tool documentation
├── components/     # React components
├── public/         # Static assets (images, etc.)
├── styles/         # Global styles
└── theme.config.tsx # Nextra theme configuration
```

## Building for Production

```bash
# Build the site
npm run build

# Preview production build
npm start
```

## Contributing

We welcome contributions! To contribute:

1. **Fix typos or errors**: Submit a PR with the correction
2. **Improve existing docs**: Enhance clarity, add examples, update outdated info
3. **Add new content**: Create new guides or expand existing topics

### Content Guidelines

- Use clear, concise language
- Include code examples where applicable
- Add images/screenshots for visual guidance
- Link to related documentation
- Test all code examples before submitting

## Sitemap Generation

```bash
# Generate sitemap after content changes
npm run postbuild
```

## License

MIT License - See [LICENSE](./LICENSE) file for details.

## Community & Support

- **Discord**: [discord.gg/H95TJDp](https://discord.gg/H95TJDp)
- **Twitter**: [@DeroProject](https://twitter.com/DeroProject)
- **GitHub**: [github.com/deroproject/derohe](https://github.com/deroproject/derohe)

## Disclaimer

This is community-maintained documentation and is not officially affiliated with the DERO project. Always verify critical information with official DERO sources.
