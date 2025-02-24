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
  const [errors, setErrors] = useState({
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  // Liste des domaines d'e-mails temporaires interdits
  const blockedDomains = ["mailinator.com", "tempmail.com", "guerrillamail.com", "10minutemail.com"];

  const validateEmail = (email: string) => {
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const emailDomain = email.split("@")[1];

    if (!emailPattern.test(email)) {
      return "Veuillez entrer une adresse email valide.";
    }
    if (emailDomain && blockedDomains.includes(emailDomain)) {
      return "Les emails temporaires ne sont pas autorisés.";
    }
    return "";
  };

  const validatePhone = (phone: string) => {
    const phonePattern = /^\+2376[0-9]{8}$/;
    return phonePattern.test(phone) ? "" : "Le numéro doit être au format +2376XXXXXXXX.";
  };

  const validatePassword = (password: string) => {
    if (password.length < 8) return "Le mot de passe doit contenir au moins 8 caractères.";
    if (!/[A-Z]/.test(password)) return "Le mot de passe doit contenir au moins une majuscule.";
    if (!/[a-z]/.test(password)) return "Le mot de passe doit contenir au moins une minuscule.";
    if (!/[0-9]/.test(password)) return "Le mot de passe doit contenir au moins un chiffre.";
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) return "Le mot de passe doit contenir un caractère spécial.";
    return "";
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Validation en direct
    if (name === "email") setErrors({ ...errors, email: validateEmail(value) });
    if (name === "phone") setErrors({ ...errors, phone: validatePhone(value) });
    if (name === "password") setErrors({ ...errors, password: validatePassword(value) });
    if (name === "confirmPassword") {
      setErrors({
        ...errors,
        confirmPassword: value !== formData.password ? "Les mots de passe ne correspondent pas." : "",
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Vérification finale des erreurs
    const emailError = validateEmail(formData.email);
    const phoneError = validatePhone(formData.phone);
    const passwordError = validatePassword(formData.password);
    const confirmPasswordError = formData.password !== formData.confirmPassword ? "Les mots de passe ne correspondent pas." : "";

    setErrors({ email: emailError, phone: phoneError, password: passwordError, confirmPassword: confirmPasswordError });

    if (emailError || phoneError || passwordError || confirmPasswordError) return;

    console.log("Inscription avec :", formData);
    // 🚀 Ajouter ici l'appel API pour l'inscription
    router.push("/login"); // 🔄 Redirige vers la page de connexion après inscription
  };

  return (
    <div className={`${poppins.className} flex items-center justify-center min-h-screen bg-gray-900`}>
      <div className="grid gap-8">
        <div className="bg-gradient-to-r from-blue-500 to-purple-500 rounded-[26px] m-4">
          <div className="border-[20px] border-transparent rounded-[20px] bg-white shadow-lg xl:p-10 2xl:p-10 lg:p-10 md:p-10 sm:p-2 m-2">
            <h1 className="text-center text-4xl font-bold text-gray-800 mb-6">
              Mboa Event <br />
              <span className="text-xl text-gray-600">Votre plateforme événementielle</span>
            </h1>

            <h2 className="text-center text-3xl font-semibold text-gray-800 mb-6">Sign Up</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Nom */}
              <div>
                <label htmlFor="name" className="mb-2 text-gray-700 text-lg">Nom complet</label>
                <input id="name" name="name" type="text" value={formData.name} onChange={handleChange} className="border p-3 shadow-md border-gray-300 rounded-lg w-full" placeholder="Votre nom" required />
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="mb-2 text-gray-700 text-lg">Email</label>
                <input id="email" name="email" type="email" value={formData.email} onChange={handleChange} className="border p-3 shadow-md border-gray-300 rounded-lg w-full" placeholder="Email" required />
                {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
              </div>

              {/* Téléphone */}
              <div>
                <label htmlFor="phone" className="mb-2 text-gray-700 text-lg">Numéro de téléphone</label>
                <input id="phone" name="phone" type="tel" value={formData.phone} onChange={handleChange} className="border p-3 shadow-md border-gray-300 rounded-lg w-full" required />
                {errors.phone && <p className="text-red-500 text-sm">{errors.phone}</p>}
              </div>

              {/* Mot de passe */}
              <div>
                <label htmlFor="password" className="mb-2 text-gray-700 text-lg">Mot de passe</label>
                <div className="relative">
                  <input id="password" name="password" type={showPassword ? "text" : "password"} value={formData.password} onChange={handleChange} className="border p-3 shadow-md border-gray-300 rounded-lg w-full pr-10" required />
                  <button type="button" className="absolute inset-y-0 right-3 flex items-center" onClick={() => setShowPassword(!showPassword)}>{showPassword ? <EyeOff size={20} /> : <Eye size={20} />}</button>
                </div>
                {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
              </div>

              <button type="submit" className="bg-gradient-to-r from-blue-500 to-purple-500 shadow-lg mt-6 p-2 text-white rounded-lg w-full">Sign Up</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
