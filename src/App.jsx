import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./Components/Navbar";
import Home from "./Components/Home";


function App() {
  const [sideNavbar, setSideNavbar] = useState(true);

  const setSideNavbarFunc = (value) => {
    setSideNavbar(value);
  };

  return (
    <BrowserRouter>
      <Navbar setSideNavbarfunc={setSideNavbarFunc} sideNavbar={sideNavbar} />

    <Routes>
      <Route  path="/" element={<Home sideNavbar={sideNavbar} />}/>
    </Routes>

    </BrowserRouter>
  );
}

export default App;
