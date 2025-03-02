"use client"

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";

export default function PaymentSuccess() {
  const searchParams = useSearchParams();
  const session_id  = searchParams.get("session_id"); // Récupérer la session_id depuis l'URL
  const router = useRouter()
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [eventDetails, setEventDetails] = useState<{
    name: string;
    date: string;
    tickets: { name: string; quantity: number; price: number }[];
  } | null>(null);

  // Effectuer la requête POST pour traiter le paiement
  useEffect(() => {
    if (!session_id) return; // Attendre que session_id soit disponible

    const processPayment = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:8000/users/payment-success/${session_id}/`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`, // Utiliser le token d'authentification
          },
        });

        if (!response.ok) {
          throw new Error("Erreur lors du traitement du paiement.");
        }

        const data = await response.json();
        setEventDetails({
          name: data.event.name,
          date: data.event.date,
          tickets: data.tickets,
        });
      } catch (err:any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    processPayment();
  }, [session_id]);

  // Afficher un message de chargement
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Chargement en cours...</p>
      </div>
    );
  }

  // Afficher un message d'erreur
  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  // Afficher les détails de la commande
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow-lg">
        <div className="text-center">
          <CheckCircle className="mx-auto h-12 w-12 text-[#1a4162]" />
          <h1 className="mt-4 text-3xl font-bold text-gray-900">Paiement réussi !</h1>
          <p className="mt-2 text-gray-600">Merci pour votre achat. Voici les détails de votre commande :</p>
        </div>

        <div className="mt-8 border-t border-gray-200 pt-8">
          <h2 className="text-xl font-bold text-gray-900">{eventDetails?.name}</h2>
          <p className="mt-2 text-gray-600">Date : {eventDetails?.date}</p>

          <div className="mt-6">
            <h3 className="text-lg font-bold text-gray-900">Tickets achetés :</h3>
            <ul className="mt-4 space-y-4">
              {eventDetails?.tickets.map((ticket, index) => (
                <li key={index} className="flex justify-between bg-gray-50 p-4 rounded-lg">
                  <div>
                    <p className="font-medium">{ticket.name}</p>
                    <p className="text-sm text-gray-500">{ticket.quantity} x {ticket.price} XAF</p>
                  </div>
                  <p className="font-medium">{(ticket.quantity * ticket.price).toLocaleString()} XAF</p>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-8 flex justify-end">
            <Button
              onClick={() => router.push("/")}
              className="bg-green-600 hover:bg-green-700"
            >
              Retour à l'accueil
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}