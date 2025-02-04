import React, { createContext, useContext, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { navigationRef } from "../../App";

interface User {
  token: string;
  first_name: string;
  last_name: string;
  email: string;
}

interface UserContextProps {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  logout: () => void;
}

const UserContext = createContext<UserContextProps | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  const logout = async () => {
    await AsyncStorage.removeItem("authToken"); // Clears stored token
    setUser(null);
    if (navigationRef.isReady()) {
      navigationRef.reset({ index: 0, routes: [{ name: "Login" }] });
    }
  };
  

  return (
    <UserContext.Provider value={{ user, setUser, logout }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
