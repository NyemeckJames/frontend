"use client";

import { useCallback, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Loader2, Upload, Trash2 } from "lucide-react";
import Dropzone from "react-dropzone";
import { z } from "zod";
import { eventSchema } from "@/lib/eventschema";
import { zodResolver } from "@hookform/resolvers/zod";
import DatePicker from "react-datepicker";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { formSteps } from "@/lib/eventschema";
import { useFieldArray, useFormContext } from "react-hook-form";
import "react-datepicker/dist/react-datepicker.css";
import { useToast } from "@/hooks/use-toast";
import Image from "next/image";
import DeliveryLocationModal from "./DeliveryLocationModal";


type Inputs = z.infer<typeof eventSchema>;

const steps = formSteps;

export default function Form() {
  const [formData, setFormData] = useState({});
  const [previousStep, setPreviousStep] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const [minTime, setMinTime] = useState("");

  const [preview, setPreview] = useState<string | null>(null);
  const [previews, setPreviews] = useState<(string | null)[]>([]);
  const delta = currentStep - previousStep;
  interface Location {
    latitude: number;
    longitude: number;
  }

  interface FormData {
    additional_contact_name: string;
    additional_contact_phone: string;
    delivery_track_id: string;
    location: Location;
    location_title: string;
    name: string;
  }

  const [formData1, setFormData1] = useState<FormData>({
    additional_contact_name: "",
    additional_contact_phone: "",
    delivery_track_id: "",
    location: { latitude: 0, longitude: 0 },
    location_title: "",
    name: "",
  });

  const {
    register,
    handleSubmit,
    watch,
    reset,
    trigger,
    getValues,
    control,
    setValue,
    formState: { errors },
  } = useForm<Inputs>({
    defaultValues: { tickets: [] },
    resolver: zodResolver(eventSchema),
  });
  const { fields, append, remove } = useFieldArray({
    control,
    name: "speakers",
  });
  const {
    fields: adressFields,
    append: appendAdress,
    remove: removeAdress,
  } = useFieldArray({
    control,
    name: "adress",
  });
  const {
    fields: galleryFields,
    append: appendGallery,
    remove: removeGallery,
  } = useFieldArray({
    control,
    name: "gallery",
  });
  const {
    fields: ticketsFields,
    append: appendTickets,
    remove: removeTickets,
  } = useFieldArray({
    control,
    name: "tickets",
  });

  const [previewVideo, setPreviewVideo] = useState<string | null>(null);
  const { toast } = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => {
    // Réinitialisation des valeurs de formData1 à chaque ouverture de la modal
    setFormData1({
      additional_contact_name: "",
      additional_contact_phone: "",
      delivery_track_id: "",
      location: { latitude: 0, longitude: 0 },
      location_title: "",
      name: "",
    });
    setIsModalOpen(true);
  }
  const closeModal = () => {
    setIsModalOpen(false);
    console.log("Formdata 1 : ", formData1)
  }
  const saveAddress = () => {
    // Mettre à jour les adresses en fonction des données reçues du modal
    const newAddress = {
      additional_contact_name: formData1.additional_contact_name,
      additional_contact_phone: formData1.additional_contact_phone,
      delivery_track_id: formData1.delivery_track_id,
      location: formData1.location,
      location_title: formData1.location_title,
      name: formData1.name,
    };

    appendAdress(newAddress); // Ajouter l'adresse au tableau
    console.log('Nouvelles données d\'adresse : ', newAddress);
    closeModal()
  }

  const imageFile = watch("coverImage");
  useEffect(() => {
    if (imageFile && imageFile.length > 0) {
      const file = imageFile[0];
      const previewUrl = URL.createObjectURL(file);
      setPreview(previewUrl);

      // Nettoyer l'URL quand le composant est démonté
      return () => URL.revokeObjectURL(previewUrl);
    }
  }, [imageFile]);

  useEffect(() => {
    const files = watch("gallery");
    if (files) {
      const previewUrls = files.map((fileList) =>
        fileList && fileList.length > 0
          ? URL.createObjectURL(fileList[0])
          : null
      );
      setPreviews(previewUrls);

      // Nettoyer les URLs pour éviter les fuites mémoire
      return () =>
        previewUrls.forEach((url) => url && URL.revokeObjectURL(url));
    }
  }, [watch("gallery")]);

  const hashtags = watch("tags") || [];

  const processForm: SubmitHandler<Inputs> = (data) => {
    console.log(data);
    reset();
  };

  const onSubmitPersonnal = async () => {
    const values = getValues();
    console.log("Values du formulaire : ", values);
    const formData = new FormData();

    // Ajout des champs texte sans doublons
    Object.entries(values).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        const uniqueValues = [...new Set(value)]; // 🔥 Supprime les doublons

        uniqueValues.forEach((item, index) => {
          if (typeof item === "object" && item !== null) {
            Object.entries(item).forEach(([subKey, subValue]) => {
              if (subKey === "location") {
                formData.append(`${key}[${index}][${subKey}]`, JSON.stringify(subValue));
              } else {
                formData.append(`${key}[${index}][${subKey}]`, subValue as string);
              }
            });
          } else {
            formData.append(`${key}[${index}]`, item as string);
          }
        });
      } else {
        formData.append(key, value as string);
      }
    });

    // Gestion des fichiers sans doublons
    if (values.coverImage?.length > 0) {
      formData.append("coverImage", values.coverImage[0]); // ✅ Prend le premier fichier
    }

    if (values.promoVideo?.length > 0) {
      formData.append("promoVideo", values.promoVideo[0]); // ✅ Prend le premier fichier
    }

    if (values.gallery?.length > 0) {
      values.gallery.forEach((fileList: FileList, index: number) => {
        const uniqueFiles = Array.from(new Set(fileList)); // 🔥 Supprime les doublons
        uniqueFiles.forEach((file, fileIndex) => {
          formData.append(`gallery[${index}][${fileIndex}]`, file);
        });
      });
    }

    if (values.speakers?.length && values.speakers?.length > 0) {
      values.speakers.forEach((speaker, index) => {
        Object.entries(speaker).forEach(([subKey, subValue]) => {
          if (subKey === "photo" && subValue.length > 0) {
            formData.append(`speakers[${index}][photo]`, subValue[0]); // ✅ Prend le premier fichier
          } else {
            formData.append(`speakers[${index}][${subKey}]`, subValue as string);
          }
        });
      });
    }

    // Envoi de la requête
    try {
      const response = await fetch("http://127.0.0.1:8000/event/create/", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Erreur lors de la création de l'événement");
      }

      const data = await response.json();
      console.log("Événement créé avec succès :", data);
    } catch (error) {
      console.error("Erreur:", error);
    }
  };


  useEffect(() => {
    // Obtenir l'heure actuelle en format "HH:MM"
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, "0");
    const minutes = now.getMinutes().toString().padStart(2, "0");
    setMinTime(`${hours}:${minutes}`);
  }, []);

  type FieldName = keyof Inputs;
  const validateStep4 = () => {
    const values = getValues();
    const ticketOpenDate = values.ticketOpenDate;
    const ticketCloseDate = values.ticketCloseDate;
    const tickets = values.tickets || [];
    const startDate = values.startDateTime;
    const capacityMax = values.capacity
    const totalTickets = tickets.reduce((sum, t) => sum + (t.quantity || 0), 0);


    if (ticketOpenDate && new Date(ticketOpenDate) > new Date(startDate)) {
      toast({
        description: "La date d'ouverture des ventes ne peut pas être après la date de début de l'événement !",
        variant: "warning",
        duration: 3000,
      });
      return false;
    }
    if (ticketCloseDate && new Date(ticketCloseDate) > new Date(startDate)) {
      toast({
        description: "La date de fermeture des ventes ne peut pas être après la date de début de l'événement !",
        variant: "warning",
        duration: 3000,
      });
      return false
    }



    if (ticketOpenDate && ticketCloseDate && ticketCloseDate < ticketOpenDate) {
      toast({ description: "La date de fermeture doit être après la date d'ouverture !", variant: "warning", duration: 3000 });
      return false;
    }
    if (totalTickets > capacityMax) {
      toast({
        description: "Le nombre total de billets ne peut pas dépasser la capacité maximale !",
        variant: "warning",
        duration: 3000,
      });
      return false;
    }
    // Complétion automatique des billets gratuits si nécessaire
    if (totalTickets < capacityMax && tickets.length > 0) {
      tickets.push({ name: "Billet gratuit", price: 0, quantity: capacityMax - totalTickets });
    }

    return true;
  };
  const next = async () => {
    const fields = steps[currentStep].fields;

    const output = await trigger(fields as unknown as FieldName[], {
      shouldFocus: true,
    });
    const step4Validate = validateStep4();
    if (!step4Validate) return;

    if (!output) return;

    // Récupération des valeurs
    const values = getValues();
    const startDate = values.startDateTime ? new Date(values.startDateTime) : null;
    const endDate = values.endDateTime ? new Date(values.endDateTime) : null;
    const now = new Date();


    // Vérifications et alertes
    if (startDate && isNaN(startDate.getTime())) {
      toast({
        description: "La date de début requise  !",
        variant: "warning",
        duration: 3000,
      })
      return;
    }
    if (startDate && startDate < now) {
      toast({
        description: "La date de début ne peut pas être dans le passé  !",
        variant: "warning",
        duration: 3000,
      })
      return;
    }

    if (startDate && endDate && endDate < startDate) {
      toast({
        description: "La date de fin ne peut pas être avant la date de début !",
        variant: "warning",
        duration: 3000,
      })

      return;
    }
    setFormData((prev) => ({ ...prev, ...getValues() }));
    console.log(
      "Données du formulaire à l'étape",
      currentStep + 1,
      getValues()
    );

    if (currentStep < steps.length - 1) {
      setPreviousStep(currentStep);
      setCurrentStep((step) => step + 1);
    }
  };


  const prev = () => {
    if (currentStep > 0) {
      setPreviousStep(currentStep);
      setCurrentStep((step) => step - 1);
    }
  };
  //Gerer le input de hashtag
  const [inputValue, setInputValue] = useState("");

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && inputValue.trim() !== "") {
      e.preventDefault();
      if (!hashtags.includes(inputValue.trim())) {
        setValue("tags", [...hashtags, inputValue.trim()], { shouldValidate: true });
      }
      setInputValue("");
    }
  };

  const removeTag = (tag: string) => {
    setValue("tags", hashtags.filter((t: string) => t !== tag), { shouldValidate: true });
  };

  return (
    <section className="inset-0 flex p-24">
      <nav className="w-1/4 flex flex-col space-y-4">
        <ol role="list">
          {steps.map((step, index) => (
            <li key={step.name}>
              {currentStep > index ? (
                <div className="group flex flex-col border-l-4 border-sky-600 py-2 pl-4 transition-colors">
                  <span className="text-sm font-medium text-sky-600">{step.id}</span>
                  <span className="text-sm font-medium">{step.name}</span>
                </div>
              ) : currentStep === index ? (
                <div
                  className="flex flex-col border-l-4 border-sky-600 py-2 pl-4"
                  aria-current="step"
                >
                  <span className="text-sm font-medium text-sky-600">{step.id}</span>
                  <span className="text-sm font-medium">{step.name}</span>
                </div>
              ) : (
                <div className="group flex flex-col border-l-4 border-gray-200 py-2 pl-4 transition-colors">
                  <span className="text-sm font-medium text-gray-500">{step.id}</span>
                  <span className="text-sm font-medium">{step.name}</span>
                </div>
              )}
            </li>
          ))}
        </ol>
      </nav>

      {/* Form */}
      <form className="w-3/4 ml-8" onSubmit={handleSubmit(processForm)}>
        {currentStep === 0 && (
          <motion.div
            initial={{ x: delta >= 0 ? "50%" : "-50%", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <h2 className="text-base font-semibold leading-7 text-gray-900">
              Informations Générales
            </h2>
            <p className="mt-1 text-sm leading-6 text-gray-600">
              Renseignez les informations de base sur votre événement.
            </p>

            <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
              {/* Nom de l'événement */}
              <div className="sm:col-span-3">
                <label
                  htmlFor="name"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Nom de l’événement
                </label>
                <div className="mt-2">
                  <input
                    type="text"
                    id="name"
                    {...register("name")}
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6"
                  />
                  {errors.name?.message && (
                    <p className="mt-2 text-sm text-red-400">
                      {errors.name.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Catégorie */}
              <div className="sm:col-span-3">
                <label
                  htmlFor="category"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Catégorie
                </label>
                <div className="mt-2">
                  <select
                    id="category"
                    {...register("category")}
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6"
                  >
                    <option value="">Sélectionnez une catégorie</option>
                    <option value="Concert">Concert</option>
                    <option value="Conférence">Conférence</option>
                    <option value="Festival">Festival</option>
                    <option value="Atelier">Atelier</option>
                    <option value="Autre">Autre</option>
                  </select>
                  {errors.category?.message && (
                    <p className="mt-2 text-sm text-red-400">
                      {errors.category.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Description */}
              <div className="sm:col-span-6">
                <label
                  htmlFor="description"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Description
                </label>
                <div className="mt-2">
                  <textarea
                    id="description"
                    {...register("description")}
                    rows={3}
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6"
                  ></textarea>
                  {errors.description?.message && (
                    <p className="mt-2 text-sm text-red-400">
                      {errors.description.message}
                    </p>
                  )}
                </div>
              </div>

            </div>
          </motion.div>
        )}
        {currentStep === 1 && (
          <motion.div
            initial={{ x: delta >= 0 ? "50%" : "-50%", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <h2 className="text-base font-semibold leading-7 text-gray-900">
              Date et Heure
            </h2>
            <p className="mt-1 text-sm leading-6 text-gray-600">
              Renseignez la date et l'heure de début et de fin de votre événement.
            </p>

            <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
              {/* Date et heure de début */}
              <div className="sm:col-span-3">
                <label className="block text-sm font-medium leading-6 text-gray-900">
                  Date et heure de début
                </label>
                <input
                  type="datetime-local"
                  {...register("startDateTime", {
                    required: "La date et l'heure de début sont requises",
                    valueAsDate: true, // Convertit la valeur directement en objet Date
                  })}
                  min={new Date().toISOString().slice(0, 16)} // Empêche la sélection d'une date passée
                  className="mt-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-base sm:leading-6 p-3"
                />
              </div>

              {/* Date et heure de fin (optionnel) */}
              <div className="sm:col-span-3">
                <label className="block text-sm font-medium leading-6 text-gray-900">
                  Date et heure de fin (optionnel)
                </label>
                <input
                  type="datetime-local"
                  {...register("endDateTime", {
                    valueAsDate: true, // Stocke directement une Date
                    validate: (value) => {
                      if (!value) return true; // Si vide, pas d'erreur
                      const startDate = watch("startDateTime");
                      console.log("start date : ", startDate)
                      const endDate = new Date(value);
                      if (startDate && endDate < new Date(startDate)) {
                        return "La date de fin ne peut pas être avant la date de début.";
                      }
                      return true;
                    },
                  })}
                  min={watch("startDateTime") || new Date().toISOString().slice(0, 16)} // Bloque les dates avant le début
                  className="mt-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-base sm:leading-6 p-3"
                />
              </div>
            </div>
          </motion.div>
        )}
        {currentStep === 2 && (
          <motion.div
            initial={{ x: delta >= 0 ? "50%" : "-50%", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <h2 className="text-base font-semibold leading-7 text-gray-900">
              Lieu et Accessibilité
            </h2>
            <p className="mt-1 text-sm leading-6 text-gray-600">
              Indiquez où se déroulera votre événement.
            </p>

            <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-2 sm:grid-cols-6">
              {/* Pays */}
              <div className="sm:col-span-6">
                <label
                  htmlFor="country"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Pays
                </label>
                <div className="mt-2">
                  <input
                    type="text"
                    id="country"
                    {...register("country")}
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6"
                  />
                  {errors.country?.message && (
                    <p className="mt-2 text-sm text-red-400">
                      {errors.country.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Liste des adresses */}
              <div className="sm:col-span-6">
                <label className="block text-sm font-medium leading-6 text-gray-900">
                  Ajouter une addresse (Facultatif)
                </label>
                <div className="mt-2 space-y-4">
                  {adressFields.map((adress, index) => (
                    <div key={adress.id} className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                      {/* Affichage des informations de l'adresse */}
                      <div>
                        <p className="text-sm">{adress.additional_contact_name}</p>
                      </div>
                      <div>
                        <p className="text-sm">{adress.additional_contact_phone}</p>
                      </div>
                      <div>
                        <p className="text-sm">{adress.location_title}</p>
                      </div>

                      {/* Bouton de suppression */}
                      <button
                        type="button"
                        onClick={() => removeAdress(index)}
                        className="text-sm text-red-600 hover:text-red-800"
                      >
                        Supprimer
                      </button>
                    </div>
                  ))}
                </div>

                {/* Bouton d'ajout d'intervenant */}
                <button
                  type="button"
                  onClick={/*() => appendAdress({ city: "", location: "" })*/openModal}
                  className="mt-4 text-sm font-medium text-sky-600 hover:text-sky-800"
                >
                  + Ajouter une addresse
                </button>
                {isModalOpen && <DeliveryLocationModal formData={formData1} setFormData={setFormData1} closeModal={closeModal} saveAddress={saveAddress} />}
              </div>

              {/* Lien en ligne (optionnel) */}
              <div className="col-span-full">
                <label
                  htmlFor="onlineLink"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Lien en ligne (si événement virtuel)
                </label>
                <div className="mt-2">
                  <input
                    type="url"
                    id="onlineLink"
                    {...register("onlineLink")}
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6"
                  />
                  {errors.onlineLink?.message && (
                    <p className="mt-2 text-sm text-red-400">
                      {errors.onlineLink.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Capacité */}
              <div className="sm:col-span-2">
                <label
                  htmlFor="capacity"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Capacité maximale
                </label>
                <div className="mt-2">
                  <input
                    type="number"
                    id="capacity"
                    {...register("capacity", { valueAsNumber: true })}
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6"
                  />
                  {errors.capacity?.message && (
                    <p className="mt-2 text-sm text-red-400">
                      {errors.capacity.message}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}
        {currentStep === 3 && (
          <motion.div
            initial={{ x: delta >= 0 ? "50%" : "-50%", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <h2 className="text-base font-semibold leading-7 text-gray-900">
              Billetterie et Tarification
            </h2>
            <p className="mt-1 text-sm leading-6 text-gray-600">
              Définissez les modalités de billetterie pour votre événement.
            </p>

            <div className="mt-10 space-y-4">
              {/* Liste des types de billets */}
              {ticketsFields.length > 0 ? (
                ticketsFields.map((ticket, index) => (
                  <div key={ticket.id} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {/* Nom du billet */}
                    <div>
                      <input
                        type="text"
                        {...register(`tickets.${index}.name`)}
                        placeholder="Nom du type de billet"
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6"
                      />
                      {errors.tickets?.[index]?.name && (
                        <p className="mt-2 text-sm text-red-400">{errors.tickets[index].name.message}</p>
                      )}
                    </div>

                    {/* Prix du billet */}
                    <div>
                      <input
                        type="number"
                        {...register(`tickets.${index}.price`, { valueAsNumber: true })}
                        placeholder="Prix (en XAF)"
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6"
                      />
                      {errors.tickets?.[index]?.price && (
                        <p className="mt-2 text-sm text-red-400">{errors.tickets[index].price.message}</p>
                      )}
                    </div>
                    {/* Quantité de billets disponibles */}
                    <div>
                      <input
                        type="number"
                        {...register(`tickets.${index}.quantity`, { valueAsNumber: true })}
                        placeholder="Nombre de billets"
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6"
                      />
                      {errors.tickets?.[index]?.price && (
                        <p className="mt-2 text-sm text-red-400">{errors.tickets[index].price.message}</p>
                      )}
                    </div>

                    {/* Bouton de suppression */}
                    <button
                      type="button"
                      onClick={() => removeTickets(index)}
                      className="text-sm text-red-600 hover:text-red-800"
                    >
                      Supprimer
                    </button>
                  </div>
                ))
              ) : (
                <p className="text-gray-600">Tous les billets seront gratuits par défaut.</p>
              )}

              {/* Bouton d'ajout de billet */}
              <button
                type="button"
                onClick={() => appendTickets({ name: "", price: 1, quantity: 1 })}
                className="text-sm font-medium text-sky-600 hover:text-sky-800"
              >
                + Ajouter un type de billet
              </button>

              {/* Date d'ouverture des billets */}
              <div className="sm:col-span-3">
                <label className="block text-sm font-medium leading-6 text-gray-900">
                  Date d'ouverture de vente des billets
                </label>
                <input
                  type="date"
                  {...register("ticketOpenDate")}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6"
                />
                {errors.ticketOpenDate?.message && (
                  <p className="mt-2 text-sm text-red-400">{errors.ticketOpenDate.message}</p>
                )}
              </div>

              {/* Date de fermeture des billets */}
              <div className="sm:col-span-3">
                <label className="block text-sm font-medium leading-6 text-gray-900">
                  Date de fermeture de vente des billets
                </label>
                <input
                  type="date"
                  {...register("ticketCloseDate")}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6"
                />
                {errors.ticketCloseDate?.message && (
                  <p className="mt-2 text-sm text-red-400">{errors.ticketCloseDate.message}</p>
                )}
              </div>
            </div>
          </motion.div>
        )}
        {currentStep === 4 && (
          <motion.div
            initial={{ x: delta >= 0 ? "50%" : "-50%", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <h2 className="text-base font-semibold leading-7 text-gray-900">
              Intervenants et Organisateurs
            </h2>
            <p className="mt-1 text-sm leading-6 text-gray-600">
              Ajoutez les informations sur l'organisateur et les intervenants de votre événement.
            </p>

            <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
              {/* Nom de l'organisateur */}
              <div className="sm:col-span-3">
                <label className="block text-sm font-medium leading-6 text-gray-900">
                  Nom de l'organisateur
                </label>
                <input
                  type="text"
                  id="organizerName"
                  {...register("organizerName")}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6"
                />
                {errors.organizerName?.message && (
                  <p className="mt-2 text-sm text-red-400">{errors.organizerName.message}</p>
                )}
              </div>

              {/* Contact de l'organisateur */}
              <div className="sm:col-span-3">
                <label className="block text-sm font-medium leading-6 text-gray-900">
                  Contact de l'organisateur (Email)
                </label>
                <input
                  type="email"
                  id="organizerContact"
                  {...register("organizerContact")}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6"
                />
                {errors.organizerContact?.message && (
                  <p className="mt-2 text-sm text-red-400">{errors.organizerContact.message}</p>
                )}
              </div>

              {/* Site web de l'organisateur (facultatif) */}
              <div className="sm:col-span-6">
                <label className="block text-sm font-medium leading-6 text-gray-900">
                  Site web de l'organisateur (facultatif)
                </label>
                <input
                  type="url"
                  id="organizerWebsite"
                  {...register("organizerWebsite")}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6"
                />
              </div>

              {/* Liste des intervenants */}
              <div className="sm:col-span-6">
                <label className="block text-sm font-medium leading-6 text-gray-900">
                  Intervenants (Facultatif)
                </label>
                <div className="mt-2 space-y-4">
                  {fields.map((speaker, index) => (
                    <div key={speaker.id} className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                      {/* Nom de l'intervenant */}
                      <div>
                        <input
                          type="text"
                          {...register(`speakers.${index}.name`)}
                          placeholder="Nom de l’intervenant"
                          className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6"
                        />
                        {errors.speakers?.[index]?.name && (
                          <p className="mt-2 text-sm text-red-400">
                            {errors.speakers[index].name.message}
                          </p>
                        )}
                      </div>

                      {/* Occupation actuelle */}
                      <div>
                        <input
                          type="text"
                          {...register(`speakers.${index}.occupation`)}
                          placeholder="Occupation actuelle"
                          className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6"
                        />
                      </div>

                      {/* Photo de l'intervenant (Input fichier) */}
                      <div>
                        <input
                          type="file"
                          accept="image/*"
                          {...register(`speakers.${index}.photo`)}
                          className="block w-full text-sm text-gray-900 border border-gray-300 rounded-md shadow-sm file:bg-sky-600 file:text-white file:rounded-md file:border-none file:py-2 file:px-4 file:cursor-pointer hover:file:bg-sky-700"
                        />
                      </div>

                      {/* Facebook */}
                      <div>
                        <input
                          type="url"
                          {...register(`speakers.${index}.facebook`)}
                          placeholder="Facebook (facultatif)"
                          className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6"
                        />
                      </div>

                      {/* LinkedIn */}
                      <div>
                        <input
                          type="url"
                          {...register(`speakers.${index}.linkedin`)}
                          placeholder="LinkedIn (facultatif)"
                          className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6"
                        />
                      </div>

                      {/* Bouton de suppression */}
                      <button
                        type="button"
                        onClick={() => remove(index)}
                        className="text-sm text-red-600 hover:text-red-800"
                      >
                        Supprimer
                      </button>
                    </div>
                  ))}
                </div>

                {/* Bouton d'ajout d'intervenant */}
                <button
                  type="button"
                  onClick={() => append({ name: "", occupation: "", photo: "", facebook: "", linkedin: "" })}
                  className="mt-4 text-sm font-medium text-sky-600 hover:text-sky-800"
                >
                  + Ajouter un intervenant
                </button>
              </div>
            </div>
          </motion.div>
        )}
        {currentStep === 5 && ( // Étape 6
          <motion.div
            initial={{ x: delta >= 0 ? "50%" : "-50%", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <h2 className="text-base font-semibold leading-7 text-gray-900">
              Contenu et Média
            </h2>
            <p className="mt-1 text-sm leading-6 text-gray-600">
              Ajoutez des images et des vidéos pour promouvoir votre événement.
            </p>

            <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
              {/* Image de couverture */}
              <div className="sm:col-span-6">
                <label className="block text-sm font-medium leading-6 text-gray-900">
                  Image de couverture
                </label>
                <div className="mt-2">
                  <input
                    type="file"
                    accept="image/*"
                    {...register("coverImage")}
                    className="mt-1 block w-full"
                  />
                  {preview && (
                    <div className="mt-2">
                      <p className="text-gray-600 text-sm">Aperçu :</p>
                      <img
                        src={preview}
                        alt="Prévisualisation"
                        className="w-32 h-32 object-cover mt-1 border rounded-md"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Galerie d'images */}
              <div className="sm:col-span-6">
                <label className="block text-sm font-medium leading-6 text-gray-900">
                  Galerie d'images
                </label>
                <div className="mt-2 space-y-2">
                  {galleryFields.map((image, index) => (
                    <div key={image.id} className="flex items-center gap-4">
                      <input
                        type="file"
                        accept="image/*"
                        {...register(`gallery.${index}`)}
                        className="block w-full"
                      />
                      {previews[index] && (
                        <img
                          src={previews[index] || ""}
                          alt={`Prévisualisation ${index + 1}`}
                          className="w-20 h-20 object-cover border rounded-md"
                        />
                      )}
                      <button
                        type="button"
                        onClick={() => removeGallery(index)}
                        className="text-sm text-red-600 hover:text-red-800"
                      >
                        Supprimer
                      </button>
                    </div>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={() => appendGallery({})}
                  className="mt-2 text-sm font-medium text-sky-600 hover:text-sky-800"
                >
                  + Ajouter une image
                </button>
              </div>

              {/* Vidéo promotionnelle */}
              <div className="sm:col-span-6">
                <label className="block text-sm font-medium leading-6 text-gray-900">
                  Vidéo promotionnelle (facultatif)
                </label>
                <Controller
                  name="promoVideo"
                  control={control}
                  render={({ field: { onChange, value } }) => (
                    <div className="mt-2">
                      <input
                        type="file"
                        accept="video/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              onChange(file);
                              setPreviewVideo(URL.createObjectURL(file)); // Mise à jour de l'aperçu
                            }
                          }}
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6"
                      />

                      {value && typeof value === "object" && "name" in value && (
                        <div className="mt-2 relative">
                          <video src={previewVideo || ""} controls className="w-full max-w-md rounded-lg border" />
                          <button
                            type="button"
                            onClick={() => {
                              onChange(undefined);
                              setPreviewVideo(null);
                            }}
                            className="absolute top-2 right-2 bg-red-500 p-1 rounded-full"
                          >
                            Supprimer
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                />

              </div>
            </div>
          </motion.div>
        )}
        {currentStep === 6 && (
          <motion.div
            initial={{ x: delta >= 0 ? "50%" : "-50%", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <h2 className="text-base font-semibold leading-7 text-gray-900">
              Personnalisation et Paramètres
            </h2>
            <p className="mt-1 text-sm leading-6 text-gray-600">
              Ajoutez des tags pour mieux catégoriser votre événement et
              améliorer sa visibilité.
            </p>

            <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
              {/* Tags */}
              <div className="sm:col-span-6">
                <label
                  htmlFor="tags"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Tags
                </label>
                <div className="flex flex-wrap gap-2 border border-gray-300 rounded-md p-2 mt-2">
                  {hashtags.map((tag) => (
                    <span
                      key={tag}
                      className="flex items-center bg-sky-100 text-sky-700 px-2 py-1 rounded-md text-sm"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="ml-2 text-sky-900 hover:text-red-500"
                      >
                        ✕
                      </button>
                    </span>
                  ))}
                  <input
                    type="text"
                    id="tags"

                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Ajouter un hashtag..."
                    className="flex-1 border-none focus:ring-0 outline-none text-sm p-1"
                  />
                  {/* <input
                    type="text"
                    id="tags"
                    {...register("tags")}
                    onChange={handleTagsChange}
                    placeholder="Ex: Musique, Technologie, Art..."
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6"
                  /> */}
                  {errors.tags && (
                    <p className="mt-2 text-sm text-red-400">
                      {errors.tags.message as string}
                    </p>
                  )}
                </div>
                <p className="mt-2 text-sm text-gray-500">
                  Séparez les tags par des virgules.
                </p>
              </div>
            </div>
          </motion.div>
        )}
        {currentStep === 7 && (
          <motion.div
            initial={{ x: delta >= 0 ? "50%" : "-50%", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <h2 className="text-base font-semibold leading-7 text-gray-900">
              Marketing et Communication
            </h2>
            <p className="mt-1 text-sm leading-6 text-gray-600">
              Configurez les options de communication pour votre événement.
            </p>

            <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
              {/* Email de confirmation */}
              <div className="sm:col-span-6">
                <label
                  htmlFor="confirmationEmail"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Email de confirmation personnalisé
                </label>
                <div className="mt-2">
                  <textarea
                    id="confirmationEmail"
                    {...register("confirmationEmail")}
                    placeholder="Merci pour votre inscription ! Nous avons hâte de vous voir à l'événement."
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6"
                  />
                  {errors.confirmationEmail?.message && (
                    <p className="mt-2 text-sm text-red-400">
                      {errors.confirmationEmail.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Messages de rappel */}
              <div className="sm:col-span-6">
                <div className="flex items-center">
                  <input
                    id="reminderMessages"
                    type="checkbox"
                    {...register("reminderMessages")}
                    className="h-4 w-4 rounded border-gray-300 text-sky-600 focus:ring-sky-600"
                  />
                  <label
                    htmlFor="reminderMessages"
                    className="ml-3 block text-sm font-medium leading-6 text-gray-900"
                  >
                    Activer les messages de rappel automatisés
                  </label>
                </div>
              </div>
            </div>
          </motion.div>
        )}
        {currentStep === 8 && (
          <motion.div
            initial={{ x: delta >= 0 ? "50%" : "-50%", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <h2 className="text-base font-semibold leading-7 text-gray-900">
              Sécurité et Vérification
            </h2>
            <p className="mt-1 text-sm leading-6 text-gray-600">
              Paramétrez les options de sécurité et de vérification pour votre
              événement.
            </p>

            <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
              {/* QR Code pour l’entrée */}
              <div className="sm:col-span-6">
                <div className="flex items-center">
                  <input
                    id="qrCode"
                    type="checkbox"
                    {...register("qrCode")}
                    className="h-4 w-4 rounded border-gray-300 text-sky-600 focus:ring-sky-600"
                  />
                  <label
                    htmlFor="qrCode"
                    className="ml-3 block text-sm font-medium leading-6 text-gray-900"
                  >
                    Générer un QR Code pour l’entrée
                  </label>
                </div>
              </div>

              {/* Système de contrôle d’accès */}
              <div className="sm:col-span-6">
                <div className="flex items-center">
                  <input
                    id="accessControl"
                    type="checkbox"
                    {...register("accessControl")}
                    className="h-4 w-4 rounded border-gray-300 text-sky-600 focus:ring-sky-600"
                  />
                  <label
                    htmlFor="accessControl"
                    className="ml-3 block text-sm font-medium leading-6 text-gray-900"
                  >
                    Activer le contrôle d’accès (liste des invités, scan de
                    billets)
                  </label>
                </div>
              </div>

              {/* Validation avant publication */}
              <div className="sm:col-span-6">
                <div className="flex items-center">
                  <input
                    id="moderation"
                    type="checkbox"
                    {...register("moderation")}
                    className="h-4 w-4 rounded border-gray-300 text-sky-600 focus:ring-sky-600"
                  />
                  <label
                    htmlFor="moderation"
                    className="ml-3 block text-sm font-medium leading-6 text-gray-900"
                  >
                    Activer la validation avant publication (modération)
                  </label>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </form>

      {/* Navigation */}
      <div className="mt-8 pt-5">
        <div className="flex justify-between">
          <button
            type="button"
            onClick={prev}
            disabled={currentStep === 0}
            className="rounded bg-white px-2 py-1 text-sm font-semibold text-sky-900 shadow-sm ring-1 ring-inset ring-sky-300 hover:bg-sky-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="h-6 w-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 19.5L8.25 12l7.5-7.5"
              />
            </svg>
          </button>
          {/* Bouton Suivant ou Création d'événement */}
          {currentStep === 8 ? (
            // Bouton "Créer l’événement"
            <button
              type="button"
              onClick={onSubmitPersonnal}
              className="inline-flex items-center rounded-md bg-sky-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-sky-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600 transition duration-300"
            >
              Créer l’événement
            </button>
          ) : (
            // Bouton "Next"
            <button
              type="button"
              onClick={next}
              className="rounded bg-white px-2 py-1 text-sm font-semibold text-sky-900 shadow-sm ring-1 ring-inset ring-sky-300 hover:bg-sky-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="h-6 w-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M8.25 4.5l7.5 7.5-7.5 7.5"
                />
              </svg>
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
