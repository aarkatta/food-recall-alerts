import type { Recall, RecallsResponse } from "./types"
import { config } from "./config"
import { paginateRecalls } from "./pagination-utils"

export async function fetchRecalls(page = 1, query = ""): Promise<RecallsResponse> {
  try {
    // Build the API query - no pagination parameters since we'll get all recalls
    let apiUrl = `${config.api.foodAlert.baseUrl}?code=${config.api.foodAlert.apiKey}`

    // Add search query if provided
    if (query) {
      apiUrl += `&query=${encodeURIComponent(query)}`
    }

    console.log(`Fetching all recalls from Food Alert API: ${apiUrl}`)

    const response = await fetch(apiUrl, {
      // Add cache control
      cache: "force-cache",
      next: { revalidate: 3600 }, // Revalidate once per hour
    })

    // Handle non-OK responses
    if (!response.ok) {
      console.warn(`Food Alert API responded with status: ${response.status}`)

      // If we get a 404, it means no results found
      if (response.status === 404) {
        return {
          recalls: [],
          totalPages: 0,
          currentPage: page,
          totalResults: 0,
        }
      }

      throw new Error(`Food Alert API responded with status: ${response.status}`)
    }

    const data = await response.json()

    // Check if the response has the expected structure
    if (!data.recalls || !Array.isArray(data.recalls)) {
      console.error("Unexpected API response format:", data)
      throw new Error("Unexpected API response format")
    }

    // Transform API response to our app's format
    const allRecalls: Recall[] = data.recalls.map((item: any) => ({
      id: item.recall_number || `recall-${Math.random().toString(36).substring(2, 11)}`,
      product: item.product_description || "No product description available",
      company: item.recalling_firm || "Unknown company",
      reason: item.reason_for_recall || "No reason provided",
      classification: item.classification || "Unclassified",
      recallDate: formatDateString(item.report_date),
      risk: getClassificationRisk(item.classification),
      distribution: item.distribution_pattern || "Unknown distribution",
      quantity: item.product_quantity || "Unknown quantity",
      status: item.status || "Unknown status",
      reportDate: formatDateString(item.report_date),
      voluntaryMandated: item.voluntary_mandated || "Unknown",
      state: item.state || "",
      city: item.city || "",
      summary: item.summary || "",
    }))

    // Filter recalls by query if provided (in case the API doesn't handle filtering)
    let filteredRecalls = allRecalls
    if (query) {
      const lowerQuery = query.toLowerCase()
      filteredRecalls = allRecalls.filter(
        (recall) =>
          recall.product.toLowerCase().includes(lowerQuery) ||
          recall.company.toLowerCase().includes(lowerQuery) ||
          recall.reason.toLowerCase().includes(lowerQuery),
      )
    }

    // Get the total number of recalls after filtering
    const totalResults = filteredRecalls.length

    // Calculate total pages
    const itemsPerPage = config.pagination.itemsPerPage
    const totalPages = Math.ceil(totalResults / itemsPerPage)

    // Paginate the recalls on the client side
    const paginatedRecalls = paginateRecalls(filteredRecalls, page, itemsPerPage)

    return {
      recalls: paginatedRecalls,
      totalPages,
      currentPage: page,
      totalResults,
    }
  } catch (error) {
    console.error("Error fetching recalls from Food Alert API:", error)

    // Return empty data on error
    return {
      recalls: [],
      totalPages: 0,
      currentPage: page,
      totalResults: 0,
    }
  }
}

