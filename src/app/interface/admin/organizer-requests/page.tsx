"use client"

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger, DialogTitle } from "@/components/ui/dialog";
import { DemandeOrganisateur } from "@/lib/models";
import OrganizerRequestDetails from "@/app/component/OrganizerRequestDetail";

export default function OrganizerRequests() {
  const [demandes, setDemandes] = useState<DemandeOrganisateur[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDemande, setSelectedDemande] = useState<DemandeOrganisateur | null>(null);

  useEffect(() => {
    const fetchDemandes = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/message/admin/demandes-en-attente/",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        const data = await response.json();
        console.log("data : ", data)
        setDemandes(data);
      } catch (error) {
        console.error("Erreur lors de la récupération des demandes :", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDemandes();
  }, []);

  if (loading) {
    return <p>Chargement en cours...</p>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Demandes en attente</h1>
      <div className="space-y-4">
        {demandes.map((demande) => (
          <Dialog key={demande.id}>
            <DialogTrigger asChild>
              <div
                className="p-4 border rounded-lg cursor-pointer hover:bg-gray-100 transition"
                onClick={() => setSelectedDemande(demande)}
              >
                <h2 className="text-lg font-semibold">{demande.user_info.nom} {demande.user_info.prenom}</h2>
                <p className="text-sm text-gray-600">{demande.nom_entreprise}</p>
                <Button className="mt-2">Voir les détails</Button>
              </div>
            </DialogTrigger>
            <DialogContent>
              <DialogTitle>Détails de la demande</DialogTitle>
              {selectedDemande && <OrganizerRequestDetails demande={selectedDemande} />}
            </DialogContent>
          </Dialog>
        ))}
      </div>
    </div>
  );
}
