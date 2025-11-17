#!/bin/bash
# TikTok OAuth Configuration Validator
# Quick validation script to check your TikTok OAuth setup

set -e

echo ""
echo "🔍 TikTok OAuth Configuration Validator"
echo ""
echo "============================================================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Load .env.local
if [ ! -f .env.local ]; then
    echo -e "${RED}❌ .env.local file not found${NC}"
    echo "   → Create .env.local in the project root"
    exit 1
fi

# Source env file (only export NEXT_PUBLIC and TIKTOK vars)
export $(grep -E '^(NEXT_PUBLIC_|TIKTOK_)' .env.local | xargs)

echo ""
echo "📋 Validation Results:"
echo ""

# Check 1: Client Key
if [ -z "$TIKTOK_CLIENT_KEY" ]; then
    echo -e "${RED}❌ TIKTOK_CLIENT_KEY is missing${NC}"
    echo "   → Add TIKTOK_CLIENT_KEY to your .env.local file"
    echo ""
else
    echo -e "${GREEN}✅ TIKTOK_CLIENT_KEY found: ${TIKTOK_CLIENT_KEY:0:8}...${NC}"
fi

# Check 2: Client Secret
if [ -z "$TIKTOK_CLIENT_SECRET" ]; then
    echo -e "${RED}❌ TIKTOK_CLIENT_SECRET is missing${NC}"
    echo "   → Add TIKTOK_CLIENT_SECRET to your .env.local file"
    echo ""
else
    echo -e "${GREEN}✅ TIKTOK_CLIENT_SECRET found: ${TIKTOK_CLIENT_SECRET:0:8}...${NC}"
fi

# Check 3: Redirect URI
if [ -z "$NEXT_PUBLIC_TIKTOK_REDIRECT_URI" ]; then
    echo -e "${RED}❌ NEXT_PUBLIC_TIKTOK_REDIRECT_URI is missing${NC}"
    echo "   → Add NEXT_PUBLIC_TIKTOK_REDIRECT_URI to your .env.local file"
    echo ""
    exit 1
else
    echo -e "${GREEN}✅ Redirect URI: ${NEXT_PUBLIC_TIKTOK_REDIRECT_URI}${NC}"
    
    # Extract domain
    DOMAIN=$(echo "$NEXT_PUBLIC_TIKTOK_REDIRECT_URI" | sed -E 's|^https?://([^/]+).*|\1|')
    echo -e "${GREEN}✅ Extracted domain: ${DOMAIN}${NC}"
    
    # Check for ngrok
    if [[ "$NEXT_PUBLIC_TIKTOK_REDIRECT_URI" == *".ngrok"* ]]; then
        echo -e "${YELLOW}⚠️  Using ngrok tunnel (URL changes on restart)${NC}"
        echo "   → Consider getting a free static ngrok domain: ngrok.com"
        echo ""
    fi
    
    # Check for http (non-localhost)
    if [[ "$NEXT_PUBLIC_TIKTOK_REDIRECT_URI" == "http://"* ]] && [[ ! "$NEXT_PUBLIC_TIKTOK_REDIRECT_URI" == *"localhost"* ]]; then
        echo -e "${YELLOW}⚠️  Using HTTP for non-localhost redirect URI${NC}"
        echo "   → TikTok requires HTTPS for production"
        echo ""
    fi
    
    # Check trailing slash
    if [[ ! "$NEXT_PUBLIC_TIKTOK_REDIRECT_URI" == */ ]]; then
        echo -e "${YELLOW}⚠️  Redirect URI has no trailing slash${NC}"
        echo "   → Ensure TikTok portal matches exactly (with or without)"
        echo ""
    fi
fi

echo "============================================================"
echo ""
echo "📝 Next Steps:"
echo ""
echo "1. Go to TikTok Developer Portal:"
echo "   https://developers.tiktok.com/apps/"
echo ""
echo "2. Select app with Client Key: ${TIKTOK_CLIENT_KEY:0:8}..."
echo ""
echo "3. In 'Login Kit' settings, add BOTH of these:"
echo ""
echo "   Full URI:"
echo "   ${NEXT_PUBLIC_TIKTOK_REDIRECT_URI}"
echo ""
echo "   Domain only:"
echo "   ${DOMAIN}"
echo ""
echo "   (TikTok may require one or both - add both to be safe)"
echo ""
echo "4. Save settings and wait 5-10 minutes"
echo "5. Ensure app status is 'Live' or 'Sandbox' (not 'Draft')"
echo "6. For sandbox apps: add your test TikTok account"
echo "7. Restart dev server: npm run dev"
echo "8. Test login again"
echo ""
echo "💡 Tip: Run this anytime with: ./scripts/validate-tiktok.sh"
echo ""
