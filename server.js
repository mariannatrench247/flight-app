const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Kaiyo260!",
  database: "flightdb"
});

db.connect(err => {
  if (err) throw err;
  console.log("Connected to FlightDB");
});

/* =========================
   GET ALL FLIGHTS
========================= */
app.get("/flights", (req, res) => {
  db.query(`
    SELECT 
      f.FlightID,
      f.FlightNumber,
      f.DepartureCity,
      f.ArrivalCity,
      COALESCE(a.CompanyName, 'Unknown') AS Airline
    FROM Flight f
    LEFT JOIN AirlineCompany a ON f.CompanyID = a.CompanyID
    ORDER BY f.FlightID
  `, (err, results) => {
    if (err) return res.status(500).send(err);
    res.json(results);
  });
});

/* =========================
   GET RESERVATIONS
========================= */
app.get("/reservations", (req, res) => {
  db.query(`
    SELECT 
      r.ReservationID,
      c.FirstName,
      c.LastName,
      f.FlightNumber,
      f.DepartureCity,
      f.ArrivalCity
    FROM Reservation r
    JOIN Customer c ON r.CustomerID = c.CustomerID
    JOIN Flight f ON r.FlightID = f.FlightID
    ORDER BY r.ReservationID DESC
  `, (err, results) => {
    if (err) return res.status(500).send(err);
    res.json(results);
  });
});

/* =========================
   GET CUSTOMERS
========================= */
app.get("/customers", (req, res) => {
  db.query(`
    SELECT 
      c.CustomerID,
      c.FirstName,
      c.LastName,
      GROUP_CONCAT(f.FlightNumber) AS Flights
    FROM Customer c
    LEFT JOIN Reservation r ON c.CustomerID = r.CustomerID
    LEFT JOIN Flight f ON r.FlightID = f.FlightID
    GROUP BY c.CustomerID
  `, (err, results) => {
    if (err) return res.status(500).send(err);
    res.json(results);
  });
});

/* =========================
   GET PAYMENTS (FIXED)
========================= */
app.get("/payments", (req, res) => {
  db.query(`
    SELECT 
      p.PaymentID,
      p.PaymentAmount,
      p.CardType,
      c.FirstName,
      c.LastName,
      f.FlightNumber
    FROM Payment p
    JOIN Reservation r ON p.ReservationID = r.ReservationID
    JOIN Customer c ON r.CustomerID = c.CustomerID
    JOIN Flight f ON r.FlightID = f.FlightID
    ORDER BY p.PaymentID
  `, (err, results) => {
    if (err) return res.status(500).send(err);
    res.json(results);
  });
});

/* =========================
   SEARCH
========================= */
app.get("/search", (req, res) => {
  const { name, departure, arrival, flight } = req.query;

  let sql = `
    SELECT 
      r.ReservationID,
      c.FirstName,
      c.LastName,
      f.FlightNumber,
      f.DepartureCity,
      f.ArrivalCity
    FROM Reservation r
    JOIN Customer c ON r.CustomerID = c.CustomerID
    JOIN Flight f ON r.FlightID = f.FlightID
    WHERE 1=1
  `;

  const params = [];

  if (name) {
    sql += " AND (c.FirstName LIKE ? OR c.LastName LIKE ?)";
    params.push(`%${name}%`, `%${name}%`);
  }
  if (departure) {
    sql += " AND f.DepartureCity = ?";
    params.push(departure);
  }
  if (arrival) {
    sql += " AND f.ArrivalCity = ?";
    params.push(arrival);
  }
  if (flight) {
    sql += " AND f.FlightNumber = ?";
    params.push(flight);
  }

  db.query(sql, params, (err, results) => {
    if (err) return res.status(500).send(err);
    res.json(results);
  });
});

/* =========================
   GET DROPDOWN DATA
========================= */
app.get("/dropdowns", (req, res) => {
  db.query(`
    SELECT 
      GROUP_CONCAT(DISTINCT DepartureCity) AS departures,
      GROUP_CONCAT(DISTINCT ArrivalCity) AS arrivals,
      GROUP_CONCAT(DISTINCT FlightNumber) AS flights
    FROM Flight
  `, (err, results) => {
    if (err) return res.status(500).send(err);

    res.json({
      departures: results[0].departures ? results[0].departures.split(",") : [],
      arrivals: results[0].arrivals ? results[0].arrivals.split(",") : [],
      flights: results[0].flights ? results[0].flights.split(",") : []
    });
  });
});

/* =========================
   ADD CUSTOMER (FIXED)
========================= */
app.post("/customers", (req, res) => {
  const { firstName, lastName } = req.body;

  if (!firstName || !lastName) {
    return res.status(400).json({ error: "Missing fields" });
  }

  db.query(
    "INSERT INTO Customer (FirstName, LastName) VALUES (?, ?)",
    [firstName, lastName],
    (err, result) => {
      if (err) return res.status(500).send(err);
      res.json({ message: "Customer added!" });
    }
  );
});
/* =========================
   GET SEATS
========================= */
app.get("/seats", (req, res) => {
  db.query(`
    SELECT 
      s.SeatID,
      s.SeatNumber,
      f.FlightNumber
    FROM Seat s
    JOIN Flight f
      ON s.FlightID = f.FlightID
    ORDER BY s.SeatID
  `, (err, results) => {
    if (err) return res.status(500).send(err);

    res.json(results);
  });
});

/* =========================
   BOOK FLIGHT
========================= */
app.post("/reservations", (req, res) => {

  const {
    customerID,
    flightID,
    seatID
  } = req.body;

  db.query(
    `
    INSERT INTO Reservation
    (CustomerID, FlightID, SeatID, ReservationDate)
    VALUES (?, ?, ?, NOW())
    `,
    [customerID, flightID, seatID],

    (err, result) => {

      if (err) {
        console.log(err);
        return res.status(500).send(err);
      }

      res.json({
        success: true,
        message: "Flight booked successfully"
      });
    }
  );
});

/* =========================
   MAKE PAYMENT
========================= */
app.post("/payments", (req, res) => {

  const {
    reservationID,
    amount,
    cardType
  } = req.body;

  db.query(
    `
    INSERT INTO Payment
    (ReservationID, PaymentAmount, CardType)
    VALUES (?, ?, ?)
    `,
    [reservationID, amount, cardType],

    (err, result) => {

      if (err) {
        console.log(err);
        return res.status(500).send(err);
      }

      res.json({
        success: true,
        message: "Payment submitted"
      });
    }
  );
});
app.listen(3001, () => console.log("Server running on port 3001"));