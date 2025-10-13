import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useNavigate } from "react-router-dom";

interface AuthContextType {
  token: string | null;
  userName: string | null;
  userId: number | null;
  login: (token: string, userName: string, userId: number) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const [userId, setUserId] = useState<number | null>(null);

  useEffect(() => {
    const storedToken = localStorage.getItem("auth_token");
    const storedUserName = localStorage.getItem("user_name");
    const storedUserId = localStorage.getItem("user_id");
    
    if (storedToken) {
      setToken(storedToken);
      setUserName(storedUserName);
      setUserId(storedUserId ? parseInt(storedUserId) : null);
    }
  }, []);

  const login = (token: string, userName: string, userId: number) => {
    localStorage.setItem("auth_token", token);
    localStorage.setItem("user_name", userName);
    localStorage.setItem("user_id", userId.toString());
    setToken(token);
    setUserName(userName);
    setUserId(userId);
  };

  const logout = () => {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("user_name");
    localStorage.removeItem("user_id");
    setToken(null);
    setUserName(null);
    setUserId(null);
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        userName,
        userId,
        login,
        logout,
        isAuthenticated: !!token,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
