# backend/train_model_pipeline.py

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
TICKER = "SPY"             # Train on a broad market index for general applicability
TRAINING_PERIOD = "15y"   # Use a long history to capture various market conditions
N_SPLITS = 5              # Number of splits for time-series cross-validation
MODEL_PATH = '/Users/anishakumari/Downloads/RiskForecaster/backend/models/volatility_model_pipeline.pkl' # Corrected relative path

def train_pipeline():
    """
    A complete pipeline to fetch data, engineer features, tune, train,
    and save a robust volatility prediction model.
    """
    print("🚀 Starting model training pipeline...")

    # --- 1. Data Fetching ---
    try:
        data = yf.Ticker(TICKER).history(period=TRAINING_PERIOD)
        if data.empty:
            print(f"❌ Error: No data downloaded for {TICKER}. Exiting.")
            return
        print(f"✅ Downloaded {len(data)} data points for {TICKER}")
    except Exception as e:
        print(f"❌ Error during data download: {e}")
        return

    # --- 2. Feature & Target Engineering ---
    data['returns'] = data['Close'].pct_change()
    
    # Features
    data['vol_21d'] = data['returns'].rolling(window=21).std() * np.sqrt(252)
    data['vol_63d'] = data['returns'].rolling(window=63).std() * np.sqrt(252)
    data['momentum_1m'] = data['Close'].pct_change(periods=21)
    data['momentum_3m'] = data['Close'].pct_change(periods=63)

    # Target Variable
    data['target_volatility'] = data['vol_21d'].shift(-5)
    
    # --- 3. Data Cleaning & Preparation ---
    data.dropna(inplace=True)
    
    features_list = ['vol_21d', 'vol_63d', 'momentum_1m', 'momentum_3m']
    X = data[features_list]
    y = data['target_volatility']
    
    if X.empty or y.empty:
        print("❌ Error: Not enough data to create features and target. Exiting.")
        return

    print("✅ Feature engineering and data cleaning complete.")

    # --- 4. Time-Series Cross-Validation and Hyperparameter Tuning ---
    tscv = TimeSeriesSplit(n_splits=N_SPLITS)

    # The n_jobs=-1 parameter has been removed to prevent the ChildProcessError
    pipeline = Pipeline([
        ('scaler', StandardScaler()),
        ('regressor', RandomForestRegressor(random_state=42)) 
    ])

    param_grid = {
        'regressor__n_estimators': [50, 100],
        'regressor__max_depth': [5, 10],
        'regressor__min_samples_leaf': [5, 10]
    }

    print("⏳ Performing GridSearchCV with TimeSeriesSplit...")
    # The n_jobs=-1 parameter has been removed here as well.
    grid_search = GridSearchCV(pipeline, param_grid, cv=tscv, scoring='r2') 
    grid_search.fit(X, y)
    
    print(f"✅ GridSearchCV complete. Best R-squared score: {grid_search.best_score_:.4f}")
    print(f"Best parameters: {grid_search.best_params_}")

    # --- 5. Final Model Training ---
    final_model_pipeline = grid_search.best_estimator_
    final_model_pipeline.fit(X, y)
    print("✅ Final model trained on all data.")
    
    # --- 6. Save the Pipeline ---
    os.makedirs(os.path.dirname(MODEL_PATH), exist_ok=True)
    joblib.dump(final_model_pipeline, MODEL_PATH)
    print(f"✅ Complete pipeline (scaler + model) saved to '{MODEL_PATH}'")

if __name__ == '__main__':
    train_pipeline()