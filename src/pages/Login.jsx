import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Login() {
  const [login, setLogin] = useState({
    email: "",
    password: "",
  });

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLogin((prev) => ({ ...prev, [name]: value }));
  };

  // const handleLogin = async () => {
  //   try {
  //     const response = await axios.post(
  //       "http://localhost:4001/api/users/login",
  //       login
  //     );
  //     console.log(response);
      
  //     // Assuming backend sends token + username
  //     const { token, userName, user_id } = response.data;

  //     toast.success("Login successful!");
  //     setIsLoggedIn(true);
  //     setUserName(userName);

  //     // Store token in localStorage (optional)
  //     localStorage.setItem("token", token);
  //     localStorage.setItem('userId', response.user_id);
  

  //    // Redirect after short delay
  //     setTimeout(() => {
  //       navigate("/");
  //     }, 1500);
  //   } catch (err) {
  //     console.error("Login error:", err.response || err);
  //     toast.error(
  //       err?.response?.data?.message || "Login failed. Please check credentials."
  //     );
  //   }
  // };

  const handleLogin = async () => {
  try {
    const response = await axios.post(
      "http://localhost:4001/api/users/login",
      login
    );
    console.log(response);
    
    const { token, userName, user_id } = response.data;

    toast.success("Login successful!");
    setIsLoggedIn(true);
    setUserName(userName);

    localStorage.setItem("token", token);
    localStorage.setItem("userId", user_id);
    localStorage.setItem("userProfilePic", response.data.user.profilePic);


    setTimeout(() => {
      navigate("/");
    }, 1500);
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
      {isLoggedIn ? (
        <h1 className="text-2xl font-bold">Welcome, {userName}!</h1>
      ) : (
        <div className="flex flex-col items-center gap-4 bg-gray-900 p-8 rounded-lg w-full max-w-md">
          <h2 className="text-xl font-semibold mb-4">Please log in</h2>

          <input
            type="email"
            name="email"
            value={login.email}
            onChange={handleChange}
            placeholder="Enter your email"
            className="w-full px-4 py-2 rounded bg-gray-800 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-red-600"
          />

          <input
            type="password"
            name="password"
            value={login.password}
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
      )}
    </div>
  );
}

export default Login;
