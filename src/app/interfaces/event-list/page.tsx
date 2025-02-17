"use client";

import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store";
import { deleteEvent } from "@/store/eventSlice";
import withAuth from "@/app/component/WithAuth";

const ManageEvents = ()=> {
  const events = useSelector((state: RootState) => state.events.events);
  const dispatch = useDispatch();

  const totalEvents = events.length;
  const totalTickets = events.reduce((sum, event) => 
    sum + event.tickets.reduce((ticketSum, ticket) => ticketSum + ticket.quantity, 0), 
  0);

  return (
    <div className="flex flex-col items-center min-h-screen bg-[#F5F5F5] p-6">
      <h1 className="text-2xl font-bold text-[#8B5E3B] mb-6">Gestion des Événements</h1>

      {/* Statistiques */}
      <div className="w-full max-w-3xl bg-white p-4 rounded-lg shadow-md mb-4 flex justify-between">
        <p><strong>Nombre total dévénements :</strong> {totalEvents}</p>
        <p><strong>Total billets :</strong> {totalTickets}</p>
      </div>

      {/* Liste des événements */}
      <table className="w-full max-w-3xl bg-white shadow-md rounded-lg overflow-hidden">
        <thead className="bg-[#EAD7A2]">
          <tr>
            <th className="p-3">Nom</th>
            <th className="p-3">Date</th>
            <th className="p-3">Lieu</th>
            <th className="p-3">Billets</th>
            <th className="p-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {events.map((event) => (
            <tr key={event.id} className="border-b">
              <td className="p-3 text-center">{event.name}</td>
              <td className="p-3 text-center">{event.date}</td>
              <td className="p-3 text-center">{event.location}</td>
              <td className="p-3 text-center">
                {event.tickets.reduce((sum, ticket) => sum + ticket.quantity, 0)}
              </td>
              <td className="p-3 text-center">
                <button
                  onClick={() => dispatch(deleteEvent(event.id))}
                  className="bg-red-500 text-white p-2 rounded hover:bg-red-700"
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
}

export default withAuth(ManageEvents,['ORGANISATEUR','ADMINISTRATEUR'])
