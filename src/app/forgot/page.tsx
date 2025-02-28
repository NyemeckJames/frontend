/* eslint-disable @typescript-eslint/no-unused-vars */
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Link from 'next/link';

export default function ForgotPage() {
  return (
    <div className='min-h-screen flex items-center justify-center bg-gray-900 p-6'>
      <Card className='w-full max-w-md bg-white shadow-lg rounded-2xl p-10'>
        <CardHeader className='text-center'>
        <h1 className="text-center text-4xl font-bold text-gray-800 mb-6">Mboa Event</h1>
        <h2 className="text-center text-2xl font-bold text-gray-800 mb-2">Mot de passe oublié</h2>
          <CardDescription className='text-gray-600 mt-2'>
            Entrez votre adresse email pour recevoir un lien de réinitialisation.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className='space-y-4'>
            <div>
              <Label htmlFor='email' className='text-lg text-gray-700'>Email</Label>
              <Input 
                id='email' 
                name='email' 
                type='email' 
                placeholder='m@example.com' 
                className='border p-3 shadow-md border-gray-300 rounded-lg w-full text-lg' 
                required 
              />
            </div>
            <Button className='w-full bg-[#1a4162] text-white text-lg p-3 rounded-lg shadow-md hover:scale-105 transition duration-300 ease-in-out'>
              Envoyer un email de vérification
            </Button>
          </form>
          <div className='mt-4 text-center text-sm text-gray-600'>
            Se souvenir de mon mot de passe ?{' '}
            <Link href='/login' className='text-blue-500 underline'>Se connecter</Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
