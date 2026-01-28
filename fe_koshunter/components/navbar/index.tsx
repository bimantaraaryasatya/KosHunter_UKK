"use client";

import { useState } from "react";
import Logo from "@/public/images/logo_koshunter.png";
import Image from "next/image";
import { BASE_FRONT_END_URL } from "@/global";
import { Menu, X } from "lucide-react";

const Header = () => {
  const [open, setOpen] = useState(false);

  return (
    <header className="border-b border-[#E8E8E8] sticky top-0 z-50 bg-white px-6 md:px-20 lg:px-40 py-4">
      <div className="flex justify-between items-center">
        {/* Logo */}
        <Image src={Logo} alt="kos hunter logo" width={150} height={150} />

        {/* Desktop Menu */}
        <div className="hidden md:flex gap-16 items-center">
          <ul className="flex gap-16 font-medium tracking-wider">
            {["Find Kos", "Help Center", "Profile"].map((item) => (
              <li key={item}>
                <a
                  href="#"
                  className="relative pb-1 after:absolute after:left-0 after:bottom-0 after:h-0.5 after:w-0 after:bg-primary after:transition-all after:duration-300 hover:after:w-full"
                >
                  {item}
                </a>
              </li>
            ))}
          </ul>

          <a
            href='/login'
            className="border rounded-sm py-2 px-8 text-primary border-primary hover:bg-primary hover:text-white transition-all duration-300 tracking-wider"
          >
            Login
          </a>
        </div>

        {/* Burger Button */}
        <button
          className="md:hidden text-primary"
          onClick={() => setOpen(!open)}
        >
          {open ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="md:hidden absolute top-full left-0 w-full bg-white border-[#E8E8E8] border-t shadow-md p-6">
          <ul className="flex flex-col gap-6 font-medium tracking-wider">
            <li><a href="#">Find Kos</a></li>
            <li><a href="#">Help Center</a></li>
            <li><a href="#">Profile</a></li>
            <li>
              <a
                href='/login'
                className="inline-block border rounded-sm py-2 px-6 text-primary border-primary hover:bg-primary hover:text-white transition-all duration-300"
              >
                Login
              </a>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
};

export default Header;
