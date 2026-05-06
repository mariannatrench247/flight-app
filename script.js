const API = "http://localhost:3001";

/* =========================
   LOAD FLIGHTS
========================= */
async function loadFlights() {
  const res = await fetch(`${API}/flights`);
  const data = await res.json();

  const results = document.getElementById("results");
  results.innerHTML = "";

  data.forEach(f => {
    results.innerHTML += `
      <div class="card-item">
        <strong>${f.FlightNumber || "N/A"}</strong><br>
        ${f.DepartureCity || "Unknown"} → ${f.ArrivalCity || "Unknown"}<br>
        Airline: ${f.Airline || "Unknown"}
      </div>
    `;
  });
}

/* =========================
   LOAD RESERVATIONS
========================= */
async function loadReservations() {
  const res = await fetch(`${API}/reservations`);
  const data = await res.json();

  const results = document.getElementById("results");
  results.innerHTML = "";

  data.forEach(r => {
    results.innerHTML += `
      <div class="card-item">
        <strong>#${r.ReservationID}</strong><br>
        ${r.FirstName} ${r.LastName}<br>
        ${r.FlightNumber}<br>
        ${r.DepartureCity} → ${r.ArrivalCity}
      </div>
    `;
  });
}

/* =========================
   LOAD CUSTOMERS
========================= */
async function loadCustomers() {
  const res = await fetch(`${API}/customers`);
  const data = await res.json();

  const results = document.getElementById("results");
  results.innerHTML = "";

  data.forEach(c => {
    results.innerHTML += `
      <div class="card-item">
        <strong>${c.FirstName} ${c.LastName}</strong><br>
        Flights: ${c.Flights || "None"}
      </div>
    `;
  });
}

/* =========================
   LOAD PAYMENTS (FIXED)
========================= */
async function loadPayments() {
  const res = await fetch(`${API}/payments`);
  const data = await res.json();

  const results = document.getElementById("results");
  results.innerHTML = "";

  data.forEach(p => {
    results.innerHTML += `
      <div class="card-item">
        <strong>Payment #${p.PaymentID}</strong><br>
        ${p.FirstName || ""} ${p.LastName || ""}<br>
        Flight: ${p.FlightNumber || "N/A"}<br>
        $${p.PaymentAmount} (${p.CardType})
      </div>
    `;
  });
}

async function bookFlight() {

  const customerID =
    document.getElementById("customerSelect").value;

  const flightID =
    document.getElementById("flightSelect").value;

  const seatID =
    document.getElementById("seatSelect").value;

  const response = await fetch(
    "http://localhost:3001/reservations",
    {
      method: "POST",

      headers: {
        "Content-Type": "application/json"
      },

      body: JSON.stringify({
        customerID,
        flightID,
        seatID
      })
    }
  );

  const data = await response.json();

  alert(data.message);

  loadReservations();
  loadPaymentReservations();
}

async function makePayment() {

  const reservationID =
    document.getElementById("paymentReservation").value;

  const amount =
    document.getElementById("amount").value;

  const cardType =
    document.getElementById("cardType").value;

  const response = await fetch(
    "http://localhost:3001/payments",
    {
      method: "POST",

      headers: {
        "Content-Type": "application/json"
      },

      body: JSON.stringify({
        reservationID,
        amount,
        cardType
      })
    }
  );

  const data = await response.json();

  alert(data.message);
  loadPayments();
}

