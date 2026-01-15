"use client"

import { useEffect, useState } from "react"
import { IUser } from "@/app/types"
import { getCookie } from "@/lib/client-cookies"
import { BASE_API_URL } from "@/global"
import { get } from "@/lib/api-bridge"
import AddUser from "./addUser"
import UpdateUser from "./updateUser"
import DeleteUser from "./deleteUser"
import { CiSearch } from "react-icons/ci"

export default function UserPage() {
    const [users, setUsers] = useState<IUser[]>([])
    const [keyword, setKeyword] = useState("")
    const [loading, setLoading] = useState(false)

    const fetchUsers = async (search = "") => {
        try {
            setLoading(true)
            const token = getCookie("token")
            if (!token) return

            const url = `${BASE_API_URL}/user?search=${search}`
            const response = await get(url, token)

            if (response?.data?.status) {
                setUsers(response.data.data)
            } else {
                setUsers([])
            }
        } catch (error) {
            console.log(error)
            setUsers([])
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

    const ROLE_STYLE: Record<string, string> = {
    admin: "bg-red-100 text-red-600",
    owner: "bg-cyan-100 text-cyan-600",
    society: "bg-green-100 text-green-600",
    user: "bg-blue-100 text-blue-600"
    }

    return (
        <div className="bg-white rounded-xl p-5 border-t-4 border-t-primary shadow-md">
            <h4 className="text-xl font-bold mb-2 text-black">User Data</h4>
            <p className="text-sm text-gray-500 mb-4">
                Manage all registered users
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

                <AddUser onSuccess={() => setTimeout(() => fetchUsers(), 1000)}/>
            </div>

            {/* CONTENT */}
            {loading ? (
                <p className="text-gray-500">Loading...</p>
            ) : users.length === 0 ? (
                <p className="text-gray-500">No data</p>
            ) : (
                <div className="hidden md:block overflow-x-auto">
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="bg-cyan-50 text-left text-sm text-primary">
                                <th className="p-3">Name</th>
                                <th className="p-3">Email</th>
                                <th className="p-3">Phone</th>
                                <th className="p-3">Role</th>
                                <th className="p-3 text-center">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((data, index) => (
                                <tr
                                    key={index}
                                    className="border-b border-[#E8E8E8] hover:bg-gray-50 transition"
                                >
                                    <td className="p-3 font-medium text-gray-800">
                                        {data.name}
                                    </td>
                                    <td className="p-3 text-gray-600">
                                        {data.email}
                                    </td>
                                    <td className="p-3 text-gray-600">
                                        {data.phone}
                                    </td>
                                    <td className="p-3">
                                        <span className={`px-3 py-1 text-xs rounded-full font-semibold ${ROLE_STYLE[data.role.toLowerCase()] || "bg-gray-100 text-gray-600"}`}>
                                            {data.role}
                                        </span>
                                    </td>
                                    <td className="p-3 text-center flex gap-4 justify-center">
                                        <UpdateUser selectedUser={data} onSuccess={() => setTimeout(() => fetchUsers(), 1000)}/>
                                        <DeleteUser selectedUser={data} onSuccess={() => setTimeout(() => fetchUsers(), 1000)}/>
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
