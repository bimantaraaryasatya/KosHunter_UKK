import axios from "axios";
import type { AxiosError } from "axios";
import { BASE_API_URL } from "@/global";

const axiosInstance = axios.create({
    baseURL: BASE_API_URL
})

export const get = async (url: string, token?: string) => {
    try {
        let headers: any = {}

        if (token) {
            headers.Authorization = `Bearer ${token}`
        }

        const result = await axiosInstance.get(url, { headers })

        return {
            status: true,
            data: result.data
        }
    } catch (error) {
        const err = error as AxiosError<any>

        const message =
            err.response?.data?.message ??
            err.message ??
            "Something went wrong"

        console.log("API ERROR:", message)

        throw {
            response: {
                data: { message }
            }
        }
    }
}

export const post = async (url: string, data: string | FormData, token: string) => {
    try {
        const typed: string = (typeof data == 'string') ? "application/json" : "multipart/form-data"
        let headers: any = {
            "Authorization": `Bearer ${token}` || '',
            "Content-Type": typed
        }

        let result = await axiosInstance.post(url, data, {
            headers
        })

        return {
            status: true,
            data: result.data
        }
    } catch (error) {
        const err = error as AxiosError<any>

        const message =
            err.response?.data?.message ??
            err.message ??
            "Something went wrong"

        console.log("API ERROR:", message)

        throw {
            response: {
                data: {
                    message
                }
            }
        }
    }
}

export const put = async (url: string, data: string | FormData, token: string) => {
    try {
        const type: string = (typeof data == 'string') ? "application/json" : "multipart/form-data"
        let result = await axiosInstance.put(url, data, {
            headers: {
                "Authorization": `Bearer ${token}` || '',
                "Content-Type": type
            }
        })
        return {
            status: true,
            data: result.data
        }
    } catch (error) {
        const err = error as AxiosError<any>

        const message =
            err.response?.data?.message ??
            err.message ??
            "Something went wrong"

        console.log("API ERROR:", message)

        throw {
            response: {
                data: {
                    message
                }
            }
        }
    }
}

export const drop = async (url: string, token: string) => {
    try {
        let result = await axiosInstance.delete(url, {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        })

        return{
            status: true,
            data: result.data
        }
    } catch (error) {
        const err = error as AxiosError<any>

        const message =
            err.response?.data?.message ??
            err.message ??
            "Something went wrong"

        console.log("API ERROR:", message)

        throw {
            response: {
                data: {
                    message
                }
            }
        }
    }
}