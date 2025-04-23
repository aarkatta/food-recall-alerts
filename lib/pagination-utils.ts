import type { Recall } from "./types"
import { config } from "./config"

/**
 * Paginates an array of recalls
 * @param recalls The array of recalls to paginate
 * @param page The current page number (1-based)
 * @param itemsPerPage The number of items per page
 * @returns The paginated array of recalls for the current page
 */
export function paginateRecalls(
  recalls: Recall[],
  page: number,
  itemsPerPage = config.pagination.itemsPerPage,
): Recall[] {
  // Ensure page is valid
  const validPage = page < 1 ? 1 : page

  const startIndex = (validPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage

  // Return the slice of recalls for the current page
  return recalls.slice(startIndex, endIndex)
}

/**
 * Calculates the total number of pages
 * @param totalItems The total number of items
 * @param itemsPerPage The number of items per page
 * @returns The total number of pages
 */
export function calculateTotalPages(totalItems: number, itemsPerPage = config.pagination.itemsPerPage): number {
  return Math.ceil(totalItems / itemsPerPage)
}
