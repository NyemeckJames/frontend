"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { token } from "@/services/ApiService";
import Image from "next/image";

interface Evenement {
  id: number;
  titre: string;
  description: string;
  date: string;
  lieu: string;
  photo?: string;
  type_billet: string;
}

const MesEvenements = () => {
  const [evenements, setEvenements] = useState<Evenement[]>([]);
  const router = useRouter();

  useEffect(() => {
    fetch("http://127.0.0.1:8000/evenements/my-events/", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setEvenements(data));
  }, []);

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold">📅 Mes Événements</h1>
      {evenements.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          {evenements.map((event) => (
            <div key={event.id} className="p-4 w-[80%] border rounded shadow bg-white">
              {event.photo && <div className="event-photo relative h-36  mx-3 my-2 p-6 bg-black rounded-lg text-white">
                          <Image src={`http://127.0.0.1:8000${event.photo}`} alt={event.titre} objectFit="cover" layout="fill" className="rounded-lg" />
                          </div>}
              <h2 className="text-xl font-semibold mt-2">{event.titre}</h2>
              <p className="text-gray-600">{event.description}</p>
              <p className="text-sm text-gray-500">📍 {event.lieu} - 🗓 {event.date}</p>
              <p className="mt-2 text-sm">
                🎟 <span className={event.type_billet === "PAYANT" ? "text-red-500" : "text-green-500"}>{event.type_billet}</span>
              </p>
              <button
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-800"
                onClick={() => router.push(`/evenements/${event.id}`)}
              >
                Voir Détails
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500 mt-4">Aucun événement enregistré.</p>
      )}
    </div>
  );
};

export default MesEvenements;
