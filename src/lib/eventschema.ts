

import { z } from 'zod'



// Définition du schéma Zod pour la validation des données du formulaire
type StepField = {
    id: string;
    name: string;
    type: "text" | "textarea" | "select" | "date" | "time" | "number" | "url" | "email" | "checkbox";
    required?: boolean;
    options?: string[]; // Pour les selects
};
const TicketSchema = z.object({
  name: z.string().min(1, "Le nom du billet est requis"),
  price: z.number().min(1, "Le prix ne peut pas être 0 ou moins"),
  quantity: z.number().min(1,"Au moins 1 billet du type")
});
export const eventSchema = z.object({
    name: z.string().min(1, "Le nom de l'événement est requis"),
    description: z.string().optional(),
    category: z.enum(["Concert", "Conférence", "Festival", "Atelier", "Autre"]),
    dateRange: z.tuple([
      z.date().nullable(),
      z.date().nullable(),
  ]).optional(),
    startDateTime: z.string()
    .nonempty("La date et l'heure de début sont requises")
    .transform((val) => new Date(val).toISOString()), // Convertit en UTC,
    endDateTime: z.string()
    .optional()
    .transform((val) => (val ? new Date(val).toISOString() : undefined)), // Convertit si rempli
    adress: z.array(z.object({
      additional_contact_name: z.string().optional(),
      additional_contact_phone: z.string().optional(),
      delivery_track_id: z.string().optional(),
      location: z.object({
        latitude: z.number(),
        longitude: z.number(),
      }),
      location_title: z.string().optional(),
      name: z.string().optional(),
    })).optional(),
    country: z.string().optional(),
    onlineLink: z.string().url().or(z.literal("")).optional(),
    capacity: z.number(),
    tickets: z.array(TicketSchema).optional(), // Si vide, tous les billets sont gratuits
    price: z.number().optional(),
    ticketOpenDate: z.string().optional(),
    ticketCloseDate: z.string().optional(),
    organizerName: z.string(),
    organizerContact: z.string().email("Email invalide"),
    organizerWebsite: z.string().url().or(z.literal("")).optional(),
    speakers: z.array(z.object({ name: z.string(), occupation: z.string().optional(),facebook: z.string().url().or(z.literal("")).optional(),linkedin: z.string().url().or(z.literal("")).optional() ,photo: z.any().optional() })).optional(),
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
    promoVideo: z.any().optional(),
    tags: z.array(z.string().min(1, "Chaque hashtag doit contenir au moins un caractère"))
    .max(5, "Tu ne peux pas ajouter plus de 5 hashtags")
    .optional(),
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