# TikTok OAuth Setup Guide

## Current Issue: `unauthorized_client` Error

When you see this error:

```
error=unauthorized_client&error_type=client_key
```

It means your redirect URI is **NOT whitelisted** in your TikTok app settings.

## Fix Steps

### 1. Go to TikTok Developer Portal

- URL: https://developers.tiktok.com/apps/
- Log in with your TikTok developer account

### 2. Select Your App

- Find the app with Client Key: `sbawd3rphncujty972`
- Click to open app settings

### 3. Configure Redirect URIs

Find the "Login Kit" section and add these redirect URIs:

#### For ngrok (current):

```
https://subsocial-justice-detersively.ngrok-free.dev/api/auth/tiktok/callback
```

**AND/OR** add just the domain (some TikTok apps require this):

```
subsocial-justice-detersively.ngrok-free.dev
```

#### For Vercel (production):

```
https://academia-blond-chi.vercel.app/api/auth/tiktok/callback
```

**AND/OR** add just the domain:

```
academia-blond-chi.vercel.app
```

#### For local testing (optional):

```
http://localhost:3000/api/auth/tiktok/callback
```

OR just:

```
localhost
```

### 4. Save and Wait

- Click "Save" or "Submit"
- TikTok may take 5-10 minutes to propagate settings (usually instant)

### 5. Verify App Status

- Ensure app is in "Live" or "Sandbox" mode (not "Draft")
- If sandbox, verify your test TikTok account is whitelisted

## Better Solution: Use Static ngrok Domain

Free ngrok tunnels change URLs every restart. Get a free static domain:

1. Sign up at https://ngrok.com (free)
2. Get your static domain (e.g., `your-app.ngrok-free.app`)
3. Start ngrok with your static domain:
   ```bash
   ngrok http 3000 --domain=your-app.ngrok-free.app
   ```
4. Add `https://your-app.ngrok-free.app/api/auth/tiktok/callback` to TikTok once
5. Never change it again!

## Environment Variables Reference

Your current `.env.local`:

```bash
TIKTOK_CLIENT_KEY=sbawd3rphncujty972
TIKTOK_CLIENT_SECRET=xDLbvHzivGkuLd57aemxO3sCNETE0j6n
NEXT_PUBLIC_TIKTOK_REDIRECT_URI=https://subsocial-justice-detersively.ngrok-free.dev/api/auth/tiktok/callback
```

Make sure:

- `NEXT_PUBLIC_TIKTOK_REDIRECT_URI` matches the URL in TikTok app settings **EXACTLY**
- Include or exclude trailing slash consistently
- Use the same protocol (http vs https)

## Testing Checklist

After updating TikTok app settings:

1. Clear browser cache/cookies
2. Restart your Next.js dev server:
   ```bash
   npm run dev
   ```
3. Start ngrok (use same subdomain if possible):
   ```bash
   ngrok http 3000
   ```
4. Update `.env.local` with the ngrok URL if changed
5. Restart dev server again
6. Try login: `https://your-ngrok-url.ngrok-free.dev`

## Common Mistakes

❌ **Don't:**

- Use different redirect URIs in `.env.local` vs TikTok portal
- Forget to add the domain itself (some apps need both URI + domain)
- Use http for production (TikTok requires https)
- Change ngrok URL without updating TikTok settings

✅ **Do:**

- Add ALL redirect URIs you'll use (local, ngrok, Vercel)
- Use a static ngrok domain for consistent testing
- Wait 5-10 min after updating TikTok settings before testing
- Check TikTok app is "Live" or "Sandbox" (not draft)

## Need Help?

If you still see `unauthorized_client` after following these steps:

1. Double-check the redirect URI in TikTok portal **exactly** matches your `.env.local`
2. Verify app status (Live/Sandbox, not Draft)
3. For sandbox apps: ensure your TikTok account is added as a test user
4. Try adding just the domain (without path) in addition to the full URI
5. Check Vercel environment variables match production settings

## Sandbox vs Production

**Sandbox apps:**

- Only work with whitelisted test TikTok accounts
- May have stricter redirect URI rules
- Useful for testing without publishing

**Production apps:**

- Work with any TikTok account
- Require app review and approval
- Need privacy policy and terms of service URLs

Check which mode your app is in and ensure it matches your needs.
