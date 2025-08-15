import axios from "axios";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Login.css";
import { loginUser } from "../Services/AuthService";
import { useAuth } from "../Context/AuthContext";

const Login = () => {
  const { setUser } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    password: "",
    rememberMe: false,
  });
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      navigate(storedUser.role === "admin" ? "/admin" : "/");
    }
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
    // Clear error when user starts typing
    if (showError) {
      setShowError(false);
    }
  };

  const validateForm = () => {
    if (!formData.username || formData.username.trim() === "") {
      return "Username is required";
    }

    if (!formData.password || formData.password.trim() === "") {
      return "Password is required";
    }

    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setShowError(false);

    const validationError = validateForm();
    if (validationError) {
      toast.error(validationError); // ✅ show toast for validation error
      setErrorMessage(validationError); // Show validation errors in UI
      setIsLoading(false);
      return;
    }

    console.log("Login Data:", formData);
    // You can send the data to backend API here
    // For demo, show error for testing
    try {
      const { user, expiresAt } = await loginUser({
        username: formData.username,
        password: formData.password,
      });
      setUser(user); // <-- Update context instantly

      console.log("Login successful:", { user, expiresAt });
      console.log("Token stored in HTTP-only cookie by server");

      // Redirect to dashboard or home page
      // You can use React Router's navigate here
      // navigate('/dashboard');

      // ✅ Role-based redirect
      if (user.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/");
      } //alert('Login successful! Token stored securely in HTTP-only cookie.'); // Temporary - replace with proper navigation
    } catch (error) {
      // Handle login error
      setShowError(true);
      setErrorMessage(error.message);
      toast.error(error.message);
      console.error("Login error:", error);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="login-page">
      {/* Logo */}
      <div className="logo-container">
        <div className="logo">
          {/* <span className="logo-icon">🔥</span> */}
          <span className="logo-text">
            <Link to="/" className="text-2xl font-bold text-black tracking-wide">
              <img src="/logo.png" alt="Ballerstalk Logo" className="h-10 w-auto" />{" "}
            </Link>
          </span>
        </div>
      </div>
      <form onSubmit={handleSubmit} className="login-form">
        <div className="login-form-container">
          {/* <div className={`alert alert-danger ${showError ? "show" : ""}`}>
          {errorMessage}                                                                          //old error message style
        </div> */}

          <div className="login-form">
            <h2>Login</h2>

            <div className="form-group">
              <label className="form-label">Username</label>
              <input
                type="text"
                name="username"
                placeholder="Enter your username"
                value={formData.username}
                onChange={handleChange}
                required
                className="form-control"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <input
                type="password"
                name="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                required
                className="form-control"
              />
            </div>

            {/* <div className="form-check">
              <input
                type="checkbox"
                name="rememberMe"
                id="remember-me"
                checked={formData.rememberMe}
                onChange={handleChange}
                className="form-check-input"
              />
              <label htmlFor="remember-me" className="form-check-label">
                Remember me
              </label>
            </div> */}

            <button type="submit" className="btn-custom" disabled={isLoading}>
              {isLoading ? "Logging in..." : "Login"}
            </button>

            <div className="login-links">
              <a
                href="#"
                onClick={() => console.log("Forgot password clicked")}
              >
                Forgot password?
              </a>
              {" | "}

              <Link
                to="/register"
                className="login-links"
                onClick={() => console.log("Register clicked")}
              >
                Register here
              </Link>
            </div>
          </div>
        </div>
      </form>

      {/* Copyright */}
      <div className="copyright">
        <p>Copyright © 2025 Ballerstack </p>
        <div className="footer-links">
          <Link to="/terms">Terms & Conditions</Link>
          <span> | </span>
          <Link to="/privacy">Privacy Policy</Link>
        </div>
      </div>
      <ToastContainer
        position="top-right"
        autoClose={5000} // ⏱️ 5 seconds
        hideProgressBar={false} // ⛔ false = show progress bar
        newestOnTop={false}
        closeOnClick // 🖱️ closes toast on click
        rtl={false} // 🌍 right-to-left support
        pauseOnFocusLoss // ⏸ pauses when tab loses focus
        draggable // 🖱️ allows drag to dismiss
        pauseOnHover // ⏸ pause timer on hover
        theme="light" // 🎨 "light" | "dark" | "colored"
      />
    </div>
  );
};

export default Login;

// localStorage.removeItem('user');
// localStorage.removeItem('expiresAt');
// // Server should clear the cookie on logout endpoint
// await axios.post('/api/Auth/logout', {}, { withCredentials: true });
