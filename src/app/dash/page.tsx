/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { addEvent } from "@/store/eventSlice";
import { Loader2, Upload, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Image from "next/image";
import Dropzone from "react-dropzone";

export default function CreateEvent() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { toast } = useToast();

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    titre: "",
    description: "",
    date_debut: "",
    date_fin: "",
    heure_gmt: "",
    lieu: "",
    capacite_max: 0,
    prix: 0,
    evenementLibre: false,
    billets_disponibles: 0,
    photo: null as File | null,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "prix" ? Math.max(0, Number(value)) : value,
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

  const handleDrop = (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      setFormData((prev) => ({ ...prev, photo: file }));
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleRemoveImage = () => {
    setFormData((prev) => ({ ...prev, photo: null }));
    setPreviewImage(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const eventData = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (value !== null) {
        eventData.append(key, value as string | Blob);
      }
    });

    try {
      const token = localStorage.getItem("token");

      const response = await fetch("http://localhost:8000/evenements/create/", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: eventData,
      });

      if (response.ok) {
        const newEvent = await response.json();
        toast({ description: "🎉 Événement créé avec succès !", variant: "success", duration: 2000 });

        dispatch(addEvent(newEvent));
        router.push("/interfaces/event-list");
      }
    } catch (error) {
      console.error("❌ Erreur lors de la création de l'événement", error);
      alert("Erreur lors de la création de l'événement");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 p-6">
      <div className="bg-[#131417] p-8 rounded-xl shadow-2xl w-[600px] border border-gray-700">
        <h1 className="text-3xl font-bold mb-6 text-center text-[#EAD7A2] uppercase tracking-wider">
          Créer un Événement
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {step === 1 && (
            <>
              <label className="block text-sm font-medium text-gray-300">Nom de lévénement</label>
              <input
                type="text"
                name="titre"
                value={formData.titre}
                onChange={handleChange}
                className="w-full p-2 border rounded-lg bg-gray-800 text-white border-gray-600 focus:ring-2 focus:ring-blue-500"
                required
              />

              <label className="block text-sm font-medium text-gray-300">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="w-full p-2 border rounded-lg bg-gray-800 text-white border-gray-600 focus:ring-2 focus:ring-blue-500"
              ></textarea>

              <label className="block text-sm font-medium text-gray-300">Lieu</label>
              <input
                type="text"
                name="lieu"
                value={formData.lieu}
                onChange={handleChange}
                className="w-full p-2 border rounded-lg bg-gray-800 text-white border-gray-600 focus:ring-2 focus:ring-blue-500"
                required
              />
            </>
          )}

          {step === 2 && (
            <>
              <label className="block text-sm font-medium text-gray-300">Dates et Heure</label>
              <input
                type="datetime-local"
                name="date_debut"
                value={formData.date_debut}
                onChange={handleChange}
                className="w-full p-2 border rounded-lg bg-gray-800 text-white border-gray-600 focus:ring-2 focus:ring-blue-500"
                required
              />
              <input
                type="datetime-local"
                name="date_fin"
                value={formData.date_fin}
                onChange={handleChange}
                className="w-full p-2 border rounded-lg bg-gray-800 text-white border-gray-600 focus:ring-2 focus:ring-blue-500"
                required
              />
            </>
          )}

          {step === 3 && (
            <>
              <label className="block text-sm font-medium text-gray-300">Flyer de lévénement</label>
              <Dropzone onDrop={handleDrop} accept={{ "image/*": [] }}>
                {({ getRootProps, getInputProps }) => (
                  <div
                    {...getRootProps()}
                    className="border-2 border-dashed p-4 rounded-lg cursor-pointer text-center bg-gray-900 border-gray-700 hover:border-blue-500 transition"
                  >
                    <input {...getInputProps()} />
                    {previewImage ? (
                      <div className="relative">
                        <Image src={previewImage} alt="Flyer" width={200} height={200} className="mx-auto rounded-lg" />
                        <button
                          onClick={handleRemoveImage}
                          className="absolute top-2 right-2 bg-red-500 p-1 rounded-full"
                        >
                          <Trash2 className="text-white w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <p className="text-gray-400 flex justify-center items-center">
                        <Upload className="w-6 h-6 mr-2" /> Glissez-déposez ou cliquez ici
                      </p>
                    )}
                  </div>
                )}
              </Dropzone>
            </>
          )}

          <div className="flex justify-between">
            {step > 1 && (
              <button
                onClick={() => setStep(step - 1)}
                className="bg-white text-black px-4 py-2 rounded-lg hover:bg-gray-300 transition"
              >
                Retour
              </button>
            )}
            {step < 3 ? (
              <button
                onClick={() => setStep(step + 1)}
                className="bg-white text-black px-4 py-2 rounded-lg hover:bg-gray-300 transition"
              >
                Suivant
              </button>
            ) : (
              <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition">
                Créer
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
