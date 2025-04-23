import { type NextRequest, NextResponse } from "next/server"
import { fetchRecalls } from "@/lib/api"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const page = Number.parseInt(searchParams.get("page") || "1")
  const query = searchParams.get("query") || ""

  try {
    const data = await fetchRecalls(page, query)

    // Ensure we're returning the correct page of results
    return NextResponse.json(data)
  } catch (error) {
    console.error("Error fetching recalls from Food Alert API:", error)
    return NextResponse.json(
      {
        error: "Failed to fetch recalls",
        message: error instanceof Error ? error.message : "Unknown error",
        recalls: [],
        totalPages: 0,
        currentPage: page,
        totalResults: 0,
      },
      { status: 500 },
    )
  }
}
