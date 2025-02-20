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
  date_heure: string; // ISO 8601 string
  lieu: string;
  latitude: number;
  longitude: number;
  capacite_max: number;
  prix: number;
  date_creation: string;
  organisateur: number;
  billets_disponibles: number;
  photo: string | null;
  evenementLibre: boolean; // true = Gratuit, false = Payant
  organisateur_nom: string;
}

const EvenementsPage = () => {
  const [evenements, setEvenements] = useState<Evenement[]>([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedEvenement, setSelectedEvenement] = useState<Evenement | null>(null);
  const [userParticipations, setUserParticipations] = useState<any>();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [locationFilter, setLocationFilter] = useState("");
  const [startDate, setStartDate] = useState(""); // Date de début du filtre
  const [isLoading, setIsLoading] = useState(false);

 

  // Récupérer les événements depuis l'API après avoir obtenu l'utilisateur
  useEffect(() => {
    setIsLoading(true); // Démarre le chargement
      const fetchEvenements = async () => {
        try {
          const response = await fetch("http://localhost:8000/evenements/get_all/"); // Modifie l'URL selon ton API
          const data = await response.json();
          console.log("Réponse des événements:", data);
          setEvenements(data);
        } catch (error) {
          console.error("Erreur lors du fetch des événements:", error);
        }
        finally {
          setIsLoading(false); // Arrête le chargement
        }
      };

      const fetchUserParticipations = async () => {
        try {
          const response = await fetch("http://127.0.0.1:8000/evenements/my-events/", {
                method: "GET",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
              });
          const data = await response.json();
          console.log("Evenements inscrits : ", data)
          setUserParticipations(data);
          
          
        } catch (error) {
          console.error("Erreur lors du fetch des participations:", error);
        }
        
      };
      
      fetchEvenements();
      fetchUserParticipations();
    
  }, []);

  // Ouvrir la modale avec les détails de l'événement
  const openModal = (evenement: Evenement) => {
    setSelectedEvenement(evenement);
    setModalIsOpen(true);
  };

  const handleShowModal = ()=>{
    setModalIsOpen(!modalIsOpen)
  }
  const now = new Date();
  const evenementsValides = evenements.filter((evenement) => {
    const eventDate = new Date(evenement.date_heure);
    return eventDate >= now;
  });
  // Filtrage des événements selon la recherche, le type (Gratuit/Payant), le lieu et les dates
  const filteredEvenements = evenementsValides.filter((evenement) => {
    const matchesSearch = evenement.titre.toLowerCase().includes(search.toLowerCase());
    const matchesLocation = evenement.lieu.toLowerCase().includes(locationFilter.toLowerCase());

    let matchesFilter = false;
    if (filter === "all") {
      matchesFilter = true;
    } else if (filter === "gratuit") {
      matchesFilter = evenement.evenementLibre;
    } else if (filter === "payant") {
      matchesFilter = !evenement.evenementLibre;
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
      {isLoading?(<div className="flex justify-center my-4">
          <div className="w-8 h-8 border-4 border-blue-500 border-dashed rounded-full animate-spin"></div>
        </div>):(<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEvenements.length > 0 ? (
          filteredEvenements.map((evenement) => {
            
            const isFull = evenement.billets_disponibles === 0;
            let isParticipant = false;
            let label = evenement.evenementLibre ? "Gratuit" : "Payant";
            let labelColor = evenement.evenementLibre ? "bg-blue-500" : "bg-yellow-500";
            userParticipations?.forEach((event:Evenement) => {
              if (evenement.id === event.id) {
                isParticipant = true
                return
              }
            });
            if (isParticipant) {
              label = "Déjà participant";
              labelColor = "bg-green-500";
            } else if (isFull) {
              label = "Complet";
              labelColor = "bg-red-500";
            }
            return(
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
                className={`event-type mx-3 my-1 font-semibold max-w-[40%] text-center text-white rounded-[3px] ${labelColor
                }`}
              >
                {label}
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
                <span className="text-[20px] font-bold">{evenement.organisateur_nom}</span>
              </div>
            </div>)
          })
        ) : (
          <p className="text-gray-500">Aucun événement trouvé.</p>
        )}
      </div>)}
      
      {modalIsOpen && <EventModal handleShowModal={handleShowModal} evenement={selectedEvenement} userParticipations={userParticipations}/>}
      {/* Fenêtre modale avec les détails de l'événement */}
      
    </div>
  );
};

export default withAuth(EvenementsPage, ["PARTICIPANT"]);
