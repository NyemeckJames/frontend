"use client";

import { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css"; // Import du style par défaut

interface Event {
  id: string;
  name: string;
  date: string; // Format YYYY-MM-DD
}

export default function ParticipantDashboard() {
  // Liste des événements auxquels le participant est inscrit
  const [events] = useState<Event[]>([
    { id: "1", name: "Concert Jazz", date: "2024-06-15" },
    { id: "2", name: "Hackathon Tech", date: "2024-07-10" },
  ]);

  // Extraire les dates des événements pour les marquer dans le calendrier
  const eventDates = events.map(event => event.date);

  // Fonction pour définir le style des jours d'événement
  const tileClassName = ({ date, view }: { date: Date; view: string }) => {
    if (view === "month") {
      const dateString = date.toISOString().split("T")[0]; // Convertir en format YYYY-MM-DD
      if (eventDates.includes(dateString)) {
        return "bg-blue-500 text-white rounded-full"; // Style des dates d'événement
      }
    }
    return "";
  };

  return (
    <div className="flex flex-col items-center min-h-screen p-6 bg-gray-100">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">Mon Calendrier</h1>

      <div className="bg-white shadow-lg p-6 rounded-lg">
        {/* Affichage du calendrier */}
        <Calendar
          className="w-full"
          tileClassName={tileClassName} // Appliquer les styles aux dates avec événements
        />
      </div>

      {/* Liste des événements inscrits */}
      <div className="mt-6 w-full max-w-lg">
        <h2 className="text-xl font-semibold mb-4 text-gray-700">Événements enregistrés</h2>
        <ul className="bg-white p-4 rounded-lg shadow">
          {events.length > 0 ? (
            events.map(event => (
              <li key={event.id} className="p-2 border-b border-gray-200">
                <span className="font-semibold text-gray-900">{event.name}</span> - {event.date}
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
