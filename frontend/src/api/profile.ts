import type { PaginatedResponse, ResourceResponse, Review, User } from '../types'
import { api } from './client'

export async function getMyReviews(page = 1) {
  const { data } = await api.get<PaginatedResponse<Review>>('/profile/reviews', { params: { page } })
  return data
}

export async function updateProfile(input: Pick<User, 'name' | 'email'>) {
  const { data } = await api.put<ResourceResponse<User>>('/profile', input)
  return data.data
}
