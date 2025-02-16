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

  // const onSubmit = (data: FormValues) => {
  //   console.log("Utilisateur connecté :", data);
  // };

  const onSubmit = async (data: FormValues) => {
    
    try {
      //console.log("User to log in info :", formData);
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
        console.log("here is your response " + data.user.role);
        //console.log("here is your response " + data.user.role);
        const infotoken =decodeToken(data.access);
        console.log("info is",infotoken);
        const expiryTime=infotoken.exp*1000
        //console.log ("expiration time",expiryTime)
        //const now = new Date().getTime();
        //console.log("current time",now)
        localStorage.setItem("tokenExpiry", expiryTime.toString());
        localStorage.setItem("token", data.access);
        localStorage.setItem("roles", JSON.stringify(data.user.role));
        localStorage.setItem("user", JSON.stringify(data.user));
        alert("User log in  succesfully");
        router.replace("/event/events/create");
      } else {
        console.error("Error registring user ", response.statusText);
      }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      console.error("Error registring user");
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      router.replace("/HomePage"); // Redirect to home if logged in
    }
  }, [router]);


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
