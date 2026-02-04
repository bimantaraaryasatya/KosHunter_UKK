"use client"

import { IBook } from "@/app/types"
import { BASE_API_URL } from "@/global"
import { post } from "@/lib/api-bridge"
import { getCookie } from "@/lib/client-cookies"
import { useRouter } from "next/navigation"
import { FormEvent, useRef, useState } from "react"
import { toast } from "react-toastify"
import { FaPlus } from "react-icons/fa";
import { ButtonPrimary, ButtonSuccess, ButtonDanger } from "@/components/buttonComponent"
import { InputGroupComponent } from "@/components/inputComponent"
import Modal from "@/components/modalComponent"
import { IoMdClose } from "react-icons/io";

const AddBook = ({onSuccess} : {onSuccess: () => void}) => {
    const [isShow, setIsShow] = useState<boolean>(false)
    const [book, setBook] = useState<IBook>({
        id: 0,
        kos_id: 0,
        user_id: 0,
        start_date: '',
        end_date: '',
        status: 'pending'
    })
    const router = useRouter()
    const [file, setFile] = useState<File | null>(null)
    const TOKEN = getCookie("token") || ""
    const formRef = useRef<HTMLFormElement>(null)

    const openModal = () => {
        setBook({
            id: 0,
            kos_id: 0,
            user_id: 0,
            start_date: '',
            end_date: '',
            status: 'pending'
        })
        setIsShow(true)
        if(formRef.current) formRef.current.reset()
    }

    const formatNumber = (value: string) => {
        const number = value.replace(/\D/g, "")
        return number.replace(/\B(?=(\d{3})+(?!\d))/g, ".")
    }

    const handleSubmit = async (e: FormEvent) => {
        try {
            e.preventDefault()
            const url = `${BASE_API_URL}/book`
            const payload = new FormData()
            payload.append("kos_id", book.kos_id.toString())
            payload.append("start_date", book.start_date)
            payload.append("end_date", book.end_date)
            const { data } = await post(url, payload, TOKEN)

            if (data?.status) {
                setIsShow(false)
                toast(data?.message, { hideProgressBar: true, containerId: `toastMenu`, type: `success`, autoClose: 2000})
                onSuccess()
            } else{
                toast(data?.message, { hideProgressBar: true, containerId: `toastMenu`, type: `warning`, autoClose: 2000})
            }
        } catch (error: any) {
            console.log(error)
            const message = error?.response?.data?.message || "Something went wrong"
            toast(message, {hideProgressBar: true, containerId: `toastRegister`, type: "error", autoClose: 2000})
        }
    }

    return(
        <div>
            <ButtonSuccess type="button" onClick={() => openModal()}>
                <div className="flex items-center gap-2">
                    <FaPlus />
                    Add Book
                </div>
            </ButtonSuccess>
            <Modal isShow={isShow} onClose={state => setIsShow(state)}>
                <form onSubmit={handleSubmit}>
                    {/* modal header */}
                    <div className="sticky top-0 bg-white px-5 pt-5 pb-3 shadow">
                        <div className="w-full flex items-center">
                            <div className="flex flex-col">
                                <strong className="font-bold text-2xl">Create New User</strong>
                                <small className="text-slate-400 text-sm">Only admin can create user</small>
                            </div>
                            <div className="ml-auto">
                                <button type="button" className="text-slate-400" onClick={() => setIsShow(false)}>
                                    <IoMdClose />
                                </button>
                            </div>
                        </div>
                    </div>
                    {/* end modal header */}

                    {/* modal body */}
                    <div className="p-5">
                        <InputGroupComponent id={`kos_id`} type="number" value={book.kos_id.toString()} onChange={val => setBook({...book, kos_id: Number(val)})} required={true} label="ID Kos"/>
                        <InputGroupComponent id={`start_date`} type="date" value={book.start_date} onChange={val => setBook({...book, start_date: val})} required={true} label="Start Date"/>
                        <InputGroupComponent id={`end_date`} type="date" value={book.end_date} onChange={val => setBook({...book, end_date: val})} required={true} label="End date"/>
                    </div>
                    {/* end modal body */}

                    {/* modal footer */}
                    <div className="w-full p-5 flex rounded-b-2xl shadow">
                        <div className="flex ml-auto gap-2">
                            <ButtonDanger type="button" onClick={() => setIsShow(false)} className="hover: cursor-pointer">
                                Cancel
                            </ButtonDanger>
                            <ButtonPrimary type="submit" className="hover: cursor-pointer">
                                Save
                            </ButtonPrimary>
                        </div>
                    </div>
                    {/* end modal footer */}
                </form>
            </Modal>
        </div>
    )
}

export default AddBook