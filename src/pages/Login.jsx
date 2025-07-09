import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AuthContext } from "../context/AuthContext";

function Login() {
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLoginData((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogin = async () => {
    try {
      const response = await axios.post(
        "http://localhost:4001/api/users/login",
        loginData,
        { withCredentials: true }
      );
      // Robust extraction of user and userId
      const { token, user_id, user} = response.data;
      const userId = user_id || user?._id || user?.id;
        const userName = user?.userName || ""
        const channelName = user?.channelName || ""; // <-- Extract channelName

    // Pass ALL values to login!
    login(user?.profilePic, token, userId, userName, channelName);

      if (!userId) {
        toast.error("User ID not found in response.");
        return;
      }
      console.log(response);
      
      toast.success("Login successful!");

      // Store user info in localStorage
      localStorage.setItem("token", token);
      localStorage.setItem("userId", userId);
      localStorage.setItem("userName", userName)
      localStorage.setItem("channelName", channelName)
      localStorage.setItem("userProfilePic", user?.profilePic || "");
      localStorage.setItem("user", JSON.stringify(user || {}));

      // Update global context
      login(user?.profilePic, token, userId);

      // Redirect to user profile page
      setTimeout(() => {
        navigate(`/user/${userId}`);
      }, 1000);
    } catch (err) {
      console.error("Login error:", err.response || err);
      toast.error(
        err?.response?.data?.message || "Login failed. Please check credentials."
      );
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white">
      <ToastContainer position="bottom-right" />
      <div className="flex flex-col items-center gap-4 bg-gray-900 p-8 rounded-lg w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">Please log in</h2>

        <input
          type="email"
          name="email"
          value={loginData.email}
          onChange={handleChange}
          placeholder="Enter your email"
          className="w-full px-4 py-2 rounded bg-gray-800 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-red-600"
        />

        <input
          type="password"
          name="password"
          value={loginData.password}
          onChange={handleChange}
          placeholder="Enter your password"
          className="w-full px-4 py-2 rounded bg-gray-800 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-red-600"
        />

        <div className="flex gap-4 mt-4">
          <button
            onClick={handleLogin}
            className="bg-red-600 hover:bg-red-700 px-6 py-2 rounded-full font-semibold transition"
          >
            Login
          </button>

          <Link to="/register">
            <button className="bg-green-600 hover:bg-green-700 px-6 py-2 rounded-full font-semibold transition">
              Signup
            </button>
          </Link>

          <Link to="/">
            <button className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-full font-semibold transition">
              Home
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Login;
