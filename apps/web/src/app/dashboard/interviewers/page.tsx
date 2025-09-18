'use client';

import dynamic from 'next/dynamic';

// Importar el componente dinámicamente para evitar problemas de SSR
const InterviewerSelector = dynamic(
  () => import('./InterviewerSelector'),
  { ssr: false }
);

export default function InterviewersPage() {
  return <InterviewerSelector />;
}