/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";


const ConfirmationGratuite = () => {
  const router = useRouter();
  const searchParams = useSearchParams()
  const event_id = searchParams.get("event_id")
  const [eventDetails, setEventDetails] = useState<any>();
 
  useEffect(() => {

    const fetchEvenements = async () => {
      const response = await fetch(`http://127.0.0.1:8000/users/register-event/${event_id}/`,{
        method : "POST",
        headers: {
            "content-type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("token")}`
        }
      }); // Modifie l'URL selon ton API
      const data = await response.json();
      console.log("Données reçues : ", data)
      setEventDetails(data);
    };

    fetchEvenements()
  }, [event_id]);

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold text-green-600">🎟️ Inscription Confirmée !</h1>
      {eventDetails ? (
        <div className="mt-4 p-4 border rounded bg-white shadow">
          <h2 className="text-xl font-semibold">{eventDetails.titre}</h2>
          <p>{eventDetails.description}</p>
          <p className="text-sm text-gray-500">Lieu: {eventDetails.lieu}</p>
          <p className="text-sm text-gray-500">Date: {eventDetails.date}</p>
          <button 
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-800"
            onClick={() => router.push("/mes-evenements")}
          >
            Voir mes événements
          </button>
        </div>
      ) : (
        <p>Chargement des détails...</p>
      )}
    </div>
  );
};

export default ConfirmationGratuite;
