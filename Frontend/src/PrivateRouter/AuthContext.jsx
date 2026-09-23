import { createContext, useContext, useEffect, useState } from "react";

const normalizeRole = (role) => String(role || "").trim().toLowerCase();

const AuthContext = createContext();

export { AuthContext };
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profileName, setProfileName] = useState(null);
  const [loading, setLoading] = useState(true);

  const checkAuth = () => {
    const token = localStorage.getItem("token");
    const storedUserStr = localStorage.getItem("user");

    if (token && storedUserStr) {
      try {
        const storedUser = JSON.parse(storedUserStr);
        const normalizedUser = {
          ...storedUser,
          role: normalizeRole(storedUser.role || "user"),
        };
        setUser(normalizedUser);
        setProfileName({
          displayName:
            normalizedUser.username ||
            normalizedUser.email?.split("@")[0] ||
            "User",
          email: normalizedUser.email || "",
          role: normalizedUser.role || "user",
          photoURL: normalizedUser.photoURL || "",
          uid: normalizedUser.uid || "",
        });
      } catch (error) {
        setUser(null);
        setProfileName(null);
      }
    } else {
      setUser(null);
      setProfileName(null);
    }
    setLoading(false);
  };

  const login = (userData, token) => {
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("token", token);
    checkAuth();
  };

  const logoutContext = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    checkAuth();
  };

  const [cachedData, setCachedData] = useState({});

  const updateCache = (key, data) => {
    setCachedData(prev => ({ ...prev, [key]: data }));
  };

  const clearCache = () => setCachedData({});

  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ 
      user, 
      profileName, 
      login, 
      logout: () => { logoutContext(); clearCache(); },
      cachedData,
      updateCache
    }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
