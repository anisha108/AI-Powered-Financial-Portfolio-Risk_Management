# bot.py
import time
from datetime import datetime
from apscheduler.schedulers.background import BackgroundScheduler

from app import db, User, Portfolio, Execution, TradeSignal
from utils.analyzer import analyze_stock, get_ai_recommendation

def ai_trading_bot():
    print(f"🤖 Bot running at {datetime.utcnow()}")
    users = User.query.all()

    for user in users:
        tickers = [item.ticker for item in user.watchlist]
        portfolio_tickers = {p.ticker: p for p in user.portfolio}

        for ticker in tickers:
            try:
                # Get analysis
                analysis = analyze_stock(ticker)
                recommendation = get_ai_recommendation("maximize profit", [ticker])
                confidence = analysis.get("risk_score", 50)

                if user.auto_trade_allowed:
                    # Auto trading: sell if recommended
                    if "sell" in recommendation.lower() and ticker in portfolio_tickers:
                        stock = portfolio_tickers[ticker]
                        execution = Execution(
                            ticker=ticker,
                            action="SELL",
                            quantity=stock.quantity,
                            price=analysis.get("current_price", stock.avg_buy_price),
                            user_id=user.id
                        )
                        db.session.add(execution)
                        db.session.delete(stock)
                        db.session.commit()
                        print(f"✅ Sold {ticker} for user {user.username}")
                else:
                    # Just log trade signals
                    signal = TradeSignal(
                        ticker=ticker,
                        signal=recommendation.upper(),
                        confidence=confidence,
                        user_id=user.id
                    )
                    db.session.add(signal)
                    db.session.commit()
                    print(f"📊 Logged trade signal for {ticker} ({user.username})")

            except Exception as e:
                print(f"❌ Error processing {ticker}: {e}")

# ----------------------------
# Scheduler
# ----------------------------
if __name__ == "__main__":
    scheduler = BackgroundScheduler()
    # Run every 5 minutes; change minutes=1 for testing
    scheduler.add_job(func=ai_trading_bot, trigger="interval", minutes=5)
    scheduler.start()

    print("🤖 AI Trading Bot started...")

    # Keep script running
    try:
        while True:
            time.sleep(60)
    except (KeyboardInterrupt, SystemExit):
        print("Shutting down bot...")
        scheduler.shutdown()
