import React, { useState, useEffect } from "react"
import { getEventPasses, getEventBulkDetails } from "../../Services/api"
import { Eye, Download } from "lucide-react"

const BulkPassPage = () => {

  const [page, setPage] = useState("list")
  const [events, setEvents] = useState([])
  const [selectedEvent, setSelectedEvent] = useState(null)
  const [details, setDetails] = useState([])
  const [search, setSearch] = useState("")
  const [perPage, setPerPage] = useState(10)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    getEventPasses().then((data) => {
      const formatted = data.map((item) => ({
        id: item.id,
        eventCode: item.event_code,
        eventName: item.event_name,
        bulkCount: item.total_visitors || 0
      }))
      setEvents(formatted)
    }).catch(err => console.error(err))
  }, [])

  useEffect(() => {
    if (selectedEvent && page === "detail") {
      setLoading(true)
      getEventBulkDetails()
        .then(data => {
          const filtered = data.filter(item => item.event_id === selectedEvent.id)
          setDetails(filtered)
        })
        .catch(err => console.error(err))
        .finally(() => setLoading(false))
    }
  }, [selectedEvent, page])

  const filtered = events.filter(e =>
    e.eventCode.toLowerCase().includes(search.toLowerCase()) ||
    e.eventName.toLowerCase().includes(search.toLowerCase())
  )

  const filteredDetails = details.filter(d =>
    d.name.toLowerCase().includes(search.toLowerCase()) ||
    d.visitor_code.toLowerCase().includes(search.toLowerCase())
  )

  return (

    <div className="min-h-screen bg-[#eef1f7] font-sans">

      {/* HEADER */}

      <div className="bg-white border-b border-gray-200 px-6 py-3">
        <h1 className="text-[17px] font-semibold text-[#2d3e6e]">
          Bulk and Pass Generation
        </h1>
      </div>

      {/* ================= LIST PAGE ================= */}

      {page === "list" && (

        <div className="mx-6 mt-5 bg-white rounded shadow-sm">

          {/* SEARCH */}

          <div className="px-4 pt-4 pb-2">

            <input
              type="text"
              placeholder="Search Keyword"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="border border-gray-300 rounded px-3 py-1.5 text-sm w-52"
            />

          </div>

          {/* TABLE */}

          <div className="overflow-x-auto">

            <table className="w-full">

              <thead>
            <tr className="bg-sky-600 text-white">

                  <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">Action</th>

                  <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">Event Code</th>

                  <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">Event Name</th>

                  <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">Bulk Registration Count</th>

                </tr>

              </thead>

              <tbody>

                {filtered.map((event, index) => (

                  <tr key={index} className="hover:bg-sky-50/50 transition-colors duration-200 group">

                    <td className="px-4 py-2 text-center">

                      <button
                        onClick={() => {

                          setSelectedEvent(event)
                          setPage("detail")
                          setSearch("")

                        }}
                        className="text-blue-600 hover:scale-110"
                      >

                        <Eye size={18} />

                      </button>

                    </td>

                    <td className="px-4 py-2 text-blue-600">{event.eventCode}</td>

                    <td className="px-4 py-2 text-blue-600">{event.eventName}</td>

                    <td className="px-4 py-2">{event.bulkCount}</td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

          <Pagination total={filtered.length} perPage={perPage} setPerPage={setPerPage} />

        </div>

      )}

      {/* ================= DETAIL PAGE ================= */}

      {page === "detail" && (

        <div className="mx-6 mt-5 bg-white rounded shadow-sm">

          {/* TOP BAR */}

          <div className="px-4 pt-4 pb-2 flex justify-between">

            <input
              type="text"
              placeholder="Search Name / Code"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="border border-gray-300 rounded px-3 py-1.5 text-sm w-52"
            />

            <div className="flex gap-2 text-xs">

              <button className="border px-3 py-1 rounded bg-gray-50 hover:bg-gray-100">Excel</button>

              <button className="border px-3 py-1 rounded bg-gray-50 hover:bg-gray-100">PDF</button>

            </div>

          </div>

          {/* TABLE */}

          <div className="overflow-x-auto">

            <table className="w-full">

              <thead>
            <tr className="bg-sky-600 text-white">

                  <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">Action</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">Visitor Code</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">Visitor Name</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">Email</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">Phone</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">Registered On</th>

                </tr>

              </thead>

              <tbody>

                {loading ? (
                   <tr>
                    <td colSpan={6} className="px-4 py-10 text-center text-gray-500">
                      Loading details...
                    </td>
                  </tr>
                ) : filteredDetails.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-10 text-center text-gray-500">
                      No Data Found for {selectedEvent?.eventName}
                    </td>
                  </tr>
                ) : (
                  filteredDetails.map((item, idx) => (
                    <tr key={idx} className="hover:bg-sky-50/50 transition-colors duration-200 group">
                      <td className="px-4 py-2">
                         <button className="text-blue-600 hover:scale-110" title="Download Pass">
                            <Download size={16} />
                         </button>
                      </td>
                      <td className="px-4 py-2 text-blue-600">{item.visitor_code}</td>
                      <td className="px-4 py-2">{item.name}</td>
                      <td className="px-4 py-2">{item.email}</td>
                      <td className="px-4 py-2">{item.phone}</td>
                      <td className="px-4 py-2">{item.created_at}</td>
                    </tr>
                  ))
                )}

              </tbody>

            </table>

          </div>

          {/* BACK BUTTON */}

          <div className="px-6 py-4">

            <button
              onClick={() => {
                setPage("list")
                setSearch("")
              }}
              className="bg-blue-600 text-white px-4 py-1 rounded text-sm"
            >

              Back

            </button>

          </div>

        </div>

      )}

    </div>

  )

}

export default BulkPassPage;

function Pagination({ total, perPage, setPerPage }) {

  const showing = total === 0
    ? "0 to 0 of 0"
    : `1 to ${Math.min(total, perPage)} of ${total}`

  return (

    <div className="flex items-center justify-center gap-2 py-3 text-sm text-gray-600">

      <span>Showing {showing} entries</span>

      <button className="px-2 text-gray-400">«</button>

      <button className="px-2 text-gray-400">‹</button>

      <button className="w-7 h-7 rounded text-white text-xs bg-blue-600">
        1
      </button>

      <button className="px-2 text-gray-400">›</button>

      <button className="px-2 text-gray-400">»</button>

      <select
        value={perPage}
        onChange={(e) => setPerPage(Number(e.target.value))}
        className="border rounded px-1 py-0.5 text-xs ml-1"
      >

        <option>10</option>
        <option>25</option>
        <option>50</option>

      </select>

    </div>

  )

}