import React, { useState } from 'react';

// This is a placeholder for the function that will call your backend
// We will create it in the next step.
// import { getAnalysis } from '../api/analysisService'; 

const HomePage = () => {
    const [ticker, setTicker] = useState('');
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleAnalyze = async () => {
        // This is where you will call your backend API
        console.log("Analyzing ticker:", ticker);
        // In the next step, we'll uncomment the lines below
        // setLoading(true);
        // setError('');
        // setData(null);
        // try {
        //     const result = await getAnalysis(ticker);
        //     setData(result.data);
        // } catch (err) {
        //     setError(err.message);
        // }
        // setLoading(false);
    };

    return (
        <div>
            <header style={{ textAlign: 'center', marginBottom: '2rem' }}>
                <h1>RiskForecaster</h1>
                <p>AI-Powered Financial Portfolio Risk Management Tool</p>
            </header>

            <main>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
                    <input
                        type="text"
                        value={ticker}
                        onChange={(e) => setTicker(e.target.value.toUpperCase())}
                        placeholder="Enter stock ticker (e.g., INFY.NS)"
                        style={{ padding: '10px', width: '300px', fontSize: '1rem' }}
                    />
                    <button 
                        onClick={handleAnalyze} 
                        disabled={!ticker || loading}
                        style={{ padding: '10px 20px', fontSize: '1rem', cursor: 'pointer' }}
                    >
                        {loading ? 'Analyzing...' : 'Analyze'}
                    </button>
                </div>

                {error && <p style={{ color: 'red', textAlign: 'center' }}>Error: {error}</p>}

                {/* This is where the results will be displayed */}
                {data && (
                    <div style={{ marginTop: '2rem' }}>
                        <h2>Analysis for {data.ticker}</h2>
                        {/* We will add Metric Cards and the Chart component here later */}
                        <p>Last Price: {data.lastClosePrice}</p>
                        <p>Predicted Volatility: {data.predictedVolatility}</p>
                        <p>AI Summary: {data.aiSummary}</p>
                    </div>
                )}
            </main>
        </div>
    );
};

export default HomePage;