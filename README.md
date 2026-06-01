# Inventory & Order Management System

## Overview

A full-stack Inventory & Order Management System built using React, FastAPI, PostgreSQL, Docker, and Docker Compose.

The system allows businesses to manage:

* Products
* Customers
* Orders
* Inventory tracking

---

# Tech Stack

## Frontend

* React
* Axios
* React Router DOM

## Backend

* Python
* FastAPI
* SQLAlchemy

## Database

* PostgreSQL

## Containerization

* Docker
* Docker Compose

---

# Features

## Product Management

* Create products
* View all products
* Update products
* Delete products

## Customer Management

* Create customers
* View customers
* Delete customers

## Order Management

* Create orders
* View orders
* Inventory reduction after order creation
* Automatic order total calculation

## Dashboard

* Total products
* Total customers
* Total orders
* Low stock products

---

# Business Logic

* Product SKU must be unique
* Customer email must be unique
* Product quantity cannot be negative
* Orders cannot be placed if stock is insufficient
* Inventory updates automatically after order creation
* Order total amount calculated automatically by backend

---

# API Endpoints

## Products

* POST /products
* GET /products
* GET /products/{id}
* PUT /products/{id}
* DELETE /products/{id}

## Customers

* POST /customers
* GET /customers
* GET /customers/{id}
* DELETE /customers/{id}

## Orders

* POST /orders
* GET /orders
* GET /orders/{id}
* DELETE /orders/{id}

---

# Local Setup

## Clone Repository

```bash id="jlwm01"
git clone YOUR_GITHUB_REPO_LINK
```

## Run Using Docker

```bash id="jlwm02"
docker compose up --build
```

---

# Live Deployment

## Frontend

YOUR_FRONTEND_URL

## Backend

YOUR_BACKEND_URL/docs

## Docker Hub

YOUR_DOCKER_HUB_LINK

---

# Author

Sujeet Yadav
