"use client";

import { useState } from "react";

interface User {
  id: string;
  name: string;
  email: string;
  role: "organizer" | "participant";
}

export default function ListeUtilisateurs() {
  // Exemple de données (à remplacer par une API plus tard)
  const [users, setUsers] = useState<User[]>([
    { id: "1", name: "Alice Dupont", email: "alice@example.com", role: "organizer" },
    { id: "2", name: "Bob Martin", email: "bob@example.com", role: "participant" },
    { id: "3", name: "Charlie Doe", email: "charlie@example.com", role: "participant" },
  ]);

  // Fonction pour supprimer un utilisateur
  const handleDelete = (userId: string) => {
    const confirmDelete = confirm("Voulez-vous vraiment supprimer cet utilisateur ?");
    if (confirmDelete) {
      const updatedUsers = users.filter(user => user.id !== userId);
      setUsers(updatedUsers);
      alert("Utilisateur supprimé avec succès !");
    }
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-[#1C1C1C] p-6">
      <h1 className="text-3xl font-bold mb-6 text-[#EAD7A2]">Liste des Utilisateurs</h1>

      <div className="bg-[#EAD7A2] shadow-lg p-6 rounded-lg w-full max-w-4xl">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-[#1C1C1C] text-[#EAD7A2]">
              <th className="p-2">Nom</th>
              <th className="p-2">Email</th>
              <th className="p-2">Rôle</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.length > 0 ? (
              users.map(user => (
                <tr key={user.id} className="border-b border-gray-300 text-center">
                  <td className="p-2">{user.name}</td>
                  <td className="p-2">{user.email}</td>
                  <td className="p-2">{user.role === "organizer" ? "Organisateur" : "Participant"}</td>
                  <td className="p-2">
                    <button
                      onClick={() => handleDelete(user.id)}
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-700"
                    >
                      Supprimer
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="p-4 text-center text-gray-500">
                  Aucun utilisateur trouvé.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
