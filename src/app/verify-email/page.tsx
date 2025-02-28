"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

export default function VerifyEmail() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [message, setMessage] = useState("Vérification en cours...");

  useEffect(() => {
    if (!token) {
      setMessage("Token manquant.");
      return;
    }

    const verifyEmail = async () => {
      try {
        const response = await fetch(`http://localhost:8000/users/verify-email/?token=${token}`, {
          method: "GET",
        });

        const data = await response.json();
        console.log(response)
        if (response.ok) {
          setMessage("Votre email a été vérifié avec succès. Vous pouvez maintenant vous connecter.");
        } else {
          setMessage(data.error || "Échec de la vérification.");
        }
      } catch (error) {
        setMessage("Une erreur est survenue.");
      }
    };

    verifyEmail();
  }, [token]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="p-6 bg-white shadow-lg rounded-lg text-center">
        <h2 className="text-xl font-bold">Vérification de l'email</h2>
        <p className="mt-4">{message}</p>
      </div>
    </div>
  );
}
