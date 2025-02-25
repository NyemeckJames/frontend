
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
    startDate: z.string().min(1, "La date de début est requise"),
    startTime: z.string().min(1, "L'heure de début est requise"),
    endDate: z.string().optional(),
    endTime: z.string().optional(),
    timezone: z.string().optional(),
    location: z.string().optional(),
    city: z.string().optional(),
    country: z.string().optional(),
    onlineLink: z.string().url().optional()
    .refine((val:any) => val === "" || /^https?:\/\/.+\..+/i.test(val), {
      message: "Le lien en ligne doit être une URL valide",
    }),
    capacity: z.number().optional(),
    ticketType: z.enum(["Gratuite", "Payante"]),
    price: z.number().optional(),
    ticketOpenDate: z.string().optional(),
    ticketCloseDate: z.string().optional(),
    organizerName: z.string(),
    organizerContact: z.string().email("Email invalide"),
    organizerWebsite: z.string().url().optional(),
    speakers: z.array(z.object({ name: z.string(), bio: z.string().optional(), photo: z.string().url().optional() })).optional(),
    coverImage: z.string().url().optional(),
    gallery: z.array(z.string().url()).optional(),
    promoVideo: z.string().url().optional(),
    tags: z.array(z.string()).optional(),
    confirmationEmail: z.string().optional(),
    reminderMessages: z.boolean().optional(),
    qrCode: z.boolean().optional(),
    accessControl: z.boolean().optional(),
    moderation: z.boolean().optional(),
  });
  
  export const formSteps = [
    { id: "1", name: "Informations Générales", fields: ["name", "description", "category"] },
    { id: "2", name: "Date et Heure", fields: ["startDate", "startTime", "endDate", "endTime", "timezone"] },
    { id: "3", name: "Lieu et Accessibilité", fields: ["location", "city", "country", "onlineLink", "capacity"] },
    { id: "4", name: "Billetterie et Tarification", fields: ["ticketType", "price", "ticketOpenDate", "ticketCloseDate"] },
    { id: "5", name: "Intervenants et Organisateurs", fields: ["organizerName", "organizerContact", "organizerWebsite", "speakers"] },
    { id: "6", name: "Contenu et Média", fields: ["coverImage", "gallery", "promoVideo"] },
    { id: "7", name: "Personnalisation et Paramètres", fields: ["tags"] },
    { id: "8", name: "Marketing et Communication", fields: ["confirmationEmail", "reminderMessages"] },
    { id: "9", name: "Sécurité et Vérification", fields: ["qrCode", "accessControl", "moderation"] },
  ] as const;