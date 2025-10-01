// Este es el ARCHIVO RAÍZ: src/app/layout.tsx
// El que necesita <html> y <body>

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/components/providers/auth-provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ARIA Platform",
  description: "Next-Gen HR Platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        {/* El AuthProvider debe estar aquí, en el nivel más alto,
            para que toda la aplicación (incluyendo tu dashboard)
            pueda saber si el usuario está conectado. */}
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}