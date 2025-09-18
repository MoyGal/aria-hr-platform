import { ClerkProvider } from '@clerk/nextjs';
import './globals.css';

export const metadata = {
  title: 'Aria HR Platform',
  description: 'AI-powered recruitment automation platform',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className="bg-gray-900 text-white">
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}