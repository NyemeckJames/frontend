/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"
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
    date_heure: string;  // ISO 8601 string (ex: '2025-05-15T20:00:00')
    lieu: string;
    latitude: number;
    longitude: number;
    capacite_max: number;
    date_creation: string;  // ISO 8601 string
    organisateur: number;   // ID de l'organisateur (peut être un objet User selon la structure)
    billets_disponibles: number;
    photo: string | null;
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
  const handleShowModal = ()=>{
    setModalIsOpen(!modalIsOpen)
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-semibold mb-6">Événements disponibles</h1>

      {/* Affichage des cartes d'événements */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3  gap-6">
        {evenements.map((evenement) => (
          <div key={evenement.id} style={{ boxShadow: "5px 5px 5px rgba(0, 0, 0, 0.4)" }} className="card grid grid-cols-1  bg-white rounded-lg overflow-hidden">
            {/* <Image src={`http://127.0.0.1:8000${evenement.photo}`} alt={evenement.titre} width={200} height={100} className="rounded-t-lg" /> */}
            <div className="event-photo relative h-36  mx-3 my-2 p-6 bg-black rounded-lg text-white">
            <Image src={`http://127.0.0.1:8000${evenement.photo}`} alt={evenement.titre} objectFit="cover" layout="fill" className="rounded-lg" />
            </div>
            <span className="event-type  mx-3 my-1 bg-blue-500 font-semibold w-[25%] text-center text-white rounded-[3px]">Gratuit</span>
            <span className="published-date mx-3 my-1 text-[13px]" >Publié le : 17/02/2025</span>
            <span 
              className="event-name mx-3 font-semibold text-[23px] underline cursor-pointer transition-transform transform duration-300 hover:scale-105 hover:text-[#1a4162]"
              onClick={() => openModal(evenement)}
            >
              FETE DE LA JEUNESSE
            </span>
            <p className="event-description mx-3 text-[16px] text-[#a59a9a]">Cet évènement est une fête qui célèbre la jeunesse dans notre pays, jeunesse qui represente le fer de lance de la nation.</p>
            <div className="event-holder mx-3 my-3 flex flex-row items-center gap-3">
              <i className="material-icons" style={{'fontSize':'50px'}}>person</i>
              <span className="text-[20px] font-bold">James Romaric</span>
            </div>
            
          </div>
        ))}
      </div>
      {modalIsOpen && <EventModal handleShowModal={handleShowModal} evenement={selectedEvenement}/>}
      {/* Fenêtre modale avec les détails de l'événement */}
      
    </div>
  );
};

export default withAuth(EvenementsPage,['PARTICIPANT']);
