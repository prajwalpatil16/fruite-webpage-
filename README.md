# FruitBasket — Multi-Farm Fresh Produce Marketplace

**Food tastes better when you know who grew it.**

FruitBasket is a multi-vendor marketplace: customers buy from approved local farms in one checkout; each farm fulfills only its own share of the order.

## Stack

- **Frontend:** React 19, Vite, Tailwind CSS 4, React Router
- **Backend:** Flask, Flask-SQLAlchemy, Flask-JWT-Extended, Flask-Bcrypt
- **Database:** MySQL

## Features (Phase 2)

- Farmer registration → pending → admin approval
- Farmer dashboard (products, stock, farm profile, fulfillment)
- Multi-farm cart splitting into per-farmer sub-orders
- Address CRUD with ownership checks
- Customer orders grouped by farm

## Quick start

### Backend

```bash
cd backend
python -m venv venv && source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env   # set SECRET_KEY, JWT_SECRET_KEY, DATABASE_URL
# Create DB, then reset schema + seed demo data:
python seed.py --reset
python app.py
```

Demo accounts after seed:

| Email | Password | Role |
|---|---|---|
| admin@fruitbasket.com | admin123 | Admin |
| customer@fruitbasket.com | customer123 | Customer |
| ramesh@greenvalley.com | farmer123 | Farmer (Green Valley) |
| meera@sunrise.com | farmer123 | Farmer (Sunrise Organics) |

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Optional: set `VITE_API_URL` (defaults to `http://localhost:5000`).

## Schema note (order splitting)

- **Order** — one customer purchase
- **FarmerOrder** — per-farm sub-order with its own fulfillment status
- **OrderItem** — links to both parent order and farmer sub-order

## License

MIT
