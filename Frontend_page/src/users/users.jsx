import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  MapPin,
  Phone,
  CheckCircle,
  XCircle,
  Info,
  AlertTriangle,
  Send,
  Loader2,
  Edit,
  Calendar,
  Utensils,
  Ticket,
  ChevronRight,
  ArrowLeft
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  getEventById,
  sendOtp,
  verifyOtp,
  resendOtp,
  bookEvent,
} from "../Services/api";

export const Userbooking = () => {
  const { id } = useParams();

  const [event, setEvent] = useState(null);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    food_preference: "Veg"
  });

  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [verified, setVerified] = useState(false);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1); // 1: Form, 2: Summary, 3: Success
  const [agreed, setAgreed] = useState(false);
  const [successData, setSuccessData] = useState(null);

  // 🔥 TOAST STATE
  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "info",
  });

  // 🔥 SHOW TOAST HELPER
  const showToast = (message, type = "info") => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast({ show: false, message: "", type: "info" });
    }, 3000);
  };

  useEffect(() => {
    fetchEvent();
  }, [id]);

  const fetchEvent = async () => {
    try {
      const data = await getEventById(id);
      setEvent(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // 🔥 SEND OTP
  const handleSendOtp = async () => {
    if (!form.email) {
      showToast("Please enter your email first!", "warning");
      return;
    }
    if (!validateEmail(form.email)) {
      showToast("Please enter a valid email address!", "error");
      return;
    }

    try {
      setLoading(true);
      await sendOtp(form.email);
      setOtpSent(true);
      showToast("OTP sent successfully to your email!", "success");
    } catch (err) {
      showToast("Failed to send OTP. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  // 🔥 VERIFY OTP
  const handleVerifyOtp = async () => {
    if (!otp) {
      showToast("Please enter the OTP", "warning");
      return;
    }
    try {
      setLoading(true);
      await verifyOtp(form.email, otp);
      setVerified(true);
      showToast("Email verified successfully!", "success");
    } catch (err) {
      showToast("Invalid OTP. Please check and try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  // 🔥 RESEND OTP
  const handleResendOtp = async () => {
    try {
      await resendOtp(form.email);
      setOtp("");
      showToast("OTP resent successfully!", "success");
    } catch {
      showToast("Failed to resend OTP.", "error");
    }
  };
  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  // 🔥 BOOK EVENT
  const handleBook = async () => {
    if (!verified) {
      showToast("Please verify your email first.", "warning");
      return;
    }

    try {
      setLoading(true);

      const bookingData = {
        event_id: id,
        ...form,
        food_preference: event?.food == 1 ? form.food_preference : "None"
      };

      const res = await bookEvent(bookingData);

      showToast("Booking confirmed! Check your email for details.", "success");
      setSuccessData(res);
      setStep(3);

    } catch (err) {
      showToast("Booking failed. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  if (step === 3 && successData) {
    return (
      <div className="min-h-screen bg-white p-6 flex flex-col items-center">
        <div className="max-w-md w-full animate-fade-in">
          {/* Success Header */}
          <div className="flex flex-col items-center mb-8">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <h2 className="text-3xl font-black text-gray-900 text-center">Ticket Confirmed!</h2>
            <p className="text-gray-500 text-center mt-2">Check your email for the digital copy</p>
          </div>

          {/* Ticket Card */}
          <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden relative">
            {/* Top Section */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-8 text-white relative">
              <div className="flex justify-between items-start mb-4">
                <Ticket className="w-8 h-8 opacity-50" />
                <span className="text-xs font-bold tracking-widest uppercase opacity-70">Entry Pass</span>
              </div>
              <h3 className="text-2xl font-bold truncate">{successData.event_details.name}</h3>
              <div className="flex items-center gap-2 mt-2 opacity-90 text-sm">
                <MapPin className="w-4 h-4" />
                <span className="truncate">{successData.event_details.venue}</span>
              </div>
            </div>

            {/* QR Section */}
            <div className="p-8 flex flex-col items-center bg-white">
              <div className="p-4 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200 mb-6">
                <img
                  src={`data:image/png;base64,${successData.qr_code}`}
                  alt="Booking QR Code"
                  className="w-48 h-48"
                />
              </div>

              {/* Divider */}
              <div className="w-full flex items-center gap-2 mb-6">
                <div className="h-[1px] flex-1 bg-gray-100"></div>
                <span className="text-[10px] font-bold text-gray-300 uppercase tracking-widest leading-none">Scannable Ticket</span>
                <div className="h-[1px] flex-1 bg-gray-100"></div>
              </div>

              {/* Data Grid */}
              <div className="w-full grid grid-cols-2 gap-4">
                <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                  <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Date</p>
                  <p className="text-sm font-bold text-gray-800 flex items-center gap-2">
                    <Calendar className="w-3 h-3 text-blue-500" />
                    {successData.event_details.date}
                  </p>
                </div>
                <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                  <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Visitor</p>
                  <p className="text-sm font-bold text-gray-800 truncate">{form.name}</p>
                </div>
                {event?.food == 1 && (
                  <div className="bg-gray-50 p-3 rounded-xl border border-gray-100 col-span-2">
                    <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Food Preference</p>
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-bold text-gray-800 flex items-center gap-2">
                        <Utensils className="w-3 h-3 text-orange-500" />
                        {successData.event_details.food}
                      </p>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-black ${successData.event_details.food === 'Veg' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {successData.event_details.food.toUpperCase()}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Decorative Punches */}
            <div className="absolute left-[-12px] top-[140px] w-6 h-6 bg-white rounded-full"></div>
            <div className="absolute right-[-12px] top-[140px] w-6 h-6 bg-white rounded-full"></div>
          </div>

          <button
            onClick={() => navigate('/')}
            className="w-full mt-8 py-4 bg-gray-900 text-white font-bold rounded-2xl hover:bg-black transition-all flex items-center justify-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen relative overflow-hidden font-sans">
      {/* 🔥 TOAST NOTIFICATION */}
      {toast.show && (
        <div className="fixed top-6 right-6 z-50 animate-bounce-in">
          <div
            className={`flex items-center gap-3 px-6 py-4 rounded-xl shadow-2xl border ${toast.type === "success"
                ? "bg-green-50 border-green-200 text-green-800"
                : toast.type === "error"
                  ? "bg-red-50 border-red-200 text-red-800"
                  : toast.type === "warning"
                    ? "bg-amber-50 border-amber-200 text-amber-800"
                    : "bg-blue-50 border-blue-200 text-blue-800"
              }`}
          >
            {toast.type === "success" && (
              <CheckCircle className="w-5 h-5 text-green-600" />
            )}
            {toast.type === "error" && (
              <XCircle className="w-5 h-5 text-red-600" />
            )}
            {toast.type === "warning" && (
              <AlertTriangle className="w-5 h-5 text-amber-600" />
            )}
            {toast.type === "info" && (
              <Info className="w-5 h-5 text-blue-600" />
            )}
            <span className="font-medium">{toast.message}</span>
            <button
              onClick={() => setToast({ ...toast, show: false })}
              className="ml-2 hover:opacity-70"
            >
              <XCircle className="w-4 h-4 opacity-50" />
            </button>
          </div>
        </div>
      )}

      {/* 🔥 EVENT HEADER */}
      <div className="max-w-4xl mx-auto mb-8 animate-fade-in">
        <div className="bg-white shadow-sm border border-gray-100 rounded-3xl p-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-5">
            <div className="p-4 bg-blue-100 rounded-2xl">
              <MapPin className="text-blue-600 w-8 h-8" />
            </div>
            <div>
              <h2 className="font-black text-2xl text-gray-900 leading-tight">
                {event?.venue || "Loading..."}
              </h2>
              <p className="text-gray-500 font-medium flex items-center gap-1">
                {event?.address || "Fetching address..."}
              </p>
            </div>
          </div>
          <div className="flex flex-col items-end">
            <span className="bg-blue-600 text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest mb-1">Event Date</span>
            <p className="text-xl font-black text-gray-900">{event?.start_date ? new Date(event.start_date).toLocaleDateString() : '--'}</p>
          </div>
        </div>
      </div>

      {/* 🔥 BOOKING FORM & SUMMARY */}
      <div className="flex justify-center max-w-4xl mx-auto gap-8 flex-col lg:flex-row items-start">
        <div className="bg-white rounded-[40px] shadow-2xl border border-gray-100 flex-1 w-full overflow-hidden animate-fade-in-up">
          {step === 1 ? (
            <div className="p-10">
              <div className="mb-10">
                <h3 className="text-gray-900 font-black text-4xl mb-3 tracking-tighter italic">
                  TICKET PASS
                </h3>
                <p className="text-gray-400 font-medium text-lg">
                  Complete your details to generate your digital entry pass.
                </p>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-xs font-black text-gray-400 mb-3 ml-1 uppercase tracking-widest">
                    Full Name
                  </label>
                  <input
                    name="name"
                    placeholder="Enter your full name"
                    value={form.name}
                    onChange={handleChange}
                    className="w-full border-2 border-gray-50 p-5 rounded-3xl focus:border-blue-500 focus:ring-0 transition-all outline-none bg-gray-50 focus:bg-white font-bold text-gray-800 placeholder:text-gray-300 shadow-inner"
                  />
                </div>

                {/* EMAIL + OTP */}
                <div>
                  <label className="block text-xs font-black text-gray-400 mb-3 ml-1 uppercase tracking-widest">
                    Email Address
                  </label>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <input
                      name="email"
                      type="email"
                      placeholder="email@example.com"
                      value={form.email}
                      onChange={handleChange}
                      disabled={verified}
                      className={`flex-1 border-2 border-gray-50 p-5 rounded-3xl focus:border-blue-500 focus:ring-0 transition-all outline-none bg-gray-50 focus:bg-white font-bold text-gray-800 placeholder:text-gray-300 shadow-inner ${verified ? "opacity-60 cursor-not-allowed" : ""}`}
                    />
                    {!verified && (
                      <button
                        onClick={handleSendOtp}
                        disabled={loading || !form.email}
                        className="bg-gray-900 hover:bg-black text-white px-8 h-[64px] rounded-3xl font-black transition-all disabled:bg-gray-200 flex items-center justify-center gap-2 group shadow-xl"
                      >
                        {loading && !otpSent ? (
                          <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                          <Send className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                        )}
                        {otpSent ? "RESEND" : "GET OTP"}
                      </button>
                    )}
                    {verified && (
                      <div className="bg-green-100 text-green-700 px-8 h-[64px] rounded-3xl font-black flex items-center justify-center gap-2 border-2 border-green-200">
                        <CheckCircle className="w-6 h-6" />
                        VERIFIED
                      </div>
                    )}
                  </div>
                </div>

                {/* OTP INPUT */}
                {otpSent && !verified && (
                  <div className="p-8 bg-blue-600 rounded-[35px] shadow-2xl shadow-blue-200 animate-slide-down">
                    <label className="block text-xs font-black text-blue-100 mb-4 ml-1 uppercase tracking-widest">
                      Verify OTP
                    </label>
                    <div className="flex gap-3">
                      <input
                        placeholder="000 000"
                        value={otp}
                        maxLength={6}
                        onChange={(e) => {
                          const value = e.target.value.replace(/\D/g, "");
                          setOtp(value);
                        }}
                        className="flex-1 border-none p-5 rounded-3xl focus:ring-4 focus:ring-blue-400 transition-all outline-none bg-white font-black text-2xl text-center text-blue-600 tracking-[10px]"
                      />
                      <button
                        onClick={handleVerifyOtp}
                        disabled={loading || !otp}
                        className="bg-white text-blue-600 hover:bg-blue-50 px-10 rounded-3xl font-black transition-all flex items-center gap-2 shadow-lg"
                      >
                        {loading ? (
                          <Loader2 className="w-6 h-6 animate-spin" />
                        ) : (
                          "VALIDATE"
                        )}
                      </button>
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-black text-gray-400 mb-3 ml-1 uppercase tracking-widest">
                    Phone Number
                  </label>
                  <input
                    name="phone"
                    placeholder="Enter phone number"
                    value={form.phone}
                    onChange={handleChange}
                    className="w-full border-2 border-gray-50 p-5 rounded-3xl focus:border-blue-500 focus:ring-0 transition-all outline-none bg-gray-50 focus:bg-white font-bold text-gray-800 placeholder:text-gray-300 shadow-inner"
                  />
                </div>

                {/* FOOD PREFERENCE */}
                {event?.food == 1 && (
                  <div>
                    <label className="block text-xs font-black text-gray-400 mb-4 ml-1 uppercase tracking-widest">
                      Food Preference
                    </label>
                    <div className="grid grid-cols-2 gap-4">
                      <button
                        onClick={() => setForm({ ...form, food_preference: 'Veg' })}
                        className={`p-5 rounded-3xl border-2 transition-all flex items-center justify-center gap-3 font-black ${form.food_preference === 'Veg' ? 'bg-green-50 border-green-500 text-green-700' : 'bg-gray-50 border-transparent text-gray-400'}`}
                      >
                        <div className={`w-3 h-3 rounded-full ${form.food_preference === 'Veg' ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                        VEG
                      </button>
                      <button
                        onClick={() => setForm({ ...form, food_preference: 'Non-Veg' })}
                        className={`p-5 rounded-3xl border-2 transition-all flex items-center justify-center gap-3 font-black ${form.food_preference === 'Non-Veg' ? 'bg-red-50 border-red-500 text-red-700' : 'bg-gray-50 border-transparent text-gray-400'}`}
                      >
                        <div className={`w-3 h-3 rounded-full ${form.food_preference === 'Non-Veg' ? 'bg-red-500' : 'bg-gray-300'}`}></div>
                        NON-VEG
                      </button>
                    </div>
                  </div>
                )}

                {verified && (
                  <button
                    onClick={() => setStep(2)}
                    className="w-full h-[80px] rounded-[30px] text-white font-black text-xl transition-all shadow-2xl mt-8 bg-blue-600 hover:bg-blue-700 hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-3"
                  >
                    CONTINUE TO SUMMARY
                    <ChevronRight className="w-6 h-6" />
                  </button>
                )}
                {!verified && (
                  <div className="w-full py-6 rounded-3xl bg-gray-100 text-gray-400 font-black text-center mt-8 tracking-widest">
                    EMAIL VERIFICATION REQUIRED
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="flex flex-col h-full">
              {/* Order Summary Header */}
              <div className="p-10 border-b border-gray-50 flex items-center justify-between bg-gray-50/50">
                <h3 className="text-2xl font-black text-gray-900 tracking-tighter">
                  ORDER SUMMARY
                </h3>
                <button
                  onClick={() => setStep(1)}
                  className="flex items-center gap-2 text-xs font-black text-blue-600 hover:text-blue-800 transition-colors uppercase tracking-widest"
                >
                  <Edit className="w-4 h-4" />
                  Edit Details
                </button>
              </div>

              {/* Summary Items */}
              <div className="p-10 space-y-6">
                <div className="flex justify-between items-center text-lg">
                  <span className="font-bold text-gray-400">Visitor Pass (1x)</span>
                  <span className="font-black text-gray-900">₹0.00</span>
                </div>

                <div className="flex justify-between items-center text-lg">
                  <span className="font-bold text-gray-400">Meal & Amenities</span>
                  <span className="font-black text-gray-900">₹0.00</span>
                </div>

                <div className="bg-gray-50 p-6 rounded-3xl border border-dashed border-gray-200 space-y-3">
                  <div className="flex justify-between items-center text-sm font-bold text-gray-500">
                    <span>Visitor Name</span>
                    <span className="text-gray-900">{form.name}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm font-bold text-gray-500">
                    <span>Email</span>
                    <span className="text-gray-900">{form.email}</span>
                  </div>
                  {event?.food == 1 && (
                    <div className="flex justify-between items-center text-sm font-bold text-gray-500">
                      <span>Food Preference</span>
                      <span className={`px-3 py-1 rounded-full text-[10px] ${form.food_preference === 'Veg' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {form.food_preference}
                      </span>
                    </div>
                  )}
                </div>

                <div className="flex justify-between items-center pt-6 border-t border-gray-100">
                  <span className="font-black text-gray-900 text-3xl italic tracking-tighter">TOTAL</span>
                  <span className="font-black text-gray-900 text-3xl tracking-tighter">₹0.00</span>
                </div>

                {/* T&C */}
                <div className="flex items-center gap-4 mt-10 p-4 bg-amber-50 rounded-2xl border border-amber-100">
  <input
    type="checkbox"
    checked={agreed}
    onChange={(e) => setAgreed(e.target.checked)}
    className="w-5 h-5 accent-amber-600 cursor-pointer rounded shrink-0"
  />

  <p className="text-sm text-amber-900 font-bold leading-relaxed m-0">
    I confirm that the details provided are correct and I agree to the event's{" "}
    <span className="underline cursor-pointer">
      Terms & Participation Policies
    </span>.
  </p>
</div>
              </div>

              {/* Final Button */}
              <button
                onClick={handleBook}
                disabled={loading || !agreed}
                className={`w-full h-[90px] text-white font-black text-2xl transition-all mt-auto flex items-center justify-center gap-3 ${agreed
                    ? "bg-green-600 hover:bg-green-700"
                    : "bg-gray-200 cursor-not-allowed text-gray-400"
                  }`}
              >
                {loading ? (
                  <>
                    <Loader2 className="w-8 h-8 animate-spin" />
                    <span>CONFIRMING...</span>
                  </>
                ) : (
                  <>
                    CONFIRM & GENERATE TICKET
                    <CheckCircle className="w-7 h-7" />
                  </>
                )}
              </button>
            </div>
          )}
        </div>

        {/* Info Card */}

      </div>

      <style>{`
        @keyframes bounce-in {
          0% { transform: translateY(-20px); opacity: 0; }
          60% { transform: translateY(5px); opacity: 1; }
          100% { transform: translateY(0); }
        }
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fade-in-right {
          from { opacity: 0; transform: translateX(20px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes slide-down {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-bounce-in { animation: bounce-in 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
        .animate-fade-in { animation: fade-in 0.5s ease-out; }
        .animate-fade-in-up { animation: fade-in-up 0.6s ease-out; }
        .animate-fade-in-right { animation: fade-in-right 0.6s ease-out; }
        .animate-slide-down { animation: slide-down 0.3s ease-out; }
      `}</style>
    </div>
  );
};
