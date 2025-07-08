// context/AuthContext.jsx
import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userPic, setUserPic] = useState("");
  const [userId, setUserId] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
  const storedPic = localStorage.getItem("userProfilePic") || "";
  const storedUserId = localStorage.getItem("userId") || "";
  
    if (token) {
      setIsLoggedIn(true);
      setUserPic(storedPic);
       setUserId(storedUserId || "");
    }
  }, []);

const login = (profilePic, token, userId) => {
  if (token) localStorage.setItem("token", token);
  if (userId) {
    localStorage.setItem("userId", userId);
    setUserId(userId);
  }
  if (profilePic) localStorage.setItem("userProfilePic", profilePic);

  setIsLoggedIn(true);
  setUserPic(profilePic || "");
};

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("userProfilePic");
    setIsLoggedIn(false);
    setUserPic("");
    setUserId(""); // ✅ reset userId in state
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, userPic,userId, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
