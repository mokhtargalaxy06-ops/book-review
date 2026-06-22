import type { Book, PaginatedResponse, ResourceResponse } from '../types'
import { api } from './client'

export interface BookFilters {
  search?: string
  genre?: string
  year?: string
  rating?: string
  featured?: boolean
  sort?: string
  page?: number
  per_page?: number
}

export async function getBooks(filters: BookFilters = {}) {
  const { data } = await api.get<PaginatedResponse<Book>>('/books', { params: filters })
  return data
}

export async function getBook(id: string | number) {
  const { data } = await api.get<ResourceResponse<Book>>(`/books/${id}`)
  return data.data
}

export async function getGenres() {
  const { data } = await api.get<{ data: string[] }>('/books/genres')
  return data.data
}

export async function saveBook(payload: FormData, id?: number) {
  if (id) {
    payload.append('_method', 'PATCH')
    const { data } = await api.post<ResourceResponse<Book>>(`/books/${id}`, payload)
    return data.data
  }

  const { data } = await api.post<ResourceResponse<Book>>('/books', payload)
  return data.data
}

export const deleteBook = (id: number) => api.delete(`/books/${id}`)
