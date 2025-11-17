# Similar Creators Feature - Setup Guide

## Overview

The Similar Creators feature allows users to discover other TikTok creators in their category who speak the same language. It integrates with the EchoTik API to fetch real creator data and displays it in TikTok-style cards.

## Architecture

```
User → /similar-creators page
  ↓
  → API Route: /api/similar-creators
    ↓
    → Supabase Edge Function: fetch-similar-creators
      ↓
      → EchoTik API (https://open.echotik.live/api/v2/influencer/listV2)
        ↓
        → Save to Supabase: echotik_creators table
          ↓
          → Return creators to user
```

## Files Created

### 1. Database Migration

- **File**: `supabase/migrations/003_echotik_creators.sql`
- **Purpose**: Creates the `echotik_creators` table with all fields from EchoTik API
- **Key Fields**:
  - Basic info: `user_id`, `unique_id`, `nick_name`, `avatar`, `category`
  - Followers: `total_followers_cnt`, growth metrics
  - Engagement: `total_views_cnt`, `total_digg_cnt`, `interaction_rate`
  - Sales: `total_sale_gmv_30d_amt`, `avg_30d_price`, `ec_score`
  - Products: `total_product_cnt`, `most_category_product`

### 2. Supabase Edge Function

- **File**: `supabase/functions/fetch-similar-creators/index.ts`
- **Purpose**: Fetches creators from EchoTik API and saves to database
- **Authentication**: Uses `ECHOTIK_USER` and `ECHOTIK_PASS` env vars
- **Parameters**:
  - `category`: Creator category (e.g., "Beauty")
  - `region`: Region code (default: "US")
  - `language`: Language code (default: "es")
  - `pageNum`: Page number (1-based)
  - `pageSize`: Items per page (max 10)

### 3. Next.js API Route

- **File**: `app/api/similar-creators/route.ts`
- **Purpose**: Backend API that calls edge function and returns creators
- **Features**:
  - Session authentication
  - Automatic category/language detection from logged-in user
  - Optional refresh parameter to fetch fresh data
  - Pagination support
  - Fetches from database (fast) or EchoTik API (fresh data)

### 4. Creator Card Component

- **File**: `components/CreatorCard.tsx`
- **Purpose**: TikTok-style card displaying creator stats
- **Features**:
  - Avatar with EC score badge
  - Followers count
  - GMV (30-day)
  - Video count
  - Engagement rate
  - Category badge
  - Hover effects
  - Links to creator detail page

### 5. Similar Creators Page

- **File**: `app/similar-creators/page.tsx`
- **Purpose**: Main dashboard showing grid of similar creators
- **Features**:
  - Responsive grid layout (1-4 columns)
  - Loading states
  - Error handling
  - Refresh button (fetches fresh data from EchoTik)
  - Pagination
  - Back to dashboard button

## Setup Instructions

### Step 1: Apply Database Migration

Go to your Supabase project → SQL Editor:

```sql
-- Copy and paste the contents of:
-- supabase/migrations/003_echotik_creators.sql
-- Then click RUN
```

This creates the `echotik_creators` table.

### Step 2: Deploy Edge Function

```bash
# Install Supabase CLI if not installed
npm install -g supabase

# Login to Supabase
supabase login

# Link to your project
supabase link --project-ref YOUR_PROJECT_REF

# Deploy the edge function
supabase functions deploy fetch-similar-creators

# Set environment variables for the edge function
supabase secrets set ECHOTIK_USER=250917379495015668
supabase secrets set ECHOTIK_PASS=85accfd27c924936afb2fa7dfd328695
```

### Step 3: Test the Feature

1. **Login to your app** via TikTok OAuth

2. **Complete onboarding** (select a category like "Beauty")

3. **Navigate to** `/similar-creators` or add a link from your dashboard

4. **Click "Actualizar"** to fetch fresh creators from EchoTik

5. **Browse creators** - click on any card to view details (details page coming next)

## API Endpoints

### EchoTik API

