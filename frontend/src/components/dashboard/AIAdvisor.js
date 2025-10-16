import React, { useState } from 'react';
import { Box, Typography, TextField, Button, Paper, CircularProgress, Alert } from '@mui/material';
import { styled } from '@mui/system';
import ReactMarkdown from 'react-markdown';
import { getRecommendation } from '../../api/apiService';

// --- Styled Components ---

const AdvisorContainer = styled(Paper)({
    backgroundColor: '#1E2235',
    padding: '1.5rem',
    color: '#fff',
    // Adjust height to fit within the viewport below the header and ticker
    height: 'calc(100vh - 200px)', 
    display: 'flex',
    flexDirection: 'column',
});

const ResponseDisplay = styled(Box)({
    flexGrow: 1,
    overflowY: 'auto',
    padding: '1rem',
    backgroundColor: '#161A25',
    borderRadius: '8px',
    // Styling for the markdown output from Gemini
    '& p, & li': {
        color: '#A4A6B3',
        fontSize: '0.9rem',
        lineHeight: '1.6',
    },
    '& h1, & h2, & h3, & strong': {
        color: '#FFFFFF',
    },
    '& h3': {
        marginTop: '1.5em',
        marginBottom: '0.5em',
        borderBottom: '1px solid #2D334E',
        paddingBottom: '0.3em'
    }
});

// --- AI Advisor Component ---

const AIAdvisor = () => {
    const [query, setQuery] = useState('');
    const [response, setResponse] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleAsk = async () => {
        if (!query) return; // Don't send empty queries
        setLoading(true);
        setResponse('');
        setError('');

        try {
            // This is the REAL API call to your backend
            const data = await getRecommendation(query);
            setResponse(data.recommendation);
        } catch (err) {
            // Provide a more helpful error message for token-related issues
            if (err.message.includes('401') || err.message.includes('422')) {
                setError("Your session may have expired. Please log out and log back in to use the AI Advisor.");
            } else {
                setError(err.message);
            }
        }
        setLoading(false);
    };

    return (
        <AdvisorContainer>
            <Typography variant="h6" sx={{ mb: 2 }}>tradeAI Advisor</Typography>
            
            {/* This is where the AI's response will be displayed */}
            <ResponseDisplay>
                {loading && (
                    <Box sx={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%'}}>
                        <CircularProgress />
                    </Box>
                )}
                
                {error && <Alert severity="error" sx={{backgroundColor: '#2C1B1B', color: '#FFB3B3'}}>{error}</Alert>}
                
                {!loading && !error && response && <ReactMarkdown>{response}</ReactMarkdown>}
                
                {!loading && !error && !response && (
                    <Typography sx={{color: '#A4A6B3'}}>e.g., "Suggest a high-growth tech stock not in my watchlist."</Typography>
                )}
            </ResponseDisplay>
            
            {/* This is the input form */}
            <Box sx={{ display: 'flex', mt: 2, gap: 1 }}>
                <TextField 
                    fullWidth 
                    variant="outlined" 
                    size="small" 
                    placeholder="Ask a question..." 
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleAsk()} // Allow pressing Enter to submit
                    disabled={loading}
                    sx={{
                        '& .MuiOutlinedInput-root': {
                          backgroundColor: '#2D334E',
                          '& fieldset': { borderColor: 'transparent' },
                        },
                        '& .MuiInputBase-input': { color: '#fff' },
                    }}
                />
                <Button variant="contained" onClick={handleAsk} disabled={loading}>
                    Ask
                </Button>
            </Box>
        </AdvisorContainer>
    );
};

export default AIAdvisor;

