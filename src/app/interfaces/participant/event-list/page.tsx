/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
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
  date_heure: string; // ISO 8601 string
  lieu: string;
  latitude: number;
  longitude: number;
  capacite_max: number;
  date_creation: string;
  organisateur: number;
  billets_disponibles: number;
  photo: string | null;
  is_free: boolean; // true = Gratuit, false = Payant
}

const EvenementsPage = () => {
  const [evenements, setEvenements] = useState<Evenement[]>([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedEvenement, setSelectedEvenement] = useState<Evenement | null>(null);
  const [search, setSearch] = useState("");
  const [user, setUser] = useState<any>(null); // Pour gérer l'utilisateur connecté
  const [filter, setFilter] = useState("payant");
  const [locationFilter, setLocationFilter] = useState("");
  const [startDate, setStartDate] = useState(""); // Date de début du filtre
  

 

  // Récupérer les événements depuis l'API après avoir obtenu l'utilisateur
  useEffect(() => {
    if (user && user.id) {
      const fetchEvenements = async () => {
        try {
          const response = await fetch("http://localhost:8000/evenements/get_all/"); // Modifie l'URL selon ton API
          const data = await response.json();
          console.log("Réponse des événements:", data);
          setEvenements(data);
        } catch (error) {
          console.error("Erreur lors du fetch des événements:", error);
        }
      };
      fetchEvenements();
    }
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

  // Filtrage des événements selon la recherche, le type (Gratuit/Payant), le lieu et les dates
  const filteredEvenements = evenements.filter((evenement) => {
    const matchesSearch = evenement.titre.toLowerCase().includes(search.toLowerCase());
    const matchesLocation = evenement.lieu.toLowerCase().includes(locationFilter.toLowerCase());
    const estGratuit =
      typeof evenement.is_free === "string"
        ? evenement.is_free === "true"
        : evenement.is_free;

    let matchesFilter = false;
    if (filter === "all") {
      matchesFilter = true;
    } else if (filter === "gratuit") {
      matchesFilter = evenement.is_free;
    } else if (filter === "payant") {
      matchesFilter = !evenement.is_free;
    }

    // Filtre par date
    const eventDate = new Date(evenement.date_heure); // Récupérer la date de l'événement
    const start = startDate ? new Date(startDate) : null;
 

    // Filtrage des événements selon la date
    const matchesDate =
      (!start || eventDate >= start) ;

    return matchesSearch && matchesFilter && matchesLocation && matchesDate;
  });

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

      {/* Filtre par type */}
      <div className="mb-4">
        <label htmlFor="filter" className="mr-2">Filtrer par type:</label>
        <select
          id="filter"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="p-2 border border-gray-300 rounded-md"
        >
          <option value="all">Tous</option>
          <option value="gratuit">Gratuit</option>
          <option value="payant">Payant</option>
        </select>
      </div>

      {/* Filtre par lieu */}
      <div className="mb-4 w-full max-w-md">
        <input
          type="text"
          placeholder="Filtrer par lieu..."
          value={locationFilter}
          onChange={(e) => setLocationFilter(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md"
        />
      </div>

      {/* Filtre par date */}
      <div className="flex gap-4 mb-4">
        <div>
          <label htmlFor="startDate" className="mr-2">Date de début:</label>
          <input
            type="date"
            id="startDate"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="p-2 border border-gray-300 rounded-md"
          />
        </div>
        
      </div>

      {/* Affichage des événements filtrés */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEvenements.length > 0 ? (
          filteredEvenements.map((evenement) => (
            <div
              key={evenement.id}
              className="card grid grid-cols-1 bg-white rounded-lg overflow-hidden shadow-lg"
              style={{ boxShadow: "5px 5px 5px rgba(0, 0, 0, 0.4)" }}
            >
              <div className="event-photo relative h-36 mx-3 my-2 p-6 bg-black rounded-lg text-white">
                {evenement.photo && (
                  <Image
                    src={`http://127.0.0.1:8000${evenement.photo}`}
                    alt={evenement.titre}
                    objectFit="cover"
                    layout="fill"
                    className="rounded-lg"
                  />
                )}
              </div>
              <span
                className={`event-type mx-3 my-1 font-semibold w-[25%] text-center text-white rounded-[3px] ${
                  evenement.is_free ? "bg-blue-500" : "bg-yellow-500"
                }`}
              >
                {evenement.is_free ? "Gratuit" : "Payant"}
              </span>
              <span className="published-date mx-3 my-1 text-[13px]">
                Publié le : {new Date(evenement.date_creation).toLocaleDateString()}
              </span>
              <span
                className="event-name mx-3 font-semibold text-[23px] underline cursor-pointer transition-transform transform duration-300 hover:scale-105 hover:text-[#1a4162]"
                onClick={() => openModal(evenement)}
              >
                {evenement.titre}
              </span>
              <p className="event-description mx-3 text-[16px] text-[#a59a9a]">
                {evenement.description}
              </p>
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
      {modalIsOpen && <EventModal handleShowModal={handleShowModal} evenement={selectedEvenement}/>}
      {/* Fenêtre modale avec les détails de l'événement */}
      
    </div>
  );
};

export default withAuth(EvenementsPage, ["PARTICIPANT"]);
