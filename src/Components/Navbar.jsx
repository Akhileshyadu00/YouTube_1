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

function Navbar({ setSideNavbarfunc, sideNavbar }) {
  const [profileOpen, setProfileOpen] = useState(false);
  const dropdownRef = useRef();
  const navigate = useNavigate();

  // ✅ Pull values from context
  const { isLoggedIn, userPic, logout, userId } = useContext(AuthContext);

  const defaultAvatar =
    "https://static.vecteezy.com/system/resources/previews/002/318/271/non_2x/user-profile-icon-free-vector.jpg";

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
      <nav className=" mx-auto h-full flex justify-between items-center px-4 gap-4">
        {/* Left */}
        <div
          onClick={toggleSidebar}
          className=" flex items-center gap-2 cursor-pointer"
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

        {/* Middle */}
        <div className="flex flex-1 justify-center items-center gap-4 max-w-2xl left-22">
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

        {/* Right */}
        <div className="flex items-center gap-6 relative">
          {isLoggedIn && userId && (
            <Link to={`/user/${userId}/create`}>
              <button
                className="flex items-center gap-2 px-3 py-1 text-base border border-gray-600 rounded-full hover:bg-gray-800 hover:text-white transition-colors"
                title="Create"
              >
                <TfiPlus className="text-lg" />
                <span className="hidden md:inline">Create</span>
              </button>
            </Link>
          )}

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
              src={userPic || defaultAvatar}
              alt="Profile"
              className="w-8 h-8 rounded-full cursor-pointer border-2 border-gray-700 hover:border-white transition"
            />

            {profileOpen && (
              <div className="absolute right-0 mt-2 w-40 bg-gray-900 border border-gray-700 rounded-lg shadow-lg py-2 z-20">
                {isLoggedIn && userId ? (
                  <>
                    <Link
                      to={`/user/${userId}`}
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
                    <button className="w-full text-left px-4 py-2 text-sm hover:bg-gray-800 transition">
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
