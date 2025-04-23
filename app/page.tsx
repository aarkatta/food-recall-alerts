import { Suspense } from "react"
import Hero from "@/components/hero"
import RecallList from "@/components/recall-list"
import SearchBar from "@/components/search-bar"
import { Skeleton } from "@/components/ui/skeleton"

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; query?: string }>
}) {
  // Await searchParams to avoid the dynamic API error
  const params = await searchParams
  const pageParam = params.page
  const queryParam = params.query || ""

  // Parse the page parameter safely
  const page = pageParam ? Number(pageParam) : 1

  return (
    <main className="min-h-screen container mx-auto px-4 py-8">
      <Hero />
      <div className="my-8">
        <SearchBar defaultValue={queryParam} />
      </div>
      <Suspense
        fallback={
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-20 w-full" />
              </div>
            ))}
          </div>
        }
      >
        <RecallList page={page} query={queryParam} />
      </Suspense>
    </main>
  )
}
