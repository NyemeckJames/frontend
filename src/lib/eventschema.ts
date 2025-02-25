

import { z } from 'zod'



// Définition du schéma Zod pour la validation des données du formulaire
type StepField = {
    id: string;
    name: string;
    type: "text" | "textarea" | "select" | "date" | "time" | "number" | "url" | "email" | "checkbox";
    required?: boolean;
    options?: string[]; // Pour les selects
};
export const eventSchema = z.object({
    name: z.string().min(1, "Le nom de l'événement est requis"),
    description: z.string().optional(),
    category: z.enum(["Concert", "Conférence", "Festival", "Atelier", "Autre"]),
    dateRange: z.tuple([
      z.date().nullable(),
      z.date().nullable(),
  ]).optional(),
    startDate: z.string().min(1, "La date de début est requise"),
    startTime: z.string().min(1, "L'heure de début est requise"),
    endDate: z.string().optional(),
    endTime: z.string().optional(),
    timezone: z.string().optional(),
    location: z.string().optional(),
    city: z.string().optional(),
    adress: z.array(z.object({ city: z.string(), location: z.string().optional(), indication: z.string().optional() })).optional(),
    country: z.string().optional(),
    onlineLink: z.string().url().or(z.literal("")).optional(),
    capacity: z.number().optional(),
    ticketType: z.enum(["Gratuite", "Payante"]),
    price: z.number().optional(),
    ticketOpenDate: z.string().optional(),
    ticketCloseDate: z.string().optional(),
    organizerName: z.string(),
    organizerContact: z.string().email("Email invalide"),
    organizerWebsite: z.string().url().optional(),
    speakers: z.array(z.object({ name: z.string(), bio: z.string().optional(), photo: z.string().url().optional() })).optional(),
    coverImage: z.any()
    .refine((files) => files?.length > 0, "Une image est requise")
    .refine(
      (files) => files && files.length > 0 && ["image/jpg","image/jpeg", "image/png", "image/webp"].includes(files[0]?.type),
      "Format invalide (JPEG, PNG, WEBP uniquement)"
    )
    .refine((files) => files && files.length > 0 && files[0]?.size <= 2 * 1024 * 1024, "L'image ne doit pas dépasser 2Mo"),
    gallery: z.array(
      z
        .any()
        .refine((files) => files?.length > 0, "Une image est requise")
        .refine(
          (files) => ["image/jpeg", "image/jpg","image/png", "image/webp"].includes(files[0]?.type),
          "Format invalide (JPEG, PNG, WEBP uniquement)"
        )
        .refine((files) =>files && files.length > 0 && files[0]?.size <= 2 * 1024 * 1024, "L'image ne doit pas dépasser 2Mo")
    )
    .min(1, "Ajoutez au moins une image"),
    promoVideo: z.string().url().optional(),
    tags: z.string()
    .trim()
    .refine((value) => value.length > 0, "Au moins un tag est requis")
    .transform((value) =>
      value
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag.length > 0) // Supprime les tags vides
    )
    .refine((tags) => tags.length > 0, "Ajoutez au moins un tag"),
    confirmationEmail: z.string().optional(),
    reminderMessages: z.boolean().optional(),
    qrCode: z.boolean().optional(),
    accessControl: z.boolean().optional(),
    moderation: z.boolean().optional(),
  });
  
  export const formSteps = [
    { id: "1", name: "Informations Générales", fields: ["name", "description", "category"] },
    { id: "2", name: "Date et Heure", fields: ["dateRange"] },
    { id: "3", name: "Lieu et Accessibilité", fields: ["location", "city", "country", "onlineLink", "capacity"] },
    { id: "4", name: "Billetterie et Tarification", fields: ["ticketType", "price", "ticketOpenDate", "ticketCloseDate"] },
    { id: "5", name: "Intervenants et Organisateurs", fields: ["organizerName", "organizerContact", "organizerWebsite", "speakers"] },
    { id: "6", name: "Contenu et Média", fields: ["coverImage", "gallery", "promoVideo"] },
    { id: "7", name: "Personnalisation et Paramètres", fields: ["tags"] },
    { id: "8", name: "Marketing et Communication", fields: ["confirmationEmail", "reminderMessages"] },
    { id: "9", name: "Sécurité et Vérification", fields: ["qrCode", "accessControl", "moderation"] },
  ] as const;