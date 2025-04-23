import { fetchRecallById } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { AlertTriangle, ArrowLeft } from "lucide-react"
import Link from "next/link"
import RecallLayout from "@/components/recall-layout"

export default async function RecallDetailPage({
  params,
}: {
  params: { id: string }
}) {
  console.log(`Attempting to fetch recall with ID: ${params.id}`)

  // Try to fetch the recall by ID using the API endpoint
  const result = await fetchRecallById(params.id)

  // If we don't have a recall, show the not found page
  if (!result) {
    console.log(`Recall with ID ${params.id} not found`)
    return (
      <main className="container mx-auto px-4 py-8">
        <Link href="/" className="inline-flex items-center mb-6 hover:underline">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to all recalls
        </Link>

        <div className="text-center py-12">
          <div className="flex justify-center mb-4">
            <AlertTriangle className="h-12 w-12 text-amber-500" />
          </div>
          <h2 className="text-2xl font-semibold mb-4">Recall Not Found</h2>
          <p className="text-muted-foreground">The recall with ID "{params.id}" could not be found.</p>
          <p className="text-muted-foreground mt-2">
            Please check the ID and try again, or return to the list of all recalls.
          </p>
          <Button asChild className="mt-6">
            <Link href="/">View All Recalls</Link>
          </Button>
        </div>
      </main>
    )
  }

  const { recall, summary } = result

  return <RecallLayout recall={recall} summary={summary} />
}
