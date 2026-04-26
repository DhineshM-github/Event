import { useState, useEffect } from "react";
import { Eye, ArrowLeft, Plus, Search, ChevronDown } from "lucide-react";
import { createProgram as createProgramAPI, getProgramEvents, getProgramsByEvent } from "../../Services/api";

export default function CreateProgram() {
  const [page, setPage] = useState(1);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [search, setSearch] = useState("");

  const [events, setEvents] = useState([]);

  // Page 2 states
  const [progSearch, setProgSearch] = useState("");
  const [viewBy, setViewBy] = useState("All");
  const [programs, setPrograms] = useState([]);

  // Page 3 states
  const [formData, setFormData] = useState({
    name: "", code: "", category: "", type: "", start: "", end: "", venue: "", maxPart: "", budget: "", coordName: "", coordEmail: "", desc: "", status: "Active",
  });
  const [toast, setToast] = useState(false);

  // Fetch events on mount
  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const data = await getProgramEvents();
      setEvents(data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchPrograms = async (eventId) => {
    try {
      const data = await getProgramsByEvent(eventId);
      setPrograms(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSelectEvent = (event) => {
    setSelectedEvent(event);
    fetchPrograms(event.id);
    setPage(2);
  };

  const filtered = events.filter((e) =>
    (e.event_name || "").toLowerCase().includes(search.toLowerCase())
  );

  const filteredPrograms = programs.filter((p) =>
    (p.program_name || "").toLowerCase().includes(progSearch.toLowerCase())
  ).filter((p) => {
    if (viewBy === "All") return true;
    return p.status === viewBy;
  });

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      await createProgramAPI({ ...formData, event_id: selectedEvent.id });
      setToast(true);
      setTimeout(() => {
        setToast(false);
        setPage(2);
        setFormData({
          name: "", code: "", category: "", type: "", start: "", end: "", venue: "", maxPart: "", budget: "", coordName: "", coordEmail: "", desc: "", status: "Active"
        });
        fetchPrograms(selectedEvent.id);
        fetchEvents(); // update counts
      }, 2000);
    } catch (err) {
      console.error(err);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="p-8 bg-[#f8fafc] min-h-screen text-sm">
      {/* ================= PAGE 1 ================= */}
      {page === 1 && (
        <>
          <h1 className="text-2xl font-semibold text-gray-700 mb-6">
            My Programs
          </h1>

          <div className="bg-white shadow border border-gray-200 rounded-lg p-6">
            <input
              type="text"
              placeholder="Search Event"
              className="border border-gray-300 rounded px-3 py-2 w-64 mb-6 focus:outline-none focus:border-blue-500"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
            <tr className="bg-sky-600 text-white">
                    <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">Action</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">Event Code</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">Event Name</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">Created</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">Inprocess</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">Approved</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">Rejected</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((event, i) => (
                    <tr key={i} className="hover:bg-sky-50/50 transition-colors duration-200 group">
                      <td className="p-3 border">
                        <button
                          onClick={() => handleSelectEvent(event)}
                          className="border border-gray-300 bg-white hover:bg-gray-100 px-2 py-1 rounded shadow-sm text-gray-600"
                        >
                          <Eye size={18} />
                        </button>
                      </td>
                      <td className="p-3 border">{event.event_code}</td>
                      <td className="p-3 border">{event.event_name}</td>
                      <td className="p-3 border text-center">
                        <span className="bg-gray-200 text-gray-700 px-2 py-1 rounded inline-block min-w-[2rem]">
                          {event.created}
                        </span>
                      </td>
                      <td className="p-3 border text-center">
                        <span className="bg-orange-100 text-orange-600 px-2 py-1 rounded inline-block min-w-[2rem]">
                          {event.inprocess}
                        </span>
                      </td>
                      <td className="p-3 border text-center">
                        <span className="bg-green-100 text-green-600 px-2 py-1 rounded inline-block min-w-[2rem]">
                          {event.approved}
                        </span>
                      </td>
                      <td className="p-3 border text-center">
                        <span className="bg-red-100 text-red-600 px-2 py-1 rounded inline-block min-w-[2rem]">
                          {event.rejected}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {filtered.length === 0 && (
                    <tr>
                      <td colSpan="7" className="px-6 py-4 text-center text-gray-500">
                        No Events Found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* ================= PAGE 2 ================= */}
      {page === 2 && (
        <>
          <div className="bg-white shadow border border-gray-200 rounded-lg">
            <div className="flex justify-between items-center bg-gray-50 px-6 py-4 border-b border-gray-200 rounded-t-lg">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setPage(1)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <ArrowLeft size={20} />
                </button>
                <h2 className="text-lg font-semibold text-gray-700">
                  {selectedEvent?.event_name} ({selectedEvent?.event_code})
                </h2>
              </div>

              <div className="flex items-center gap-3">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search Program..."
                    className="border border-gray-300 rounded pl-8 pr-3 py-1.5 focus:outline-none focus:border-blue-500"
                    value={progSearch}
                    onChange={(e) => setProgSearch(e.target.value)}
                  />
                  <Search
                    size={16}
                    className="absolute left-2.5 top-2 text-gray-400"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-gray-600 font-medium whitespace-nowrap">
                    View By:
                  </span>
                  <div className="relative">
                    <select
                      value={viewBy}
                      onChange={(e) => setViewBy(e.target.value)}
                      className="border border-gray-300 rounded pl-3 pr-8 py-1.5 appearance-none focus:outline-none focus:border-blue-500 bg-white"
                    >
                      <option value="All">All</option>
                      <option value="Active">Approved</option>
                      <option value="Inactive">Rejected</option>
                      <option value="Inprocess">Inprocess</option>
                    </select>
                    <ChevronDown
                      size={16}
                      className="absolute right-2 top-2 text-gray-500 pointer-events-none"
                    />
                  </div>
                </div>

                <button
                  onClick={() => setPage(3)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded flex items-center gap-1 shadow-sm"
                >
                  <Plus size={16} /> New Program
                </button>
              </div>
            </div>

            {filteredPrograms.length > 0 ? (
              <div className="p-6">
                <table className="w-full">
                  <thead>
            <tr className="bg-sky-600 text-white">
                      <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">Program Code</th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">Program Name</th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">Category</th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">Type</th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredPrograms.map((prog, idx) => (
                      <tr key={idx} className="hover:bg-sky-50/50 transition-colors duration-200 group">
                        <td className="p-3 border">{prog.program_code}</td>
                        <td className="p-3 border">{prog.program_name}</td>
                        <td className="p-3 border">{prog.category}</td>
                        <td className="p-3 border">{prog.type}</td>
                        <td className="p-3 border text-center">
                          <span className={`px-2 py-1 rounded text-xs ${prog.status === 'Active' ? 'bg-green-100 text-green-700' :
                            prog.status === 'Inactive' ? 'bg-red-100 text-red-700' :
                              'bg-orange-100 text-orange-700'
                            }`}>
                            {prog.status === 'Active' ? 'Approved' : (prog.status === 'Inactive' ? 'Rejected' : prog.status)}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="p-16 flex flex-col items-center justify-center border-dashed border-2 border-gray-200 m-8 rounded-xl bg-gray-50">
                <p className="text-gray-500 text-lg mb-2">No Programs match your filter</p>
                <p className="text-gray-400">
                  Click "+ New Program" to add your first program for this event.
                </p>
              </div>
            )}
          </div>
        </>
      )}

      {/* ================= PAGE 3 ================= */}
      {page === 3 && (
        <div className="bg-white shadow border border-gray-200 rounded-lg relative overflow-hidden">
          {/* Toast Notification */}
          {toast && (
            <div className="absolute top-4 right-4 bg-green-500 text-white px-6 py-3 rounded shadow-lg animate-bounce z-10">
              ✅ Program created successfully!
            </div>
          )}

          <div className="flex items-center gap-3 bg-gray-50 px-6 py-4 border-b border-gray-200 rounded-t-lg">
            <button
              onClick={() => setPage(2)}
              className="text-gray-500 hover:text-gray-700"
            >
              <ArrowLeft size={20} />
            </button>
            <h2 className="text-lg font-semibold text-gray-700">
              Create Program for {selectedEvent?.event_name}
            </h2>
          </div>

          <form className="p-8" onSubmit={handleFormSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-600 mb-1 font-medium">Program Name *</label>
                  <input required name="name" value={formData.name} onChange={handleInputChange} type="text" className="w-full border border-gray-300 rounded px-3 py-2 outline-none focus:border-blue-500" placeholder="e.g. Inaugural Session" />
                </div>
                <div>
                  <label className="block text-gray-600 mb-1 font-medium">Program Code *</label>
                  <input required name="code" value={formData.code} onChange={handleInputChange} type="text" className="w-full border border-gray-300 rounded px-3 py-2 outline-none focus:border-blue-500" placeholder="e.g. PRG-001" />
                </div>
                <div>
                  <label className="block text-gray-600 mb-1 font-medium">Category</label>
                  <input name="category" value={formData.category} onChange={handleInputChange} type="text" className="w-full border border-gray-300 rounded px-3 py-2 outline-none focus:border-blue-500" placeholder="e.g. Keynote" />
                </div>
                <div>
                  <label className="block text-gray-600 mb-1 font-medium">Event Type</label>
                  <select name="type" value={formData.type} onChange={handleInputChange} className="w-full border border-gray-300 rounded px-3 py-2 outline-none focus:border-blue-500 bg-white">
                    <option value="">Select Type</option>
                    <option value="Workshop">Workshop</option>
                    <option value="Seminar">Seminar</option>
                    <option value="Panel">Panel Discussion</option>
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-600 mb-1 font-medium">Start Date & Time</label>
                    <input name="start" value={formData.start} onChange={handleInputChange} type="datetime-local" className="w-full border border-gray-300 rounded px-3 py-2 outline-none focus:border-blue-500" />
                  </div>
                  <div>
                    <label className="block text-gray-600 mb-1 font-medium">End Date & Time</label>
                    <input name="end" value={formData.end} onChange={handleInputChange} type="datetime-local" className="w-full border border-gray-300 rounded px-3 py-2 outline-none focus:border-blue-500" />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-gray-600 mb-1 font-medium">Venue</label>
                  <input name="venue" value={formData.venue} onChange={handleInputChange} type="text" className="w-full border border-gray-300 rounded px-3 py-2 outline-none focus:border-blue-500" placeholder="Hall A" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-600 mb-1 font-medium">Max Participants</label>
                    <input name="maxPart" value={formData.maxPart} onChange={handleInputChange} type="number" className="w-full border border-gray-300 rounded px-3 py-2 outline-none focus:border-blue-500" placeholder="100" />
                  </div>
                  <div>
                    <label className="block text-gray-600 mb-1 font-medium">Budget</label>
                    <input name="budget" value={formData.budget} onChange={handleInputChange} type="number" className="w-full border border-gray-300 rounded px-3 py-2 outline-none focus:border-blue-500" placeholder="$" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-600 mb-1 font-medium">Coordinator Name</label>
                    <input name="coordName" value={formData.coordName} onChange={handleInputChange} type="text" className="w-full border border-gray-300 rounded px-3 py-2 outline-none focus:border-blue-500" placeholder="John Doe" />
                  </div>
                  <div>
                    <label className="block text-gray-600 mb-1 font-medium">Coordinator Email</label>
                    <input name="coordEmail" value={formData.coordEmail} onChange={handleInputChange} type="email" className="w-full border border-gray-300 rounded px-3 py-2 outline-none focus:border-blue-500" placeholder="john@example.com" />
                  </div>
                </div>
                <div>
                  <label className="block text-gray-600 mb-1 font-medium">Status</label>
                  <select name="status" value={formData.status} onChange={handleInputChange} className="w-full border border-gray-300 rounded px-3 py-2 outline-none focus:border-blue-500 bg-white">
                    <option value="Active">Approved</option>
                    <option value="Inactive">Rejected</option>
                    <option value="Inprocess">Inprocess</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="mb-8">
              <label className="block text-gray-600 mb-1 font-medium">Description</label>
              <textarea name="desc" value={formData.desc} onChange={handleInputChange} rows="3" className="w-full border border-gray-300 rounded px-3 py-2 outline-none focus:border-blue-500" placeholder="Program details..."></textarea>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
              <button
                type="button"
                onClick={() => setPage(2)}
                className="px-6 py-2 border border-gray-300 rounded bg-white text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Create Program
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};