'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  department?: string;
  // Add other user properties as needed
}

interface SettingsContextType {
  users: User[];
  setUsers: (users: User[]) => void;
  updateUser: (userId: string, userData: Partial<User>) => void;
  deleteUser: (userId: string) => void;
  addUser: (user: User) => void;
  // Add other settings-related functions as needed
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [users, setUsers] = useState<User[]>([]);

  const updateUser = (userId: string, userData: Partial<User>) => {
    setUsers(prevUsers =>
      prevUsers.map(user =>
        user.id === userId ? { ...user, ...userData } : user
      )
    );
  };

  const deleteUser = (userId: string) => {
    setUsers(prevUsers => prevUsers.filter(user => user.id !== userId));
  };

  const addUser = (user: User) => {
    setUsers(prevUsers => [...prevUsers, user]);
  };

  return (
    <SettingsContext.Provider
      value={{
        users,
        setUsers,
        updateUser,
        deleteUser,
        addUser,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
}