/* =========================
   SEARCH
========================= */
async function searchReservations() {
  const name = document.getElementById("name").value;
  const departure = document.getElementById("departure").value;
  const arrival = document.getElementById("arrival").value;
  const flight = document.getElementById("flight").value;

  const res = await fetch(`${API}/search?name=${name}&departure=${departure}&arrival=${arrival}&flight=${flight}`);
  const data = await res.json();

  const results = document.getElementById("results");
  results.innerHTML = "";

  data.forEach(r => {
    results.innerHTML += `
      <div class="card-item">
        ${r.FirstName} ${r.LastName}<br>
        ${r.FlightNumber}<br>
        ${r.DepartureCity} → ${r.ArrivalCity}
      </div>
    `;
  });
}
async function addCustomer() {
  const firstName = document.getElementById("firstName").value;
  const lastName = document.getElementById("lastName").value;

  await fetch("http://localhost:3001/customers", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ firstName, lastName })
  });

  // refresh list immediately
  loadCustomers();

  // clear fields
  document.getElementById("firstName").value = "";
  document.getElementById("lastName").value = "";
}
async function loadDropdowns() {
  const res = await fetch("http://localhost:3001/dropdowns");
  const data = await res.json();

  const dep = document.getElementById("departure");
  const arr = document.getElementById("arrival");
  const flt = document.getElementById("flight");

  // clear existing
  dep.innerHTML = `<option value="">-- Any --</option>`;
  arr.innerHTML = `<option value="">-- Any --</option>`;
  flt.innerHTML = `<option value="">-- Any --</option>`;

  // fill departure cities
  data.departures.forEach(d => {
    dep.innerHTML += `<option value="${d}">${d}</option>`;
  });

  // fill arrival cities
  data.arrivals.forEach(a => {
    arr.innerHTML += `<option value="${a}">${a}</option>`;
  });

  // fill flight numbers
  data.flights.forEach(f => {
    flt.innerHTML += `<option value="${f}">${f}</option>`;
  });
}

/* =========================
   LOAD BOOKING DROPDOWNS
========================= */

async function loadBookingDropdowns() {
  loadCustomersDropdown();
  loadFlightsDropdown();
  loadSeatsDropdown();
}

/* ---------- CUSTOMER DROPDOWN ---------- */
async function loadCustomersDropdown() {
  const res = await fetch(`${API}/customers`);
  const data = await res.json();

  const select = document.getElementById("customerSelect");
  select.innerHTML = "";

  data.forEach(c => {
    const option = document.createElement("option");
    option.value = c.CustomerID;
    option.textContent = `${c.FirstName} ${c.LastName}`;
    select.appendChild(option);
  });
}

/* ---------- FLIGHT DROPDOWN ---------- */
async function loadFlightsDropdown() {
  const res = await fetch(`${API}/flights`);
  const data = await res.json();

  const select = document.getElementById("flightSelect");
  select.innerHTML = "";

  data.forEach(f => {
    const option = document.createElement("option");
    option.value = f.FlightID;

    option.textContent =
      `${f.FlightNumber} (${f.DepartureCity} → ${f.ArrivalCity})`;

    select.appendChild(option);
  });
}

/* ---------- SEAT DROPDOWN ---------- */
async function loadSeatsDropdown() {
  const res = await fetch(`${API}/seats`);
  const data = await res.json();

  console.log("SEATS:", data);

  const select = document.getElementById("seatSelect");
  select.innerHTML = "";

  data.forEach(s => {
    const option = document.createElement("option");

    option.value = s.SeatID;

    option.textContent =
      `${s.SeatNumber} - ${s.FlightNumber}`;

    select.appendChild(option);
  });
}
/* ---------- PAYMENT RESERVATIONS ---------- */
async function loadPaymentReservations() {
  const res = await fetch(`${API}/reservations`);
  const data = await res.json();

  const select = document.getElementById("paymentReservation");

  select.innerHTML = "";

  data.forEach(r => {
    const option = document.createElement("option");

    option.value = r.ReservationID;

    option.textContent =
      `#${r.ReservationID} - ${r.FirstName} ${r.LastName} (${r.FlightNumber})`;

    select.appendChild(option);
  });
}
/* =========================
   PAGE LOAD
========================= */

window.onload = () => {
  loadDropdowns();
  loadBookingDropdowns();
  loadPaymentReservations();
};