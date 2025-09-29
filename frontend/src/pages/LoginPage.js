import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  Paper,
  Divider,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import GoogleIcon from '@mui/icons-material/Google';

// --- Styled Components ---

// Main flex container for the page
const PageContainer = styled(Box)({
  display: "flex",
  height: "100vh",
  width: "100vw",
});

// The RIGHT-side image section, now taking up 60% of the width
const ImageSection = styled(Box)({
  flex: '1 1 60%', // Adjusts flex-basis to 60%
  backgroundImage:
    'url("https://img.freepik.com/premium-vector/dynamic-stock-trading-analysis-vector-illustration_1089479-28075.jpg?semt=ais_hybrid&w=740&q=80")',
  backgroundSize: "cover",
  backgroundPosition: "center",
  position: "relative",
  "&::before": {
    content: '""',
    position: "absolute",
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.4)", // dark overlay
  },
  '@media (maxWidth: 900px)': {
      display: 'none', // Hide image on smaller screens
  },
});

// The LEFT-side login form section, now taking up 40% of the width
const LoginFormSection = styled(Paper)({
  flex: '1 1 40%', // Adjusts flex-basis to 40%
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  padding: "40px",
  backgroundColor: "#0A0A0A",
  color: "#FFFFFF",
  borderRadius: 0,
  boxShadow: "none",
  position: "relative",
  overflow: "hidden",
});

// Custom styled text field
const StyledTextField = styled(TextField)({
  "& .MuiInputLabel-root": { color: "#8A8A8A" },
  "& .MuiOutlinedInput-root": {
    "& fieldset": { borderColor: "#333333" },
    "&:hover fieldset": { borderColor: "#555555" },
    "&.Mui-focused fieldset": { borderColor: "#FFFFFF" },
    "& input": { color: "#FFFFFF" },
  },
});

// White button
const PrimaryButton = styled(Button)({
  backgroundColor: "#FFFFFF",
  color: "#0A0A0A",
  fontWeight: "bold",
  padding: "12px 24px",
  borderRadius: "8px",
  textTransform: "none",
  fontSize: "1rem",
  "&:hover": {
    backgroundColor: "#DDDDDD",
  },
});

// Google button
const GoogleButton = styled(Button)({
  backgroundColor: "transparent",
  color: "#FFFFFF",
  padding: "12px 24px",
  borderRadius: "8px",
  border: "1px solid #333333",
  textTransform: "none",
  fontSize: "1rem",
  "&:hover": {
    backgroundColor: "#1A1A1A",
    borderColor: "#555555",
  },
  display: "flex",
  alignItems: "center",
  gap: "12px",
});

// Decorative background circles
const Circle = styled(Box)(({ size, top, left }) => ({
  position: "absolute",
  width: size,
  height: size,
  backgroundColor: "#191970",
  borderRadius: "50%",
  filter: "blur(80px)",
  opacity: 0.25,
  zIndex: 0,
  top: top,
  left: left,
}));

// --- Login Page Component ---
const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (event) => {
    event.preventDefault();
    setError("");
    try {
      const response = await axios.post("http://127.0.0.1:5000/api/login", {
        username,
        password,
      });
      if (response.data.access_token) {
        localStorage.setItem("accessToken", response.data.access_token);
        navigate("/dashboard");
      }
    } catch (err) {
      setError(
        err.response?.data?.message || "Login failed. Please try again."
      );
    }
  };

  return (
    <PageContainer>
      {/* Left = Login form (40%) */}
      <LoginFormSection>
        <Circle size="250px" top="5%" left="65%" />
        <Circle size="180px" top="50%" left="10%" />

        <Box
          sx={{
            zIndex: 1,
            textAlign: "center",
            width: "100%",
            maxWidth: "400px",
          }}
        >
          <Typography
            variant="h4"
            component="h1"
            sx={{ fontWeight: "bold", color: "#FFFFFF", mb: 1 }}
          >
            tradeAI
          </Typography>
          <Typography
            variant="h5"
            sx={{ mb: 4, color: "#A0A0A0" }}
          >
            Instant access to trading from
            <br />
            comfort of your bitch
          </Typography>

          <Box
            component="form"
            onSubmit={handleLogin}
            sx={{ mt: 1, textAlign: "left" }}
          >
            <Typography
              variant="subtitle1"
              sx={{ color: "#B0B0B0", mb: 0.5 }}
            >
              Username
            </Typography>
            <StyledTextField
              required
              fullWidth
              id="username"
              placeholder="Enter Username"
              name="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              variant="outlined"
              size="small"
              sx={{ mb: 2 }}
            />
            <Typography
              variant="subtitle1"
              sx={{ color: "#B0B0B0", mb: 0.5 }}
            >
              Password
            </Typography>
            <StyledTextField
              required
              fullWidth
              name="password"
              placeholder="Enter Password"
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              variant="outlined"
              size="small"
              sx={{ mb: 3 }}
            />
            <PrimaryButton
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 1, mb: 3 }}
            >
              Enter
            </PrimaryButton>

            <Divider
              sx={{ my: 3, "&::before, &::after": { borderColor: "#333333" } }}
            >
              <Typography variant="body2" sx={{ color: "#A0A0A0" }}>
                Or
              </Typography>
            </Divider>

            <GoogleButton
              fullWidth
              variant="outlined"
             // startIcon={<GoogleIcon />}
              onClick={() => console.log("Google Login clicked")}
            >
              Sign up for new account
            </GoogleButton>

            {error && (
              <Alert
                severity="error"
                sx={{
                  mt: 3,
                  backgroundColor: "#2C1B1B",
                  color: "#FFB3B3",
                }}
              >
                {error}
              </Alert>
            )}
          </Box>
        </Box>
      </LoginFormSection>

      {/* Right = Background image (60%) */}
      <ImageSection />
    </PageContainer>
  );
};

export default LoginPage;

