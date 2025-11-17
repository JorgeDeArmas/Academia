import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  // This endpoint helps debug OAuth configuration issues
  // DO NOT expose in production - remove or protect this endpoint

  const config = {
    hasClientKey: !!process.env.TIKTOK_CLIENT_KEY,
    hasClientSecret: !!process.env.TIKTOK_CLIENT_SECRET,
    hasRedirectUri: !!process.env.NEXT_PUBLIC_TIKTOK_REDIRECT_URI,
    redirectUri: process.env.NEXT_PUBLIC_TIKTOK_REDIRECT_URI,
    clientKeyPrefix: process.env.TIKTOK_CLIENT_KEY?.substring(0, 4) + "...",
    nodeEnv: process.env.NODE_ENV,
  };

  return NextResponse.json(config);
}
