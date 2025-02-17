/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"; // Avec App Router

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Link from "next/link";
import { useRouter } from "next/navigation";


interface FormValues {
  name: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  role: 'PARTICIPANT' | 'ORGANISATEUR'; 
}

const schema = yup.object().shape({
  name: yup.string().required("Le nom est requis"),
  email: yup.string().email("Email invalide").required("L'email est requis"),
  phone: yup
    .string()
    .matches(/^\+?\d{9,15}$/, "Numéro invalide")
    .required("Le numéro de téléphone est requis"),
  password: yup.string().min(6, "Minimum 6 caractères").required("Mot de passe requis"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password")], "Les mots de passe ne correspondent pas")
    .required("Veuillez confirmer votre mot de passe"),
  userType: yup.string().oneOf(['participant', 'organisateur'], "Veuillez sélectionner un type d'utilisateur").required("Le type d'utilisateur est requis")
});

export default function Register() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data: FormValues) => {
    // Prépare les données pour l'API
    const formData = {
      email: data.email,
      nom: data.name,
      prenom: "",
      telephone: data.phone,
      mot_de_passe: data.password,
      role: data.role,
    };

    try {
      // Envoie des données à l'API backend pour créer l'utilisateur
      const response = await fetch("http://localhost:8000/users/signup/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        // Si une erreur se produit, l'afficher
        console.error("Erreur d'inscription :", errorData);
        alert(errorData?.detail || "Une erreur s'est produite");
      } else {
        const successData = await response.json();
        // Réponse de succès, utilisateur créé
        console.log("Utilisateur inscrit avec succès :", successData);
        alert("Inscription réussie !");
        router.replace('/login')
      }
    } catch (error) {
      console.error("Erreur réseau :", error);
      alert("Erreur réseau. Veuillez réessayer.");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-[#EAD7A2]"> {/* Beige doux */}
      <div className="bg-[#F5F5F5] p-6 rounded-lg shadow-md w-96 border-2 border-[#1C1C1C]"> {/* Blanc cassé */}
        <h1 className="text-2xl font-bold mb-4 text-center text-[#8B5E3B]">Inscription</h1> {/* Brun chaud */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Nom */}
          <div>
            <label className="block text-sm font-medium text-[#1C1C1C]">Nom</label>
            <input
              {...register("name")}
              className="w-full p-2 border rounded-lg focus:outline-none focus:ring focus:border-[#8B5E3B] bg-white"
              placeholder="Entrez votre nom"
            />
            <p className="text-[#8B5E3B] text-sm">{errors.name?.message}</p>
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-[#1C1C1C]">Email</label>
            <input
              {...register("email")}
              type="email"
              className="w-full p-2 border rounded-lg focus:outline-none focus:ring focus:border-[#8B5E3B] bg-white"
              placeholder="Entrez votre email"
            />
            <p className="text-[#8B5E3B] text-sm">{errors.email?.message}</p>
          </div>

          {/* Type d'utilisateur */}
          <div>
            <label className="block text-sm font-medium text-[#1C1C1C]">Role</label>
              <select {...register("role")} className="w-full p-2 border rounded">
                <option value="ORGANISATEUR">Organisateur</option>
                <option value="PARTICIPANT">Participant</option>
              </select>
            <p className="text-[#8B5E3B] text-sm">{errors.role?.message}</p>
          </div>

          {/* Téléphone */}
          <div>
            <label className="block text-sm font-medium text-[#1C1C1C]">Numéro de téléphone</label>
            <input
              {...register("phone")}
              type="tel"
              className="w-full p-2 border rounded-lg focus:outline-none focus:ring focus:border-[#8B5E3B] bg-white"
              placeholder="Ex: +32 123 456 789"
            />
            <p className="text-[#8B5E3B] text-sm">{errors.phone?.message}</p>
          </div>

          {/* Mot de passe */}
          <div>
            <label className="block text-sm font-medium text-[#1C1C1C]">Mot de passe</label>
            <input
              {...register("password")}
              type="password"
              className="w-full p-2 border rounded-lg focus:outline-none focus:ring focus:border-[#8B5E3B] bg-white"
              placeholder="Entrez votre mot de passe"/>
            <p className="text-[#8B5E3B] text-sm">{errors.password?.message}</p>
          </div>

          {/* Confirmation du mot de passe */}
          <div>
            <label className="block text-sm font-medium text-[#1C1C1C]">Confirmez le mot de passe</label>
            <input
              {...register("confirmPassword")}
              type="password"
              className="w-full p-2 border rounded-lg focus:outline-none focus:ring focus:border-[#8B5E3B] bg-white"
              placeholder="Ressaisissez votre mot de passe"/>
            <p className="text-[#8B5E3B] text-sm">{errors.confirmPassword?.message}</p>
          </div>


          {/* Formulaire de connexion ici */}

        <div className="mt-4 text-center">
          <p>Déja inscrit ?</p>
          {/* Remplacer <a> par un simple texte à l'intérieur de Link */}
          <Link href="/login" className="text-[#8B5E3B] hover:text-[#1C1C1C]">
            Se connecter
          </Link>
        </div>
          {/* Bouton d'inscription */}
          <button
            type="submit"
            className="w-full bg-[#1C1C1C] text-[#EAD7A2] py-2 rounded-lg hover:bg-[#8B5E3B] hover:text-white transition"
          >
            Sinscrire
          </button>
        </form>
      </div>
    </div>
  );
}




