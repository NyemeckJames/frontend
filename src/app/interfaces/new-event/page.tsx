/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import withAuth from "@/app/component/WithAuth";
import axios from "axios";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { addEvent } from "@/store/eventSlice";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";


interface EventFormData {
  titre: string;
  description: string;
  date_heure: string;
  lieu: string;
  latitude: number;
  longitude: number;
  capacite_max: number;
  evenementLibre: boolean;
  prix:number
  billets_disponibles: number;
  photo?: File | null;
}

export default function CreateEvent() {
  const dispatch = useDispatch();
  const router = useRouter();
  const [formData, setFormData] = useState<EventFormData>({
    titre: "",
    description: "",
    date_heure: "",
    lieu: "",
    latitude: 0,
    longitude: 0,
    capacite_max: 0,
    prix: 0,
    evenementLibre: false,
    billets_disponibles: 0,
    photo: null,
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const {toast} = useToast();
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
      ...(name === "billets_disponibles" ? { capacite_max: Number(value) } : {}),
    }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const isChecked = e.target.checked;
    setFormData((prev) => ({
      ...prev,
      evenementLibre: isChecked,
      prix: isChecked ? 0 : prev.prix,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFormData((prev) => ({ ...prev, photo: e.target.files![0] }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    setLoading(true);
    e.preventDefault();

    const eventData = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (value !== null) {
        eventData.append(key, value as string | Blob);
      }
    });

    try {
      const token = localStorage.getItem("token");

      const response = await axios.post("http://localhost:8000/evenements/create/", eventData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 201) {
        const newEvent = response.data;
        toast({
          description : "Événement créé avec succès !",
          variant : "success",
          duration: 2000,
        })
        dispatch(addEvent(newEvent)); // ➜ Ajout dans le store Redux
        router.push("/interfaces/event-list"); // ➜ Redirection
      }
    } catch (error) {
      console.error("Erreur lors de la création de l'événement", error);
      alert("Erreur lors de la création de l'événement");
    }
    finally{
      setLoading(false);
    }
  };
  return (
    <div className="flex justify-center items-center min-h-screen bg-[#FFFFFF] p-6">
      <div className="bg-[#F5F5F5] p-6 rounded-lg shadow-md w-96 border-2 border-[#1A4162]">
        <h1 className="text-2xl font-bold mb-4 text-center text-[#1A4162]">Créer un Événement</h1>
        
        {message && <p className="text-center text-[#1A4162] font-semibold">{message}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#1A4162]">Nom de lévénement</label>
            <input type="text" name="titre" value={formData.titre} onChange={handleChange} className="w-full p-2 border rounded-lg bg-white" required />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#1A4162]">Description</label>
            <textarea name="description" value={formData.description} onChange={handleChange} className="w-full p-2 border rounded-lg bg-white"></textarea>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#1A4162]">Date</label>
            <input
              type="datetime-local"
              name="date_heure"
              value={formData.date_heure}
              onChange={handleChange}
              className="w-full p-2 border rounded-lg bg-white"
              required
              min={new Date().toISOString().slice(0, 16)} 
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#1A4162]">Lieu</label>
            <input type="text" name="lieu" value={formData.lieu} onChange={handleChange} className="w-full p-2 border rounded-lg bg-white" required />
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              name="evenementLibre"
              checked={formData.evenementLibre}
              onChange={handleCheckboxChange}
              className="mr-2"
            />
            <label className="text-sm font-medium text-[#1A4162]">Événement à entrée libre</label>
          </div>
          {!formData.evenementLibre && (
            <div>
              <label className="block text-sm font-medium text-[#1A4162]">Prix (Xaf)</label>
              <input
                type="number"
                name="prix"
                value={formData.prix}
                onChange={handleChange}
                className="w-full p-2 border rounded-lg bg-white"
                min="0"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-[#1A4162]">Nombre de tickets disponibles</label>
            <input
              type="number"
              name="billets_disponibles"
              value={formData.billets_disponibles}
              onChange={handleChange}
              className="w-full p-2 border rounded-lg bg-white"
              min="0"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#1A4162]">Flyer de lévénement</label>
            <input type="file" accept="image/*" onChange={handleFileChange} className="w-full p-2 border rounded-lg bg-white" />
          </div>

          <button
            type="submit"
            className="w-full bg-[#1A4162] text-white py-2 rounded-lg hover:bg-[#2e6da3] hover:text-white transition flex items-center justify-center"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin mr-2" />
                Ajout de l'evenement...
              </>
            ) : (
              "Ajouter l'événement"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
