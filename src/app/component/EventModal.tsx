/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react'
import Image from 'next/image'
import { loadStripe } from "@stripe/stripe-js";
import { useRouter } from 'next/navigation';


const EventModal = ({handleShowModal, evenement} : {handleShowModal: ()=> void, evenement:any}) => {
  const router = useRouter()
  console.log(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY)
  const dateHeure = new Date(evenement.date_heure);
  const dateStr = dateHeure.toLocaleDateString(); // Format: JJ/MM/AAAA
  const heureStr = dateHeure.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const handlePayment = async () => {
    if (!evenement.evenementLibre) {
      router.push(`/interfaces/participant/free-inscription-sucess?event_id=${evenement.id}`);
      return
    }
    else{
      try {
        const response = await fetch("http://127.0.0.1:8000/users/create_checkout_session/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            evenement_id: evenement.id,
            prix: 25000, // En centimes
          }),
        });
    
        const data = await response.json();
        console.log(data)
        if (data.url) {
          window.location.href = data.url;// Redirection vers Stripe
        } else {
          alert("Erreur lors de la redirection vers Stripe.");
        }
      } catch (error) {
        console.error("Erreur :", error);
      }
    }
  
    
  };
  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center transition-opacity duration-300 ease-in-out' 
    >
        <div className=" relative p-6 bg-white w-[60%] grid grid-cols-2 grid-rows-1">
            <button 
              className="absolute top-2 right-2 text-red-500 hover:text-red-900 text-2xl font-bold transition-transform transform hover:scale-110" 
              onClick={handleShowModal}
            >
              &times;
            </button>
            <div className="event-photo relative  mx-3 my-2 bg-black rounded-lg text-white">
              <img src={`http://127.0.0.1:8000${evenement.photo}`} alt={evenement.titre}  className="max-w-full h-auto rounded-lg" />
            </div>
            <div className="event-informations flex items-start flex-col">
              <h2 className="text-2xl font-bold">{evenement.titre}</h2>
              {evenement.evenementLibre?(<span className="px-1 my-1 bg-blue-500 font-semibold text-center text-white rounded-[3px]">Accès Gratuit</span>):(<span className="mt-4">Accès Payant</span>)}
              <p className="mt-2 text-gray-600">{evenement.description}</p>
              <div className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 mt-4">
                <span className="font-semibold text-right">Date :</span> <span>{dateStr}</span>
                <span className="font-semibold text-right">Heure :</span> <span>{heureStr}</span>
                <span className="font-semibold text-right">Lieu :</span> <span>{evenement.lieu}</span>
                <span className="font-semibold text-right">Nombre de places totales :</span> <span>{evenement.capacite_max}</span>
                <span className="font-semibold text-right">Nombre de places disponibles :</span> <span>{evenement.capacite_max}</span>
                <span className="font-semibold text-right">Location :</span> <span><i className="material-icons" >location_on</i></span>
                {evenement.evenementLibre?(<><span className="font-semibold text-right">Prix de l'entrée :</span> <span>0 Xaf</span></>):(<><span className="font-semibold text-right">Prix de l'entrée :</span> <span>25 000 Xaf</span></>)}
              </div>
              
              <div className="mt-4 organisateur">
                <span>Organisateur de l'évènement</span>
                <div className="event-holder mx-3 my-3 flex flex-row items-center gap-3">
                  <i className="material-icons" style={{'fontSize':'50px'}}>person</i>
                  <span className="text-[20px] font-bold">James Romaric</span>
                </div>
              </div>
              <button className='px-2 py-1 w-[auto] self-end bg-blue-700 text-white font-semibold border-none rounded-[3px] transition-transform transform hover:scale-110 hover:bg-blue-900 duration-300' onClick={handlePayment}>Participer</button>
            </div>
            
            
        </div>

    </div>
  )
}

export default EventModal