"use client"

import { useEffect, useState } from "react"
import { getCookie } from "@/lib/client-cookies"
import { jwtDecode } from "jwt-decode"
import { IUser, IKos, IBook } from "@/app/types"
import { BASE_API_URL } from "@/global"
import { get } from "@/lib/api-bridge"
import { FaHome, FaUsers, FaBook } from "react-icons/fa"

const AdminDashboard = () => {
    const [user, setUser] = useState<IUser | null>(null)
    const [kosCount, setKosCount] = useState(0)
    const [userCount, setUserCount] = useState(0)
    const [bookCount, setBookCount] = useState(0)
    const [recentKos, setRecentKos] = useState<IKos[]>([])
    
    useEffect(() => {
        const token = getCookie("token")
        if (!token) return

        try {
        const decoded: IUser = jwtDecode(token)
        setUser(decoded)
        } catch (err) {
        console.error(err)
        }

        const fetchSummary = async () => {
        try {
            const [kosRes, userRes, bookRes] = await Promise.all([
            get(`${BASE_API_URL}/kos`, token),
            get(`${BASE_API_URL}/user`, token),
            get(`${BASE_API_URL}/book`, token),
            ])

            const kosData = kosRes?.data?.data || []

            setKosCount(kosRes?.data?.data?.length || 0)
            setUserCount(userRes?.data?.data?.length || 0)
            setBookCount(bookRes?.data?.data?.length || 0)

            const sortedKos = [...kosData].sort(
                (a, b) =>
                new Date(b.createdAt!).getTime() -
                new Date(a.createdAt!).getTime()
            )

            setRecentKos(sortedKos.slice(0, 5))
        } catch (error) {
            console.error(error)
        }
        }

        fetchSummary()
    }, [])

    return (
        <div className="min-h-screen p-6 bg-gray-50">
        {/* HEADER */}
        <div className="mb-6">
            <h1 className="text-2xl font-bold text-black">
            Welcome back, {user?.name} 👋
            </h1>
            <p className="text-gray-500 text-sm">
            Here’s what’s happening in your system today
            </p>
        </div>

        {/* SUMMARY CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* TOTAL KOS */}
            <div className="bg-white rounded-xl p-5 shadow-md border-t-4 border-t-primary">
            <div className="flex items-center gap-4">
                <div className="p-3 bg-cyan-100 rounded-full text-primary">
                <FaHome size={20} />
                </div>
                <div>
                <p className="text-sm text-gray-500">Total Kos</p>
                <h2 className="text-2xl font-bold text-black">{kosCount}</h2>
                </div>
            </div>
            </div>

            {/* TOTAL USER */}
            <div className="bg-white rounded-xl p-5 shadow-md border-t-4 border-t-primary">
            <div className="flex items-center gap-4">
                <div className="p-3 bg-green-100 rounded-full text-green-600">
                <FaUsers size={20} />
                </div>
                <div>
                <p className="text-sm text-gray-500">Registered Users</p>
                <h2 className="text-2xl font-bold text-black">{userCount}</h2>
                </div>
            </div>
            </div>

            {/* TOTAL BOOKING */}
            <div className="bg-white rounded-xl p-5 shadow-md border-t-4 border-t-primary">
            <div className="flex items-center gap-4">
                <div className="p-3 bg-purple-100 rounded-full text-purple-600">
                <FaBook size={20} />
                </div>
                <div>
                <p className="text-sm text-gray-500">Total Bookings</p>
                <h2 className="text-2xl font-bold text-black">{bookCount}</h2>
                </div>
            </div>
            </div>
        </div>

        <div className="mt-8 bg-white rounded-xl p-5 shadow-md border-t-4 border-t-primary">
            <h3 className="text-lg font-bold text-black mb-4">
                🏠 Latest Registered Kos
            </h3>

            {recentKos.length === 0 ? (
                <p className="text-gray-500 text-sm">No data</p>
            ) : (
                <div className="overflow-x-auto">
                <table className="w-full text-sm">
                    <thead>
                    <tr className="text-left text-primary bg-cyan-50">
                        <th className="p-3">Name</th>
                        <th className="p-3">Address</th>
                        <th className="p-3">Owner</th>
                        <th className="p-3">Price / Month</th>
                        <th className="p-3">Registered At</th>
                    </tr>
                    </thead>
                    <tbody>
                    {recentKos.map((kos) => (
                        <tr
                        key={kos.id}
                        className="border-b border-[#E8E8E8] hover:bg-gray-50 transition"
                        >
                        <td className="p-3 font-medium text-gray-800">
                            {kos.name}
                        </td>
                        <td className="p-3 text-gray-600">
                            {kos.address}
                        </td>
                        <td className="p-3 text-gray-600">
                            {kos.user?.email || "-"}
                        </td>
                        <td className="p-3 text-gray-600">
                            Rp{kos.price_per_month.toLocaleString("id-ID")}
                        </td>
                        <td className="p-3 text-gray-600">
                            {kos.createdAt
                            ? new Date(kos.createdAt).toLocaleDateString("id-ID", {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                                })
                            : "-"}
                        </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
                </div>
            )}
        </div>
        </div>
    )
}

export default AdminDashboard
