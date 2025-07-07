import { Link } from "react-router-dom";
import React, { useState, useRef, useEffect } from "react";
import { CiSearch } from "react-icons/ci";
import { MdKeyboardVoice } from "react-icons/md";
import { IoMenu, IoLogoYoutube } from "react-icons/io5";
import { TfiPlus } from "react-icons/tfi";
import { IoIosNotifications } from "react-icons/io";

function Navbar({ setSideNavbarfunc, sideNavbar }) {
  const [profileOpen, setProfileOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userPic, setUserPic] = useState("");
  const dropdownRef = useRef();

  const toggleSidebar = () => {
    setSideNavbarfunc(!sideNavbar);
  };

  const handleLogin = () => {
    setIsLoggedIn(true);
    setProfileOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("userName");
    localStorage.removeItem("userProfilePic");

    setIsLoggedIn(false);
    setUserPic("");
    setProfileOpen(false);
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

  // Check login state and profile image on load
  useEffect(() => {
    const userId = localStorage.getItem("userId");
    const storedPic = localStorage.getItem("userProfilePic");

    if (userId) {
      setIsLoggedIn(true);
      setUserPic(storedPic || "https://via.placeholder.com/40");
    }
  }, []);

  return (
    <header className="fixed top-0 left-0 w-full h-16 bg-black text-white z-50 shadow-md">
      <nav className="container mx-auto h-full flex justify-between items-center px-4 gap-4">
        {/* Left Section */}
        <div
          onClick={toggleSidebar}
          className="flex items-center gap-3 cursor-pointer"
        >
          <IoMenu className="text-2xl hover:text-gray-400 transition-colors" />
          <Link
            to="/"
            className="font-extrabold text-xl flex items-center gap-1"
          >
            <IoLogoYoutube className="text-red-500 text-3xl" />
            <span>YouTube</span>
          </Link>
        </div>

        {/* Middle Section */}
        <div className="flex flex-1 justify-center items-center gap-4 max-w-2xl">
          <div className="flex flex-1 items-center border border-gray-600 rounded-full overflow-hidden bg-gray-900">
            <input
              type="text"
              placeholder="Search"
              className="flex-grow p-2 pl-4 text-gray-100 bg-transparent focus:outline-none"
              aria-label="Search"
            />
            <button
              className="bg-gray-700 p-2 border-l border-gray-600 hover:bg-gray-600 transition-colors"
              title="Search"
            >
              <CiSearch className="text-2xl text-white" />
            </button>
          </div>
          <button
            className="bg-gray-700 p-3 rounded-full hover:bg-gray-600 transition-colors"
            title="Voice Search"
          >
            <MdKeyboardVoice className="text-2xl text-white" />
          </button>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-6 relative">
          <Link to="/user/1/create">
            <button
              className="flex items-center gap-2 px-3 py-1 text-base border border-gray-600 rounded-full hover:bg-gray-800 hover:text-white transition-colors"
              title="Create"
            >
              <TfiPlus className="text-lg" />
              <span className="hidden md:inline">Create</span>
            </button>
          </Link>

          <button
            className="relative text-xl hover:text-gray-400 transition-colors"
            title="Notifications"
          >
            <IoIosNotifications className="text-3xl" />
          </button>

          {/* Profile Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <img
              onClick={() => setProfileOpen((prev) => !prev)}
              src={userPic || "https://via.placeholder.com/40"}
              alt="Profile"
              className="w-8 h-8 rounded-full cursor-pointer border-2 border-gray-700 hover:border-white transition"
            />
            {profileOpen && (
              <div className="absolute right-0 mt-2 w-40 bg-gray-900 border border-gray-700 rounded-lg shadow-lg py-2 z-20">
                {isLoggedIn ? (
                  <>
                    <Link
                      to="/user/1"
                      className="block px-4 py-2 text-sm hover:bg-gray-800 transition"
                    >
                      Profile
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm hover:bg-gray-800 transition"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <Link to="/login">
                    <button
                      onClick={handleLogin}
                      className="w-full text-left px-4 py-2 text-sm hover:bg-gray-800 transition"
                    >
                      Login
                    </button>
                  </Link>
                )}
              </div>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}

export default Navbar;
