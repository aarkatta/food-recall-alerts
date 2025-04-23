"use client"

import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import Link from "next/link"

export default function Pagination({
  currentPage,
  totalPages,
  query,
}: {
  currentPage: number
  totalPages: number
  query: string
}) {
  // If there's only one page or no pages, don't show pagination
  if (totalPages <= 1) return null

  const getPageUrl = (page: number) => {
    const params = new URLSearchParams()
    params.set("page", page.toString())
    if (query) params.set("query", query)
    return `/?${params.toString()}`
  }

  // Calculate the range of page numbers to display
  const getPageNumbers = () => {
    const pageNumbers = []

    // Always show at most 5 page numbers
    let startPage = Math.max(1, currentPage - 2)
    const endPage = Math.min(totalPages, startPage + 4)

    // Adjust if we're near the end
    if (endPage - startPage < 4) {
      startPage = Math.max(1, endPage - 4)
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i)
    }

    return pageNumbers
  }

  const pageNumbers = getPageNumbers()

  return (
    <div className="flex justify-center items-center space-x-2 mt-8">
      <Button variant="outline" size="icon" asChild disabled={currentPage <= 1}>
        <Link href={currentPage > 1 ? getPageUrl(currentPage - 1) : "#"} aria-label="Previous page">
          <ChevronLeft className="h-4 w-4" />
        </Link>
      </Button>

      <div className="flex items-center space-x-2">
        {pageNumbers.map((pageNum) => (
          <Button key={pageNum} variant={currentPage === pageNum ? "default" : "outline"} size="icon" asChild>
            <Link
              href={getPageUrl(pageNum)}
              aria-label={`Page ${pageNum}`}
              aria-current={currentPage === pageNum ? "page" : undefined}
            >
              {pageNum}
            </Link>
          </Button>
        ))}
      </div>

      <Button variant="outline" size="icon" asChild disabled={currentPage >= totalPages}>
        <Link href={currentPage < totalPages ? getPageUrl(currentPage + 1) : "#"} aria-label="Next page">
          <ChevronRight className="h-4 w-4" />
        </Link>
      </Button>
    </div>
  )
}
