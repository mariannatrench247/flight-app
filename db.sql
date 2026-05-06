-- =========================
-- RESET DATABASE
-- =========================
DROP DATABASE IF EXISTS FlightDB;
CREATE DATABASE FlightDB;
USE FlightDB;

-- =========================
-- TABLES
-- =========================

CREATE TABLE AirlineCompany (
    CompanyID INT PRIMARY KEY AUTO_INCREMENT,
    CompanyName VARCHAR(100)
);

CREATE TABLE Customer (
    CustomerID INT PRIMARY KEY AUTO_INCREMENT,
    FirstName VARCHAR(50),
    LastName VARCHAR(50)
);

CREATE TABLE Flight (
    FlightID INT PRIMARY KEY AUTO_INCREMENT,
    FlightNumber VARCHAR(20),
    DepartureCity VARCHAR(50),
    ArrivalCity VARCHAR(50),
    CompanyID INT,
    FOREIGN KEY (CompanyID)
        REFERENCES AirlineCompany(CompanyID)
);

CREATE TABLE Seat (
    SeatID INT PRIMARY KEY AUTO_INCREMENT,
    FlightID INT,
    SeatNumber VARCHAR(10),
    SeatClass VARCHAR(20),
    AvailabilityStatus VARCHAR(20) DEFAULT 'Available',
    FOREIGN KEY (FlightID)
        REFERENCES Flight(FlightID)
);

CREATE TABLE Reservation (
    ReservationID INT PRIMARY KEY AUTO_INCREMENT,
    CustomerID INT,
    FlightID INT,
    SeatID INT,
    ReservationDate DATETIME,
    ReservationStatus VARCHAR(20) DEFAULT 'CONFIRMED',
    FOREIGN KEY (CustomerID)
        REFERENCES Customer(CustomerID),
    FOREIGN KEY (FlightID)
        REFERENCES Flight(FlightID),
    FOREIGN KEY (SeatID)
        REFERENCES Seat(SeatID)
);

CREATE TABLE Payment (
    PaymentID INT PRIMARY KEY AUTO_INCREMENT,
    ReservationID INT,
    PaymentAmount DECIMAL(10,2),
    CardType VARCHAR(20),
    FOREIGN KEY (ReservationID)
        REFERENCES Reservation(ReservationID)
);

-- =========================
-- AIRLINES
-- =========================

INSERT INTO AirlineCompany (CompanyName)
VALUES
('Delta'),
('United'),
('Southwest'),
('American Airlines'),
('JetBlue');

-- =========================
-- CUSTOMERS
-- =========================

INSERT INTO Customer (FirstName, LastName)
VALUES
('Jane','Smith'),
('John','Doe'),
('Alice','Brown'),
('Bob','Johnson'),
('Chris','Lee'),
('Sara','Davis'),
('Mike','Wilson'),
('Emma','Clark'),
('David','Lopez'),
('Nina','Garcia'),
('Liam','Turner'),
('Olivia','Hall'),
('Noah','Young'),
('Emma','King'),
('James','Scott'),
('Sophia','Green'),
('William','Adams'),
('Isabella','Baker'),
('Benjamin','Nelson'),
('Mia','Carter');

-- =========================
-- FLIGHTS
-- =========================

INSERT INTO Flight
(FlightNumber, DepartureCity, ArrivalCity, CompanyID)
VALUES

('DL100','Los Angeles','New York',1),
('UA200','Chicago','Miami',2),
('SW300','Phoenix','Denver',3),
('AA400','Dallas','Seattle',4),
('JB500','Boston','Orlando',5),

('FL2001','Tokyo','Seoul',1),
('FL2002','Paris','Rome',2),
('FL2003','Berlin','Madrid',3),
('FL2004','Toronto','Vancouver',4),
('FL2005','Mexico City','Cancun',5),

('FL2006','Sydney','Melbourne',1),
('FL2007','Dubai','Mumbai',2),
('FL2008','Beijing','Shanghai',3),
('FL2009','Bangkok','Singapore',4),
('FL2010','London','Dublin',5),

('FL2011','San Diego','Las Vegas',1),
('FL2012','Austin','Houston',2),
('FL2013','Seattle','Portland',3),
('FL2014','Chicago','Detroit',4),
('FL2015','Boston','Philadelphia',5),

('FL2016','Miami','Atlanta',1),
('FL2017','Dallas','San Antonio',2),
('FL2018','Denver','Salt Lake City',3),
('FL2019','Phoenix','Albuquerque',4),
('FL2020','Orlando','Tampa',5);

-- =========================
-- SEATS
-- =========================

INSERT INTO Seat
(FlightID, SeatNumber, SeatClass)
VALUES

(1,'1A','Economy'),
(1,'1B','Economy'),
(1,'1C','Economy'),
(1,'2A','Economy'),
(1,'2B','Economy'),

(2,'1A','Economy'),
(2,'1B','Economy'),
(2,'1C','Economy'),
(2,'2A','Economy'),
(2,'2B','Economy'),

(3,'1A','Economy'),
(3,'1B','Economy'),
(3,'1C','Economy'),
(3,'2A','Economy'),
(3,'2B','Economy'),

(4,'1A','Economy'),
(4,'1B','Economy'),
(4,'1C','Economy'),
(4,'2A','Economy'),
(4,'2B','Economy'),

(5,'1A','Economy'),
(5,'1B','Economy'),
(5,'1C','Economy'),
(5,'2A','Economy'),
(5,'2B','Economy');

-- =========================
-- RESERVATIONS
-- =========================

INSERT INTO Reservation
(CustomerID, FlightID, SeatID, ReservationDate)
VALUES

(1,1,1,NOW()),
(2,1,2,NOW()),
(3,1,3,NOW()),

(4,2,6,NOW()),
(5,2,7,NOW()),

(6,3,11,NOW()),
(7,3,12,NOW()),

(8,4,16,NOW()),
(9,4,17,NOW()),

(10,5,21,NOW());

-- =========================
-- PAYMENTS
-- =========================

INSERT INTO Payment
(ReservationID, PaymentAmount, CardType)
VALUES

(1,250,'Visa'),
(2,300,'Mastercard'),
(3,200,'Amex'),
(4,450,'Visa'),
(5,150,'Visa'),
(6,275,'Mastercard'),
(7,325,'Amex'),
(8,400,'Visa'),
(9,180,'Mastercard'),
(10,500,'Amex');

-- =========================
-- VERIFY
-- =========================

SELECT * FROM AirlineCompany;
SELECT * FROM Customer;
SELECT * FROM Flight;
SELECT * FROM Seat;
SELECT * FROM Reservation;
SELECT * FROM Payment;