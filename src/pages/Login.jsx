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
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLoginData((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogin = async (e) => {
    if (e) e.preventDefault();
    if (!loginData.email || !loginData.password) {
      toast.error("Please enter both email and password.");
      return;
    }
    setLoading(true);
    try {
      const response = await axios.post(
        "http://localhost:4001/api/users/login",
        loginData,
        { withCredentials: true }
      );

      const { token, user_id, user } = response.data;
      const userId = user_id || user?._id || user?.id;
      const userName = user?.userName || "";
      const channelName = user?.channelName || "";
       const channelId =
    user?.channelId ||
    user?.channel?._id || // If backend populates "channel"
    user?.channelId ||
    "";
      const profilePic = user?.profilePic || "";

      if (!userId) {
        toast.error("User ID not found in response.");
        setLoading(false);
        return;
      }

      localStorage.setItem("token", token);
      localStorage.setItem("userId", userId);
      localStorage.setItem("userName", userName);
      localStorage.setItem("channelName", channelName);
       localStorage.setItem("channelId", channelId);
      localStorage.setItem("userProfilePic", profilePic);
      localStorage.setItem("user", JSON.stringify(user || {}));

      login(profilePic, token, userId, userName, channelName, channelId);

      toast.success("Login successful!");

      setTimeout(() => {
        navigate(`/user/${userId}`);
      }, 1000);
    } catch (err) {
      console.error("Login error:", err.response || err);
      toast.error(
        err?.response?.data?.message || "Login failed. Please check credentials."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white">
      <ToastContainer position="bottom-right" />
      <form
        className="flex flex-col items-center gap-4 bg-gray-900 p-8 rounded-lg w-full max-w-md"
        onSubmit={handleLogin}
      >
        <h2 className="text-xl font-semibold mb-4">Please log in</h2>

        <input
          type="email"
          name="email"
          value={loginData.email}
          onChange={handleChange}
          placeholder="Enter your email"
          className="w-full px-4 py-2 rounded bg-gray-800 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-red-600"
          aria-label="Email"
          autoComplete="email"
        />

        <input
          type="password"
          name="password"
          value={loginData.password}
          onChange={handleChange}
          placeholder="Enter your password"
          className="w-full px-4 py-2 rounded bg-gray-800 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-red-600"
          aria-label="Password"
          autoComplete="current-password"
        />

        <div className="flex gap-4 mt-4">
          <button
            type="submit"
            disabled={loading}
            className={`bg-red-600 hover:bg-red-700 px-6 py-2 rounded-full font-semibold transition ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            {loading ? "Logging in..." : "Login"}
          </button>

          <Link to="/register">
            <button type="button" className="bg-green-600 hover:bg-green-700 px-6 py-2 rounded-full font-semibold transition">
              Signup
            </button>
          </Link>

          <Link to="/">
            <button type="button" className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-full font-semibold transition">
              Home
            </button>
          </Link>
        </div>
      </form>
    </div>
  );
}

export default Login;
