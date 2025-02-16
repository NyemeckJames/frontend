"use client";

import { useForm, useFieldArray} from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useDispatch } from "react-redux";
import { addEvent } from "@/store/eventSlice";
import { v4 as uuidv4 } from "uuid";

interface Ticket {
  price?: number;
  quantity: number;
}

interface EventFormData {
  name: string;
  description: string;
  date: string;
  location: string;
  isPaidEvent: boolean; // ✅ Type `boolean` et pas `NonNullable<boolean | undefined>`
  tickets: Ticket[];
}


const schema = yup.object({
  name: yup.string().required("Le nom de l'événement est requis"),
  description: yup.string().required("La description est requise"),
  date: yup.string().required("La date est requise"),
  location: yup.string().required("Le lieu est requis"),
  isPaidEvent: yup.boolean().required(), // ✅ Assure-toi que c'est bien un `boolean`
  tickets: yup
    .array()
    .of(
      yup.object({
        price: yup.number().when("isPaidEvent", {
          is: true,
          then: (schema) => schema.positive("Le prix doit être supérieur à 0").required("Prix requis"),
          otherwise: (schema) => schema.notRequired(),
        }),
        quantity: yup.number().positive("La quantité doit être supérieure à 0").required(),
      })
    )
    .required(), // ✅ Ajoute `.required()` pour éviter `undefined`
});


export default function CreateEvent() {
  const dispatch = useDispatch();
  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors },
  } = useForm<EventFormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      name: "",
      description: "",
      date: "",
      location: "",
      isPaidEvent: false, // ✅ Par défaut, l'événement est gratuit
      tickets: [{ quantity: 1 }],
    },
  });

  const { fields, remove } = useFieldArray({ control, name: "tickets" });

  // ✅ Regarder la valeur de isPaidEvent pour afficher le champ Prix si nécessaire
  const isPaidEvent = watch("isPaidEvent");

  const onSubmit = (data: EventFormData) => {
    const newEvent: Event = {
      id: uuidv4(), // ✅ Génère bien un ID unique
      participants: [], // ✅ Ajoute une liste vide pour correspondre à Redux
      ...data,
    };
    dispatch(addEvent(newEvent));
    console.log("Événement créé :", newEvent);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-[#F5F5F5] p-6">
      <div className="bg-white p-6 rounded-lg shadow-md w-96">
        <h1 className="text-2xl font-bold mb-4 text-center text-[#8B5E3B]">Créer un Événement</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Nom */}
          <div>
            <label className="block text-sm font-medium text-[#1C1C1C]">Nom de lévénement</label>
            <input {...register("name")} className="w-full p-2 border rounded" />
            <p className="text-red-500 text-sm">{errors.name?.message}</p>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-[#1C1C1C]">Description</label>
            <textarea {...register("description")} className="w-full p-2 border rounded"></textarea>
            <p className="text-red-500 text-sm">{errors.description?.message}</p>
          </div>

          {/* Date */}
          <div>
            <label className="block text-sm font-medium text-[#1C1C1C]">Date</label>
            <input type="date" {...register("date")} className="w-full p-2 border rounded" />
            <p className="text-red-500 text-sm">{errors.date?.message}</p>
          </div>

          {/* Lieu */}
          <div>
            <label className="block text-sm font-medium text-[#1C1C1C]">Lieu</label>
            <input {...register("location")} className="w-full p-2 border rounded" />
            <p className="text-red-500 text-sm">{errors.location?.message}</p>
          </div>

          {/* Type d'événement : Payant ou Gratuit */}
          <div>
            <label className="block text-sm font-medium text-[#1C1C1C]">Type dévénement</label>
            <select {...register("isPaidEvent")} className="w-full p-2 border rounded">
              <option value="false">Gratuit</option>
              <option value="true">Payant</option>
            </select>
          </div>

          {/* Billets */}
          <h2 className="text-lg font-semibold mt-4">Billets</h2>
          {fields.map((ticket, index) => (
            <div key={ticket.id} className="space-y-2 border p-3 rounded-lg">
              {/* Quantité */}
              <input
                type="number"
                {...register(`tickets.${index}.quantity` as const)}
                className="w-full p-2 border rounded"
                placeholder="Quantité"
              />
              <p className="text-red-500 text-sm">{errors.tickets?.[index]?.quantity?.message}</p>

              {/* Prix (uniquement si Payant) */}
              {isPaidEvent && (
                <>
                  <input
                    type="number"
                    {...register(`tickets.${index}.price` as const)}
                    className="w-full p-2 border rounded"
                    placeholder="Prix du billet"
                  />
                  <p className="text-red-500 text-sm">{errors.tickets?.[index]?.price?.message}</p>
                </>
              )}

              {/* Bouton Supprimer */}
              {fields.length > 1 && (
                <button type="button" onClick={() => remove(index)} className="bg-red-500 text-white px-2 py-1 rounded">
                  Supprimer
                </button>
              )}
            </div>
          ))}


          {/* Bouton Créer */}
          <button
            type="submit"
            className="w-full bg-[#1C1C1C] text-[#EAD7A2] py-2 rounded hover:bg-[#8B5E3B] hover:text-white"
          >
            Créer lévénement
          </button>
        </form>
      </div>
    </div>
  );
}
