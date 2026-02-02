"use client"

import { IBook } from "@/app/types"
import { BASE_API_URL } from "@/global"
import { put } from "@/lib/api-bridge"
import { getCookie } from "@/lib/client-cookies"
import { useRouter } from "next/navigation"
import { FormEvent, useRef, useState } from "react"
import { toast } from "react-toastify"
import { ButtonPrimary, ButtonDanger } from "@/components/buttonComponent"
import { InputGroupComponent } from "@/components/inputComponent"
import Modal from "@/components/modalComponent/index"
import Select from "@/components/select"

const UpdateUser = ({ selectedBook, onSuccess }: {selectedBook: IBook, onSuccess: () => void}) => {
    const [isShow, setIsShow] = useState<boolean>(false)
    const [book, setBook] = useState<IBook>({...selectedBook})
    const router = useRouter()
    const TOKEN = getCookie("token") || ""
    const formRef = useRef<HTMLFormElement>(null)

    const openModal = () => {
        console.log("Selected User ID:", selectedBook.id);
        // setBook({...selectedBook, password: ""})
        setIsShow(true)
        if(formRef.current) formRef.current.reset()
    }

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault()

        try {
            const payload = new FormData()
            payload.append("status", book.status)

            const res = await put(
                `${BASE_API_URL}/book/status/${selectedBook.id}`,
                payload,
                TOKEN
            )

            toast(res.data.message, {
                hideProgressBar: true,
                containerId: "toastMenu",
                type: "success",
                autoClose: 1000
            })

            setIsShow(false)
            onSuccess()

        } catch (error: any) {
            console.log(error)

            const message =
                error?.response?.data?.message ??
                error?.data?.message ??
                error?.message ??
                "Something went wrong"

            toast(message, {
                hideProgressBar: true,
                containerId: "toastMenu",
                type: "warning",
                autoClose: 1000
            })
        }
    }

    return(
        <div>
            <ButtonPrimary type="button" onClick={() => openModal()}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                </svg>
            </ButtonPrimary>
            <Modal isShow={isShow} onClose={state => setIsShow(false)}>
                <form onSubmit={handleSubmit}>
                    {/* modal header */}
                    <div className="sticky top-0 bg-white px-5 pt-5 pb-3 shadow">
                        <div className="w-full flex items-center">
                            <div className="flex flex-col">
                                <strong className="font-bold text-2xl">Update Guest</strong>
                                <small className="text-slate-400 text-sm text-start">Update</small>
                            </div>
                            <div className="ml-auto">
                                <button type="button" className="text-slate-400" onClick={() => setIsShow(false)}>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>
                    {/* end modal header */}

                    {/* modal body */}  
                    <div className="p-5 text-start text-text">
                        <Select id={`status`} value={book.status} className="text-black" label="Status" required={true} onChange={val => setBook({...book, status:val as "pending" | "accepted" | "rejected"})}>
                            <option value="">--- Select Status ---</option>
                            <option value="pending">Pending</option>
                            <option value="rejected">Rejected</option>
                            <option value="accepted">Accepted</option>
                        </Select>
                    </div>
                    {/* end modal body */}

                    {/* modal footer */}
                    <div className="w-full p-5 flex rounded-b-2xl shadow">
                        <div className="flex ml-auto gap-2">
                            <ButtonDanger type="button" onClick={() => setIsShow(false)}>
                                Cancel
                            </ButtonDanger>
                            <ButtonPrimary type="submit">
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

export default UpdateUser;