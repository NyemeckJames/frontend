/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"
import { useEffect, useState } from 'react';

interface Billet {
  quantity: number;
}
const userstr = localStorage.getItem("user")
let user: any;
if (userstr){
   user = JSON.parse(userstr) 
}
interface Event {
  id: string;
  name: string;
  date: string;
  location: string;
  billets: Billet[];
}

const EventList = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [totalEvents, setTotalEvents] = useState<number>(0);
  const [totalBillets, setTotalBillets] = useState<number>(0);

  // Fonction pour récupérer les événements depuis l'API
  const fetchEvents = async () => {
    try {
      const response = await fetch(`http://localhost:8000/evenements/mes-evenements/${user.id}`); // Remplace avec l'URL de ton API
      const data = await response.json();
      console.log(data)
      // Calcul du nombre total d'événements et de billets
      // setTotalEvents(data.length);
      // const total = data.reduce((sum: number, event: Event) => 
      //   sum + event.tickets.reduce((t: number, ticket: Ticket) => t + ticket.quantity, 0), 0);
      // setTotalTickets(total);
      
      setEvents(data);
    } catch (error) {
      console.error('Erreur lors de la récupération des événements', error);
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
          <strong>Total billets :</strong> {totalTickets}
        </p>
      </div>

      {/* Liste des événements */}
      <table className="w-full max-w-3xl bg-white shadow-md rounded-lg overflow-hidden border-2 border-[#1A4162]">
        <thead className="bg-[#1A4162] text-white">
          <tr>
            <th className="p-3">Nom</th>
            <th className="p-3">Date</th>
            <th className="p-3">Lieu</th>
            <th className="p-3">Billets</th>
            <th className="p-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {events.map((event, index) => (
            <tr key={event.id} className={index % 2 === 0 ? "bg-[#F5F5F5]" : "bg-white"}>
              <td className="p-3 text-center text-[#1A4162]">{event.titre}</td>
              <td className="p-3 text-center text-[#1A4162]">{event.date}</td>
              <td className="p-3 text-center text-[#1A4162]">{event.location}</td>
              <td className="p-3 text-center text-[#1A4162]">
                {/* {event.tickets.reduce((sum, ticket) => sum + ticket.quantity, 0)} */}
              </td>
              <td className="p-3 text-center">
                <button
                  // action pour supprimer un événement
                  className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-700 transition"
                >
                  Supprimer
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default EventList;
