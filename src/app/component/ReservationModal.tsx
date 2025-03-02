import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Event, Ticket } from "@/lib/models";

interface ReservationModalProps {
    event: Event;
}

export default function ReservationModal({ event }: ReservationModalProps) {
    const [selectedTickets, setSelectedTickets] = useState<{ [key: number]: number }>({});
    const [step, setStep] = useState(1); // 1: Sélection des tickets, 2: Récapitulatif

    // Gestion de la sélection des tickets
    const handleQuantityChange = (ticketId: number, quantity: number) => {
        setSelectedTickets((prev) => ({
            ...prev,
            [ticketId]: Math.max(0, Math.min(quantity, event.tickets.find((t) => t.id === ticketId)?.quantity || 0)),
        }));
    };

    // Validation des quantités sélectionnées
    const validateSelection = () => {
        const hasTickets = Object.values(selectedTickets).some((qty) => qty > 0);
        if (!hasTickets) {
            alert("Veuillez sélectionner au moins un ticket.");
            return false;
        }
        return true;
    };

    // Passage à l'étape suivante
    const handleNext = () => {
        if (validateSelection()) {
            setStep(2); // Passer au récapitulatif
        }
    };

    const handlePayment = async (selectedTickets: { [key: number]: number }) => {
        try {
          // Convertir les tickets sélectionnés en un format adapté pour le backend
          const tickets = Object.entries(selectedTickets).map(([ticketId, quantity]) => ({
            ticket_id: Number(ticketId),
            quantity: quantity,
          }));
      
          // Envoyer les données au backend
          const response = await fetch("http://127.0.0.1:8000/users/create_checkout_session/", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              evenement_id: event.id,
              tickets: tickets, // Envoyer la liste des tickets sélectionnés
            }),
          });
      
          const data = await response.json();
          console.log(data);
      
          if (data.url) {
            window.location.href = data.url; // Redirection vers Stripe
          } else {
            alert("Erreur lors de la redirection vers Stripe.");
          }
        } catch (error) {
          console.error("Erreur :", error);
        }
      };

    // Calcul du montant total
    const totalAmount = Object.entries(selectedTickets).reduce((total, [ticketId, quantity]) => {
        const ticket = event.tickets.find((t) => t.id === Number(ticketId));
        return total + (ticket ? ticket.price * quantity : 0);
    }, 0);

    return (
        <Dialog>
            <DialogTrigger asChild>
                <button className="bg-green-600 flex flex-row justify-center items-center text-white px-4 py-2 shadow-md hover:bg-green-700 transition">
                    Reserver <i className="material-icons">chevron_right</i>
                </button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle>Réserver des tickets pour {event.name}</DialogTitle>
                </DialogHeader>

                {step === 1 && (
                    <div className="space-y-4">
                        {event.tickets.map((ticket) => (
                            <div key={ticket.id} className="flex items-center justify-between">
                                <div>
                                    <p className="font-medium">{ticket.name}</p>
                                    <p className="text-sm text-gray-500">
                                        {ticket.price}€ (Il reste {ticket.quantity} places)
                                    </p>
                                </div>
                                <Input
                                    type="number"
                                    min="0"
                                    max={ticket.quantity}
                                    value={selectedTickets[ticket.id] || 0}
                                    onChange={(e) => handleQuantityChange(ticket.id, parseInt(e.target.value))}
                                    className="w-20"
                                />
                            </div>
                        ))}
                        <Button onClick={handleNext} className="w-full">
                            Suivant
                        </Button>
                    </div>
                )}

                {step === 2 && (
                    <div className="space-y-4">
                        <div>
                            <h3 className="font-semibold">Récapitulatif de la commande</h3>
                            <p className="text-sm text-gray-500">
                                {event.name} - {event.start_datetime}
                            </p>
                        </div>
                        <div className="space-y-2">
                            {Object.entries(selectedTickets).map(([ticketId, quantity]) => {
                                const ticket = event.tickets.find((t) => t.id === Number(ticketId));
                                if (!ticket || quantity === 0) return null;
                                return (
                                    <div key={ticket.id} className="flex justify-between">
                                        <p>
                                            {ticket.name} x {quantity}
                                        </p>
                                        <p>{ticket.price * quantity}€</p>
                                    </div>
                                );
                            })}
                        </div>
                        <div className="flex justify-between font-semibold">
                            <p>Total</p>
                            <p>{totalAmount}Xaf</p>
                        </div>
                        <Button onClick={() => handlePayment(selectedTickets)} className="w-full">
                            Procéder au paiement
                        </Button>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
}