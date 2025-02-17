"use client";

import { useState } from "react";

export default function AjouterUtilisateur() {
  const [user, setUser] = useState({ name: "", email: "", role: "organizer" });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Nouvel utilisateur ajouté :", user);
    alert(`Utilisateur ${user.name} ajouté avec succès !`);
    setUser({ name: "", email: "", role: "organizer" }); // Reset du formulaire
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-[#1C1C1C] p-6">
      <div className="bg-[#EAD7A2] p-6 rounded-lg shadow-md w-96">
        <h1 className="text-2xl font-bold mb-4 text-center text-[#1C1C1C]">Ajouter un Utilisateur</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#1C1C1C]">Nom</label>
            <input
              type="text"
              name="name"
              value={user.name}
              onChange={handleChange}
              className="w-full p-2 border rounded-lg"
              placeholder="Nom de l'utilisateur"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#1C1C1C]">Email</label>
            <input
              type="email"
              name="email"
              value={user.email}
              onChange={handleChange}
              className="w-full p-2 border rounded-lg"
              placeholder="Email de l'utilisateur"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#1C1C1C]">Rôle</label>
            <select
              name="role"
              value={user.role}
              onChange={handleChange}
              className="w-full p-2 border rounded-lg"
            >
              <option value="organizer">Organisateur</option>
              <option value="participant">Participant</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full bg-[#1C1C1C] text-[#EAD7A2] py-2 rounded-lg hover:bg-[#8B5E3B]"
          >
            Ajouter
          </button>
        </form>
      </div>
    </div>
  );
}
