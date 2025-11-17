import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const clientKey = process.env.TIKTOK_CLIENT_KEY;
  const redirectUri = process.env.NEXT_PUBLIC_TIKTOK_REDIRECT_URI;

  if (!clientKey || !redirectUri) {
    return NextResponse.json(
      { error: "TikTok OAuth not configured" },
      { status: 500 }
    );
  }

  // Generate CSRF token for security
  const csrfState = Math.random().toString(36).substring(2);

  // TikTok OAuth authorization URL - MUST include trailing slash per docs
  // https://developers.tiktok.com/doc/login-kit-web
  const authUrl = new URL("https://www.tiktok.com/v2/auth/authorize/");
  authUrl.searchParams.append("client_key", clientKey);
  // Use comma-separated scope format without spaces as per TikTok docs
  // user.info.basic: display_name, bio_description, open_id
  // user.info.profile: avatar_url, avatar_large_url, profile_deep_link
  // video.list: fetch user's videos
  authUrl.searchParams.append("scope", "user.info.basic,user.info.profile,video.list");
  authUrl.searchParams.append("response_type", "code");
  authUrl.searchParams.append("redirect_uri", redirectUri);
  authUrl.searchParams.append("state", csrfState);

  // Store CSRF state in cookie for verification
  const response = NextResponse.redirect(authUrl.toString());
  response.cookies.set("tiktok_csrf_state", csrfState, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 600, // 10 minutes
  });

  return response;
}
