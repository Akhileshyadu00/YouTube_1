import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./Components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Registration from "./pages/Register";
import Profile from "./pages/Profile";
import Create from "./pages/Create";
import Video from "./Components/Video";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { AuthProvider } from "./context/AuthContext";
import CreateChannel from "./Components/CreateChannel";
import ChannelPage from "./pages/ChannelPage";


function App() {
  const [sideNavbar, setSideNavbar] = useState(true);

  return (
    <BrowserRouter>
      <AuthProvider>
        <Navbar
          setSideNavbarfunc={setSideNavbar}
          sideNavbar={sideNavbar}
        />

        <Routes>
          <Route path="/" element={<Home sideNavbar={sideNavbar} />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Registration />} />
          <Route path="/watch/:id" element={<Video sideNavbar={sideNavbar}/>} />
          <Route path="/user/:id/create" element={<Create />} />
          <Route path="/user/:id" element={<Profile sideNavbar={sideNavbar} />} />
          {/* <Route path="/channel/:id" element={<Profile sideNavbar={sideNavbar} />} /> */}

           <Route path="/createchannel" element={<CreateChannel />} />
           {/* <Route path="/users/:id" element={<ChannelPage />}></Route>
         */}

         {/* <Route path="/channel/:id/manage" element={<ManageVideos />} /> */}

        </Routes>

        {/* Global toast container for all pages */}
        <ToastContainer position="bottom-right" />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
