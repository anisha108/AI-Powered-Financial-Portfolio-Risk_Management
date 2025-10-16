import axios from 'axios';

// The base URL of your running Flask backend
const API_URL = 'http://127.0.0.1:5000/api';

// --- Create an Axios Instance for Authenticated Requests ---
// This special instance will automatically attach the user's login token to
// any request that needs it (like fetching the watchlist).
const api = axios.create({
  baseURL: API_URL,
});

// This is an "interceptor". It's a function that runs before every request
// made with this 'api' instance.
api.interceptors.request.use(
  (config) => {
    // Get the token from the browser's local storage
    const token = localStorage.getItem('accessToken');
    if (token) {
      // If the token exists, add it to the 'Authorization' header
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    // If there's an error setting up the request, reject it
    return Promise.reject(error);
  }
);

// --- Authentication Functions (Public) ---
// These don't need a token, so we use the standard 'axios'
export const registerUser = async (username, password) => {
    const response = await axios.post(`${API_URL}/register`, { username, password });
    return response.data;
};

export const loginUser = async (username, password) => {
    const response = await axios.post(`${API_URL}/login`, { username, password });
    if (response.data.access_token) {
        localStorage.setItem('accessToken', response.data.access_token);
    }
    return response.data;
};


// --- Watchlist Functions (Protected) ---
// These functions use the special 'api' instance, so the token is attached automatically
export const getWatchlist = async () => {
    const response = await api.get('/watchlist');
    return response.data;
};

export const addStockToWatchlist = async (ticker) => {
    const response = await api.post('/watchlist', { ticker });
    return response.data;
};

export const removeStockFromWatchlist = async (ticker) => {
    const response = await api.delete(`/watchlist/${ticker}`);
    return response.data;
};


// --- Analysis & AI Functions ---
// The stock analyzer is public
export const analyzeStock = async (ticker) => {
    const response = await axios.post(`${API_URL}/analyze`, { ticker });
    return response.data;
};

// The AI recommender is protected, so we must use the 'api' instance
export const getRecommendation = async (query) => {
    const token = localStorage.getItem("accessToken");
  
    const response = await fetch("http://127.0.0.1:5000/api/recommend", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": token ? `Bearer ${token}` : "",
      },
      body: JSON.stringify({ query }),
    });
  
    if (!response.ok) {
      throw new Error(`HTTP error ${response.status}`);
    }
  
    return response.json();
  };

// The ticker bar data is public
export const getTickerData = async () => {
    const response = await axios.get(`${API_URL}/ticker-data`);
    return response.data;
};

export const getRiskAlerts = async () => {
    const token = localStorage.getItem('token');
    const response = await fetch('http://127.0.0.1:5000/api/risk-alerts', {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok) throw new Error("Failed to fetch risk alerts");
    return await response.json();
  };
  