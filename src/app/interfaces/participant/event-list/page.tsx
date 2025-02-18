/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import { useEffect, useState } from "react";
import Modal from "react-modal";
import Image from "next/image";
import withAuth from "@/app/component/WithAuth";
import EventModal from "@/app/component/EventModal";

// Définir l'interface pour l'événement
export interface Evenement {
  id: number;
  titre: string;
  description: string;
  date_heure: string; // ISO 8601 string (ex: '2025-05-15T20:00:00')
  lieu: string;
  latitude: number;
  longitude: number;
  capacite_max: number;
  date_creation: string; // ISO 8601 string
  organisateur: number; // ID de l'organisateur
  billets_disponibles: number;
  photo: string | null;
}

const EvenementsPage = () => {
  const [evenements, setEvenements] = useState<Evenement[]>([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedEvenement, setSelectedEvenement] = useState<Evenement | null>(null);
  const [search, setSearch] = useState("");
  const [user, setUser] = useState<any>(null); // Ajout pour gérer l'utilisateur connecté

  // Effectuer le fetch des événements
  useEffect(() => {
    // Simuler l'obtention de l'utilisateur (à remplacer par un système d'authentification réel)
    const fetchUser = () => {
      setUser({ id: 1 }); // Remplace ceci par la récupération réelle de l'utilisateur
    };
    fetchUser();
  }, []);

  // Récupérer les événements depuis l'API après avoir obtenu l'utilisateur
  useEffect(() => {
    if (user && user.id) {
      const fetchEvenements = async () => {
        try {
          // URL de l'API avec l'ID de l'utilisateur
          const response = await fetch(`http://localhost:8000/evenements/mes-evenements/${user.id}`);
          
          // Vérifier si la réponse est ok (status 2xx)
          if (!response.ok) {
            throw new Error(`Erreur: ${response.status} - ${response.statusText}`);
          }

          // Parsing de la réponse JSON
          const data = await response.json();
          console.log("Réponse des événements:", data); // Debug: affiche la réponse dans la console
          setEvenements(data); // Mettre à jour l'état avec les événements récupérés
        } catch (error) {
          // Gérer les erreurs de réseau ou de réponse
          console.error("Erreur lors du fetch des événements:", error);
        }
      };

      fetchEvenements();
    }
  }, [user]);

  // Ouvrir la modale avec les détails de l'événement
  const openModal = (evenement: Evenement) => {
    setSelectedEvenement(evenement);
    setModalIsOpen(true);
  };

  // Fermer la modale
  const closeModal = () => {
    setModalIsOpen(false);
    setSelectedEvenement(null);
  };

  // Filtrage des événements selon la recherche
  const filteredEvenements = evenements.filter((evenement) =>
    evenement.titre.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-semibold mb-6">Événements disponibles</h1>

      {/* Barre de recherche */}
      <div className="mb-4 w-full max-w-md">
        <input
          type="text"
          placeholder="Rechercher un événement..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md"
        />
      </div>

      {/* Affichage des événements */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEvenements.length > 0 ? (
          filteredEvenements.map((evenement) => (
            <div
              key={evenement.id}
              style={{ boxShadow: "5px 5px 5px rgba(0, 0, 0, 0.4)" }}
              className="card grid grid-cols-1 bg-white rounded-lg overflow-hidden"
            >
              <div className="event-photo relative h-36 mx-3 my-2 p-6 bg-black rounded-lg text-white">
                <Image
                  src={`http://127.0.0.1:8000${evenement.photo}`}
                  alt={evenement.titre}
                  objectFit="cover"
                  layout="fill"
                  className="rounded-lg"
                />
              </div>
              <span className="event-type mx-3 my-1 bg-blue-500 font-semibold w-[25%] text-center text-white rounded-[3px]">
                Gratuit
              </span>
              <span className="published-date mx-3 my-1 text-[13px]">Publié le : 17/02/2025</span>
              <span
                className="event-name mx-3 font-semibold text-[23px] underline cursor-pointer transition-transform transform duration-300 hover:scale-105 hover:text-[#1a4162]"
                onClick={() => openModal(evenement)}
              >
                {evenement.titre}
              </span>
              <p className="event-description mx-3 text-[16px] text-[#a59a9a]">{evenement.description}</p>
              <div className="event-holder mx-3 my-3 flex flex-row items-center gap-3">
                <i className="material-icons" style={{ fontSize: "50px" }}>
                  person
                </i>
                <span className="text-[20px] font-bold">Ashdown x</span>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500">Aucun événement trouvé.</p>
        )}
      </div>

      {/* Modal pour afficher les détails de l'événement */}
      {modalIsOpen && <EventModal handleShowModal={closeModal} />}
    </div>
  );
};

export default withAuth(EvenementsPage, ["PARTICIPANT"]);
