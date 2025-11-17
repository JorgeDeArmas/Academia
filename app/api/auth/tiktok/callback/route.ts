import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

/**
 * Get the base URL for redirects based on the request.
 * This ensures that:
 * - In production (Vercel): uses the actual domain (academia-blond-chi.vercel.app)
 * - In development with ngrok: uses the ngrok URL to avoid localhost SSL issues
 * - In local development: uses localhost
 */
function getBaseUrl(request: NextRequest): string {
  // First, try to get the host from the request URL itself
  // This is the most reliable as it's where the callback was actually called
  const requestUrl = new URL(request.url);
  const host = requestUrl.host;

  // Check if we're being called through a proxy/tunnel (ngrok, etc.)
  // by looking at x-forwarded-host or host headers
  const forwardedHost = request.headers.get("x-forwarded-host");
  const hostHeader = request.headers.get("host");

  // Determine the correct host
  const actualHost = forwardedHost || hostHeader || host;

  // Determine protocol - use https for production/ngrok, http for localhost
  const isLocalhost =
    actualHost.includes("localhost") || actualHost.includes("127.0.0.1");
  const protocol = isLocalhost ? "http" : "https";

  return `${protocol}://${actualHost}`;
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get("code");
  const state = searchParams.get("state");
  const error = searchParams.get("error");
  const errorType = searchParams.get("error_type");
  const errorDescription = searchParams.get("error_description");

  // Get base URL for consistent redirects across environments
  const baseUrl = getBaseUrl(request);

  // Check for OAuth errors
  if (error) {
    console.error("TikTok OAuth error:", {
      error,
      errorType,
      errorDescription,
      url: request.url,
    });

    // Build error URL with all error details
    const errorUrl = new URL("/", baseUrl);
    errorUrl.searchParams.set("error", error);
    if (errorType) errorUrl.searchParams.set("error_type", errorType);
    if (errorDescription)
      errorUrl.searchParams.set("error_description", errorDescription);

    return NextResponse.redirect(errorUrl);
  }

  // Verify CSRF state
  const csrfState = request.cookies.get("tiktok_csrf_state")?.value;
  if (!state || state !== csrfState) {
    return NextResponse.redirect(new URL("/?error=invalid_state", baseUrl));
  }

  if (!code) {
    return NextResponse.redirect(new URL("/?error=no_code", baseUrl));
  }

  try {
    // TikTok uses same endpoints for sandbox and production
    // Sandbox is determined by the app credentials, not the endpoint URL
    const tokenEndpoint = "https://open.tiktokapis.com/v2/oauth/token/";
    const userInfoEndpoint = "https://open.tiktokapis.com/v2/user/info/";

    // Exchange authorization code for access token
    const tokenResponse = await fetch(tokenEndpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "Cache-Control": "no-cache",
      },
      body: new URLSearchParams({
        client_key: process.env.TIKTOK_CLIENT_KEY!,
        client_secret: process.env.TIKTOK_CLIENT_SECRET!,
        code: code,
        grant_type: "authorization_code",
        redirect_uri: process.env.NEXT_PUBLIC_TIKTOK_REDIRECT_URI!,
      }),
    });

    const tokenData = await tokenResponse.json();

    if (!tokenResponse.ok) {
      console.error("Token exchange failed:", tokenData);
      return NextResponse.redirect(
        new URL(
          `/?error=token_failed&details=${encodeURIComponent(
            JSON.stringify(tokenData)
          )}`,
          request.url
        )
      );
    }

    const accessToken = tokenData.access_token;

    if (!accessToken) {
      console.error("No access token in response:", tokenData);
      return NextResponse.redirect(
        new URL("/?error=no_access_token", request.url)
      );
    }

    // Fetch user info from TikTok
    // TikTok API requires 'fields' parameter to specify which fields to return
    // Request additional fields for profile avatar and bio
    const userInfoUrl = new URL(userInfoEndpoint);
    userInfoUrl.searchParams.append(
      "fields",
      "open_id,display_name,avatar_url,avatar_large_url,username,bio_description,profile_deep_link"
    );

    const userResponse = await fetch(userInfoUrl.toString(), {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });

    const userData = await userResponse.json();

    if (!userResponse.ok) {
      console.error("User info fetch failed:", userData);
      return NextResponse.redirect(
        new URL(
          `/?error=user_info_failed&details=${encodeURIComponent(
            JSON.stringify(userData)
          )}`,
          request.url
        )
      );
    }

    const tiktokUser = userData.data?.user;

    if (!tiktokUser) {
      console.error("No user data in response:", userData);
      return NextResponse.redirect(
        new URL("/?error=no_user_data", request.url)
      );
    }

    // Log what TikTok actually returned
    console.log(
      "TikTok user data received:",
      JSON.stringify(tiktokUser, null, 2)
    );
    console.log("Avatar URL:", tiktokUser.avatar_url);
    console.log("Avatar Large URL:", tiktokUser.avatar_large_url);

    // Check if user exists in database
    const { data: existingUser, error: selectError } = await supabaseAdmin
      .from("users")
      .select("*")
      .eq("tiktok_user_id", tiktokUser.open_id)
      .single();

    if (selectError && selectError.code !== "PGRST116") {
      // PGRST116 is "not found" which is expected for new users
      console.error("Database select error:", selectError);
      return NextResponse.redirect(
        new URL(
          `/?error=db_error&details=${encodeURIComponent(selectError.message)}`,
          request.url
        )
      );
    }

    let userId: string;

    if (existingUser) {
      // Update existing user
      const { data: updatedUser, error: updateError } = await supabaseAdmin
        .from("users")
        .update({
          display_name: tiktokUser.display_name || existingUser.display_name,
          username: tiktokUser.username || existingUser.username,
          avatar_url:
            tiktokUser.avatar_url ||
            tiktokUser.avatar_large_url ||
            existingUser.avatar_url,
          updated_at: new Date().toISOString(),
        })
        .eq("tiktok_user_id", tiktokUser.open_id)
        .select()
        .single();

      if (updateError || !updatedUser) {
        console.error("Database update error:", updateError);
        return NextResponse.redirect(
          new URL(
            `/?error=db_update_failed&details=${encodeURIComponent(
              updateError?.message || "unknown"
            )}`,
            request.url
          )
        );
      }

      userId = updatedUser.id;
    } else {
      // Create new user - use available fields, fallback to defaults
      const userDataToInsert = {
        tiktok_user_id: tiktokUser.open_id,
        display_name: tiktokUser.display_name || "TikTok User",
        username:
          tiktokUser.username || `user_${tiktokUser.open_id.substring(0, 8)}`,
        avatar_url:
          tiktokUser.avatar_url || tiktokUser.avatar_large_url || null,
        language_preference: "es",
      };

      console.log(
        "Inserting user with data:",
        JSON.stringify(userDataToInsert, null, 2)
      );

      const { data: newUser, error: insertError } = await supabaseAdmin
        .from("users")
        .insert(userDataToInsert)
        .select()
        .single();

      if (insertError || !newUser) {
        console.error("Database insert error:", insertError);
        return NextResponse.redirect(
          new URL(
            `/?error=db_insert_failed&details=${encodeURIComponent(
              insertError?.message || "unknown"
            )}`,
            request.url
          )
        );
      }

      userId = newUser.id;
      console.log(
        "Successfully created user:",
        JSON.stringify(newUser, null, 2)
      );
    }

    // Fetch user's videos from TikTok
    // Only fetch if we have video.list scope
    try {
      const videoListUrl = new URL(
        "https://open.tiktokapis.com/v2/video/list/"
      );
      videoListUrl.searchParams.append(
        "fields",
        "id,create_time,cover_image_url,share_url,video_description,duration,height,width,title,embed_html,embed_link,like_count,comment_count,share_count,view_count"
      );

      const videoResponse = await fetch(videoListUrl.toString(), {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          max_count: 20, // Fetch up to 20 videos
        }),
      });

      if (videoResponse.ok) {
        const videoData = await videoResponse.json();
        const videos = videoData.data?.videos || [];

        // Store videos in database
        if (videos.length > 0) {
          const videoRecords = videos.map((video: any) => ({
            user_id: userId,
            video_id: video.id,
            video_url: video.share_url || video.embed_link,
            cover_image_url: video.cover_image_url,
            title: video.title || video.video_description || null,
            description: video.video_description || null,
            duration_seconds: video.duration || null,
            view_count: video.view_count || 0,
            like_count: video.like_count || 0,
            comment_count: video.comment_count || 0,
            share_count: video.share_count || 0,
            created_at: video.create_time
              ? new Date(video.create_time * 1000).toISOString()
              : new Date().toISOString(),
          }));

          // Upsert videos (insert or update if exists)
          const { error: videoInsertError } = await supabaseAdmin
            .from("creator_videos")
            .upsert(videoRecords, {
              onConflict: "video_id",
              ignoreDuplicates: false,
            });

          if (videoInsertError) {
            console.error("Error storing videos:", videoInsertError);
            // Don't fail the OAuth flow if video storage fails
          } else {
            console.log(
              `Successfully stored ${videos.length} videos for user ${userId}`
            );
          }
        }
      } else {
        console.error("Video list fetch failed:", await videoResponse.text());
        // Don't fail the OAuth flow if video fetch fails
      }
    } catch (videoError) {
      console.error("Error fetching videos:", videoError);
      // Don't fail the OAuth flow if video fetch fails
    }

    // Create session
    // Get the base URL to ensure redirects work correctly in all environments
    const baseUrl = getBaseUrl(request);
    const dashboardUrl = `${baseUrl}/dashboard`;
    const onboardingUrl = `${baseUrl}/onboarding`;

    const response = existingUser
      ? NextResponse.redirect(dashboardUrl)
      : NextResponse.redirect(onboardingUrl);

    // Set session cookie
    response.cookies.set(
      "session",
      JSON.stringify({
        userId,
        tiktokUserId: tiktokUser.open_id,
        accessToken,
      }),
      {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7, // 7 days
      }
    );

    // Clear CSRF state cookie
    response.cookies.delete("tiktok_csrf_state");

    return response;
  } catch (error) {
    console.error("TikTok OAuth error:", error);
    const baseUrl = getBaseUrl(request);
    return NextResponse.redirect(new URL("/?error=oauth_failed", baseUrl));
  }
}
