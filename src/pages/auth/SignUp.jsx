import { Link } from "react-router-dom";          
import React, { useState } from "react";
import {
  Dialog,
  TextField,
  Button,
  Typography,
  Box,
  Paper,
  MenuItem,
} from "@mui/material";
import axios from "axios";
import { Eye, EyeOff, UserPlus } from "lucide-react";

const roles = [
  { label: "Student", value: "student" },
  { label: "Teacher", value: "teacher" },
  { label: "Admin", value: "admin" }
];

const Signup = () => {
  const [open] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "student"
  });
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("https://eduminds-production-180d.up.railway.app/api/auth/register", formData);
      alert("Signup successful! Please login.");
      window.location.href = "/login";
    } catch (err) {
      alert("Signup failed: " + (err.response?.data?.message || "Server Error"));
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "#eaf2fe",
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
          width: 430,
          maxWidth: "95vw",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        {/* Logo above title */}
        <img
          src="/assets/logo.png"
          alt="EduMinds Logo"
          style={{ width: 60, height: 60, objectFit: 'contain', marginBottom: 8 }}
        />
        {/* Debug: Check if this renders */}
        {/* <Typography color="secondary" align="center" sx={{ mb: 1 }}>
          Signup form below
        </Typography> */}
        <Typography
          variant="h5"
          sx={{ fontWeight: 700, color: "#1565d8", mb: 1, mt: 1 }}
          align="center"
        >
          Join EduMinds
        </Typography>
        <Typography
          variant="subtitle1"
          sx={{ color: "#333", mb: 3 }}
          align="center"
        >
          Create your account
        </Typography>
        <form onSubmit={handleSignup} style={{ width: "100%" }}>
          <Box mb={2}>
            <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 0.5 }}>
              Full Name
            </Typography>
            <TextField
              placeholder="Enter your full name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              fullWidth
              required
              size="small"
            />
          </Box>
          <Box mb={2}>
            <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 0.5 }}>
              Email
            </Typography>
            <TextField
              placeholder="Enter your email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              fullWidth
              required
              size="small"
            />
          </Box>
          <Box mb={2}>
            <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 0.5 }}>
              Password
            </Typography>
            <div style={{ position: "relative" }}>
              <TextField
                placeholder="Enter your password"
                name="password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={handleChange}
                fullWidth
                required
                size="small"
                InputProps={{
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
          </Box>
          <Box mb={2}>
            <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 0.5 }}>
              Role
            </Typography>
            <TextField
              select
              name="role"
              value={formData.role}
              onChange={handleChange}
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
          <Button
            type="submit"
            variant="contained"
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
            startIcon={
              <UserPlus style={{ color: "#1565d8" }} size={22} />
            }
          >
            Sign Up
          </Button>
        </form>
        <Typography mt={2} align="center" sx={{ fontSize: 15 }}>
          Already have an account?{" "}
          <Link to="/auth/login" style={{ color: "#1565d8", fontWeight: 600 }}>
            Sign in
          </Link>
        </Typography>
      </Paper>
    </Box>
  );
};

export default Signup;
