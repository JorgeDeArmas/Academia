# Academia - TikTok Shop for Hispanic Creators

A Next.js 14 + Supabase PWA that helps Hispanic TikTok Shop creators discover similar creators, analyze their top-performing videos, and find featured products that drive sales.

## 🚀 Features

- **TikTok OAuth Authentication** - Secure login with TikTok Login Kit
- **Similar Creator Discovery** - Find and analyze creators in your niche
- **Video Analytics** - View engagement metrics and performance data
- **Product Insights** - Discover which products are selling best
- **Mobile-First PWA** - Install as an app on any device
- **Spanish Language** - Built specifically for the Hispanic market

## 🏗️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Database**: Supabase (PostgreSQL)
- **Styling**: Tailwind CSS
- **Auth**: TikTok OAuth 2.0
- **PWA**: next-pwa
- **Language**: TypeScript

## 📋 Prerequisites

Before you begin, ensure you have:

- Node.js 18+ installed
- A Supabase account and project
- A TikTok Developer account with OAuth credentials

## 🛠️ Installation

1. **Clone the repository**

   ```bash
   cd /home/pixelab/Academia
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   Copy `.env.local.example` to `.env.local`:

   ```bash
   cp .env.local.example .env.local
   ```

   Fill in your credentials:

   ```env
   # Supabase
   NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

   # TikTok OAuth
   TIKTOK_CLIENT_KEY=your-tiktok-client-key
   TIKTOK_CLIENT_SECRET=your-tiktok-client-secret
   NEXT_PUBLIC_TIKTOK_REDIRECT_URI=http://localhost:3000/api/auth/tiktok/callback
   ```

4. **Set up Supabase database**

   Apply the migrations in order:

   ```bash
   # Copy and paste the contents of these files into Supabase SQL Editor:
   # 1. supabase/migrations/001_initial_schema.sql
   # 2. supabase/migrations/002_seed_data.sql
   ```

   See `supabase/README.md` for detailed instructions.

5. **Generate PWA icons**

   Follow instructions in `public/ICONS_README.md` to generate icon files.

## 🚀 Running the App

### Development Mode

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build

```bash
npm run build
npm start
```

## ☁️ Deploying to Vercel

1. **Import the repo** – In the Vercel dashboard click _Add New Project_ → _Import Git Repository_ and select this repository.
2. **Set environment variables** – In Project Settings → _Environment Variables_, add every key from `.env.local.example`. For production deployments set `NEXT_PUBLIC_TIKTOK_REDIRECT_URI` and `NEXTAUTH_URL` to your final HTTPS domain, e.g. `https://academia.vercel.app`.
3. **Update TikTok Redirect URI** – In the TikTok Developer Portal add the same HTTPS callback (`https://your-domain.vercel.app/api/auth/tiktok/callback`) to the Redirect URI list so sandbox/production flows accept it.
4. **Redeploy** – Trigger a deploy from the Vercel dashboard or push to the connected branch. After the first deploy, you can run `npx vercel env pull .env.local` to sync values to your local machine.

Once deployed, tests like OAuth will hit the hosted domain, so remember to refresh the TikTok app settings whenever your Vercel URL changes (custom domain recommended for stability).

## 📁 Project Structure

```
Academia/
├── app/                      # Next.js App Router
│   ├── api/                  # API routes
│   │   ├── auth/            # Authentication endpoints
│   │   ├── dashboard/       # Dashboard data API
│   │   └── onboarding/      # Onboarding API
│   ├── dashboard/           # Dashboard page
│   ├── onboarding/          # Onboarding flow
│   ├── layout.tsx           # Root layout
│   └── page.tsx             # Landing page
├── lib/                      # Utilities and services
│   ├── services/            # Business logic services
│   │   ├── productScoring.ts
│   │   └── trendAnalysis.ts
│   ├── utils/               # Utility functions
│   │   └── culturalFit.ts
│   ├── translators/         # Translation adapters
│   │   └── productAdapter.ts
│   ├── auth.ts              # Auth helpers
│   └── supabase.ts          # Supabase client
├── types/                    # TypeScript types
│   └── index.ts
├── supabase/                 # Database migrations
│   ├── migrations/
│   └── README.md
├── public/                   # Static assets
│   ├── manifest.json        # PWA manifest
│   └── icon.svg             # App icon
└── next.config.ts           # Next.js configuration
```

## 🗄️ Database Schema

### Tables

- **users** - TikTok creator profiles
- **creators_similar** - Similarity relationships between creators
- **creator_videos** - Video content with engagement metrics
- **video_products** - Products featured in videos with performance data

See `supabase/migrations/001_initial_schema.sql` for the complete schema.

## 🔐 Authentication Flow

1. User clicks "Login with TikTok"
2. Redirected to TikTok OAuth consent screen
3. After authorization, callback receives auth code
4. Exchange code for access token
5. Fetch user profile from TikTok API
6. Create/update user in Supabase
7. Set session cookie
8. Redirect to dashboard or onboarding

## 📱 PWA Features

- Installable on mobile and desktop
- Offline-ready with service worker
- App-like experience
- Custom splash screen
- Responsive design

## 🌐 TikTok API Integration

The app uses TikTok's OAuth 2.0 flow with the following scopes:

- `user.info.basic` - Basic profile information
- `video.list` - Access to user's video list

**Note**: For production use with real creator/video/product data, you'll need access to:

- TikTok Research API
- TikTok Content Posting API
- TikTok for Business API

## 🔮 Future Enhancements

The architecture supports easy extension for:

- **Advanced Analytics** - Trend detection and performance prediction
- **Product Recommendations** - ML-based product suggestions
- **Cultural Adaptation** - Enhanced Spanish localization
- **Collaboration Tools** - Creator networking features
- **Revenue Tracking** - Sales and commission analytics

## 📝 Development Notes

### Mock Data

The MVP uses seed data (`002_seed_data.sql`) for demonstration. To use real data:

1. Implement TikTok API integrations in `lib/services/`
2. Create background jobs to fetch and update creator/video data
3. Implement similarity algorithm in `lib/utils/culturalFit.ts`

### Environment Considerations

- **TikTok Developer Account**: Required for OAuth credentials
- **API Access**: TikTok API access may require business approval
- **Rate Limits**: Consider TikTok API rate limits for production

## 🐛 Troubleshooting

### TikTok OAuth Issues

- Verify redirect URI matches in TikTok Developer Portal
- Check that client key/secret are correct
- Ensure callback URL is accessible

### Supabase Connection

- Verify environment variables are set correctly
- Check Supabase project is active
- Confirm RLS policies are properly configured

### PWA Not Installing

- Must be served over HTTPS in production
- Check manifest.json is accessible at `/manifest.json`
- Verify service worker is registered

## 📄 License

MIT

## 🤝 Contributing

This is an MVP. Contributions to extend functionality are welcome!

## 📞 Support

For issues related to:

- TikTok API: See [TikTok Developers](https://developers.tiktok.com/)
- Supabase: See [Supabase Docs](https://supabase.com/docs)
- Next.js: See [Next.js Docs](https://nextjs.org/docs)
