import os
import yfinance as yf
from flask import Flask, request, jsonify
from datetime import datetime,timedelta
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_bcrypt import Bcrypt
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity, JWTManager
from flask_cors import CORS

# Analyzer imports (implement in utils/analyzer.py)
from utils.analyzer import (
    analyze_stock,
    get_ai_recommendation,
    get_batch_ticker_data,
    get_all_nse_tickers_data
)

# -----------------------------
# App Configuration
# -----------------------------
app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://localhost/riskforecaster_db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['JWT_SECRET_KEY'] = 'a-long-random-string-you-should-change'
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(days=30)  # 30 days validity

# -----------------------------
# Initialize Extensions
# -----------------------------
db = SQLAlchemy(app)
migrate = Migrate(app, db)
bcrypt = Bcrypt(app)
jwt = JWTManager(app)
CORS(app, origins="http://localhost:3000", supports_credentials=True)

# -----------------------------
# Database Models
# -----------------------------
class User(db.Model):
    __tablename__ = "user"
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    password_hash = db.Column(db.String(128), nullable=False)
    auto_trade_allowed = db.Column(db.Boolean, default=False)
    watchlist = db.relationship('Watchlist', backref='owner', lazy=True, cascade="all, delete-orphan")
    portfolio = db.relationship('Portfolio', backref='owner', lazy=True, cascade="all, delete-orphan")
    trade_signals = db.relationship('TradeSignal', backref='owner', lazy=True, cascade="all, delete-orphan")
    executions = db.relationship('Execution', backref='owner', lazy=True, cascade="all, delete-orphan")


class Watchlist(db.Model):
    __tablename__ = "watchlist"
    id = db.Column(db.Integer, primary_key=True)
    ticker = db.Column(db.String(20), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    __table_args__ = (db.UniqueConstraint('user_id', 'ticker', name='_user_ticker_uc'),)


class Portfolio(db.Model):
    __tablename__ = "portfolio"
    id = db.Column(db.Integer, primary_key=True)
    ticker = db.Column(db.String(20), nullable=False)
    quantity = db.Column(db.Integer, nullable=False)
    avg_buy_price = db.Column(db.Float, nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    __table_args__ = (db.UniqueConstraint('user_id', 'ticker', name='_user_portfolio_ticker_uc'),)


class TradeSignal(db.Model):
    __tablename__ = "trade_signal"
    id = db.Column(db.Integer, primary_key=True)
    ticker = db.Column(db.String(20), nullable=False)
    signal = db.Column(db.String(10), nullable=False)  # BUY / SELL / HOLD
    confidence = db.Column(db.Float, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)


class Execution(db.Model):
    __tablename__ = "execution"
    id = db.Column(db.Integer, primary_key=True)
    ticker = db.Column(db.String(20), nullable=False)
    action = db.Column(db.String(10), nullable=False)  # BUY / SELL
    quantity = db.Column(db.Integer, nullable=False)
    price = db.Column(db.Float, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)


# -----------------------------
# Helper: Create default user
# -----------------------------
def create_default_user():
    with app.app_context():
        db.create_all()
        if not User.query.filter_by(username="anishakumari").first():
            hashed_pw = bcrypt.generate_password_hash("anishakumari").decode('utf-8')
            default_user = User(username="anishakumari", password_hash=hashed_pw)
            db.session.add(default_user)
            db.session.commit()
            print("✅ Default user created: anishakumari / anishakumari")


# -----------------------------
# Public Endpoints
# -----------------------------
@app.route('/api/ticker-data', methods=['GET'])
def ticker_data():
    ticker_list = ["^NSEI", "^BSESN", "RELIANCE.NS", "TCS.NS", "HDFCBANK.NS", "INFY.NS"]
    rename_map = {"^NSEI": "NIFTY 50", "^BSESN": "SENSEX"}
    data = get_batch_ticker_data(ticker_list)
    for item in data:
        if item["name"] in rename_map:
            item["name"] = rename_map[item["name"]]
    return jsonify({"status": "success", "data": data}), 200


@app.route('/api/analyze', methods=['POST'])
def analyze_endpoint():
    data = request.get_json()
    ticker = data.get('ticker')
    analysis_result = analyze_stock(ticker)
    return jsonify({"status": "success", "data": analysis_result}), 200
@app.route('/api/recommend', methods=['POST'])
@jwt_required()
def recommend():
    current_user_id = get_jwt_identity()
    data = request.get_json()
    query = data.get('query')

    if not query:
        return jsonify({"message": "Query is required"}), 400

    try:
        user = User.query.get(current_user_id)
        watchlist_tickers = [item.ticker for item in user.watchlist]
        recommendation = get_ai_recommendation(query, watchlist_tickers)
        return jsonify({"recommendation": recommendation}), 200
    except Exception as e:
        print("Error in recommend:", e)
        return jsonify({"message": "Failed to generate recommendation"}), 500

@app.route('/api/register', methods=['POST'])
def register():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')
    if User.query.filter_by(username=username).first():
        return jsonify({"message": "Username already exists"}), 409
    hashed_pw = bcrypt.generate_password_hash(password).decode('utf-8')
    new_user = User(username=username, password_hash=hashed_pw)
    db.session.add(new_user)
    db.session.commit()
    return jsonify({"message": "User registered successfully"}), 201


@app.route('/api/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')
    user = User.query.filter_by(username=username).first()
    if user and bcrypt.check_password_hash(user.password_hash, password):
        access_token = create_access_token(identity=str(user.id))
        return jsonify(access_token=access_token), 200
    return jsonify({"message": "Invalid username or password"}), 401


# -----------------------------
# Protected Endpoints
# -----------------------------
@app.route('/api/watchlist', methods=['GET'])
@jwt_required()
def get_watchlist():
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)
    tickers = [item.ticker for item in user.watchlist]
    return jsonify(tickers=tickers), 200


@app.route('/api/watchlist', methods=['POST'])
@jwt_required()
def add_to_watchlist():
    current_user_id = get_jwt_identity()
    data = request.get_json()
    ticker = data.get('ticker')
    existing_item = Watchlist.query.filter_by(user_id=current_user_id, ticker=ticker.upper()).first()
    if existing_item:
        return jsonify({"message": "Ticker already in watchlist"}), 409
    new_item = Watchlist(ticker=ticker.upper(), user_id=current_user_id)
    db.session.add(new_item)
    db.session.commit()
    return jsonify({"message": f"'{ticker.upper()}' added to watchlist"}), 201

@app.route('/api/stock-data', methods=['GET'])
def get_nifty50_data():
    try:
        ticker = "^NSEI"  # Nifty 50
        stock = yf.Ticker(ticker)
        data = stock.history(period="1d")  # Get today's data

        if data.empty:
            return jsonify({"message": "No data available"}), 404

        latest = data.iloc[-1]  # Get the latest row
        response = {
            "price": latest['Close'],
            "open": latest['Open'],
            "high": latest['High'],
            "low": latest['Low'],
            "volume": int(latest['Volume'])
        }
        return jsonify(response)
    except Exception as e:
        print(e)
        return jsonify({"message": "Failed to fetch stock data"}), 500

if __name__ == "__main__":
    app.run(port=5000, debug=True)

# -----------------------------
# Run App
# -----------------------------
if __name__ == '__main__':
    create_default_user()  # ensure tables & default user
    app.run(debug=True)
