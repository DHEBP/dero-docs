# Hologram Documentation TODO

> Last Updated: Session 100 (December 30, 2025)

This file tracks documentation gaps and future improvements for the Hologram docs site.

---

## ✅ Completed (Session 100)

### High Priority Items
- [x] **Pre-seeded Test Wallets** - Added to simulator.mdx
- [x] **OmniSearch Syntax Guide** - Added to explorer.mdx (search filters, exclusions, min-likes)
- [x] **Address Book** - Added to wallet.mdx
- [x] **Sign & Verify Messages** - Added to wallet.mdx
- [x] **CSV Export** - Added to wallet.mdx
- [x] **First Run Wizard** - Added to quick-start.mdx
- [x] **Console Tab** - New settings.mdx page
- [x] **TELA Server Manager** - New settings.mdx page
- [x] **Settings Reference** - New dedicated page created

---

## 🟡 Medium Priority (Future Sessions)

### Expand Existing Pages

#### Browser (browser.mdx)
- [ ] Add Ratings Breakdown modal documentation
- [ ] Document favorites management in detail
- [ ] Add screenshots/diagrams for Discover tab

#### Studio (studio.mdx)
- [ ] Add visual diagrams for deployment flow
- [ ] Document MOD picker modal in detail
- [ ] Add dURL tag detection documentation (.lib, .shard, etc.)

#### Explorer (explorer.mdx)
- [ ] Add SC Discovery modal documentation
- [ ] Document SC interaction history feature
- [ ] Add visual examples of ring visualization

### New Sections

#### Troubleshooting Guide
- [ ] Common errors and solutions
- [ ] Network connectivity issues
- [ ] Wallet sync problems
- [ ] Gnomon indexing delays

#### FAQ Page
- [ ] General usage questions
- [ ] Developer questions
- [ ] Security questions

---

## 🟢 Low Priority (Nice to Have)

### Visual Improvements
- [ ] Add screenshots to all major pages
- [ ] Create architecture diagrams
- [ ] Add animated GIFs for complex workflows

### Advanced Topics
- [ ] Hot Reload auto-approve documentation
- [ ] Deep dive into Graviton storage
- [ ] XSWD protocol internals
- [ ] Custom theming guide

### Developer Guides
- [ ] Building TELA apps from scratch tutorial
- [ ] Smart contract development with Hologram
- [ ] Testing strategies with Simulator

---

## Documentation Style Guide

### Formatting
- Use `<Callout>` for important notes
- Use `<Steps>` for sequential instructions
- Use tables for feature comparisons
- Use code blocks with language tags

### Content Guidelines
- Keep explanations concise
- Include API references where applicable
- Link to related pages
- Avoid jargon without explanation

### Code Examples
- Use Go for backend examples
- Use JavaScript for frontend/telaHost examples
- Include realistic, working examples
- Add comments explaining key parts

---

## Page Status

| Page | Status | Last Updated |
|------|--------|--------------|
| overview.mdx | ✅ Complete | Session 100 |
| installation.mdx | ✅ Complete | - |
| quick-start.mdx | ✅ Updated | Session 100 |
| browser.mdx | ✅ Complete | - |
| offline-first.mdx | ✅ Complete | Session 100 |
| studio.mdx | ✅ Complete | - |
| wallet.mdx | ✅ Updated | Session 100 |
| mining.mdx | ✅ Complete | - |
| explorer.mdx | ✅ Updated | Session 100 |
| telahost-api.mdx | ✅ Complete | - |
| simulator.mdx | ✅ Updated | Session 100 |
| local-dev-server.mdx | ✅ Complete | - |
| security.mdx | ✅ Complete | - |
| proof-validation.mdx | ✅ Complete | - |
| settings.mdx | ✅ New | Session 100 |
| api-reference.mdx | ✅ Complete | - |

---

## Notes for Future Sessions

1. **Screenshots**: When adding screenshots, use the v6.1 design system theme
2. **API Updates**: Check if new backend methods need documentation
3. **Cross-references**: Ensure pages link to related content
4. **Version tracking**: Update page status table after changes

---

## Quick Reference: Documentation Files

```
hologram-main/pages/
├── _meta.json          # Navigation structure
├── index.mdx           # Hidden landing page
├── overview.mdx        # Architecture overview
├── installation.mdx    # Install guide
├── quick-start.mdx     # Getting started
├── browser.mdx         # TELA Browser
├── offline-first.mdx   # Sync Manager
├── studio.mdx          # Studio tools
├── wallet.mdx          # Wallet management
├── mining.mdx          # Developer Support
├── explorer.mdx        # Block Explorer
├── telahost-api.mdx    # JavaScript API
├── simulator.mdx       # Simulator Mode
├── local-dev-server.mdx # Local dev
├── security.mdx        # Security features
├── proof-validation.mdx # Proof validation
├── settings.mdx        # Settings reference (NEW)
└── api-reference.mdx   # Full API ref
```

