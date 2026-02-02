"use client"

import { BASE_API_URL } from "@/global"
import { post } from "@/lib/api-bridge"
import { getCookie } from "@/lib/client-cookies"
import { FormEvent, useState } from "react"
import { toast } from "react-toastify"
import { FaReply } from "react-icons/fa"
import { IoMdClose } from "react-icons/io"

import Modal from "@/components/modalComponent"
import { ButtonPrimary, ButtonDanger, ButtonSuccess } from "@/components/buttonComponent"
import { InputGroupComponent } from "@/components/inputComponent"

type Props = {
    parentId: number
    kosId: number
    onSuccess: () => void
}

const ReplyReview = ({ parentId, kosId, onSuccess }: Props) => {
    const [isShow, setIsShow] = useState(false)
    const [comment, setComment] = useState("")

    const TOKEN = getCookie("token") || ""

    const openModal = () => {
        setComment("")
        setIsShow(true)
    }

    const handleSubmit = async (e: FormEvent) => {
        try {
            e.preventDefault()

            const url = `${BASE_API_URL}/review/reply`

            const payload = JSON.stringify({
                kos_id: kosId,
                parent_id: parentId,
                comment
            })

            const { data } = await post(url, payload, TOKEN)

            if (data?.status) {
                toast(data.message || "Reply sent", {
                    hideProgressBar: true,
                    containerId: "toastMenu",
                    type: "success",
                    autoClose: 2000
                })
                setIsShow(false)
                onSuccess()
            } else {
                toast(data?.message || "Failed to reply", {
                    hideProgressBar: true,
                    containerId: "toastMenu",
                    type: "warning",
                    autoClose: 2000
                })
            }
        } catch (error: any) {
            const message =
                error?.response?.data?.message || "Something went wrong"
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
                    <FaReply />
                    Reply
                </div>
            </ButtonSuccess>

            <Modal isShow={isShow} onClose={state => setIsShow(state)}>
                <form onSubmit={handleSubmit}>
                    {/* Header */}
                    <div className="sticky top-0 bg-white px-5 pt-5 pb-3 shadow">
                        <div className="flex items-center">
                            <div>
                                <strong className="text-2xl font-bold">
                                    Reply Review
                                </strong>
                                <small className="block text-slate-400">
                                    Owner reply to customer review
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
                            id="comment"
                            type="text"
                            label="Reply Message"
                            required
                            value={comment}
                            onChange={val => setComment(val)}
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
                                Send Reply
                            </ButtonPrimary>
                        </div>
                    </div>
                </form>
            </Modal>
        </div>
    )
}

export default ReplyReview
