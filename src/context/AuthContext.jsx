import { createContext, useState, useEffect, useMemo } from "react";
import PropTypes from "prop-types";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userPic, setUserPic] = useState("");
  const [userId, setUserId] = useState("");
  const [userName, setUserName] = useState("");
  const [channelName, setChannelName] = useState("");
  const [token, setToken] = useState(""); 
  const [channelId, setChannelId] = useState("");

  // Restore auth state from localStorage on mount
  useEffect(() => {
    const storedToken = localStorage.getItem("token") || "";
    const storedPic = localStorage.getItem("userProfilePic") || "";
    const storedUserId = localStorage.getItem("userId") || "";
    const storedUserName = localStorage.getItem("userName") || "";
    const storedChannelName = localStorage.getItem("channelName") || "";
    const storedChannelId = localStorage.getItem("channelId") || "";

    if (storedToken && storedUserId) {
      setIsLoggedIn(true);
      setUserId(storedUserId);
      setUserPic(storedPic);
      setUserName(storedUserName);
      setChannelName(storedChannelName);
      setToken(storedToken); 
      setChannelId(storedChannelId);
    }
  }, []);

  const login = (profilePic, token, userId, userName, channelName, channelId) => {
    if (token) {
      localStorage.setItem("token", token);
      setToken(token);
    }
    if (userId) {
      localStorage.setItem("userId", userId);
      setUserId(userId);
    }
    if (profilePic) {
      localStorage.setItem("userProfilePic", profilePic);
      setUserPic(profilePic);
    }
    if (userName) {
      localStorage.setItem("userName", userName);
      setUserName(userName);
    }
    if (channelName) {
      localStorage.setItem("channelName", channelName);
      setChannelName(channelName);
    }
    if (channelId) {
      localStorage.setItem("channelId", channelId);
      setChannelId(channelId);
    }
    setIsLoggedIn(true);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("userProfilePic");
    localStorage.removeItem("userName");
    localStorage.removeItem("channelName");
    localStorage.removeItem("channelId");
    setIsLoggedIn(false);
    setUserPic("");
    setUserId("");
    setUserName("");
    setChannelName("");
    setToken(""); 
    setChannelId("");
  };

  // Memoize value to prevent unnecessary re-renders
  const value = useMemo(() => ({
    isLoggedIn,
    userPic,
    userId,
    userName,
    channelName,
    token, 
    channelId,
    login,
    logout,
  }), [
    isLoggedIn, userPic, userId, userName, channelName, token, channelId
  ]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
