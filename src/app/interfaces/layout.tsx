"use client";


import { ReactNode } from "react";
import Sidebar from "../component/sidebar";
import withAuth from "../component/WithAuth";

interface DashboardLayoutProps {
  children: ReactNode;
  userRole?: "admin" | "organizer" | "participant"; // ? signifie qu'il peut être absent
}
const DashboardLayout : React.FC<DashboardLayoutProps> = ({ children }) => {
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

export default withAuth(DashboardLayout, ['ORGANISATEUR', 'ADMINISTRATEUR', 'PARTICIPANT'])
