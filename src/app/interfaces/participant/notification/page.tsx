/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"
import { useEffect, useState } from "react";
import Link from "next/link";
import NotificationModal from "@/app/component/NotificationModal";

interface Notification {
  id: number;
  message: string;
  date_envoi: string;
  evenement_id: number;
  evenement_titre: string;
  organisateur_nom: string;
  organisateur_prenom: string;
}

const NotificationsList = () => {
  const [notifications, setNotifications] = useState<{ [key: string]: Notification[] }>({});
  const [loading, setLoading] = useState(true);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null);
  const [eventId, setEventId] = useState<number>();
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const token = localStorage.getItem("token");  // Récupérer le JWT
  const wsUrl = `ws://localhost:8000/ws/notifications/?token=${token}`;

  // Ouvrir la modale avec les détails de l'événement
    const openModal = (eventId: number) => {
      setEventId(eventId);
      setModalIsOpen(true);
    };
    const handleShowDetails = ()=>{
      setModalIsOpen(!modalIsOpen)
    }

  // Fonction pour récupérer les notifications depuis l'API
  const fetchNotifications = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/notifications/liste/", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const data = await response.json();
      console.log("Les notifications : ", data)
      setNotifications(data);
    } catch (error) {
      console.error("Erreur lors du chargement des notifications :", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    /*const fetchNotifications = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/notifications/liste/", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("token")}`
          }
        });
        const data = await response.json();
        setNotifications(data);
      } catch (error) {
        console.error("Erreur lors du chargement des notifications :", error);
      } finally {
        setLoading(false);
      }
    };*/

    fetchNotifications();
    // Connexion WebSocket
    
    const socket = new WebSocket(wsUrl);
    setSocket(socket);
    socket.onopen = () => console.log("WebSocket connecté");

    socket.onmessage = (event) => {
      const newNotification: Notification = JSON.parse(event.data);
      console.log("Print notification : ", newNotification)

      // Mettre à jour la liste des notifications en temps réel
      setNotifications((prevNotifications) => {
        const eventId = newNotification.evenement_id.toString();
        const updatedNotifications = { ...prevNotifications };

        if (updatedNotifications[eventId]) {
          updatedNotifications[eventId] = [newNotification, ...updatedNotifications[eventId]];
        } else {
          updatedNotifications[eventId] = [newNotification];
        }

        return updatedNotifications;
      });
    };

    

    return () => socket.close();
  }, []);
  

  if (loading) return <p>Chargement des notifications...</p>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">📥 Mes Notifications</h1>
      {Object.keys(notifications).length === 0 ? (
        <p>Aucune notification reçue.</p>
      ) : (
        <ul className="space-y-3">
          {Object.entries(notifications).map(([evenementId, notifs]) => (
            <li key={evenementId} className="border bg-white p-3 rounded-lg shadow-md flex justify-between items-center">
              <span onClick={()=>openModal(Number(evenementId))} className="text-blue-600 hover:text-blue-400 font-semibold cursor-pointer">
                {notifs[0].evenement_titre}
              </span>
              <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm">
                {notifs.length}
              </span>
            </li>
          ))}
        </ul>
      )}
      {modalIsOpen && <NotificationModal handleShowDetails={handleShowDetails} event_id={eventId} socket={socket}/>}
    </div>
  );
};

export default NotificationsList;
