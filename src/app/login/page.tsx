"use client"; // Avec App Router

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Link from "next/link";

interface FormValues {
  email: string;
  password: string;
}

const schema = yup.object().shape({
  email: yup.string().email("Email invalide").required("L'email est requis"),
  password: yup.string().min(6, "Minimum 6 caractères").required("Mot de passe requis"),
});

export default function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: yupResolver(schema),
  });

  const onSubmit = (data: FormValues) => {
    console.log("Utilisateur connecté :", data);
  };

  return (
    <div className="flex justify-center items-center h-screen bg-[#EAD7A2]"> {/* Beige doux */}
      <div className="bg-[#F5F5F5] p-6 rounded-lg shadow-md w-96 border-2 border-[#1C1C1C]"> {/* Blanc cassé */}
        <h1 className="text-2xl font-bold mb-4 text-center text-[#8B5E3B]">Connexion</h1> {/* Brun chaud */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
          <p>Pas encore inscrit ?</p>
          {/* Remplacer <a> par un simple texte à l'intérieur de Link */}
          <Link href="/inscription" className="text-[#8B5E3B] hover:text-[#1C1C1C]">
            Sinscrire
          </Link>
        </div>

          {/* Bouton de connexion */}
          <button
            type="submit"
            className="w-full bg-[#1C1C1C] text-[#EAD7A2] py-2 rounded-lg hover:bg-[#8B5E3B] hover:text-white transition"
          >
            Se connecter
          </button>
        </form>
      </div>
    </div>
  );
}
