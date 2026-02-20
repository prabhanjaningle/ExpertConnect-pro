import { useState } from "react";
import axios from "axios";

function MyBookings() {
  const [email, setEmail] = useState("");
  const [bookings, setBookings] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const fetchBookings = async () => {
    if (!email) {
      setError("Please enter your email.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setSearched(true);

      const res = await axios.get(
        `http://localhost:5000/bookings?email=${email}`
      );

      setBookings(res.data.data);

    } catch (err) {
      setError("Could not fetch bookings.");
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>My Bookings</h2>

      <div style={styles.searchBox}>
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={styles.input}
        />
        <button onClick={fetchBookings} style={styles.button}>
          Search
        </button>
      </div>

      {error && <p style={styles.error}>{error}</p>}

      {loading && <p style={styles.loading}>Loading bookings...</p>}

      {/* Empty state */}
      {!loading && searched && bookings.length === 0 && !error && (
        <p style={styles.empty}>
          No bookings found for this email.
        </p>
      )}

      <div style={styles.list}>
        {bookings.map((booking) => (
          <div key={booking._id} style={styles.card}>
            <h4>Expert ID: {booking.expertId}</h4>
            <p>Date: {booking.date}</p>
            <p>Time: {booking.time}</p>
            <p>
              Status:
              <span
                style={{
                  ...styles.status,
                  backgroundColor:
                    booking.status === "Confirmed"
                      ? "#22c55e"
                      : booking.status === "Completed"
                      ? "#3b82f6"
                      : "#facc15"
                }}
              >
                {booking.status}
              </span>
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

const styles = {
  container: {
    padding: "40px",
    maxWidth: "700px",
    margin: "0 auto"
  },
  heading: {
    textAlign: "center",
    marginBottom: "30px"
  },
  searchBox: {
    display: "flex",
    gap: "10px",
    marginBottom: "20px"
  },
  input: {
    flex: 1,
    padding: "10px",
    borderRadius: "8px",
    border: "1px solid #ccc"
  },
  button: {
    padding: "10px 15px",
    borderRadius: "8px",
    border: "none",
    background: "#4f46e5",
    color: "white",
    cursor: "pointer"
  },
  list: {
    display: "flex",
    flexDirection: "column",
    gap: "15px"
  },
  card: {
    padding: "15px",
    borderRadius: "12px",
    background: "#f9fafb",
    boxShadow: "0 5px 15px rgba(0,0,0,0.05)"
  },
  status: {
    marginLeft: "10px",
    padding: "5px 10px",
    borderRadius: "20px",
    color: "white",
    fontSize: "12px"
  },
  error: {
    color: "red",
    marginBottom: "10px"
  },
  loading: {
    textAlign: "center",
    marginTop: "20px"
  },
  empty: {
    textAlign: "center",
    marginTop: "20px",
    color: "#6b7280"
  }
};

export default MyBookings;