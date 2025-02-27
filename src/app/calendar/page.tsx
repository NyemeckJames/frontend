/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect } from "react";
import {formatDate,DateSelectArg,EventClickArg,EventApi,} from "@fullcalendar/core";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import {Dialog,DialogContent,DialogHeader,DialogTitle,} from "@/components/ui/dialog";

interface Evenement { 
  id: number;
  titre: string;
  description: string;
  date_heure: string; // ISO 8601 string
  lieu: string;
  latitude: number;
  longitude: number;
  capacite_max: number;
  prix: number;
  date_creation: string;
  organisateur: number;
  billets_disponibles: number;
  photo: string | null;
  evenementLibre: boolean; // true = Gratuit, false = Payant
  organisateur_nom: string;
}
const Calendar: React.FC = () => {
  const [currentEvents, setCurrentEvents] = useState<EventApi[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [newEventTitle, setNewEventTitle] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<DateSelectArg | null>(null);
  const [events, setEvents] = useState<any>([]);
  const [selectedEvent, setSelectedEvent] = useState<Evenement | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const token = localStorage.getItem("token");
  
        if (!token) {
          alert("Veuillez vous reconnecter.");
          return;
        }
  
        const response = await fetch("http://localhost:8000/evenements/my-events/", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
  
        if (!response.ok) throw new Error("Erreur API");
  
        const data: Evenement[] = await response.json();
        
        // Adapter les événements au format FullCalendar
        const formattedEvents = data.map(event => ({
          id: event.id.toString(),
          title: event.titre,
          start: event.date_heure,
          date_heure: event.date_heure,
          allDay: true,
          lieu : event.lieu,
          organisateur_nom : event.organisateur_nom,
          billets_disponibles : event.billets_disponibles,
          titre : event.titre

        }));
  
        setEvents(formattedEvents);
      } catch (error) {
        console.error("Erreur lors de la récupération des événements :", error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchEvents();
  }, []);

  useEffect(() => {
    // Save events to local storage whenever they change
    if (typeof window !== "undefined") {
      localStorage.setItem("events", JSON.stringify(currentEvents));
    }
  }, [currentEvents]);

  const handleDateClick = (selected: DateSelectArg) => {
    setSelectedDate(selected);
    setIsDialogOpen(true);
  };

  const handleEventClick = (clickInfo: EventClickArg) => {
    console.log("Selected event : ", clickInfo.event._def.publicId)
    console.log("Events : ", events)
    const event = events.find((e:any) => e.id === clickInfo.event._def.publicId);
    console.log(" Event : ", event)
    if (event) {
      setSelectedEvent(event);
    }
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setNewEventTitle("");
  };

  const handleAddEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (newEventTitle && selectedDate) {
      const calendarApi = selectedDate.view.calendar; // Get the calendar API instance.
      calendarApi.unselect(); // Unselect the date range.

      const newEvent = {
        id: `${selectedDate.start.toISOString()}-${newEventTitle}`,
        title: newEventTitle,
        start: selectedDate.start,
        end: selectedDate.end,
        allDay: selectedDate.allDay,
      };

      calendarApi.addEvent(newEvent);
      handleCloseDialog();
    }
  };

  return (
    <div>
      <div className="flex w-full px-10 justify-start items-start gap-8">
      <div className="w-3/12">
        <div className="py-10 text-2xl font-extrabold px-7">
          Calendrier de vos événements
        </div>

        {loading ? (
          <div className="text-center text-gray-500 italic">Chargement des événements...</div>
        ) : events.length === 0 ? (
          <div className="italic text-center text-gray-400">
            Aucun événement à venir
          </div>
        ) : (
          <ul className="space-y-4">
            {events.map((event:any) => (
              <li
                key={event.id}
                className="border border-gray-200 shadow px-4 py-2 rounded-md text-blue-800"
              >
                <span className="font-bold">{event.title}</span>
                <br />
                <span className="text-slate-950">
                  {new Date(event.start).toLocaleDateString("fr-FR", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    weekday: "long",
                  })}
                </span>
                <br />
                <span className="text-gray-600">📍 {event.lieu}</span>
                <br />
                <span className="text-gray-600">🎟️ Billets restants : {event.billets_disponibles}</span>
              </li>
            ))}
          </ul>
        )}
      </div>


        <div className="w-9/12 mt-8">
        <FullCalendar
          height={"85vh"}
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          headerToolbar={{
            left: "prev,next today",
            center: "title",
            right: "dayGridMonth,timeGridWeek,timeGridDay,listWeek",
          }}
          initialView="dayGridMonth"
          editable={true} 
          selectable={true} 
          dayMaxEvents={true}
          events={events} // Utiliser les événements récupérés depuis l’API
          eventClick={handleEventClick} // Afficher les détails de l’événement
        />
        </div>
      </div>

      {/* Dialog for adding new events */}
      {selectedEvent && (
        <Dialog open={!!selectedEvent} onOpenChange={() => setSelectedEvent(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{selectedEvent.titre}</DialogTitle>
            </DialogHeader>
            <p><strong>Lieu :</strong> {selectedEvent.lieu}</p>
            <p><strong>Date : </strong> 
            {new Date(selectedEvent.date_heure).toLocaleDateString("fr-FR", {
                    weekday: "long",
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                  })}</p>
            <p><strong>Organisateur :</strong> {selectedEvent.organisateur_nom}</p>
            <p><strong>Billets restants :</strong> {selectedEvent.billets_disponibles}</p>
            <button className="bg-blue-500 text-white p-2 rounded-md mt-3">Télécharger mon billet</button>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default Calendar; 
 