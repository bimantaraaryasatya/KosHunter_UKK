"use client"

import { useEffect, useState } from "react";
import { getCookie } from "@/lib/client-cookies";
import { jwtDecode } from "jwt-decode";
import { IUser } from "@/app/types";

const ownerDashboard = () => {
    const [user, setUser] = useState<IUser | null>(null)
    useEffect(() => {
        const decodeToken = () => {
            const TOKEN = getCookie("token");
            if (!TOKEN) return;
    
            try {
                const decoded: IUser = jwtDecode(TOKEN);
                console.log("Decoded token payload:", decoded);
                setUser(decoded);
            } catch (error) {
                console.error("Failed to decode token:", error);
            }
        };
        decodeToken();
    }, []);
    return(
        <div className="flex min-h-screen p-4">
           <h1 className="text-black text-2xl">Welcome to Owner Dashboard, {user?.name}</h1>
       </div>
    )
}

export default ownerDashboard