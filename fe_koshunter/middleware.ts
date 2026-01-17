import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { jwtDecode } from "jwt-decode"

export function middleware(request: NextRequest) {
    const token = request.cookies.get("token")?.value
    const pathname = request.nextUrl.pathname

    if (!token) {
        return NextResponse.redirect(new URL("/login", request.url))
    }

    try {
        const decoded: any = jwtDecode(token)
        const role = decoded.role

        if (pathname.startsWith("/admin") && role !== "admin") {
            if (role === "owner") {
                return NextResponse.redirect(new URL("/owner/dashboard", request.url))
            }
            return NextResponse.redirect(new URL("/", request.url))
        }

        if (pathname.startsWith("/owner") && role !== "owner") {
            if (role === "admin") {
                return NextResponse.redirect(new URL("/admin/dashboard", request.url))
            }
            return NextResponse.redirect(new URL("/", request.url))
        }

        return NextResponse.next()
    } catch {
        return NextResponse.redirect(new URL("/login", request.url))
    }
}

export const config = {
    matcher: ["/admin/:path*", "/owner/:path*"]
}
