"use client"

import { useEffect, useState } from "react"
import { IKos } from "@/app/types"
import { getCookie } from "@/lib/client-cookies"
import { BASE_API_URL } from "@/global"
import { get } from "@/lib/api-bridge"
import { CiSearch } from "react-icons/ci"

export default function KosPage() {
    const [kos, setKos] = useState<IKos[]>([])
    const [keyword, setKeyword] = useState("")
    const [loading, setLoading] = useState(false)

    const fetchUsers = async (search = "") => {
        try {
            setLoading(true)
            const token = getCookie("token")
            if (!token) return

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
            fetchUsers(keyword)
        }, 400)

        return () => clearTimeout(t)
    }, [keyword])

    // initial load
    useEffect(() => {
        fetchUsers()
    }, [])

    return (
        <div className="bg-white rounded-xl p-5 border-t-4 border-t-primary shadow-md">
            <h4 className="text-xl font-bold mb-2 text-black">Kos Data</h4>
            <p className="text-sm text-gray-500 mb-4">
                Manage all registered kos
            </p>

            {/* TOP BAR */}
            <div className="flex justify-between items-center mb-4 gap-4">
                {/* SEARCH */}
                <div className="relative w-full max-w-md">
                    <CiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-text" />
                    <input
                        type="text"
                        placeholder="Search user..."
                        className="w-full pl-10 pr-4 py-2 border border-primary rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                        value={keyword}
                        onChange={(e) => setKeyword(e.target.value)}
                    />
                </div>

                {/* <AddUser onSuccess={() => setTimeout(() => fetchUsers(), 1000)}/> */}
            </div>

            {/* CONTENT */}
            {loading ? (
                <p className="text-gray-500">Loading...</p>
            ) : kos.length === 0 ? (
                <p className="text-gray-500">No Data</p>
            ) : (
                <div className="hidden md:block overflow-x-auto">
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="bg-cyan-50 text-left text-sm text-primary">
                                <th className="p-3">Name</th>
                                <th className="p-3">Address</th>
                                <th className="p-3">Price/month</th>
                                <th className="p-3">Total Room</th> 
                                <th className="p-3">Available Room</th> 
                                <th className="p-3 text-center">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {kos.map((data, index) => (
                                <tr
                                    key={index}
                                    className="border-b border-[#E8E8E8] hover:bg-gray-50 transition"
                                >
                                    <td className="p-3 font-medium text-gray-800">
                                        {data.name}
                                    </td>
                                    <td className="p-3 text-gray-600">
                                        {data.address}
                                    </td>
                                    <td className="p-3 text-gray-600">
                                        Rp{data.price_per_month.toLocaleString("id-ID")}
                                    </td>
                                    <td className="p-3">
                                        <span className="p-3 text-gray-600">
                                            {data.total_room}
                                        </span>
                                    </td>
                                    <td className="p-3">
                                        <span className="p-3 text-gray-600">
                                            {data.available_room}
                                        </span>
                                    </td>
                                    <td className="p-3 text-center flex gap-4 justify-center">
                                        {/* <UpdateUser selectedUser={data} onSuccess={() => setTimeout(() => fetchUsers(), 1000)}/> */}
                                        {/* <DeleteUser selectedUser={data} onSuccess={() => setTimeout(() => fetchUsers(), 1000)}/> */}
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