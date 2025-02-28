import React from "react";
import "../component/layout.scss";
import Navbar from "../component/navbar/Navbar";
interface LayoutProps {
  children: React.ReactNode; // Accepte des enfants React
}
const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="layout-personal">
      <style>
        @import
        url('https://fonts.googleapis.com/css2?family=Platypi:ital,wght@0,300..800;1,300..800&family=Podkova:wght@400..800&display=swap');
      </style>
      <Navbar />
      <main>{children}</main>
    </div>
  );
};

export default Layout;
