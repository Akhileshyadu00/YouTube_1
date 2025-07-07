import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import axios from "axios";
import Navbar from "./Components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Registration from "./pages/Register";
import Profile from "./pages/Profile";
import Create from "./pages/Create";
import Video from "./Components/Video";

function App() {
  const [sideNavbar, setSideNavbar] = useState(true);


  const setSideNavbarFunc = (value) => {
    setSideNavbar(value);
  };

  return (
    <BrowserRouter>
      <Navbar setSideNavbarfunc={setSideNavbarFunc} sideNavbar={sideNavbar} />

      <Routes>
        <Route path="/" element={<Home sideNavbar={sideNavbar} />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Registration />} />
        <Route path="/watch/:id" element={<Video />} />
        <Route path="/user/:id" element={<Profile sideNavbar={sideNavbar} />} />
        <Route path="/user/:id/create" element={<Create />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
