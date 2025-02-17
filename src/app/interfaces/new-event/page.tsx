/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import withAuth from "@/app/component/WithAuth";
import axios from "axios";
import { useState } from "react";

interface EventFormData {
  titre: string;
  description: string;
  date_heure: string;
  lieu: string;
  latitude: number;
  longitude: number;
  capacite_max: number;
  evenementLibre : boolean;
  billets_disponibles: number;
  photo?: File | null;
}

const CreateEvent =()=> {
  const [formData, setFormData] = useState<EventFormData>({
    titre: "",
    description: "",
    date_heure: "",
    lieu: "",
    latitude: 0,
    longitude: 0,
    capacite_max: 0,
    evenementLibre: false,
    billets_disponibles: 0,
    photo: null,
  });
  const [message, setMessage] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFormData((prev) => ({ ...prev, photo: e.target.files![0] })); 
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const eventData = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (value !== null) {
        eventData.append(key, value as string | Blob);
      }
    });

    try {
      // Récupération du token depuis le localStorage
      const token = localStorage.getItem("token");
    
      const response = await axios.post("http://localhost:8000/evenements/create/", eventData, {
        headers: { 
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`, // Ajout du token dans l'en-tête
        },
      });
    
      setMessage("Événement créé avec succès !");
      console.log(response.data);
    } catch (error) {
      console.error("Erreur lors de la création de l'événement", error);
      setMessage("Erreur lors de la création de l'événement");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-6">
      <div className="bg-white p-6 rounded-lg shadow-md w-96">
        <h1 className="text-2xl font-bold mb-4 text-center">Créer un Événement</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Nom de lévénement</label>
            <input type="text" name="titre" value={formData.titre} onChange={handleChange} className="w-full p-2 border rounded" required />
          </div>

          <div>
            <label className="block text-sm font-medium">Description</label>
            <textarea name="description" value={formData.description} onChange={handleChange} className="w-full p-2 border rounded"></textarea>
          </div>

          <div>
            <label className="block text-sm font-medium">Date</label>
            <input type="date" name="date_heure" value={formData.date_heure} onChange={handleChange} className="w-full p-2 border rounded" required min={new Date().toISOString().split("T")[0]}/>
          </div>

          <div>
            <label className="block text-sm font-medium">Lieu</label>
            <input type="text" name="lieu" value={formData.lieu} onChange={handleChange} className="w-full p-2 border rounded" required />
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              name="evenementLibre"
              checked={formData.evenementLibre}
              onChange={(e) => setFormData({ ...formData, evenementLibre: e.target.checked })}
              className="mr-2"
            />
            <label className="text-sm font-medium">Événement à entrée libre</label>
          </div>

          <div>
            <label className="block text-sm font-medium">Nombre de tickets disponibles</label>
            <input
              type="number"
              name="billets_disponibles"
              value={formData.billets_disponibles}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              min="0"
              required
            />
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

export default withAuth(CreateEvent, ['ORGANISATEUR', 'ADMINISTRATEUR'])