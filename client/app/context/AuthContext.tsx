import React, { createContext, useContext, useState } from 'react';

interface AuthContextProps {
  username: string | null;
  userId:string|null;
  login: (username: string,userId:string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [username, setUsername] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  const login = (username: string,userId:string) => {
    setUsername(username);
    setUserId(userId);
  };

  const logout = () => {
    setUsername(null);
    setUserId(null)
  };

  return (
    <AuthContext.Provider value={{ userId,username, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextProps => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
