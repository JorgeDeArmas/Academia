import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function GET(request: NextRequest) {
  try {
    // Get session from cookie
    const sessionCookie = request.cookies.get("session")?.value;
    if (!sessionCookie) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const session = JSON.parse(sessionCookie);

    // Fetch user data
    const { data: user, error: userError } = await supabaseAdmin
      .from("users")
      .select("*")
      .eq("id", session.userId)
      .single();

    if (userError || !user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Fetch similar creators
    const { data: similarCreatorIds, error: similarError } = await supabaseAdmin
      .from("creators_similar")
      .select("similar_creator_id, similarity_score")
      .eq("user_id", session.userId);

    if (similarError) {
      console.error("Error fetching similar creators:", similarError);
      return NextResponse.json({ user, similarCreators: [] });
    }

    if (!similarCreatorIds || similarCreatorIds.length === 0) {
      return NextResponse.json({ user, similarCreators: [] });
    }

    // Fetch similar creator details with their top videos
    const similarCreators = await Promise.all(
      similarCreatorIds.map(async (item) => {
        const { data: creator } = await supabaseAdmin
          .from("users")
          .select("*")
          .eq("id", item.similar_creator_id)
          .single();

        if (!creator) return null;

        // Fetch top videos for this creator
        const { data: videos } = await supabaseAdmin
          .from("creator_videos")
          .select("*")
          .eq("creator_id", creator.id)
          .order("view_count", { ascending: false })
          .limit(3);

        // Fetch products for each video
        const videosWithProducts = await Promise.all(
          (videos || []).map(async (video) => {
            const { data: products } = await supabaseAdmin
              .from("video_products")
              .select("*")
              .eq("video_id", video.id)
              .order("sales_count", { ascending: false })
              .limit(3);

            return {
              ...video,
              products: products || [],
            };
          })
        );

        return {
          ...creator,
          similarity_score: item.similarity_score,
          top_videos: videosWithProducts,
        };
      })
    );

    // Filter out null values
    const validCreators = similarCreators.filter(Boolean);

    return NextResponse.json({
      user,
      similarCreators: validCreators,
    });
  } catch (error) {
    console.error("Dashboard error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
