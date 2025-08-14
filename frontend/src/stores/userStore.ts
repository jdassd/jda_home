import { defineStore } from 'pinia';
import { ref } from 'vue';

// Define the User interface
interface User {
  id: number;
  username: string;
  email: string;
}

// Define a simple user store for non-auth related user data
export const useUserStore = defineStore('user', () => {
  // State
  const user = ref<User | null>(null);

  // Actions
  const setUser = (userData: User) => {
    user.value = userData;
  };

  const clearUser = () => {
    user.value = null;
  };

  return {
    user,
    setUser,
    clearUser
  };
});