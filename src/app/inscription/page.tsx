/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Eye, EyeOff } from "lucide-react";
import myImage from "../../../public/Images/Mboa_event.png";

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    nom: "",
    email: "",
    telephone: "+237",
    mot_de_passe: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [nomError, setNomError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");

  const validateNom = (nom: string) => {
    return nom.trim().length >= 3 ? "" : "Le nom doit contenir au moins 3 caractères.";
  };

  const validateEmail = (email: string) => {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailPattern.test(email) ? "" : "Adresse email invalide.";
  };

  const validatePhone = (phone: string) => {
    const phonePattern = /^\+237(69|68|65|67|62)[0-9]{7}$/;
    return phonePattern.test(phone) ? "" : "Numéro invalide. Format: +2376XXXXXXXX";
  };

  const validatePassword = (password: string) => {
    const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\W).{8,}$/;
    return passwordPattern.test(password)
      ? ""
      : "Le mot de passe doit contenir au moins 8 caractères, une majuscule, une minuscule et un caractère spécial.";
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (name === "nom") {
      setNomError(validateNom(value));
    }

    if (name === "email") {
      setEmailError(validateEmail(value));
    }

    if (name === "telephone") {
      setPhoneError(validatePhone(value));
    }

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    const nomValidation = validateNom(formData.nom);
    const emailValidation = validateEmail(formData.email);
    const phoneValidation = validatePhone(formData.telephone);
    const passwordValidation = validatePassword(formData.mot_de_passe);

    if (nomValidation || emailValidation || phoneValidation || passwordValidation || confirmPasswordError) {
      setNomError(nomValidation);
      setEmailError(emailValidation);
      setPhoneError(phoneValidation);
      setPasswordError(passwordValidation);
      setErrorMessage("Corrigez les erreurs avant de continuer.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("http://localhost:8000/users/signup/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (!response.ok) {
        setErrorMessage(data.error || "Erreur lors de l'inscription.");
      } else {
        setSuccessMessage("Inscription réussie ! Vérifiez votre email pour activer votre compte.");
      }
    } catch (error) {
      setErrorMessage("Impossible de se connecter au serveur.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="grid md:grid-cols-2 w-full max-w-4xl bg-white shadow-lg rounded-2xl overflow-hidden">
        <section className="flex flex-col items-center justify-center p-10 bg-white text-[#1a4162]">
          <Image src={myImage} alt="Logo" />
          <h1 className="text-3xl font-bold text-center mt-4 hidden md:block">
            La meilleure plateforme de promotion événementielle
          </h1>
        </section>

        <section className="p-10 w-full">
          <h2 className="text-center text-3xl font-semibold text-gray-800 mb-6">
            Inscrivez-vous
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-gray-700 text-lg mb-2">Nom complet</label>
              <input
                name="nom"
                type="text"
                value={formData.nom}
                onChange={handleChange}
                className="border p-3 shadow-md border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-blue-400"
                required
              />
              {nomError && <p className="text-red-500 text-sm mt-1">{nomError}</p>}
            </div>

            <div>
              <label className="block text-gray-700 text-lg mb-2">Email</label>
              <input
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                className="border p-3 shadow-md border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-blue-400"
                required
              />
              {emailError && <p className="text-red-500 text-sm mt-1">{emailError}</p>}
            </div>

            <div>
              <label className="block text-gray-700 text-lg mb-2">Numéro de téléphone</label>
              <input
                name="telephone"
                type="tel"
                value={formData.telephone}
                onChange={handleChange}
                className="border p-3 shadow-md border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-blue-400"
                required
              />
              {phoneError && <p className="text-red-500 text-sm mt-1">{phoneError}</p>}
            </div>

            <div>
              <label className="block text-gray-700 text-lg mb-2">Mot de passe</label>
              <div className="relative">
                <input
                  name="mot_de_passe"
                  type={showPassword ? "text" : "password"}
                  value={formData.mot_de_passe}
                  onChange={handleChange}
                  className="border p-3 shadow-md border-gray-300 rounded-lg w-full pr-10 focus:ring-2 focus:ring-blue-400"
                  required
                />
                <button type="button" className="absolute inset-y-0 right-3 flex items-center text-gray-500" onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {passwordError && <p className="text-red-500 text-sm mt-1">{passwordError}</p>}
            </div>

            <div>
              <label className="block text-gray-700 text-lg mb-2">Confirmer le mot de passe</label>
              <div className="relative">
                <input
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="border p-3 shadow-md border-gray-300 rounded-lg w-full pr-10 focus:ring-2 focus:ring-blue-400"
                  required
                />
                <button type="button" className="absolute inset-y-0 right-3 flex items-center text-gray-500" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                  {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {confirmPasswordError  && <p className="text-red-500 text-sm mt-1">{confirmPasswordError}</p>}
            </div>

            <button className="bg-[#1a4162] shadow-lg mt-6 p-3 text-white rounded-lg w-full hover:scale-105 transition duration-300 ease-in-out">
              Sinscrire
            </button>
            {/* Redirection vers Sign IN */}
          <div className="mt-4 text-center text-sm text-gray-600">
            Vous avez déja un compte ? {" "}
            <Link href="/login" className="text-blue-400 hover:underline">
              Connectez-vous
            </Link>
          </div>
          </form>
        </section>
      </div>
    </div>
  );
}
