import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function GET(request: NextRequest) {
  try {
    // Get session from cookie
    const sessionCookie = request.cookies.get("session")?.value;
    if (!sessionCookie) {
      return NextResponse.json({ error: "No session found" }, { status: 401 });
    }

    const session = JSON.parse(sessionCookie);

    // Fetch user data
    const { data: user, error: userError } = await supabaseAdmin
      .from("users")
      .select("*")
      .eq("id", session.userId)
      .single();

    if (userError || !user) {
      return NextResponse.json(
        {
          error: "User not found",
          details: userError,
        },
        { status: 404 }
      );
    }

    // Fetch user's videos
    const { data: videos, error: videosError } = await supabaseAdmin
      .from("creator_videos")
      .select("*")
      .eq("user_id", session.userId)
      .order("created_at", { ascending: false });

    return NextResponse.json(
      {
        session,
        user,
        videosCount: videos?.length || 0,
        videos: videos || [],
        videosError: videosError?.message || null,
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { error: "Internal server error", details: error.message },
      { status: 500 }
    );
  }
}
