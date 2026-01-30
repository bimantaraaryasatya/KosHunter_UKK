"use client"

import { useEffect, useState } from "react"
import { IKos } from "@/app/types"
import { getCookie } from "@/lib/client-cookies"
import { BASE_API_URL, BASE_IMAGE_KOS } from "@/global"
import { get } from "@/lib/api-bridge"
import AddKos from "./addKos"
import UpdateKos from "./updateKos"
import DeleteKos from "./deleteKos"

export default function KosPage() {
    const [kos, setKos] = useState<IKos[]>([])
    const [keyword, setKeyword] = useState("")
    const [loading, setLoading] = useState(false)

    const fetchMyKos = async () => {
        try {
            setLoading(true)
            const token = getCookie("token")
            if (!token) return

            const url = `${BASE_API_URL}/kos/my`
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

    useEffect(() => {
        fetchMyKos()
    }, [])

    const GENDER_STYLE: Record<string, string> = {
        male: "bg-blue-100 text-blue-700",
        female: "bg-pink-100 text-pink-700",
        all: "bg-green-100 text-green-700",
    }

    const filteredKos = kos.filter(k =>
        k.name.toLowerCase().includes(keyword.toLowerCase()) ||
        k.address.toLowerCase().includes(keyword.toLowerCase())
    )

    return (
        <div className="bg-white rounded-xl p-5 border-t-4 border-t-primary shadow-md">
            <h4 className="text-xl font-bold mb-2 text-black">My Kos</h4>
            <p className="text-sm text-gray-500 mb-4">
                Manage your own kos
            </p>

            {/* CONTENT */}
            {loading ? (
                <p className="text-gray-500">Loading...</p>
            ) : kos.length === 0 ? (
                <div className="text-center py-10">
                    <p className="text-gray-500 mb-4">
                        You don't have any kos yet
                    </p>
                    <AddKos onSuccess={() => fetchMyKos()} />
                </div>
            ) : (
                <div className="hidden md:block overflow-x-auto">
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="bg-cyan-50 text-left text-sm text-primary">
                                <th className="p-3">Image</th>
                                <th className="p-3">Name</th>
                                <th className="p-3">Address</th>
                                <th className="p-3">Price / Month</th>
                                <th className="p-3">Total Room</th>
                                <th className="p-3">Available</th>
                                <th className="p-3">Gender</th>
                                <th className="p-3 text-center">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredKos.map((data) => (
                                <tr
                                    key={data.id}
                                    className="border-b border-[#E8E8E8] hover:bg-gray-50 transition"
                                >
                                    <td className="p-3">
                                        {data.kos_images?.length ? (
                                            <img
                                                src={`${BASE_IMAGE_KOS}/${data.kos_images[0].file}`}
                                                alt={data.name}
                                                className="h-20 w-20 object-cover rounded-full"
                                            />
                                        ) : (
                                            <span className="text-gray-400 text-sm">No Image</span>
                                        )}
                                    </td>
                                    <td className="p-3 font-medium text-gray-800">
                                        {data.name}
                                    </td>
                                    <td className="p-3 text-gray-600">
                                        {data.address}
                                    </td>
                                    <td className="p-3 text-gray-600">
                                        Rp{data.price_per_month.toLocaleString("id-ID")}
                                    </td>
                                    <td className="p-3 text-gray-600">
                                        {data.total_room}
                                    </td>
                                    <td className="p-3 text-gray-600">
                                        {data.available_room}
                                    </td>
                                    <td className="p-3">
                                        <span
                                            className={`px-3 py-1 text-xs rounded-full font-semibold ${
                                                GENDER_STYLE[data.gender?.toLowerCase() ?? ""] ||
                                                "bg-gray-100 text-gray-600"
                                            }`}
                                        >
                                            {data.gender ?? "-"}
                                        </span>
                                    </td>
                                    <td className="p-3">
                                        <div className="flex gap-4 justify-center items-center">
                                            <UpdateKos selectedKos={data} onSuccess={() => setTimeout(() => fetchMyKos(), 1000)}/>
                                            <DeleteKos selectedKos={data} onSuccess={() => setTimeout(() => fetchMyKos(), 1000)}/>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    )
}
