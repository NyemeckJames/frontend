"use client";

import { useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridMonth from "@fullcalendar/daygrid"; // Vue mensuelle

interface Event {
  id: string;
  title: string;
  date: string; // Format YYYY-MM-DD
}

export default function ParticipantDashboard() {
  // Liste des événements auxquels le participant est inscrit
  const [events] = useState<Event[]>([
    { id: "1", title: "Concert Jazz", date: "2025-02-25" },
    { id: "2", title: "Hackathon Tech", date: "2025-02-20" },
  ]);

  return (
    <div className="flex flex-col items-center min-h-screen p-6 bg-gray-100">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Mon Calendrier Mensuel</h1>

      <div className="bg-white shadow-lg p-6 rounded-lg w-full max-w-4xl">
        {/* Affichage du calendrier avec la vue mensuelle */}
        <FullCalendar
          plugins={[dayGridMonth]} // Mode "Mois"
          initialView="dayGridMonth" // Affiche un seul mois
          events={events} // Marque les événements
          eventColor="blue" // Couleur des événements
          height="auto"
        />
      </div>

      {/* Liste des événements inscrits */}
      <div className="mt-6 w-full max-w-lg">
        <h2 className="text-xl font-semibold mb-4 text-gray-700">Événements enregistrés</h2>
        <ul className="bg-white p-4 rounded-lg shadow">
          {events.length > 0 ? (
            events.map(event => (
              <li key={event.id} className="p-2 border-b border-gray-200">
                <span className="font-semibold text-gray-900">{event.title}</span> - {event.date}
              </li>
            ))
          ) : (
            <p className="text-gray-500">Aucun événement enregistré.</p>
          )}
        </ul>
      </div>
    </div>
  );
}
