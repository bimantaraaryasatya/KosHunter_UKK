"use client"

import { useEffect, useState } from "react";
import { BASE_API_URL, BASE_IMAGE_KOS} from "@/global"
import Image from "next/image";
import { get } from "@/lib/api-bridge"
import { IKos } from "./types";
import { getCookie } from "@/lib/client-cookies"
import IndexImage from '@/public/images/index_image.png'
import Header from "@/components/navbar";
import Footer from "@/components/footer"

export default function IndexPage() {
  const [kos, setKos] = useState<IKos[]>([])
  const [loading, setLoading] = useState(false)


  useEffect(() => {
    const fetchKos = async () => {
      try {
        setLoading(true)

        // const token = getCookie("token")
        // if (!token) return

        const url = `${BASE_API_URL}/kos`
        const response = await get(url)

        if (response?.data?.status) {
          setKos(response.data.data)
        } else {
          setKos([])
        }
      } catch (error) {
        console.log(error)
        setKos([])
      } finally {
        setLoading(false)
      }
    }

    fetchKos();
  }, []);
  return (
    <div>
      <Header/>

      {/* First Page */}
      <main className="px-6 py-8 md:px-20 md:py-18">
        <div className="flex flex-col md:flex-row justify-between lg:gap-10">
          <div className="flex flex-col justify-center gap-2">
            <div>
              <h4 className="text-md md:text-xl font-semibold text-primary">Kos Hunter</h4>
            </div>
            <div className="flex flex-col gap-3">
              <h1 className="text-5xl md:text-7xl  font-bold">Find Your Kos <br /> Now</h1>
              <h4 className="text-xs md:text-base">Kos Hunter helps you find the perfect boarding house quickly and easily, anytime and anywhere</h4>
            </div>
            <div className="mt-4">
              <a href="/kos" className="bg-primary border-2 border-primary text-white px-6 py-2 lg:px-16 lg:py-3 rounded-md hover:bg-transparent hover:text-primary transition-all ease-in-out duration-300">Find Kos</a>
            </div>
          </div>

          <div>
            <Image src={IndexImage} width={650} height={650} alt="index image" className="hidden lg:block"/>
          </div>
        </div>
      </main>

      {/* Second Page */}
      <main className="px-6 md:px-20 py-4 mt-15">
        <div className="flex justify-between flex-col gap-8 md:flex-row mb-10 h-full">
          <div>
            <h1 className="text-2xl font-medium">Affordable <span className="text-primary">Kos</span> Recommendations</h1>
          </div>
          <div>
            <a href="/kos" className="py-2 px-6 border border-primary rounded-sm text-primary">See All</a>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          {loading ? (
            <p className="text-gray-500">Loading...</p>
          ) : kos.length === 0 ? (
            <p className="text-gray-500">No Kos Available</p>
          ) : (
            kos.slice(0, 4).map((data) => (
              <div
                key={data.id}
                className="border border-transparent rounded-xl overflow-hidden shadow-sm hover:scale-105 transition-all ease-in-out duration-300"
              >
                {/* Image */}
                {data.kos_images && data.kos_images.length > 0 ? (
                  <img
                    src={`${BASE_IMAGE_KOS}/${data.kos_images[0].file}`}
                    alt={data.name}
                    width={400}
                    height={250}
                    className="w-full h-60 object-cover"
                  />
                ) : (
                  <div className="h-48 bg-gray-100 flex items-center justify-center text-sm text-gray-400">
                    No Image
                  </div>
                )}

                {/* Content */}
                <div className="p-4 flex flex-col gap-2">
                  <div className="flex justify-between text-sm">
                    <span className="capitalize">{data.gender}</span>
                    <span
                      className={`font-semibold ${
                        data.available_room === 0
                          ? "text-red-500"
                          : "text-green-500"
                      }`}
                    >
                      {data.available_room === 0 ? "FULL" : "AVAILABLE"}
                    </span>
                  </div>

                  <h1 className="text-lg font-bold">{data.name}</h1>
                  <p className="text-sm text-gray-500 line-clamp-2">
                    {data.address}
                  </p>

                  <div className="flex justify-between items-center mt-3">
                    <h2 className="text-primary font-bold">
                      Rp{data.price_per_month.toLocaleString("id-ID")}
                    </h2>
                    <a
                      href={`/kos/${data.id}`}
                      className="bg-primary text-white px-4 py-1 rounded-md hover:opacity-90"
                    >
                      Book
                    </a>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </main>

      <Footer/>
    </div>
  );
}
