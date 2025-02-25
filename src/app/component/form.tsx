'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'

import { z } from 'zod'
import { eventSchema } from '@/lib/eventschema'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm, SubmitHandler } from 'react-hook-form'
import { formSteps } from '@/lib/eventschema'
import { useFieldArray, useFormContext } from 'react-hook-form';

type Inputs = z.infer<typeof eventSchema>

const steps = formSteps

export default function Form() {
  const [previousStep, setPreviousStep] = useState(0)
  const [currentStep, setCurrentStep] = useState(0)
  
  const delta = currentStep - previousStep
  const { control, setValue  } = useFormContext();
    const { fields, append, remove } = useFieldArray({
    control,
    name: "speakers",
    });

  const {
    register,
    handleSubmit,
    watch,
    reset,
    trigger,
    formState: { errors }
  } = useForm<Inputs>({
    resolver: zodResolver(eventSchema)
  })
  const tagsValue = watch('tags') || []; // Récupérer la valeur actuelle du champ

const handleTagsChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  const newTags = event.target.value
    .split(',')
    .map(tag => tag.trim()) // Nettoyer les espaces
    .filter(tag => tag.length > 0); // Éviter les tags vides
  
  setValue('tags', newTags); // Mettre à jour React Hook Form
};

  const processForm: SubmitHandler<Inputs> = data => {
    console.log(data)
    reset()
  }

  type FieldName = keyof Inputs

  const next = async () => {
    const fields = steps[currentStep].fields
    const output = await trigger(fields as FieldName[], { shouldFocus: true })

    if (!output) return

    if (currentStep < steps.length - 1) {
      if (currentStep === steps.length - 2) {
        await handleSubmit(processForm)()
      }
      setPreviousStep(currentStep)
      setCurrentStep(step => step + 1)
    }
  }

  const prev = () => {
    if (currentStep > 0) {
      setPreviousStep(currentStep)
      setCurrentStep(step => step - 1)
    }
  }

  return (
    <section className='absolute inset-0 flex flex-col justify-between p-24'>
      {/* steps */}
      <nav aria-label='Progress'>
        <ol role='list' className='space-y-4 md:flex md:space-x-8 md:space-y-0'>
          {steps.map((step, index) => (
            <li key={step.name} className='md:flex-1'>
              {currentStep > index ? (
                <div className='group flex w-full flex-col border-l-4 border-sky-600 py-2 pl-4 transition-colors md:border-l-0 md:border-t-4 md:pb-0 md:pl-0 md:pt-4'>
                  <span className='text-sm font-medium text-sky-600 transition-colors '>
                    {step.id}
                  </span>
                  <span className='text-sm font-medium'>{step.name}</span>
                </div>
              ) : currentStep === index ? (
                <div
                  className='flex w-full flex-col border-l-4 border-sky-600 py-2 pl-4 md:border-l-0 md:border-t-4 md:pb-0 md:pl-0 md:pt-4'
                  aria-current='step'
                >
                  <span className='text-sm font-medium text-sky-600'>
                    {step.id}
                  </span>
                  <span className='text-sm font-medium'>{step.name}</span>
                </div>
              ) : (
                <div className='group flex w-full flex-col border-l-4 border-gray-200 py-2 pl-4 transition-colors md:border-l-0 md:border-t-4 md:pb-0 md:pl-0 md:pt-4'>
                  <span className='text-sm font-medium text-gray-500 transition-colors'>
                    {step.id}
                  </span>
                  <span className='text-sm font-medium'>{step.name}</span>
                </div>
              )}
            </li>
          ))}
        </ol>
      </nav>

      {/* Form */}
      <form className='mt-2' onSubmit={handleSubmit(processForm)}>
      {currentStep === 0 && ( 
        <motion.div
            initial={{ x: delta >= 0 ? '50%' : '-50%', opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
        >
            <h2 className='text-base font-semibold leading-7 text-gray-900'>
            Informations Générales
            </h2>
            <p className='mt-1 text-sm leading-6 text-gray-600'>
            Renseignez les informations de base sur votre événement.
            </p>

            <div className='mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6'>
            {/* Nom de l'événement */}
            <div className='sm:col-span-3'>
                <label htmlFor='name' className='block text-sm font-medium leading-6 text-gray-900'>
                Nom de l’événement
                </label>
                <div className='mt-2'>
                <input
                    type='text'
                    id='name'
                    {...register('name')}
                    className='block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6'
                />
                {errors.name?.message && (
                    <p className='mt-2 text-sm text-red-400'>{errors.name.message}</p>
                )}
                </div>
            </div>

            {/* Catégorie */}
            <div className='sm:col-span-3'>
                <label htmlFor='category' className='block text-sm font-medium leading-6 text-gray-900'>
                Catégorie
                </label>
                <div className='mt-2'>
                <select
                    id='category'
                    {...register('category')}
                    className='block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6'
                >
                    <option value=''>Sélectionnez une catégorie</option>
                    <option value='Concert'>Concert</option>
                    <option value='Conférence'>Conférence</option>
                    <option value='Festival'>Festival</option>
                    <option value='Atelier'>Atelier</option>
                    <option value='Autre'>Autre</option>
                </select>
                {errors.category?.message && (
                    <p className='mt-2 text-sm text-red-400'>{errors.category.message}</p>
                )}
                </div>
            </div>

            {/* Description */}
            <div className='sm:col-span-6'>
                <label htmlFor='description' className='block text-sm font-medium leading-6 text-gray-900'>
                Description
                </label>
                <div className='mt-2'>
                <textarea
                    id='description'
                    {...register('description')}
                    rows={3}
                    className='block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6'
                ></textarea>
                {errors.description?.message && (
                    <p className='mt-2 text-sm text-red-400'>{errors.description.message}</p>
                )}
                </div>
            </div>
            </div>
        </motion.div>
        )}

        {currentStep === 1 && (
        <motion.div
            initial={{ x: delta >= 0 ? '50%' : '-50%', opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
        >
            <h2 className='text-base font-semibold leading-7 text-gray-900'>
            Date et Heure
            </h2>
            <p className='mt-1 text-sm leading-6 text-gray-600'>
            Renseignez les détails concernant la date et l'heure de votre événement.
            </p>

            <div className='mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6'>
            {/* Date de début */}
            <div className='sm:col-span-3'>
                <label htmlFor='startDate' className='block text-sm font-medium leading-6 text-gray-900'>
                Date de début
                </label>
                <div className='mt-2'>
                <input
                    type='date'
                    id='startDate'
                    min={new Date().toISOString().split("T")[0]}
                    {...register('startDate')}
                    className='block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6'
                />
                {errors.startDate?.message && (
                    <p className='mt-2 text-sm text-red-400'>{errors.startDate.message}</p>
                )}
                </div>
            </div>

            {/* Heure de début */}
            <div className='sm:col-span-3'>
                <label htmlFor='startTime' className='block text-sm font-medium leading-6 text-gray-900'>
                Heure de début
                </label>
                <div className='mt-2'>
                <input
                    type='time'
                    id='startTime'
                    {...register('startTime')}
                    className='block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6'
                />
                {errors.startTime?.message && (
                    <p className='mt-2 text-sm text-red-400'>{errors.startTime.message}</p>
                )}
                </div>
            </div>

            {/* Date de fin */}
            <div className='sm:col-span-3'>
                <label htmlFor='endDate' className='block text-sm font-medium leading-6 text-gray-900'>
                Date de fin (optionnel)
                </label>
                <div className='mt-2'>
                <input
                    type='date'
                    id='endDate'
                    {...register('endDate')}
                    className='block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6'
                />
                {errors.endDate?.message && (
                    <p className='mt-2 text-sm text-red-400'>{errors.endDate.message}</p>
                )}
                </div>
            </div>

            {/* Heure de fin */}
            <div className='sm:col-span-3'>
                <label htmlFor='endTime' className='block text-sm font-medium leading-6 text-gray-900'>
                Heure de fin (optionnel)
                </label>
                <div className='mt-2'>
                <input
                    type='time'
                    id='endTime'
                    {...register('endTime')}
                    className='block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6'
                />
                {errors.endTime?.message && (
                    <p className='mt-2 text-sm text-red-400'>{errors.endTime.message}</p>
                )}
                </div>
            </div>

            {/* Fuseau horaire */}
            <div className='sm:col-span-6'>
                <label htmlFor='timezone' className='block text-sm font-medium leading-6 text-gray-900'>
                Fuseau horaire (optionnel)
                </label>
                <div className='mt-2'>
                <input
                    type='text'
                    id='timezone'
                    {...register('timezone')}
                    placeholder='Ex: UTC+1, CET...'
                    className='block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6'
                />
                {errors.timezone?.message && (
                    <p className='mt-2 text-sm text-red-400'>{errors.timezone.message}</p>
                )}
                </div>
            </div>
            </div>
        </motion.div>
        )}
        {currentStep === 2 && (
        <motion.div
            initial={{ x: delta >= 0 ? '50%' : '-50%', opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
        >
            <h2 className='text-base font-semibold leading-7 text-gray-900'>
            Lieu et Accessibilité
            </h2>
            <p className='mt-1 text-sm leading-6 text-gray-600'>
            Indiquez où se déroulera votre événement.
            </p>

            <div className='mt-10 grid grid-cols-1 gap-x-6  sm:grid-cols-6'>
            {/* Lieu */}
            <div className='col-span-full'>
                <label htmlFor='location' className='block text-sm font-medium leading-6 text-gray-900'>
                Lieu de l'événement
                </label>
                <div className='mt-2'>
                <input
                    type='text'
                    id='location'
                    {...register('location')}
                    className='block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6'
                />
                {errors.location?.message && (
                    <p className='mt-2 text-sm text-red-400'>{errors.location.message}</p>
                )}
                </div>
            </div>

            {/* Ville */}
            <div className='sm:col-span-3'>
                <label htmlFor='city' className='block text-sm font-medium leading-6 text-gray-900'>
                Ville
                </label>
                <div className='mt-2'>
                <input
                    type='text'
                    id='city'
                    {...register('city')}
                    className='block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6'
                />
                {errors.city?.message && (
                    <p className='mt-2 text-sm text-red-400'>{errors.city.message}</p>
                )}
                </div>
            </div>

            {/* Pays */}
            <div className='sm:col-span-3'>
                <label htmlFor='country' className='block text-sm font-medium leading-6 text-gray-900'>
                Pays
                </label>
                <div className='mt-2'>
                <input
                    type='text'
                    id='country'
                    {...register('country')}
                    className='block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6'
                />
                {errors.country?.message && (
                    <p className='mt-2 text-sm text-red-400'>{errors.country.message}</p>
                )}
                </div>
            </div>

            {/* Lien en ligne (optionnel) */}
            <div className='col-span-full'>
                <label htmlFor='onlineLink' className='block text-sm font-medium leading-6 text-gray-900'>
                Lien en ligne (si événement virtuel)
                </label>
                <div className='mt-2'>
                <input
                    type='url'
                    id='onlineLink'
                    {...register('onlineLink')}
                    className='block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6'
                />
                {errors.onlineLink?.message && (
                    <p className='mt-2 text-sm text-red-400'>{errors.onlineLink.message}</p>
                )}
                </div>
            </div>

            {/* Capacité */}
            <div className='sm:col-span-2'>
                <label htmlFor='capacity' className='block text-sm font-medium leading-6 text-gray-900'>
                Capacité maximale
                </label>
                <div className='mt-2'>
                <input
                    type='number'
                    id='capacity'
                    {...register('capacity', { valueAsNumber: true })}
                    className='block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6'
                />
                {errors.capacity?.message && (
                    <p className='mt-2 text-sm text-red-400'>{errors.capacity.message}</p>
                )}
                </div>
            </div>
            </div>
        </motion.div>
        )}
        {currentStep === 3 && (
        <motion.div
            initial={{ x: delta >= 0 ? '50%' : '-50%', opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
        >
            <h2 className='text-base font-semibold leading-7 text-gray-900'>
            Billetterie et Tarification
            </h2>
            <p className='mt-1 text-sm leading-6 text-gray-600'>
            Définissez les modalités de billetterie pour votre événement.
            </p>

            <div className='mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6'>
            {/* Type de billet */}
            <div className='sm:col-span-3'>
                <label htmlFor='ticketType' className='block text-sm font-medium leading-6 text-gray-900'>
                Type de billet
                </label>
                <div className='mt-2'>
                <select
                    id='ticketType'
                    {...register('ticketType')}
                    className='block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6'
                >
                    <option value='Gratuite'>Gratuite</option>
                    <option value='Payante'>Payante</option>
                </select>
                {errors.ticketType?.message && (
                    <p className='mt-2 text-sm text-red-400'>{errors.ticketType.message}</p>
                )}
                </div>
            </div>

            {/* Prix du billet (si payant) */}
            <div className='sm:col-span-3'>
                <label htmlFor='price' className='block text-sm font-medium leading-6 text-gray-900'>
                Prix du billet (en Xaf)
                </label>
                <div className='mt-2'>
                <input
                    type='number'
                    id='price'
                    {...register('price',{ valueAsNumber: true })}
                    placeholder='0.00'
                    
                    className='block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6'
                />
                {errors.price?.message && (
                    <p className='mt-2 text-sm text-red-400'>{errors.price.message}</p>
                )}
                </div>
            </div>

            {/* Date d'ouverture des billets */}
            <div className='sm:col-span-3'>
                <label htmlFor='ticketOpenDate' className='block text-sm font-medium leading-6 text-gray-900'>
                Date d'ouverture de vente des billets
                </label>
                <div className='mt-2'>
                <input
                    type='date'
                    id='ticketOpenDate'
                    {...register('ticketOpenDate')}
                    className='block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6'
                />
                {errors.ticketOpenDate?.message && (
                    <p className='mt-2 text-sm text-red-400'>{errors.ticketOpenDate.message}</p>
                )}
                </div>
            </div>

            {/* Date de fermeture des billets */}
            <div className='sm:col-span-3'>
                <label htmlFor='ticketCloseDate' className='block text-sm font-medium leading-6 text-gray-900'>
                Date de fermeture de vente des billets
                </label>
                <div className='mt-2'>
                <input
                    type='date'
                    id='ticketCloseDate'
                    {...register('ticketCloseDate')}
                    className='block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6'
                />
                {errors.ticketCloseDate?.message && (
                    <p className='mt-2 text-sm text-red-400'>{errors.ticketCloseDate.message}</p>
                )}
                </div>
            </div>
            </div>
        </motion.div>
        )}
        {currentStep === 4 && ( 
        <motion.div
            initial={{ x: delta >= 0 ? '50%' : '-50%', opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
        >
            <h2 className='text-base font-semibold leading-7 text-gray-900'>
            Intervenants et Organisateurs
            </h2>
            <p className='mt-1 text-sm leading-6 text-gray-600'>
            Ajoutez les informations sur l'organisateur et les intervenants de votre événement.
            </p>

            <div className='mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6'>
            {/* Nom de l'organisateur */}
            <div className='sm:col-span-3'>
                <label htmlFor='organizerName' className='block text-sm font-medium leading-6 text-gray-900'>
                Nom de l'organisateur
                </label>
                <div className='mt-2'>
                <input
                    type='text'
                    id='organizerName'
                    {...register('organizerName')}
                    className='block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6'
                />
                {errors.organizerName?.message && (
                    <p className='mt-2 text-sm text-red-400'>{errors.organizerName.message}</p>
                )}
                </div>
            </div>

            {/* Contact de l'organisateur */}
            <div className='sm:col-span-3'>
                <label htmlFor='organizerContact' className='block text-sm font-medium leading-6 text-gray-900'>
                Contact de l'organisateur (Email)
                </label>
                <div className='mt-2'>
                <input
                    type='email'
                    id='organizerContact'
                    {...register('organizerContact')}
                    className='block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6'
                />
                {errors.organizerContact?.message && (
                    <p className='mt-2 text-sm text-red-400'>{errors.organizerContact.message}</p>
                )}
                </div>
            </div>

            {/* Site web de l'organisateur */}
            <div className='sm:col-span-6'>
                <label htmlFor='organizerWebsite' className='block text-sm font-medium leading-6 text-gray-900'>
                Site web de l'organisateur (facultatif)
                </label>
                <div className='mt-2'>
                <input
                    type='url'
                    id='organizerWebsite'
                    {...register('organizerWebsite')}
                    className='block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6'
                />
                {errors.organizerWebsite?.message && (
                    <p className='mt-2 text-sm text-red-400'>{errors.organizerWebsite.message}</p>
                )}
                </div>
            </div>

            {/* Liste des intervenants */}
            <div className='sm:col-span-6'>
                <label className='block text-sm font-medium leading-6 text-gray-900'>
                Intervenants (Facultatif)
                </label>
                <div className='mt-2 space-y-4'>
                {fields.map((speaker, index) => (
                    <div key={speaker.id} className='grid grid-cols-1 gap-4 sm:grid-cols-3'>
                    {/* Nom de l'intervenant */}
                    <div>
                        <input
                        type='text'
                        {...register(`speakers.${index}.name`)}
                        placeholder='Nom de l’intervenant'
                        className='block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6'
                        />
                        {errors.speakers?.[index]?.name && (
                        <p className='mt-2 text-sm text-red-400'>{errors.speakers[index].name.message}</p>
                        )}
                    </div>

                    {/* Biographie de l'intervenant */}
                    <div>
                        <input
                        type='text'
                        {...register(`speakers.${index}.bio`)}
                        placeholder='Biographie (facultatif)'
                        className='block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6'
                        />
                    </div>

                    {/* Photo de l'intervenant */}
                    <div>
                        <input
                        type='url'
                        {...register(`speakers.${index}.photo`)}
                        placeholder='URL de la photo (facultatif)'
                        className='block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6'
                        />
                    </div>

                    {/* Bouton de suppression */}
                    <button
                        type='button'
                        onClick={() => remove(index)}
                        className='text-sm text-red-600 hover:text-red-800'
                    >
                        Supprimer
                    </button>
                    </div>
                ))}
                </div>

                {/* Bouton d'ajout d'intervenant */}
                <button
                type='button'
                onClick={() => append({ name: '', bio: '', photo: '' })}
                className='mt-4 text-sm font-medium text-sky-600 hover:text-sky-800'
                >
                + Ajouter un intervenant
                </button>
            </div>
            </div>
        </motion.div>
        )}
        {currentStep === 5 && ( // currentStep = 5 car les étapes sont indexées à partir de 0
        <motion.div
            initial={{ x: delta >= 0 ? '50%' : '-50%', opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
        >
            <h2 className='text-base font-semibold leading-7 text-gray-900'>
            Contenu et Média
            </h2>
            <p className='mt-1 text-sm leading-6 text-gray-600'>
            Ajoutez des images et des vidéos pour promouvoir votre événement.
            </p>

            <div className='mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6'>

            {/* Image de couverture */}
            <div className='sm:col-span-6'>
                <label htmlFor='coverImage' className='block text-sm font-medium leading-6 text-gray-900'>
                Image de couverture
                </label>
                <div className='mt-2'>
                <input
                    type='url'
                    id='coverImage'
                    {...register('coverImage')}
                    placeholder='URL de l’image de couverture'
                    className='block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6'
                />
                {errors.coverImage?.message && (
                    <p className='mt-2 text-sm text-red-400'>{errors.coverImage.message}</p>
                )}
                </div>
            </div>

            {/* Galerie d'images */}
            <div className='sm:col-span-6'>
                <label htmlFor='gallery' className='block text-sm font-medium leading-6 text-gray-900'>
                Galerie d'images
                </label>
                <div className='mt-2 space-y-2'>
                {fields.map((image, index) => (
                    <div key={image.id} className='flex items-center gap-4'>
                    <input
                        type='url'
                        {...register(`gallery.${index}`)}
                        placeholder={`URL de l’image ${index + 1}`}
                        className='block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6'
                    />
                    <button
                        type='button'
                        onClick={() => remove(index)}
                        className='text-sm text-red-600 hover:text-red-800'
                    >
                        Supprimer
                    </button>
                    </div>
                ))}
                </div>
                <button
                type='button'
                onClick={() => append('')}
                className='mt-2 text-sm font-medium text-sky-600 hover:text-sky-800'
                >
                + Ajouter une image
                </button>
            </div>

            {/* Vidéo promotionnelle */}
            <div className='sm:col-span-6'>
                <label htmlFor='promoVideo' className='block text-sm font-medium leading-6 text-gray-900'>
                Vidéo promotionnelle (facultatif)
                </label>
                <div className='mt-2'>
                <input
                    type='url'
                    id='promoVideo'
                    {...register('promoVideo')}
                    placeholder='URL de la vidéo'
                    className='block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6'
                />
                {errors.promoVideo?.message && (
                    <p className='mt-2 text-sm text-red-400'>{errors.promoVideo.message}</p>
                )}
                </div>
            </div>
            </div>
        </motion.div>
        )}
        {currentStep === 6 && ( 
        <motion.div
            initial={{ x: delta >= 0 ? '50%' : '-50%', opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
        >
            <h2 className='text-base font-semibold leading-7 text-gray-900'>
            Personnalisation et Paramètres
            </h2>
            <p className='mt-1 text-sm leading-6 text-gray-600'>
            Ajoutez des tags pour mieux catégoriser votre événement et améliorer sa visibilité.
            </p>

            <div className='mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6'>
            {/* Tags */}
            <div className='sm:col-span-6'>
                <label htmlFor='tags' className='block text-sm font-medium leading-6 text-gray-900'>
                Tags
                </label>
                <div className='mt-2'>
                <input
                    type='text'
                    id='tags'
                    value={tagsValue.join(', ')} // Convertir le tableau en chaîne
                    onChange={handleTagsChange} // Gérer la conversion en tableau
                    placeholder='Ex: Musique, Technologie, Art...'
                    className='block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6'
                />
                {errors.tags?.message && (
                    <p className='mt-2 text-sm text-red-400'>{errors.tags.message}</p>
                )}
                </div>
                <p className='mt-2 text-sm text-gray-500'>
                Séparez les tags par des virgules.
                </p>
            </div>
            </div>
        </motion.div>
        )}
        {currentStep === 7 && ( 
        <motion.div
            initial={{ x: delta >= 0 ? '50%' : '-50%', opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
        >
            <h2 className='text-base font-semibold leading-7 text-gray-900'>
            Marketing et Communication
            </h2>
            <p className='mt-1 text-sm leading-6 text-gray-600'>
            Configurez les options de communication pour votre événement.
            </p>

            <div className='mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6'>
            {/* Email de confirmation */}
            <div className='sm:col-span-6'>
                <label htmlFor='confirmationEmail' className='block text-sm font-medium leading-6 text-gray-900'>
                Email de confirmation personnalisé
                </label>
                <div className='mt-2'>
                <textarea
                    id='confirmationEmail'
                    {...register('confirmationEmail')}
                    placeholder="Merci pour votre inscription ! Nous avons hâte de vous voir à l'événement."
                    className='block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6'
                />
                {errors.confirmationEmail?.message && (
                    <p className='mt-2 text-sm text-red-400'>{errors.confirmationEmail.message}</p>
                )}
                </div>
            </div>

            {/* Messages de rappel */}
            <div className='sm:col-span-6'>
                <div className='flex items-center'>
                <input
                    id='reminderMessages'
                    type='checkbox'
                    {...register('reminderMessages')}
                    className='h-4 w-4 rounded border-gray-300 text-sky-600 focus:ring-sky-600'
                />
                <label htmlFor='reminderMessages' className='ml-3 block text-sm font-medium leading-6 text-gray-900'>
                    Activer les messages de rappel automatisés
                </label>
                </div>
            </div>
            </div>
        </motion.div>
        )}
        {currentStep === 8 && ( 
            <motion.div
                initial={{ x: delta >= 0 ? '50%' : '-50%', opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
            >
                <h2 className='text-base font-semibold leading-7 text-gray-900'>
                    Sécurité et Vérification
                </h2>
                <p className='mt-1 text-sm leading-6 text-gray-600'>
                    Paramétrez les options de sécurité et de vérification pour votre événement.
                </p>

                <div className='mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6'>
                    {/* QR Code pour l’entrée */}
                    <div className='sm:col-span-6'>
                        <div className='flex items-center'>
                            <input
                                id='qrCode'
                                type='checkbox'
                                {...register('qrCode')}
                                className='h-4 w-4 rounded border-gray-300 text-sky-600 focus:ring-sky-600'
                            />
                            <label htmlFor='qrCode' className='ml-3 block text-sm font-medium leading-6 text-gray-900'>
                                Générer un QR Code pour l’entrée
                            </label>
                        </div>
                    </div>

                    {/* Système de contrôle d’accès */}
                    <div className='sm:col-span-6'>
                        <div className='flex items-center'>
                            <input
                                id='accessControl'
                                type='checkbox'
                                {...register('accessControl')}
                                className='h-4 w-4 rounded border-gray-300 text-sky-600 focus:ring-sky-600'
                            />
                            <label htmlFor='accessControl' className='ml-3 block text-sm font-medium leading-6 text-gray-900'>
                                Activer le contrôle d’accès (liste des invités, scan de billets)
                            </label>
                        </div>
                    </div>

                    {/* Validation avant publication */}
                    <div className='sm:col-span-6'>
                        <div className='flex items-center'>
                            <input
                                id='moderation'
                                type='checkbox'
                                {...register('moderation')}
                                className='h-4 w-4 rounded border-gray-300 text-sky-600 focus:ring-sky-600'
                            />
                            <label htmlFor='moderation' className='ml-3 block text-sm font-medium leading-6 text-gray-900'>
                                Activer la validation avant publication (modération)
                            </label>
                        </div>
                    </div>
                </div>

                {/* Bouton de création d'événement */}
                <div className='mt-10 flex justify-end'>
                    <button
                        type='submit'
                        className='inline-flex items-center rounded-md bg-sky-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-sky-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600 transition duration-300'
                    >
                        Créer l’événement
                    </button>
                </div>
            </motion.div>
        )}

      </form>

      {/* Navigation */}
      <div className='mt-8 pt-5'>
        <div className='flex justify-between'>
          <button
            type='button'
            onClick={prev}
            disabled={currentStep === 0}
            className='rounded bg-white px-2 py-1 text-sm font-semibold text-sky-900 shadow-sm ring-1 ring-inset ring-sky-300 hover:bg-sky-50 disabled:cursor-not-allowed disabled:opacity-50'
          >
            <svg
              xmlns='http://www.w3.org/2000/svg'
              fill='none'
              viewBox='0 0 24 24'
              strokeWidth='1.5'
              stroke='currentColor'
              className='h-6 w-6'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                d='M15.75 19.5L8.25 12l7.5-7.5'
              />
            </svg>
          </button>
          <button
            type='button'
            onClick={next}
            disabled={currentStep === steps.length - 1}
            className='rounded bg-white px-2 py-1 text-sm font-semibold text-sky-900 shadow-sm ring-1 ring-inset ring-sky-300 hover:bg-sky-50 disabled:cursor-not-allowed disabled:opacity-50'
          >
            <svg
              xmlns='http://www.w3.org/2000/svg'
              fill='none'
              viewBox='0 0 24 24'
              strokeWidth='1.5'
              stroke='currentColor'
              className='h-6 w-6'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                d='M8.25 4.5l7.5 7.5-7.5 7.5'
              />
            </svg>
          </button>
        </div>
      </div>
    </section>
  )
}