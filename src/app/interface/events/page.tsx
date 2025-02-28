"use client";
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { FaFacebook, FaLinkedin } from "react-icons/fa";
import Image from "next/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Event } from "@/lib/models";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

const page = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const event_id = searchParams.get("event_id");
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;

  useEffect(() => {
    if (!event_id) return;

    const fetchEvent = async () => {
      try {
        const response = await fetch(
          `http://127.0.0.1:8000/event/events/${event_id}/`
        );
        if (!response.ok) throw new Error("Événement introuvable");

        const data: Event = await response.json();

        setEvent(data);
        console.log("event sinle : ", data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [event_id]);
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <AiOutlineLoading3Quarters className="text-4xl text-blue-500 animate-spin" />
      </div>
    );
  }
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6 bg-gray-50 min-h-screen">
      {/* Section Galerie */}
      <section className="bg-white shadow-md rounded-lg p-6 flex flex-col items-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Galerie Photo</h2>
        <div className="w-full max-w-md">
          {event?.gallery && event.gallery.length > 0 ? (
            <Carousel>
              <CarouselContent>
                {event.gallery.map((image, index) => (
                  <CarouselItem key={index}>
                    <Image
                      src={`http://127.0.0.1:8000${image}`}
                      alt={`Gallery image ${index + 1}`}
                      width={500}
                      height={300}
                      className="rounded-lg"
                    />
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          ) : (
            <Image
              src={`http://127.0.0.1:8000${event?.cover_image}`}
              alt="Cover image"
              width={500}
              height={300}
              className="rounded-lg"
            />
          )}
        </div>
        <h3 className="text-lg font-semibold text-gray-700 mt-8 mb-3">Vidéo de présentation</h3>
        <div className="w-full max-w-md mt-6">
          {event?.promo_video ? (
            <video controls className="w-full rounded-lg shadow-md max-h-[300px]">
              <source src={`http://127.0.0.1:8000${event.promo_video}`} type="video/mp4" />
              Votre navigateur ne supporte pas la lecture de vidéos.
            </video>
          ) : (
            <p className="text-gray-500">Aucune vidéo disponible</p>
          )}
        </div>
        <div className="mt-4 flex space-x-4">
          <button className="bg-[#002c51] flex flex-row justify-center items-center text-white px-4 py-2 shadow-md hover:bg-[#004151] transition">
            Ajouter au calendrier <i className="material-icons">event</i>
          </button>
          <button className="bg-green-600 flex flex-row justify-center items-center text-white px-4 py-2 shadow-md hover:bg-green-700 transition">
            Reserver <i className="material-icons">chevron_right</i>
          </button>
        </div>
      </section>

      {/* Section Description */}
      <section className="bg-white shadow-md rounded-lg p-6">
        <h1 className="text-2xl font-bold text-gray-800">{event?.name}</h1>
        <span className="mt-2 inline-block bg-blue-200 text-blue-800 text-sm px-3 py-1 rounded-full">{event?.category}</span>
        <div className="mt-4 flex flex-wrap gap-2">
          {event?.tags.map((tag, index) => (
            <span key={index} className="bg-gray-200 text-gray-700 text-xs px-2 py-1 rounded-full">#{tag}</span>
          ))}
        </div>
        <div className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-3 mt-6 text-gray-700">
          <span className="font-semibold text-right">Date de début :</span>
          <span>{event?.start_datetime}</span>
          <span className="font-semibold text-right">Date de fin :</span>
          <span>{event?.end_datetime || "Non précisé"}</span>
          <span className="font-semibold text-right">Capacité :</span>
          <span>{event?.capacity}</span>
        </div>
        <div className="mt-6 border-t border-gray-200 pt-4 max-h-60 overflow-y-auto text-gray-600 text-sm leading-relaxed">
          <p>{event?.description}</p>
        </div>

        {/* Tickets */}
        <div className="mt-6 border-t border-gray-200 pt-4">
          <h3 className="text-lg font-semibold text-gray-700 mb-3">Tickets</h3>
          <ul>
            {event?.tickets.map((ticket) => (
              <li key={ticket.id} className="flex justify-between text-gray-700">
                <span>{ticket.name}</span>
                <span className="text-green-600 font-bold">{ticket.price} XAF</span>
                <span>{ticket.quantity > 0 ? `Dispo: ${ticket.quantity}` : "Épuisé"}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Intervenants */}
        <div className="mt-6 border-t border-gray-200 pt-4">
          <h3 className="text-lg font-semibold text-gray-700 mb-3">Intervenants</h3>
          <ul>
            {event?.speakers.map((speaker) => (
              <li key={speaker.id} className="flex items-center gap-3 text-gray-700">
                {speaker.photo && (
                  <Image src={`http://127.0.0.1:8000${speaker.photo}`} alt={speaker.name} width={40} height={40} className="rounded-full" />
                )}
                <div>
                  <p className="font-semibold">{speaker.name}</p>
                  <p className="text-sm text-gray-500 flex items-center gap-2">{speaker.occupation}
                    { <a href={speaker.facebook} target="_blank" className="text-blue-600"><FaFacebook /></a>}
                    {speaker.linkedin && <a href={speaker.linkedin} target="_blank" className="text-blue-600"><FaLinkedin /></a>}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Localisation */}
        <div className="mt-6 border-t border-gray-200 pt-4">
          <h3 className="text-lg font-semibold text-gray-700 mb-3">Localisation</h3>
          {event?.addresses.map((address, index) => {
            const shortName = address.name.split(",")[0];
            return (
              <div key={index} className="mb-4">
                <p className="font-semibold">{shortName} - {address.additional_contact_name} ({address.additional_contact_phone})</p>
                <iframe className="w-full h-64 rounded-lg overflow-hidden shadow-md" src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyCOp9q4unlnaquuzukgUWvhtUUY9hmAo1M&q=${address.latitude},${address.longitude}`} allowFullScreen loading="lazy"></iframe>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};

export default page;
