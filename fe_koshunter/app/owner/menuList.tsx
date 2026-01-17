import { ReactNode } from "react";
import { FaHome } from "react-icons/fa";
import { FaRegUser } from "react-icons/fa";
import { FaUserCheck } from "react-icons/fa";
import { SlCalender } from "react-icons/sl";
import { CiCreditCard2 } from "react-icons/ci";
import { FaBed } from "react-icons/fa";

interface IPropMenu {
   id: string,
   path: string,
   label: string,
   icon: ReactNode
}

let MenuList: IPropMenu[] = [
    {
        id: `dashboard`,
        path: `/owner/dashboard`,
        label: `Dashboard`,
        icon: <FaHome />
    },
    {
        id: `kos`,
        path: `/owner/kos`,
        label: `Kos`,
        icon: <FaBed/>
    },
    {
        id: `book`,
        path: `/owner/book`,
        label: `Book`,
        icon: <SlCalender/>
    },
    {
        id: `transaction`,
        path: `/owner/transaction`,
        label: `Transaction`,
        icon: <CiCreditCard2/>
    }
]

export default MenuList