# Supabase Database Setup

This directory contains SQL migrations for the Academia database schema.

## Migrations

1. `001_initial_schema.sql` - Creates the core database schema with tables, indexes, RLS policies
2. `002_seed_data.sql` - Seeds the database with sample Hispanic creator data for testing

## How to Apply Migrations

### Option 1: Using Supabase Dashboard
1. Go to your Supabase project dashboard
2. Navigate to SQL Editor
3. Copy and paste the contents of each migration file
4. Execute them in order

### Option 2: Using Supabase CLI
```bash
# Install Supabase CLI
npm install -g supabase

# Login to Supabase
supabase login

# Link to your project
supabase link --project-ref your-project-ref

# Apply migrations
supabase db push
```

## Schema Overview

### Tables

- **users**: TikTok creator profiles with authentication details
- **creators_similar**: Relationships between creators and their similar peers
- **creator_videos**: TikTok videos with engagement metrics
- **video_products**: Products featured in videos with performance data

### Row Level Security

All tables have RLS enabled with policies to ensure:
- Users can only access their own data
- Users can view similar creators and their content
- Products are accessible based on video visibility

## Testing

After applying migrations, you can test with the sample data provided in `002_seed_data.sql`.