```
GET https://open.echotik.live/api/v2/influencer/listV2
Headers:
  User: 250917379495015668
  Pass: 85accfd27c924936afb2fa7dfd328695
Query Params:
  influencer_category_name: Beauty
  region: US
  language: es
  page_num: 1
  page_size: 10
```

### Your API

```
GET /api/similar-creators
Query Params:
  - refresh: true/false (optional) - fetch fresh data
  - page: 1-n (optional) - page number
  - pageSize: 1-10 (optional) - items per page
Headers:
  Cookie: session (auto-sent by browser)
```

### Edge Function

```
POST https://YOUR_PROJECT.supabase.co/functions/v1/fetch-similar-creators
Headers:
  Authorization: Bearer YOUR_ANON_KEY
  apikey: YOUR_ANON_KEY
  Content-Type: application/json
Body:
  {
    "category": "Beauty",
    "region": "US",
    "language": "es",
    "pageNum": 1,
    "pageSize": 10
  }
```

## Data Flow

### First Time (No Cache)

1. User visits `/similar-creators`
2. No creators in database yet
3. Click "Actualizar" button
4. API calls edge function with `refresh=true`
5. Edge function fetches from EchoTik API
6. Edge function saves to `echotik_creators` table
7. API reads from database
8. Cards displayed to user

### Subsequent Visits (Cached)

1. User visits `/similar-creators`
2. API reads from database (fast)
3. Cards displayed immediately
4. User can click "Actualizar" to refresh data

## Environment Variables

Make sure these are set in your `.env.local`:

```bash
# Existing vars
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...

# EchoTik API (already in your .env.local)
ECHOTIK_USER=250917379495015668
ECHOTIK_PASS=85accfd27c924936afb2fa7dfd328695
```

## Features Implemented

✅ Database schema for EchoTik creator data  
✅ Supabase Edge Function to fetch from EchoTik API  
✅ Next.js API route with auth & pagination  
✅ TikTok-style creator cards  
✅ Responsive grid layout  
✅ Refresh functionality  
✅ Pagination  
✅ Loading & error states  
✅ Category filtering based on logged-in user

## Next Steps

After testing this dashboard, we'll implement:

1. **Creator Detail Page** (`/creators/[userId]`)

   - Best performing videos
   - Sortable by views, likes, GMV
   - Product details for each video
   - Additional endpoint: `/api/v2/influencer/videoList`

2. **Video Details** endpoint integration

3. **Product Details** for each video

## Troubleshooting

### Edge Function Not Working

```bash
# Check edge function logs
supabase functions logs fetch-similar-creators

# Verify secrets are set
supabase secrets list

# Test edge function directly
curl -X POST \
  https://YOUR_PROJECT.supabase.co/functions/v1/fetch-similar-creators \
  -H "Authorization: Bearer YOUR_ANON_KEY" \
  -H "apikey: YOUR_ANON_KEY" \
  -H "Content-Type: application/json" \
  -d '{"category":"Beauty","region":"US","language":"es","pageNum":1,"pageSize":10}'
```

### No Creators Showing

1. Check if migration was applied: Supabase → Database → Tables → `echotik_creators`
2. Click "Actualizar" to fetch data
3. Check browser console for errors
4. Check Next.js server logs

### Authentication Errors

- Make sure you're logged in via TikTok OAuth
- Check that session cookie is set
- Verify user has a category set (complete onboarding)

## Testing Checklist

- [ ] Database migration applied successfully
- [ ] Edge function deployed
- [ ] Environment variables set
- [ ] Login with TikTok works
- [ ] Onboarding completed with category selected
- [ ] Similar creators page loads
- [ ] "Actualizar" button fetches creators
- [ ] Creator cards display correctly
- [ ] Stats show proper formatting (K, M for numbers)
- [ ] GMV displays as currency
- [ ] Pagination works
- [ ] Clicking card goes to `/creators/[userId]`
- [ ] Responsive layout works on mobile

## Ready to Test!

Once you've completed the setup steps, visit:

```
http://localhost:3000/similar-creators
```

Click "Actualizar" to fetch similar creators in your category!
