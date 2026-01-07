# Dev/Prod Sync Guide

## ✅ Changes Made

I've configured your project so that **development mode matches production settings** where possible.

### What's Now the Same

1. **CSS Optimization**: Enabled in both (`optimizeCss: true`)
2. **Package Imports**: Same optimizations
3. **Environment Validation**: Same behavior (warns in dev, errors in prod)
4. **All optimizations**: Applied consistently

### What's Different (By Design)

1. **Standalone Mode**: Only in production (required for Docker)
   - Can't be enabled in dev mode (Next.js limitation)
   - Use `npm run dev:prod` to test production build locally

2. **Hot Reload**: Only in dev mode
   - Production builds don't have hot reload

## 🚀 How to Use

### Development (with production-like optimizations)
```bash
npm run dev
```
- Uses CSS optimization
- Same optimizations as production
- Hot reload enabled
- Fast iteration

### Test Production Build Locally
```bash
npm run dev:prod
```
- Builds production version
- Starts production server
- Matches deployed version exactly

### Regular Production Build
```bash
npm run build
npm start
```

## 📋 Environment Variables

Make sure you have `.env.local` with:

```bash
NEXT_PUBLIC_FIREBASE_PROJECT_ID=portfolio2024-b95ee
NEXT_PUBLIC_FIREBASE_API_KEY=your_key_here
```

## 🔍 Why UI Might Still Look Different

Even with these changes, you might see differences because:

1. **Standalone Mode**: Production uses standalone output (different file structure)
2. **Build-time vs Runtime**: Some optimizations only happen during build
3. **Browser Cache**: Clear cache (Cmd+Shift+R) when testing

## ✅ Solution: Test Production Build Locally

To see **exactly** what production looks like:

```bash
# This builds and runs production version locally
npm run dev:prod
```

This will:
1. Build with all production optimizations
2. Use standalone mode
3. Start production server
4. Match deployed version exactly

---

**Note**: `npm run dev` now uses the same optimizations as production, but for the exact production experience, use `npm run dev:prod`.

