export interface IUser{
    id: number,
    name: string,
    email: string,
    password: string,
    phone: string,
    role: string,
    createdAt: string,
    updatedAt: string
}

export interface IKos{
    id: number
    user_id: number
    name: string
    address: string
    price_per_month: number
    total_room: number
    available_room: number
    gender: "male" | "female" | "all"
    kos_images?: IKosImage[]
    createdAt?: string
    updatedAt?: string
}

interface IKosImage {
    id: number
    kos_id: number
    file: string
}

export interface IBook{
    id: number,
    kos_id: number,
    user_id: number,
    start_date: string,
    end_date: string,
    status: "pending" | "accepted" | "rejected"
    user?: {
        id: number
        email: string
    }
    kos?: {
        id: number
        name: string
    }
}