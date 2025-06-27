import { useQuery } from "@tanstack/react-query";

export function useAuth() {
  const token = localStorage.getItem('token');
  
  const { data: user, isLoading } = useQuery({
    queryKey: ["/api/auth/user"],
    queryFn: async () => {
      if (!token) return null;
      
      const response = await fetch('/api/auth/user', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        return null;
      }
      
      return response.json();
    },
    retry: false,
    enabled: !!token
  });

  return {
    user,
    isLoading,
    isAuthenticated: !!user && !!token,
  };
}
