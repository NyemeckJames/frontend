/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Poppins } from "next/font/google";
import { Eye, EyeOff } from "lucide-react"; // 🔥 Icônes pour afficher/cacher le mot de passe

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "+237", // 📌 Préfixe Cameroun
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(""); 
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");

    
    if (formData.password !== formData.confirmPassword) {
      setErrorMessage("Les mots de passe ne correspondent pas.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("http://localhost:8000/api/register/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const data = await response.json();
        setErrorMessage(data.error || "Erreur lors de l'inscription.");
      } else {
        router.push("/login");
      }
    } catch (error) {
      setErrorMessage("Impossible de se connecter au serveur.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`${poppins.className} flex items-center justify-center  bg-gray-900`}>
      <div className="grid">
        <div className="bg-gradient-to-r from-blue-500 to-purple-500 rounded-[26px] ">
          <div className="border-[20px] border-transparent rounded-[20px] bg-white shadow-lg xl:p-10 2xl:p-10 lg:p-10 md:p-10 sm:p-2 m-2">
            <h1 className="text-center text-4xl font-bold text-gray-800 mb-6">
              Mboa Event <br />
              <span className="text-xl text-gray-600">Votre plateforme événementielle</span>
            </h1>

            <h2 className="text-center text-3xl font-semibold text-gray-800 mb-6">Inscrivez-vous</h2>

            {errorMessage && <p className="text-red-500 text-center">{errorMessage}</p>}

            <form onSubmit={handleSubmit} className="">
              {/* Nom */}
              <div>
                <label htmlFor="name" className="mb-2 text-gray-700 text-lg">Nom complet</label>
                <input id="name" name="name" type="text" value={formData.name} onChange={handleChange} className="border p-3 shadow-md border-gray-300 rounded-lg w-full" placeholder="Votre nom" required />
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="mb-2 text-gray-700 text-lg">Email</label>
                <input id="email" name="email" type="email" value={formData.email} onChange={handleChange} className="border p-3 shadow-md border-gray-300 rounded-lg w-full" placeholder="Email" required />
              </div>

              {/* Téléphone */}
              <div>
                <label htmlFor="phone" className="mb-2 text-gray-700 text-lg">Numéro de téléphone</label>
                <input id="phone" name="phone" type="tel" value={formData.phone} onChange={handleChange} className="border p-3 shadow-md border-gray-300 rounded-lg w-full" required />
              </div>

              {/* Mot de passe */}
              <div>
                <label htmlFor="password" className="mb-2 text-gray-700 text-lg">Mot de passe</label>
                <div className="relative">
                  <input id="password" name="password" type={showPassword ? "text" : "password"} value={formData.password} onChange={handleChange} className="border p-3 shadow-md border-gray-300 rounded-lg w-full pr-10" required />
                  <button type="button" className="absolute inset-y-0 right-3 flex items-center" onClick={() => setShowPassword(!showPassword)}>{showPassword ? <EyeOff size={20} /> : <Eye size={20} />}</button>
                </div>
              </div>

              {/* Confirmation mot de passe */}
              <div>
                <label htmlFor="confirmPassword" className="mb-2 text-gray-700 text-lg">Confirmer le mot de passe</label>
                <div className="relative">
                  <input id="confirmPassword" name="confirmPassword" type={showConfirmPassword ? "text" : "password"} value={formData.confirmPassword} onChange={handleChange} className="border p-3 shadow-md border-gray-300 rounded-lg w-full pr-10" required />
                  <button type="button" className="absolute inset-y-0 right-3 flex items-center" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>{showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}</button>
                </div>
              </div>

              {/* Bouton d'inscription */}
              <button
                type="submit"
                className="bg-gradient-to-r from-blue-500 to-purple-500 shadow-lg mt-6 p-2 text-white rounded-lg w-full hover:scale-105 transition duration-300 ease-in-out"
                disabled={loading}
              >
                {loading ? "Inscription..." : "S'inscrire"}
              </button>
            </form>

            {/* Lien vers la connexion */}
            <div className="flex flex-col mt-4 items-center text-sm">
              <p className="text-gray-600">
                Vous avez déjà un compte ?{" "}
                <Link href="/login" className="text-blue-400 hover:underline">
                  Se connecter
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
