"use client";

import { useState } from "react";

interface EventFormData {
  name: string;
  description: string;
  date: string;
  location: string;
  isPaidEvent: boolean;
  tickets: { type: string; price?: number; quantity: number }[];
  flyer?: File | null; 
}

export default function CreateEvent() {
  const [eventData, setEventData] = useState<EventFormData>({
    name: "",
    description: "",
    date: "",
    location: "",
    isPaidEvent: false,
    tickets: [{ type: "Gratuit", quantity: 1 }],
    flyer: null, // 
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEventData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setEventData((prev) => ({ ...prev, flyer: e.target.files[0] })); 
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // ✅ Simuler l'upload du flyer (Stockage à mettre en place)
    if (eventData.flyer) {
      console.log("Flyer à uploader :", eventData.flyer);
    }

    console.log("Événement créé :", eventData);
    alert("Événement ajouté avec succès !");
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-6">
      <div className="bg-white p-6 rounded-lg shadow-md w-96">
        <h1 className="text-2xl font-bold mb-4 text-center">Créer un Événement</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Nom de lévénement</label>
            <input type="text" name="name" value={eventData.name} onChange={handleChange} className="w-full p-2 border rounded" required />
          </div>

          <div>
            <label className="block text-sm font-medium">Description</label>
            <textarea name="description" value={eventData.description} onChange={handleChange} className="w-full p-2 border rounded"></textarea>
          </div>

          <div>
            <label className="block text-sm font-medium">Date</label>
            <input type="date" name="date" value={eventData.date} onChange={handleChange} className="w-full p-2 border rounded" required />
          </div>

          <div>
            <label className="block text-sm font-medium">Lieu</label>
            <input type="text" name="location" value={eventData.location} onChange={handleChange} className="w-full p-2 border rounded" required />
          </div>

          {/* Champ pour le flyer */}
          <div>
            <label className="block text-sm font-medium">Flyer de lévénement</label>
            <input type="file" accept="image/*" onChange={handleFileChange} className="w-full p-2 border rounded" />
          </div>

          <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600">
            Ajouter lévénement
          </button>
        </form>
      </div>
    </div>
  );
}
