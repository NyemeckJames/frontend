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

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState(""); // Gestion des erreurs email

  // Liste des domaines d'e-mails temporaires à bloquer
  const blockedDomains = ["mailinator.com", "tempmail.com", "guerrillamail.com", "10minutemail.com"];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === "email") {
      // Vérifie si l'email contient un domaine interdit
      const emailDomain = value.split("@")[1];
      if (emailDomain && blockedDomains.includes(emailDomain)) {
        setEmailError("Les emails temporaires ne sont pas autorisés.");
      } else {
        setEmailError("");
      }
    }

    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (emailError) {
      alert("Veuillez entrer une adresse email valide.");
      return;
    }

    console.log("Connexion avec :", formData);
    // 🚀 Ajouter ici l'appel API pour l'authentification
    router.push("/interfaces/dashboard"); // 🔄 Rediriger après connexion réussie
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

            <h2 className="text-center text-3xl font-semibold text-gray-800 mb-6">Connectez-vous</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email */}
              <div>
                <label htmlFor="email" className="mb-2 text-gray-700 text-lg">
                  Email
                </label>
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
                {emailError && <p className="text-red-500 text-sm">{emailError}</p>}
              </div>

              {/* Mot de passe avec icône "œil" */}
              <div>
                <label htmlFor="password" className="mb-2 text-gray-700 text-lg">
                  Mot de passe
                </label>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={handleChange}
                    className="border p-3 shadow-md border-gray-300 rounded-lg w-full pr-10"
                    placeholder="Mot de passe"
                    required
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-3 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              {/* Mot de passe oublié */}
              <Link href="#" className="text-blue-400 text-sm hover:underline">
                Mot de passe oublié ?
              </Link>

              {/* Bouton de connexion */}
              <button
                type="submit"
                className="bg-gradient-to-r from-blue-500 to-purple-500 shadow-lg mt-6 p-2 text-white rounded-lg w-full hover:scale-105 transition duration-300 ease-in-out"
              >
                Se connecter
              </button>
            </form>

            {/* Redirection vers Sign Up */}
            <div className="flex flex-col mt-4 items-center text-sm">
              <p className="text-gray-600">
                Vous navez pas de compte ?{" "}
                <Link href="/inscription" className="text-blue-400 hover:underline">
                  Inscrivez-vous
                </Link>
              </p>
            </div>

        
          </div>
        </div>
      </div>
    </div>
  );
}
