## Plan: Build Academia MVP for Hispanic TikTok Shop Creators

Build a Next.js 14 + Supabase + TikTok OAuth web app/PWA that helps Hispanic TikTok Shop creators discover similar creators, their top-performing videos, and featured products. Includes landing page, authentication flow, creator onboarding, and analytics dashboard with mobile-first UI and extensible architecture for future features.

### Steps

1. **Initialize Next.js 14 project** with TypeScript, Tailwind CSS, App Router structure, and install dependencies (Supabase client, TikTok OAuth libraries, PWA plugins)

2. **Set up Supabase infrastructure** including database schema migrations for `users`, `creators_similar`, `creator_videos`, and `video_products` tables with proper foreign keys and indexes

3. **Implement TikTok Login Kit OAuth flow** with authorization URL generation in `/api/auth/tiktok`, callback handler in `/api/auth/tiktok/callback` for token exchange, and Supabase session management

4. **Build landing page** at `/` with hero section highlighting Hispanic creator pain points, benefit sections, social proof placeholders, and "Login with TikTok" CTA button all in Spanish language

5. **Create onboarding flow** at `/onboarding` to collect user name, language preference (Spanish), and creator category, storing data in Supabase `users` table

6. **Build dashboard** at `/dashboard` displaying similar Hispanic creators grid, expandable cards showing each creator's top videos with thumbnails/engagement metrics, and product cards under each video showing image/price/performance data

7. **Configure PWA support** with `manifest.json`, service worker for offline fallback, app icons at multiple resolutions, and Next.js PWA plugin configuration

8. **Create extensible architecture** with modular structure: `/lib/services/` for future product scoring/trend analysis, `/lib/utils/` for cultural fit algorithms, `/lib/translators/` for product description adaptation, and TypeScript interfaces in `/types/` to support future features

### Further Considerations

1. **TikTok API Data Source**: Will you use TikTok Research API, Content Posting API, or mock data for the MVP? TikTok Login Kit only provides basic profile info - you may need TikTok for Business API access for creator/video/product analytics.

2. **"Similar Creators" Algorithm**: Should the MVP use mock data, or do you have access to TikTok creator graph data? Consider starting with manual curator lists or basic category matching.

3. **Deployment Environment Variables**: Confirm you have TikTok Developer Account with Client Key/Secret, and Supabase project URL/anon key ready for configuration.
