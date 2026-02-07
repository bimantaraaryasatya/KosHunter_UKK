"use client"

import { useEffect, useState, FormEvent } from "react"
import { useParams, useRouter } from "next/navigation"
import { toast } from "react-toastify"
import Image from "next/image"
import Header from "@/components/navbar"
import Footer from "@/components/footer"
import { BASE_API_URL, BASE_IMAGE_KOS } from "@/global"
import { get } from "@/lib/api-bridge"
import { IKos, IBook, IReview } from "@/app/types"
import { post } from "@/lib/api-bridge"
import { getCookie } from "@/lib/client-cookies"

export default function KosDetailPage() {
  const params = useParams<{ id: string }>()
  const role = getCookie("role")
  const id = params.id 
  const TOKEN = getCookie("token") || ""
  const [kos, setKos] = useState<IKos | null>(null)
  const [reviews, setReviews] = useState<IReview[]>([])
  const [reviewText, setReviewText] = useState("")
  const [loadingReview, setLoadingReview] = useState(false)
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const [canReview, setCanReview] = useState(false)

  const [book, setBook] = useState<IBook>({
      id: 0,
      kos_id: 0,
      user_id: 0,
      start_date: '',
      end_date: '',
      status: 'pending'
  })

  useEffect(() => {
    const checkBooking = async () => {
      try {
        const res = await get(`${BASE_API_URL}/book/history`, TOKEN)

        const hasAccepted = res.data.data.some(
          (b: any) => b.kos_id === Number(id) && b.status === "accepted"
        )

        setCanReview(hasAccepted)
      } catch (err) {
        setCanReview(false)
      }
    }

    checkBooking()
  }, [id])

  useEffect(() => {
    const fetchKosDetail = async () => {
      try {
        setLoading(true)
        const response = await get(`${BASE_API_URL}/kos/${id}`)

        if (response?.data?.status) {
          setKos(response.data.data)
        } else {
          setKos(null)
        }
      } catch (error) {
        console.log(error)
        setKos(null)
      } finally {
        setLoading(false)
      }
    }

    if (id) fetchKosDetail()
  }, [id])

  useEffect(() => {
  if (!id || !TOKEN) return

  const fetchReviews = async () => {
    try {
      setLoadingReview(true)
      const res = await get(`${BASE_API_URL}/review/${id}`, TOKEN)

      if (res?.data?.status) {
        setReviews(res.data.data)
      } else {
        setReviews([])
      }
    } catch (error) {
      console.log(error)
      setReviews([])
    } finally {
      setLoadingReview(false)
    }
  }
  fetchReviews()
  }, [id])

  if (loading) {
    return (
      <div>
        <Header />
        <div className="px-6 md:px-20 py-20 text-gray-500">Loading...</div>
        <Footer />
      </div>
    )
  }

  if (!kos) {
    return (
      <div>
        <Header />
        <div className="px-6 md:px-20 py-20 text-red-500">
          Kos not found
        </div>
        <Footer />
      </div>
    )
  }

  const handleSubmit = async (e: FormEvent) => {
    if (!id) {
      toast("Kos ID not found", { type: "error" })
      return
    }

    try {
        e.preventDefault()
        const url = `${BASE_API_URL}/book`
        const payload = new FormData()
        payload.append("kos_id", id)
        payload.append("start_date", book.start_date)
        payload.append("end_date", book.end_date)
        const { data } = await post(url, payload, TOKEN)

        if (data?.status) {
            toast(data?.message, { hideProgressBar: true, containerId: `toastMenu`, type: `success`, autoClose: 2000})
            setTimeout(() => {router.push('/history')}, 2000)
        } else{
            toast(data?.message, { hideProgressBar: true, containerId: `toastMenu`, type: `warning`, autoClose: 2000})
        }
    } catch (error: any) {
        console.log(error)
        const message = error?.response?.data?.message || "Something went wrong"
        toast(message, {hideProgressBar: true, containerId: `toastRegister`, type: "error", autoClose: 2000})
    }
  }

  const handlePostReview = async () => {
    if (!reviewText.trim()) {
      toast("Review cannot be empty", { type: "warning" })
      return
    }

    try {
      const payload = new FormData()
      payload.append("kos_id", id)
      payload.append("comment", reviewText)

      const res = await post(`${BASE_API_URL}/review`, payload, TOKEN)

      if (res?.data?.status) {
        toast("Review posted", { type: "success" })

        // langsung masuk ke list review (optimistic UI)
        setReviews((prev) => [
          {
            ...res.data.data,
            user: { id: 0, name: "You", role: "society" },
            replies: []
          },
          ...prev
        ])

        setReviewText("")
      }
    } catch (error: any) {
      toast(
        error?.response?.data?.message || "Failed to post review",
        { type: "error" }
      )
    }
  }

  const isRoomAvailable = (kos.available_room ?? kos.total_room) > 0
  const isOwner = role === "owner"
  const isDisabled = !isRoomAvailable || isOwner || !TOKEN
  const roleIsAllowed = role === "society" || role === "admin"
  
  return (
    <div>
      <Header />

      <main className="px-6 md:px-20 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          
          {/* LEFT */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            
            {/* IMAGE */}
            <div className="rounded-xl overflow-hidden border-transparent">
              {kos.kos_images && kos.kos_images.length > 0 ? (
                <img
                  src={`${BASE_IMAGE_KOS}/${kos.kos_images[0].file}`}
                  alt={kos.name}
                  className="w-full h-[420px] object-cover"
                />
              ) : (
                <div className="h-[420px] flex items-center justify-center bg-gray-100 text-gray-400">
                  No Image
                </div>
              )}
            </div>

            {/* INFO */}
            <div className="flex flex-col gap-2">
              <h1 className="text-2xl font-bold">{kos.name}</h1>

              <div className="flex gap-3 text-sm text-gray-500">
                <span className="capitalize">{kos.gender}</span>
                <span>•</span>
                <span>{kos.address}</span>
              </div>

              <p className="text-sm text-gray-600">
                Private Bathroom, WiFi, AC
              </p>

              <p className="text-sm text-red-500">
                {kos.available_room ?? kos.total_room} Rooms Left
              </p>
            </div>

            {/* REVIEW SECTION */}
            <div className="mt-10 flex flex-col gap-6">
              <h2 className="font-semibold mb-3 text-xl">Review</h2>
              {/* INPUT */}
              {roleIsAllowed && TOKEN && canReview && (
                <div className="border border-[#E8E8E8] rounded-xl p-4 flex flex-col gap-3">
                  <textarea
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                    placeholder="Write your experience here..."
                    rows={3}
                    className="w-full resize-none border border-gray-300 rounded-md p-3 text-sm focus:outline-primary"
                  />
                  <button
                    onClick={handlePostReview}
                    className="self-end px-5 py-2 rounded-md bg-primary text-white text-sm hover:bg-primary/90 hover:cursor-pointer"
                  >
                    Post
                  </button>
                </div>
              )}

              {/* LIST REVIEW */}
              {loadingReview ? (
                <p className="text-sm text-gray-500">Loading reviews...</p>
              ) : reviews.length === 0 ? (
                <p className="text-sm text-gray-400">No reviews yet</p>
              ) : (
                <div className="flex flex-col gap-5">
                  {reviews.map((review) => (
                    <div key={review.id} className="border-b border-[#E8E8E8] pb-4">

                      {/* USER */}
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-semibold">
                          {review.user.name.charAt(0)}
                        </div>
                        <p className="text-sm font-medium">{review.user.name}</p>
                      </div>

                      {/* COMMENT */}
                      <p className="mt-2 text-sm text-gray-600">
                        {review.comment}
                      </p>

                      {/* REPLIES */}
                      {review.replies && review.replies.length > 0 && (
                        <div className="mt-3 ml-6 border-l border-[#E8E8E8] pl-4 flex flex-col gap-3">
                          {review.replies.map((reply) => (
                            <div key={reply.id}>
                              <p className="text-xs font-medium text-gray-700">
                                {reply.user.name} (Owner)
                              </p>
                              <p className="text-xs text-gray-600">
                                {reply.comment}
                              </p>
                            </div>
                          ))}
                        </div>
                      )}

                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* RIGHT */}
          <form onSubmit={handleSubmit}>
            <div className="border-transparent rounded-xl p-6 h-fit flex flex-col gap-4">
              <h2 className="text-xl font-bold text-black">
                Rp {kos.price_per_month.toLocaleString("id-ID")} / Month
              </h2>

              <div className="flex flex-col gap-2 text-sm">
                <label>Start Date</label>
                <input
                  type="date"
                  className="border border-[#898E8E] rounded-md px-3 py-2"
                  value={book.start_date}
                  required
                  onChange={(e) =>
                    setBook((prev) => ({
                      ...prev,
                      start_date: e.target.value,
                    }))
                  }
                />

                <label>End Date</label>
                <input
                  type="date"
                  className="border border-[#898E8E] rounded-md px-3 py-2"
                  value={book.end_date}
                  required
                  min={book.start_date}
                  onChange={(e) =>
                    setBook((prev) => ({
                      ...prev,
                      end_date: e.target.value,
                    }))
                  }
                />
              </div>

              <button className={`py-2 rounded-md ${isDisabled ? "bg-gray-300 cursor-not-allowed": "bg-primary hover:cursor-pointer text-white"}`} disabled={role === 'owner'}>
                Ask Owner
              </button>

              <button className={`py-2 rounded-md ${isDisabled ? "bg-gray-300 cursor-not-allowed": "bg-primary hover:cursor-pointer text-white"}`} disabled={role === 'owner'} type="submit">
                Book
              </button>
            </div>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  )
}
