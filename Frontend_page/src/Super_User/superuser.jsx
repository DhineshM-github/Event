import React, { useEffect, useState } from "react";
import {
  User,
  Rocket,
  Calendar,
  Clock,
  Ticket,
  Users,
  MapPin,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  X,
  Sparkles,
} from "lucide-react";

import {
  getAllEvents,
  updateEventStatus,
  getFullEventDetails,
} from "../Services/api";

/* 🎨 ENHANCED IMAGE SLIDER */
const ImageSlider = ({ images = [] }) => {
  const sliderImages =
    images.length === 1
      ? [...images, ...images, ...images]
      : [...images, ...images];

  return (
    <div className="relative w-32 h-24 overflow-hidden rounded-2xl shadow-lg">
      <div className="absolute inset-0 bg-gradient-to-br from-teal-400/20 to-transparent z-10"></div>
      <div className="flex animate-scroll">
        {sliderImages.map((img, i) => (
          <img
            key={i}
            src={img}
            alt="event"
            className="w-32 h-24 object-cover flex-shrink-0 transition-transform duration-300"
          />
        ))}
      </div>
    </div>
  );
};

/* STEPPER STEPS CONFIGURATION */
const STEPS = [
  { id: 1, name: "Details", icon: "📋" },
  { id: 2, name: "Booking", icon: "🎫" },
  { id: 3, name: "Stalls", icon: "🏪" },
  { id: 4, name: "Documents", icon: "📄" },
  { id: 5, name: "Terms", icon: "📜" },
  { id: 6, name: "Vendors", icon: "👥" },
];

