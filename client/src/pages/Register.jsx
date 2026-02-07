import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../Styles/auth.css";

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validateField = (name, value) => {
    let message = "";

    if (name === "name") {
      if (!value) message = "Username is required";
      else if (value.length < 3)
        message = "Username must be at least 3 characters";
    }

    if (name === "email") {
      if (!value) message = "Email is required";
      else if (!/\S+@\S+\.\S+/.test(value)) message = "Invalid email format";
    }

    if (name === "password") {
      if (!value) message = "Password is required";
      else if (value.length < 6)
        message = "Password must be at least 6 characters";
    }

    setErrors((prev) => ({ ...prev, [name]: message }));
    return message === "";
  };

  const passwordStrength = (pwd) => {
    if (!pwd) return "";
    if (pwd.length >= 12 && /[0-9]/.test(pwd) && /[^A-Za-z0-9]/.test(pwd))
      return "Strong";
    if (pwd.length >= 8) return "Medium";
    return "Weak";
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.name) {
      newErrors.name = "Username is required";
    } else if (formData.name.length < 3) {
      newErrors.name = "Username must be at least 3 characters";
    }

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const { register } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError("");
    if (!validate()) return;

    try {
      setLoading(true);
      await register(formData);
      navigate("/");
    } catch (err) {
      setServerError(err.response?.data?.message || "Register failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <form className="auth-form" onSubmit={handleSubmit}>
        <div className="auth-title">
          <h2>
            Join <span>ChatZone</span>
          </h2>
        </div>

        <label htmlFor="name" className="sr-only">
          Username
        </label>
        <input
          id="name"
          type="text"
          name="name"
          placeholder="Username"
          value={formData.name}
          onChange={handleChange}
          onBlur={(e) => validateField(e.target.name, e.target.value)}
          aria-invalid={!!errors.name}
          aria-describedby={errors.name ? "name-error" : undefined}
        />
        {errors.name && (
          <span id="name-error" className="error">
            {errors.name}
          </span>
        )}

        <label htmlFor="email" className="sr-only">
          Email
        </label>
        <input
          id="email"
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          onBlur={(e) => validateField(e.target.name, e.target.value)}
          aria-invalid={!!errors.email}
          aria-describedby={errors.email ? "email-error" : undefined}
        />
        {errors.email && (
          <span id="email-error" className="error">
            {errors.email}
          </span>
        )}

        <div className="password-wrapper">
          <label htmlFor="password" className="sr-only">
            Password
          </label>
          <input
            id="password"
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            onBlur={(e) => validateField(e.target.name, e.target.value)}
            aria-invalid={!!errors.password}
            aria-describedby={errors.password ? "password-error" : undefined}
          />
          <span
            className="toggle-password"
            onClick={() => setShowPassword((prev) => !prev)}
          >
            {showPassword ? "Hide" : "Show"}
          </span>
        </div>
        {errors.password && (
          <span id="password-error" className="error">
            {errors.password}
          </span>
        )}

        {formData.password && (
          <small
            className={`pw-strength ${passwordStrength(formData.password) || ""}`}
          >
            Strength: {passwordStrength(formData.password)}
          </small>
        )}

        {serverError && <span className="error">{serverError}</span>}

        <button type="submit" disabled={loading}>
          {loading ? "Signing up..." : "Sign Up"}
        </button>

        <p className="auth-switch">
          Already have an account?{" "}
          <span onClick={() => navigate("/login")}>Login</span>
        </p>
      </form>
    </div>
  );
}

export default Register;
