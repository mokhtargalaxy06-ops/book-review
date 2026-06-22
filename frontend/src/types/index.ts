export interface User {
  id: number
  name: string
  email?: string
  created_at: string
}

export interface Review {
  id: number
  rating: number
  body: string
  user: User
  book?: Book
  can_edit: boolean
  created_at: string
  updated_at: string
}

export interface Book {
  id: number
  title: string
  author: string
  isbn: string
  description: string
  cover_url: string | null
  genre: string
  published_year: number | null
  is_featured: boolean
  average_rating: number
  reviews_count: number
  reviews?: Review[]
  creator?: User
  can_edit: boolean
  created_at: string
  updated_at: string
}

export interface PaginationLink {
  url: string | null
  label: string
  active: boolean
}

export interface PaginatedResponse<T> {
  data: T[]
  links: {
    first: string | null
    last: string | null
    prev: string | null
    next: string | null
  }
  meta: {
    current_page: number
    from: number | null
    last_page: number
    links: PaginationLink[]
    path: string
    per_page: number
    to: number | null
    total: number
  }
}

export interface ResourceResponse<T> {
  data: T
}
