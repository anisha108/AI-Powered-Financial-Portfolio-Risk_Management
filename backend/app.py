import os
from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_bcrypt import Bcrypt
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity, JWTManager
from flask_cors import CORS # Make sure this import is here
from utils.analyzer import analyze_stock

# --- App Configuration ---
app = Flask(__name__)
basedir = os.path.abspath(os.path.dirname(__file__))
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://localhost/riskforecaster_db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['JWT_SECRET_KEY'] = 'a-long-random-string-you-should-change'

# --- Initialize Extensions ---
db = SQLAlchemy(app)
migrate = Migrate(app, db)
bcrypt = Bcrypt(app)
jwt = JWTManager(app)
# !!! --- THIS IS THE FIX --- !!!
# This simpler configuration allows all origins for all /api/ routes,
# which is perfect for development and solves preflight issues.
CORS(app, resources={r"/api/*": {"origins": "*"}})

# --- Database Models ---
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    password_hash = db.Column(db.String(128), nullable=False)
    watchlist = db.relationship('Watchlist', backref='owner', lazy=True, cascade="all, delete-orphan")

class Watchlist(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    ticker = db.Column(db.String(20), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    __table_args__ = (db.UniqueConstraint('user_id', 'ticker', name='_user_ticker_uc'),)


# --- API Endpoints ---
# ... (The rest of your app.py file remains exactly the same) ...
@app.route('/api/analyze', methods=['POST'])
def analyze_endpoint():
    data = request.get_json()
    ticker = data.get('ticker')
    if not ticker:
        return jsonify({"status": "error", "message": "Ticker is required"}), 400
    analysis_result = analyze_stock(ticker)
    if "error" in analysis_result:
        return jsonify({"status": "error", "message": analysis_result["error"]}), 404
    return jsonify({"status": "success", "data": analysis_result}), 200

@app.route('/api/register', methods=['POST'])
def register():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')
    if not username or not password:
        return jsonify({"message": "Username and password are required"}), 400
    if User.query.filter_by(username=username).first():
        return jsonify({"message": "Username already exists"}), 409
    hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')
    new_user = User(username=username, password_hash=hashed_password)
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
        access_token = create_access_token(identity=user.id)
        return jsonify(access_token=access_token), 200
    return jsonify({"message": "Invalid username or password"}), 401

@app.route('/api/watchlist', methods=['GET'])
@jwt_required()
def get_watchlist():
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)
    watchlist_items = user.watchlist
    tickers = [item.ticker for item in watchlist_items]
    return jsonify(tickers=tickers), 200

@app.route('/api/watchlist', methods=['POST'])
@jwt_required()
def add_to_watchlist():
    current_user_id = get_jwt_identity()
    data = request.get_json()
    ticker = data.get('ticker')
    if not ticker:
        return jsonify({"message": "Ticker is required"}), 400
    existing_item = Watchlist.query.filter_by(user_id=current_user_id, ticker=ticker).first()
    if existing_item:
        return jsonify({"message": "Ticker already in watchlist"}), 409
    new_item = Watchlist(ticker=ticker, user_id=current_user_id)
    db.session.add(new_item)
    db.session.commit()
    return jsonify({"message": f"'{ticker}' added to watchlist"}), 201

@app.route('/api/watchlist/<string:ticker>', methods=['DELETE'])
@jwt_required()
def delete_from_watchlist(ticker):
    current_user_id = get_jwt_identity()
    item_to_delete = Watchlist.query.filter_by(user_id=current_user_id, ticker=ticker).first()
    if not item_to_delete:
        return jsonify({"message": "Ticker not found in watchlist"}), 404
    db.session.delete(item_to_delete)
    db.session.commit()
    return jsonify({"message": f"'{ticker}' removed from watchlist"}), 200

if __name__ == '__main__':
    app.run(debug=True)

