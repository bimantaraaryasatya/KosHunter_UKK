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
    createdAt?: string
    updatedAt?: string
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
        name: string
    }
    kos?: {
        id: number
        name: string
    }
}