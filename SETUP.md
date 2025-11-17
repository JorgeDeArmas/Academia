# Academia MVP - Quick Setup Guide

## 🚀 Quick Start (5 Minutes)

### Step 1: Set Up Supabase

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Once created, go to **Settings** → **API** and copy:

   - `URL` (Project URL)
   - `anon public` key
   - `service_role` key

3. Go to **SQL Editor** and run these migrations in order:
   - Copy and paste `supabase/migrations/001_initial_schema.sql` → Click RUN
   - Copy and paste `supabase/migrations/002_seed_data.sql` → Click RUN

### Step 2: Set Up TikTok Developer Account

1. Go to [TikTok Developers](https://developers.tiktok.com/)
2. Create a new app
3. Enable **Login Kit** in your app settings
4. Add redirect URI: `http://localhost:3000/api/auth/tiktok/callback`
5. Copy your **Client Key** and **Client Secret**

### Step 3: Configure Environment Variables

Create `.env.local` file:

```bash
cp .env.local.example .env.local
```

Edit `.env.local` with your credentials:

```env
# Supabase (from Step 1)
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...

# TikTok OAuth (from Step 2)
TIKTOK_CLIENT_KEY=your_client_key
TIKTOK_CLIENT_SECRET=your_client_secret
NEXT_PUBLIC_TIKTOK_REDIRECT_URI=http://localhost:3000/api/auth/tiktok/callback

# App (generate a random string)
NEXTAUTH_SECRET=your-random-secret-string
NEXTAUTH_URL=http://localhost:3000
```

### Step 4: Install and Run

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) 🎉

## 🎨 Optional: Generate PWA Icons

For a complete PWA experience, generate icon files:

```bash
# Using ImageMagick
convert -background none -resize 192x192 public/icon.svg public/icon-192x192.png
convert -background none -resize 384x384 public/icon.svg public/icon-384x384.png
convert -background none -resize 512x512 public/icon.svg public/icon-512x512.png
convert -background none -resize 180x180 public/icon.svg public/apple-touch-icon.png
```

Or use an online tool: https://realfavicongenerator.net/

## 🧪 Testing with Seed Data

The app comes with seed data for testing:

- **Sample Creators**: María González, Carlos Rodríguez, Ana Martínez, and more
- **Sample Videos**: With engagement metrics and thumbnails
- **Sample Products**: With prices, sales counts, and conversion rates

You can explore the dashboard without needing real TikTok API data.

## 🔧 Troubleshooting

### "Cannot find module" errors

```bash
rm -rf node_modules package-lock.json
npm install
```

### Supabase connection issues

- Check your environment variables are correct
- Verify Supabase project is active
- Check network/firewall settings

### TikTok OAuth not working

- Verify redirect URI matches exactly in TikTok Developer Portal
- Check client key/secret are correct
- Ensure you're using HTTP (not HTTPS) for localhost

### PWA not installing

- PWA only installs in production or when served over HTTPS
- For testing PWA locally, use `npm run build && npm start`

## 📱 Mobile Testing

To test on mobile:

1. Get your local IP: `ifconfig` (Mac/Linux) or `ipconfig` (Windows)
2. Update `NEXT_PUBLIC_TIKTOK_REDIRECT_URI` to use your IP
3. Update TikTok Developer Portal redirect URI
4. Access via `http://YOUR_IP:3000` on mobile

## 🚀 Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

Add environment variables in Vercel dashboard.

### Other Platforms

The app is a standard Next.js app and can be deployed to:

- Netlify
- AWS Amplify
- Railway
- Digital Ocean App Platform
- Self-hosted with Docker

## 📚 Next Steps

1. **Customize branding**: Update colors in `tailwind.config.ts`
2. **Add real data**: Implement TikTok API integrations in `lib/services/`
3. **Enhance analytics**: Add charts with Chart.js or Recharts
4. **Multi-language**: Add English translations
5. **Mobile app**: Wrap in React Native or Capacitor

## 🎯 MVP Limitations

Current limitations to be aware of:

- ✅ Uses mock/seed data for creators and videos
- ✅ Similarity algorithm is placeholder (needs ML implementation)
- ✅ TikTok API integration is basic (profile only)
- ✅ No real-time data updates (needs background jobs)
- ✅ Limited error handling (needs improvement for production)

These are intentional for MVP and can be enhanced based on user feedback.

## 💡 Tips

- **Session Cookie**: Uses httpOnly cookie for security
- **RLS Policies**: Supabase RLS ensures data isolation
- **Mobile-First**: UI designed for mobile, scales to desktop
- **TypeScript**: Fully typed for better DX
- **Extensible**: Modular architecture for easy feature additions

Enjoy building Academia! 🎓
