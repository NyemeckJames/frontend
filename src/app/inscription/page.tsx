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
  role: yup.string().oneOf(['PARTICIPANT', 'ORGANISATEUR'], "Veuillez sélectionner un type d'utilisateur").required("Le type d'utilisateur est requis")
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
    const formData = {
      email: data.email,
      nom: data.name,
      prenom: "",
      telephone: data.phone,
      mot_de_passe: data.password,
      role: data.role,
    };

    try {
      const response = await fetch("http://localhost:8000/users/signup/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Erreur d'inscription :", errorData);
        alert(errorData?.detail || "Une erreur s'est produite");
      } else {
        const successData = await response.json();
        console.log("Utilisateur inscrit avec succès :", successData);
        alert("Inscription réussie !");
        router.replace('/login');
      }
    } catch (error) {
      console.error("Erreur réseau :", error);
      alert("Erreur réseau. Veuillez réessayer.");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-white"> 
      <div className="bg-[#1a4162] p-6 rounded-lg shadow-md w-96 border-2 border-[#1a4162]"> 
        <h1 className="text-2xl font-bold mb-4 text-center text-white">Inscription</h1> 
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-white">Nom</label>
            <input
              {...register("name")}
              className="w-full p-2 border rounded-lg focus:outline-none focus:ring focus:border-white bg-white text-[#1a4162]"
              placeholder="Entrez votre nom"
            />
            <p className="text-white text-sm">{errors.name?.message}</p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-white">Email</label>
            <input
              {...register("email")}
              type="email"
              className="w-full p-2 border rounded-lg focus:outline-none focus:ring focus:border-white bg-white text-[#1a4162]"
              placeholder="Entrez votre email"
            />
            <p className="text-white text-sm">{errors.email?.message}</p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-white">Role</label>
            <select {...register("role")} className="w-full p-2 border rounded bg-white text-[#1a4162]">
              <option value="ORGANISATEUR">Organisateur</option>
              <option value="PARTICIPANT">Participant</option>
            </select>
            <p className="text-white text-sm">{errors.role?.message}</p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-white">Numéro de téléphone</label>
            <input
              {...register("phone")}
              type="tel"
              className="w-full p-2 border rounded-lg focus:outline-none focus:ring focus:border-white bg-white text-[#1a4162]"
              placeholder="Ex: +237 123 456 789"
            />
            <p className="text-white text-sm">{errors.phone?.message}</p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-white">Mot de passe</label>
            <input
              {...register("password")}
              type="password"
              className="w-full p-2 border rounded-lg focus:outline-none focus:ring focus:border-white bg-white text-[#1a4162]"
              placeholder="Entrez votre mot de passe"/>
            <p className="text-white text-sm">{errors.password?.message}</p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-white">Confirmez le mot de passe</label>
            <input
              {...register("confirmPassword")}
              type="password"
              className="w-full p-2 border rounded-lg focus:outline-none focus:ring focus:border-white bg-white text-[#1a4162]"
              placeholder="Ressaisissez votre mot de passe"/>
            <p className="text-white text-sm">{errors.confirmPassword?.message}</p>
          </div>

          <button
            type="submit"
            className="w-full bg-white text-[#1a4162] py-2 rounded-lg hover:bg-[#1a4162] hover:text-white transition"
          >
            S inscrire
          </button>
           {/* Formulaire de connexion ici */}

        <div className="mt-4 text-center">
          <p>Déja inscrit ?</p>
          {/* Remplacer <a> par un simple texte à l'intérieur de Link */}
          <Link href="/login" className="text-[#FFFFFF] hover:text-[#FFFFFF]">
            Se connecter
          </Link>
        </div>
        </form>
      </div>
    </div>
  );
}
