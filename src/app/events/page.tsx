import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const page = () => {
  const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6 bg-gray-50 min-h-screen">
      {/* Section Galerie */}
      <section className="bg-white shadow-md rounded-lg p-6 flex flex-col items-center">
        {/* Titre de la section */}
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Galerie Photo</h2>
        {/* Carousel */}
        <div className="w-full max-w-md">
          <Carousel>
            <CarouselContent>
              {Array.from({ length: 5 }).map((_, index) => (
                <CarouselItem key={index}>
                  <div className="p-1">
                    <Card>
                      <CardContent className="flex relative w-full h-full aspect-square items-center justify-center p-6">
                        <Image
                          src="http://127.0.0.1:8000/media/evenements/Goku.jpg"
                          className="object-contain rounded-lg"
                          fill
                          alt="Event image"
                        />
                      </CardContent>
                    </Card>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </div>

        {/* Titre de la vidéo */}
        <h3 className="text-lg font-semibold text-gray-700 mt-8 mb-3">
          Vidéo de présentation de l'événement
        </h3>

        {/* Vidéo de présentation */}
        <div className="w-full max-w-md mt-6">
          <video controls className="w-full rounded-lg shadow-md">
            <source
              src="http://127.0.0.1:8000/media/videos/event-video.mp4"
              type="video/mp4"
            />
            Votre navigateur ne supporte pas la lecture de vidéos.
          </video>
        </div>

        {/* Boutons d'action */}
        <div className="mt-4 flex space-x-4">
          <button className="bg-[#002c51] flex flex-row justify-center items-center text-white px-4 py-2 shadow-md hover:bg-[#004151] transition">
            Ajouter au calendrier
            <i className="material-icons">event</i>
          </button>
          <button className="bg-green-600 flex flex-row justify-center items-center text-white px-4 py-2 shadow-md hover:bg-green-700 transition">
            Participer
            <i className="material-icons">chevron_right</i>
          </button>
        </div>
      </section>

      {/* Section Description */}
      <section className="bg-white shadow-md rounded-lg p-6">
        {/* Nom et catégorie */}
        <div className="flex justify-between items-center">
          <span className="text-xl font-bold text-gray-800">
            Website Review Check
          </span>
          <span className="bg-blue-100 text-blue-700 text-sm px-3 py-1 rounded-full">
            #CONFERENCE
          </span>
        </div>

        {/* Informations clés */}
        <div className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-3 mt-6 text-gray-700">
          <span className="font-semibold text-right">Date de début :</span>{" "}
          <span>25/02/2025 à 10:00 UTC+1</span>
          <span className="font-semibold text-right">Date de fin :</span>{" "}
          <span>25/02/2025 à 20:00 UTC+1</span>
          <span className="font-semibold text-right">Lieu :</span>{" "}
          <span>En ligne</span>
          <span className="font-semibold text-right">Participation :</span>{" "}
          <span>70/85</span>
          <span className="font-semibold text-right">
            Prix de l'entrée :
          </span>{" "}
          <span className="text-green-600 font-bold">20 000 XAF</span>
        </div>

        {/* Description avec scrollbar */}
        <div className="mt-6 border-t border-gray-200 pt-4 max-h-60 overflow-y-auto text-gray-600 text-sm leading-relaxed space-y-3 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
          <p>
            Because it's about motivating the doers. Because I'm here to follow
            my dreams and inspire others. Here is some additional text to test
            the scrolling feature. Imagine this is a long article that you can
            scroll through.
          </p>
          <p>
            More text to fill the space, as we continue to check how scroll
            behaves. The card's content should now be scrollable. Test it out!
          </p>
          <p>
            Because it's about motivating the doers. Because I'm here to follow
            my dreams and inspire others. Here is some additional text to test
            the scrolling feature. Imagine this is a long article that you can
            scroll through.
          </p>
          <p>
            More text to fill the space, as we continue to check how scroll
            behaves. The card's content should now be scrollable. Test it out!
          </p>
        </div>

        {/* Infos organisateur */}
        <div className="mt-6 border-t border-gray-200 pt-4 flex items-center justify-between">
          <div>
            <p className="font-semibold text-gray-800">Organisateur :</p>
            <p className="text-gray-700">James Romaric</p>
            <p className="text-gray-500 text-sm">jamesromaric@gmail.com</p>
          </div>
          <div className="w-20 h-20 bg-gray-200 rounded-lg flex items-center justify-center">
            <span className="text-gray-500 text-xs">QR Code</span>
          </div>
        </div>

        {/* Localisation Google Maps */}
        <div className="mt-6 border-t border-gray-200 pt-4">
            <h3 className="text-lg font-semibold text-gray-700 mb-3">Localisation de l’événement</h3>
            <div className="w-full h-64 rounded-lg overflow-hidden shadow-md">
            <iframe
                className="w-full h-full"
                src={`https://www.google.com/maps/embed/v1/place?key=${GOOGLE_API_KEY}&q=Yaoundé,Cameroun`}
                allowFullScreen
                loading="lazy"
            />
            </div>
        </div>
      </section>
    </div>
  );
};

export default page;
