# Cloudflare Pages Deployment Guide

## ✅ Architecture Overview

Your site uses a modern static + serverless architecture:
- ✅ **Static site generation** (Astro) for fast CDN delivery
- ✅ **Cloudflare Pages Functions** for contact form API
- ✅ **Resend email service** for reliable message delivery
- ✅ **Edge computing** for low-latency responses
- ✅ **Automatic GitHub deployments** with global CDN
- ✅ **Free SSL certificate** and custom domain support

## 🚀 Deployment Steps

### 1. Push to GitHub

Create a new repository on GitHub:
```bash
# Add GitHub remote (replace with your repo URL)
git remote add origin https://github.com/YOUR-USERNAME/hailey-counseling.git

# Push to GitHub
git push -u origin main
```

### 2. Connect to Cloudflare Pages

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. Navigate to **Workers & Pages** → **Create application** → **Pages**
3. Click **Connect to Git**
4. Authorize GitHub and select your repository
5. Configure build settings:
   - **Production branch:** main
   - **Build command:** `npm run build:cloudflare` (builds static site)
   - **Build output directory:** `dist` (static files)
   - **Functions directory:** `functions` (auto-detected)

### 3. Set Up Resend Email Service

First, create a Resend account:
1. Go to [https://resend.com](https://resend.com) and sign up
2. Verify your email address
3. In the Resend dashboard, go to **API Keys** → **Create API Key**
4. Name it "Hailey Counseling Production" and create
5. **Copy the API key** (you won't see it again!)

### 4. Configure Environment Variables

In Cloudflare Pages dashboard, go to **Settings** → **Environment variables** and add:

| Variable | Value | Description |
|----------|-------|-------------|
| `RESEND_API_KEY` | `re_xxxxxxxxxx` | Your Resend API key |
| `TO_EMAIL` | `hailey.gonnerman@gmail.com` | Hailey's actual Gmail address |
| `FROM_EMAIL` | `noreply@haileygonnermancounseling.com` | Sender email address |
| `DOMAIN` | `haileygonnermancounseling.com` | Your domain name |

**Important Notes:**
- Replace `TO_EMAIL` with Hailey's actual Gmail address!
- For development, you can use `onboarding@resend.dev` as FROM_EMAIL
- For production, you'll need to verify your domain in Resend

### 5. Deploy

Click **Save and Deploy**. Your site will be live in about 1-2 minutes!

## 📧 Email Configuration

The contact form uses **Resend** (3,000 free emails/month):

1. **Generous free tier**: 3,000 emails/month, 100/day
2. **Excellent deliverability**: Better than most alternatives
3. **Modern developer experience**: Clean API and dashboard
4. Emails sent from your verified domain
5. Replies go to the sender's email address
6. Hailey receives emails at her Gmail account

### Domain Verification (Production)

For production use with your own domain:
1. In Resend dashboard, go to **Domains** → **Add Domain**
2. Enter `haileygonnermancounseling.com`
3. Add the DNS records Resend provides:
   - **SPF record**: `v=spf1 include:_spf.resend.com ~all`
   - **DKIM record**: (provided by Resend)
4. Verify domain status in Resend dashboard
5. Update `FROM_EMAIL` to use your verified domain

### Development vs Production
- **Development**: Use `onboarding@resend.dev` (no verification needed)
- **Production**: Use your verified domain (better deliverability)

## 🌐 Custom Domain Setup

To use `haileygonnermancounseling.com`:

1. In Cloudflare Pages → **Custom domains**
2. Click **Set up a custom domain**
3. Enter `haileygonnermancounseling.com`
4. Follow the DNS configuration instructions

## 🔧 Local Development

### Regular Astro development:
```bash
# Astro only (no functions)
npm run dev
```

### Test with Cloudflare Pages Functions:
```bash
# Build static site first
npm run build:cloudflare

# Start with functions
npm run dev:cloudflare

# Or preview after build
npm run preview:cloudflare
```

### Test the contact form locally:
1. Update `.env.local` with your test email
2. Run `npm run dev:cloudflare`
3. Navigate to http://localhost:8788
4. Submit the contact form

## 📝 Making Updates

### Static Site Changes:
1. Edit content, styles, or components
2. Test locally: `npm run dev`
3. Commit and push to GitHub
4. **Automatic rebuild and deployment**

### Function Changes:
1. Edit files in `/functions` directory
2. Test locally: `npm run dev:cloudflare`
3. Commit and push to GitHub
4. **Functions automatically redeployed**

## 🎯 Post-Deployment Checklist

- [ ] Verify contact form sends to correct Gmail
- [ ] Test on mobile devices
- [ ] Check all pages load correctly
- [ ] Verify images display properly
- [ ] Test form validation and error states
- [ ] Confirm success message appears after submission

## 💡 Troubleshooting

### Contact form not sending emails?
1. Check environment variables in Cloudflare dashboard (especially `RESEND_API_KEY`)
2. Verify Resend API key is valid in your Resend dashboard
3. Check if you've hit rate limits (100/day on free tier)
4. Verify `TO_EMAIL` is set correctly
5. Check Gmail spam folder
6. Review function logs in Cloudflare dashboard
7. For production: ensure domain is verified in Resend

### Site not updating after push?
1. Check Cloudflare Pages → **Deployments** for build status
2. Clear browser cache
3. Wait 2-3 minutes for CDN propagation

## 📊 Monitoring

View analytics and logs:
- **Analytics:** Cloudflare Dashboard → Analytics
- **Function logs:** Workers & Pages → Your site → Functions → Logs
- **Build logs:** Workers & Pages → Your site → Deployments

## 🆘 Support

- **Cloudflare Docs:** https://developers.cloudflare.com/pages/
- **Resend Docs:** https://resend.com/docs
- **Resend Support:** Available in their dashboard
- **GitHub Issues:** Report any code issues in your repository

---

**Ready to deploy!** Follow steps 1-5 above to get your site live on Cloudflare Pages with a working contact form that sends directly to Gmail via Resend.