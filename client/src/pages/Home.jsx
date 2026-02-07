import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Home() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div style={{ padding: 24 }}>
      <h2>Welcome, {user?.name || "User"}!</h2>
      <p>You are signed in to ChatZone.</p>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}

export default Home;
