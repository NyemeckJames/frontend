"use client";

import { useParams } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/store";

export default function EventParticipants() {
  // Récupère l'ID directement depuis les paramètres de la route
  const params = useParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id; // ✅ Corrige le typage

  // Utiliser Redux pour récupérer l'événement correspondant
  const event = useSelector((state: RootState) =>
    state.events.events.find((e) => e.id === id)
  );

  if (!event) {
    return <p className="text-center text-red-500">Événement non trouvé.</p>;
  }

  // Fonction pour exporter les participants en CSV
  const exportCSV = () => {
    const csvContent = `Nom,Email\n${event.participants
      .map((p) => `${p.name},${p.email}`)
      .join("\n")}`;
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `participants_${event.name}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-[#F5F5F5] p-6">
      <h1 className="text-2xl font-bold text-[#8B5E3B] mb-6">
        Participants - {event.name}
      </h1>

      <div className="w-full max-w-3xl bg-white p-4 rounded-lg shadow-md mb-4">
        <p><strong>Nombre total de participants :</strong> {event.participants.length}</p>
      </div>

      <table className="w-full max-w-3xl bg-white shadow-md rounded-lg overflow-hidden">
        <thead className="bg-[#EAD7A2]">
          <tr>
            <th className="p-3">Nom</th>
            <th className="p-3">Email</th>
          </tr>
        </thead>
        <tbody>
          {event.participants.map((participant) => (
            <tr key={participant.id} className="border-b">
              <td className="p-3 text-center">{participant.name}</td>
              <td className="p-3 text-center">{participant.email}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <button
        onClick={exportCSV}
        className="mt-4 bg-[#1C1C1C] text-[#EAD7A2] py-2 px-4 rounded-lg hover:bg-[#8B5E3B] hover:text-white"
      >
        Exporter en CSV
      </button>
    </div>
  );
}