'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '@/lib/firebase'; // Nuestra conexión a Firebase

// 1. Definimos cómo se verá la "tarjeta de identificación" (el contexto)
interface AuthContextType {
  user: User | null; // El objeto de usuario de Firebase o null si no está logueado
  loading: boolean;  // Un indicador para saber si estamos "cargando" el estado inicial
}

// 2. Creamos el "espacio" para guardar la tarjeta
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// 3. Este es el componente "Porta-Tarjetas"
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // onAuthStateChanged es el "oyente" mágico de Firebase.
    // Se ejecuta cada vez que el usuario inicia o cierra sesión.
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    // Limpiamos el oyente cuando el componente se desmonta para evitar fugas de memoria
    return () => unsubscribe();
  }, []);

  const value = { user, loading };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// 4. Este es nuestro "Lector de Tarjetas"
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};