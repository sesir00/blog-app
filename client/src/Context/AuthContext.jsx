import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const apiUrl = import.meta.env.VITE_API_BASE_URL;
  const storedUser = localStorage.getItem("user");        // Load user instantly from localStorage (if present)
  const [user, setUser] = useState(() => {
      return storedUser ? JSON.parse(storedUser) : null;
  }); 
  const [loading, setLoading] = useState(() => {
    // If we already have user data in localStorage, no need to block UI
    return !localStorage.getItem("user");
  });


  useEffect(() => {
    const verifyUser = async () => {
      const token = localStorage.getItem("token"); // Get token inside useEffect
      if (!token) {
        setUser(null);
        setLoading(false);
        return;
      }
      try {
        const res = await axios.get(`${apiUrl}/api/Auth/me`, {
          //withCredentials: true
          headers: { Authorization: `Bearer ${token}` },
        });

        setUser(res.data);
        localStorage.setItem("user", JSON.stringify(res.data)); //keep in sync
      } catch (err) {
        console.error("Token verification failed:", err);
        setUser(null);
        localStorage.removeItem("user");
        localStorage.removeItem("token");
      } finally {
        setLoading(false);
      }
    };

    verifyUser();
  }, [apiUrl]);

  return (
    <AuthContext.Provider value={{ user, setUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);



// Instant load → useState initializes from localStorage before API runs.
// ✅ Background verification → /me runs after UI shows stored user.
// ✅ Keeps UI usable → If backend is slow, you still see the dashboard immediately.
// ✅ Token cleanup → If verification fails, removes both token & user from localStorage.
