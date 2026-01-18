"use client"

import { useEffect, useState } from "react"
import { IBook } from "@/app/types"
import { getCookie } from "@/lib/client-cookies"
import { BASE_API_URL } from "@/global"
import { get } from "@/lib/api-bridge"
import { CiSearch } from "react-icons/ci"
import AddBook from "./addBook"
import DeleteBook from "./deleteBook"
import UpdateBook from "./updateBook"

export default function BookPage() {
    const [books, setBooks] = useState<IBook[]>([])
    const [keyword, setKeyword] = useState("")
    const [loading, setLoading] = useState(false)

    const fetchUsers = async (search = "") => {
        try {
            setLoading(true)
            const token = getCookie("token")
            if (!token) return

            const url = `${BASE_API_URL}/book?search=${search}`
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

    const STATUS_STYLE: Record<string, string> = {
    pending: "bg-red-100 text-yellow-600",
    accepted: "bg-cyan-100 text-green-600",
    rejected: "bg-red-100 text-red-600",
    }

    return (
        <div className="bg-white rounded-xl p-5 border-t-4 border-t-primary shadow-md">
            <h4 className="text-xl font-bold mb-2 text-black">Book Data</h4>
            <p className="text-sm text-gray-500 mb-4">
                Manage all registered books
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

                <AddBook onSuccess={() => setTimeout(() => fetchUsers(), 1000)}/> 
            </div>

            {/* CONTENT */}
            {loading ? (
                <p className="text-gray-500">Loading...</p>
            ) : books.length === 0 ? (
                <p className="text-gray-500">No Data</p>
            ) : (
                <div className="hidden md:block overflow-x-auto">
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="bg-cyan-50 text-left text-sm text-primary">
                                <th className="p-3">User Email</th>
                                <th className="p-3">Kos Name</th>
                                <th className="p-3">Start Date</th>
                                <th className="p-3">End Date</th>
                                <th className="p-3">Status</th>
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
                                    <td className="p-3">
                                        <span className={`px-3 py-1 text-xs rounded-full font-semibold ${STATUS_STYLE[data.status?.toLowerCase() ?? ""] || "bg-gray-100 text-gray-600"}`}>
                                            {data.status ?? "-"}
                                        </span>
                                    </td>
                                    <td className="p-3 text-center flex gap-4 justify-center">
                                        <UpdateBook selectedBook={data} onSuccess={() => setTimeout(() => fetchUsers(), 1000)}/>
                                        <DeleteBook selectedBook={data} onSuccess={() => setTimeout(() => fetchUsers(), 1000)}/>
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
