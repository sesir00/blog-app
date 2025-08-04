import axios from "axios";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { loginUser } from "../Services/AuthService";
import "./Register.css";
import isEmail from "validator/lib/isEmail";

const Register = () => {
  const apiUrl = import.meta.env.VITE_API_BASE_URL;

  const [formData, setFormData] = useState({
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
  });
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    // const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    // const emailRegexWithSubdomain =
    //   /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (!isEmail(formData.email.trim())) {
      return "Please enter a valid email address"; //using validator library
    }

    if (!formData.email || formData.email.trim() === "") {
      return "Email is required";
    }
    // if (!emailRegex.test(formData.email.trim())) {
    //   return "Please enter a valid email address";
    // }
    if (!isEmail(formData.email.trim())) {
      return "Please enter a valid email address";
    }
    if (!formData.username || formData.username.trim() === "") {
      return "Username is required";
    }
    if (formData.username.trim().length < 5) {
      return "Username must be at least 5 characters";
    }
    if (!formData.password || formData.password.trim() === "") {
      return "Password is required";
    }
    if (formData.password.length < 6) {
      return "Password must be at least 6 characters";
    }
    if (!formData.confirmPassword || formData.confirmPassword.trim() === "") {
      return "Please confirm your password";
    }

    if (formData.password !== formData.confirmPassword) {
      return "Passwords do not match";
    }
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setShowError(false);

    const validationError = validateForm();
    if (validationError) {
      toast.error(validationError);
      setErrorMessage(validationError);
      setIsLoading(false);
      return;
    }

    try {
      const response = await axios.post(
        `${apiUrl}/api/Auth/register`,
        {
          email: formData.email,
          username: formData.username,
          password: formData.password,
          confirmPassword: formData.confirmPassword,
        },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      // ✅ Automatically log in the user after successful registration
      const { user, expiresAt } = await loginUser({
        username: formData.username,
        password: formData.password,
      });

      toast.success("Registration successful! Logging you in...");
      setTimeout(() => {
        navigate("/");
      }, 3000);
    } catch (error) {
      toast.error(error.message || "Registration failed.");
      console.error("Registration error:", error);
    } finally {
      setIsLoading(false);
    }
  };
  return (
     <div className="register-page">
      {/* Logo */}
      <div className="logo-container">
        <div className="logo">
          {/* <span className="logo-icon">🔥</span> */}
          <span className="logo-text">  
            <img src="/logo.png" alt="Ballerstalk Logo" className="h-10 w-auto" />
          </span>
        </div>
      </div>
    <form onSubmit={handleSubmit} className="register-container">
      <div className="register-form-container">
        <div className={`alert alert-danger ${showError ? "show" : ""}`}>
          Passwords do not match!
        </div>

        <div className="register-form">
          <h2>Register</h2>

          <div className="form-group">
            <label className="form-label">Email</label>
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              required
              className="form-control"
            />
          </div>

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

          <div className="form-group">
            <label className="form-label">Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm your password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              className="form-control"
            />
          </div>

          <button type="submit" className="btn-custom">
            Register
          </button>

          <div className="register-links">
            <Link
              to="/login"
              className="..."
              onClick={() => console.log("Back to login clicked")}
            >
              Back to Login
            </Link>
          </div>
        </div>
      </div>
    </form>
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

export default Register;
