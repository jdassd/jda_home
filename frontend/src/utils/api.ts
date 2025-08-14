// Utility for making API requests to the backend

// Get the base API URL from environment variables
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

// Generic fetch function
async function fetchApi(endpoint: string, options: RequestInit = {}) {
  const url = `${API_BASE_URL}${endpoint}`
  
  // Set default headers
  const defaultHeaders = {
    'Content-Type': 'application/json',
    ...options.headers
  }
  
  // Merge options with defaults
  const config: RequestInit = {
    ...options,
    headers: defaultHeaders
  }
  
  try {
    const response = await fetch(url, config)
    
    if (!response.ok) {
      throw new Error(`API request failed: ${response.statusText}`)
    }
    
    return await response.json()
  } catch (error) {
    console.error('API request error:', error)
    throw error
  }
}

// API methods
export default {
  get: (endpoint: string) => fetchApi(endpoint, { method: 'GET' }),
  post: (endpoint: string, data: any) => fetchApi(endpoint, { 
    method: 'POST',
    body: JSON.stringify(data)
  }),
  put: (endpoint: string, data: any) => fetchApi(endpoint, {
    method: 'PUT',
    body: JSON.stringify(data)
  }),
  delete: (endpoint: string) => fetchApi(endpoint, { method: 'DELETE' })
}