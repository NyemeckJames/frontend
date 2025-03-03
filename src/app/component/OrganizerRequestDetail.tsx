import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea"; // Import du textarea de ShadCN
import { DemandeOrganisateur } from "@/lib/models";

interface OrganizerRequestDetailsProps {
  demande: DemandeOrganisateur;
}

export default function OrganizerRequestDetails({ demande }: OrganizerRequestDetailsProps) {
  const [commentaire, setCommentaire] = useState("");

  const handleDecision = async (statut: string) => {
    const token = localStorage.getItem("token"); // Récupération du token depuis le localStorage

    if (!token) {
      alert("Token d'authentification introuvable. Veuillez vous reconnecter.");
      return;
    }

    try {
      const response = await fetch(`http://localhost:8000/message/admin/gerer-demande/${demande.user_info.id}/`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Ajout du token dans les headers
        },
        body: JSON.stringify({ statut, commentaire_admin: commentaire }),
      });
      console.log("response : ",response)
      if (response.ok) {
        alert(`Demande ${statut === "ACCEPTE" ? "acceptée" : "refusée"} avec succès.`);
      } else {
        alert("Erreur lors du traitement de la demande.");
      }
    } catch (error) {
      console.error("Erreur lors de la prise de décision :", error);
    }
  };

  return (
    <div className="p-4 space-y-4">
      <div>
        <h2 className="text-lg font-semibold">
          {demande.user_info.nom} {demande.user_info.prenom}
        </h2>
        <p className="text-sm text-gray-600">{demande.nom_entreprise}</p>
      </div>
      <div>
        <h3 className="font-semibold">Informations supplémentaires :</h3>
        <p>CNI : {demande.numero_cni}</p>
        <p>Types d'événements : {demande.types_evenements.join(", ")}</p>
        <p>Taille des événements : {demande.taille_evenements}</p>
        <p>Mode de financement : {demande.mode_financement}</p>
      </div>

      <div>
        <h3 className="font-semibold">Commentaire de l'administrateur :</h3>
        <Textarea
          placeholder="Ajoutez un commentaire (optionnel)..."
          value={commentaire}
          onChange={(e) => setCommentaire(e.target.value)}
        />
      </div>

      <div className="flex space-x-4">
        <Button onClick={() => handleDecision("ACCEPTE")}>Accepter</Button>
        <Button variant="destructive" onClick={() => handleDecision("REFUSE")}>
          Refuser
        </Button>
      </div>
    </div>
  );
}
