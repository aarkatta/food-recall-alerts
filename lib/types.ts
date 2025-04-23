export interface Recall {
  id: string
  product: string
  company: string
  reason: string
  classification: string
  recallDate: string
  risk?: string
  distribution?: string
  quantity?: string
  status?: string
  reportDate?: string
  voluntaryMandated?: string
  state?: string
  city?: string
  summary?: string
}

export interface RecallsResponse {
  recalls: Recall[]
  totalPages: number
  currentPage: number
  totalResults: number
}

export interface RecallDetailResponse {
  recall: Recall
  summary?: string
}
