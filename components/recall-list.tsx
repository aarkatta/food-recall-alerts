import { fetchRecalls } from "@/lib/api"
import RecallCard from "./recall-card"
import Pagination from "./pagination"
import { AlertTriangle } from "lucide-react"
import { config } from "@/lib/config"

export default async function RecallList({
  page = 1,
  query = "",
}: {
  page: number
  query: string
}) {
  // Ensure page is a valid number
  const currentPage = isNaN(page) ? 1 : page

  // Fetch recalls from the API with client-side pagination
  const response = await fetchRecalls(currentPage, query)

  // Destructure the response
  const { recalls, totalPages, totalResults } = response

  if (recalls.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="flex justify-center mb-4">
          <AlertTriangle className="h-12 w-12 text-amber-500" />
        </div>
        <h2 className="text-2xl font-semibold mb-4">No recalls found</h2>
        <p className="text-muted-foreground">
          {query ? `No recalls matching "${query}" were found.` : "There are currently no recalls to display."}
        </p>
        <p className="text-muted-foreground mt-2">Try adjusting your search terms or check back later for updates.</p>
      </div>
    )
  }

  // Calculate the range of recalls being displayed
  const itemsPerPage = config.pagination.itemsPerPage
  const startIndex = (currentPage - 1) * itemsPerPage + 1
  const endIndex = Math.min(currentPage * itemsPerPage, totalResults)

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-2">
        {query ? `Search Results for "${query}"` : "Latest Food Recall Alerts"}
      </h2>
      <p className="text-muted-foreground mb-6">
        {totalResults > 0 && `Showing ${startIndex}-${endIndex} of ${totalResults} total recalls`}
      </p>
      <div className="space-y-6">
        {recalls.map((recall) => (
          <RecallCard key={recall.id} recall={recall} />
        ))}
      </div>
      <Pagination currentPage={currentPage} totalPages={totalPages} query={query} />
    </div>
  )
}
