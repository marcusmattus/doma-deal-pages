# 🚀 Deployment Instructions

## GitHub Repository
✅ **Code is live on GitHub**: https://github.com/marcusmattus/doma-deal-pages

## Quick Deploy Options

### Option 1: One-Click Vercel Deploy (Recommended)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/marcusmattus/doma-deal-pages)

1. Click the "Deploy with Vercel" button above
2. Connect your GitHub account if needed
3. The project will auto-deploy with default settings
4. Your live URL will be provided (e.g., `https://doma-deal-pages.vercel.app`)

### Option 2: Manual Vercel CLI Deploy

```bash
# Login to Vercel
vercel login

# Deploy to production
vercel --prod

# Follow prompts to configure project
```

### Option 3: Vercel Dashboard Deploy

1. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. Click "Add New" → "Project"
3. Import from GitHub: `marcusmattus/doma-deal-pages`
4. Configure environment variables (see below)
5. Deploy!

## Environment Variables

When deploying, make sure to set these environment variables:

```env
# Doma Protocol Configuration
NEXT_PUBLIC_DOMA_API_BASE=https://api-testnet.doma.xyz/api/v1
NEXT_PUBLIC_DOMA_DASHBOARD_URL=https://dashboard-testnet.doma.xyz

# Base Sepolia Network (Doma Testnet) 
NEXT_PUBLIC_CHAIN_ID=84532
NEXT_PUBLIC_RPC_URL=https://sepolia.base.org

# Application URL (will be auto-set by Vercel)
NEXT_PUBLIC_APP_URL=https://your-deployed-url.vercel.app

# XMTP Protocol
XMTP_ENV=dev

# Analytics (Optional)
POSTHOG_KEY=your_posthog_key_here
```

## Alternative Hosting Options

### Netlify
1. Connect GitHub repo to Netlify
2. Build command: `pnpm build`
3. Publish directory: `.next`
4. Set environment variables

### Railway
```bash
railway login
railway link
railway up
```

### Cloudflare Pages
1. Connect GitHub repo to Cloudflare Pages
2. Framework preset: Next.js
3. Set environment variables

## Post-Deployment Checklist

After deployment, verify:
- ✅ Homepage loads correctly
- ✅ Demo pages work (`/ape/laser`, `/core/alpha`)
- ✅ Offer submission functions
- ✅ XMTP chat starter works
- ✅ Sitemap is accessible (`/sitemap.xml`)
- ✅ Mobile responsiveness
- ✅ SEO meta tags are present

## Live Demo URLs

Once deployed, your live URLs will be:
- **Homepage**: `https://your-domain.vercel.app`
- **Demo Domains**: 
  - `https://your-domain.vercel.app/ape/laser`
  - `https://your-domain.vercel.app/core/alpha`
- **Chat Demo**: `https://your-domain.vercel.app/chat`
- **Sitemap**: `https://your-domain.vercel.app/sitemap.xml`

## Support

If you need help with deployment:
1. Check the [Vercel documentation](https://vercel.com/docs)
2. Ensure all environment variables are set correctly
3. Check the build logs for any errors
4. The project includes fallback mock data if APIs are unavailable

---

🎯 **Ready for Track 5 Submission!**