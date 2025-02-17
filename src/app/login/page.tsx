"use client"; // Avec App Router

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";


interface FormValues {
  email: string;
  password: string;
}
const decodeBase64 = (base64: string) => {
  try {
    return JSON.parse(atob(base64));
  } catch (error) {
    console.error("Error decoding base64:", error);
    return null;
  }
};

const decodeToken = (token: string | null) => {
  if (!token) {
    console.log("No token provided or found");
    return;
  }
  const parts = token.split(".");
  if (parts.length !== 3) {
    console.error("Invalid token format");
    return;
  }
  
  const payload = decodeBase64(parts[1]);
  return payload;
};
const schema = yup.object().shape({
  email: yup.string().email("Email invalide").required("L'email est requis"),
  password: yup.string().min(6, "Minimum 6 caractères").required("Mot de passe requis"),
});

export default function Login() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data: FormValues) => {
    try {
      const response = await fetch("http://localhost:8000/users/login/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const data = await response.json();
        const infotoken = decodeToken(data.access);
        const expiryTime = infotoken.exp * 1000;
        localStorage.setItem("tokenExpiry", expiryTime.toString());
        localStorage.setItem("token", data.access);
        localStorage.setItem("roles", JSON.stringify(data.user.role));
        localStorage.setItem("user", JSON.stringify(data.user));
        if (data.user.role === "ADMINISTRATEUR" || data.user.role === "ORGANISATEUR") {
          router.replace("/interfaces/new-event/");
        }
        if (data.user.role === "PARTICIPANT") {
          router.replace("/interfaces/participant/event-list/");
        }
        alert("User log in successfully");
      } else {
        console.error("Error logging in user ", response.statusText);
      }
    } catch (error) {
      console.error("Error logging in user", error);
    }
     
  
  };




  return (
    <div className="flex justify-center items-center h-screen bg-[#1a4162]"> {/* Bleu */}
      <div className="bg-white p-6 rounded-lg shadow-md w-96 border-2 border-[#1a4162]"> {/* Fond blanc avec bord bleu */}
        <h1 className="text-2xl font-bold mb-4 text-center text-[#1a4162]">Connexion</h1> {/* Texte bleu */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-[#1a4162]">Email</label>
            <input
              {...register("email")}
              type="email"
              className="w-full p-2 border rounded-lg focus:outline-none focus:ring focus:border-[#1a4162] bg-white"
              placeholder="Entrez votre email"
            />
            <p className="text-red-500 text-sm">{errors.email?.message}</p>
          </div>

          {/* Mot de passe */}
          <div>
            <label className="block text-sm font-medium text-[#1a4162]">Mot de passe</label>
            <input
              {...register("password")}
              type="password"
              className="w-full p-2 border rounded-lg focus:outline-none focus:ring focus:border-[#1a4162] bg-white"
              placeholder="Entrez votre mot de passe"
            />
            <p className="text-red-500 text-sm">{errors.password?.message}</p>
          </div>
          
          {/* Lien inscription */}
          <div className="mt-4 text-center">
            <p>Pas encore inscrit ?</p>
            <Link href="/inscription" className="text-[#1a4162] hover:text-blue-500">
              Sinscrire
            </Link>
          </div>

          {/* Bouton de connexion */}
          <button
            type="submit"
            className="w-full bg-[#1a4162] text-white py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Se connecter
          </button>
        </form>
      </div>
    </div>
  );
}
