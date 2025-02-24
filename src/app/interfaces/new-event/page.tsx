"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { addEvent } from "@/store/eventSlice";
import { Poppins } from "next/font/google";
import { useDropzone } from "react-dropzone";
import Image from "next/image";
import { Loader2, Upload } from "lucide-react";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export default function NewEventPage() {
  const dispatch = useDispatch();
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [flyer, setFlyer] = useState<File | null>(null);
  const [flyerPreview, setFlyerPreview] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    titre: "",
    description: "",
    date_debut: "",
    date_fin: "",
    lieu: "",
    capacite_max: 0,
    prix: 0,
    evenementLibre: false,
    billets_disponibles: 0,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
      ...(name === "billets_disponibles" ? { capacite_max: Number(value) } : {}),
    }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      evenementLibre: e.target.checked,
      prix: e.target.checked ? 0 : prev.prix,
    }));
  };

  const { getRootProps, getInputProps } = useDropzone({
    accept: { "image/*": [] },
    onDrop: acceptedFiles => {
      const file = acceptedFiles[0];
      setFlyer(file);
      setFlyerPreview(URL.createObjectURL(file));
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const eventData = new FormData();
    Object.entries(formData).forEach(([key, value]) => eventData.append(key, String(value)));
    if (flyer) eventData.append("flyer", flyer);

    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:8000/evenements/create/", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: eventData,
      });

      if (response.ok) {
        dispatch(addEvent(await response.json()));
        router.push("/interfaces/event-list");
      } else {
        console.error("Erreur lors de la création de l'événement");
      }
    } catch (error) {
      console.error("Erreur serveur :", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`${poppins.className} flex items-center justify-center min-h-screen bg-gray-900`}>
      <div className="bg-gradient-to-r from-blue-500 to-purple-500 rounded-[26px] m-4 w-full max-w-2xl">
        <div className="border-[20px] border-transparent rounded-[20px] bg-white shadow-lg p-10">
          <h1 className="text-center text-4xl font-bold text-gray-800 mb-6">
            Créer un nouvel Événement 
          </h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            {step === 1 && (
              <>
                <div>
                  <label className="text-gray-700 font-medium">Nom de lévénement</label>
                  <input type="text" name="titre" value={formData.titre} onChange={handleChange} className="w-full p-3 border rounded-lg" required />
                </div>

                <div>
                  <label className="text-gray-700 font-medium">Description</label>
                  <textarea name="description" value={formData.description} onChange={handleChange} className="w-full p-3 border rounded-lg" required />
                </div>

                <div>
                  <label className="text-gray-700 font-medium">Lieu</label>
                  <input type="text" name="lieu" value={formData.lieu} onChange={handleChange} className="w-full p-3 border rounded-lg" required />
                </div>

                <button type="button" onClick={() => setStep(2)} className="w-full bg-blue-500 text-white p-3 rounded-lg">
                  Suivant
                </button>
              </>
            )}

            {step === 2 && (
              <>
                <div>
                  <label className="text-gray-700 font-medium">Date et heure de début</label>
                  <input type="datetime-local" name="date_debut" value={formData.date_debut} onChange={handleChange} className="w-full p-3 border rounded-lg" required />
                </div>

                <div>
                  <label className="text-gray-700 font-medium">Date et heure de fin</label>
                  <input type="datetime-local" name="date_fin" value={formData.date_fin} onChange={handleChange} className="w-full p-3 border rounded-lg" required />
                </div>

                <div className="flex items-center">
                  <input type="checkbox" name="evenementLibre" checked={formData.evenementLibre} onChange={handleCheckboxChange} className="mr-2" />
                  <label className="text-gray-700 font-medium">Événement à entrée libre</label>
                </div>

                {!formData.evenementLibre && (
                  <div>
                    <label className="text-gray-700 font-medium">Prix (FCFA)</label>
                    <input type="number" name="prix" value={formData.prix} onChange={handleChange} className="w-full p-3 border rounded-lg" min="0" required />
                  </div>
                )}

                <button type="button" onClick={() => setStep(3)} className="w-full bg-blue-500 text-white p-3 rounded-lg">
                  Suivant
                </button>
              </>
            )}

            {step === 3 && (
              <>
                <div {...getRootProps()} className="border-2 border-dashed p-6 rounded-lg text-center cursor-pointer">
                  <input {...getInputProps()} />
                  {flyerPreview ? (
                    <Image src={flyerPreview} alt="Flyer de l'événement" width={200} height={200} className="mx-auto" />
                  ) : (
                    <p className="text-gray-700"><Upload className="inline-block w-8 h-8 mr-2" /> Glissez-déposez un flyer ici</p>
                  )}
                </div>

                <button type="submit" className="w-full bg-green-500 text-white p-3 rounded-lg flex items-center justify-center" disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin mr-2" />
                      Création en cours...
                    </>
                  ) : (
                    "Créer l'événement"
                  )}
                </button>
              </>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