/* STEP CONTENT COMPONENT */
const StepContent = ({ step, fullData }) => {
  switch (step) {
    case 1:
      return (
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div className="group">
              <label className="block text-xs font-semibold text-teal-600 mb-2 uppercase tracking-wider">
                Event Name
              </label>
              <p className="text-xl font-light text-gray-900 group-hover:text-teal-700 transition">
                {fullData?.eventDetails?.event_name || "-"}
              </p>
            </div>
            <div className="group">
              <label className="block text-xs font-semibold text-teal-600 mb-2 uppercase tracking-wider">
                Category
              </label>
              <div className="inline-block px-4 py-2 bg-gradient-to-r from-teal-50 to-cyan-50 text-teal-700 rounded-full text-sm font-medium">
                {fullData?.eventDetails?.category || "-"}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="group">
              <label className="block text-xs font-semibold text-teal-600 mb-2 uppercase tracking-wider">
                Venue
              </label>
              <p className="text-lg font-light text-gray-800">
                {fullData?.eventDetails?.venue || "-"}
              </p>
            </div>
            <div className="group">
              <label className="block text-xs font-semibold text-teal-600 mb-2 uppercase tracking-wider">
                Address
              </label>
              <p className="text-lg font-light text-gray-800">
                {fullData?.eventDetails?.address || "-"}
              </p>
            </div>
          </div>

          <div className="p-6 bg-gradient-to-br from-slate-50 to-blue-50 rounded-2xl border border-teal-100/50">
            <label className="block text-xs font-semibold text-teal-600 mb-3 uppercase tracking-wider">
              Description
            </label>
            <p className="text-gray-700 font-light leading-relaxed">
              {fullData?.eventDetails?.description || "-"}
            </p>
          </div>

          <div className="grid grid-cols-3 gap-4 pt-6 border-t border-gray-200">
            <div className="hover:transform hover:scale-105 transition duration-300">
              <p className="text-xs text-teal-600 font-semibold mb-1 uppercase tracking-wider">Start Date</p>
              <p className="text-lg font-medium text-gray-900">{fullData?.eventDetails?.start_date}</p>
            </div>
            <div className="hover:transform hover:scale-105 transition duration-300">
              <p className="text-xs text-teal-600 font-semibold mb-1 uppercase tracking-wider">Start Time</p>
              <p className="text-lg font-medium text-gray-900">{fullData?.eventDetails?.start_time}</p>
            </div>
            <div className="hover:transform hover:scale-105 transition duration-300">
              <p className="text-xs text-teal-600 font-semibold mb-1 uppercase tracking-wider">End Date</p>
              <p className="text-lg font-medium text-gray-900">{fullData?.eventDetails?.end_date}</p>
            </div>
          </div>
        </div>
      );

    case 2:
      return (
        <div className="space-y-6">
          <div className="grid grid-cols-3 gap-4">
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-teal-500 to-cyan-600 p-6 text-white shadow-xl hover:shadow-2xl transition-all duration-300 group cursor-pointer">
              <div className="absolute -top-8 -right-8 w-24 h-24 bg-white/10 rounded-full blur-xl group-hover:scale-125 transition duration-500"></div>
              <label className="block text-xs font-semibold mb-3 uppercase tracking-wider opacity-90">
                Capacity
              </label>
              <p className="text-4xl font-bold">{fullData?.booking?.capacity || "0"}</p>
            </div>
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-500 to-green-600 p-6 text-white shadow-xl hover:shadow-2xl transition-all duration-300 group cursor-pointer">
              <div className="absolute -top-8 -right-8 w-24 h-24 bg-white/10 rounded-full blur-xl group-hover:scale-125 transition duration-500"></div>
              <label className="block text-xs font-semibold mb-3 uppercase tracking-wider opacity-90">
                Registered
              </label>
              <p className="text-4xl font-bold">{fullData?.booking?.registered || "0"}</p>
            </div>
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 p-6 text-white shadow-xl hover:shadow-2xl transition-all duration-300 group cursor-pointer">
              <div className="absolute -top-8 -right-8 w-24 h-24 bg-white/10 rounded-full blur-xl group-hover:scale-125 transition duration-500"></div>
              <label className="block text-xs font-semibold mb-3 uppercase tracking-wider opacity-90">
                Available
              </label>
              <p className="text-4xl font-bold">
                {(fullData?.booking?.capacity || 0) - (fullData?.booking?.registered || 0)}
              </p>
            </div>
          </div>

          <div className="p-6 bg-white border-2 border-gray-200 rounded-2xl">
            <label className="block text-xs font-semibold text-teal-600 mb-3 uppercase tracking-wider">
              Booking Status
            </label>
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-teal-500 rounded-full animate-pulse"></div>
              <p className="text-lg font-medium text-gray-900">
                {fullData?.booking?.status || "Pending"}
              </p>
            </div>
          </div>
        </div>
      );

    case 3:
      return (
        <div className="space-y-4">
          {fullData?.layout?.stalls && fullData.layout.stalls.length > 0 ? (
            fullData.layout.stalls.map((stall, i) => (
              <div
                key={i}
                className="group relative p-5 border-2 border-gray-200 rounded-2xl hover:border-teal-400 hover:bg-gradient-to-r hover:from-teal-50 hover:to-cyan-50 transition-all duration-300 cursor-pointer overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-teal-500/0 to-cyan-500/0 group-hover:from-teal-500/5 group-hover:to-cyan-500/5 transition duration-300"></div>
                <div className="relative flex justify-between items-start">
                  <div>
                    <p className="font-semibold text-gray-900 text-lg">
                      {stall.stall_name}
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                      Size: <span className="font-medium">{stall.size || "N/A"}</span>
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-cyan-600">
                      ₹{stall.price_inr || "0"}
                    </p>
                    <span className="inline-block mt-2 px-3 py-1 bg-teal-100 text-teal-700 text-xs font-semibold rounded-full">
                      {stall.status || "Available"}
                    </span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center py-12 text-gray-500">No stalls available</p>
          )}
        </div>
      );

    case 4:
      return (
        <div className="space-y-4">
          {fullData?.documents?.docs && fullData.documents.docs.length > 0 ? (
            fullData.documents.docs.map((doc, i) => (
              <div
                key={i}
                className="group p-5 border-2 border-gray-200 rounded-2xl hover:border-teal-400 hover:shadow-lg transition-all duration-300 hover:bg-white"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-teal-100 to-cyan-100 rounded-xl flex items-center justify-center text-xl group-hover:scale-110 transition transform">
                      📄
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">
                        {doc.doc_type}
                      </p>
                      <p className="text-sm text-gray-600">
                        Doc #{doc.doc_number}
                      </p>
                    </div>
                  </div>
                  <span className="px-4 py-2 bg-gradient-to-r from-teal-100 to-cyan-100 text-teal-700 font-semibold text-sm rounded-full">
                    {doc.status || "Verified"}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center py-12 text-gray-500">No documents</p>
          )}
        </div>
      );

    case 5:
      return (
        <div className="space-y-4">
          {fullData?.terms && fullData.terms.length > 0 ? (
            fullData.terms.map((term, i) => (
              <div
                key={i}
                className="group p-6 border-l-4 border-teal-500 bg-gradient-to-r from-slate-50 to-white rounded-2xl hover:shadow-lg transition-all duration-300 cursor-pointer"
              >
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-teal-500 rounded-full mt-2"></div>
                  <div className="flex-1">
                    <p className="font-bold text-gray-900 text-lg">
                      {term.policy_group}
                    </p>
                    <p className="text-sm text-gray-600 mt-1 font-medium">
                      {term.policy_type}
                    </p>
                    <p className="text-sm text-gray-500 mt-2 leading-relaxed">
                      {term.description || "Policy details"}
                    </p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center py-12 text-gray-500">No terms defined</p>
          )}
        </div>
      );

    case 6:
      return (
        <div className="space-y-4">
          {fullData?.vendors && fullData.vendors.length > 0 ? (
            fullData.vendors.map((vendor, i) => (
              <div
                key={i}
                className="group p-5 border-2 border-gray-200 rounded-2xl hover:border-teal-400 hover:shadow-lg transition-all duration-300 hover:bg-gradient-to-r hover:from-slate-50 hover:to-white"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="font-bold text-gray-900 text-lg">
                      {vendor.vendor_name || "Vendor"}
                    </p>
                    <div className="mt-3 space-y-2">
                      <p className="text-sm text-gray-600 flex items-center gap-2">
                        <span className="text-teal-600">✉</span>
                        {vendor.contact_email || "No email"}
                      </p>
                      <p className="text-sm text-gray-600 flex items-center gap-2">
                        <span className="text-teal-600">📞</span>
                        {vendor.phone || "No phone"}
                      </p>
                    </div>
                  </div>
                  <span className="px-4 py-2 bg-gradient-to-r from-emerald-100 to-green-100 text-emerald-700 font-bold text-xs rounded-full uppercase tracking-wider">
                    {vendor.status || "Active"}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center py-12 text-gray-500">No vendors</p>
          )}
        </div>
      );

    default:
      return null;
  }
};

const SuperUserEvents = () => {
  const [events, setEvents] = useState([]);
  const [openMenu, setOpenMenu] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [fullData, setFullData] = useState(null);
  const [currentStep, setCurrentStep] = useState(1);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const res = await getAllEvents();
      setEvents(res.events);
    } catch (err) {
      console.error(err);
    }
  };

  const formatTime = (time) => {
    if (!time) return "";
    const [h, m] = time.split(":");
    const hour = h % 12 || 12;
    const ampm = h >= 12 ? "PM" : "AM";
    return `${hour}:${m} ${ampm}`;
  };

  const getStatusColor = (status) => {
    if (status === "APPROVED") return "text-emerald-600 bg-emerald-50";
    if (status === "REJECTED") return "text-red-600 bg-red-50";
    return "text-amber-600 bg-amber-50";
  };

  /* APPROVE / REJECT */
  const handleStatus = async (id, status) => {
    try {
      const res = await updateEventStatus(id, status);

      if (res?.success) {
        alert(`Event ${status} successfully ✅`);
        fetchEvents();
      } else {
        alert("Something went wrong ❌");
      }

      setOpenMenu(null);
    } catch (err) {
      console.error(err);
      alert("Server error ❌");
    }
  };


  /* VIEW FULL DETAILS */
  const handleView = async (id) => {
    const res = await getFullEventDetails(id);
    setFullData(res);
    setSelectedEvent(id);
    setCurrentStep(1);
    setOpenMenu(null);
  };

  /* CLOSE MODAL */
  const closeModal = () => {
    setSelectedEvent(null);
    setCurrentStep(1);
    setFullData(null);
  };

  /* NAVIGATION */
  const goNext = () => {
    if (currentStep < STEPS.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const goPrev = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-100 to-blue-50 p-8">
      {/* HEADER */}
      <div className="mb-12 flex items-center justify-between">
        <div>
          <h1 className="text-5xl font-light text-gray-900 tracking-tight">
            Event <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-cyan-600">Showcase</span>
          </h1>
          <p className="text-gray-600 mt-2 font-light">Manage and approve upcoming events</p>
        </div>
        <div className="w-20 h-20 bg-gradient-to-br from-teal-400 to-cyan-500 rounded-2xl flex items-center justify-center shadow-xl">
          <Sparkles className="w-10 h-10 text-white" />
        </div>
      </div>

      {/* GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {events.map((e, idx) => (
          <div
            key={e.id}
            className="group relative bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100 hover:border-teal-200 animate-fade-in"
            style={{ animationDelay: `${idx * 100}ms` }}
          >
            {/* GRADIENT OVERLAY */}
            <div className="absolute inset-0 bg-gradient-to-br from-teal-400/0 via-transparent to-cyan-400/0 group-hover:from-teal-400/5 group-hover:to-cyan-400/5 transition-all duration-500"></div>

            {/* TOP SECTION */}
            <div className="relative p-6 flex justify-between items-start">
              <div className="flex items-center gap-4 flex-1">
                <div className="transform group-hover:scale-110 transition duration-500">
                  <ImageSlider images={e.images || [e.banner_url]} />
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="text-xl font-bold text-gray-900 group-hover:text-teal-700 transition line-clamp-2">
                    {e.event_name}
                  </h2>
                  <p className="text-xs text-gray-500 mt-2 uppercase tracking-widest font-semibold">
                    {e.category}
                  </p>
                </div>
              </div>

              {/* 3 DOT MENU */}
              <div className="relative">
                <button
                  onClick={() => setOpenMenu(openMenu === e.id ? null : e.id)}
                  className="p-2 hover:bg-gray-100 rounded-xl transition text-gray-600 hover:text-teal-600"
                >
                  <MoreVertical size={20} />
                </button>

                {openMenu === e.id && (
                  <div className="absolute right-0 mt-2 w-40 bg-white border-2 border-gray-200 rounded-2xl shadow-xl z-10 overflow-hidden">
                    <button
                      onClick={() => handleView(e.id)}
                      className="w-full text-left px-4 py-3 hover:bg-teal-50 text-gray-900 font-medium transition flex items-center gap-2"
                    >
                      👁️ View Details
                    </button>
                    <div className="border-t border-gray-200"></div>
                    <button
                      onClick={() => handleStatus(e.id, "APPROVED")}
                      className="w-full text-left px-4 py-3 hover:bg-emerald-50 text-emerald-700 font-medium transition flex items-center gap-2"
                    >
                      ✅ Approve
                    </button>
                    <button
                      onClick={() => handleStatus(e.id, "REJECTED")}
                      className="w-full text-left px-4 py-3 hover:bg-red-50 text-red-700 font-medium transition flex items-center gap-2"
                    >
                      ❌ Reject
                    </button>
                    <button
                      onClick={() => handleStatus(e.id, "PENDING")}
                      className="w-full text-left px-4 py-3 hover:bg-yellow-50 text-yellow-700 font-medium transition flex items-center gap-2"
                    >
                      Pending
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent"></div>

            {/* DETAILS SECTION */}
            <div className="relative p-6 grid grid-cols-2 gap-4 text-sm">
              <div className="group/item flex gap-3">
                <div className="p-2 bg-teal-100 rounded-xl group-hover/item:bg-teal-200 transition text-teal-600">
                  <User size={16} />
                </div>
                <div className="min-w-0">
                  <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Created By</p>
                  <p className="font-medium text-gray-900 truncate">{e.created_by}</p>
                </div>
              </div>

              <div className="group/item flex gap-3">
                <div className="p-2 bg-cyan-100 rounded-xl group-hover/item:bg-cyan-200 transition text-cyan-600">
                  <Rocket size={16} />
                </div>
                <div className="min-w-0">
                  <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Status</p>
                  <p className={`font-bold text-sm ${getStatusColor(e.status).split(" ")[0]}`}>
                    {e.status}
                  </p>
                </div>
              </div>

              <div className="group/item flex gap-3">
                <div className="p-2 bg-amber-100 rounded-xl group-hover/item:bg-amber-200 transition text-amber-600">
                  <Calendar size={16} />
                </div>
                <div className="min-w-0">
                  <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Starts On</p>
                  <p className="font-medium text-gray-900">{e.start_date}</p>
                </div>
              </div>

              <div className="group/item flex gap-3">
                <div className="p-2 bg-purple-100 rounded-xl group-hover/item:bg-purple-200 transition text-purple-600">
                  <Clock size={16} />
                </div>
                <div className="min-w-0">
                  <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Time</p>
                  <p className="font-medium text-gray-900">{formatTime(e.start_time)}</p>
                </div>
              </div>

              <div className="group/item flex gap-3">
                <div className="p-2 bg-rose-100 rounded-xl group-hover/item:bg-rose-200 transition text-rose-600">
                  <Ticket size={16} />
                </div>
                <div className="min-w-0">
                  <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Fee</p>
                  <p className="font-bold text-gray-900">{e.pass_fee || "Free"}</p>
                </div>
              </div>

              <div className="group/item flex gap-3">
                <div className="p-2 bg-indigo-100 rounded-xl group-hover/item:bg-indigo-200 transition text-indigo-600">
                  <Users size={16} />
                </div>
                <div className="min-w-0">
                  <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Capacity</p>
                  <p className="font-bold text-gray-900">{e.capacity}</p>
                </div>
              </div>
            </div>

            {/* LOCATION */}
            <div className="relative px-6 pb-6 flex gap-3 text-sm pt-4 border-t border-gray-100">
              <MapPin size={18} className="text-teal-600 flex-shrink-0" />
              <div className="min-w-0">
                <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Location</p>
                <p className="font-medium text-gray-900">
                  {e.venue}, {e.address}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 🔥 FULL VIEW MODAL WITH STEPPER */}
      {selectedEvent && fullData?.eventDetails && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50 p-4 animate-fade-in">
          <div className="bg-white w-full max-w-5xl h-[90vh] overflow-hidden rounded-3xl shadow-2xl flex flex-col">

            {/* HEADER */}
            <div className="relative px-8 py-6 border-b border-gray-200 bg-gradient-to-r from-slate-50 via-teal-50 to-blue-50">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-3xl font-bold text-gray-900">
                    {fullData?.eventDetails?.event_name}
                  </h2>
                  <p className="text-sm text-gray-600 mt-2 font-medium">
                    Step <span className="text-teal-600 font-bold">{currentStep}</span> of <span className="text-teal-600 font-bold">{STEPS.length}</span>
                  </p>
                </div>
                <button
                  onClick={closeModal}
                  className="p-2 hover:bg-gray-200 rounded-full transition text-gray-600 hover:text-red-600"
                >
                  <X size={24} />
                </button>
              </div>
            </div>

            {/* STEPPER */}
            <div className="px-8 py-6 border-b border-gray-200 bg-white">
              <div className="flex items-center justify-between gap-2">
                {STEPS.map((step, idx) => (
                  <div key={step.id} className="flex-1 flex flex-col items-center relative">
                    <button
                      onClick={() => setCurrentStep(step.id)}
                      className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg transition-all duration-300 transform hover:scale-110 ${currentStep >= step.id
                          ? "bg-gradient-to-r from-teal-500 to-cyan-500 text-white shadow-lg"
                          : "bg-gray-200 text-gray-600"
                        }`}
                    >
                      {step.icon}
                    </button>
                    <p
                      className={`text-xs mt-2 text-center font-semibold transition ${currentStep >= step.id
                          ? "text-teal-600"
                          : "text-gray-500"
                        }`}
                    >
                      {step.name}
                    </p>
                    {idx < STEPS.length - 1 && (
                      <div
                        className={`h-1 flex-1 mt-3 absolute top-6 left-1/2 ml-6 transition-all duration-300 ${currentStep > step.id
                            ? "bg-gradient-to-r from-teal-500 to-cyan-500"
                            : "bg-gray-300"
                          }`}
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* CONTENT */}
            <div className="flex-1 overflow-y-auto p-8 bg-white">
              <div className="max-w-3xl">
                <div className="mb-6 flex items-center gap-3">
                  <div className="text-3xl">{STEPS[currentStep - 1].icon}</div>
                  <h3 className="text-2xl font-bold text-gray-900">
                    {STEPS[currentStep - 1].name}
                  </h3>
                </div>
                <StepContent step={currentStep} fullData={fullData} />
              </div>
            </div>

            {/* FOOTER - NAVIGATION */}
            <div className="flex justify-between items-center p-8 border-t border-gray-200 bg-gradient-to-r from-slate-50 to-blue-50">
              <button
                onClick={goPrev}
                disabled={currentStep === 1}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform ${currentStep === 1
                    ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300 hover:shadow-md hover:scale-105"
                  }`}
              >
                <ChevronLeft size={20} />
                Previous
              </button>

              <div className="flex gap-2">
                {STEPS.map((step) => (
                  <button
                    key={step.id}
                    onClick={() => setCurrentStep(step.id)}
                    className={`w-4 h-4 rounded-full transition-all duration-300 transform hover:scale-125 ${currentStep === step.id
                        ? "bg-gradient-to-r from-teal-500 to-cyan-500 shadow-lg w-6"
                        : "bg-gray-300 hover:bg-gray-400"
                      }`}
                  />
                ))}
              </div>

              <button
                onClick={goNext}
                disabled={currentStep === STEPS.length}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform ${currentStep === STEPS.length
                    ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-teal-500 to-cyan-600 text-white hover:shadow-lg hover:scale-105"
                  }`}
              >
                Next
                <ChevronRight size={20} />
              </button>
            </div>

          </div>
        </div>
      )}

      <style>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(calc(-100% / 3));
          }
        }

        .animate-fade-in {
          animation: fade-in 0.6s ease-out forwards;
        }

        .animate-scroll {
          animation: scroll 8s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default SuperUserEvents;