"use client";

import { useEffect, useRef, useState } from "react";
import Logo from "@/public/images/logo_koshunter.png";
import Image from "next/image";
import Link from "next/link";
import { Menu, X, User, LogOut, ChevronDown, LayoutDashboard } from "lucide-react";
import { getCookie, removeCookie } from "@/lib/client-cookies";
import { useRouter } from "next/navigation";

const Header = () => {
  const [open, setOpen] = useState(false);
  const [role, setRole] = useState<string | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isLogin, setIsLogin] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const menus = [
    { label: "Find Kos", href: "/kos" },
    { label: "Help Center", href: "/#" },
  ];

  useEffect(() => {
    const token = getCookie("token");
    setIsLogin(!!token);
  }, []);

  useEffect(() => {
    const token = getCookie("token");
    const userRole = getCookie("role") ?? null;

    setIsLogin(!!token);
    setRole(userRole);
  }, []);

  // close dropdown when click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    removeCookie("token");
    removeCookie("role");
    setShowDropdown(false);
    setIsLogin(false);
    router.push("/login");
  };

  return (
    <header className="border-b border-[#E8E8E8] sticky top-0 z-50 bg-white px-6 md:px-20 py-4">
      <div className="flex justify-between items-center">
        {/* Logo */}
        <Link href="/">
          <Image src={Logo} alt="kos hunter logo" width={150} height={150} />
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex gap-16 items-center">
          <ul className="flex gap-16 font-medium tracking-wider">
            {menus.map((item) => (
              <li key={item.label}>
                <Link
                  href={item.href}
                  className="relative pb-1 after:absolute after:left-0 after:bottom-0 after:h-0.5 after:w-0 after:bg-primary after:transition-all after:duration-300 hover:after:w-full"
                >
                  {item.label}
                </Link>
              </li>
            ))}

            {isLogin && (
              <li>
                <Link
                  href="/history"
                  className="relative pb-1 after:absolute after:left-0 after:bottom-0 after:h-0.5 after:w-0 after:bg-primary after:transition-all after:duration-300 hover:after:w-full"
                >
                  History
                </Link>
              </li>
            )}
          </ul>

          {/* AUTH AREA */}
          {!isLogin ? (
            <Link
              href="/login"
              className="border rounded-sm py-2 px-8 text-primary border-primary hover:bg-primary hover:text-white transition-all duration-300 tracking-wider"
            >
              Login
            </Link>
          ) : (
            <div className="relative text-primary" ref={dropdownRef}>
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="flex items-center gap-2 border-transparent shadow-md border-2 px-2 py-2 rounded-full hover:bg-gray-100 transition"
              >
                <User size={18} />
                <ChevronDown size={16} />
              </button>

              {/* DROPDOWN */}
              <div
                className={`
                  absolute right-0 mt-3 w-44
                  bg-white rounded-lg shadow-lg overflow-hidden
                  transform transition-all duration-300 ease-out
                  ${
                    showDropdown
                      ? "opacity-100 scale-100 translate-y-0 pointer-events-auto"
                      : "opacity-0 scale-95 -translate-y-2 pointer-events-none"
                  }
                `}
              >
                <Link
                  href="/profile"
                  className="flex items-center gap-2 px-4 py-3 text-sm hover:bg-gray-100"
                  onClick={() => setShowDropdown(false)}
                >
                  <User size={16} />
                  Profile
                </Link>
                
                {(role === "admin" || role === "owner") && (
                  <Link
                    href={role === "admin" ? "/admin/dashboard" : "/owner/dashboard"}
                    className="flex items-center gap-2 px-4 py-3 text-sm hover:bg-gray-100"
                    onClick={() => setShowDropdown(false)}
                  >
                    <LayoutDashboard size={16} />
                    Go to Dashboard
                  </Link>
                )}

                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2 px-4 py-3 text-sm text-red-500 hover:bg-red-50"
                >
                  <LogOut size={16} />
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Burger */}
        <button
          className="md:hidden text-primary"
          onClick={() => setOpen(!open)}
        >
          {open ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="md:hidden absolute top-full left-0 w-full bg-white border-t border-[#E8E8E8] shadow-md p-6">
          <ul className="flex flex-col gap-6 font-medium tracking-wider">
            <li><Link href="/kos">Find Kos</Link></li>
            <li><Link href="#">Help Center</Link></li>

            {isLogin && (
              <li>
                <Link href="/history">History</Link>
              </li>
            )}
            
            {!isLogin ? (
              <li>
                <Link
                  href="/login"
                  className="inline-block border rounded-sm py-2 px-6 text-primary border-primary"
                >
                  Login
                </Link>
              </li>
            ) : (
              <>
                <li>
                  <Link href="/profile">Profile</Link>
                </li>
                <li>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 text-red-500"
                  >
                    <LogOut size={18} />
                    Logout
                  </button>
                </li>
              </>
            )}
          </ul>
        </div>
      )}
    </header>
  );
};

export default Header;
