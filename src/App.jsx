import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

const API = "http://localhost:3001";

function App() {
    const [customers, setCustomers] = useState([]);
    const [flights, setFlights] = useState([]);
    const [seats, setSeats] = useState([]);
    const [banks, setBanks] = useState([]);
    const [reservations, setReservations] = useState([]);
    const [payments, setPayments] = useState([]);
    const [message, setMessage] = useState("");

    const [customerForm, setCustomerForm] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        address: ""
    });

    const [bookingForm, setBookingForm] = useState({
        customerId: "",
        flightId: "",
        seatId: "",
        bankAccountId: "",
        paymentAmount: "",
        cardType: "Visa"
    });

    useEffect(() => {
        loadInitialData();
    }, []);

    useEffect(() => {
        if (bookingForm.flightId) {
            loadSeats(bookingForm.flightId);
        }
    }, [bookingForm.flightId]);

    async function loadInitialData() {
        try {
            const [customerRes, flightRes, bankRes, reservationRes, paymentRes] = await Promise.all([
                axios.get(`${API}/customers`),
                axios.get(`${API}/flights`),
                axios.get(`${API}/banks`),
                axios.get(`${API}/reservations`),
                axios.get(`${API}/payments`)
            ]);

            setCustomers(customerRes.data);
            setFlights(flightRes.data);
            setBanks(bankRes.data);
            setReservations(reservationRes.data);
            setPayments(paymentRes.data);
        } catch (err) {
            setMessage("Error loading data. Make sure server.js is running.");
            console.error(err);
        }
    }

    async function loadSeats(flightId) {
        try {
            const res = await axios.get(`${API}/seats/${flightId}`);
            setSeats(res.data);
        } catch (err) {
            setMessage("Error loading seats.");
            console.error(err);
        }
    }

    async function addCustomer(e) {
        e.preventDefault();

        if (!customerForm.firstName || !customerForm.lastName || !customerForm.email) {
            setMessage("First name, last name, and email are required.");
            return;
        }

        try {
            await axios.post(`${API}/customers`, customerForm);
            setMessage("Customer added successfully.");
            setCustomerForm({
                firstName: "",
                lastName: "",
                email: "",
                phone: "",
                address: ""
            });
            loadInitialData();
        } catch (err) {
            setMessage("Could not add customer.");
            console.error(err);
        }
    }

    async function bookFlight(e) {
        e.preventDefault();

        const { customerId, flightId, seatId, bankAccountId, paymentAmount, cardType } = bookingForm;

        if (!customerId || !flightId || !seatId || !bankAccountId || !paymentAmount || !cardType) {
            setMessage("All booking and payment fields are required.");
            return;
        }

        try {
            await axios.post(`${API}/book`, bookingForm);
            setMessage("Reservation created, seat booked, and payment recorded.");
            setBookingForm({
                customerId: "",
                flightId: "",
                seatId: "",
                bankAccountId: "",
                paymentAmount: "",
                cardType: "Visa"
            });
            setSeats([]);
            loadInitialData();
        } catch (err) {
            setMessage("Booking failed. Check that the seat is still available.");
            console.error(err);
        }
    }

    return (
        <div className="page">
            <header>
                <h1>Flight Reservation System</h1>
                <p>Manage customers, flights, seats, reservations, and card-based payments.</p>
            </header>

            {message && <div className="message">{message}</div>}

            <section className="grid">
                <div className="card">
                    <h2>Add Customer</h2>
                    <form onSubmit={addCustomer}>
                        <input placeholder="First Name" value={customerForm.firstName} onChange={e => setCustomerForm({ ...customerForm, firstName: e.target.value })} />
                        <input placeholder="Last Name" value={customerForm.lastName} onChange={e => setCustomerForm({ ...customerForm, lastName: e.target.value })} />
                        <input placeholder="Email" value={customerForm.email} onChange={e => setCustomerForm({ ...customerForm, email: e.target.value })} />
                        <input placeholder="Phone" value={customerForm.phone} onChange={e => setCustomerForm({ ...customerForm, phone: e.target.value })} />
                        <input placeholder="Address" value={customerForm.address} onChange={e => setCustomerForm({ ...customerForm, address: e.target.value })} />
                        <button type="submit">Add Customer</button>
                    </form>
                </div>

                <div className="card">
                    <h2>Book Flight + Pay</h2>
                    <form onSubmit={bookFlight}>
                        <select value={bookingForm.customerId} onChange={e => setBookingForm({ ...bookingForm, customerId: e.target.value })}>
                            <option value="">Select Customer</option>
                            {customers.map(c => (
                                <option key={c.CustomerID} value={c.CustomerID}>
                                    {c.FirstName} {c.LastName}
                                </option>
                            ))}
                        </select>

                        <select value={bookingForm.flightId} onChange={e => setBookingForm({ ...bookingForm, flightId: e.target.value, seatId: "" })}>
                            <option value="">Select Flight</option>
                            {flights.map(f => (
                                <option key={f.FlightID} value={f.FlightID}>
                                    {f.FlightNumber}: {f.DepartureCity} to {f.ArrivalCity}
                                </option>
                            ))}
                        </select>

                        <select value={bookingForm.seatId} onChange={e => setBookingForm({ ...bookingForm, seatId: e.target.value })}>
                            <option value="">Select Available Seat</option>
                            {seats.map(s => (
                                <option key={s.SeatID} value={s.SeatID}>
                                    {s.SeatNumber} - {s.SeatClass}
                                </option>
                            ))}
                        </select>

                        <select value={bookingForm.bankAccountId} onChange={e => setBookingForm({ ...bookingForm, bankAccountId: e.target.value })}>
                            <option value="">Select Bank</option>
                            {banks.map(b => (
                                <option key={b.BankAccountID} value={b.BankAccountID}>
                                    {b.BankName}
                                </option>
                            ))}
                        </select>

                        <input type="number" placeholder="Payment Amount" value={bookingForm.paymentAmount} onChange={e => setBookingForm({ ...bookingForm, paymentAmount: e.target.value })} />

                        <select value={bookingForm.cardType} onChange={e => setBookingForm({ ...bookingForm, cardType: e.target.value })}>
                            <option value="Visa">Visa</option>
                            <option value="Mastercard">Mastercard</option>
                            <option value="Amex">Amex</option>
                        </select>

                        <button type="submit">Book and Pay</button>
                    </form>
                </div>
            </section>

            <section className="card full">
                <h2>Flights</h2>
                <div className="list">
                    {flights.map(f => (
                        <div className="item" key={f.FlightID}>
                            <strong>{f.FlightNumber}</strong>
                            <span>{f.DepartureCity} to {f.ArrivalCity}</span>
                            <small>{f.CompanyName}</small>
                        </div>
                    ))}
                </div>
            </section>

            <section className="card full">
                <h2>Reservations</h2>
                <div className="list">
                    {reservations.map(r => (
                        <div className="item" key={r.ReservationID}>
                            <strong>{r.FirstName} {r.LastName}</strong>
                            <span>{r.FlightNumber}: {r.DepartureCity} to {r.ArrivalCity}</span>
                            <small>Seat: {r.SeatNumber || "Not Assigned"} | Status: {r.ReservationStatus}</small>
                        </div>
                    ))}
                </div>
            </section>

            <section className="card full">
                <h2>Payments</h2>
                <div className="list">
                    {payments.map(p => (
                        <div className="item" key={p.PaymentID}>
                            <strong>{p.FirstName} {p.LastName}</strong>
                            <span>${p.PaymentAmount} using {p.CardType}</span>
                            <small>{p.BankName} | Flight {p.FlightNumber}</small>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}

export default App;