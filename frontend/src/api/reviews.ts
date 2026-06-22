import type { ResourceResponse, Review } from '../types'
import { api } from './client'

export interface ReviewInput {
  rating: number
  body: string
}

export async function createReview(bookId: number, input: ReviewInput) {
  const { data } = await api.post<ResourceResponse<Review>>(`/books/${bookId}/reviews`, input)
  return data.data
}

export async function updateReview(reviewId: number, input: ReviewInput) {
  const { data } = await api.patch<ResourceResponse<Review>>(`/reviews/${reviewId}`, input)
  return data.data
}

export const deleteReview = (reviewId: number) => api.delete(`/reviews/${reviewId}`)
