"use client";

import Link from "next/link";
import { ReactNode } from "react";

interface DashboardLayoutProps {
  children: ReactNode;
  userRole?: "admin" | "organizer" | "participant"; // ? signifie qu'il peut être absent
}

export default function DashboardLayout({ children, userRole = "admin" }: DashboardLayoutProps) {
  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Barre latérale */}
      <aside className="w-64 bg-gradient-to-b from-gray-800 to-gray-900 text-white p-6 shadow-lg">
        <h2 className="text-2xl font-bold mb-8 text-center">Dashboard</h2>
        <nav>
          <ul className="space-y-4">
            {/* Menu Admin */}
            {userRole === "admin" && (
              <>
                <li>
                  <span className="block text-lg font-semibold text-gray-300">Gestion des utilisateurs</span>
                  <ul className="space-y-2 pl-4">
                    <li>
                      <Link href="/dashboard/gestion-utilisateurs/liste" className="hover:text-gray-300">
                        Liste des utilisateurs
                      </Link>
                    </li>
                    <li>
                      <Link href="/dashboard/gestion-utilisateurs/ajout" className="hover:text-gray-300">
                        Ajouter un utilisateur
                      </Link>
                    </li>
                  </ul>
                </li>
                <li>
                  <span className="block text-lg font-semibold text-gray-300">Gestion des événements</span>
                  <ul className="space-y-2 pl-4">
                    <li>
                      <Link href="/dashboard/gestion-evenements/liste" className="hover:text-gray-300">
                        Liste des événements
                      </Link>
                    </li>
                    <li>
                      <Link href="/dashboard/gestion-evenements/ajout" className="hover:text-gray-300">
                        Ajouter un événement
                      </Link>
                    </li>
                  </ul>
                </li>
              </>
            )}

            {/* Menu Organisateur */}
            {userRole === "organizer" && (
              <>
                <li>
                  <span className="block text-lg font-semibold text-gray-300">Événements</span>
                  <ul className="space-y-2 pl-4">
                    <li>
                      <Link href="/dashboard/gestion-evenements/ajout" className="hover:text-gray-300">
                        Créer un événement
                      </Link>
                    </li>
                    <li>
                      <Link href="/dashboard/participants" className="hover:text-gray-300">
                        Liste des participants
                      </Link>
                    </li>
                  </ul>
                </li>
              </>
            )}

            {/* Menu Participant */}
            {userRole === "participant" && (
              <>
                <li>
                  <span className="block text-lg font-semibold text-gray-300">Événements</span>
                  <ul className="space-y-2 pl-4">
                    <li>
                      <Link href="/dashboard/evenements-publiques" className="hover:text-gray-300">
                        Voir les événements publiés
                      </Link>
                    </li>
                    <li>
                      <Link href="/dashboard/calendrier" className="hover:text-gray-300">
                        Mon calendrier
                      </Link>
                    </li>
                  </ul>
                </li>
              </>
            )}
          </ul>
        </nav>
      </aside>

      {/* Zone de contenu principal */}
      <main className="flex-1 p-8">
        {children}
      </main>
    </div>
  );
}
