import { createContext, useContext, useEffect, useState } from "react";
import { loginUser, registerUser } from "../services/authApi";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load auth from localStorage on app start
  useEffect(() => {
    const storedUser = localStorage.getItem("chatzone_user");
    const storedToken = localStorage.getItem("chatzone_token");

    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
      setToken(storedToken);
    }

    setLoading(false);
  }, []);

  // LOGIN
  const login = async (formData) => {
    const res = await loginUser(formData);

    setUser(res.data);
    setToken(res.data.token);

    localStorage.setItem("chatzone_user", JSON.stringify(res.data));
    localStorage.setItem("chatzone_token", res.data.token);
  };

  // REGISTER
  const register = async (formData) => {
    const res = await registerUser(formData);

    setUser(res.data);
    setToken(res.data.token);

    localStorage.setItem("chatzone_user", JSON.stringify(res.data));
    localStorage.setItem("chatzone_token", res.data.token);
  };

  // LOGOUT
  const logout = () => {
    setUser(null);
    setToken(null);

    localStorage.removeItem("chatzone_user");
    localStorage.removeItem("chatzone_token");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token,
        loading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook (VERY IMPORTANT)
export const useAuth = () => {
  return useContext(AuthContext);
};
