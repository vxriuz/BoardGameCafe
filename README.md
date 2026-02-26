# BoardGameCafe

A full-stack web application for managing a board game café — handling visits, game rentals, food/drink orders and billing.

## Tech Stack

- **Frontend:** React + Vite
- **Backend:** Flask (Python)
- **Database:** MySQL

## Prerequisites

- Python 3.10+
- Node.js 18+
- MySQL Server

## Setup

### 1. Database

1. Start your MySQL server
2. Run `boardgamecafe.sql` to create the database, tables, seed data, stored procedures and trigger

### 2. Backend

```bash
cd backend
python -m venv .venv
# Windows:
.venv\Scripts\activate
# macOS/Linux:
source .venv/bin/activate

pip install -r requirements.txt
python app.py
```

The API runs on `http://localhost:5000`.

> **Note:** Update the database credentials in `backend/db.py` if needed.

### 3. Frontend

```bash
cd frontend
npm install
npm run dev
```

The app runs on `http://localhost:5173`.

## Project Structure

```
boardgamecafe.sql                  -- Database schema, seed data, procedures & trigger
boardgamecafefunctionalqueries.sql -- Q1-Q5 queries used in the application
backend/
  app.py                           -- Flask API with all routes
  db.py                            -- MySQL connection helper
  requirements.txt                 -- Python dependencies
frontend/
  src/
    pages/                         -- TablesPage, RentPage, Bill
    components/                    -- CreateVisit, AddOrder, CreateRent, etc.
    styles/                        -- CSS files
```

## SQL Features

- **5 queries** (JOIN, subquery, GROUP BY, GROUP_CONCAT, aggregate functions)
- **3 stored procedures** (newVisit, newRental, newOrder)
- **1 trigger** (Update_bill — auto-updates Total_Bill on new order)