# Contributing to DERO Documentation

Thank you for your interest in contributing to the DERO and TELA documentation!

## Getting Started

This is a monorepo containing two documentation sites:
- **derod-main**: DERO blockchain documentation (derod.org)
- **tela-main**: TELA platform documentation (tela.derod.org)

## Prerequisites

- Node.js >= 18.0.0
- npm >= 9.0.0

## Development Setup

### Install Dependencies

```bash
# Install all dependencies for both projects
npm run install:all

# Or install individually
cd derod-main && npm install
cd ../tela-main && npm install
```

### Run Development Servers

```bash
# Run DERO docs
npm run dev:derod

# Run TELA docs
npm run dev:tela
```

The sites will be available at:
- DERO: http://localhost:3000
- TELA: http://localhost:3000 (when running individually)

### Build for Production

```bash
# Build both sites
npm run build:all

# Or build individually
npm run build:derod
npm run build:tela
```

## Project Structure

```
dero-docs/
├── derod-main/          # DERO documentation
│   ├── pages/           # MDX documentation files
│   ├── components/      # React components
│   └── public/          # Static assets
├── tela-main/           # TELA documentation
│   ├── pages/           # MDX documentation files
│   ├── components/      # React components
│   └── public/          # Static assets
└── README.md            # You are here
```

## How to Contribute

### Reporting Issues

- Check existing issues before creating a new one
- Provide clear descriptions and steps to reproduce bugs
- Include screenshots for UI-related issues

### Submitting Changes

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Make your changes**
   - Follow existing code style
   - Test your changes locally
   - Update documentation if needed

4. **Commit your changes**
   ```bash
   git commit -m "Description of changes"
   ```

5. **Push to your fork**
   ```bash
   git push origin feature/your-feature-name
   ```

6. **Create a Pull Request**
   - Provide a clear description of changes
   - Reference any related issues

## Content Guidelines

### Writing Documentation

- Use clear, concise language
- Include code examples where applicable
- Add images/screenshots for visual guidance
- Test all code examples before submitting
- Link to related documentation

### MDX Files

Documentation is written in MDX (Markdown + JSX):

```mdx
---
title: Your Page Title
description: Brief description
---

# Your Page Title

Your content here...

<Callout type="info">
  Use callouts for important information
</Callout>
```

### Code Examples

Use proper syntax highlighting:

````mdx
```javascript
const example = "code";
```
````

### Images

Place images in the appropriate `public/assets/` directory:

```mdx
![Alt text](/assets/your-image.png)
```

## Style Guide

- Use sentence case for headings
- Keep line length reasonable (80-100 chars for prose)
- Use lists for multiple related items
- Add spacing between sections

## Testing

Before submitting:

1. Run the dev server and verify changes
2. Build the site to check for errors
3. Test all links and images
4. Verify code examples work

```bash
npm run dev:derod    # Test DERO docs
npm run build:derod  # Build DERO docs

npm run dev:tela     # Test TELA docs
npm run build:tela   # Build TELA docs
```

## Need Help?

- Join our [Discord](https://discord.gg/H95TJDp)
- Check existing documentation
- Ask questions in GitHub issues

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

