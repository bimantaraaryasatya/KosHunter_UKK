"use client"

import { IKos } from "@/app/types"
import { BASE_API_URL } from "@/global"
import { put } from "@/lib/api-bridge"
import { getCookie } from "@/lib/client-cookies"
import { useRouter } from "next/navigation"
import { FormEvent, useRef, useState } from "react"
import { toast } from "react-toastify"
import { ButtonPrimary, ButtonDanger } from "@/components/buttonComponent"
import { InputGroupComponent } from "@/components/inputComponent"
import Modal from "@/components/modalComponent/index"
import FileInput from "@/components/fileInput/index"
import Select from "@/components/select"

const UpdateKos = ({ selectedKos, onSuccess }: {selectedKos: IKos, onSuccess: () => void}) => {
    const [isShow, setIsShow] = useState<boolean>(false)
    const [kos, setKos] = useState<IKos>({
        id: selectedKos.id,
        user_id: selectedKos.user_id,
        name: selectedKos.name ?? "",
        address: selectedKos.address ?? "",
        price_per_month: selectedKos.price_per_month ?? 0,
        total_room: selectedKos.total_room ?? 0,
        available_room: selectedKos.available_room ?? 0,
        gender: selectedKos.gender ?? "all",
        kos_images: selectedKos.kos_images ?? [],
    })
    const router = useRouter()
    const [file, setFile] = useState<File | null>(null)
    const TOKEN = getCookie("token") || ""
    const formRef = useRef<HTMLFormElement>(null)

    const openModal = () => {
        console.log("Selected Kos ID:", selectedKos.id);
        // setKos({...selectedKos, password: ""})
        setIsShow(true)
        if(formRef.current) formRef.current.reset()
    }

    const handleSubmit = async (e: FormEvent) => {
        try{
            e.preventDefault()
            const url = `${BASE_API_URL}/kos/${selectedKos.id}`
            const payload = new FormData()
            payload.append("name", kos.name)
            payload.append("address", kos.address)
            payload.append("price_per_month", kos.price_per_month.toString())
            payload.append("total_room", kos.total_room.toString())
            payload.append("gender", kos.gender)
            const { data } = await put(url, payload, TOKEN)
            if (!data?.status) {
                toast(data?.message, { hideProgressBar: true, containerId: "toastMenu", type: "warning", autoClose: 2000 })
                return
            }

            const kosImageId = selectedKos.kos_images?.[0]?.id
            if (file) {
            const imagePayload = new FormData()
                imagePayload.append("file", file)

                await put(`${BASE_API_URL}/kos/image/${kosImageId}`, imagePayload, TOKEN)
            }

            if (data?.status) {
                setIsShow(false)
                toast(data?.message, {hideProgressBar: true, containerId: `toastMenu`, type: `success`, autoClose: 2000})
                onSuccess()
            }else{
                toast(data?.message, {hideProgressBar: true, containerId: `toastMenu`, type: `warning`, autoClose: 2000})
            }
        } catch (error: any){
            console.log(error)
            const message = error?.response?.data?.message || "Something went wrong"
            toast(message, {hideProgressBar: true, containerId: `toastRegister`, type: "error", autoClose: 2000})
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

export default UpdateKos;