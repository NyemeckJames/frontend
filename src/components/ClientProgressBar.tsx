"use client";

import NextNProgress from "nextjs-progressbar";
import { Toaster } from "@/components/ui/toaster";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {/* Barre de progression */}
      <NextNProgress color="#29D" startPosition={0.3} stopDelayMs={200} height={3} showOnShallow={true} />
      
      {children}
      <Toaster />
    </>
  );
}
