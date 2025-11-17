import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

/**
 * GET /api/similar-creators
 * Fetches similar creators from EchoTik API based on logged-in user's category and language
 * Query params:
 * - refresh: boolean (optional) - if true, fetches fresh data from EchoTik
 * - page: number (optional) - page number for pagination (default: 1)
 * - pageSize: number (optional) - items per page, max 10 (default: 10)
 */
export async function GET(request: NextRequest) {
  try {
    // Get session from cookie
    const sessionCookie = request.cookies.get("session")?.value;
    if (!sessionCookie) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let session;
    try {
      session = JSON.parse(sessionCookie);
    } catch {
      return NextResponse.json({ error: "Invalid session" }, { status: 401 });
    }

    const userId = session.userId;
    if (!userId) {
      return NextResponse.json({ error: "User ID missing" }, { status: 401 });
    }

    // Get current user's profile to determine category and language
    const { data: user, error: userError } = await supabaseAdmin
      .from("users")
      .select("*")
      .eq("id", userId)
      .single();

    if (userError || !user) {
      console.error("User fetch error:", userError);
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Get query parameters
    const searchParams = request.nextUrl.searchParams;
    const refresh = searchParams.get("refresh") === "true";
    const pageNum = parseInt(searchParams.get("page") || "1");
    const pageSize = Math.min(
      parseInt(searchParams.get("pageSize") || "10"),
      10
    );

    const category = user.creator_category || "Beauty"; // Default to Beauty if not set
    const language = user.language_preference || "es";
    const region = "US"; // Always US for now

    console.log(`Fetching similar creators for user ${user.username}:`, {
      category,
      language,
      region,
      pageNum,
      pageSize,
      refresh,
    });

    // If refresh is requested, call EchoTik API via edge function
    if (refresh) {
      try {
        const edgeFunctionUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/fetch-similar-creators`;
        const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

        console.log("Calling edge function:", edgeFunctionUrl);

        const edgeResponse = await fetch(edgeFunctionUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${supabaseAnonKey}`,
            apikey: supabaseAnonKey,
          },
          body: JSON.stringify({
            category,
            region,
            language,
            pageNum,
            pageSize,
          }),
        });

        if (!edgeResponse.ok) {
          const errorText = await edgeResponse.text();
          console.error("Edge function error:", errorText);
          throw new Error(`Edge function failed: ${edgeResponse.status}`);
        }

        const edgeData = await edgeResponse.json();
        console.log("Edge function returned:", edgeData);
      } catch (edgeError) {
        console.error("Error calling edge function:", edgeError);
        // Continue to fetch from database even if edge function fails
      }
    }

    // Fetch creators from database (either freshly synced or existing)
    const offset = (pageNum - 1) * pageSize;

    const {
      data: creators,
      error: creatorsError,
      count,
    } = await supabaseAdmin
      .from("echotik_creators")
      .select("*", { count: "exact" })
      .eq("category", category)
      .eq("language", language)
      .eq("region", region)
      .order("total_sale_gmv_30d_amt", { ascending: false })
      .range(offset, offset + pageSize - 1);

    if (creatorsError) {
      console.error("Creators fetch error:", creatorsError);
      return NextResponse.json(
        { error: "Failed to fetch creators" },
        { status: 500 }
      );
    }

    // Calculate pagination metadata
    const totalPages = count ? Math.ceil(count / pageSize) : 0;
    const hasMore = pageNum < totalPages;

    return NextResponse.json({
      success: true,
      creators: creators || [],
      pagination: {
        page: pageNum,
        pageSize,
        total: count || 0,
        totalPages,
        hasMore,
      },
      filters: {
        category,
        language,
        region,
      },
    });
  } catch (error) {
    console.error("Similar creators API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
