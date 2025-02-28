"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import mboalogo from "../../../public/Images/Mboa_event.png";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Event } from "@/lib/models";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useRouter } from "next/navigation";

const page = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/event/events/");
        if (!response.ok)
          throw new Error("Erreur lors de la récupération des événements");

        const data: Event[] = await response.json();
        console.log("data : ", data);
        setEvents(data);
      } catch (error) {
        console.error("Erreur:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const router = useRouter();
  const goTo = (event_id: any) => {
    router.push(`/interface/events/?event_id=${event_id}`);
  };
  return (
    <main className="grid">
      <section className="welcome flex justify-center text-center items-center">
        <span className="text-[40px] font-[1000] p-[64px]">
          {" "}
          Gérez, planifiez et promouvez vos événements en toute simplicité.
          Promoteur ou participant, vivez des expériences inoubliables avec nous
          !
        </span>
      </section>
      <section className="search-section shadow-md mx-auto w-[80%] mb-[64px] flex justify-center text-center items-center ">
        <div className="flex flex-row w-full h-12 justify-center items-center flex-nowrap gap-1.5 bg-white">
          <Input
            type="text"
            id="eventname"
            className="focus:outline-none border-white"
            placeholder="Rechercher..."
          />
          <Input
            type="text"
            id="place"
            className="focus:outline-none border-white"
            placeholder="Lieu..."
          />
          <Select>
            <SelectTrigger className="w-[180px] focus:outline-none border-white">
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Event category</SelectLabel>
                <SelectItem value="apple">Anniversaire</SelectItem>
                <SelectItem value="banana">Mariage</SelectItem>
                <SelectItem value="blueberry">Njoka</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </section>
      <section className="event-list flex justify-center items-center w-[90%] mb-4 mx-auto">
        <div className="w-full grid grid-cols-[repeat(auto-fit,minmax(288px,1fr))] ml-4 gap-y-2">
          {events.map((event) => {
            // Déterminer si l'événement est gratuit ou payant
            const isPaid = event.tickets.length > 1 ? "PAYANT" : "GRATUIT";

            // Extraire la ville depuis le premier élément des adresses (avant la virgule)
            const city =
              event.addresses.length > 0
                ? event.addresses[0].name.split(",")[0]
                : "Lieu inconnu";

            // Formatter la date de création
            const formattedDate = new Date(event.created_at).toLocaleDateString(
              "fr-FR",
              {
                day: "numeric",
                month: "long",
                year: "numeric",
              }
            );

            return (
              <div
                key={event.id}
                onClick={()=>goTo(event.id)}
                className="relative cursor-pointer flex flex-col bg-white shadow-sm border border-slate-200 rounded-lg w-72"
              >
                <div className="relative h-56 m-1 overflow-hidden text-white rounded-md">
                  <Image
                    src={`http://127.0.0.1:8000${event.cover_image}`}
                    className="object-contain"
                    fill
                    alt={event.name}
                  />
                </div>
                <div className="p-1">
                  <div className="flex flex-row flex-wrap gap-1">
                    <div className="mb-1 rounded-[5px] py-0.5 px-2.5 border border-transparent text-xs text-[#1a4162] transition-all shadow-sm w-auto text-center">
                      #{event.category.toUpperCase()}
                    </div>
                    <div className="mb-1 rounded-[5px] bg-orange-600 py-0.5 px-2.5 border border-transparent text-xs text-white transition-all shadow-sm w-auto text-center">
                      {isPaid}
                    </div>
                  </div>
                  <h6 className="mb-1 text-slate-800 text-xl font-semibold">
                    {event.name}
                  </h6>
                  <p className="text-slate-600 leading-normal font-light">
                    {city}
                  </p>
                </div>

                <div className="flex items-center justify-between p-4">
                  <div className="flex items-center">
                    <img
                      alt={event.organizer_name}
                      src="https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-1.2.1&amp;ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&amp;auto=format&amp;fit=crop&amp;w=1480&amp;q=80"
                      className="relative inline-block h-8 w-8 rounded-full"
                    />
                    <div className="flex flex-col ml-3 text-sm">
                      <span className="text-slate-800 font-semibold">
                        {event.organizer_name}
                      </span>
                      <span className="text-slate-600">{formattedDate}</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </main>
  );
};

export default page;
