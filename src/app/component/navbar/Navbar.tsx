"use client";

import React, { useRef, useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import mboalogo from "../../../../public/Images/Mboa_event.png";
import "./Navbar.scss";
import { useRouter } from "next/navigation";

const Navbar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const [loading, setIsLoading] = useState<boolean>(false);
  const [user, setUser] = useState<any>(null);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const router = useRouter()
  useEffect(() => {
    // Récupérer les infos utilisateur depuis localStorage
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const toggleDropdown = (event: React.MouseEvent) => {
    event.stopPropagation();
    setIsDropdownOpen((prev) => !prev);
  };

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
    setUser(null);
  };
  const goHome = ()=>{
    router.push('/interface/home')
  }


  return (
    <nav id="navigation">
      <Image src={mboalogo} alt={""} objectFit="contain" className="logo cursor-pointer" onClick={goHome}/>

      {!user ? (
        <ul className="nav-items">
          <li>
            <Link href="/login">
              <span>Se connecter</span>
            </Link>
          </li>
          <li>
            <Link href="/inscription">
              <span>S'inscrire</span>
            </Link>
          </li>
          <li>
            <Link href="/new-event">
              <span>Publier un évènement</span>
            </Link>
          </li>
        </ul>
      ) : (
        <div className="user-section flex flex-row gap-4 items-center justify-center">
          {(user.role === "PARTICIPANT") && (
            <Link href="/interface/become-organizer" id="publish-event-button">
              <span>Publier un évènement</span>
            </Link>
          )}
          {(user.role === "ORGANISATEUR") && (
            <Link href="/interface/new-event" id="publish-event-button">
              <span>Publier un évènement</span>
            </Link>
          )}
          <div className="user-profile">
            <span>
              <svg xmlns="http://www.w3.org/2000/svg" height="30px" viewBox="0 -960 960 960" width="30px" ><path d="M234-276q51-39 114-61.5T480-360q69 0 132 22.5T726-276q35-41 54.5-93T800-480q0-133-93.5-226.5T480-800q-133 0-226.5 93.5T160-480q0 59 19.5 111t54.5 93Zm246-164q-59 0-99.5-40.5T340-580q0-59 40.5-99.5T480-720q59 0 99.5 40.5T620-580q0 59-40.5 99.5T480-440Zm0 360q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q53 0 100-15.5t86-44.5q-39-29-86-44.5T480-280q-53 0-100 15.5T294-220q39 29 86 44.5T480-160Zm0-360q26 0 43-17t17-43q0-26-17-43t-43-17q-26 0-43 17t-17 43q0 26 17 43t43 17Zm0-60Zm0 360Z"/></svg>
            </span>
            <span
              onClick={toggleDropdown}
              className={`arrow-icon ${isDropdownOpen ? "rotate" : ""}`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" height="30px" viewBox="0 -960 960 960" width="30px" ><path d="M480-344 240-584l56-56 184 184 184-184 56 56-240 240Z"/></svg>
            </span>

            {isDropdownOpen && (
              <div className="dropdown-menu" ref={dropdownRef}>
                <ul>
                  {user.role === "PARTICIPANT" && (
                    <>
                      <li>
                        <i className="material-icons">event</i> Mes événements
                      </li>
                      <li>
                        <i className="material-icons">schedule</i> Mon planning
                      </li>
                    </>
                  )}
                  {user.role === "ADMINISTRATEUR" ? (
                    <li>
                      <i className="material-icons">manage_accounts</i> Gérer les utilisateurs
                    </li>
                  ) : (
                    <li>
                      <i className="material-icons">chat</i> Messages (0)
                    </li>
                  )}
                  <li>
                    <i className="material-icons">settings</i> Paramètres
                  </li>
                  <li onClick={handleLogout}>
                    <i className="material-icons">logout</i> Logout
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>
        
      )}
    </nav>
  );
};

export default Navbar;
