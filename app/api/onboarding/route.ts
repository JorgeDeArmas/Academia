import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function POST(request: NextRequest) {
  try {
    // Get session from cookie
    const sessionCookie = request.cookies.get("session")?.value;
    if (!sessionCookie) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const session = JSON.parse(sessionCookie);
    const { displayName, category, languagePreference } = await request.json();

    // Update user in database
    const { data, error } = await supabaseAdmin
      .from("users")
      .update({
        display_name: displayName,
        creator_category: category,
        language_preference: languagePreference,
        updated_at: new Date().toISOString(),
      })
      .eq("id", session.userId)
      .select()
      .single();

    if (error) {
      console.error("Database error:", error);
      return NextResponse.json(
        { error: "Failed to update user" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, user: data });
  } catch (error) {
    console.error("Onboarding error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
