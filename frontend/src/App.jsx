import { Routes, Route, Link } from "react-router-dom";
import ExpertList from "./pages/ExpertList";
import MyBookings from "./pages/MyBookings";

function App() {
  return (
    <div>
      {/* Navigation Bar */}
      <nav style={styles.nav}>
        <Link to="/" style={styles.link}>
          Experts
        </Link>
        <Link to="/my-bookings" style={styles.link}>
          My Bookings
        </Link>
      </nav>

      {/* Routes */}
      <Routes>
        <Route path="/" element={<ExpertList />} />
        <Route path="/my-bookings" element={<MyBookings />} />
      </Routes>
    </div>
  );
}

const styles = {
  nav: {
    display: "flex",
    justifyContent: "center",
    gap: "30px",
    padding: "20px",
    background: "#4f46e5"
  },
  link: {
    color: "white",
    textDecoration: "none",
    fontWeight: "600"
  }
};

export default App;