/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
//Sidebar.js
import Link from 'next/link';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';

import React, { useEffect, useRef, useState } from 'react';

interface MenuItem {
    id: string;
    icon: string;
    label: string | null;
    children: Array<MenuItem> | null;
    url: string;
  }  

const Sidebar = () => {
    const toggleBtnRef = useRef<HTMLAnchorElement | null>(null);
    const sidebarRef = useRef<HTMLElement>(null);
    const [menuItems, setMenuItems] = useState<Array<MenuItem> | undefined>([]);
    const [role, setRole] = useState<string>("");
    const router = useRouter();
    const pathname = usePathname()
    const searchParams = useSearchParams()
    const [activeItem, setActiveItem] = useState(pathname);

    const handleActive = (url: string) => {
        setActiveItem(url);
    };
    useEffect(() => {
    const storedRole = localStorage.getItem("roles");
    console.log("Stored role from localStorage:", storedRole);
    if (storedRole) {
      setRole(JSON.parse(storedRole));
    } else {
      setRole("ADMINISTRATEUR");
    }
  }, []); // Supprimer `role` des dépendances pour éviter des boucles infinies.

  useEffect(() => {
    if (!role) return; // Empêche la logique si `role` est vide.

    console.log("Role updated:", role);

    const getMenuItems = (): Array<MenuItem> => {
      switch (role) {
        case "ADMINISTRATEUR":
            return [
                {
                  id: "Menu",
                  icon: "menu",
                  label: null,
                  children: null,
                  url: "#",
                },
                {
                  id: "notifications",
                  icon: "notifications",
                  label: "Notifications",
                  children: null,
                  url: "/interfaces/notifications",
                },
                {
                  id: "users",
                  icon: "person",
                  label: "Gestion des utilisateurs",
                  children: [
                    {
                      id: "consult-user-list",
                      icon: "visibility",
                      label: "Liste des utilisateurs",
                      children: null,
                      url: "/interfaces/user-list",
                    },
                    {
                      id: "new-event",
                      icon: "edit",
                      label: "Nouvel utilisateur",
                      children: null,
                      url: "/interfaces/new-user",
                    },
                  ],
                  url: "#",
                },
                {
                  id: "evenements",
                  icon: "event",
                  label: "Gestion des Evenements",
                  children: [
                    {
                      id: "consult-event-list",
                      icon: "visibility",
                      label: "Liste des evenements",
                      children: null,
                      url: "/interfaces/event-list",
                    },
                    {
                      id: "new-event",
                      icon: "edit",
                      label: "Nouvel evenement",
                      children: null,
                      url: "/interfaces/new-event",
                    },
                  ],
                  url: "#",
                },
                {
                  id: "Settings",
                  icon: "settings",
                  label: "Settings",
                  children: null,
                  url: "#",
                },
                {
                  id: "Logout",
                  icon: "logout",
                  label: "Log Out",
                  children: null,
                  url: "#",
                },
              ];
        case "ORGANISATEUR":
            return [
                {
                  id: "Menu",
                  icon: "menu",
                  label: null,
                  children: null,
                  url: "#",
                },
                {
                  id: "notifications",
                  icon: "notifications",
                  label: "Notifications",
                  children: null,
                  url: "/interfaces/notifications",
                },
                {
                  id: "evenements",
                  icon: "event",
                  label: "Mes Evenements",
                  children: [
                    {
                      id: "consult-event-list",
                      icon: "visibility",
                      label: "Liste de mes evenements",
                      children: null,
                      url: "/interfaces/event-list",
                    },
                    {
                      id: "new-event",
                      icon: "edit",
                      label: "Nouvel evenement",
                      children: null,
                      url: "/interfaces/new-event",
                    },
                  ],
                  url: "#",
                },
                {
                  id: "Settings",
                  icon: "settings",
                  label: "Settings",
                  children: null,
                  url: "#",
                },
                {
                  id: "Logout",
                  icon: "logout",
                  label: "Log Out",
                  children: null,
                  url: "#",
                },
              ];
        case "PARTICIPANT":
          return [
            {
              id: "Menu",
              icon: "menu",
              label: null,
              children: null,
              url: "#",
            },
            {
              id: "evenements",
              icon: "event",
              label: "Evenements",
              children: null,
              url: "/interfaces/participant/event-list",
            },
            {
              id: "notifications",
              icon: "notifications",
              label: "Notifications",
              children: null,
              url: "/interfaces/participant/notification",
            },
            {
              id: "paiement-history",
              icon: "history",
              label: "Historique de Paiement",
              children: null,
              url: "/interfaces/participant/paiementhistory",
            },
            {
              id: "calendar",
              icon: "calendar_month",
              label: "Calendrier",
              children: null,
              url: "/interfaces/participant/calendar",
            },/*
            {
              id: "evenements",
              icon: "event",
              label: "Evenements",
              children: [
                {
                  id: "consult-voting-result",
                  icon: "visibility",
                  label: "Consult office results",
                  children: null,
                  url: "/Interfaces/voting-results",
                },
                {
                  id: "insert-result",
                  icon: "edit",
                  label: "Edit office result",
                  children: null,
                  url: "/Interfaces/new-result",
                },
              ],
              url: "#",
            },*/
            {
              id: "Settings",
              icon: "settings",
              label: "Settings",
              children: null,
              url: "#",
            },
            {
              id: "Logout",
              icon: "logout",
              label: "Log Out",
              children: null,
              url: "#",
            },
          ];
        default:
          console.log("Role is :", role);
          return [];
      }
    };

    const items = getMenuItems();
    console.log("Generated menu items:", items);
    setMenuItems(items);
  }, [role]); // Dépend uniquement de `role`.
  const closeAllSubMenus = () => {
    const showElements = Array.from(
      sidebarRef.current?.getElementsByClassName("show") || []
    );
    showElements.forEach((ul) => {
      ul.classList.remove("show");
      ul.previousElementSibling?.classList.remove("rotate");
    });
  };
  function toggleSubMenu(button: any): void {
    //closeAllSubMenus()
    if (!button.nextElementSibling.classList.contains("show")) {
      closeAllSubMenus();
    }
    button.nextElementSibling?.classList.toggle("show");
    button.classList.toggle("rotate");

    if (sidebarRef.current?.classList.contains("close")) {
      sidebarRef.current.classList.toggle("close");
      toggleBtnRef.current?.classList.toggle("rotate");
    }
  }

  return (
    <aside className='sticky top-0 h-screen p-[5px] px-4 border-r border-r-[#1a4162] overflow-y-auto whitespace-nowrap max-w-[300px] min-w-[150px] bg-[#1a4162]' ref={sidebarRef}>
        <ul className="list-none">
            {menuItems?.map((item) => (
            <li key={item.id} className='text-[#d4dbe0de]'>
            {item.children ? (
                <>
                <button
                    onClick={(e) =>
                    toggleSubMenu(e.currentTarget as HTMLButtonElement)
                    }
                    className="dropdown-btn w-full rounded-[0.5em] p-[0.85em] no-underline text-left bg-none border-none cursor-pointer flex items-center gap-[1em]"
                >
                    <i className="material-icons">{item.icon}</i>
                    <span className="flex-grow">{item.label}</span>
                    <i className="material-icons">arrow_drop_down</i>
                </button>
                <ul className="grid grid-rows-[0fr] transition-all duration-300 ease-in-out pl-[1em]">
                    <div className="overflow-hidden">
                    {item.children.map((child) => (
                        <li key={child.id}>
                        <Link
                            href={child.url}
                            className={`rounded-[0.5em] p-[0.85em] no-underline flex items-center gap-[1em] ${
                            activeItem === child.url ? " text-white" : ""
                            }`}
                            onClick={() => handleActive(child.url)}
                        >
                            <i className="material-icons">{child.icon}</i>
                            <span className="flex-grow">{child.label}</span>
                        </Link>
                        </li>
                    ))}
                    </div>
                </ul>
                </>
            ) : (
                <Link
                href={item.url}
                className={`rounded-[0.5em] p-[0.85em] no-underline flex items-center gap-[1em] ${
                    activeItem === item.url ? " text-white" : ""
                }`}
                onClick={() => handleActive(item.url)}
                >
                <i className="material-icons">{item.icon}</i>
                <span className="flex-grow">{item.label}</span>
                </Link>
            )}
            </li>
        ))}
    </ul>
    </aside>
  );
};

export default Sidebar;
