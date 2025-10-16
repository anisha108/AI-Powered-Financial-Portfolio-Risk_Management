import yfinance as yf
import pandas as pd
import numpy as np
import joblib
import os
from sklearn.ensemble import RandomForestRegressor
from sklearn.model_selection import TimeSeriesSplit, GridSearchCV
from sklearn.preprocessing import StandardScaler
from sklearn.pipeline import Pipeline

# --- Configuration ---
TICKER = "SPY"
TRAINING_PERIOD = "15y"
N_SPLITS = 5
# This relative path saves the model in the 'models' subfolder, relative to this script's location.
MODEL_PATH = os.path.join(os.path.dirname(__file__), 'models', 'volatility_model_pipeline.pkl')

def train_pipeline():
    """A complete pipeline to create and save the AI model."""
    print("🚀 Starting model training pipeline...")
    try:
        data = yf.Ticker(TICKER).history(period=TRAINING_PERIOD)
        if data.empty:
            print(f"❌ Error: No data for {TICKER}."); return
        print(f"✅ Downloaded {len(data)} data points.")
        
        data['returns'] = data['Close'].pct_change()
        data['vol_21d'] = data['returns'].rolling(window=21).std() * np.sqrt(252)
        data['vol_63d'] = data['returns'].rolling(window=63).std() * np.sqrt(252)
        data['momentum_1m'] = data['Close'].pct_change(periods=21)
        data['momentum_3m'] = data['Close'].pct_change(periods=63)
        data['target_volatility'] = data['vol_21d'].shift(-5)
        data.dropna(inplace=True)
        
        features_list = ['vol_21d', 'vol_63d', 'momentum_1m', 'momentum_3m']
        X = data[features_list]
        y = data['target_volatility']
        
        if X.empty:
            print("❌ Error: Not enough data for training."); return
        print("✅ Feature engineering complete.")

        tscv = TimeSeriesSplit(n_splits=N_SPLITS)
        pipeline = Pipeline([
            ('scaler', StandardScaler()),
            ('regressor', RandomForestRegressor(random_state=42)) 
        ])
        param_grid = {'regressor__n_estimators': [50, 100], 'regressor__max_depth': [5, 10]}
        
        print("⏳ Performing GridSearchCV...")
        grid_search = GridSearchCV(pipeline, param_grid, cv=tscv, scoring='r2') 
        grid_search.fit(X, y)
        
        final_model_pipeline = grid_search.best_estimator_
        final_model_pipeline.fit(X, y)
        print("✅ Final model trained.")
        
        os.makedirs(os.path.dirname(MODEL_PATH), exist_ok=True)
        joblib.dump(final_model_pipeline, MODEL_PATH)
        print(f"✅ Model saved successfully to '{MODEL_PATH}'")

    except Exception as e:
        print(f"An error occurred: {e}")

if __name__ == '__main__':
    train_pipeline()

