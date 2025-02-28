/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Eye, EyeOff } from "lucide-react";
import myImage from "../../../public/Images/Mboa_event.png"; // Remplace par ton image réelle

export default function LoginPage() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState("");

  const handleChange = (e:any) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e:any) => {
    e.preventDefault();
    console.log("Form submitted", formData);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="grid md:grid-cols-2 w-full max-w-4xl bg-white shadow-lg rounded-2xl overflow-hidden">
        {/* Section Logo */}
        <section className="flex flex-col items-center justify-center p-10 bg-white text-[#1a4162]">
          <Image src={myImage} alt="Logo"  />
          <h1 className="text-3xl font-bold text-center mt-4 hidden md:block">
            La meilleure plateforme de promotion evenementielle
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
              {emailError && <p className="text-red-500 text-sm mt-1">{emailError}</p>}
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

            {/* Mot de passe oublié */}
            <Link href="/forgot" className="text-blue-400 text-sm hover:underline block text-right">
              Mot de passe oublié ?
            </Link>

            {/* Bouton de connexion */}
            <button
              type="submit"
              className="bg-[#1a4162] shadow-lg mt-6 p-3 text-white rounded-lg w-full hover:scale-105 transition duration-300 ease-in-out"
            >
              Se connecter
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
