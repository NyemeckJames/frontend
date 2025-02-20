/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import { useEffect, useState } from "react";

interface Billet {
  quantity: number;
}
const userstr = localStorage.getItem("user");
let user: any;
if (userstr) {
  user = JSON.parse(userstr);
}

interface Event {
  id: string;
  titre: string;
  date_heure: string;
  lieu: string;
  billets_disponibles: number;
}

const EventList = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [totalEvents, setTotalEvents] = useState<number>(0);
  const [totalBillets, setTotalBillets] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(false);


 // Fonction pour récupérer les événements depuis l'API
const fetchEvents = async () => {
  setIsLoading(true); // Démarre le chargement
  try {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("roles")?.replace(/"/g, ""); // Supprime les guillemets si présents
    const user = JSON.parse(localStorage.getItem("user") || "{}");

    if (!token || !role || !user.id) {
      alert("Informations utilisateur manquantes. Veuillez vous reconnecter.");
      return;
    }

    const url =
      role === "ADMINISTRATEUR"
        ? "http://localhost:8000/evenements/get_all/"
        : "http://localhost:8000/evenements/mes-evenements/";

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Erreur API : ${response.statusText}`);
    }

    const data = await response.json();
    console.log("Données récupérées :", data);

    setEvents(data);
    setTotalEvents(data.length);
    setTotalBillets(
      data.reduce(
        (sum: number, event: { billets_disponibles: number }) =>
          sum + event.billets_disponibles,
        0
      )
    );
  } catch (error) {
    console.error("Erreur lors de la récupération des événements", error);
    alert("Impossible de récupérer les événements. Veuillez réessayer.");
  }finally {
    setIsLoading(false); // Arrête le chargement
  }
};


  // Fonction pour supprimer un événement
  const deleteEvent = async (eventId: string) => {
    try {
      console.log("Suppression de l'événement ID :", eventId);
      const response = await fetch(`http://localhost:8000/evenements/${eventId}`, {
        method: "DELETE",
        
      });
      console.log("Réponse de la suppression :", response);
      if (!response.ok) {
        throw new Error(`Erreur : ${response.status} - ${response.statusText}`);
      }

      // Mise à jour de l'état après suppression
      const updatedEvents = events.filter((event) => event.id !== eventId);
    setEvents(updatedEvents);
    setTotalEvents(updatedEvents.length);
    const total = updatedEvents.reduce(
      (sum: number, event: Event) =>
        sum + (Array.isArray(event.billets_disponibles) 
          ? event.billets_disponibles.reduce(
              (acc: number, billet: Billet) => acc + billet.quantity, 
              0
            ) 
          : 0),
      0
    );
    
      console.log("Événement supprimé avec succès !");
    } catch (error) {
      console.error("Erreur lors de la suppression de l'événement", error);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  return (
    <div className="flex flex-col items-center min-h-screen bg-[#F5F5F5] p-6">
      <h1 className="text-2xl font-bold text-[#1A4162] mb-6">Liste de mes Événements</h1>

      {/* Statistiques */}
      <div className="w-full max-w-3xl bg-white p-4 rounded-lg shadow-md mb-4 flex justify-between border-2 border-[#1A4162]">
        <p className="text-[#1A4162] font-semibold">
          <strong>Nombre total dévénements :</strong> {totalEvents}
        </p>
        <p className="text-[#1A4162] font-semibold">
          <strong>Total billets :</strong> {totalBillets}
        </p>
      </div>

      {/* Liste des événements */}
      
      {isLoading ? (
        // Spinner pendant le chargement
          <div className="flex justify-center my-4">
            <div className="w-8 h-8 border-4 border-blue-500 border-dashed rounded-full animate-spin"></div>
          </div>
      ) : (
        // Table lorsque les données sont chargées
        <table className="w-full max-w-3xl bg-white shadow-md rounded-lg overflow-hidden border-2 border-[#1A4162]">
          <thead className="bg-[#1A4162] text-white">
            <tr>
              <th className="p-3">Nom de l'événement</th>
              <th className="p-3">Date</th>
              <th className="p-3">Lieu</th>
              <th className="p-3">Billets Disponibles</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {events.map((event, index) => (
              <tr key={event.id} className={index % 2 === 0 ? "bg-[#F5F5F5]" : "bg-white"}>
                <td className="p-3 text-center text-[#1A4162]">{event.titre}</td>
                <td className="p-3 text-center text-[#1A4162]">
                  {new Date(event.date_heure).toLocaleDateString("fr-FR", {
                    weekday: "long",
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                  })}
                </td>
                <td className="p-3 text-center text-[#1A4162]">{event.lieu}</td>
                <td className="p-3 text-center text-[#1A4162]">{event.billets_disponibles}</td>
                <td className="p-3 text-center">
                  <button
                    onClick={() => deleteEvent(event.id)}
                    className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-700 transition"
                  >
                    Supprimer
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

    </div>
  );
};

export default EventList;
