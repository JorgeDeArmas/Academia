# 🔍 Why It Works on One PC but Not Another

## The Most Likely Reason: SANDBOX TEST ACCOUNTS

Your app is in **SANDBOX mode**, which means TikTok OAuth **ONLY works with whitelisted test accounts**.

```
┌─────────────────────────────────────────────────────────────┐
│ Working PC (Vercel domain)                                   │
├─────────────────────────────────────────────────────────────┤
│ TikTok Account Logged In: test@example.com                  │
│ Whitelisted in Sandbox? ✅ YES                              │
│ Result: ✅ Login works!                                     │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ Failing PC (ngrok domain)                                    │
├─────────────────────────────────────────────────────────────┤
│ TikTok Account Logged In: different@email.com               │
│ Whitelisted in Sandbox? ❌ NO                               │
│ Result: ❌ unauthorized_client error                        │
└─────────────────────────────────────────────────────────────┘
```

## Quick Fix

### Option 1: Whitelist Your Test Account (Recommended for Development)

1. **Go to TikTok Developer Portal**

   - URL: https://developers.tiktok.com/apps/
   - Select: Academia Sandbox

2. **Click "Sandbox settings" in left sidebar**

3. **Add Test Account**

   - Find "Test accounts" section
   - Click "Add test account"
   - Enter the TikTok account email/phone you'll use on the failing PC
   - Send invitation
   - Accept the invitation from the TikTok app on your phone/device

4. **On the failing PC**
   - Go to tiktok.com
   - Log out of current account
   - Log in with the newly whitelisted test account
   - Try OAuth login again

### Option 2: Move to Production Mode (For Real Users)

If you want ANY TikTok user to log in (not just test accounts):

1. **Click "Production" tab** (next to "Sandbox" at the top)
2. **Fill out required info:**
   - App name
   - App description
   - Privacy policy URL (create one or use a generator)
   - Terms of service URL
   - App logo
3. **Submit for review**
4. **Wait for approval** (usually 1-3 days)
5. **Once approved:** Any TikTok user can log in!

## Verification Checklist

Before testing again, verify:

### ✅ In TikTok Developer Portal

- [ ] Clicked "Sandbox settings" in left sidebar
- [ ] "Test accounts" section shows your account(s)
- [ ] All redirect URIs are added in "Products" → "Login Kit"
- [ ] Clicked red "Apply changes" button
- [ ] Waited 10-15 minutes after applying changes

### ✅ On Your Failing PC

- [ ] Checked which TikTok account you're logged in with at tiktok.com
- [ ] That account is whitelisted in Sandbox settings
- [ ] Cleared browser cache/cookies (or use incognito mode)
- [ ] Dev server is running: `npm run dev`
- [ ] ngrok tunnel is running and URL matches .env.local

## Common Misunderstandings

### ❌ Myth: "Redirect URI is the problem"

Your screenshot shows all redirect URIs are correctly added. The issue is **NOT** the redirect URI.

### ✅ Reality: "Sandbox = Whitelisted Accounts Only"

Sandbox mode restricts OAuth to **only** the TikTok accounts you explicitly whitelist in "Sandbox settings" → "Test accounts".

Even with correct redirect URIs, if the TikTok account trying to log in is not whitelisted, you'll get `unauthorized_client`.

## How to Debug

### Step 1: Check which account is logged in

On the failing PC:

```bash
# Open browser and go to:
https://www.tiktok.com

# Check top-right corner - which account are you logged in with?
# Note the username or email
```

### Step 2: Check TikTok Developer Portal

```
TikTok Developer Portal → Academia Sandbox → Sandbox settings → Test accounts

Do you see the account from Step 1 listed here?
- YES → Wait 15 mins after adding, then try again
- NO → Add it now, accept invitation, then try again
```

### Step 3: Test in Incognito Mode

```bash
# This ensures no cached auth state
1. Open incognito/private browser window
2. Go to: https://subsocial-justice-detersively.ngrok-free.dev
3. Click "Login with TikTok"
4. When TikTok login page appears, log in with WHITELISTED account
5. Authorize the app
```

## Why Vercel Works But ngrok Doesn't

This is **NOT** about the domain/URL. Both domains work fine (you added both to redirect URIs).

The difference is:

- **Working PC with Vercel URL**: Logged into whitelisted TikTok test account
- **Failing PC with ngrok URL**: Logged into a DIFFERENT TikTok account that's NOT whitelisted

To prove this:

- Try accessing Vercel URL from the failing PC → Will likely fail too
- Try accessing ngrok URL from the working PC → Will likely work

## Screenshot Request

To confirm the diagnosis, can you provide a screenshot of:

1. **TikTok Developer Portal**

   - Navigate to: Academia Sandbox → Sandbox settings
   - Show the "Test accounts" section
   - (We need to see which accounts are whitelisted)

2. **TikTok Account on Failing PC**
   - Go to tiktok.com on the failing PC
   - Show which account you're logged in as (top-right corner)
   - (Can blur sensitive info, just need to confirm account email/username)

## Production vs Sandbox Comparison

| Feature          | Sandbox Mode                   | Production Mode       |
| ---------------- | ------------------------------ | --------------------- |
| Who can log in?  | Only whitelisted test accounts | Any TikTok user       |
| Approval needed? | No                             | Yes (1-3 days review) |
| Good for?        | Development & testing          | Real users            |
| Redirect URIs?   | Must whitelist                 | Must whitelist        |
| Test accounts?   | Must manually add              | Not needed            |

## Quick Commands

```bash
# Validate your configuration
./scripts/validate-tiktok.sh

# Run sandbox diagnostic
./scripts/diagnose-sandbox.sh

# Check if dev server sees correct env
cd /home/pixelab/Academia
grep TIKTOK .env.local

# Restart everything fresh
# 1. Stop dev server (Ctrl+C)
# 2. Stop ngrok (Ctrl+C)
# 3. Clear browser cache
# 4. Start ngrok: ngrok http 3000
# 5. Update .env.local if ngrok URL changed
# 6. Start dev: npm run dev
# 7. Test in incognito with whitelisted account
```

## Next Steps

**Most likely fix:** Add your TikTok test account to Sandbox settings

1. Go to https://developers.tiktok.com/apps/
2. Click: Academia Sandbox → Sandbox settings
3. Add test account (the TikTok account you use on the failing PC)
4. Accept invitation
5. Wait 10-15 minutes
6. Try login again in incognito mode

**If you need any TikTok user to log in:** Move to Production mode and submit for review.

Let me know:

1. Which TikTok account are you logged in with on the failing PC?
2. Is that account listed in Sandbox settings → Test accounts?
3. Did you click "Apply changes" after adding redirect URIs?
