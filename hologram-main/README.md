# Hologram Documentation

Official documentation for Hologram - the DERO Decentralized Web Browser.

## About

This is a [Nextra](https://nextra.site/) documentation site for [Hologram](https://github.com/DHEBP/HOLOGRAM-git), the native desktop application for browsing decentralized applications on the DERO blockchain.

## Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## Structure

```
hologram-main/
├── pages/              # MDX documentation pages
│   ├── index.mdx       # Home page
│   ├── overview.mdx    # Architecture overview
│   ├── installation.mdx
│   ├── quick-start.mdx
│   ├── explorer.mdx    # Block Explorer
│   ├── browser.mdx     # TELA Browser
│   ├── offline-first.mdx
│   ├── studio.mdx      # Studio (DOC/INDEX + Version Control)
│   ├── wallet.mdx      # Wallet Management
│   ├── dero-auth.mdx
│   ├── developer-support.mdx # Developer Support (EPOCH)
│   ├── telahost-api.mdx # Developer API
│   ├── simulator.mdx   # Simulator Mode
│   ├── local-dev-server.mdx
│   ├── security.mdx    # Security Features
│   ├── proof-validation.mdx
│   ├── settings.mdx
│   ├── api-reference.mdx
│   └── _meta.json      # Navigation config
├── public/             # Static assets
│   └── assets/         # Images, icons
├── plugins/            # Remark plugins
├── theme.config.tsx    # Nextra theme config
├── seo.config.ts       # SEO configuration
├── next.config.js      # Next.js config
├── tailwind.config.js  # Tailwind config
└── package.json
```

## Related Projects

- [Hologram](https://github.com/DHEBP/HOLOGRAM-git) - The main application
- [derod-main](../derod-main) - DERO daemon documentation
- [tela-main](../tela-main) - TELA protocol documentation

## License

MIT

