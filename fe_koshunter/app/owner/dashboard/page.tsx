"use client"

import { useEffect, useState } from "react"
import { getCookie } from "@/lib/client-cookies"
import { jwtDecode } from "jwt-decode"
import { IUser, IKos, IBook, IReview } from "@/app/types"
import { BASE_API_URL } from "@/global"
import { get } from "@/lib/api-bridge"
import { FaHome, FaBook, FaStar } from "react-icons/fa"

const OwnerDashboard = () => {
    const [user, setUser] = useState<IUser | null>(null)

    const [kosCount, setKosCount] = useState(0)
    const [bookCount, setBookCount] = useState(0)
    const [reviewCount, setReviewCount] = useState(0)

    const [recentBooks, setRecentBooks] = useState<IBook[]>([])

    useEffect(() => {
        const token = getCookie("token")
        if (!token) return

        try {
        const decoded: IUser = jwtDecode(token)
        setUser(decoded)
        } catch (err) {
        console.error(err)
        }

        const fetchOwnerData = async () => {
        try {
            const [kosRes, bookRes, reviewRes] = await Promise.all([
            get(`${BASE_API_URL}/kos/my`, token),
            get(`${BASE_API_URL}/book/my`, token),
            get(`${BASE_API_URL}/review/my`, token),
            ])

            const kosData = kosRes?.data?.data || []
            const bookData = bookRes?.data?.data || []
            const reviewData = reviewRes?.data?.data || []

            setKosCount(kosData.length)
            setBookCount(bookData.length)
            setReviewCount(reviewData.length)

            // 🔥 sort booking terbaru
            const sortedBooks = [...bookData].sort(
            (a, b) =>
                new Date(b.created_at!).getTime() -
                new Date(a.created_at!).getTime()
            )

            setRecentBooks(sortedBooks.slice(0, 5))
        } catch (error) {
            console.error(error)
        }
        }

        fetchOwnerData()
    }, [])

    const STATUS_STYLE: Record<string, string> = {
        pending: "bg-yellow-100 text-yellow-600",
        accepted: "bg-green-100 text-green-600",
        rejected: "bg-red-100 text-red-600",
    }

    return (
        <div className="min-h-screen p-6 bg-gray-50">
        {/* HEADER */}
        <div className="mb-6">
            <h1 className="text-2xl font-bold text-black">
            Welcome back, {user?.name} 👋
            </h1>
            <p className="text-gray-500 text-sm">
            Overview of your kos performance
            </p>
        </div>

        {/* SUMMARY CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* MY KOS */}
            <div className="bg-white rounded-xl p-5 shadow-md border-t-4 border-t-primary">
            <div className="flex items-center gap-4">
                <div className="p-3 bg-cyan-100 rounded-full text-primary">
                <FaHome size={20} />
                </div>
                <div>
                <p className="text-sm text-gray-500">My Kos</p>
                <h2 className="text-2xl font-bold text-black">{kosCount}</h2>
                </div>
            </div>
            </div>

            {/* MY BOOKINGS */}
            <div className="bg-white rounded-xl p-5 shadow-md border-t-4 border-t-primary">
            <div className="flex items-center gap-4">
                <div className="p-3 bg-green-100 rounded-full text-green-600">
                <FaBook size={20} />
                </div>
                <div>
                <p className="text-sm text-gray-500">Total Bookings</p>
                <h2 className="text-2xl font-bold text-black">{bookCount}</h2>
                </div>
            </div>
            </div>

            {/* MY REVIEWS */}
            <div className="bg-white rounded-xl p-5 shadow-md border-t-4 border-t-primary">
            <div className="flex items-center gap-4">
                <div className="p-3 bg-yellow-100 rounded-full text-yellow-600">
                <FaStar size={20} />
                </div>
                <div>
                <p className="text-sm text-gray-500">Total Reviews</p>
                <h2 className="text-2xl font-bold text-black">{reviewCount}</h2>
                </div>
            </div>
            </div>
        </div>

        {/* RECENT BOOKINGS */}
        <div className="mt-8 bg-white rounded-xl p-5 shadow-md border-t-4 border-t-primary">
            <h3 className="text-lg font-bold text-black mb-4">
            📅 Recent Bookings
            </h3>

            {recentBooks.length === 0 ? (
            <p className="text-gray-500 text-sm">
                No recent bookings
            </p>
            ) : (
            <div className="overflow-x-auto">
                <table className="w-full text-sm">
                <thead>
                    <tr className="bg-cyan-50 text-left text-primary">
                    <th className="p-3">User Email</th>
                    <th className="p-3">Kos Name</th>
                    <th className="p-3">Start</th>
                    <th className="p-3">End</th>
                    <th className="p-3">Status</th>
                    </tr>
                </thead>
                <tbody>
                    {recentBooks.map((book) => (
                    <tr
                        key={book.id}
                        className="border-b border-[#E8E8E8] hover:bg-gray-50 transition"
                    >
                        <td className="p-3 text-gray-700">
                        {book.user?.email ?? "-"}
                        </td>
                        <td className="p-3 text-gray-700">
                        {book.kos?.name ?? "-"}
                        </td>
                        <td className="p-3 text-gray-600">
                        {book.start_date}
                        </td>
                        <td className="p-3 text-gray-600">
                        {book.end_date}
                        </td>
                        <td className="p-3">
                        <span className={`px-3 py-1 text-xs rounded-full bg-gray-100 text-gray-600 ${STATUS_STYLE[book.status] || ""}`}>
                            {book.status}
                        </span>
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

export default OwnerDashboard
