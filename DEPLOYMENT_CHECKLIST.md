# Deployment Checklist

Pre-deployment checklist for DERO Documentation Monorepo

## ✅ Configuration Review

### Repository Setup
- [x] GitHub repository created: `https://github.com/DHEBP/dero-docs.git`
- [x] Repository URLs updated in package.json files
- [x] Root package.json with monorepo scripts
- [x] .gitignore files configured (root + both projects)
- [x] LICENSE file created (MIT)
- [x] README.md files for all three levels
- [x] CONTRIBUTING.md guide created

### Dependencies
- [x] Standardized Next.js version: 15.5.3
- [x] Standardized React version: 18.2.0
- [x] All dependencies aligned between projects
- [x] postbuild script configured for sitemap generation

### SEO & Sitemaps
- [x] derod-main sitemap URL: https://derod.org
- [x] tela-main sitemap URL: https://tela.derod.org
- [x] seo.config.ts matches sitemap URLs
- [x] robots.txt generation enabled
- [x] og:image files present
- [x] Twitter card metadata configured

### Build Configuration
- [x] next.config.js files configured
- [x] tailwind.config.js files present
- [x] TypeScript configured (tsconfig.json)
- [x] PostCSS configured
- [x] PWA configuration (next-pwa)

## ⚠️ Issues to Review

### Before First Push
- [ ] Review and address TODO comments in:
  - `tela-main/pages/tela/overview.mdx`
  - `tela-main/pages/tela/tela-security-model.mdx`
- [ ] Verify all images load correctly (150+ image files)
- [ ] Test all external links (154+ links found)
- [ ] Remove .DS_Store from tracking (currently untracked)

### Code Quality (Optional)
- [ ] Review 92 console.log statements in production code
- [ ] Consider adding proper logging library
- [ ] Consider moving `setup-node-status.sh` from components/ to scripts/
- [ ] Test API routes (`/api/dero-stats`) locally

### Content Review
- [ ] Verify documentation accuracy
- [ ] Check for broken internal links
- [ ] Ensure code examples work
- [ ] Verify image alt text for accessibility

## 🚀 Deployment Steps

### 1. Initial Git Push
```bash
cd /Users/home/projects/__Dero/DHEBP/dero-docs

# Initialize if not already
git init
git add .
git commit -m "Initial commit: DERO & TELA documentation monorepo"

# Add remote and push
git branch -M main
git remote add origin https://github.com/DHEBP/dero-docs.git
git push -u origin main
```

### 2. Vercel Deployment

#### Deploy DERO Docs (derod.org)
1. Go to Vercel Dashboard
2. Import project from GitHub
3. **Root Directory**: `derod-main`
4. **Framework Preset**: Next.js
5. **Build Command**: `npm run build`
6. **Output Directory**: `.next`
7. **Install Command**: `npm install`
8. **Domain**: derod.org
9. Deploy

#### Deploy TELA Docs (tela.derod.org)
1. Import same GitHub repository again
2. **Root Directory**: `tela-main`
3. **Framework Preset**: Next.js
4. **Build Command**: `npm run build`
5. **Output Directory**: `.next`
6. **Install Command**: `npm install`
7. **Domain**: tela.derod.org
8. Deploy

### 3. Environment Variables (Optional)

For `derod-main`:
```
DERONODE=http://your-node-ip:10102/json_rpc
```

For `tela-main`:
```
DERONODE=http://your-node-ip:10102/json_rpc
```

### 4. Post-Deployment Verification

- [ ] Visit https://derod.org and verify site loads
- [ ] Visit https://tela.derod.org and verify site loads
- [ ] Check sitemap: https://derod.org/sitemap.xml
- [ ] Check sitemap: https://tela.derod.org/sitemap.xml
- [ ] Check robots.txt: https://derod.org/robots.txt
- [ ] Check robots.txt: https://tela.derod.org/robots.txt
- [ ] Verify navigation works
- [ ] Test search functionality
- [ ] Check mobile responsiveness
- [ ] Verify images load correctly
- [ ] Test dark/light mode switching
- [ ] Check API routes work

## 📊 Repository Statistics

- **Total Components**: 20 (shared between projects)
- **Total Images**: 150+ files
- **Documentation Pages**: 40+ MDX files
- **Code Duplication**: ~85-90% (by design for independence)
- **External Links**: 154+ documented links
- **Tech Stack**: Next.js 15.5, React 18.2, Nextra 2.13, Tailwind 4

## 🔒 Security Checklist

- [x] No .env files committed
- [x] No API keys or secrets in code
- [x] Proper .gitignore configuration
- [x] Dependencies up to date
- [x] No hardcoded passwords
- [x] Localhost references have fallbacks

## 📝 Maintenance Notes

### Updating Content
```bash
# For DERO docs
cd derod-main
# Edit files in pages/
npm run dev  # Test locally
git commit -am "Update DERO documentation"
git push  # Auto-deploys on Vercel

# For TELA docs
cd tela-main
# Edit files in pages/
npm run dev  # Test locally
git commit -am "Update TELA documentation"
git push  # Auto-deploys on Vercel
```

### Updating Shared Components
When updating components shared by both projects:
1. Update in both `derod-main/components/` and `tela-main/components/`
2. Test both sites locally
3. Commit changes to both
4. Push to trigger deployment

### Dependency Updates
```bash
# From project root
cd derod-main && npm update && cd ..
cd tela-main && npm update && cd ..
```

## 🆘 Troubleshooting

### Build Fails
- Check Node.js version (requires 18+)
- Clear `.next` folders: `npm run clean`
- Reinstall dependencies: `npm run install:all`

### Images Not Loading
- Verify images are in `public/assets/`
- Check image paths in MDX files
- Ensure images are committed to git

### Sitemap Issues
- Verify siteUrl in `next-sitemap.config.js`
- Run `npm run postbuild` manually
- Check generated files in `public/`

## 📞 Support

- Discord: https://discord.gg/H95TJDp
- GitHub Issues: https://github.com/DHEBP/dero-docs/issues
- DERO Project: https://github.com/deroproject/derohe

---

Last Updated: October 23, 2025

