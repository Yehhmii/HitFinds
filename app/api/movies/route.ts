import { type NextRequest, NextResponse } from "next/server";
import { searchMovies, discoverMovies } from "@/lib/api";

// export const runtime = "edge";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("query") ?? "";
  const genre = searchParams.get("genre") ?? "";
  const year = searchParams.get("year") ?? "";
  const page = Number(searchParams.get("page") ?? "1");

  try {
    const data = query
      ? await searchMovies(query, page)
      : await discoverMovies({ page, genre, year });

    return NextResponse.json(data, {
      headers: {
        "Cache-Control": query
          ? "no-store"
          : "public, s-maxage=3600, stale-while-revalidate=86400",
      },
    });
  } catch (err) {
    console.error("Movies API error:", err);
    return NextResponse.json(
      { error: "Failed to fetch movies" },
      { status: 500 }
    );
  }
}
