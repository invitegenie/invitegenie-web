import { createContext, useState, useContext, useEffect } from "react";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("invitegenie_auth");
    return saved ? JSON.parse(saved) : null;
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(false);
  }, []);

  const login = (userData) => {
    const newUser = { 
      id: "user-" + Date.now(), 
      name: userData.name || "Demo User", 
      email: userData.email, 
      role: userData.role || "BASIC_USER",
      tier: userData.role === "EVENT_HOST" ? "PRO" : "BASIC"
    };
    setUser(newUser);
    localStorage.setItem("invitegenie_auth", JSON.stringify(newUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("invitegenie_auth");
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      currentUser: user,
      role: user?.role || null,
      isAuthenticated: !!user,
      login, 
      logout 
    }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
