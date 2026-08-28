import { createContext, useContext, useEffect, useState, useRef } from "react";
import api from "../services/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [role, setRole] = useState(localStorage.getItem("role"));
  const [loading, setLoading] = useState(true);
  const logoutTimerRef = useRef(null); // ✅ Timer reference

  // ─── Helper: Decode JWT ───
  const parseJwt = (token) => {
    try {
      return JSON.parse(atob(token.split('.')[1]));
    } catch (e) {
      return null;
    }
  };

  // ─── Get expiry timestamp from token ───
  const getTokenExpiry = (token) => {
    const decoded = parseJwt(token);
    if (decoded && decoded.exp) {
      return decoded.exp * 1000; // convert to milliseconds
    }
    return null;
  };

  // ─── Logout function ───
  const logout = () => {
    // Clear timer
    if (logoutTimerRef.current) {
      clearTimeout(logoutTimerRef.current);
      logoutTimerRef.current = null;
    }

    // Clear storage
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("tokenExpiry");

    // Reset state
    setToken(null);
    setRole(null);

    // Redirect to login page
    window.location.href = "/webadmin/login";
  };

  // ─── Setup auto-logout timer ───
  const setupLogoutTimer = (token) => {
    // Clear existing timer
    if (logoutTimerRef.current) {
      clearTimeout(logoutTimerRef.current);
      logoutTimerRef.current = null;
    }

    const expiry = getTokenExpiry(token);
    if (expiry) {
      const now = Date.now();
      const timeLeft = expiry - now;

      if (timeLeft > 0) {
        // Set timer to logout after remaining time
        logoutTimerRef.current = setTimeout(() => {
          logout();
        }, timeLeft);

        // Store expiry for page reloads
        localStorage.setItem("tokenExpiry", expiry.toString());
      } else {
        // Token already expired → logout immediately
        logout();
      }
    }
  };

  // ─── On mount: check token and set timer ───
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedExpiry = localStorage.getItem("tokenExpiry");

    if (storedToken && storedExpiry) {
      const expiry = parseInt(storedExpiry, 10);
      const now = Date.now();

      if (now >= expiry) {
        // Token expired → logout
        logout();
      } else {
        // Set timer for remaining time
        const timeLeft = expiry - now;
        logoutTimerRef.current = setTimeout(() => {
          logout();
        }, timeLeft);

        // Set state
        setToken(storedToken);
        setRole(localStorage.getItem("role"));
      }
    }

    setLoading(false);

    // Cleanup timer on unmount
    return () => {
      if (logoutTimerRef.current) {
        clearTimeout(logoutTimerRef.current);
        logoutTimerRef.current = null;
      }
    };
  }, []);

  // ─── When token changes (login/logout) ───
  useEffect(() => {
    if (token) {
      setupLogoutTimer(token);
    } else {
      // Token cleared → clear timer
      if (logoutTimerRef.current) {
        clearTimeout(logoutTimerRef.current);
        logoutTimerRef.current = null;
      }
    }
  }, [token]);

  // ─── Login function ───
  const login = async (username, password) => {
    try {
      const response = await api.post("/auth/login", {
        username,
        password,
      });

      const { token, role } = response.data;

      localStorage.setItem("token", token);
      localStorage.setItem("role", role);

      const expiry = getTokenExpiry(token);
      if (expiry) {
        localStorage.setItem("tokenExpiry", expiry.toString());
      }

      setToken(token);
      setRole(role);

      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data || "Username ya Password galat hai.",
      };
    }
  };

  const isAuthenticated = !!token;

  return (
    <AuthContext.Provider
      value={{
        token,
        role,
        loading,
        login,
        logout,
        isAuthenticated,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);