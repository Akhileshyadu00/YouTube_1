import React, { useState } from "react";
import { Link } from "react-router-dom";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = () => {
    if (username.trim() && password.trim()) {
      setIsLoggedIn(true);
      // Optional: Store in localStorage if needed
      localStorage.setItem("username", username);
      localStorage.setItem("isLoggedIn", "true");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white">
      {isLoggedIn ? (
        <h1 className="text-2xl font-bold">Welcome, {username}!</h1>
      ) : (
        <div className="flex flex-col items-center gap-4">
          <h2 className="text-xl">Please log in</h2>

          <input
            type="text"
            value={username}
            placeholder="Enter your username"
            onChange={(e) => setUsername(e.target.value)}
            className="px-4 py-2 rounded bg-gray-800 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-red-600"
          />

          <input
            type="password"
            value={password}
            placeholder="Enter your password"
            onChange={(e) => setPassword(e.target.value)}
            className="px-4 py-2 rounded bg-gray-800 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-red-600"
          />

          <div className="flex gap-4">
            <button
              onClick={handleLogin}
              className="bg-red-600 hover:bg-red-700 px-6 py-2 rounded-full font-semibold transition"
            >
              Login
            </button>

            <Link to={'/register'}>
            <button
              onClick={handleLogin}
              className="bg-green-600 hover:bg-green-700 px-6 py-2 rounded-full font-semibold transition"
            >
              Signup
            </button>
            </Link>

            <Link to={"/"}>
              <button className="bg-green-600 hover:bg-green-700 px-6 py-2 rounded-full font-semibold transition">
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