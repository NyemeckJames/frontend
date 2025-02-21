"use client";

import withAuth from "@/app/component/WithAuth";
import { useEffect, useState } from "react";

interface User {
  id: string;
  name: string;
  email: string;
  role: "organizer" | "participant";
}

const ListeUtilisateurs = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem("token"); // Récupère le token du localStorage
        const response = await fetch("http://localhost:8000/users/get_all_users/", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`, // Ajout du token dans les headers
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Échec de la récupération des utilisateurs");
        }

        const data = await response.json();
        setUsers(data.users || []); // Stocke les utilisateurs dans le state
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // Fonction pour supprimer un utilisateur localement (simule la suppression)
  const handleDelete = (userId: string) => {
    const confirmDelete = confirm("Voulez-vous vraiment supprimer cet utilisateur ?");
    if (confirmDelete) {
      const updatedUsers = users.filter((user) => user.id !== userId);
      setUsers(updatedUsers);
      alert("Utilisateur supprimé avec succès !");
    }
  };

  return (
    <div className="flex flex-col items-center min-h-screen p-6">
      <h1 className="text-3xl font-bold mb-6 text-[#1A4162]">Liste des Utilisateurs</h1>

      <div className="bg-[#fff] shadow-lg p-6 rounded-lg w-full max-w-4xl">
        {loading ? (
          <p className="text-center text-gray-500">Chargement des utilisateurs...</p>
        ) : error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : (
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-[#fff] text-[#1A4162]">
                <th className="p-2">Nom</th>
                <th className="p-2">Email</th>
                <th className="p-2">Rôle</th>
                <th className="p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.length > 0 ? (
                users.map((user) => (
                  <tr key={user.id} className="border-b border-gray-300 text-center">
                    <td className="p-2">{user.name}</td>
                    <td className="p-2">{user.email}</td>
                    <td className="p-2">
                      {user.role === "organizer" ? "Organisateur" : "Participant"}
                    </td>
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
        )}
      </div>
    </div>
  );
};

export default withAuth(ListeUtilisateurs, ["ADMINISTRATEUR"]);
