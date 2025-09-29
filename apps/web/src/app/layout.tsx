import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/components/providers/auth-provider"; // 1. Importamos

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ARIA Platform", // Puedes cambiar el título
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
        <AuthProvider> {/* 2. Envolvemos a los "children" */}
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}