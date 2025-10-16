// src/pages/AIAdvisorPage.js
import React, { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  IconButton,
  Paper,
  Avatar,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import SmartToyOutlinedIcon from "@mui/icons-material/SmartToyOutlined";
import { getRecommendation } from "../api/apiService";

const AIAdvisorPage = () => {
  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text: "Hello! I'm your AI Trading Advisor. I can help you with market analysis, portfolio recommendations, and trading strategies. How can I assist you today?",
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMessage = {
      sender: "user",
      text: input,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const response = await getRecommendation(input);
      const aiText =
        response.recommendation ||
        response.response ||
        "I couldn't find an answer. Please try again.";

      const botMessage = {
        sender: "bot",
        text: aiText,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (err) {
      const botMessage = {
        sender: "bot",
        text: "Sorry, there was an error connecting to the AI service.",
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, botMessage]);
    }

    setLoading(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") handleSend();
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100%",
        backgroundColor: "#121212", // dark background
        padding: 2,
      }}
    >
      <Paper
        elevation={3}
        sx={{
          width: "100%",
          maxWidth: 600,
          borderRadius: 4,
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          height: "80vh",
          backgroundColor: "#1e1e1e", // dark paper
          color: "#fff",
        }}
      >
        {/* Header */}
        <Box
          sx={{
            p: 2,
            borderBottom: "1px solid #333",
            display: "flex",
            alignItems: "center",
            gap: 1,
            backgroundColor: "#1b1b1b",
          }}
        >
          <SmartToyOutlinedIcon sx={{ color: "#90caf9" }} />
          <Typography variant="h6" sx={{ color: "#fff" }}>
            Chat with AI Advisor
          </Typography>
        </Box>

        {/* Chat Area */}
        <Box
          sx={{
            flexGrow: 1,
            p: 2,
            overflowY: "auto",
            display: "flex",
            flexDirection: "column",
            gap: 2,
            backgroundColor: "#121212",
          }}
        >
          {messages.map((msg, index) => (
            <Box
              key={index}
              sx={{
                display: "flex",
                flexDirection: msg.sender === "user" ? "row-reverse" : "row",
                alignItems: "flex-end",
                gap: 1,
              }}
            >
              {msg.sender === "bot" && (
                <Avatar sx={{ bgcolor: "#1976d2" }}>
                  <SmartToyOutlinedIcon />
                </Avatar>
              )}
              <Box
                sx={{
                  backgroundColor: msg.sender === "user" ? "#1976d2" : "#2c2c2c",
                  color: msg.sender === "user" ? "#fff" : "#fff",
                  p: 1.5,
                  borderRadius: 2,
                  maxWidth: "75%",
                  wordBreak: "break-word",
                }}
              >
                <Typography>{msg.text}</Typography>
                <Typography
                  variant="caption"
                  sx={{
                    display: "block",
                    textAlign: msg.sender === "user" ? "right" : "left",
                    mt: 0.5,
                    color: "#bbb",
                  }}
                >
                  {msg.time}
                </Typography>
              </Box>
            </Box>
          ))}
          {loading && (
            <Typography sx={{ color: "#888", textAlign: "center" }}>
              Thinking...
            </Typography>
          )}
        </Box>

        {/* Input Area */}
        <Box
          sx={{
            p: 2,
            borderTop: "1px solid #333",
            display: "flex",
            gap: 1,
            backgroundColor: "#1b1b1b",
          }}
        >
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Ask me anything about trading..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            InputProps={{
              style: {
                backgroundColor: "#2c2c2c",
                color: "#fff",
              },
            }}
          />
          <IconButton color="primary" onClick={handleSend} disabled={loading}>
            <SendIcon sx={{ color: "#90caf9" }} />
          </IconButton>
        </Box>
      </Paper>
    </Box>
  );
};

export default AIAdvisorPage;
