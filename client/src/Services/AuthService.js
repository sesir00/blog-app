// src/services/authService.js
import axios from "axios";

export const loginUser = async ({ username, password }) => {
  const apiUrl = import.meta.env.VITE_API_BASE_URL;
  

  try {
    const response = await axios.post(
      `${apiUrl}/api/Auth/login`,
      { username, password },
      {
        withCredentials: true, // important for HTTP-only cookie
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    // Login successful
    const { user, expiresAt } = response.data;

    // Note: Token is now stored in HTTP-only cookie by the server
    // We can only store non-sensitive user data in localStorage      localStorage.setItem('token', token);
    localStorage.setItem("user", JSON.stringify(user));
    localStorage.setItem("expiresAt", expiresAt);

    return { user, expiresAt }; // Success
  } catch (error) {
    // Rethrow to handle in component
    if (error.response) {
      throw new Error(
        error.response.data.message || "Invalid username or password"
      );
    } else if (error.request) {
      throw new Error("Network error. Please check your connection.");
    } else {
      throw new Error("Something went wrong. Try again.");
    }
  }
};

export const logoutUser = async () => {
  localStorage.removeItem("user");
  localStorage.removeItem("expiresAt");
  //localStorage.clear(); // Clears everything we store

  try {
    await axios.post(
      "https://localhost:44388/api/Auth/logout",
      {},
      {
        withCredentials: true,
      }
    );
  } catch (err) {
    console.warn("Logout request failed:", err);
  }
};
