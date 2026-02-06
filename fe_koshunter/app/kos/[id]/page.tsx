"use client"

import { useEffect, useState, FormEvent } from "react"
import { useParams, useRouter } from "next/navigation"
import { toast } from "react-toastify"
import Image from "next/image"
import Header from "@/components/navbar"
import Footer from "@/components/footer"
import { BASE_API_URL, BASE_IMAGE_KOS } from "@/global"
import { get } from "@/lib/api-bridge"
import { IKos, IBook } from "@/app/types"
import { post } from "@/lib/api-bridge"
import { getCookie } from "@/lib/client-cookies"

export default function KosDetailPage() {
  const params = useParams<{ id: string }>()
  const role = getCookie("role")
  const id = params.id 
  const TOKEN = getCookie("token") || ""
  const [kos, setKos] = useState<IKos | null>(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const [book, setBook] = useState<IBook>({
      id: 0,
      kos_id: 0,
      user_id: 0,
      start_date: '',
      end_date: '',
      status: 'pending'
  })

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

  const isRoomAvailable = (kos.available_room ?? kos.total_room) > 0
  const isOwner = role === "owner"
  const isDisabled = !isRoomAvailable || isOwner
  

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

            {/* REVIEW */}
            <div className="mt-6">
              <h2 className="font-semibold mb-3">Review</h2>

              <textarea
                className="w-full border border-[#898E8E] rounded-md p-3 text-sm focus:outline-primary resize-none"
                placeholder="Add review..."
                rows={4}
              />

              <button className="mt-3 w-full bg-primary text-white py-2 rounded-md hover:cursor-pointer">
                Post
              </button>

              {/* dummy review */}
              <div className="mt-6 flex flex-col gap-4 text-sm">
                <div>
                  <p className="font-semibold">John Doe</p>
                  <p className="text-gray-500">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                  </p>
                </div>

                <div>
                  <p className="font-semibold">Doe Mike</p>
                  <p className="text-gray-500">
                    Sed do eiusmod tempor incididunt ut labore.
                  </p>
                </div>
              </div>
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
