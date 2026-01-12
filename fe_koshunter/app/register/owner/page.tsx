"use client"

import { BASE_API_URL } from "@/global"
import axios from "axios"
import { useRouter } from "next/navigation"
import { FormEvent, useState } from "react"
import { ToastContainer, toast } from "react-toastify"

export interface RegisterData{
    name: string,
    email: string,
    password: string,
    phone: string
}

const RegisterOwnerPage = () => {
    const [user, setUser] = useState<RegisterData>({
        name:  "",
        email: "",
        password: "",
        phone: ""
    })
    const router = useRouter()

    function handleChange(
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) {
        const { name, value } = e.target;
        setUser((prev) => ({ ...prev, [name]: value }));
    }

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault()
        const url = `${BASE_API_URL}/authUser/register/owner`

        const payload = new FormData()
        payload.append("name", user.name)
        payload.append("email", user.email)
        payload.append("password", user.password)
        payload.append("phone", user.phone)

        try {
            const { data } = await axios.post(url, payload, {
                headers: { "Content-Type": "application/json" }
            })
            if(data.status == true){
                toast(data.message, {hideProgressBar: true, containerId: `toastRegister`, type: "success", autoClose: 2000})
                setTimeout(() => router.replace('/login'), 1000)
            }
            else toast(data.message, {hideProgressBar: true, containerId: `toastLogin`, type: "warning", autoClose: 2000})
        } catch (error: any) {
            const message = error?.response?.data?.message || "Something went wrong"
            toast(message, { hideProgressBar: true, containerId: "toastRegister", type: "error", autoClose: 2000})
        }
    }

    return(
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
            <ToastContainer containerId={`toastRegister`} />
            <div className="max-w-xl w-full bg-white rounded-xl shadow-lg p-8">
                <h2 className="text-2xl font-bold text-text mb-2 text-center">Owner Register</h2>
                <p className="text-md text-gray-700 text-center mb-6">Welcome to Kos Hunter. Please fill the form below to be an owner</p>
                <form className="space-y-4" onSubmit={handleSubmit}>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                        <input
                        name="name"
                        type="text"
                        value={user.name}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all text-black"
                        placeholder="Ex: John"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        <input
                        name="email"
                        type="email"
                        value={user.email}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all text-black"
                        placeholder="Ex: your@email.com"
                        autoComplete="off"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                        <input
                        name="password"
                        type="password"
                        value={user.password}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all text-black"
                        placeholder="••••••••"
                        autoComplete="new-password"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                        <input
                        name="phone"
                        type= "number"
                        value={user.phone}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all text-black"
                        placeholder="Ex: 08132321"
                        />
                    </div>

                    <div>
                        <p className="text-xs font-light italic text-gray-700 text-start">*you must have an account before</p>
                        <button
                            type="submit"
                            className="w-full mt-1 bg-primary hover:cursor-pointer text-white font-medium py-2.5 rounded-lg transition-colors"
                        >
                            Register
                        </button>
                    </div>
                </form>

                <div className="mt-6 text-center text-sm text-gray-600">
                    Don't have an account? <a href="/register" className="text-primary">Register</a>
                </div>
            </div>
        </div>
    )
}

export default RegisterOwnerPage