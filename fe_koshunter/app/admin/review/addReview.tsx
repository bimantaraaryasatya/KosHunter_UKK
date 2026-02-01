"use client"

import { BASE_API_URL } from "@/global"
import { post } from "@/lib/api-bridge"
import { getCookie } from "@/lib/client-cookies"
import { FormEvent, useState } from "react"
import { toast } from "react-toastify"
import { FaPlus } from "react-icons/fa"
import { IoMdClose } from "react-icons/io"

import Modal from "@/components/modalComponent"
import { ButtonPrimary, ButtonSuccess, ButtonDanger } from "@/components/buttonComponent"
import { InputGroupComponent } from "@/components/inputComponent"

type ReviewPayload = {
    kos_id: number
    comment: string
}

const AddReview = ({ onSuccess }: { onSuccess: () => void }) => {
    const [isShow, setIsShow] = useState(false)
    const [review, setReview] = useState<ReviewPayload>({
        kos_id: 0,
        comment: ""
    })

    const TOKEN = getCookie("token") || ""

    const openModal = () => {
        setReview({
            kos_id: 0,
            comment: ""
        })
        setIsShow(true)
    }

    const handleSubmit = async (e: FormEvent) => {
        try {
            e.preventDefault()
            
            const url = `${BASE_API_URL}/review`

            const payload = JSON.stringify({
                kos_id: review.kos_id,
                comment: review.comment
            })

            const { data } = await post(url, payload, TOKEN)

            if (data?.status) {
                toast(data.message, {
                    hideProgressBar: true,
                    containerId: "toastMenu",
                    type: "success",
                    autoClose: 2000
                })
                setIsShow(false)
                onSuccess()
            } else {
                toast(data?.message, {
                    hideProgressBar: true,
                    containerId: "toastMenu",
                    type: "warning",
                    autoClose: 2000
                })
            }
        } catch (error: any) {
            const message = error?.response?.data?.message || "Something went wrong"
            toast(message, {
                hideProgressBar: true,
                containerId: "toastMenu",
                type: "error",
                autoClose: 2000
            })
        }
    }

    return (
        <div>
            <ButtonSuccess type="button" onClick={openModal}>
                <div className="flex items-center gap-2">
                    <FaPlus />
                    Add Review
                </div>
            </ButtonSuccess>

            <Modal isShow={isShow} onClose={state => setIsShow(state)}>
                <form onSubmit={handleSubmit}>
                    {/* Header */}
                    <div className="sticky top-0 bg-white px-5 pt-5 pb-3 shadow">
                        <div className="flex items-center">
                            <div>
                                <strong className="text-2xl font-bold">Create Review</strong>
                                <small className="block text-slate-400">
                                    Only society can add a review
                                </small>
                            </div>
                            <button
                                type="button"
                                className="ml-auto text-slate-400"
                                onClick={() => setIsShow(false)}
                            >
                                <IoMdClose />
                            </button>
                        </div>
                    </div>

                    {/* Body */}
                    <div className="p-5 space-y-4">
                        <InputGroupComponent
                            id="kos_id"
                            type="number"
                            label="ID Kos"
                            required
                            value={review.kos_id.toString()}
                            onChange={val =>
                                setReview({ ...review, kos_id: Number(val) })
                            }
                        />

                        <InputGroupComponent
                            id="comment"
                            type="text"
                            label="Comment"
                            required
                            value={review.comment}
                            onChange={val =>
                                setReview({ ...review, comment: val })
                            }
                        />
                    </div>

                    {/* Footer */}
                    <div className="p-5 flex shadow">
                        <div className="ml-auto flex gap-2">
                            <ButtonDanger
                                type="button"
                                onClick={() => setIsShow(false)}
                            >
                                Cancel
                            </ButtonDanger>
                            <ButtonPrimary type="submit">
                                Save
                            </ButtonPrimary>
                        </div>
                    </div>
                </form>
            </Modal>
        </div>
    )
}

export default AddReview
