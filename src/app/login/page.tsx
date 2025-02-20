/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

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
    return null;
  }
  const parts = token.split(".");
  if (parts.length !== 3) {
    return null;
  }
  return decodeBase64(parts[1]); // Payload
};

const schema = yup.object().shape({
  email: yup.string().email("Email invalide").required("L'email est requis"),
  password: yup.string().min(6, "Minimum 6 caractères").required("Mot de passe requis"),
});

export default function Login() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // 🛠️ Vérification automatique du token lors du chargement du composant
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const payload = decodeToken(token);
      const expiryTime = payload?.exp ? payload.exp * 1000 : 0;
      const currentTime = Date.now();

      if (expiryTime > currentTime) {
        // Token valide, récupérer le rôle
        const role = localStorage.getItem("roles")?.replace(/"/g, ""); // Nettoyer le rôle

        if (role === "ADMINISTRATEUR" || role === "ORGANISATEUR") {
          router.replace("/interfaces/new-event/");
        } else if (role === "PARTICIPANT") {
          router.replace("/interfaces/participant/event-list/");
        }
      } else {
        console.log("Token expiré");
        localStorage.clear(); // Supprime le token expiré
      }
    }
  }, [router]); // S'exécute une seule fois au chargement

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data: FormValues) => {
    setLoading(true);
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
        } else if (data.user.role === "PARTICIPANT") {
          router.replace("/interfaces/participant/event-list/");
        }
      } else {
        console.error("Erreur de connexion", response.statusText);
      }
    } catch (error) {
      console.error("Erreur lors de la connexion", error);
    }
    finally{
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-[#1a4162]">
      <div className="bg-white p-6 rounded-lg shadow-md w-96 border-2 border-[#1a4162]">
        <h1 className="text-2xl font-bold mb-4 text-center text-[#1a4162]">Connexion</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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

          <div className="mt-4 text-center">
            <p>Pas encore inscrit ?</p>
            <Link href="/inscription" className="text-[#1a4162] hover:text-blue-500">
              S'inscrire
            </Link>
          </div>

          <button
            type="submit"
            className="w-full bg-[#1a4162] text-white py-2 rounded-lg hover:bg-blue-700 transition flex items-center justify-center"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin mr-2" />
                Connexion...
              </>
            ) : (
              "Se connecter"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
