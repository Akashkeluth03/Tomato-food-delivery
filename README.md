# Tomato Food Delivery App

A premium, full-stack food delivery application built with React (Vite) on the frontend and Node.js (Express) with PostgreSQL on the backend. It features interactive multi-city location selection, dynamic delivery restaurant filtering, and automated PDF invoice billing.

---

## ✨ Key Features

1. **Multi-City Location Selector**:
   - Toggle locations directly from a premium pin-drop selector in the navigation bar.
   - Pre-seeded with 10 major Indian cities: *Bellary, Bangalore, Hubli, Mysore, Mangalore, Hyderabad, Mumbai, Delhi, Chennai, Pune*.

2. **Dynamic AI-Style Restaurant Generator**:
   - Want to order in a city not listed? Click `+ Add City`, type a name (e.g. *Goa* or *Jaipur*), and the backend will dynamically generate 5 realistic local restaurants (complete with cuisines, ratings, and covers) and custom-seed their menus in the database!

3. **Curated & Expanded Menu**:
   - Seeding includes 50+ unique food items spanning 9 categories: *Salad, Rolls, Deserts, Sandwich, Cake, Pure Veg, Pasta, Noodles, Biryani*.
   - Each restaurant has a custom menu curated specifically to match its cuisine.

4. **Dynamic Cart & PDF Invoice Billing**:
   - Build orders by adding/removing items with a real-time quantity counter.
   - Upon successful checkout, download a beautifully formatted, print-ready PDF invoice with item tables, calculated sub-unit prices, delivery fees, and order totals.

---

## 🛠️ Tech Stack

- **Frontend**: React (19), Vite, Vanilla CSS (Premium responsive layout), jsPDF (for client-side billing).
- **Backend**: Node.js, Express, pg (node-postgres connection pooling), dotenv, CORS.
- **Database**: PostgreSQL (relational structure with schemas for locations, restaurants, and food items).

---

## 🚀 Getting Started

### 1. Database Setup

Ensure you have a PostgreSQL server running locally.

1. **Create the Database**:
   ```sql
   CREATE DATABASE food_delivery;
   ```
2. **Backend Configuration**:
   Create a `.env` file inside the `backend` directory:
   ```env
   PORT=5001
   DATABASE_URL=postgres://<username>:<password>@localhost:5432/food_delivery
   ```

### 2. Running the Backend Server

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the migrations and seed script:
   ```bash
   npm run seed
   ```
4. Start the Express development server (runs on port `5001`):
   ```bash
   npm run dev
   ```

### 3. Running the Frontend Server

1. Navigate to the root directory:
   ```bash
   cd ..
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
4. Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 🗄️ Database Schema

The database consists of three related tables:

- **`locations`**: ID and unique name of the city.
- **`restaurants`**: Name, location mapping, cuisine description, rating, online delivery flag (`is_online_delivery`), and cover image.
- **`food_items`**: Restaurant ID linkage, food name, price, description, category, and image URL (local assets or Unsplash).
