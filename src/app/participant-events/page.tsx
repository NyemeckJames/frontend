"use client"
import { useEffect, useState } from "react";
import Modal from "react-modal";

// Définir l'interface pour l'événement
export interface Evenement {
    id: number;
    titre: string;
    description: string;
    date_heure: string;  // ISO 8601 string (ex: '2025-05-15T20:00:00')
    lieu: string;
    latitude: number;
    longitude: number;
    capacite_max: number;
    date_creation: string;  // ISO 8601 string
    organisateur: number;   // ID de l'organisateur (peut être un objet User selon la structure)
    billets_disponibles: number;
    image_url: string;
}


const EvenementsPage = () => {
  const [evenements, setEvenements] = useState<Evenement[]>([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedEvenement, setSelectedEvenement] = useState<Evenement | null>(null);

  // Récupérer les événements depuis l'API
  useEffect(() => {
    const fetchEvenements = async () => {
      const response = await fetch("http://localhost:8000/evenements/get_all/"); // Modifie l'URL selon ton API
      const data = await response.json();
      setEvenements(data);
    };

    fetchEvenements();
  }, []);

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

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-semibold mb-6">Événements disponibles</h1>

      {/* Affichage des cartes d'événements */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {evenements.map((evenement) => (
          <div key={evenement.id} className="bg-white shadow-md rounded-lg overflow-hidden">
            <img
              className="w-full h-48 object-cover"
              src={evenement.image_url}
              alt={evenement.titre}
            />
            <div className="p-4">
              <h2 className="text-xl font-bold">{evenement.titre}</h2>
              <p className="text-gray-500">{evenement.date_heure}</p>
              <p className="mt-2 text-gray-600">
                Participants: {evenement.billets_disponibles}
              </p>
              <button
                onClick={() => openModal(evenement)}
                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
              >
                Détails
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Fenêtre modale avec les détails de l'événement */}
      <Modal isOpen={modalIsOpen} onRequestClose={closeModal} className="modal" overlayClassName="overlay">
        {selectedEvenement && (
          <div className="p-6">
            <h2 className="text-2xl font-bold">{selectedEvenement.titre}</h2>
            <p className="mt-2">{selectedEvenement.description}</p>
            <p className="mt-4 text-gray-600">Date et heure de début: {selectedEvenement.date_heure}</p>
            <p className="mt-4 text-gray-600">Capacité maximale: {selectedEvenement.capacite_max}</p>
            <p className="mt-4 text-gray-600">Participants inscrits: {selectedEvenement.billets_disponibles}</p>
            <button
              onClick={closeModal}
              className="mt-6 px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
            >
              Fermer
            </button>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default EvenementsPage;
