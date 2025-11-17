# Deployment Guide

## Overview

Academia can be deployed to various platforms. This guide covers the most popular options.

---

## 🚀 Vercel (Recommended)

Vercel is the easiest deployment option for Next.js apps.

### Prerequisites

- GitHub account
- Vercel account (free tier available)
- Environment variables ready

### Steps

1. **Push to GitHub**

   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/yourusername/academia.git
   git push -u origin main
   ```

2. **Deploy to Vercel**

   Option A - Using Vercel Dashboard:

   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Configure project settings
   - Add environment variables
   - Click "Deploy"

   Option B - Using Vercel CLI:

   ```bash
   npm i -g vercel
   vercel login
   vercel
   ```

3. **Configure Environment Variables**

   In Vercel Dashboard → Settings → Environment Variables, add:

   ```
   NEXT_PUBLIC_SUPABASE_URL
   NEXT_PUBLIC_SUPABASE_ANON_KEY
   SUPABASE_SERVICE_ROLE_KEY
   TIKTOK_CLIENT_KEY
   TIKTOK_CLIENT_SECRET
   NEXT_PUBLIC_TIKTOK_REDIRECT_URI (use your Vercel URL)
   NEXTAUTH_SECRET
   NEXTAUTH_URL (your Vercel URL)
   ```

4. **Update TikTok OAuth Settings**

   - Go to TikTok Developer Portal
   - Update redirect URI to: `https://your-app.vercel.app/api/auth/tiktok/callback`

5. **Redeploy** (if needed)
   ```bash
   vercel --prod
   ```

---

## 🌊 Netlify

### Steps

1. **Install Netlify CLI**

   ```bash
   npm install -g netlify-cli
   ```

2. **Build the app**

   ```bash
   npm run build
   ```

3. **Deploy**

   ```bash
   netlify deploy --prod
   ```

4. **Configure Environment Variables**

   - Netlify Dashboard → Site Settings → Environment Variables
   - Add all required environment variables

5. **Update build settings** in `netlify.toml`:
   ```toml
   [build]
     command = "npm run build"
     publish = ".next"
   ```

---

## ☁️ AWS Amplify

### Steps

1. **Connect to GitHub**

   - AWS Amplify Console
   - Connect your repository

2. **Configure Build Settings**

   ```yaml
   version: 1
   frontend:
     phases:
       preBuild:
         commands:
           - npm ci
       build:
         commands:
           - npm run build
     artifacts:
       baseDirectory: .next
       files:
         - "**/*"
     cache:
       paths:
         - node_modules/**/*
   ```

3. **Add Environment Variables**
   - Amplify Console → Environment Variables
   - Add all required variables

---

## 🐳 Docker

### Dockerfile

Create `Dockerfile`:

```dockerfile
FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM node:18-alpine AS runner

WORKDIR /app

ENV NODE_ENV production

COPY --from=builder /app/next.config.ts ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

EXPOSE 3000

CMD ["npm", "start"]
```

### Build and Run

```bash
# Build image
docker build -t academia .

# Run container
docker run -p 3000:3000 \
  -e NEXT_PUBLIC_SUPABASE_URL=your-url \
  -e NEXT_PUBLIC_SUPABASE_ANON_KEY=your-key \
  # ... add other env vars
  academia
```

### Docker Compose

Create `docker-compose.yml`:

```yaml
version: "3.8"

services:
  app:
    build: .
    ports:
      - "3000:3000"
    env_file:
      - .env.local
    restart: unless-stopped
```

Run with:

```bash
docker-compose up -d
```

---

## 🚂 Railway

### Steps

1. **Install Railway CLI**

   ```bash
   npm i -g @railway/cli
   ```

2. **Login and Initialize**

   ```bash
   railway login
   railway init
   ```

3. **Add Environment Variables**

   ```bash
   railway variables set NEXT_PUBLIC_SUPABASE_URL=your-url
   # ... add other variables
   ```

4. **Deploy**
   ```bash
   railway up
   ```

---

## 🌐 Digital Ocean App Platform

### Steps

1. **Create App**

   - DigitalOcean Dashboard → Apps → Create App
   - Connect GitHub repository

