import yfinance as yf
import pandas as pd
import numpy as np
import joblib
import os
import google.generativeai as genai
from datetime import datetime

# --- Load Models and Configure API ---
# This robust, relative path finds the model file by going up one directory from `utils`
# and then into the `models` folder. This is the most reliable way to do it.
MODEL_PATH = os.path.join(os.path.dirname(__file__), '..', 'models', 'volatility_model_pipeline.pkl')

pipeline = None
gemini_model = None

# Try to load the AI volatility model
try:
    pipeline = joblib.load(MODEL_PATH)
    print("✅ AI volatility model loaded successfully.")
except FileNotFoundError:
    print(f"❌ FATAL ERROR: Model file not found at {MODEL_PATH}. Please run 'python train_model_pipeline.py' to create it.")
except Exception as e:
    print(f"❌ FATAL ERROR: Could not load model file. It might be corrupted. Error: {e}")

# Try to initialize the Gemini API
try:
    # This automatically finds the GOOGLE_API_KEY you set in your terminal
    genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))
    # Use the current, valid model name
    gemini_model = genai.GenerativeModel('models/gemini-2.0-flash')
    print("✅ Gemini model initialized successfully.")
except Exception as e:
    print(f"⚠️ Gemini API could not be configured. Check if your GOOGLE_API_KEY is set correctly. Error: {e}")


def get_gemini_summary(data):
    """
    Generates a qualitative risk summary for a single stock (used in the watchlist).
    """
    if not gemini_model:
        return "AI summary is currently unavailable."
    prompt = f"""
    You are a professional financial risk analyst. Based on the following data for {data['ticker']}, 
    provide a brief, 2-sentence summary of the stock's near-term risk profile.
    - Last Closing Price: {data['lastClosePrice']:.2f}
    - AI-Predicted Volatility (next 5 days): {data['predictedVolatility']:.1%}
    Do not give financial advice.
    """
    try:
        response = gemini_model.generate_content(prompt)
        return response.text
    except Exception as e:
        print(f"❌ Error in get_gemini_summary: {e}")
        return "AI summary could not be generated."

def analyze_stock(ticker_symbol):
    """
    Performs a full analysis on a single stock, including a Gemini summary.
    """
    if not pipeline:
        return {"error": "The AI volatility model is not loaded. Cannot perform analysis."}
        
    try:
        stock = yf.Ticker(ticker_symbol)
        hist_data = stock.history(period="1y")
        if hist_data.empty:
            return {"error": "Invalid ticker or no data available."}

        daily_returns = hist_data['Close'].pct_change()
        historical_volatility = daily_returns.std() * np.sqrt(252)
        sharpe_ratio = (daily_returns.mean() * 252) / historical_volatility

        # Re-create the exact same features the model was trained on
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

        analysis_data = {
            "ticker": ticker_symbol, "lastClosePrice": round(hist_data['Close'][-1], 2),
            "historicalVolatility": historical_volatility, "sharpeRatio": sharpe_ratio,
            "predictedVolatility": predicted_volatility,
            "chartData": {
                "labels": [d.strftime('%Y-%m-%d') for d in hist_data.index],
                "prices": [round(p, 2) for p in hist_data['Close'].tolist()]
            }
        }
        
        ai_summary = get_gemini_summary(analysis_data)
        analysis_data['aiSummary'] = ai_summary
        
        analysis_data['historicalVolatility'] = round(analysis_data['historicalVolatility'], 3)
        analysis_data['sharpeRatio'] = round(analysis_data['sharpeRatio'], 2)
        analysis_data['predictedVolatility'] = round(analysis_data['predictedVolatility'], 3)

        return analysis_data
    except Exception as e:
        return {"error": f"An unexpected error occurred during analysis: {str(e)}"}

def get_ai_recommendation(user_query, watchlist_tickers):
    """
    Generates a detailed financial recommendation for the AI Advisor.
    """
    if not gemini_model:
        return "The AI Advisor is currently unavailable."
    prompt = f"""
    You are tradeAI, a sophisticated and cautious financial AI advisor based in Bengaluru, India.
    A user's watchlist includes: {', '.join(watchlist_tickers) if watchlist_tickers else 'None'}.
    Their question is: "{user_query}".
    Provide a comprehensive, markdown-formatted recommendation with analysis, market context, 2-3 actionable suggestions (buy/sell/hold), and a disclaimer.
    """
    try:
        response = gemini_model.generate_content(prompt)
        return response.text
    except Exception as e:
        print(f"❌ Error calling Gemini API for recommendation: {e}")
    return f"AI model unavailable: {str(e)}"


def get_all_nse_tickers_data():
    # You can load from yfinance ticker list or maintain your own CSV if you prefer.
    # For demonstration, let's use a sample of top NSE tickers.
    nse_tickers = [
        "RELIANCE.NS", "TCS.NS", "INFY.NS", "HDFCBANK.NS", "ICICIBANK.NS", "SBIN.NS",
        "BHARTIARTL.NS", "HINDUNILVR.NS", "ITC.NS", "LT.NS", "ASIANPAINT.NS", "BAJFINANCE.NS",
        "AXISBANK.NS", "HCLTECH.NS", "WIPRO.NS", "KOTAKBANK.NS", "MARUTI.NS", "SUNPHARMA.NS",
        "TITAN.NS", "ULTRACEMCO.NS", "TECHM.NS", "ONGC.NS", "POWERGRID.NS", "TATASTEEL.NS",
        "JSWSTEEL.NS", "ADANIENT.NS", "ADANIPORTS.NS", "COALINDIA.NS", "BPCL.NS", "NTPC.NS"
    ]

    data = []
    tickers = yf.download(nse_tickers, period="1d", group_by="ticker", threads=True)

    for symbol in sorted(nse_tickers):
        try:
            hist = tickers[symbol]
            if not hist.empty:
                last_price = round(hist["Close"].iloc[-1], 2)
                prev_price = round(hist["Open"].iloc[0], 2)
                change = last_price - prev_price
                percent_change = round((change / prev_price) * 100, 2)
                data.append({
                    "name": symbol.replace(".NS", ""),
                    "value": f"{last_price:,}",
                    "change": f"{percent_change:+.2f}%",
                    "isNegative": percent_change < 0
                })
        except Exception:
            continue

    return sorted(data, key=lambda x: x["name"])
# utils/analyzer.py

import yfinance as yf

def get_batch_ticker_data(ticker_list):
    results = []

    for ticker in ticker_list:
        try:
            stock = yf.Ticker(ticker)
            hist = stock.history(period="2d")
            if hist.empty or len(hist) < 2:
                print(f"No data for {ticker}")
                continue

            latest_price = round(hist['Close'].iloc[-1], 2)
            previous_price = round(hist['Close'].iloc[-2], 2)
            change = latest_price - previous_price
            change_percent = round((change / previous_price) * 100, 2)

            results.append({
                "name": ticker,
                "value": f"{latest_price:,.2f}",
                "change": f"{change_percent:+.2f}%",
                "isNegative": bool(change < 0)  # ✅ convert to Python bool
            })

        except Exception as e:
            print(f"Error fetching {ticker}: {e}")

    return results
