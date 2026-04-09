import { Link, useNavigate, useLocation } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const token = localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav style={styles.nav}>
      <h2 style={styles.logo}>MuscleMind</h2>

      <div style={styles.links}>
        <Link
          to="/"
          style={{
            ...styles.link,
            ...(isActive("/") && styles.activeLink),
          }}
        >
          Home
          <span style={isActive("/") ? styles.activeUnderline : styles.underline} />
        </Link>

        {!token ? (
          <>
            <Link
              to="/login"
              style={{
                ...styles.link,
                ...(isActive("/login") && styles.activeLink),
              }}
            >
              Login
              <span style={isActive("/login") ? styles.activeUnderline : styles.underline} />
            </Link>

            <Link
              to="/signup"
              style={{
                ...styles.link,
                ...(isActive("/signup") && styles.activeLink),
              }}
            >
              Signup
              <span style={isActive("/signup") ? styles.activeUnderline : styles.underline} />
            </Link>
          </>
        ) : (
          <>
            <Link
              to="/dashboard"
              style={{
                ...styles.link,
                ...(isActive("/dashboard") && styles.activeLink),
              }}
            >
              Dashboard
              <span style={isActive("/dashboard") ? styles.activeUnderline : styles.underline} />
            </Link>

            <button onClick={handleLogout} style={styles.logoutBtn}>
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
}
const styles = {
  nav: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "16px 40px",
    background: "rgba(10,10,12,0.7)",
    backdropFilter: "blur(12px)",
    borderBottom: "1px solid rgba(255,255,255,0.05)",
    position: "sticky",
    top: 0,
    zIndex: 1000,
  },

  logo: {
    margin: 0,
    fontSize: "22px",
    fontWeight: "700",
    background: "linear-gradient(135deg, #ff5500, #ff8844)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    letterSpacing: "0.05em",
  },

  links: {
    display: "flex",
    gap: "28px",
    alignItems: "center",
  },

  link: {
    position: "relative",
    color: "#aaa",
    textDecoration: "none",
    fontSize: "14px",
    fontWeight: "500",
    transition: "all 0.25s ease",
  },

  activeLink: {
    color: "#ff5500",
    fontWeight: "600",
  },

  underline: {
    position: "absolute",
    left: 0,
    bottom: -6,
    width: 0,
    height: 2,
    background: "#ff5500",
    transition: "width 0.3s ease",
  },

  activeUnderline: {
    position: "absolute",
    left: 0,
    bottom: -6,
    width: "100%",
    height: 2,
    background: "linear-gradient(90deg, #ff5500, #ff8844)",
    boxShadow: "0 0 8px rgba(255,85,0,0.6)",
  },

  logoutBtn: {
    background: "linear-gradient(135deg, #ff5500, #ff8844)",
    border: "none",
    padding: "8px 16px",
    borderRadius: "8px",
    color: "white",
    cursor: "pointer",
    fontWeight: "600",
    letterSpacing: "0.04em",
    transition: "all 0.2s ease",
  },
};