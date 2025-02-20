"use client";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
const EnvoyerNotificationPage = () => {
  const [evenements, setEvenements] = useState<{ id: number; titre: string }[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<number | null>(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const {toast} = useToast();
  useEffect(() => {
    // Récupérer la liste des événements de l'organisateur
    const fetchEvenements = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/evenements/mes-evenements/", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("token")}`
          }
        });

        if (!response.ok) {
          throw new Error("Erreur lors de la récupération des événements");
        }

        const data = await response.json();
        setEvenements(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchEvenements();
  }, []);

  const envoyerNotification = async () => {
    if (!selectedEvent || !message.trim()) {
      toast({
        description : "Veuillez sélectionner un événement et écrire un message.",
        variant : "warning",
        duration: 2000,
      })
      return;
    }

    setLoading(true);
    setFeedback(null);

    try {
      const response = await fetch(`http://127.0.0.1:8000/notifications/${selectedEvent}/envoyer/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify({ message }),
      });

      const result = await response.json();

      if (!response.ok) {
        toast({
          description : "Erreur lors de l'envoi de la notification.",
          variant : "destructive",
          duration: 2000,
        })
        console.error(result.err)
      }
      toast({
        description : result.message,
        variant : "success",
        duration: 2000,
      })
      
      setMessage("");
    } catch (error) {
      setFeedback((error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold">📢 Envoyer une Notification</h1>

      <div className="mt-4">
        <label className="block text-sm font-medium text-gray-700">Sélectionner un événement</label>
        <select
          value={selectedEvent || ""}
          onChange={(e) => setSelectedEvent(Number(e.target.value))}
          className="mt-2 block w-full p-2 border rounded"
        >
          <option value="" disabled>Choisissez un événement</option>
          {evenements.map((event) => (
            <option key={event.id} value={event.id}>{event.titre}</option>
          ))}
        </select>
      </div>

      <div className="mt-4">
        <label className="block text-sm font-medium text-gray-700">Message</label>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="mt-2 block w-full p-2 border rounded"
          rows={4}
          placeholder="Écrivez votre message..."
        />
      </div>

      <button
        onClick={envoyerNotification}
        disabled={loading}
        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-800 disabled:bg-gray-400"
      >
        {loading ? "Envoi en cours..." : "Envoyer"}
      </button>

      {feedback && <p className="mt-4 text-red-500">{feedback}</p>}
    </div>
  );
};

export default EnvoyerNotificationPage;
