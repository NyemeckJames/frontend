"use client"
import React from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import dynamic from 'next/dynamic'
import { useToast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";
const Select = dynamic(() => import('react-select'), { ssr: false })

const schema = z.object({
  nom_entreprise: z.string().min(2, "Le nom de l'entreprise est requis"),
  facebook: z.string().url("Lien invalide"),
  twitter: z.string().url("Lien invalide"),
  numero_cni: z.string().min(5, "Numéro CNI invalide"),
  photo_cni: z.instanceof(File).optional(),
  types_evenements: z.array(z.string()).min(1, "Sélectionnez au moins un type"),
  taille_evenements: z.string().min(1, "Sélectionnez une taille"),
  mode_financement: z.string().min(1, "Sélectionnez un mode de financement"),
  accept_conditions: z.boolean().refine((val) => val === true, {
    message: "Vous devez accepter les conditions.",
  }),
});

const optionsTypesEvenements = [
  { value: "conference", label: "Conférence" },
  { value: "concert", label: "Concert" },
  { value: "formation", label: "Formation" },
];

const optionsTailleEvenements = [
  { value: "petit", label: "Petit (<50)" },
  { value: "moyen", label: "Moyen (50-500)" },
  { value: "grand", label: "Grand (500+)" },
];

const optionsModeFinancement = [
  { value: "autofinance", label: "Autofinancé" },
  { value: "sponsorisation", label: "Sponsorisations" },
  { value: "subvention", label: "Subventions" },
];

const OrganisateurForm = () => {
  const {
    register,
    handleSubmit,
    control,
    watch,
    getValues,
    formState: { errors },
  } = useForm({ resolver: zodResolver(schema) });

  const {toast} = useToast();

  const onSubmit = (data:any) => {
    console.log("Données soumises:", data);
  };
  const handleSubmitData = ()=>{
    if (!watch("accept_conditions")) {
      toast({
        description: "Vous devez accepeter les conditions !",
        variant: "warning",
        duration: 3000,
      });
      return;
    }
    console.log("Données du formulaire : ",getValues())
  }

  return (
    <>
    
    <div className="max-w-2xl mx-auto p-6 mt-4 mb-4 bg-white shadow-lg rounded-xl">
    <Toaster/>
  <h2 className="text-xl font-semibold mb-4">Devenir Organisateur</h2>
  <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
    {/* Informations Professionnelles */}
    <div>
      <h3 className="font-medium mb-2">Informations Professionnelles</h3>
      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium">Nom de l'entreprise</label>
          <input 
            {...register("nom_entreprise")} 
            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6"
          />
          {errors.nom_entreprise && <p className="text-red-500 text-sm">{errors.nom_entreprise.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium">Page Facebook</label>
          <input 
            {...register("facebook")} 
            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Page Twitter</label>
          <input 
            {...register("twitter")} 
            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6"
          />
        </div>
      </div>
    </div>

    {/* Justificatif Identité */}
    <div>
      <h3 className="font-medium mb-2">Justificatif d'Identité</h3>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium">Numéro CNI</label>
          <input 
            {...register("numero_cni")} 
            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Photo CNI</label>
          <input 
            type="file" 
            {...register("photo_cni")} 
            className="w-full rounded-lg border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 p-2"
          />
        </div>
      </div>
    </div>

    {/* Infos sur les événements */}
    <div>
      <h3 className="font-medium mb-2">Infos sur les événements</h3>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium">Type d'événements</label>
          <Controller name="types_evenements" control={control} render={({ field }) => (
            <Select {...field} options={optionsTypesEvenements} isMulti className="w-full" />
          )} />
        </div>
        <div>
          <label className="block text-sm font-medium">Taille estimée</label>
          <Controller name="taille_evenements" control={control} render={({ field }) => (
            <Select {...field} options={optionsTailleEvenements} className="w-full" />
          )} />
        </div>
        <div>
          <label className="block text-sm font-medium">Mode de financement</label>
          <Controller name="mode_financement" control={control} render={({ field }) => (
            <Select {...field} options={optionsModeFinancement} className="w-full" />
          )} />
        </div>
      </div>
    </div>

    {/* Acceptation des conditions */}
    <div className="flex items-center gap-2">
      <input type="checkbox" {...register("accept_conditions")} className="h-5 w-5 text-blue-600 rounded" />
      <label className="text-sm">J’accepte les conditions d’utilisation et la politique de l’événementiel</label>
    </div>
    {errors.accept_conditions && <p className="text-red-500 text-sm">{errors.accept_conditions.message}</p>}

    {/* Bouton de validation */}
    <button 
      type="button" 
      onClick={handleSubmitData}
      className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition"
    >
      Valider
    </button>
  </form>
</div>
</>
  );
};

export default OrganisateurForm;