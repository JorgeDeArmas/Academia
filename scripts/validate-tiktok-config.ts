#!/usr/bin/env tsx
/**
 * TikTok OAuth Configuration Validator
 *
 * This script validates your TikTok OAuth setup and provides
 * actionable steps to fix common issues.
 */

// Environment variables are already loaded by Next.js
// This script reads from process.env which Next.js populates from .env.local

interface ValidationResult {
  status: "pass" | "fail" | "warning";
  message: string;
  action?: string;
}

const results: ValidationResult[] = [];

console.log("\n🔍 TikTok OAuth Configuration Validator\n");
console.log("=".repeat(60));

// Check 1: Client Key
const clientKey = process.env.TIKTOK_CLIENT_KEY;
if (!clientKey) {
  results.push({
    status: "fail",
    message: "TIKTOK_CLIENT_KEY is missing",
    action: "Add TIKTOK_CLIENT_KEY to your .env.local file",
  });
} else {
  results.push({
    status: "pass",
    message: `TIKTOK_CLIENT_KEY found: ${clientKey.substring(0, 8)}...`,
  });
}

// Check 2: Client Secret
const clientSecret = process.env.TIKTOK_CLIENT_SECRET;
if (!clientSecret) {
  results.push({
    status: "fail",
    message: "TIKTOK_CLIENT_SECRET is missing",
    action: "Add TIKTOK_CLIENT_SECRET to your .env.local file",
  });
} else {
  results.push({
    status: "pass",
    message: `TIKTOK_CLIENT_SECRET found: ${clientSecret.substring(0, 8)}...`,
  });
}

// Check 3: Redirect URI
const redirectUri = process.env.NEXT_PUBLIC_TIKTOK_REDIRECT_URI;
if (!redirectUri) {
  results.push({
    status: "fail",
    message: "NEXT_PUBLIC_TIKTOK_REDIRECT_URI is missing",
    action: "Add NEXT_PUBLIC_TIKTOK_REDIRECT_URI to your .env.local file",
  });
} else {
  results.push({
    status: "pass",
    message: `Redirect URI: ${redirectUri}`,
  });

  // Check redirect URI format
  try {
    const url = new URL(redirectUri);

    if (url.protocol === "http:" && !url.hostname.includes("localhost")) {
      results.push({
        status: "warning",
        message: "Using HTTP for non-localhost redirect URI",
        action:
          "TikTok requires HTTPS for production. Use ngrok or deploy to Vercel.",
      });
    }

    if (!url.pathname.endsWith("/callback")) {
      results.push({
        status: "warning",
        message: "Redirect URI does not end with /callback",
        action: "Verify this matches your route structure",
      });
    }

    // Extract domain for TikTok portal
    const domain = url.hostname;
    results.push({
      status: "pass",
      message: `Extracted domain: ${domain}`,
    });
  } catch (err) {
    results.push({
      status: "fail",
      message: "NEXT_PUBLIC_TIKTOK_REDIRECT_URI is not a valid URL",
      action: "Fix the redirect URI format in .env.local",
    });
  }
}

// Check 4: ngrok detection
if (redirectUri?.includes(".ngrok")) {
  results.push({
    status: "warning",
    message: "Using ngrok tunnel (URL changes on restart)",
    action:
      "Consider getting a free static ngrok domain: https://ngrok.com/docs/agent/config/#connect-token",
  });
}

// Check 5: Trailing slash check
if (redirectUri && !redirectUri.endsWith("/")) {
  results.push({
    status: "warning",
    message: "Redirect URI has no trailing slash",
    action:
      "TikTok docs mention trailing slashes. Ensure TikTok portal matches exactly (with or without).",
  });
}

// Print results
console.log("\n📋 Validation Results:\n");

for (const result of results) {
  const emoji =
    result.status === "pass" ? "✅" : result.status === "warning" ? "⚠️" : "❌";
  console.log(`${emoji} ${result.message}`);
  if (result.action) {
    console.log(`   → ${result.action}\n`);
  }
}

// Summary
const failures = results.filter((r) => r.status === "fail").length;
const warnings = results.filter((r) => r.status === "warning").length;

console.log("\n" + "=".repeat(60));
console.log(`\n📊 Summary: ${failures} failures, ${warnings} warnings\n`);

if (failures > 0) {
  console.log(
    "❌ Configuration has critical issues. Fix the failures above.\n"
  );
  process.exit(1);
}

if (warnings > 0) {
  console.log("⚠️  Configuration has warnings. Review them carefully.\n");
}

// Instructions
console.log("📝 Next Steps:\n");
console.log(
  "1. Go to TikTok Developer Portal: https://developers.tiktok.com/apps/"
);
console.log(`2. Select app with Client Key: ${clientKey?.substring(0, 8)}...`);
console.log('3. In "Login Kit" settings, add these redirect URIs:\n');

if (redirectUri) {
  try {
    const url = new URL(redirectUri);
    console.log(`   Full URI: ${redirectUri}`);
    console.log(`   Domain only: ${url.hostname}`);
    console.log(
      "\n   (TikTok may require one or both - add both to be safe)\n"
    );
  } catch {}
}

console.log("4. Save settings and wait 5-10 minutes for propagation");
console.log('5. Ensure app status is "Live" or "Sandbox" (not "Draft")');
console.log("6. For sandbox apps: add your test TikTok account");
console.log("7. Restart your dev server: npm run dev");
console.log("8. Test login again\n");

console.log("💡 Tip: Run this script anytime with: npm run validate:tiktok\n");
