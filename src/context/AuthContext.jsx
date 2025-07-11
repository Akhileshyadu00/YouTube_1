import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userPic, setUserPic] = useState("");
  const [userId, setUserId] = useState("");
  const [userName, setUserName] = useState("");
  const [channelName, setChannelName] = useState("");
  const [token, setToken] = useState(""); 

  // Restore auth state from localStorage on mount
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedPic = localStorage.getItem("userProfilePic");
    const storedUserId = localStorage.getItem("userId");
    const storedUserName = localStorage.getItem("userName");
    const storedChannelName = localStorage.getItem("channelName");

    // FIX: use storedToken, not token state here!
    if (storedToken && storedUserId) {
      setIsLoggedIn(true);
      setUserId(storedUserId);
      setUserPic(storedPic || "");
      setUserName(storedUserName || "");
      setChannelName(storedChannelName || "");
      setToken(storedToken); 
    }
  }, []);

  const login = (profilePic, token, userId, userName, channelName) => {
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
    setIsLoggedIn(true);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("userProfilePic");
    localStorage.removeItem("userName");
    localStorage.removeItem("channelName");
    setIsLoggedIn(false);
    setUserPic("");
    setUserId("");
    setUserName("");
    setChannelName("");
    setToken(""); 
  };

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        userPic,
        userId,
        userName,
        channelName,
        token, 
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
