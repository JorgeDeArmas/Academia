# 🚀 Academia - Quick Reference

> One-page reference for developers working on Academia

## 📦 Essential Commands

```bash
# Development
npm run dev              # Start dev server (localhost:3000)
npm run build            # Build for production
npm run start            # Start production server
npm run lint             # Run ESLint

# Database (Supabase SQL Editor)
# 1. Copy supabase/migrations/001_initial_schema.sql
# 2. Copy supabase/migrations/002_seed_data.sql
```

## 🌳 Project Structure

```
app/
├── api/auth/           # Authentication endpoints
├── dashboard/          # Analytics dashboard
├── onboarding/         # User onboarding
└── page.tsx            # Landing page

lib/
├── services/           # Business logic
├── utils/              # Helper functions
├── translators/        # Localization
├── auth.ts             # Auth helpers
└── supabase.ts         # DB client

types/index.ts          # TypeScript types
proxy.ts                # Route protection
```

## 🔑 Environment Variables

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# TikTok OAuth
TIKTOK_CLIENT_KEY=
TIKTOK_CLIENT_SECRET=
NEXT_PUBLIC_TIKTOK_REDIRECT_URI=

# App
NEXTAUTH_SECRET=
NEXTAUTH_URL=
```

## 🛣️ Routes

| Route | Description | Protected |
|-------|-------------|-----------|
| `/` | Landing page | No |
| `/onboarding` | New user setup | Yes |
| `/dashboard` | Analytics dashboard | Yes |
| `/api/auth/tiktok` | OAuth start | No |
| `/api/auth/tiktok/callback` | OAuth callback | No |
| `/api/auth/logout` | Logout | No |
| `/api/onboarding` | Save onboarding | Yes |
| `/api/dashboard` | Fetch analytics | Yes |

## 💾 Database Tables

```sql
users               # Creator profiles
creators_similar    # Creator relationships
creator_videos      # Video analytics
video_products      # Product data
```

## 🎨 Key Components

### Landing Page
```typescript
// app/page.tsx
- Hero section
- Pain points
- Benefits
- Social proof
- CTA buttons
```

### Dashboard
```typescript
// app/dashboard/page.tsx
- User profile
- Similar creators grid
- Video cards with metrics
- Product cards with pricing
```

### Onboarding
```typescript
// app/onboarding/page.tsx
- Step 1: Name input
- Step 2: Category selection
- Progress bar
- Form validation
```

## 🔐 Authentication Flow

```typescript
// 1. Initiate OAuth
GET /api/auth/tiktok → Redirect to TikTok

// 2. Handle callback
GET /api/auth/tiktok/callback → Exchange token → Create user

// 3. Set session
Cookie: session={userId, tiktokUserId, accessToken}

// 4. Logout
POST /api/auth/logout → Clear cookie
```

## 🎨 Styling

### Tailwind Classes
```typescript
// Gradient
bg-gradient-to-r from-pink-500 to-purple-600

// Card
bg-white rounded-xl shadow-sm border border-gray-200

// Button
px-8 py-4 rounded-full font-semibold
```

### Colors
- Primary: Purple (`purple-600`)
- Secondary: Pink (`pink-500`)
- Text: Gray (`gray-900`, `gray-600`)
- Background: White/Gray (`gray-50`)

## 📱 Responsive Breakpoints

```css
sm:  640px   /* Tablet */
md:  768px   /* Desktop */
lg:  1024px  /* Large desktop */
xl:  1280px  /* Extra large */
```

## 🔧 Utility Functions

```typescript
// lib/utils/culturalFit.ts
calculateEngagementScore(views, likes, comments, shares)
calculateCulturalFit(creator)
findSimilarCreators(userId, limit)

// lib/translators/productAdapter.ts
formatCurrency(amount, currency)
translateToSpanish(text)
adaptForHispanicMarket(description)

// lib/services/productScoring.ts
calculateProductScore(sales, conversion, price)
rankProducts(products)
```

## 🗄️ Database Queries

```typescript
// Get user
supabase.from('users').select('*').eq('id', userId).single()

// Get similar creators
supabase.from('creators_similar')
  .select('similar_creator_id, similarity_score')
  .eq('user_id', userId)

// Get videos
supabase.from('creator_videos')
  .select('*')
  .eq('creator_id', creatorId)
  .order('view_count', { ascending: false })

// Get products
supabase.from('video_products')
  .select('*')
  .eq('video_id', videoId)
```

## 🐛 Common Issues

### Build Error
```bash
rm -rf .next node_modules
npm install
npm run build
```

### Environment Variables Not Loading
```bash
# Make sure file is named .env.local
# Restart dev server after changes
```

### TikTok OAuth Failed
```bash
# Check redirect URI matches exactly
# Verify client key/secret are correct
```

### Supabase Connection Error
```bash
# Verify environment variables
# Check Supabase project is active
# Review RLS policies
```

## 📊 Testing with Seed Data

```typescript
// Sample users
María González    (tiktok_001)  - Moda y Belleza
Carlos Rodríguez  (tiktok_002)  - Tecnología
Ana Martínez      (tiktok_003)  - Cocina

// Sample videos with products
Video 001: ¡Los mejores productos de maquillaje!
  - Labial Mate Rosa ($15.99)
  - Base de Maquillaje ($28.50)
```

## 🚀 Deployment Checklist

- [ ] Environment variables set
- [ ] Supabase migrations applied
- [ ] TikTok OAuth redirect URI updated
- [ ] Build succeeds locally
- [ ] PWA icons generated
- [ ] Test authentication flow
- [ ] Verify mobile responsiveness

## 📞 Quick Links

- [Next.js Docs](https://nextjs.org/docs)
- [Supabase Docs](https://supabase.com/docs)
- [TikTok Developers](https://developers.tiktok.com/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Vercel Deployment](https://vercel.com/docs)

## 💡 Pro Tips

1. **Use absolute imports**: `@/lib/supabase` instead of `../../lib/supabase`
2. **Check middleware**: Route protection in `proxy.ts`
3. **RLS policies**: Test data access with different users
4. **Mobile first**: Always test on mobile viewport
5. **Spanish content**: Keep all UI text in Spanish
6. **TypeScript**: Use proper types, avoid `any`
7. **Error handling**: Always wrap API calls in try-catch
8. **Loading states**: Show feedback for async operations

## 🎯 Quick Start (2 Minutes)

```bash
# 1. Clone/navigate to project
cd /home/pixelab/Academia

# 2. Install dependencies
npm install

# 3. Set up environment
cp .env.local.example .env.local
# Edit .env.local with your credentials

# 4. Start development
npm run dev

# 5. Open browser
http://localhost:3000
```

## 📝 Code Snippets

### Add New API Route
```typescript
// app/api/yourroute/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';

export async function GET(request: NextRequest) {
  const session = getSession(request);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  // Your logic here
  return NextResponse.json({ data: 'success' });
}
```

### Query Supabase
```typescript
import { supabase } from '@/lib/supabase';

const { data, error } = await supabase
  .from('your_table')
  .select('*')
  .eq('column', 'value')
  .single();
```

### Format Currency
```typescript
import { formatCurrency } from '@/lib/translators/productAdapter';

const price = formatCurrency(29.99, 'USD'); // "$29.99"
```

---

**Keep this reference handy while developing!** 📌
