import axios, { AxiosError } from 'axios'

const backendUrl = import.meta.env.VITE_BACKEND_URL ?? 'http://localhost:8000'

export const api = axios.create({
  baseURL: `${backendUrl}/api`,
  withCredentials: true,
  withXSRFToken: true,
  headers: {
    Accept: 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
  },
})

export const csrf = () =>
  axios.get(`${backendUrl}/sanctum/csrf-cookie`, {
    withCredentials: true,
    withXSRFToken: true,
  })

export function errorMessage(error: unknown): string {
  if (error instanceof AxiosError) {
    const errors = error.response?.data?.errors as Record<string, string[]> | undefined
    if (errors) return Object.values(errors).flat()[0] ?? 'Please check the form and try again.'
    return error.response?.data?.message ?? 'Something went wrong. Please try again.'
  }

  return error instanceof Error ? error.message : 'Something went wrong. Please try again.'
}
