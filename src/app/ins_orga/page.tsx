/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Poppins } from "next/font/google";
import { Eye, EyeOff } from "lucide-react"; // 🔥 Icônes pour le mot de passe

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export default function OrganizerRegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    address: "",
  });

  const [profilePhoto, setProfilePhoto] = useState<File | null>(null);
  const [cni, setCni] = useState<File | null>(null);

  // États pour gérer l'aperçu des fichiers
  const [profilePhotoPreview, setProfilePhotoPreview] = useState<string | null>(null);
  const [cniPreview, setCniPreview] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Fonction pour gérer l'upload et l'aperçu d'image
  const handleFileUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    setter: (file: File | null) => void,
    previewSetter: (preview: string | null) => void
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      setter(file);

      // Créer un aperçu de l'image
      const reader = new FileReader();
      reader.onloadend = () => {
        previewSetter(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailPattern.test(formData.email)) {
      alert("Veuillez entrer un email valide");
      return;
    }

    console.log("Inscription de l'organisateur :", formData, profilePhoto, cni);
    router.push("/dashboard"); // Redirige vers le dashboard après inscription
  };

  return (
    <div className={`${poppins.className} flex items-center justify-center min-h-screen bg-gray-900`}>
      <div className="grid gap-8">
        <div className="bg-gradient-to-r from-blue-500 to-purple-500 rounded-[26px] m-4">
          <div className="border-[20px] border-transparent rounded-[20px] bg-white shadow-lg xl:p-10 2xl:p-10 lg:p-10 md:p-10 sm:p-2 m-2">
            
            {/* Titre de la plateforme */}
            <h1 className="text-center text-4xl font-bold text-gray-800 mb-6">
              Mboa Event  <br />
              <span className="text-xl text-gray-600">Votre plateforme événementielle</span>
            </h1>

            <h2 className="text-center text-3xl font-semibold text-gray-800 mb-6">Inscription Organisateur</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email */}
              <div>
                <label htmlFor="email" className="mb-2 text-gray-700 text-lg">Email</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="border p-3 shadow-md border-gray-300 rounded-lg w-full"
                  placeholder="Email"
                  required
                />
              </div>

              {/* Adresse complète */}
              <div>
                <label htmlFor="address" className="mb-2 text-gray-700 text-lg">Adresse complète</label>
                <textarea
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className="border p-3 shadow-md border-gray-300 rounded-lg w-full"
                  placeholder="Entrez votre adresse complète"
                  required
                />
              </div>

              {/* Upload des fichiers avec prévisualisation */}
              <div className="space-y-4">
                {/* Photo de profil */}
                <div className="relative border-2 border-dashed border-gray-300 rounded-md px-6 py-8 text-center">
                  <input type="file" className="hidden" id="profilePhoto" accept="image/*"
                    onChange={(e) => handleFileUpload(e, setProfilePhoto, setProfilePhotoPreview)}
                  />
                  <label htmlFor="profilePhoto" className="cursor-pointer text-blue-500 hover:underline">
                    Importer une photo de profil
                  </label>
                  {profilePhotoPreview && (
                    <div className="mt-4">
                      <img src={profilePhotoPreview} alt="Aperçu de la photo de profil" className="w-32 h-32 object-cover rounded-full mx-auto" />
                    </div>
                  )}
                </div>

                {/* Carte Nationale d'Identité */}
                <div className="relative border-2 border-dashed border-gray-300 rounded-md px-6 py-8 text-center">
                  <input type="file" className="hidden" id="cni" accept="image/*"
                    onChange={(e) => handleFileUpload(e, setCni, setCniPreview)}
                  />
                  <label htmlFor="cni" className="cursor-pointer text-blue-500 hover:underline">
                    Importer la Carte Nationale dIdentité
                  </label>
                  {cniPreview && (
                    <div className="mt-4">
                      <img src={cniPreview} alt="Aperçu de la CNI" className="w-32 h-32 object-cover rounded-md mx-auto" />
                    </div>
                  )}
                </div>
              </div>

              {/* Bouton d'inscription */}
              <button
                type="submit"
                className="bg-gradient-to-r from-blue-500 to-purple-500 shadow-lg mt-6 p-2 text-white rounded-lg w-full hover:scale-105 transition duration-300 ease-in-out"
              >
                Sinscrire
              </button>
            </form>

            {/* Déjà un compte ? */}
            <div className="flex flex-col mt-4 items-center text-sm">
              <p className="text-gray-600">
                <Link href="/login" className="text-blue-400 hover:underline">Se connecter</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
