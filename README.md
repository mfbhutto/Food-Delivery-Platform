# Food Delivery Platform

A full-stack food ordering app built with the MERN stack. Customers browse the menu, add items to a cart, and pay with Stripe; admins manage food items and order status from a separate dashboard.

## Project structure

```
food-del/
├── frontend/   # Customer-facing React app (Vite)
├── admin/      # Admin dashboard React app (Vite)
└── backend/    # Express + MongoDB REST API
```

## Features

**Customer app (`frontend`)**
- Browse the menu and filter by category
- Sign up / log in (JWT auth)
- Cart that syncs with the user's account
- Checkout with Stripe and payment verification
- "My Orders" page with order status tracking

**Admin dashboard (`admin`)**
- Add food items with image upload
- List and remove food items
- View all orders and update their status

**API (`backend`)**
- Express 5, Mongoose, JWT, bcrypt
- Multer for image uploads (served from `/images`)
- Stripe Checkout for payments

## Tech stack

| Layer    | Tools |
|----------|-------|
| Frontend | React 19, React Router 7, Axios, Vite |
| Admin    | React 19, React Router 7, Axios, React Toastify, Vite |
| Backend  | Node.js, Express 5, MongoDB/Mongoose, JWT, bcrypt, Multer, Stripe |

## Getting started

### Prerequisites
- Node.js 18+
- A MongoDB database (e.g. MongoDB Atlas)
- A Stripe account (test keys are fine)

### 1. Backend

```bash
cd backend
npm install
cp .env.example .env   # then fill in your values
npm run server
```

The API runs on `http://localhost:4000`.

Environment variables (`backend/.env`):

| Variable            | Description |
|---------------------|-------------|
| `MONGO_URI`         | MongoDB connection string |
| `JWT_SECRET`        | Secret used to sign auth tokens |
| `STRIPE_SECRET_KEY` | Stripe secret key |
| `PUBLISHABLE_KEY`   | Stripe publishable key |

### 2. Frontend

```bash
cd frontend
npm install
npm run dev
```

### 3. Admin dashboard

```bash
cd admin
npm install
npm run dev
```

> The frontend and admin apps call the API at `http://localhost:4000`. After a Stripe payment, the backend redirects to `http://localhost:5174`, so run the customer app on that port (or update `frontend_url` in `backend/controllers/orderController.js`).

## API endpoints

| Method | Endpoint                 | Auth | Description |
|--------|--------------------------|------|-------------|
| POST   | `/api/user/register`     |      | Register a user |
| POST   | `/api/user/login`        |      | Log in and get a token |
| GET    | `/api/food/list`         |      | List food items |
| POST   | `/api/food/add`          |      | Add a food item (multipart, `image`) |
| POST   | `/api/food/remove`       |      | Remove a food item |
| POST   | `/api/cart/add`          | ✔    | Add an item to the cart |
| POST   | `/api/cart/remove`       | ✔    | Remove an item from the cart |
| POST   | `/api/cart/get`          | ✔    | Get the user's cart |
| POST   | `/api/order/place`       | ✔    | Place an order and create a Stripe session |
| POST   | `/api/order/verify`      | ✔    | Verify payment |
| POST   | `/api/order/userorders`  | ✔    | Get the user's orders |
| GET    | `/api/order/list`        |      | List all orders (admin) |
| POST   | `/api/order/status`      |      | Update order status (admin) |

Authenticated routes expect the JWT in an `Authorization: Bearer <token>` header.
