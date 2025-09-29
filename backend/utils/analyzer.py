# backend/utils/analyzer.py

import yfinance as yf
import pandas as pd
import numpy as np
import joblib
import os
import google.generativeai as genai

# --- Load Models and Configure API ---
MODEL_PATH = '/Users/anishakumari/Downloads/RiskForecaster/backend/models/volatility_model_pipeline.pkl'
pipeline = joblib.load(MODEL_PATH)

# Gemini API will automatically find the key in your environment variables
try:
    genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))
    gemini_model = genai.GenerativeModel('gemini-pro')
except Exception as e:
    print(f"⚠️ Gemini API could not be configured. Check your API key. Error: {e}")
    gemini_model = None

def get_gemini_summary(data):
    """
    Generates a qualitative risk summary using the Gemini API.
    """
    if not gemini_model:
        return "Gemini analysis is currently unavailable."

    # Construct a detailed prompt for the LLM
    prompt = f"""
    You are a professional financial risk analyst based in Bengaluru, providing a concise summary for a retail investor. 
    Analyze the following data for the stock ticker {data['ticker']}.

    Key Financial Metrics:
    - Last Closing Price: {data['lastClosePrice']:.2f}
    - Annualized Historical Volatility (1-year): {data['historicalVolatility']:.1%}
    - AI-Predicted Volatility (next 5 days): {data['predictedVolatility']:.1%}
    - Sharpe Ratio (1-year): {data['sharpeRatio']:.2f}

    Based on this data, provide a brief, easy-to-understand risk summary in about 3-4 sentences.
    
    - Start by stating the current risk level (e.g., "currently shows signs of high risk").
    - Compare the AI-predicted volatility to the historical average. Is the risk expected to increase or decrease in the short term?
    - Briefly comment on the risk-adjusted return based on the Sharpe Ratio (a value > 1 is generally good).
    - Conclude with a final summary sentence.
    
    Do not give financial advice to buy or sell.
    """
    
    try:
        response = gemini_model.generate_content(prompt)
        return response.text
    except Exception as e:
        print(f"❌ Error calling Gemini API: {e}")
        return "An error occurred while generating the AI summary."


def analyze_stock(ticker_symbol):
    """
    Analyzes a stock, now including a Gemini-powered summary.
    """
    try:
        stock = yf.Ticker(ticker_symbol)
        hist_data = stock.history(period="1y") # Need at least 1 year for better metrics
        if hist_data.empty:
            return {"error": "Invalid ticker or no data available."}

        daily_returns = hist_data['Close'].pct_change()
        historical_volatility = daily_returns.std() * np.sqrt(252)
        sharpe_ratio = (daily_returns.mean() * 252) / historical_volatility

        features = pd.DataFrame(index=hist_data.index)
        features['returns'] = daily_returns
        features['vol_21d'] = features['returns'].rolling(window=21).std() * np.sqrt(252)
        features['vol_63d'] = features['returns'].rolling(window=63).std() * np.sqrt(252)
        features['momentum_1m'] = hist_data['Close'].pct_change(periods=21)
        features['momentum_3m'] = hist_data['Close'].pct_change(periods=63)
        
        latest_features = features.iloc[-1:][['vol_21d', 'vol_63d', 'momentum_1m', 'momentum_3m']]
        
        if latest_features.isnull().values.any():
            return {"error": "Not enough historical data to generate features for prediction."}

        predicted_volatility = pipeline.predict(latest_features)[0]

        # Structure the initial data
        analysis_data = {
            "ticker": ticker_symbol,
            "lastClosePrice": round(hist_data['Close'][-1], 2),
            "historicalVolatility": historical_volatility,
            "sharpeRatio": sharpe_ratio,
            "predictedVolatility": predicted_volatility,
            "chartData": {
                "labels": [d.strftime('%Y-%m-%d') for d in hist_data.index],
                "prices": [round(p, 2) for p in hist_data['Close'].tolist()]
            }
        }
        
        # --- Gemini Integration ---
        # Now, call Gemini with the calculated data
        print("🤖 Calling Gemini for an AI summary...")
        ai_summary = get_gemini_summary(analysis_data)
        analysis_data['aiSummary'] = ai_summary
        
        # Format numerical data after Gemini call
        analysis_data['historicalVolatility'] = round(analysis_data['historicalVolatility'], 3)
        analysis_data['sharpeRatio'] = round(analysis_data['sharpeRatio'], 2)
        analysis_data['predictedVolatility'] = round(analysis_data['predictedVolatility'], 3)

        return analysis_data

    except Exception as e:
        return {"error": f"An unexpected error occurred: {str(e)}"}