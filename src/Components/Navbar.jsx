import { Link, useNavigate } from "react-router-dom";
import React, { useRef, useEffect, useContext, useState } from "react";
import { CiSearch } from "react-icons/ci";
import { MdKeyboardVoice } from "react-icons/md";
import { IoMenu, IoLogoYoutube } from "react-icons/io5";
import { TfiPlus } from "react-icons/tfi";
import { IoIosNotifications } from "react-icons/io";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ProfileDropdown from "./ProfileDropdown";
import SearchBar from "./SearchBar";
import PropTypes from "prop-types";

function Navbar({ setSideNavbarfunc, sideNavbar }) {
  const [profileOpen, setProfileOpen] = useState(false);
  const dropdownRef = useRef();
  const navigate = useNavigate();

  // Auth context
  const { isLoggedIn, userPic, logout, userId, userName, channelName, channelId } = useContext(AuthContext);

  const defaultAvatar = "https://static.vecteezy.com/system/resources/previews/002/318/271/non_2x/user-profile-icon-free-vector.jpg";

  const user = {
    id: userId,
    name: userName || "User",
    channelName: channelName || "channelName",
    profilePic: userPic,
    channelId: channelId 
  };

  const toggleSidebar = () => {
    setSideNavbarfunc(!sideNavbar);
  };

  const handleLogout = async () => {
    try {
      await axios.post("http://localhost:4001/api/users/logout");
      toast.success("Logout Successfully");
    } catch (err) {
      console.error("Logout failed:", err);
      toast.error("Server logout failed. Logging out locally.");
    }
    logout();
    setProfileOpen(false);
    setTimeout(() => {
      navigate("/");
    }, 100);
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="fixed top-0 left-0 w-full h-16 bg-black text-white z-50 shadow-md">
      <ToastContainer position="bottom-right" />
      <nav className="mx-auto h-full flex justify-between items-center px-4 gap-4">
        {/* Left */}
        <div onClick={toggleSidebar} className="flex items-center gap-2 cursor-pointer">
          <IoMenu className="text-2xl hover:text-gray-400 transition-colors" />
          <Link to="/" className="font-extrabold text-xl flex items-center gap-1">
            <IoLogoYoutube className="text-red-500 text-3xl" />
            <span>YouTube</span>
          </Link>
        </div>

        {/* Middle */}
        <SearchBar />

        {/* Right */}
        <div className="flex items-center gap-6 relative">
          {isLoggedIn && userId && (
            <Link to={`/user/${userId}/create`}>
              <button className="flex items-center gap-2 px-3 py-1 text-base border border-gray-600 rounded-full hover:bg-gray-800 hover:text-white transition-colors" title="Create">
                <TfiPlus className="text-lg" />
                <span className="hidden md:inline">Create</span>
              </button>
            </Link>
          )}
          <button className="relative text-xl hover:text-gray-400 transition-colors" title="Notifications">
            <IoIosNotifications className="text-3xl" />
          </button>
          {/* Profile/Login */}
          <div className="relative" ref={dropdownRef}>
            {!isLoggedIn ? (
              <button
                className="w-24 px-4 py-2 rounded-full bg-black hover:bg-gray-600 text-white font-semibold transition"
                onClick={() => navigate("/login")}
              >
                Login
              </button>
            ) : (
              <>
                <img
                  onClick={() => setProfileOpen((prev) => !prev)}
                  src={userPic || defaultAvatar}
                  alt="User Profile"
                  aria-label="User Profile"
                  aria-haspopup="true"
                  aria-expanded={profileOpen}
                  className="w-8 h-8 rounded-full cursor-pointer border-2 border-gray-700 hover:border-white transition"
                  tabIndex={0}
                  onError={(e) => { e.target.src = defaultAvatar; }}
                />
                <ProfileDropdown profileOpen={profileOpen} user={user} handleLogout={handleLogout} />
              </>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}

Navbar.propTypes = {
  setSideNavbarfunc: PropTypes.func.isRequired,
  sideNavbar: PropTypes.bool.isRequired,
};

export default Navbar;
