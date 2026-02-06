import Logo from "@/public/images/logo_koshunter.png";
import Image from "next/image";
import { FaLinkedin } from "react-icons/fa";
import { FaYoutube } from "react-icons/fa";
import { FaInstagram } from "react-icons/fa";

const Footer = () => {
    return(
        <footer className="mt-20 md:mt-40 border-t border-[#E8E8E8]">
            <div className="flex flex-col gap-15 md:flex-row justify-between md-6 px-6 py-8 md:px-20 md:py-20">
            <div className="w-full md:w-1/3 flex flex-col gap-6">
                <div className="flex justify-start">
                <Image src={Logo} alt="kos hunter logo" width={230} height={250} />
                </div>
                <div>
                <h4 className="text-[#898E8E] text-sm">Kos Hunter helps you find the perfect boarding house quickly and easily, anytime and anywhere.</h4>
                </div>
                <div className="text-[#898E8E] text-2xl flex gap-5">
                <a href=""><FaLinkedin/></a>
                <a href=""><FaYoutube/></a>
                <a href=""><FaInstagram/></a>
                </div>
            </div>

            <div className="flex flex-col md:flex-row gap-10 md:gap-20">
                <div className="flex flex-col gap-5">
                <h2 className="text-xl font-bold">Kos Hunter</h2>
                <ul className="flex flex-col gap-5 text-[#898E8E]">
                    <li><a href="" className="hover:text-primary relative pb-1 after:absolute after:left-0 after:bottom-0 after:h-0.5 after:w-0 after:bg-primary after:transition-all after:duration-300 hover:after:w-full">About Us</a></li>
                    <li><a href="" className="hover:text-primary relative pb-1 after:absolute after:left-0 after:bottom-0 after:h-0.5 after:w-0 after:bg-primary after:transition-all after:duration-300 hover:after:w-full">How It Works</a></li>
                    <li><a href="" className="hover:text-primary relative pb-1 after:absolute after:left-0 after:bottom-0 after:h-0.5 after:w-0 after:bg-primary after:transition-all after:duration-300 hover:after:w-full">Our Features</a></li>
                    <li><a href="" className="hover:text-primary relative pb-1 after:absolute after:left-0 after:bottom-0 after:h-0.5 after:w-0 after:bg-primary after:transition-all after:duration-300 hover:after:w-full">Blog</a></li>
                </ul>
                </div>
                <div className="flex flex-col gap-5">
                <h2 className="text-xl font-bold">Legal & Privacy Policies</h2>
                <ul className="flex flex-col gap-5 text-[#898E8E]">
                    <li><a href="" className="hover:text-primary relative pb-1 after:absolute after:left-0 after:bottom-0 after:h-0.5 after:w-0 after:bg-primary after:transition-all after:duration-300 hover:after:w-full">Privacy Policy</a></li>
                    <li><a href="" className="hover:text-primary relative pb-1 after:absolute after:left-0 after:bottom-0 after:h-0.5 after:w-0 after:bg-primary after:transition-all after:duration-300 hover:after:w-full">Terms & Condition</a></li>
                    <li><a href="" className="hover:text-primary relative pb-1 after:absolute after:left-0 after:bottom-0 after:h-0.5 after:w-0 after:bg-primary after:transition-all after:duration-300 hover:after:w-full">Cookie Policy</a></li>
                    <li><a href="" className="hover:text-primary relative pb-1 after:absolute after:left-0 after:bottom-0 after:h-0.5 after:w-0 after:bg-primary after:transition-all after:duration-300 hover:after:w-full">User Agreement</a></li>
                </ul>
                </div>
                <div className="flex flex-col gap-5">
                <h2 className="text-xl font-bold">Contact Us</h2>
                <ul className="flex flex-col gap-5 text-[#898E8E]">
                    <li><a href="" className="hover:text-primary relative pb-1 after:absolute after:left-0 after:bottom-0 after:h-0.5 after:w-0 after:bg-primary after:transition-all after:duration-300 hover:after:w-full">Help Center</a></li>
                    <li><a href="" className="hover:text-primary relative pb-1 after:absolute after:left-0 after:bottom-0 after:h-0.5 after:w-0 after:bg-primary after:transition-all after:duration-300 hover:after:w-full">Contact Suppor</a>t</li>
                    <li><a href="" className="hover:text-primary relative pb-1 after:absolute after:left-0 after:bottom-0 after:h-0.5 after:w-0 after:bg-primary after:transition-all after:duration-300 hover:after:w-full">Our Email</a></li>
                    <li><a href="" className="hover:text-primary relative pb-1 after:absolute after:left-0 after:bottom-0 after:h-0.5 after:w-0 after:bg-primary after:transition-all after:duration-300 hover:after:w-full">FAQ</a></li>
                    <li><a href="" className="hover:text-primary relative pb-1 after:absolute after:left-0 after:bottom-0 after:h-0.5 after:w-0 after:bg-primary after:transition-all after:duration-300 hover:after:w-full">Report a Problem</a></li>
                </ul>
                </div>
            </div>
            </div>
            <div className="bg-[#F9FBFC] md-6 px-6 md:px-20 py-4">
            <p className="text-[#898E8E] text-sm">Copyright © 2024 Kos Hunter. All rights reserved</p>
            </div>
        </footer>
    )
}

export default Footer