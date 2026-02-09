"use client"

import { ReactNode, useState, useEffect } from "react"
import Image from "next/image"
import MenuItem from "./menuItem"
import { useRouter } from "next/navigation"
import { IUser, IKos } from "@/app/types"
import { GiHamburgerMenu } from "react-icons/gi"
import { FaRegUserCircle } from "react-icons/fa"
import { IoMdClose } from "react-icons/io"
import Logo_KosHunter from "../../public/images/logo_koshunter.png"
import { getCookie, removeCookie } from "@/lib/client-cookies"
import { jwtDecode } from "jwt-decode"
import { ToastContainer, toast } from "react-toastify"
import { get } from "@/lib/api-bridge"
import { BASE_API_URL } from "@/global"

type MenuType = {
  id: string
  icon: ReactNode
  path: string
  label: string
}

type ManagerProp = {
  children: ReactNode
  id: string
  title: string
  menuList: MenuType[]
}

const Sidebar = ({ children, id, title, menuList }: ManagerProp) => {
  const [isCollapsed, setIsCollapsed] = useState(true)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [user, setUser] = useState<IUser | null>(null)
  const [ownerKos, setOwnerKos] = useState<IKos | null>(null)
  const router = useRouter()

  useEffect(() => {
    const TOKEN = getCookie("token")
    if (!TOKEN) return

    try {
      const decoded: IUser = jwtDecode(TOKEN)
      setUser(decoded)
    } catch (error) {
      console.error("Failed to decode token:", error)
    }
  }, [])

  useEffect(() => {
    if (!user || user.role !== "owner") return

    const fetchOwnerKos = async () => {
      try {
        const res = await get(`${BASE_API_URL}/kos`)
        if (res?.data?.status) {
          const kosList: IKos[] = res.data.data
          const myKos = kosList.find(kos => kos.user_id === user.id)
          setOwnerKos(myKos || null)
        }
      } catch (error) {
        console.log(error)
      }
    }

    fetchOwnerKos()
  }, [user])

  const handleLogout = () => {
    removeCookie("token")
    removeCookie("id")
    removeCookie("name")
    removeCookie("email")
    removeCookie("phone")
    removeCookie("role")

    toast("Logout is successful", {
      hideProgressBar: true,
      containerId: "toastSideBar",
      type: "success",
      autoClose: 1000,
    })

    setTimeout(() => router.replace("/login"), 2000)
  }

  return (
    <div className="min-h-screen flex bg-slate-50">
      <ToastContainer containerId="toastSideBar" />

      <aside
        className={`
          fixed top-0 left-0 h-full bg-white border-r border-[#E8E8E8]
          transition-all duration-300 z-50
          ${isCollapsed ? "w-20" : "w-64"}
        `}
      >
        {/* Toggle */}
        <div className={`flex p-4 ${isCollapsed ? "justify-center" : "justify-end"}`}>
          <button onClick={() => setIsCollapsed(!isCollapsed)}>
            {isCollapsed ? (
              <GiHamburgerMenu className="text-xl text-text" />
            ) : (
              <IoMdClose className="text-xl text-text" />
            )}
          </button>
        </div>

        {/* Logo */}
        <div className="flex justify-center py-4">
          <Image src={Logo_KosHunter} alt="Logo" width={100} height={100} />
        </div>

        {/* Menu */}
        <nav className="mt-6 px-2 flex flex-col gap-2">
          {menuList.map(menu => (
            <MenuItem
              key={menu.id}
              icon={menu.icon}
              label={!isCollapsed ? menu.label : ""}
              path={menu.path}
              active={menu.id === id}
              collapsed={isCollapsed}
            />
          ))}
        </nav>
      </aside>

      <div
        className={`flex-1 transition-all duration-300 ${
          isCollapsed ? "ml-20" : "ml-64"
        }`}
      >

        <header className="sticky top-0 z-50 flex justify-between items-center py-4 px-10 border-b border-[#E8E8E8] bg-white shadow-sm">
          <h1 className="font-bold text-xl">{title}</h1>

          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-4 font-medium hover:cursor-pointer"
            >
              <FaRegUserCircle className="text-2xl" />
              <span>{user?.name}</span>
            </button>

            <div
              className={`
                absolute right-0 mt-2 w-56 bg-white shadow-md rounded-md
                transition-all duration-300
                ${
                  isDropdownOpen
                    ? "opacity-100 scale-100"
                    : "opacity-0 scale-95 pointer-events-none"
                }
              `}
            >
              <div className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                Profile
              </div>

              <div className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                Settings
              </div>

              {/* ===== KHUSUS OWNER ===== */}
              {user?.role === "owner" && ownerKos && (
                <div
                  onClick={() => router.push(`/kos/${ownerKos.id}`)}
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                >
                  Go to your kos page
                </div>
              )}

              <div
                onClick={() => router.push("/")}
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
              >
                Go to Society Page
              </div>

              <div
                onClick={handleLogout}
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-red-600"
              >
                Logout
              </div>
            </div>
          </div>
        </header>

        {/* CONTENT */}
        <main className="py-6 px-10">{children}</main>
      </div>
    </div>
  )
}

export default Sidebar
