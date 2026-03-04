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
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    if (!formData.email || formData.email.trim() === "") {
      return "Email is required";
    }
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

    const validationError = validateForm();
    if (validationError) {
      toast.error(validationError);
      setIsLoading(false);
      return;
    }

    try {
      await axios.post(
        `${apiUrl}/api/Auth/register`,
        {
          email: formData.email,
          username: formData.username,
          password: formData.password,
          confirmPassword: formData.confirmPassword,
        },
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        }
      );

      await loginUser({
        username: formData.username,
        password: formData.password,
      });

      toast.success("Registration successful! Logging you in...");
      setTimeout(() => navigate("/"), 3000);
    } catch (error) {
      toast.error(error.message || "Registration failed.");
      console.error("Registration error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="register-page">
      <form onSubmit={handleSubmit} className="register-form">
        <div className="register-form-container">

          {/* Logo — centered above form, matching Login */}
          <div className="logo-container">
            <div className="logo">
              <span className="logo-text">
                <Link to="/">
                  <img src="/logo.png" alt="BallerTalks Logo" />
                </Link>
              </span>
            </div>
          </div>

          <div className="register-form-inner">
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

            <button type="submit" className="btn-custom" disabled={isLoading}>
              {isLoading ? "Creating account..." : "Register"}
            </button>

            <div className="register-links">
              <span>Already have an account? </span>
              <Link to="/login">Login here</Link>
            </div>
          </div>
        </div>
      </form>

      {/* Copyright */}
      {/* <div className="copyright">
        <p>Copyright © {new Date().getFullYear()} BallerTalks</p>
        <div className="footer-links">
          <Link to="/terms">Terms & Conditions</Link>
          <span> | </span>
          <Link to="/privacy">Privacy Policy</Link>
        </div>
      </div> */}

      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        closeOnClick
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </div>
  );
};

export default Register;