// Updated function to fetch a single recall by ID
export async function fetchRecallById(id: string): Promise<{ recall: Recall; summary?: string } | null> {
  try {
    // First try to fetch the specific recall using the detail API
    const detailApiUrl = `${config.api.foodAlert.detailUrl}/${encodeURIComponent(id)}?code=${
      config.api.foodAlert.detailApiKey
    }`

    console.log(`Attempting to fetch recall details from: ${detailApiUrl}`)

    const detailResponse = await fetch(detailApiUrl, {
      cache: "no-store", // Don't cache to ensure we get fresh data
    })

    // If the detail API succeeds, use that data
    if (detailResponse.ok) {
      const detailData = await detailResponse.json()

      if (detailData) {
        // Check if the response has the expected structure with a recall object
        if (detailData.recall) {
          const item = detailData.recall
          return {
            recall: {
              id: item.recall_number || id,
              product: item.product_description || "No product description available",
              company: item.recalling_firm || "Unknown company",
              reason: item.reason_for_recall || "No reason provided",
              classification: item.classification || "Unclassified",
              recallDate: formatDateString(item.report_date),
              risk: getClassificationRisk(item.classification),
              distribution: item.distribution_pattern || "Unknown distribution",
              quantity: item.product_quantity || "Unknown quantity",
              status: item.status || "Unknown status",
              reportDate: formatDateString(item.report_date),
              voluntaryMandated: item.voluntary_mandated || "Unknown",
              state: item.state || "",
              city: item.city || "",
            },
            summary: detailData.summary || "",
          }
        }

        // If the response has a summary field but no recall object
        if (detailData.summary) {
          // We need to construct a recall object from the available data
          return {
            recall: {
              id: id,
              product: "Product information unavailable",
              company: "Company information unavailable",
              reason: "Reason information unavailable",
              classification: "",
              recallDate: "",
              // Add other fields as needed with default values
            },
            summary: detailData.summary,
          }
        }
      }
    }

    // If the detail API fails, fall back to fetching all recalls and finding the one we need
    console.log(`Detail API failed or returned no data, fetching all recalls to find ID: ${id}`)

    // Build the API query to get all recalls
    const apiUrl = `${config.api.foodAlert.baseUrl}?code=${config.api.foodAlert.apiKey}`

    const response = await fetch(apiUrl, {
      cache: "no-store", // Don't cache to ensure we get fresh data
    })

    if (!response.ok) {
      console.warn(`API responded with status: ${response.status} when fetching all recalls`)
      return null
    }

    const data = await response.json()

    if (!data.recalls || !Array.isArray(data.recalls)) {
      console.error("Unexpected API response format for all recalls:", data)
      return null
    }

    // Find the recall with the matching ID
    const matchingRecall = data.recalls.find((item: any) => item.recall_number === id)

    if (!matchingRecall) {
      console.warn(`Recall with ID ${id} not found in any data source`)
      return null
    }

    // Transform API response to our app's format
    return {
      recall: {
        id: matchingRecall.recall_number || id,
        product: matchingRecall.product_description || "No product description available",
        company: matchingRecall.recalling_firm || "Unknown company",
        reason: matchingRecall.reason_for_recall || "No reason provided",
        classification: matchingRecall.classification || "Unclassified",
        recallDate: formatDateString(matchingRecall.report_date),
        risk: getClassificationRisk(matchingRecall.classification),
        distribution: matchingRecall.distribution_pattern || "Unknown distribution",
        quantity: matchingRecall.product_quantity || "Unknown quantity",
        status: matchingRecall.status || "Unknown status",
        reportDate: formatDateString(matchingRecall.report_date),
        voluntaryMandated: matchingRecall.voluntary_mandated || "Unknown",
        state: matchingRecall.state || "",
        city: matchingRecall.city || "",
      },
      summary: matchingRecall.summary || "",
    }
  } catch (error) {
    console.error(`Error fetching recall ${id}:`, error)
    return null
  }
}

// Helper function to format date strings from the API
function formatDateString(dateString: string | undefined): string {
  if (!dateString) return ""

  try {
    // Handle ISO format dates (2025-04-16T00:00:00Z)
    if (dateString.includes("T")) {
      return dateString.split("T")[0] // Extract just the date part
    }

    // Handle FDA format dates (YYYYMMDD)
    if (dateString.length === 8) {
      const year = dateString.substring(0, 4)
      const month = dateString.substring(4, 6)
      const day = dateString.substring(6, 8)
      return `${year}-${month}-${day}`
    }

    return dateString
  } catch (e) {
    console.error("Error formatting date:", e)
    return dateString
  }
}

// Helper function to determine risk level based on FDA classification
function getClassificationRisk(classification: string | undefined): string {
  if (!classification) return "Unknown risk level"

  if (classification.includes("Class I")) {
    return "Dangerous or defective products that could cause serious health problems or death"
  } else if (classification.includes("Class II")) {
    return "Products that might cause a temporary health problem, or pose slight threat of a serious nature"
  } else if (classification.includes("Class III")) {
    return "Products that are unlikely to cause any adverse health reaction, but violate FDA labeling or manufacturing laws"
  }
  return "Unknown risk level"
}
