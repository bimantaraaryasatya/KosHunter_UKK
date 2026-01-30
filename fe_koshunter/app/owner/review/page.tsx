"use client"

import { useEffect, useState } from "react";
import { getCookie } from "@/lib/client-cookies";
import { jwtDecode } from "jwt-decode";
import { IUser } from "@/app/types";

const ownerReview = () => {
    return(
        <div>
            <p className="text-text">Hi</p>
        </div>
    )
}

export default ownerReview