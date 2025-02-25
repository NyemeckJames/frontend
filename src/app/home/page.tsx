import Link from "next/link";
import React from "react";
import "./home.scss";
import Image from "next/image";
import mboalogo from "../../../public/Images/Mboa_event.png";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const page = () => {
  return (
    <div className="home">
      <style>
        @import
        url('https://fonts.googleapis.com/css2?family=Platypi:ital,wght@0,300..800;1,300..800&family=Podkova:wght@400..800&display=swap');
      </style>
      <nav>
        <Image src={mboalogo} alt={""} objectFit="contain" className="logo" />
        <ul className="nav-items">
          <li>
            <a href="/Login">
              <span>Se connecter</span>{" "}
            </a>
          </li>
          <li>
            <Link href={""}>
              <span>S'inscrire</span>
            </Link>
          </li>
          <li>
            <Link href={""}>
              <span>Publier un évènement</span>
            </Link>
          </li>
        </ul>
      </nav>
      <main className="grid">
        <section className="welcome flex justify-center text-center items-center">
          <span className="text-[40px] font-[1000] p-[64px]">
            {" "}
            Gérez, planifiez et promouvez vos événements en toute simplicité.
            Promoteur ou participant, vivez des expériences inoubliables avec
            nous !
          </span>
        </section>
        <section className="search-section shadow-md mx-auto w-[80%] mb-[64px] flex justify-center text-center items-center ">
          <div className="flex flex-row w-full h-12 justify-center items-center flex-nowrap gap-1.5 bg-white">
            <Input type="text" id="eventname" className="focus:outline-none border-white" placeholder="Rechercher..." />
            <Input type="text" id="place" className="focus:outline-none border-white" placeholder="Lieu..." />
            <Select>
              <SelectTrigger className="w-[180px] focus:outline-none border-white">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Event category</SelectLabel>
                  <SelectItem value="apple">Anniversaire</SelectItem>
                  <SelectItem value="banana">Mariage</SelectItem>
                  <SelectItem value="blueberry">Njoka</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </section>
        <section className="event-list flex justify-center items-center w-[90%] mb-4 mx-auto">
          <div className="w-full grid grid-cols-[repeat(auto-fit,minmax(288px,1fr))] ml-4 gap-y-2">
            <div className="relative flex flex-col bg-white shadow-sm border border-slate-200 rounded-lg w-72">
              <div className="relative h-56 m-1 overflow-hidden text-white rounded-md">
                <Image
                  src="http://127.0.0.1:8000/media/evenements/Goku.jpg"
                  className="object-contain"
                  fill
                  alt="card-image"
                />
              </div>
              <div className="p-1">
                <div className="flex flex-row flex-wrap gap-1">
                  <div className="mb-1 rounded-[5px] py-0.5 px-2.5 border border-transparent text-xs text-[#1a4162] transition-all shadow-sm w-auto text-center">
                    #ANNIVERSAIRE
                  </div>
                  <div className="mb-1 rounded-[5px] bg-orange-600 py-0.5 px-2.5 border border-transparent text-xs text-white transition-all shadow-sm w-auto text-center">
                    GRATUIT
                  </div>
                </div>
                <h6 className="mb-1 text-slate-800 text-xl font-semibold">
                  Website Review Check
                </h6>
                <p className="text-slate-600 leading-normal font-light">Yaoundé, 20 000 Xaf </p>
              </div>

              <div className="flex items-center justify-between p-4">
                <div className="flex items-center">
                  <img
                    alt="Tania Andrew"
                    src="https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-1.2.1&amp;ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&amp;auto=format&amp;fit=crop&amp;w=1480&amp;q=80"
                    className="relative inline-block h-8 w-8 rounded-full"
                  />
                  <div className="flex flex-col ml-3 text-sm">
                    <span className="text-slate-800 font-semibold">
                      Lewis Daniel
                    </span>
                    <span className="text-slate-600">January 10, 2024</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative flex flex-col bg-white shadow-sm border border-slate-200 rounded-lg w-72">
              <div className="relative h-56 m-1 overflow-hidden text-white rounded-md">
                <Image
                  src="http://127.0.0.1:8000/media/evenements/Goku.jpg"
                  className="object-contain"
                  fill
                  alt="card-image"
                />
              </div>
              <div className="p-1">
                <div className="flex flex-row flex-wrap gap-1">
                  <div className="mb-1 rounded-[5px] py-0.5 px-2.5 border border-transparent text-xs text-[#1a4162] transition-all shadow-sm w-auto text-center">
                    #ANNIVERSAIRE
                  </div>
                  <div className="mb-1 rounded-[5px] bg-orange-600 py-0.5 px-2.5 border border-transparent text-xs text-white transition-all shadow-sm w-auto text-center">
                    GRATUIT
                  </div>
                </div>
                <h6 className="mb-1 text-slate-800 text-xl font-semibold">
                  Website Review Check
                </h6>
                <p className="text-slate-600 leading-normal font-light">Yaoundé, 20 000 Xaf </p>
              </div>

              <div className="flex items-center justify-between p-4">
                <div className="flex items-center">
                  <img
                    alt="Tania Andrew"
                    src="https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-1.2.1&amp;ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&amp;auto=format&amp;fit=crop&amp;w=1480&amp;q=80"
                    className="relative inline-block h-8 w-8 rounded-full"
                  />
                  <div className="flex flex-col ml-3 text-sm">
                    <span className="text-slate-800 font-semibold">
                      Lewis Daniel
                    </span>
                    <span className="text-slate-600">January 10, 2024</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative flex flex-col bg-white shadow-sm border border-slate-200 rounded-lg w-72">
              <div className="relative h-56 m-1 overflow-hidden text-white rounded-md">
                <Image
                  src="http://127.0.0.1:8000/media/evenements/Goku.jpg"
                  className="object-contain"
                  fill
                  alt="card-image"
                />
              </div>
              <div className="p-1">
                <div className="flex flex-row flex-wrap gap-1">
                  <div className="mb-1 rounded-[5px] py-0.5 px-2.5 border border-transparent text-xs text-[#1a4162] transition-all shadow-sm w-auto text-center">
                    #ANNIVERSAIRE
                  </div>
                  <div className="mb-1 rounded-[5px] bg-orange-600 py-0.5 px-2.5 border border-transparent text-xs text-white transition-all shadow-sm w-auto text-center">
                    GRATUIT
                  </div>
                </div>
                <h6 className="mb-1 text-slate-800 text-xl font-semibold">
                  Website Review Check
                </h6>
                <p className="text-slate-600 leading-normal font-light">Yaoundé, 20 000 Xaf </p>
              </div>

              <div className="flex items-center justify-between p-4">
                <div className="flex items-center">
                  <img
                    alt="Tania Andrew"
                    src="https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-1.2.1&amp;ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&amp;auto=format&amp;fit=crop&amp;w=1480&amp;q=80"
                    className="relative inline-block h-8 w-8 rounded-full"
                  />
                  <div className="flex flex-col ml-3 text-sm">
                    <span className="text-slate-800 font-semibold">
                      Lewis Daniel
                    </span>
                    <span className="text-slate-600">January 10, 2024</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative flex flex-col bg-white shadow-sm border border-slate-200 rounded-lg w-72">
              <div className="relative h-56 m-1 overflow-hidden text-white rounded-md">
                <Image
                  src="http://127.0.0.1:8000/media/evenements/Goku.jpg"
                  className="object-contain"
                  fill
                  alt="card-image"
                />
              </div>
              <div className="p-1">
                <div className="flex flex-row flex-wrap gap-1">
                  <div className="mb-1 rounded-[5px] py-0.5 px-2.5 border border-transparent text-xs text-[#1a4162] transition-all shadow-sm w-auto text-center">
                    #ANNIVERSAIRE
                  </div>
                  <div className="mb-1 rounded-[5px] bg-orange-600 py-0.5 px-2.5 border border-transparent text-xs text-white transition-all shadow-sm w-auto text-center">
                    GRATUIT
                  </div>
                </div>
                <h6 className="mb-1 text-slate-800 text-xl font-semibold">
                  Website Review Check
                </h6>
                <p className="text-slate-600 leading-normal font-light">Yaoundé, 20 000 Xaf </p>
              </div>

              <div className="flex items-center justify-between p-4">
                <div className="flex items-center">
                  <img
                    alt="Tania Andrew"
                    src="https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-1.2.1&amp;ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&amp;auto=format&amp;fit=crop&amp;w=1480&amp;q=80"
                    className="relative inline-block h-8 w-8 rounded-full"
                  />
                  <div className="flex flex-col ml-3 text-sm">
                    <span className="text-slate-800 font-semibold">
                      Lewis Daniel
                    </span>
                    <span className="text-slate-600">January 10, 2024</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative flex flex-col bg-white shadow-sm border border-slate-200 rounded-lg w-72">
              <div className="relative h-56 m-1 overflow-hidden text-white rounded-md">
                <Image
                  src="http://127.0.0.1:8000/media/evenements/Goku.jpg"
                  className="object-contain"
                  fill
                  alt="card-image"
                />
              </div>
              <div className="p-1">
                <div className="flex flex-row flex-wrap gap-1">
                  <div className="mb-1 rounded-[5px] py-0.5 px-2.5 border border-transparent text-xs text-[#1a4162] transition-all shadow-sm w-auto text-center">
                    #ANNIVERSAIRE
                  </div>
                  <div className="mb-1 rounded-[5px] bg-orange-600 py-0.5 px-2.5 border border-transparent text-xs text-white transition-all shadow-sm w-auto text-center">
                    GRATUIT
                  </div>
                </div>
                <h6 className="mb-1 text-slate-800 text-xl font-semibold">
                  Website Review Check
                </h6>
                <p className="text-slate-600 leading-normal font-light">Yaoundé, 20 000 Xaf </p>
              </div>

              <div className="flex items-center justify-between p-4">
                <div className="flex items-center">
                  <img
                    alt="Tania Andrew"
                    src="https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-1.2.1&amp;ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&amp;auto=format&amp;fit=crop&amp;w=1480&amp;q=80"
                    className="relative inline-block h-8 w-8 rounded-full"
                  />
                  <div className="flex flex-col ml-3 text-sm">
                    <span className="text-slate-800 font-semibold">
                      Lewis Daniel
                    </span>
                    <span className="text-slate-600">January 10, 2024</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative flex flex-col bg-white shadow-sm border border-slate-200 rounded-lg w-72">
              <div className="relative h-56 m-1 overflow-hidden text-white rounded-md">
                <Image
                  src="http://127.0.0.1:8000/media/evenements/Goku.jpg"
                  className="object-contain"
                  fill
                  alt="card-image"
                />
              </div>
              <div className="p-1">
                <div className="flex flex-row flex-wrap gap-1">
                  <div className="mb-1 rounded-[5px] py-0.5 px-2.5 border border-transparent text-xs text-[#1a4162] transition-all shadow-sm w-auto text-center">
                    #ANNIVERSAIRE
                  </div>
                  <div className="mb-1 rounded-[5px] bg-orange-600 py-0.5 px-2.5 border border-transparent text-xs text-white transition-all shadow-sm w-auto text-center">
                    GRATUIT
                  </div>
                </div>
                <h6 className="mb-1 text-slate-800 text-xl font-semibold">
                  Website Review Check
                </h6>
                <p className="text-slate-600 leading-normal font-light">Yaoundé, 20 000 Xaf </p>
              </div>

              <div className="flex items-center justify-between p-4">
                <div className="flex items-center">
                  <img
                    alt="Tania Andrew"
                    src="https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-1.2.1&amp;ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&amp;auto=format&amp;fit=crop&amp;w=1480&amp;q=80"
                    className="relative inline-block h-8 w-8 rounded-full"
                  />
                  <div className="flex flex-col ml-3 text-sm">
                    <span className="text-slate-800 font-semibold">
                      Lewis Daniel
                    </span>
                    <span className="text-slate-600">January 10, 2024</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative flex flex-col bg-white shadow-sm border border-slate-200 rounded-lg w-72">
              <div className="relative h-56 m-1 overflow-hidden text-white rounded-md">
                <Image
                  src="http://127.0.0.1:8000/media/evenements/Goku.jpg"
                  className="object-contain"
                  fill
                  alt="card-image"
                />
              </div>
              <div className="p-1">
                <div className="flex flex-row flex-wrap gap-1">
                  <div className="mb-1 rounded-[5px] py-0.5 px-2.5 border border-transparent text-xs text-[#1a4162] transition-all shadow-sm w-auto text-center">
                    #ANNIVERSAIRE
                  </div>
                  <div className="mb-1 rounded-[5px] bg-orange-600 py-0.5 px-2.5 border border-transparent text-xs text-white transition-all shadow-sm w-auto text-center">
                    GRATUIT
                  </div>
                </div>
                <h6 className="mb-1 text-slate-800 text-xl font-semibold">
                  Website Review Check
                </h6>
                <p className="text-slate-600 leading-normal font-light">Yaoundé, 20 000 Xaf </p>
              </div>

              <div className="flex items-center justify-between p-4">
                <div className="flex items-center">
                  <img
                    alt="Tania Andrew"
                    src="https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-1.2.1&amp;ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&amp;auto=format&amp;fit=crop&amp;w=1480&amp;q=80"
                    className="relative inline-block h-8 w-8 rounded-full"
                  />
                  <div className="flex flex-col ml-3 text-sm">
                    <span className="text-slate-800 font-semibold">
                      Lewis Daniel
                    </span>
                    <span className="text-slate-600">January 10, 2024</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative flex flex-col bg-white shadow-sm border border-slate-200 rounded-lg w-72">
              <div className="relative h-56 m-1 overflow-hidden text-white rounded-md">
                <Image
                  src="http://127.0.0.1:8000/media/evenements/Goku.jpg"
                  className="object-contain"
                  fill
                  alt="card-image"
                />
              </div>
              <div className="p-1">
                <div className="flex flex-row flex-wrap gap-1">
                  <div className="mb-1 rounded-[5px] py-0.5 px-2.5 border border-transparent text-xs text-[#1a4162] transition-all shadow-sm w-auto text-center">
                    #ANNIVERSAIRE
                  </div>
                  <div className="mb-1 rounded-[5px] bg-orange-600 py-0.5 px-2.5 border border-transparent text-xs text-white transition-all shadow-sm w-auto text-center">
                    GRATUIT
                  </div>
                </div>
                <h6 className="mb-1 text-slate-800 text-xl font-semibold">
                  Website Review Check
                </h6>
                <p className="text-slate-600 leading-normal font-light">Yaoundé, 20 000 Xaf </p>
              </div>

              <div className="flex items-center justify-between p-4">
                <div className="flex items-center">
                  <img
                    alt="Tania Andrew"
                    src="https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-1.2.1&amp;ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&amp;auto=format&amp;fit=crop&amp;w=1480&amp;q=80"
                    className="relative inline-block h-8 w-8 rounded-full"
                  />
                  <div className="flex flex-col ml-3 text-sm">
                    <span className="text-slate-800 font-semibold">
                      Lewis Daniel
                    </span>
                    <span className="text-slate-600">January 10, 2024</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative flex flex-col bg-white shadow-sm border border-slate-200 rounded-lg w-72">
              <div className="relative h-56 m-1 overflow-hidden text-white rounded-md">
                <Image
                  src="http://127.0.0.1:8000/media/evenements/Goku.jpg"
                  className="object-contain"
                  fill
                  alt="card-image"
                />
              </div>
              <div className="p-1">
                <div className="flex flex-row flex-wrap gap-1">
                  <div className="mb-1 rounded-[5px] py-0.5 px-2.5 border border-transparent text-xs text-[#1a4162] transition-all shadow-sm w-auto text-center">
                    #ANNIVERSAIRE
                  </div>
                  <div className="mb-1 rounded-[5px] bg-orange-600 py-0.5 px-2.5 border border-transparent text-xs text-white transition-all shadow-sm w-auto text-center">
                    GRATUIT
                  </div>
                </div>
                <h6 className="mb-1 text-slate-800 text-xl font-semibold">
                  Website Review Check
                </h6>
                <p className="text-slate-600 leading-normal font-light">Yaoundé, 20 000 Xaf </p>
              </div>

              <div className="flex items-center justify-between p-4">
                <div className="flex items-center">
                  <img
                    alt="Tania Andrew"
                    src="https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-1.2.1&amp;ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&amp;auto=format&amp;fit=crop&amp;w=1480&amp;q=80"
                    className="relative inline-block h-8 w-8 rounded-full"
                  />
                  <div className="flex flex-col ml-3 text-sm">
                    <span className="text-slate-800 font-semibold">
                      Lewis Daniel
                    </span>
                    <span className="text-slate-600">January 10, 2024</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative flex flex-col bg-white shadow-sm border border-slate-200 rounded-lg w-72">
              <div className="relative h-56 m-1 overflow-hidden text-white rounded-md">
                <Image
                  src="http://127.0.0.1:8000/media/evenements/Goku.jpg"
                  className="object-contain"
                  fill
                  alt="card-image"
                />
              </div>
              <div className="p-1">
                <div className="flex flex-row flex-wrap gap-1">
                  <div className="mb-1 rounded-[5px] py-0.5 px-2.5 border border-transparent text-xs text-[#1a4162] transition-all shadow-sm w-auto text-center">
                    #ANNIVERSAIRE
                  </div>
                  <div className="mb-1 rounded-[5px] bg-orange-600 py-0.5 px-2.5 border border-transparent text-xs text-white transition-all shadow-sm w-auto text-center">
                    GRATUIT
                  </div>
                </div>
                <h6 className="mb-1 text-slate-800 text-xl font-semibold">
                  Website Review Check
                </h6>
                <p className="text-slate-600 leading-normal font-light">Yaoundé, 20 000 Xaf </p>
              </div>

              <div className="flex items-center justify-between p-4">
                <div className="flex items-center">
                  <img
                    alt="Tania Andrew"
                    src="https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-1.2.1&amp;ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&amp;auto=format&amp;fit=crop&amp;w=1480&amp;q=80"
                    className="relative inline-block h-8 w-8 rounded-full"
                  />
                  <div className="flex flex-col ml-3 text-sm">
                    <span className="text-slate-800 font-semibold">
                      Lewis Daniel
                    </span>
                    <span className="text-slate-600">January 10, 2024</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative flex flex-col bg-white shadow-sm border border-slate-200 rounded-lg w-72">
              <div className="relative h-56 m-1 overflow-hidden text-white rounded-md">
                <Image
                  src="http://127.0.0.1:8000/media/evenements/Goku.jpg"
                  className="object-contain"
                  fill
                  alt="card-image"
                />
              </div>
              <div className="p-1">
                <div className="flex flex-row flex-wrap gap-1">
                  <div className="mb-1 rounded-[5px] py-0.5 px-2.5 border border-transparent text-xs text-[#1a4162] transition-all shadow-sm w-auto text-center">
                    #ANNIVERSAIRE
                  </div>
                  <div className="mb-1 rounded-[5px] bg-orange-600 py-0.5 px-2.5 border border-transparent text-xs text-white transition-all shadow-sm w-auto text-center">
                    GRATUIT
                  </div>
                </div>
                <h6 className="mb-1 text-slate-800 text-xl font-semibold">
                  Website Review Check
                </h6>
                <p className="text-slate-600 leading-normal font-light">Yaoundé, 20 000 Xaf </p>
              </div>

              <div className="flex items-center justify-between p-4">
                <div className="flex items-center">
                  <img
                    alt="Tania Andrew"
                    src="https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-1.2.1&amp;ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&amp;auto=format&amp;fit=crop&amp;w=1480&amp;q=80"
                    className="relative inline-block h-8 w-8 rounded-full"
                  />
                  <div className="flex flex-col ml-3 text-sm">
                    <span className="text-slate-800 font-semibold">
                      Lewis Daniel
                    </span>
                    <span className="text-slate-600">January 10, 2024</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative flex flex-col bg-white shadow-sm border border-slate-200 rounded-lg w-72">
              <div className="relative h-56 m-1 overflow-hidden text-white rounded-md">
                <Image
                  src="http://127.0.0.1:8000/media/evenements/Goku.jpg"
                  className="object-contain"
                  fill
                  alt="card-image"
                />
              </div>
              <div className="p-1">
                <div className="flex flex-row flex-wrap gap-1">
                  <div className="mb-1 rounded-[5px] py-0.5 px-2.5 border border-transparent text-xs text-[#1a4162] transition-all shadow-sm w-auto text-center">
                    #ANNIVERSAIRE
                  </div>
                  <div className="mb-1 rounded-[5px] bg-orange-600 py-0.5 px-2.5 border border-transparent text-xs text-white transition-all shadow-sm w-auto text-center">
                    GRATUIT
                  </div>
                </div>
                <h6 className="mb-1 text-slate-800 text-xl font-semibold">
                  Website Review Check
                </h6>
                <p className="text-slate-600 leading-normal font-light">Yaoundé, 20 000 Xaf </p>
              </div>

              <div className="flex items-center justify-between p-4">
                <div className="flex items-center">
                  <img
                    alt="Tania Andrew"
                    src="https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-1.2.1&amp;ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&amp;auto=format&amp;fit=crop&amp;w=1480&amp;q=80"
                    className="relative inline-block h-8 w-8 rounded-full"
                  />
                  <div className="flex flex-col ml-3 text-sm">
                    <span className="text-slate-800 font-semibold">
                      Lewis Daniel
                    </span>
                    <span className="text-slate-600">January 10, 2024</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative flex flex-col bg-white shadow-sm border border-slate-200 rounded-lg w-72">
              <div className="relative h-56 m-1 overflow-hidden text-white rounded-md">
                <Image
                  src="http://127.0.0.1:8000/media/evenements/Goku.jpg"
                  className="object-contain"
                  fill
                  alt="card-image"
                />
              </div>
              <div className="p-1">
                <div className="flex flex-row flex-wrap gap-1">
                  <div className="mb-1 rounded-[5px] py-0.5 px-2.5 border border-transparent text-xs text-[#1a4162] transition-all shadow-sm w-auto text-center">
                    #ANNIVERSAIRE
                  </div>
                  <div className="mb-1 rounded-[5px] bg-orange-600 py-0.5 px-2.5 border border-transparent text-xs text-white transition-all shadow-sm w-auto text-center">
                    GRATUIT
                  </div>
                </div>
                <h6 className="mb-1 text-slate-800 text-xl font-semibold">
                  Website Review Check
                </h6>
                <p className="text-slate-600 leading-normal font-light">Yaoundé, 20 000 Xaf </p>
              </div>

              <div className="flex items-center justify-between p-4">
                <div className="flex items-center">
                  <img
                    alt="Tania Andrew"
                    src="https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-1.2.1&amp;ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&amp;auto=format&amp;fit=crop&amp;w=1480&amp;q=80"
                    className="relative inline-block h-8 w-8 rounded-full"
                  />
                  <div className="flex flex-col ml-3 text-sm">
                    <span className="text-slate-800 font-semibold">
                      Lewis Daniel
                    </span>
                    <span className="text-slate-600">January 10, 2024</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative flex flex-col bg-white shadow-sm border border-slate-200 rounded-lg w-72">
              <div className="relative h-56 m-1 overflow-hidden text-white rounded-md">
                <Image
                  src="http://127.0.0.1:8000/media/evenements/Goku.jpg"
                  className="object-contain"
                  fill
                  alt="card-image"
                />
              </div>
              <div className="p-1">
                <div className="flex flex-row flex-wrap gap-1">
                  <div className="mb-1 rounded-[5px] py-0.5 px-2.5 border border-transparent text-xs text-[#1a4162] transition-all shadow-sm w-auto text-center">
                    #ANNIVERSAIRE
                  </div>
                  <div className="mb-1 rounded-[5px] bg-orange-600 py-0.5 px-2.5 border border-transparent text-xs text-white transition-all shadow-sm w-auto text-center">
                    GRATUIT
                  </div>
                </div>
                <h6 className="mb-1 text-slate-800 text-xl font-semibold">
                  Website Review Check
                </h6>
                <p className="text-slate-600 leading-normal font-light">Yaoundé, 20 000 Xaf </p>
              </div>

              <div className="flex items-center justify-between p-4">
                <div className="flex items-center">
                  <img
                    alt="Tania Andrew"
                    src="https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-1.2.1&amp;ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&amp;auto=format&amp;fit=crop&amp;w=1480&amp;q=80"
                    className="relative inline-block h-8 w-8 rounded-full"
                  />
                  <div className="flex flex-col ml-3 text-sm">
                    <span className="text-slate-800 font-semibold">
                      Lewis Daniel
                    </span>
                    <span className="text-slate-600">January 10, 2024</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative flex flex-col bg-white shadow-sm border border-slate-200 rounded-lg w-72">
              <div className="relative h-56 m-1 overflow-hidden text-white rounded-md">
                <Image
                  src="http://127.0.0.1:8000/media/evenements/Goku.jpg"
                  className="object-contain"
                  fill
                  alt="card-image"
                />
              </div>
              <div className="p-1">
                <div className="flex flex-row flex-wrap gap-1">
                  <div className="mb-1 rounded-[5px] py-0.5 px-2.5 border border-transparent text-xs text-[#1a4162] transition-all shadow-sm w-auto text-center">
                    #ANNIVERSAIRE
                  </div>
                  <div className="mb-1 rounded-[5px] bg-orange-600 py-0.5 px-2.5 border border-transparent text-xs text-white transition-all shadow-sm w-auto text-center">
                    GRATUIT
                  </div>
                </div>
                <h6 className="mb-1 text-slate-800 text-xl font-semibold">
                  Website Review Check
                </h6>
                <p className="text-slate-600 leading-normal font-light">Yaoundé, 20 000 Xaf </p>
              </div>

              <div className="flex items-center justify-between p-4">
                <div className="flex items-center">
                  <img
                    alt="Tania Andrew"
                    src="https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-1.2.1&amp;ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&amp;auto=format&amp;fit=crop&amp;w=1480&amp;q=80"
                    className="relative inline-block h-8 w-8 rounded-full"
                  />
                  <div className="flex flex-col ml-3 text-sm">
                    <span className="text-slate-800 font-semibold">
                      Lewis Daniel
                    </span>
                    <span className="text-slate-600">January 10, 2024</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative flex flex-col bg-white shadow-sm border border-slate-200 rounded-lg w-72">
              <div className="relative h-56 m-1 overflow-hidden text-white rounded-md">
                <Image
                  src="http://127.0.0.1:8000/media/evenements/Goku.jpg"
                  className="object-contain"
                  fill
                  alt="card-image"
                />
              </div>
              <div className="p-1">
                <div className="flex flex-row flex-wrap gap-1">
                  <div className="mb-1 rounded-[5px] py-0.5 px-2.5 border border-transparent text-xs text-[#1a4162] transition-all shadow-sm w-auto text-center">
                    #ANNIVERSAIRE
                  </div>
                  <div className="mb-1 rounded-[5px] bg-orange-600 py-0.5 px-2.5 border border-transparent text-xs text-white transition-all shadow-sm w-auto text-center">
                    GRATUIT
                  </div>
                </div>
                <h6 className="mb-1 text-slate-800 text-xl font-semibold">
                  Website Review Check
                </h6>
                <p className="text-slate-600 leading-normal font-light">Yaoundé, 20 000 Xaf </p>
              </div>

              <div className="flex items-center justify-between p-4">
                <div className="flex items-center">
                  <img
                    alt="Tania Andrew"
                    src="https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-1.2.1&amp;ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&amp;auto=format&amp;fit=crop&amp;w=1480&amp;q=80"
                    className="relative inline-block h-8 w-8 rounded-full"
                  />
                  <div className="flex flex-col ml-3 text-sm">
                    <span className="text-slate-800 font-semibold">
                      Lewis Daniel
                    </span>
                    <span className="text-slate-600">January 10, 2024</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative flex flex-col bg-white shadow-sm border border-slate-200 rounded-lg w-72">
              <div className="relative h-56 m-1 overflow-hidden text-white rounded-md">
                <Image
                  src="http://127.0.0.1:8000/media/evenements/Goku.jpg"
                  className="object-contain"
                  fill
                  alt="card-image"
                />
              </div>
              <div className="p-1">
                <div className="flex flex-row flex-wrap gap-1">
                  <div className="mb-1 rounded-[5px] py-0.5 px-2.5 border border-transparent text-xs text-[#1a4162] transition-all shadow-sm w-auto text-center">
                    #ANNIVERSAIRE
                  </div>
                  <div className="mb-1 rounded-[5px] bg-orange-600 py-0.5 px-2.5 border border-transparent text-xs text-white transition-all shadow-sm w-auto text-center">
                    GRATUIT
                  </div>
                </div>
                <h6 className="mb-1 text-slate-800 text-xl font-semibold">
                  Website Review Check
                </h6>
                <p className="text-slate-600 leading-normal font-light">Yaoundé, 20 000 Xaf </p>
              </div>

              <div className="flex items-center justify-between p-4">
                <div className="flex items-center">
                  <img
                    alt="Tania Andrew"
                    src="https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-1.2.1&amp;ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&amp;auto=format&amp;fit=crop&amp;w=1480&amp;q=80"
                    className="relative inline-block h-8 w-8 rounded-full"
                  />
                  <div className="flex flex-col ml-3 text-sm">
                    <span className="text-slate-800 font-semibold">
                      Lewis Daniel
                    </span>
                    <span className="text-slate-600">January 10, 2024</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative flex flex-col bg-white shadow-sm border border-slate-200 rounded-lg w-72">
              <div className="relative h-56 m-1 overflow-hidden text-white rounded-md">
                <Image
                  src="http://127.0.0.1:8000/media/evenements/Goku.jpg"
                  className="object-contain"
                  fill
                  alt="card-image"
                />
              </div>
              <div className="p-1">
                <div className="flex flex-row flex-wrap gap-1">
                  <div className="mb-1 rounded-[5px] py-0.5 px-2.5 border border-transparent text-xs text-[#1a4162] transition-all shadow-sm w-auto text-center">
                    #ANNIVERSAIRE
                  </div>
                  <div className="mb-1 rounded-[5px] bg-orange-600 py-0.5 px-2.5 border border-transparent text-xs text-white transition-all shadow-sm w-auto text-center">
                    GRATUIT
                  </div>
                </div>
                <h6 className="mb-1 text-slate-800 text-xl font-semibold">
                  Website Review Check
                </h6>
                <p className="text-slate-600 leading-normal font-light">Yaoundé, 20 000 Xaf </p>
              </div>

              <div className="flex items-center justify-between p-4">
                <div className="flex items-center">
                  <img
                    alt="Tania Andrew"
                    src="https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-1.2.1&amp;ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&amp;auto=format&amp;fit=crop&amp;w=1480&amp;q=80"
                    className="relative inline-block h-8 w-8 rounded-full"
                  />
                  <div className="flex flex-col ml-3 text-sm">
                    <span className="text-slate-800 font-semibold">
                      Lewis Daniel
                    </span>
                    <span className="text-slate-600">January 10, 2024</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default page;
