# DERO Documentation Monorepo

Community-maintained documentation for DERO blockchain and TELA web3 platform - covering privacy-focused smart contracts, homomorphic encryption, decentralized applications, and developer resources.

🌐 **Live Sites:**
- **DERO Docs:** [derod.org](https://derod.org)
- **TELA Docs:** [tela.derod.org](https://tela.derod.org)

## About This Monorepo

This repository contains comprehensive documentation for:

### DERO Documentation (derod-main)
- DERO blockchain basics, features, and privacy suite
- DERO Virtual Machine (DVM) and smart contract development
- Mining, wallets, and node operations
- RPC APIs and integration guides
- Privacy features: homomorphic encryption, ring signatures, bulletproofs

### TELA Documentation (tela-main)
- TELA web3 platform and architecture
- Building decentralized applications
- TELA CLI and development tools
- XSWD protocol and wallet integration
- Templates and code examples

## Repository Structure

```
dero-docs/
├── derod-main/          # DERO Documentation (derod.org)
│   ├── pages/           # MDX documentation files
│   ├── components/      # React components
│   ├── public/          # Static assets
│   └── package.json     # Dependencies
│
├── tela-main/           # TELA Documentation (tela.derod.org)
│   ├── pages/           # MDX documentation files
│   ├── components/      # React components
│   ├── public/          # Static assets & examples
│   └── package.json     # Dependencies
│
├── package.json         # Monorepo configuration
├── CONTRIBUTING.md      # Contribution guidelines
└── README.md            # This file
```

## Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) 15.5+
- **Documentation**: [Nextra](https://nextra.site/) 2.13+
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4+
- **Deployment**: Vercel

## Quick Start

### Prerequisites

- Node.js >= 18.0.0
- npm >= 9.0.0

### Install Dependencies

```bash
# Install all dependencies for both projects
npm run install:all
```

### Development

Run either documentation site locally:

```bash
# DERO Documentation
npm run dev:derod
# Opens at http://localhost:3000

# TELA Documentation
npm run dev:tela
# Opens at http://localhost:3000
```

### Build for Production

```bash
# Build both sites
npm run build:all

# Or build individually
npm run build:derod
npm run build:tela
```

## Available Scripts

From the root directory:

| Script | Description |
|--------|-------------|
| `npm run dev:derod` | Start DERO docs dev server |
| `npm run dev:tela` | Start TELA docs dev server |
| `npm run build:derod` | Build DERO docs for production |
| `npm run build:tela` | Build TELA docs for production |
| `npm run build:all` | Build both sites |
| `npm run install:all` | Install dependencies for both projects |
| `npm run clean` | Remove build artifacts |
| `npm run clean:all` | Remove all build artifacts and node_modules |

## Deployment

Both sites are deployed independently on Vercel:

- **derod-main** → [derod.org](https://derod.org)
- **tela-main** → [tela.derod.org](https://tela.derod.org)

Each deployment uses its respective directory as the root via Vercel's monorepo configuration.

## Contributing

We welcome contributions! See [CONTRIBUTING.md](./CONTRIBUTING.md) for detailed guidelines.

### Quick Contribution Guide

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Make your changes and test locally
4. Commit with clear messages: `git commit -m "Add feature"`
5. Push to your fork: `git push origin feature/your-feature`
6. Open a Pull Request

### What to Contribute

- 🐛 Fix typos or errors
- 📝 Improve existing documentation
- ✨ Add new guides or examples
- 🎨 Enhance UI/UX components
- 🔗 Fix broken links or outdated info

## Project Status

- ✅ DERO Documentation: Active
- ✅ TELA Documentation: Active
- ✅ Monorepo: Configured
- ✅ CI/CD: Vercel

## Community & Support

- **Discord**: [discord.gg/H95TJDp](https://discord.gg/H95TJDp)
- **Twitter**: [@DeroProject](https://twitter.com/DeroProject)
- **GitHub**: [deroproject/derohe](https://github.com/deroproject/derohe)
- **Explorer**: [explorer.dero.io](https://explorer.dero.io)

## License

MIT License - See [LICENSE](./LICENSE) file.

Individual projects also have their own LICENSE files:
- [derod-main/LICENSE](./derod-main/LICENSE)
- [tela-main/LICENSE](./tela-main/LICENSE)

## Disclaimer

This is community-maintained documentation and is not officially affiliated with the DERO project. Always verify critical information with official DERO sources.

---

**Made with ❤️ by the DERO & TELA Community**