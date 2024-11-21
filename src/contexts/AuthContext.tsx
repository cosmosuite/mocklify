import { createContext, useContext, useState } from 'react';

interface User {
  id: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  signOut: () => void;
  signIn: (email: string) => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  signOut: () => {},
  signIn: () => {}
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem('demo_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const signIn = (email: string) => {
    const newUser = {
      id: Math.random().toString(36).substr(2, 9),
      email
    };
    setUser(newUser);
    localStorage.setItem('demo_user', JSON.stringify(newUser));
  };

  const signOut = () => {
    setUser(null);
    localStorage.removeItem('demo_user');
  };

  return (
    <AuthContext.Provider value={{ user, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}