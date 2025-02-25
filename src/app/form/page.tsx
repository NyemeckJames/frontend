"use client"
import Form from "../component/form"
import { useForm, FormProvider } from "react-hook-form";

export default function Home() {
    const methods = useForm({
        defaultValues: {
          speakers: [], // Assure-toi que cette valeur est initialisée
        },
      });
  return (
    <section className='py-24'>
      <div className='container'>
        <FormProvider {...methods}>
            <Form />
        </FormProvider>
      </div>
    </section>
  )
}