// context/AuthContext.jsx
import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userPic, setUserPic] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedPic = localStorage.getItem("userProfilePic");
    if (token) {
      setIsLoggedIn(true);
      setUserPic(storedPic);
    }
  }, []);

  const login = (profilePic) => {
    setIsLoggedIn(true);
    setUserPic(profilePic || "");
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("userProfilePic");
    setIsLoggedIn(false);
    setUserPic("");
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, userPic, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
