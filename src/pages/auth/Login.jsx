import React, { useState } from "react";
import {
  TextField,
  Button,
  Typography,
  Box,
  Paper,
  MenuItem,
  Snackbar,
  Alert,
  InputAdornment,
} from "@mui/material";
import { Link } from "react-router-dom";
import { LogIn, UserPlus, Eye, EyeOff } from "lucide-react";
import LockIcon from "@mui/icons-material/Lock";

const roles = [
  { label: "Student", value: "student" },
  { label: "Teacher", value: "teacher" },
  { label: "Admin", value: "admin" },
];

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "student",
  });
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [passwordError, setPasswordError] = useState("");
  const [nameError, setNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    if (e.target.name === "password") {
      if (!isLogin && e.target.value.length > 0 && e.target.value.length < 6) {
        setPasswordError("Password must be at least 6 characters");
      } else {
        setPasswordError("");
      }
    }
    if (e.target.name === "name") {
      if (!isLogin && e.target.value.trim().length === 0) {
        setNameError("Name is required");
      } else {
        setNameError("");
      }
    }
    if (e.target.name === "email") {
      if (!e.target.value || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e.target.value)) {
        setEmailError("Valid email is required");
      } else {
        setEmailError("");
      }
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const validateForm = () => {
    if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setSnackbar({ open: true, message: "Valid email is required", severity: "error" });
      return false;
    }
    if (!formData.password || (isLogin ? false : formData.password.length < 6)) {
      setSnackbar({ open: true, message: isLogin ? "Password is required" : "Password must be at least 6 characters", severity: "error" });
      return false;
    }
    if (!isLogin && !formData.name.trim()) {
      setSnackbar({ open: true, message: "Name is required", severity: "error" });
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setLoading(true);
    try {
      const endpoint = isLogin
        ? "https://eduminds-production-180d.up.railway.app/api/auth/login"
        : "https://eduminds-production-180d.up.railway.app/api/auth/register";
      const payload = isLogin
        ? { email: formData.email, password: formData.password }
        : formData;

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        localStorage.setItem("userId", data.user.id || data.user._id);
        localStorage.setItem("role", data.user.role);

        setSnackbar({
          open: true,
          message: isLogin
            ? `Welcome back, ${data.user.name || data.user.email}!`
            : `Registration successful! Welcome, ${data.user.name || data.user.email}!`,
          severity: "success",
        });

        setTimeout(() => {
          // Redirect based on role
          if (data.user.role === "admin") {
            window.location.href = "/admin/dashboard";
          } else if (data.user.role === "teacher") {
            window.location.href = "/teacher/dashboard";
          } else {
            window.location.href = "/student/dashboard";
          }
        }, 1200);
      } else {
        setSnackbar({
          open: true,
          message: data.message || "Server Error",
          severity: "error",
        });
      }
    } catch (err) {
      setSnackbar({
        open: true,
        message: "Something went wrong. Please try again.",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #eaf2fe 0%, #e0e7ff 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Paper
        elevation={3}
        sx={{
          p: 4,
          borderRadius: 3,
          width: 500, // was 370
          maxWidth: "95vw",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography
          variant="h5"
          sx={{ fontWeight: 700, color: "#1565d8", mb: 1, mt: 1 }}
          align="center"
        >
          {isLogin ? "Welcome Back" : "Join EduMinds"}
        </Typography>
        <Typography
          variant="subtitle1"
          sx={{ color: "#333", mb: 3 }}
          align="center"
        >
          {isLogin ? "Sign in to your account" : "Create your account"}
        </Typography>
        <form onSubmit={handleSubmit} style={{ width: "100%" }}>
          {!isLogin && (
            <Box mb={2}>
              <Typography
                variant="subtitle2"
                sx={{ fontWeight: 600, mb: 0.5 }}
              >
                Full Name
              </Typography>
              <TextField
                placeholder="Enter your full name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                fullWidth
                required
                size="small"
                error={!isLogin && !!nameError}
                helperText={!isLogin && nameError ? nameError : ""}
              />
            </Box>
          )}
          <Box mb={2}>
            <Typography
              variant="subtitle2"
              sx={{ fontWeight: 600, mb: 0.5 }}
            >
              Email
            </Typography>
            <TextField
              placeholder="Enter your email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              fullWidth
              required
              size="small"
              error={!!emailError}
              helperText={emailError}
            />
          </Box>
          <Box mb={2}>
            <Typography
              variant="subtitle2"
              sx={{ fontWeight: 600, mb: 0.5 }}
            >
              Password
            </Typography>
            <div style={{ position: "relative" }}>
              <TextField
                placeholder="Enter your password"
                name="password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={handleInputChange}
                fullWidth
                required
                size="small"
                error={!isLogin && !!passwordError}
                helperText={!isLogin && passwordError ? passwordError : ""}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockIcon fontSize="small" sx={{ color: "#888" }} />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <span
                      style={{
                        cursor: "pointer",
                        position: "absolute",
                        right: 10,
                        top: "50%",
                        transform: "translateY(-50%)",
                        zIndex: 2,
                        color: "#888"
                      }}
                      onClick={() => setShowPassword((prev) => !prev)}
                      tabIndex={0}
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </span>
                  ),
                  style: { paddingRight: 36 }
                }}
              />
            </div>
            {isLogin && (
              <Box mt={1}>
                <Button
                  component={Link}
                  to="/auth/forgot-password"
                  variant="text"
                  sx={{
                    color: "#1565d8",
                    fontWeight: 600,
                    textTransform: "none",
                    fontSize: 14,
                    p: 0,
                    minWidth: 0,
                  }}
                >
                  Forgot password?
                </Button>
              </Box>
            )}
          </Box>
          {!isLogin && (
            <Box mb={2}>
              <Typography
                variant="subtitle2"
                sx={{ fontWeight: 600, mb: 0.5 }}
              >
                Role
              </Typography>
              <TextField
                select
                name="role"
                value={formData.role}
                onChange={handleInputChange}
                fullWidth
                size="small"
              >
                {roles.map((role) => (
                  <MenuItem key={role.value} value={role.value}>
                    {role.label}
                  </MenuItem>
                ))}
              </TextField>
            </Box>
          )}
          <Button
            variant="contained"
            type="submit"
            color="primary"
            fullWidth
            sx={{
              py: 1.2,
              fontWeight: 600,
              fontSize: "1rem",
              mt: 1,
              mb: 1,
              background: "#1565d8",
              textTransform: "none",
            }}
            disabled={loading}
            startIcon={
              loading
                ? null
                : isLogin
                ? <LogIn className="mr-2 h-4 w-4" />
                : <UserPlus className="mr-2 h-4 w-4" />
            }
          >
            {loading ? "Loading..." : isLogin ? "Sign In" : "Sign Up"}
          </Button>
        </form>
        <Typography mt={2} align="center" sx={{ fontSize: 15 }}>
          <Button
            variant="text"
            onClick={() => setIsLogin(!isLogin)}
            sx={{
              color: "#1565d8",
              fontWeight: 600,
              textTransform: "none",
            }}
          >
            {isLogin
              ? "Don't have an account? Sign up"
              : "Already have an account? Sign in"}
          </Button>
        </Typography>
      </Paper>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={2500}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Login;
