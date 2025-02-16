"use client"; // Avec App Router

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Link from "next/link";


interface FormValues {
  name: string;
  email: string;
  phone: string;
  password: string;
  userType: 'participant' | 'organisateur'; 
}

const schema = yup.object().shape({
  name: yup.string().required("Le nom est requis"),
  email: yup.string().email("Email invalide").required("L'email est requis"),
  phone: yup
    .string()
    .matches(/^\+?\d{9,15}$/, "Numéro invalide")
    .required("Le numéro de téléphone est requis"),
  password: yup.string().min(6, "Minimum 6 caractères").required("Mot de passe requis"),
  userType: yup.string().oneOf(['participant', 'organisateur'], "Veuillez sélectionner un type d'utilisateur").required("Le type d'utilisateur est requis")
});

export default function Register() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: yupResolver(schema),
  });

  const onSubmit = (data: FormValues) => {
    console.log("Utilisateur inscrit :", data);
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
            <label className="block text-sm font-medium text-[#1C1C1C]">Type dutilisateur</label>
              <select {...register("userType")} className="w-full p-2 border rounded">
                <option value="">-- Sélectionner un rôle (laisser vide = Admin) --</option>
                <option value="organizer">Organisateur</option>
                <option value="participant">Participant</option>
              </select>
            <p className="text-[#8B5E3B] text-sm">{errors.userType?.message}</p>
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
              placeholder="Entrez votre mot de passe"
            />
            <p className="text-[#8B5E3B] text-sm">{errors.password?.message}</p>
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




