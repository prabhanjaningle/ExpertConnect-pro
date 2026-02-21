import { useEffect, useState } from "react";
import axios from "axios";
import { io } from "socket.io-client";

const socket = io("https://expertconnect-pro.onrender.com");

function ExpertList() {

  const [experts, setExperts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [selectedExpert, setSelectedExpert] = useState(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");

  const [bookedSlots, setBookedSlots] = useState([]);

  const limit = 5;

  const timeSlots = [
    "10:00 AM",
    "11:00 AM",
    "12:00 PM",
    "2:00 PM",
    "3:00 PM"
  ];

  // Fetch Experts
  useEffect(() => {
    fetchExperts();
  }, [page, category]);

  const fetchExperts = async () => {
    try {

      setLoading(true);
      setError("");

      const res = await axios.get(
        `https://expertconnect-pro.onrender.com/experts?page=${page}&limit=${limit}&category=${category}`
      );

      let data = res.data.data;

      if (search) {
        data = data.filter((expert) =>
          expert.name.toLowerCase().includes(search.toLowerCase())
        );
      }

      setExperts(data);
      setTotalPages(Math.ceil(res.data.total / limit));

    } catch (err) {
      setError("Failed to fetch experts.");
    } finally {
      setLoading(false);
    }
  };

  // Real-time updates
  useEffect(() => {

    socket.on("slotBooked", (data) => {
      setBookedSlots((prev) => [...prev, data]);
    });

    return () => {
      socket.off("slotBooked");
    };

  }, []);

  // Booking
  const confirmBooking = async () => {

    try {

      await axios.post(
        "https://expertconnect-pro.onrender.com/bookings",
        {
          expertId: selectedExpert._id,
          name: "Prabhanjan",
          email: "test@gmail.com",
          phone: "9876543210",
          date: selectedDate,
          time: selectedTime
        }
      );

      alert("Booking successful!");
      closeModal();

    } catch (error) {
      alert(error.response?.data?.message || "Booking failed");
    }

  };

  const closeModal = () => {
    setSelectedExpert(null);
    setSelectedDate("");
    setSelectedTime("");
  };

  return (
    <div style={styles.page}>
      <div style={styles.container}>

        <h1 style={styles.heading}>ExpertConnect</h1>
        <p style={styles.subtitle}>
          Real-Time Expert Session Booking System
        </p>

        {/* Filters */}
        <div style={styles.filters}>

          <input
            placeholder="Search by name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={styles.input}
          />

          <select
            value={category}
            onChange={(e) => {
              setCategory(e.target.value);
              setPage(1);
            }}
            style={styles.input}
          >
            <option value="">All Categories</option>
            <option value="Astrology">Astrology</option>
            <option value="Career">Career</option>
            <option value="Finance">Finance</option>
          </select>

          <button
            onClick={fetchExperts}
            style={styles.primaryBtn}
          >
            Search
          </button>

        </div>

        {loading && <p style={styles.center}>Loading experts...</p>}
        {error && <p style={styles.error}>{error}</p>}

        {/* Expert Cards */}
        <div style={styles.grid}>

          {experts.map((expert) => (

            <div key={expert._id} style={styles.card}>

              <div style={styles.cardHeader}>
                <div style={styles.avatar}>
                  {expert.name.charAt(0)}
                </div>

                <div>
                  <h3>{expert.name}</h3>
                  <p style={styles.category}>{expert.category}</p>
                </div>
              </div>

              <p>{expert.experience} yrs experience</p>
              <p>⭐ {expert.rating}</p>

              <button
                style={styles.primaryBtn}
                onClick={() => setSelectedExpert(expert)}
              >
                Book Session
              </button>

            </div>

          ))}

        </div>

        {/* Pagination */}
        <div style={styles.pagination}>

          <button
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
            style={styles.secondaryBtn}
          >
            Prev
          </button>

          <span>Page {page} of {totalPages}</span>

          <button
            disabled={page === totalPages}
            onClick={() => setPage(page + 1)}
            style={styles.secondaryBtn}
          >
            Next
          </button>

        </div>

      </div>

      {/* Booking Modal */}
      {selectedExpert && (

        <div style={styles.overlay}>

          <div style={styles.modal}>

            <h3>Book {selectedExpert.name}</h3>

            <input
              type="date"
              min={new Date().toISOString().split("T")[0]}
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              style={styles.input}
            />

            <div style={styles.timeGrid}>

              {timeSlots.map((time) => {

                const isBooked = bookedSlots.some(
                  (slot) =>
                    slot.expertId === selectedExpert._id &&
                    slot.date === selectedDate &&
                    slot.time === time
                );

                return (
                  <button
                    key={time}
                    disabled={isBooked}
                    style={{
                      ...styles.timeBtn,
                      background: isBooked
                        ? "#d1d5db"
                        : selectedTime === time
                        ? "#4f46e5"
                        : "#f3f4f6",
                      color: isBooked
                        ? "#6b7280"
                        : selectedTime === time
                        ? "white"
                        : "#111",
                      cursor: isBooked ? "not-allowed" : "pointer"
                    }}
                    onClick={() => setSelectedTime(time)}
                  >
                    {time}
                  </button>
                );

              })}

            </div>

            <button
              disabled={!selectedDate || !selectedTime}
              style={styles.primaryBtn}
              onClick={confirmBooking}
            >
              Confirm Booking
            </button>

            <button
              style={styles.cancelBtn}
              onClick={closeModal}
            >
              Cancel
            </button>

          </div>

        </div>

      )}

    </div>
  );
}

const styles = {

  page: {
    background: "#f3f4f6",
    minHeight: "100vh",
    padding: "60px 0"
  },

  container: {
    maxWidth: "1100px",
    margin: "0 auto",
    padding: "0 20px"
  },

  heading: {
    textAlign: "center",
    marginBottom: "5px"
  },

  subtitle: {
    textAlign: "center",
    color: "#6b7280",
    marginBottom: "40px"
  },

  filters: {
    display: "flex",
    gap: "15px",
    justifyContent: "center",
    marginBottom: "30px"
  },

  input: {
    padding: "10px",
    borderRadius: "8px",
    border: "1px solid #ddd"
  },

  primaryBtn: {
    padding: "10px 16px",
    background: "#4f46e5",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer"
  },

  secondaryBtn: {
    padding: "8px 14px",
    borderRadius: "8px",
    border: "1px solid #ddd",
    background: "white",
    cursor: "pointer"
  },

  cancelBtn: {
    marginTop: "10px",
    padding: "10px",
    background: "#ef4444",
    color: "white",
    border: "none",
    borderRadius: "8px",
    width: "100%"
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: "25px"
  },

  card: {
    background: "white",
    padding: "25px",
    borderRadius: "16px",
    boxShadow: "0 10px 25px rgba(0,0,0,0.06)"
  },

  cardHeader: {
    display: "flex",
    alignItems: "center",
    gap: "15px",
    marginBottom: "15px"
  },

  avatar: {
    width: "50px",
    height: "50px",
    borderRadius: "50%",
    background: "#4f46e5",
    color: "white",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "bold"
  },

  category: {
    fontSize: "14px",
    color: "#6b7280"
  },

  pagination: {
    marginTop: "30px",
    display: "flex",
    justifyContent: "center",
    gap: "20px"
  },

  overlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.4)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center"
  },

  modal: {
    background: "white",
    padding: "30px",
    borderRadius: "16px",
    width: "350px"
  },

  timeGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "8px",
    marginBottom: "15px"
  },

  timeBtn: {
    padding: "8px",
    borderRadius: "6px",
    border: "1px solid #ddd"
  },

  error: {
    textAlign: "center",
    color: "red"
  },

  center: {
    textAlign: "center"
  }

};

export default ExpertList;