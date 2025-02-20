/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

interface Notification {
  id: number;
  message: string;
  date_envoi: string;
  evenement_id: number;
  evenement_titre: string;
  organisateur_nom: string;
  organisateur_prenom: string;
}

const NotificationModal = ({handleShowDetails, event_id}:{handleShowDetails:()=> void, event_id:any}) => {
  const router = useRouter();
  //const { id } = router.query;
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!event_id) return;

    const fetchNotifications = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/notifications/liste/", {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${localStorage.getItem("token")}`
            }
          });
        const data = await response.json();
        setNotifications(data[event_id] || []);
      } catch (error) {
        console.error("Erreur lors du chargement des notifications :", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, [event_id]);

  if (loading) return <p>Chargement des notifications...</p>;
  if (notifications.length === 0) return <p>Aucune notification pour cet événement.</p>;

  return (
    
    <div className="p-4 shadow-md bg-neutral-300 rounded-lg">
      <h1 className="text-2xl font-bold mb-4">Notifications pour {notifications[0]?.evenement_titre}</h1>
      <p className="text-gray-600">Organisé par {notifications[0]?.organisateur_nom} {notifications[0]?.organisateur_prenom}</p>

      <ul className="mt-4 space-y-3">
        {notifications.map((notif) => (
          <li key={notif.id} className="border p-3 rounded-lg shadow-md">
            <p className="font-semibold">{notif.message}</p>
            <span className="text-sm text-gray-500">{new Date(notif.date_envoi).toLocaleString()}</span>
          </li>
        ))}
      </ul>

      <button onClick={()=>handleShowDetails()} className="mt-4 bg-blue-600 text-white px-4 py-2 rounded">
        Retour
      </button>
    </div>
    
  );
};

export default NotificationModal;
