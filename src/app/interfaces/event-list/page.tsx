"use client";

import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store";
import { deleteEvent } from "@/store/eventSlice";

export default function ManageEvents() {
  const events = useSelector((state: RootState) => state.events.events);
  const dispatch = useDispatch();

  const totalEvents = events?.length || 0;
  const totalTickets = events?.reduce(
    (sum, event) => sum + (event?.tickets?.reduce((ticketSum, ticket) => ticketSum + ticket.quantity, 0) || 0),
    0
  );

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
              <td className="p-3 text-center text-[#1A4162]">{event.name}</td>
              <td className="p-3 text-center text-[#1A4162]">{event.date}</td>
              <td className="p-3 text-center text-[#1A4162]">{event.location}</td>
              <td className="p-3 text-center text-[#1A4162]">
                {event.tickets.reduce((sum, ticket) => sum + ticket.quantity, 0)}
              </td>
              <td className="p-3 text-center">
                <button
                  onClick={() => dispatch(deleteEvent(event.id))}
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
}
