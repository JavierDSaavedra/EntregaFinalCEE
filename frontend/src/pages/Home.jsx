
import { FaHome } from "react-icons/fa";
import "@styles/home.css";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const Home = () => {
  const navigate = useNavigate();
  const user = JSON.parse(sessionStorage.getItem("usuario")) || {};


  return (
    <div className="home-banner">
      <h1>Home</h1>
      <FaHome className="icon" />

    </div>
  );
};

export default Home;
