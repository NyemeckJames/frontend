"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";

export default function ResetPassword() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) {
      setMessage("Token manquant.");
      return;
    }

    const response = await fetch("http://localhost:8000/users/reset-password/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, new_password: password }),
    });

    const data = await response.json();
    if (response.ok) {
      setMessage("Votre mot de passe a été réinitialisé avec succès.");
    } else {
      setMessage(data.error || "Erreur lors de la réinitialisation.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="p-6 bg-white shadow-lg rounded-lg">
        <h2 className="text-xl font-bold">Réinitialisation du mot de passe</h2>
        <form className="mt-4" onSubmit={handleSubmit}>
          <input
            type="password"
            placeholder="Nouveau mot de passe"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full p-2 border rounded"
          />
          <button type="submit" className="w-full mt-4 p-2 bg-blue-500 text-white rounded">
            Changer le mot de passe
          </button>
        </form>
        {message && <p className="mt-4 text-sm">{message}</p>}
      </div>
    </div>
  );
}
