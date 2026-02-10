"use client"

import { useEffect, useState } from "react"
import { IBook } from "@/app/types"
import { getCookie } from "@/lib/client-cookies"
import { BASE_API_URL } from "@/global"
import { get } from "@/lib/api-bridge"
import { CiSearch } from "react-icons/ci"
import DeleteBook from "./deleteBook"
import UpdateBook from "./updateBook"

export default function MyBookPage() {
    const [books, setBooks] = useState<IBook[]>([])
    const [keyword, setKeyword] = useState("")
    const [loading, setLoading] = useState(false)

    const countMonths = (start: string, end: string) => {
        const startDate = new Date(start)
        const endDate = new Date(end)

        let months =
            (endDate.getFullYear() - startDate.getFullYear()) * 12 +
            (endDate.getMonth() - startDate.getMonth())

        return months <= 0 ? 1 : months
    }

    const fetchBooks = async (search = "") => {
        try {
            setLoading(true)
            const token = getCookie("token")
            if (!token) return

            // 👉 endpoint diganti /book/my
            const url = `${BASE_API_URL}/book/my?search=${search}`
            const response = await get(url, token)

            if (response?.data?.status) {
                setBooks(response.data.data)
            } else {
                setBooks([])
            }
        } catch (error) {
            console.log(error)
            setBooks([])
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        const t = setTimeout(() => {
            fetchBooks(keyword)
        }, 400)

        return () => clearTimeout(t)
    }, [keyword])

    // initial load
    useEffect(() => {
        fetchBooks()
    }, [])

    const STATUS_STYLE: Record<string, string> = {
        pending: "bg-yellow-100 text-yellow-600",
        accepted: "bg-green-100 text-green-600",
        rejected: "bg-red-100 text-red-600",
    }

    return (
        <div className="bg-white rounded-xl p-5 border-t-4 border-t-primary shadow-md">
            <h4 className="text-xl font-bold mb-2 text-black">My Kos Bookings</h4>
            <p className="text-sm text-gray-500 mb-4">
                Manage your bookings of your own kos
            </p>

            {/* TOP BAR */}
            <div className="flex justify-between items-center mb-4 gap-4">
                {/* SEARCH */}
                <div className="relative w-full max-w-md">
                    <CiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-text" />
                    <input
                        type="text"
                        placeholder="Search book..."
                        className="w-full pl-10 pr-4 py-2 border border-primary rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                        value={keyword}
                        onChange={(e) => setKeyword(e.target.value)}
                    />
                </div>
            </div>

            {/* CONTENT */}
            {loading ? (
                <p className="text-gray-500">Loading...</p>
            ) : books.length === 0 ? (
                <p className="text-gray-500">Your kos doesn't have any book yet</p>
            ) : (
                <div className="hidden md:block overflow-x-auto">
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="bg-cyan-50 text-left text-sm text-primary">
                                <th className="p-3">User Email</th>
                                <th className="p-3">Kos Name</th>
                                <th className="p-3">Start Date</th>
                                <th className="p-3">End Date</th>
                                <th className="p-3">Duration</th>
                                <th className="p-3">Total Price</th>
                                <th className="p-3">Status</th>
                                <th className="p-3">Invoice</th>
                                <th className="p-3 text-center">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {books.map((data, index) => (
                                <tr
                                    key={index}
                                    className="border-b border-[#E8E8E8] hover:bg-gray-50 transition"
                                >
                                    <td className="p-3 font-medium text-gray-800">
                                        {data.user?.email ?? "-"}
                                    </td>
                                    <td className="p-3 text-gray-600">
                                        {data.kos?.name ?? "-"}
                                    </td>
                                    <td className="p-3 text-gray-600">
                                        {data.start_date}
                                    </td>
                                    <td className="p-3 text-gray-600">
                                        {data.end_date}
                                    </td>
                                    <td className="p-3 text-gray-600">
                                        {countMonths(data.start_date, data.end_date)} Month(s)
                                    </td>
                                    <td className="p-3">
                                        {data.kos
                                            ? (() => {
                                                const months = countMonths(data.start_date, data.end_date)
                                                const total = months * data.kos.price_per_month
                                                return `Rp ${total.toLocaleString("id-ID")}`
                                            })()
                                            : "-"}
                                    </td>
                                    <td className="p-3">
                                        <span
                                            className={`px-3 py-1 text-xs rounded-full font-semibold ${
                                                STATUS_STYLE[data.status?.toLowerCase() ?? ""] ||
                                                "bg-gray-100 text-gray-600"
                                            }`}
                                        >
                                            {data.status ?? "-"}
                                        </span>
                                    </td>
                                    <td className="p-3">
                                        {data.status === 'accepted' ? (
                                        <a
                                            // href={`${BASE_API_URL}${data.invoice_file}`}
                                            href={`${BASE_API_URL}/invoices/invoice-${data.id}.pdf`}
                                            target="_blank"
                                            onClick={(e) => e.stopPropagation()}
                                            className="text-blue-600 text-xs underline"
                                        >
                                            View Invoice
                                        </a>
                                        ): (<span className="text-md text-gray-400">-</span>)}
                                    </td>
                                    <td className="p-3 text-center flex gap-4 justify-center">
                                        <UpdateBook selectedBook={data} onSuccess={() => setTimeout(() => fetchBooks(), 1000)}/>
                                        <DeleteBook selectedBook={data} onSuccess={() => setTimeout(() => fetchBooks(), 1000)}/>
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
