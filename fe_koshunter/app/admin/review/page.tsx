"use client"

import { useEffect, useState } from "react"
import { IReview } from "@/app/types"
import { getCookie } from "@/lib/client-cookies"
import { BASE_API_URL } from "@/global"
import { get } from "@/lib/api-bridge"
import AddReview from "./addReview"
// import ReplyReview from "./replyReview"
import DeleteReview from "./deleteReview"

export default function ReviewPage({ kosId }: { kosId: number }) {
    const [reviews, setReviews] = useState<IReview[]>([])
    const [loading, setLoading] = useState(false)

    const fetchReviews = async () => {
        try {
            setLoading(true)
            const token = getCookie("token")
            if (!token) return

            const response = await get(
                `${BASE_API_URL}/review`,
                token
            )

            if (response?.data?.status) {
                setReviews(response.data.data)
            } else {
                setReviews([])
            }
        } catch (error) {
            console.log(error)
            setReviews([])
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchReviews()
    }, [])

    const ROLE_STYLE: Record<string, string> = {
        admin: "bg-red-100 text-red-600",
        owner: "bg-cyan-100 text-cyan-600",
        society: "bg-green-100 text-green-600",
        user: "bg-blue-100 text-blue-600"
    }

    return (
        <div className="bg-white rounded-xl p-5 border-t-4 border-t-primary shadow-md">
            <div className="flex justify-between">
                <div>
                    <h4 className="text-xl font-bold mb-2 text-black">
                        Review Kos
                    </h4>
                    <p className="text-sm text-gray-500 mb-4">
                        Review & balasan pemilik kos
                    </p>
                </div>
                <div className="flex items-center">
                    <AddReview onSuccess={() => fetchReviews()}/>
                </div>
            </div>

            {/* TOP BAR */}
            {/* <div className="flex justify-end mb-4">
                <AddReview onSuccess={() => fetchReviews()}/>
            </div> */}

            {/* CONTENT */}
            {loading ? (
                <p className="text-gray-500">Loading...</p>
            ) : reviews.length === 0 ? (
                <p className="text-gray-500">No Review</p>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="bg-cyan-50 text-left text-sm text-primary">
                                <th className="p-3">User Name</th>
                                <th className="p-3">Kos Name</th>
                                <th className="p-3">Comment</th>
                                <th className="p-3">Role</th>
                                <th className="p-3 text-center">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {reviews.map((review) => (
                                <tr
                                    key={review.id}
                                    className="border-b border-[#E8E8E8]"
                                >
                                    <td className="p-3 font-medium text-gray-800">
                                        {review.user.name}
                                    </td>

                                    <td className="p-3 text-gray-600">
                                        {review.kos.name}
                                    </td>

                                    <td className="p-3 text-gray-600">
                                        {review.comment}
                                    </td>

                                    <td className="p-3">
                                        <span className={`px-3 py-1 text-xs rounded-full font-semibold ${ROLE_STYLE[review.user.role.toLowerCase()] || "bg-gray-100 text-gray-600"}`}>
                                            {review.user.role}
                                        </span>
                                    </td>

                                    <td className="p-3 text-center">
                                        {/* {review.replies &&
                                        review.replies.length > 0 ? (
                                            <span className="text-green-600 text-sm">
                                                Replied
                                            </span>
                                        ) : (
                                            <ReplyReview
                                                parentId={review.id}
                                                onSuccess={fetchReviews}
                                            />
                                        )} */}
                                        <DeleteReview selectedReview={review} onSuccess={() => setTimeout(() => fetchReviews(), 1000)}/>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {/* REPLIES */}
                    {reviews.map(
                        (review) =>
                            review.replies &&
                            review.replies.length > 0 && (
                                <div
                                    key={`reply-${review.id}`}
                                    className="ml-10 mt-3 mb-6"
                                >
                                    {review.replies.map((reply: any) => (
                                        <div
                                            key={reply.id}
                                            className="bg-gray-50 p-3 rounded-lg mb-2"
                                        >
                                            <p className="text-sm font-semibold">
                                                {reply.user.name} 
                                            </p>
                                            <p className="text-sm text-gray-700">
                                                {reply.comment}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            )
                    )}
                </div>
            )}
        </div>
    )
}
