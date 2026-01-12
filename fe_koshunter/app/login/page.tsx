"use client"

import { BASE_API_URL } from "@/global"
import { storeCookie } from "@/lib/client-cookies"
import axios from "axios"
import { useRouter } from "next/navigation"
import { FormEvent, useState } from "react"
import { ToastContainer, toast } from "react-toastify"

const LoginUserPage = () => {
    const [email, setEmail] = useState<string>("")
    const [password, setPassword] = useState<string>("")
    const router = useRouter()

    const handleSubmit = async (e: FormEvent) => {
        try {
            e.preventDefault()
            const url = `${BASE_API_URL}/authUser/login`
            const payload = {email, password}
            const { data } = await axios.post(url, payload, {
                headers: { "Content-Type": "application/json" }
            })
            if (data.status == true) {
                toast(data.message, {hideProgressBar: true, containerId: `toastLogin`, type: "success", autoClose: 2000})
                storeCookie("token", data.token)
                storeCookie("id", data.data.id),
                storeCookie("name", data.data.name)
                storeCookie("email", data.data.email)
                storeCookie("role", data.data.role)
                let role = data.data.role
                if (role === 'admin'){
                    setTimeout(() => router.replace(`admin/dashboard`), 1000)
                } else if (role === 'owner'){
                    setTimeout(() => router.replace(`owner/dashboard`), 1000)
                } else{
                    setTimeout(() => router.replace(`/`), 1000)
                }
            }
            else toast(data.message, {hideProgressBar: true, containerId: `toastLogin`, type: "warning", autoClose: 2000})
        } catch (error: any) {
            const message = error?.response?.data?.message || "Something went wrong"
            toast(message, { hideProgressBar: true, containerId: "toastLogin", type: "error", autoClose: 2000})
        }
    }

    return(
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
            <ToastContainer containerId={`toastLogin`} />
            <div className="max-w-xl w-full bg-white rounded-xl shadow-lg p-8">
                <h2 className="text-2xl font-bold text-text mb-2 text-center">Login</h2>
                <p className="text-md text-gray-700 text-center mb-6">Welcome to Kos Hunter. Please fill the form below to log in</p>
                <form className="space-y-4" onSubmit={handleSubmit}>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="w-full px-4 py-2 border text-black border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                    placeholder="your@email.com"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                    <input
                    type="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="w-full px-4 py-2 border text-black border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                    placeholder="••••••••"
                    />
                </div>

                <div className="flex items-center justify-between">
                    <label className="flex items-center">
                    <input
                        type="checkbox"
                        className="rounded border-gray-300 text-cyan-600 focus:ring-primary"
                    />
                    <span className="ml-2 text-sm text-gray-600">Remember me</span>
                    </label>
                    <a href="#" className="text-sm text-cyan-600 hover:text-primary">
                    Forgot password?
                    </a>
                </div>

                <button
                    type="submit"
                    className="w-full bg-primary hover:bg-primary hover:cursor-pointer text-white font-medium py-2.5 rounded-lg transition-colors"
                >
                    Log in
                </button>
                </form>

                <div className="mt-6 text-center text-sm text-gray-600">
                    Don't have an account? <a href="/register" className="text-primary hover:cursor-pointer">Register</a>
                </div>
            </div>
        </div>
    )
}

export default LoginUserPage