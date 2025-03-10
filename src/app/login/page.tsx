/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import myImage from "../../../public/Images/Mboa_event.png"; // Remplace par ton image réelle

export default function LoginPage() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setErrorMessage(""); // Réinitialise les erreurs
    setLoading(true);

    try {
      const response = await fetch("http://127.0.0.1:8000/users/login/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Échec de la connexion");
      }

      // Stocker le token et l'utilisateur dans les cookies
    document.cookie = `token=${data.access}; Path=/;`;
    document.cookie = `user=${JSON.stringify(data.user)}; Path=/;`;

      // Stocker le token dans localStorage (ou cookies si besoin)
      localStorage.setItem("token", data.access);
      localStorage.setItem("refreshToken", data.refresh);
      localStorage.setItem("user", JSON.stringify(data.user));

      // Redirection après connexion
      router.push("/interface/home"); // Remplace par la page désirée

    } catch (error: any) {
      setErrorMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="grid md:grid-cols-2 w-full max-w-4xl bg-white shadow-lg rounded-2xl overflow-hidden">
        {/* Section Logo */}
        <section className="flex flex-col items-center justify-center p-10 bg-white text-[#1a4162]">
          <Image src={myImage} alt="Logo" />
          <h1 className="text-3xl font-bold text-center mt-4 hidden md:block">
            La meilleure plateforme de promotion événementielle
          </h1>
        </section>

        {/* Section Formulaire */}
        <section className="p-10 w-full">
          <h2 className="text-center text-3xl font-semibold text-gray-800 mb-6">
            Connectez-vous
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-gray-700 text-lg mb-2">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                className="border p-3 shadow-md border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-blue-400"
                placeholder="Email"
                required
              />
            </div>

            {/* Mot de passe */}
            <div>
              <label htmlFor="password" className="block text-gray-700 text-lg mb-2">
                Mot de passe
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleChange}
                  className="border p-3 shadow-md border-gray-300 rounded-lg w-full pr-10 focus:ring-2 focus:ring-blue-400"
                  placeholder="Mot de passe"
                  required
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-3 flex items-center text-gray-500"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Message d'erreur */}
            {errorMessage && <p className="text-red-500 text-center">{errorMessage}</p>}

            {/* Mot de passe oublié */}
            <Link href="/forgot" className="text-blue-400 text-sm hover:underline block text-right">
              Mot de passe oublié ?
            </Link>

            {/* Bouton de connexion */}
            <button
              type="submit"
              className="bg-[#1a4162] shadow-lg mt-6 p-3 text-white rounded-lg w-full hover:scale-105 transition duration-300 ease-in-out"
              disabled={loading}
            >
              {loading ? "Connexion..." : "Se connecter"}
            </button>
          </form>

          {/* Redirection vers Sign Up */}
          <div className="mt-4 text-center text-sm text-gray-600">
            Vous navez pas de compte ? {" "}
            <Link href="/inscription" className="text-blue-400 hover:underline">
              Inscrivez-vous
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
