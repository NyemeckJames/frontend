import { Button } from "@/components/ui/button";
import { DemandeOrganisateur } from "@/lib/models";

interface OrganizerRequestDetailsProps {
  demande: DemandeOrganisateur;
}

export default function OrganizerRequestDetails({ demande }: OrganizerRequestDetailsProps) {
  const handleDecision = async (decision: string) => {
    try {
      const response = await fetch(`/api/admin/organizer-requests/${demande.id}/decision`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ decision }),
      });

      if (response.ok) {
        alert(`Demande ${decision === "ACCEPTE" ? "acceptée" : "refusée"} avec succès.`);
      }
    } catch (error) {
      console.error("Erreur lors de la prise de décision :", error);
    }
  };

  return (
    <div className="p-4 space-y-4">
      
      <div>
        <h2 className="text-lg font-semibold">{demande.user_info.nom} {demande.user_info.prenom}</h2>
        <p className="text-sm text-gray-600">{demande.nom_entreprise}</p>
      </div>
      <div>
        <h3 className="font-semibold">Informations supplémentaires :</h3>
        <p>CNI : {demande.numero_cni}</p>
        <p>Types d'événements : {demande.types_evenements.join(", ")}</p>
        <p>Taille des événements : {demande.taille_evenements}</p>
        <p>Mode de financement : {demande.mode_financement}</p>
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
