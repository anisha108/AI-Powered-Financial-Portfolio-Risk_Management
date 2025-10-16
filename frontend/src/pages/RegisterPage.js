import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import {
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  Paper,
  Link as MuiLink,
} from "@mui/material";
import { styled } from "@mui/system";

// --- Styled Components (Consistent with LoginPage) ---

const PageContainer = styled(Box)({
  display: "flex",
  height: "100vh",
  width: "100%",
});

const FormSection = styled(Paper)({
  flex: 1,
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  padding: "40px",
  backgroundColor: "#0A0A0A",
  color: "#FFFFFF",
  borderRadius: 0,
  boxShadow: "none",
});

const ImageSection = styled(Box)({
  flex: 1,
  backgroundImage:
    'url("https://img.freepik.com/premium-vector/dynamic-stock-trading-analysis-vector-illustration_1089479-28075.jpg?semt=ais_hybrid&w=740&q=80")',
  backgroundSize: "cover",
  backgroundPosition: "center",
  '@media (maxWidth: 900px)': {
    display: 'none',
  },
});

const StyledTextField = styled(TextField)({
    '& .MuiInputLabel-root': { color: '#8A8A8A' },
    '& .MuiOutlinedInput-root': {
      '& fieldset': { borderColor: '#333333' },
      '&:hover fieldset': { borderColor: '#555555' },
      '&.Mui-focused fieldset': { borderColor: '#FFFFFF' },
      '& input': { color: '#FFFFFF' },
    },
});

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


// --- Registration Page Component ---
const RegisterPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    try {
      // API call to your backend's /api/register endpoint
      const response = await axios.post("http://127.0.0.1:5000/api/register", {
        username,
        password,
      });

      // On success, show a message and redirect to the login page
      setSuccess(response.data.message + ". Redirecting to login...");
      setTimeout(() => {
        navigate("/login");
      }, 2000); // Wait 2 seconds before redirecting

    } catch (err) {
      // If the backend returns an error (e.g., "Username already exists"), display it
      setError(
        err.response?.data?.message || "Registration failed. Please try again."
      );
    }
  };

  return (
    <PageContainer>
      <FormSection>
        <Box sx={{ width: '100%', maxWidth: '400px', textAlign: 'center' }}>
          <Typography variant="h4" gutterBottom fontWeight="bold">
            tradeAI
          </Typography>
          <Typography variant="h5" sx={{ color: '#A0A0A0', mb: 4 }}>
            Create your account to start forecasting
          </Typography>

          <Box component="form" onSubmit={handleRegister} sx={{ textAlign: 'left', width: '100%' }}>
            <Typography variant="h6" sx={{ mb: 2 }}>Sign Up</Typography>
            <Typography variant="subtitle1" sx={{ color: '#B0B0B0' }}>Username</Typography>
            <StyledTextField
              placeholder="Choose a username"
              fullWidth
              margin="dense"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            <Typography variant="subtitle1" sx={{ color: '#B0B0B0', mt: 2 }}>Password</Typography>
            <StyledTextField
              placeholder="Create a password"
              type="password"
              fullWidth
              margin="dense"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <PrimaryButton
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3 }}
            >
              Create Account
            </PrimaryButton>
          </Box>

          {error && <Alert severity="error" sx={{ mt: 2, backgroundColor: '#2C1B1B', color: '#FFB3B3' }}>{error}</Alert>}
          {success && <Alert severity="success" sx={{ mt: 2, backgroundColor: '#1B2C1B', color: '#B3FFB3' }}>{success}</Alert>}
          
          <Typography variant="body2" sx={{ mt: 3 }}>
            Already have an account?{' '}
            <MuiLink component={Link} to="/login" sx={{ color: '#FFFFFF', fontWeight: 'bold' }}>
              Sign In
            </MuiLink>
          </Typography>
        </Box>
      </FormSection>
      <ImageSection />
    </PageContainer>
  );
};

export default RegisterPage;

