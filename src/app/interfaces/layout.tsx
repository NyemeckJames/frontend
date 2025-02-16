"use client";


import { ReactNode } from "react";
import Sidebar from "../component/sidebar";

interface DashboardLayoutProps {
  children: ReactNode;
  userRole: "admin" | "organizer" | "participant"; // Passez le rôle de l'utilisateur ici
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    
    <div className="grid grid-cols-[auto_1fr]  
            min-h-screen ">
      {/* Sidebar component */}
      <Sidebar />
      {/* Main content of the homepage */}
      <main>
        {children}
      </main>
    </div>
  );
}
