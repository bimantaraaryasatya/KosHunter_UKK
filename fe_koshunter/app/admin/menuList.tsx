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
        path: `/admin/dashboard`,
        label: `Dashboard`,
        icon: <FaHome />
    },
    {
        id: `user`,
        path: `/admin/user`,
        label: `User`,
        icon: <FaRegUser/>
    },
    {
        id: `kos`,
        path: `/admin/kos`,
        label: `Kos`,
        icon: <FaBed/>
    },
    {
        id: `book`,
        path: `/admin/book`,
        label: `Book`,
        icon: <SlCalender/>
    },
    {
        id: `transaction`,
        path: `/admin/transaction`,
        label: `Transaction`,
        icon: <CiCreditCard2/>
    }
]

export default MenuList