2. **Configure Build**

   - Build Command: `npm run build`
   - Run Command: `npm start`

3. **Add Environment Variables**

   - App Settings → Environment Variables
   - Add all required variables

4. **Deploy**

---

## 📋 Post-Deployment Checklist

- [ ] Verify environment variables are set correctly
- [ ] Update TikTok OAuth redirect URI to production URL
- [ ] Test TikTok login flow
- [ ] Test database connections
- [ ] Verify PWA installation works
- [ ] Check all pages load correctly
- [ ] Test on mobile devices
- [ ] Set up custom domain (optional)
- [ ] Configure SSL/HTTPS
- [ ] Set up monitoring (Sentry, LogRocket, etc.)
- [ ] Set up analytics (Google Analytics, Plausible, etc.)

---

## 🔒 Security Considerations

### Production Environment Variables

Never commit `.env.local` to git. Use platform-specific environment variable management.

### Supabase Security

1. **Enable RLS**: Already configured in migrations
2. **Review Policies**: Ensure RLS policies are appropriate
3. **Rotate Keys**: Regularly rotate service role keys

### TikTok OAuth

1. **Client Secret**: Never expose in client-side code
2. **Redirect URI**: Use HTTPS in production
3. **CSRF Protection**: Already implemented with state parameter

### Next.js Security Headers

Add to `next.config.ts`:

```typescript
async headers() {
  return [
    {
      source: '/(.*)',
      headers: [
        {
          key: 'X-Frame-Options',
          value: 'DENY',
        },
        {
          key: 'X-Content-Type-Options',
          value: 'nosniff',
        },
        {
          key: 'Referrer-Policy',
          value: 'origin-when-cross-origin',
        },
      ],
    },
  ];
},
```

---

## 📊 Monitoring & Analytics

### Recommended Tools

- **Error Tracking**: Sentry
- **Analytics**: Google Analytics, Plausible, or Vercel Analytics
- **Performance**: Vercel Speed Insights or Web Vitals
- **Uptime**: UptimeRobot or Pingdom

### Vercel Analytics Setup

```bash
npm install @vercel/analytics
```

Add to `app/layout.tsx`:

```typescript
import { Analytics } from "@vercel/analytics/react";

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
```

---

## 🔄 CI/CD

### GitHub Actions

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: "18"
      - run: npm ci
      - run: npm run build
      - run: npm test # if you have tests
```

---

## 🐛 Troubleshooting

### Build Errors

**Issue**: Module not found errors

```bash
rm -rf node_modules .next
npm install
npm run build
```

**Issue**: TypeScript errors

- Check `tsconfig.json` is present
- Verify all type definitions are installed

### Runtime Errors

**Issue**: Environment variables not working

- Verify they're prefixed with `NEXT_PUBLIC_` for client-side
- Check they're set in deployment platform
- Restart the application after adding variables

**Issue**: TikTok OAuth fails

- Verify redirect URI matches exactly
- Check client credentials are correct
- Ensure callback route is accessible

### Database Issues

**Issue**: Supabase connection fails

- Check Supabase project is active
- Verify connection strings are correct
- Check RLS policies aren't blocking access

---

## 📈 Scaling Considerations

### When to Scale

- **Traffic**: > 10,000 daily active users
- **Database**: > 1GB data size
- **API Calls**: Rate limiting issues

### Scaling Strategies

1. **Database**: Upgrade Supabase plan or add read replicas
2. **API**: Implement caching (Redis)
3. **Assets**: Use CDN for images/videos
4. **Background Jobs**: Use Vercel Cron or separate worker service

---

## 💰 Cost Estimates

### Free Tier (MVP)

- Vercel: Free (Hobby plan)
- Supabase: Free (up to 500MB database)
- TikTok API: Free
- **Total**: $0/month

### Production (1,000 users)

- Vercel: $20/month (Pro plan)
- Supabase: $25/month (Pro plan)
- CDN: $5/month
- **Total**: ~$50/month

### Scale (10,000+ users)

- Vercel: $20-50/month
- Supabase: $50-100/month
- CDN: $20/month
- Monitoring: $20/month
- **Total**: ~$110-190/month

---

Need help? Check the troubleshooting section in README.md or open an issue on GitHub.
