"use client"

import { IKos } from "@/app/types"
import { BASE_API_URL } from "@/global"
import { post } from "@/lib/api-bridge"
import { getCookie } from "@/lib/client-cookies"
import { useRouter } from "next/navigation"
import { FormEvent, useRef, useState } from "react"
import { toast } from "react-toastify"
import { FaPlus } from "react-icons/fa";
import { ButtonPrimary, ButtonSuccess, ButtonDanger } from "@/components/buttonComponent"
import { InputGroupComponent } from "@/components/inputComponent"
import FileInput from "@/components/fileInput"
import Modal from "@/components/modalComponent"
import { IoMdClose } from "react-icons/io";
import Select from "@/components/select"

const AddKos = ({onSuccess} : {onSuccess: () => void}) => {
    const [isShow, setIsShow] = useState<boolean>(false)
    const [kos, setKos] = useState<IKos>({
        id: 0,
        user_id: 0,
        name: ``,
        address: ``,
        price_per_month: 0,
        total_room: 0,
        gender: `all`,
        kos_images: [],
        createdAt: ``,
        updatedAt: ``
    })
    const router = useRouter()
    const [file, setFile] = useState<File | null>(null)
    const TOKEN = getCookie("token") || ""
    const formRef = useRef<HTMLFormElement>(null)

    const openModal = () => {
        setKos({
            id: 0,
            user_id: 0,
            name: ``,
            address: ``,
            price_per_month: 0,
            total_room: 0,
            gender: `all`,
            kos_images: [],
            createdAt: ``,
            updatedAt: ``
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
            const url = `${BASE_API_URL}/kos`
            const payload = new FormData()
            payload.append("name", kos.name)
            payload.append("address", kos.address)
            payload.append("price_per_month", kos.price_per_month.toString())
            payload.append("total_room", kos.total_room.toString())
            payload.append("gender", kos.gender)
            const { data } = await post(url, payload, TOKEN)

            if (!data?.status) {
                toast(data?.message, { hideProgressBar: true, containerId: "toastMenu", type: "warning", autoClose: 2000 })
                return
            }

            const kosId = data.data.id
            if (file) {
            const imagePayload = new FormData()
                imagePayload.append("file", file)
                imagePayload.append("kos_id", kosId.toString())

                await post(`${BASE_API_URL}/kos/image`, imagePayload, TOKEN)
            }

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
                    Add Kos
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
                        <InputGroupComponent id={`name`} type="text" value={kos.name} onChange={val => setKos({...kos, name: val})} required={true} label="Name"/>
                        <InputGroupComponent id={`address`} type="text" value={kos.address} onChange={val => setKos({...kos, address: val})} required={true} label="Address"/>
                        <InputGroupComponent id="price_per_month" type="text" value={kos.price_per_month === 0 ? "" : kos.price_per_month.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")} onChange={val => setKos({ ...kos, price_per_month: Number(val.replace(/\D/g, "")) })} required label="Price/month" />
                        <InputGroupComponent id={`total_room`} type="number" value={kos.total_room.toString()} onChange={val => setKos({...kos, total_room: Number(val)})} required={true} label="Total Room"/>
                        <Select id={`gender`} value={kos.gender} className="text-black " label="Category" required={true} onChange={val => setKos({...kos, gender: val as "male" | "female" | "all"})}>
                            <option value="">--- Select Role ---</option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                            <option value="all">All</option>
                        </Select>
                        <FileInput acceptTypes={["application/pdf", "image/png", "image/jpeg", "image/jpg"]} id="kos_images" label="Upload Image (Max 2MB, PDF/JPG/JPEG,PNG)" onChange={f => setFile(f)} required={false}/>
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

export default AddKos