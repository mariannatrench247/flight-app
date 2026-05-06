# Flight Reservation System

## Overview
This Flight Reservation System is a database-driven web application designed to manage airline booking operations. The system allows users to view flights, create reservations, manage customers, assign seats, and process payments through a simple interactive web interface.

The project demonstrates relational database design, SQL queries, backend API development, and frontend interaction using JavaScript.

---

# Features

## Flight Management
- View all flights
- Display airline company information
- Show departure and arrival cities
- Support multiple airline companies and connected flights

## Customer Management
- Add new customers
- Store customer contact information
- Manage customer reservations

## Reservation System
- Book flights
- Assign seats to passengers
- Prevent duplicate seat assignments
- Track reservation status

## Payment Processing
- Submit flight payments
- Store payment records
- Link payments to reservations
- Bank account and card-based payment support

## Seat Management
- View available seats
- Assign seats per flight
- Track seat availability

## Database Features
- Relational database design using MySQL
- Primary and foreign key relationships
- SQL joins and queries
- Data normalization concepts

---

# Technologies Used

## Frontend
- HTML
- CSS
- JavaScript

## Backend
- Node.js
- Express.js

## Database
- MySQL

## Additional Tools
- Git
- GitHub
- VS Code

---

# Database Design

The system includes the following main entities:

- Customer
- Flight
- Reservation
- Seat
- Payment
- AirlineCompany
- BankAccount
- FlightConnection

Relationships between entities are managed using foreign keys to maintain data integrity.

---

# How to Run the Project

## 1. Clone the Repository

```bash
git clone https://github.com/mariannatrench247/flight-app.git

## 2. Open Project Folder
cd flight-app

## 3. Install Dependencies
npm install

## 4. Start MySQL

Make sure MySQL Server is running and import the database schema.

---

## 5. Configure Database Connection

Update the MySQL credentials inside `server.js`.

Example:

```javascript
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "YOUR_PASSWORD",
  database: "flightreservation"
});
```

---

## 6. Start the Backend Server

```bash
node server.js
```

---

## 7. Open the Frontend

Open `index.html` in your browser.

---

# Example Functionalities

- Create a customer
- Book a flight
- Select a seat
- Submit payment
- View reservations
- Manage airline data

---

# Learning Objectives

This project was developed to practice:

- Relational database modeling
- SQL and normalization
- REST API development
- Backend/frontend integration
- CRUD operations
- Full-stack application structure

---

# Future Improvements

- User authentication and login
- Admin dashboard
- Flight search filters
- Real-time seat updates
- Responsive mobile design
- Ticket generation and email confirmation

---

# Author

Marianna Belmares
