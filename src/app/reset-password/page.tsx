/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"; // Directive pour marquer ce fichier comme un composant côté client

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import myImage from "../../../public/Images/Mboa_event.png";
import Image from "next/image";

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({ email: "", mot_de_passe: "", confirmPassword: "" });
  const [message, setMessage] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (name === "mot_de_passe") {
      setPasswordError(validatePassword(value));
      setConfirmPasswordError(
        formData.confirmPassword && value !== formData.confirmPassword
          ? "Les mots de passe ne correspondent pas."
          : ""
      );
    }

    if (name === "confirmPassword") {
      setConfirmPasswordError(value !== formData.mot_de_passe ? "Les mots de passe ne correspondent pas." : "");
    }
  };

  // Fonction de validation du mot de passe avec les contraintes
  const validatePassword = (password: string) => {
    const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\W).{8,}$/; // Expression régulière pour valider le mot de passe
    return passwordPattern.test(password)
      ? ""
      : "Le mot de passe doit contenir au moins 8 caractères, une majuscule, une minuscule et un caractère spécial.";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");

    const passwordValidation = validatePassword(formData.mot_de_passe);

    if (passwordValidation || confirmPasswordError) {
      setPasswordError(passwordValidation);
      setMessage("Corrigez les erreurs avant de continuer.");
      return;
    }

    if (!token) {
      setMessage("Jeton manquant.");
      return;
    }

    try {
      const response = await fetch("http://localhost:8000/users/reset-password/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, nouveau_mot_de_passe: formData.mot_de_passe }),
      });
      const data = await response.json();
      if (response.ok) {
        setMessage("Votre mot de passe a été réinitialisé avec succès.");
        setTimeout(() => router.push("/login"), 2000);
      } else {
        setMessage(data.error || "Erreur lors de la réinitialisation.");
      }
    } catch (error) {
      setMessage("Impossible de se connecter au serveur.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="grid md:grid-cols-2 w-full max-w-4xl bg-white shadow-lg rounded-2xl overflow-hidden">
        {/* Logo section */}
        <section className="flex flex-col items-center justify-center p-10 bg-white text-[#1a4162]">
          <Image src={myImage} alt="Logo" />
          <h1 className="text-3xl font-bold text-center mt-4 hidden md:block">
            La meilleure plateforme de promotion événementielle
          </h1>
        </section>
        
        {/* Form Section */}
        <div className="p-8">
          <h2 className="text-center text-2xl font-bold text-gray-800 mb-4">Créer un nouveau mot de passe</h2>
          <p className="text-center text-sm text-gray-600 mb-6">Votre nouveau mot de passe doit être différent des mots de passe précédemment utilisés.</p>

          {message && <p className="text-center text-red-500 mb-4">{message}</p>}
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-gray-700 text-sm">E-mail</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Entrez votre email"
                className="border p-3 w-full rounded-lg"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 text-sm">Nouveau mot de passe</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="mot_de_passe"  
                  value={formData.mot_de_passe}
                  onChange={handleChange}
                  className="border p-3 w-full rounded-lg pr-10"
                  required
                />
                {passwordError && <p className="text-red-500 text-sm">{passwordError}</p>}
                <button
                  type="button"
                  className="absolute inset-y-0 right-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-gray-700 text-sm">Confirmez le mot de passe</label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"  
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="border p-3 w-full rounded-lg pr-10"
                  required
                />
                {confirmPasswordError && <p className="text-red-500 text-sm">{confirmPasswordError}</p>}
                <button
                  type="button"
                  className="absolute inset-y-0 right-3 flex items-center"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="bg-[#1a4162] shadow-lg p-3 text-white rounded-lg w-full hover:scale-105 transition duration-300 ease-in-out"
            >
              Réinitialiser le mot de passe
            </button>

            <div className="text-center mt-4 text-sm">
              <Link href="/login" className="text-blue-600 underline">
                Retour à la connexion
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
