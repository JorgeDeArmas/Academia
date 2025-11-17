import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get('code');
  const state = searchParams.get('state');
  const error = searchParams.get('error');

  // Check for OAuth errors
  if (error) {
    return NextResponse.redirect(
      new URL(`/?error=${encodeURIComponent(error)}`, request.url)
    );
  }

  // Verify CSRF state
  const csrfState = request.cookies.get('tiktok_csrf_state')?.value;
  if (!state || state !== csrfState) {
    return NextResponse.redirect(
      new URL('/?error=invalid_state', request.url)
    );
  }

  if (!code) {
    return NextResponse.redirect(
      new URL('/?error=no_code', request.url)
    );
  }

  try {
    // Exchange authorization code for access token
    const tokenResponse = await fetch('https://open.tiktokapis.com/v2/oauth/token/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Cache-Control': 'no-cache',
      },
      body: new URLSearchParams({
        client_key: process.env.TIKTOK_CLIENT_KEY!,
        client_secret: process.env.TIKTOK_CLIENT_SECRET!,
        code: code,
        grant_type: 'authorization_code',
        redirect_uri: process.env.NEXT_PUBLIC_TIKTOK_REDIRECT_URI!,
      }),
    });

    if (!tokenResponse.ok) {
      throw new Error('Failed to exchange token');
    }

    const tokenData = await tokenResponse.json();
    const accessToken = tokenData.access_token;

    // Fetch user info from TikTok
    const userResponse = await fetch('https://open.tiktokapis.com/v2/user/info/', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    if (!userResponse.ok) {
      throw new Error('Failed to fetch user info');
    }

    const userData = await userResponse.json();
    const tiktokUser = userData.data.user;

    // Check if user exists in database
    const { data: existingUser } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('tiktok_user_id', tiktokUser.open_id)
      .single();

    let userId: string;

    if (existingUser) {
      // Update existing user
      const { data: updatedUser } = await supabaseAdmin
        .from('users')
        .update({
          display_name: tiktokUser.display_name,
          username: tiktokUser.username,
          avatar_url: tiktokUser.avatar_url,
          updated_at: new Date().toISOString(),
        })
        .eq('tiktok_user_id', tiktokUser.open_id)
        .select()
        .single();
      
      userId = updatedUser.id;
    } else {
      // Create new user
      const { data: newUser } = await supabaseAdmin
        .from('users')
        .insert({
          tiktok_user_id: tiktokUser.open_id,
          display_name: tiktokUser.display_name,
          username: tiktokUser.username,
          avatar_url: tiktokUser.avatar_url,
          language_preference: 'es',
        })
        .select()
        .single();
      
      userId = newUser.id;
    }

    // Create session
    const response = existingUser
      ? NextResponse.redirect(new URL('/dashboard', request.url))
      : NextResponse.redirect(new URL('/onboarding', request.url));

    // Set session cookie
    response.cookies.set('session', JSON.stringify({
      userId,
      tiktokUserId: tiktokUser.open_id,
      accessToken,
    }), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    // Clear CSRF state cookie
    response.cookies.delete('tiktok_csrf_state');

    return response;
  } catch (error) {
    console.error('TikTok OAuth error:', error);
    return NextResponse.redirect(
      new URL('/?error=oauth_failed', request.url)
    );
  }
}
