"use client";

import { useState } from "react";

interface Notification {
  id: string;
  message: string;
  date: string; // Format YYYY-MM-DD
}

export default function Notifications() {
  const [notifications] = useState<Notification[]>([
    { id: "1", message: "Rappel : Concert Jazz demain !", date: "2024-06-14" },
    { id: "2", message: "Hackathon Tech dans 3 jours !", date: "2024-07-07" },
  ]);

  return (
    <div className="flex flex-col items-center min-h-screen p-6 bg-gray-100">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Notifications</h1>
      
      <div className="bg-white shadow-lg p-6 rounded-lg w-full max-w-lg">
        {notifications.length > 0 ? (
          notifications.map(notification => (
            <div key={notification.id} className="p-4 border-b border-gray-200">
              <p className="text-gray-900">{notification.message}</p>
              <span className="text-gray-500 text-sm">{notification.date}</span>
            </div>
          ))
        ) : (
          <p className="text-gray-500">Aucune notification pour linstant.</p>
        )}
      </div>
    </div>
  );
}
