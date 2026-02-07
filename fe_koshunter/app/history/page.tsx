"use client"

import { useEffect, useState } from "react"
import Header from "@/components/navbar"
import Footer from "@/components/footer"
import { BASE_API_URL, BASE_IMAGE_KOS } from "@/global"
import { get } from "@/lib/api-bridge"
import { IBook } from "../types"
import { getCookie } from "@/lib/client-cookies"
import { useRouter } from "next/navigation"

export default function BookingHistoryPage() {
  const [books, setBooks] = useState<IBook[]>([])
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const countMonths = (start: string, end: string) => {
        const startDate = new Date(start)
        const endDate = new Date(end)

        let months =
            (endDate.getFullYear() - startDate.getFullYear()) * 12 +
            (endDate.getMonth() - startDate.getMonth())

        return months <= 0 ? 1 : months
    }

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        setLoading(true)
        const token = getCookie("token")
        if (!token) return

        const res = await get(`${BASE_API_URL}/book/history`, token)
        if (res?.data?.status) {
          setBooks(res.data.data)
        } else {
          setBooks([])
        }
      } catch (error) {
        console.log(error)
        setBooks([])
      } finally {
        setLoading(false)
      }
    }

    fetchHistory()
  }, [router])


  useEffect(() => {
    const token = getCookie("token")
    if (!token) {
      router.replace("/login")
    }
  }, [router])


  const STATUS_STYLE: Record<string, string> = {
    pending: "bg-yellow-100 text-yellow-700",
    accepted: "bg-green-100 text-green-700",
    rejected: "bg-red-100 text-red-700",
  }

  return (
    <div>
      <Header />

      <main className="px-6 md:px-20 py-10 min-h-[60vh]">
        <h1 className="text-xl font-semibold mb-6">Booking History</h1>

        {loading ? (
          <p className="text-gray-500">Loading...</p>
        ) : books.length === 0 ? (
          <p className="text-gray-500">No booking history</p>
        ) : (
          <>
            {/* ================= DESKTOP TABLE ================= */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="text-left text-sm text-gray-500 border-b border-[#E8E8E8]">
                    <th className="p-3">Kos</th>
                    <th className="p-3">Total</th>
                    <th className="p-3">Status</th>
                    <th className="p-3">Duration</th>
                    <th className="p-3">Booked By</th>
                    <th className="p-3">ID Booking</th>
                  </tr>
                </thead>

                <tbody>
                  {books.map((book) => (
                    <tr
                      key={book.id}
                      onClick={() => router.push(`/kos/${book.kos?.id}`)}
                      className="border-b border-[#E8E8E8] hover:bg-gray-50 transition"
                    >
                      {/* KOS */}
                      <td className="p-3">
                        <div className="flex flex-row md:flex-col lg:flex-row gap-4 items-center">
                          <img
                            src={`${BASE_IMAGE_KOS}/${book.kos?.kos_images?.[0]?.file ?? ""}`}
                            className="w-24 h-16 rounded-md object-cover border-transparent"
                            alt={book.kos?.name}
                          />
                          <div>
                            <p className="text-md font-semibold">{book.kos?.name}</p>
                            <p className="text-xs text-gray-500">
                              Private Bathroom, WiFi, AC
                            </p>
                            <p className="text-xs capitalize text-gray-400">
                              {book.kos?.gender}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* TOTAL */}
                      <td className="p-3 font-medium">
                        {book.kos
                        ? (() => {
                            const months = countMonths(book.start_date, book.end_date)
                            const total = months * book.kos.price_per_month
                            return `Rp ${total.toLocaleString("id-ID")}`
                        })()
                        : "-"}
                      </td>

                      {/* STATUS */}
                      <td className="p-3">
                        <span
                          className={`px-3 py-1 text-xs rounded-full capitalize ${STATUS_STYLE[book.status]}`}
                        >
                          {book.status}
                        </span>
                      </td>

                      <td className="p-3">
                        {countMonths(book.start_date, book.end_date)} Month(s)
                      </td>

                      {/* EMAIL */}
                      <td className="p-3 text-sm break-all max-w-[220px]">
                        {book.user?.email ?? "You"}
                      </td>

                      {/* ID */}
                      <td className="p-3 text-sm">#{book.id}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* ================= MOBILE CARD ================= */}
            <div className="md:hidden flex flex-col gap-4">
              {books.map((book) => {
                const months = countMonths(book.start_date, book.end_date)
                const total = book.kos
                  ? months * book.kos.price_per_month
                  : 0

                return (
                  <div
                    key={book.id}
                    className="border border-[#E8E8E8] rounded-lg p-4 flex flex-col gap-3 cursor-pointer"
                    onClick={() => router.push(`/kos/${book.kos?.id}`)}
                  >
                    <div className="flex gap-3">
                      <img
                        src={`${BASE_IMAGE_KOS}/${book.kos?.kos_images?.[0]?.file ?? ""}`}
                        className="w-24 h-16 rounded-md object-cover border"
                        alt={book.kos?.name}
                      />
                      <div>
                        <p className="font-semibold">{book.kos?.name}</p>
                        <p className="text-xs text-gray-500">
                          Private Bathroom, WiFi, AC
                        </p>
                        <p className="text-xs capitalize text-gray-400">
                          {book.kos?.gender}
                        </p>
                      </div>
                    </div>

                    {/* TOTAL */}
                    <div className="flex justify-between text-sm">
                      <span>Total</span>
                      <span className="font-medium">
                        Rp {total.toLocaleString("id-ID")}
                      </span>
                    </div>

                    {/* DURATION */}
                    <div className="flex justify-between text-sm">
                      <span>Duration</span>
                      <span className="font-medium">
                        {months} Month(s)
                      </span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span
                        className={`px-3 py-1 text-xs rounded-full capitalize ${STATUS_STYLE[book.status]}`}
                      >
                        {book.status}
                      </span>
                      <span className="text-xs text-gray-400">
                        #{book.id}
                      </span>
                    </div>

                    <p className="text-xs break-all text-gray-600">
                      {book.user?.email ?? "You"}
                    </p>
                  </div>
                )
              })}
            </div>
          </>
        )}
      </main>

      <Footer />
    </div>
  )
}
