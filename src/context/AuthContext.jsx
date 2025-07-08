import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userPic, setUserPic] = useState("");
  const [userId, setUserId] = useState("");
  

  // Restore auth state from localStorage on mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedPic = localStorage.getItem("userProfilePic");
    const storedUserId = localStorage.getItem("userId");

    if (token && storedUserId) {
      setIsLoggedIn(true);
      setUserId(storedUserId);
      setUserPic(storedPic || "");
    }
  }, []);

  const login = (profilePic, token, userId) => {
    if (token) localStorage.setItem("token", token);
    if (userId) {
      localStorage.setItem("userId", userId);
      setUserId(userId);
    }
    if (profilePic) {
      localStorage.setItem("userProfilePic", profilePic);
      setUserPic(profilePic);
    }

    setIsLoggedIn(true);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("userProfilePic");
    setIsLoggedIn(false);
    setUserPic("");
    setUserId("");
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, userPic, userId, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
