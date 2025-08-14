import { defineStore } from 'pinia'

// Define the User interface
interface User {
  id: string
  username: string
  email: string
  // Add other user properties as needed
}

// Define the auth store
export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null as User | null,
    isAuthenticated: false
  }),
  
  actions: {
    login(userData: User) {
      this.user = userData
      this.isAuthenticated = true
    },
    
    logout() {
      this.user = null
      this.isAuthenticated = false
    }
  },
  
  getters: {
    getUser: (state) => state.user,
    isLoggedIn: (state) => state.isAuthenticated
  }
})