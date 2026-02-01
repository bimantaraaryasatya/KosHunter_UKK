"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Header from "@/components/navbar"
import Footer from "@/components/footer"
import { IKos } from "@/app/types"
import { getCookie } from "@/lib/client-cookies"
import { BASE_API_URL, BASE_IMAGE_KOS } from "@/global"
import { get } from "@/lib/api-bridge"
import { CiSearch } from "react-icons/ci"

export default function KosSocietyPage() {
    const [kos, setKos] = useState<IKos[]>([])
    const [keyword, setKeyword] = useState("")
    const [loading, setLoading] = useState(false)

    const fetchKos = async (search = "") => {
    try {
        setLoading(true)
        const token = getCookie("token")
        const url = `${BASE_API_URL}/kos?search=${search}`
        const response = await get(url, token)

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

    // debounce search
    useEffect(() => {
        const t = setTimeout(() => {
        fetchKos(keyword)
        }, 400)

        return () => clearTimeout(t)
    }, [keyword])

    useEffect(() => {
        fetchKos()
    }, [])

    const GENDER_STYLE: Record<string, string> = {
        male: "bg-blue-100 text-blue-700",
        female: "bg-pink-100 text-pink-700",
        all: "bg-green-100 text-green-700",
    }

    return (
        <div className="min-h-screen bg-white">
            <Header />
            
            <div className="px-6 md:px-20">
                {/* SEARCH BAR */}
                <div className="mx-auto mt-6">
                    <div className="relative">
                    <CiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xl" />
                    <input
                        type="text"
                        placeholder="Search kos, address, or gender..."
                        className="w-full pl-12 pr-4 py-3 border-2 border-primary rounded-full text-sm focus:outline-none focus:ring-primary"
                        value={keyword}
                        onChange={(e) => setKeyword(e.target.value)}
                    />
                    </div>
                </div>

                {/* LIST */}
                <div className="mx-auto mt-6 space-y-4">
                    {loading && (
                    <p className="text-gray-500 text-center">Loading...</p>
                    )}

                    {!loading && kos.length === 0 && (
                    <p className="text-gray-500 text-center">No kos found</p>
                    )}

                    {kos.map((data) => (
                    <div
                        key={data.id}
                        className="flex flex-col overflow-hidden shadow-sm md:shadow-none md:flex-row gap-4 md:border-transparent rounded-xl p-4 hover:shadow-md transition"
                    >
                        {/* IMAGE */}
                        <div className="w-full md:w-70 h-40 relative rounded-lg overflow-hidden">
                        {data.kos_images && data.kos_images.length > 0 ? (
                            <img
                            src={`${BASE_IMAGE_KOS}/${data.kos_images[0].file}`}
                            alt={data.name}
                            className="h-full w-full"
                            />
                        ) : (
                            <div className="w-full h-full bg-gray-200 flex items-center justify-center text-sm text-gray-500">
                            No Image
                            </div>
                        )}
                        </div>

                        {/* INFO */}
                        <div className="flex-1 flex flex-col justify-between">
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                            <span className={`text-xs px-2 py-0.5 rounded ${GENDER_STYLE[data.gender?.toLowerCase() ?? ""] || "bg-gray-100 text-gray-600"}`}>
                                {data.gender ?? "All"}
                            </span>
                            <span className="text-xs text-red-500">
                                {data.available_room} Rooms Left
                            </span>
                            </div>

                            <h3 className="font-semibold text-2xl text-gray-800">
                            {data.name}
                            </h3>

                            <p className="text-sm text-gray-500 mt-1">
                            Private Bathroom, WIFI, AC
                            </p>
                        </div>

                        <a href={`/kos/${data.id}`} className="mt-4 md:mt-0 w-fit bg-primary text-white text-sm px-5 md:px-15 py-2 rounded-lg hover:opacity-90">
                            Book
                        </a>
                        </div>

                        {/* PRICE */}
                        <div className="md:w-48 flex md:flex-col justify-between md:justify-center text-right">
                        <p className="text-sm text-gray-500">Price / Month</p>
                        <p className="font-semibold text-gray-800">
                            Rp{data.price_per_month.toLocaleString("id-ID")}
                        </p>
                        </div>
                    </div>
                    ))}
                </div>
            </div>
            <Footer />
        </div>
    )
}
