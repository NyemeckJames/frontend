/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react'

const EventModal = ({handleShowModal} : {handleShowModal: ()=> void}) => {
  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center transition-opacity duration-300 ease-in-out' 
    onClick={handleShowModal}>
        <div className="p-6 bg-white w-[auto]">
            <h2 className="text-2xl font-bold">Evenement A</h2>
            <p className="mt-2">Fete de la jeunesse au Cameroun</p>
            <p className="mt-4 text-gray-600">Date et heure de début: 11/02/2025</p>
            <p className="mt-4 text-gray-600">Capacité maximale: 1000</p>
            <p className="mt-4 text-gray-600">Participants inscrits: 700</p>
            <button
              
              className="mt-6 px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
            >
              Fermer
            </button>
          </div>

    </div>
  )
}

export default EventModal