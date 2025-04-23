import { type NextRequest, NextResponse } from "next/server"
import { fetchRecallById } from "@/lib/api"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const id = params.id
  console.log(`API route: Attempting to fetch recall with ID: ${id}`)

  try {
    // Use the updated fetchRecallById function
    const result = await fetchRecallById(id)

    if (!result) {
      console.log(`API route: Recall with ID ${id} not found`)
      return NextResponse.json({ error: "Recall not found" }, { status: 404 })
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error(`API route: Error fetching recall ${id}:`, error)
    return NextResponse.json(
      {
        error: "Failed to fetch recall",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
