import { useState, useEffect } from "react";
import { FaCloudUploadAlt, FaSave, FaUserCircle } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import { getUserProfile, updateUserProfile } from "../../Services/api";


const MyProfile = () => {
  const { t } = useTranslation();
  const [profileImage, setProfileImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const userId = sessionStorage.getItem("userId") || sessionStorage.getItem("User_id") || sessionStorage.getItem("id");

  const [formData, setFormData] = useState({
    id: userId,
    name: "",
    mobile: "",
    email: "",
    address: "",
    country: "India",
    state: "",
    city: "",
    profile_image: ""
  });

  const states = {
    India: [
      "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
      "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand",
      "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur",
      "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab",
      "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura",
      "Uttar Pradesh", "Uttarakhand", "West Bengal"
    ],
  };

  const cities = {
    "Tamil Nadu": ["Chennai", "Coimbatore", "Madurai", "Trichy", "Salem"],
    "Maharashtra": ["Mumbai", "Pune", "Nagpur", "Thane"],
    "Karnataka": ["Bangalore", "Mysore", "Hubballi"],
    "Kerala": ["Kochi", "Trivandrum", "Kozhikode"],
    // Default fallback
    "default": ["Enter City Manually"] 
  };

  useEffect(() => {
    if (userId) {
      fetchProfile();
    }
  }, [userId]);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const res = await getUserProfile(userId);
      if (res.status === "success") {
        const data = res.data;

        setFormData({
          id: data.id,
          name: data.name || "",
          mobile: data.mobile || "",
          email: data.email || "",
          address: data.address || "",
          country: data.country || "India",
          state: data.state || "",
          city: data.city || "",
          profile_image: data.profile_image || ""
        });
        if (data.profile_image) setProfileImage(data.profile_image);
      }
    } catch (err) {
      console.error("Error fetching profile:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result);
        setFormData(prev => ({ ...prev, profile_image: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage({ type: "", text: "" });
    try {
      const res = await updateUserProfile(formData);
      if (res.status === "success") {
        setMessage({ type: "success", text: "Profile updated successfully!" });
      } else {
        setMessage({ type: "error", text: "Failed to update profile." });
      }

    } catch (err) {
      console.error("Error saving profile:", err);
      setMessage({ type: "error", text: "Error connecting to server." });
    } finally {
      setSaving(false);
      setTimeout(() => setMessage({ type: "", text: "" }), 3000);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] p-8 font-['Times_New_Roman',Times,serif]">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">
            My Profile
          </h1>
          <p className="text-slate-500 font-medium">Update your account details and preferences</p>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-bold transition-all shadow-lg active:scale-95 ${
            saving ? "bg-slate-300 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/30"
          }`}
        >
          {saving ? <div className="animate-spin h-5 w-5 border-b-2 border-white rounded-full"></div> : <FaSave size={20} />}
          {saving ? "Saving..." : "Save Profile"}
        </button>
      </div>

      {message.text && (
        <div className={`mb-6 p-4 rounded-xl font-bold flex items-center gap-3 animate-in fade-in slide-in-from-top-2 ${
          message.type === "success" ? "bg-emerald-50 text-emerald-600 border border-emerald-100" : "bg-rose-50 text-rose-600 border border-rose-100"
        }`}>
          {message.text}
        </div>
      )}

      {/* GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* PROFILE PICTURE CARD */}
        <div className="lg:col-span-4 bg-white rounded-[2rem] shadow-xl shadow-slate-200/50 border border-slate-100 p-8 flex flex-col items-center text-center">
          <h2 className="text-xl font-bold text-slate-800 self-start mb-8 flex items-center gap-2">
            <span className="w-2 h-6 bg-blue-600 rounded-full"></span>
            Profile Photo
          </h2>
          
          <div className="relative group">
            <div className="w-48 h-48 rounded-[3rem] overflow-hidden border-4 border-slate-50 shadow-inner bg-slate-50 flex items-center justify-center">
              {profileImage ? (
                <img src={profileImage} alt="Profile" className="w-full h-full object-cover transition-transform group-hover:scale-110" />
              ) : (
                <FaUserCircle className="text-slate-200 w-full h-full" />
              )}
            </div>
            <label className="absolute -bottom-4 -right-4 bg-blue-600 text-white p-4 rounded-2xl shadow-xl shadow-blue-500/40 cursor-pointer hover:bg-blue-700 hover:scale-110 transition-all active:scale-90">
              <FaCloudUploadAlt size={24} />
              <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
            </label>
          </div>

          <div className="mt-12 text-slate-400 text-sm font-medium leading-relaxed">
            <p>Supported formats: JPG, PNG, WEBP</p>
            <p className="mt-1">Max size: 5MB</p>
          </div>
        </div>

        {/* DETAILS SECTION */}
        <div className="lg:col-span-8 flex flex-col gap-8">
          
          {/* PERSONAL INFO */}
          <div className="bg-white rounded-[2rem] shadow-xl shadow-slate-200/50 border border-slate-100 p-8">
            <h2 className="text-xl font-bold text-slate-800 mb-8 flex items-center gap-2">
              <span className="w-2 h-6 bg-blue-600 rounded-full"></span>
              Identity Details
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <label className="block text-sm font-bold text-slate-500 mb-2 ml-1">Full Name <span className="text-red-500">*</span></label>
                <input
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your name"
                  className="w-full bg-slate-50 border border-slate-200 px-5 py-4 rounded-2xl focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-600 outline-none transition-all font-bold text-slate-800"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-500 mb-2 ml-1">Contact Number *</label>
                <input
                  name="mobile"
                  value={formData.mobile}
                  onChange={handleChange}
                  placeholder="e.g. +91 98765 43210"
                  className="w-full bg-slate-50 border border-slate-200 px-5 py-4 rounded-2xl focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-600 outline-none transition-all font-bold text-slate-800"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-slate-500 mb-2 ml-1">Email Address (Locked)</label>
                <input
                  name="email"
                  value={formData.email}
                  disabled
                  className="w-full bg-slate-100 border border-slate-200 px-5 py-4 rounded-2xl text-slate-400 font-bold cursor-not-allowed"
                />
                <p className="mt-2 text-[11px] text-slate-400 ml-1">Contact support to change your registered email</p>
              </div>
            </div>
          </div>

          {/* GEOLOCATION */}
          <div className="bg-white rounded-[2rem] shadow-xl shadow-slate-200/50 border border-slate-100 p-8">
            <h2 className="text-xl font-bold text-slate-800 mb-8 flex items-center gap-2">
              <span className="w-2 h-6 bg-blue-600 rounded-full"></span>
              Location & Address <span className="text-red-500">*</span>
            </h2>

            <div className="space-y-8">
              <div>
                <label className="block text-sm font-bold text-slate-500 mb-2 ml-1">Work/Home Address *</label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  rows="3"
                  placeholder="Street, Building, Apartment..."
                  className="w-full bg-slate-50 border border-slate-200 px-5 py-4 rounded-2xl focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-600 outline-none transition-all font-bold text-slate-800 resize-none"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-bold text-slate-500 mb-2 ml-1">Country</label>
                  <select
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    className="w-full bg-slate-50 border border-slate-200 px-5 py-4 rounded-2xl focus:border-blue-600 outline-none font-bold text-slate-800 appearance-none"
                  >
                    <option value="India">India</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-500 mb-2 ml-1">State</label>
                  <select
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    className="w-full bg-slate-50 border border-slate-200 px-5 py-4 rounded-2xl focus:border-blue-600 outline-none font-bold text-slate-800"
                  >
                    <option value="">Select State</option>
                    {states[formData.country]?.map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-500 mb-2 ml-1">City</label>
                  <select
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    className="w-full bg-slate-50 border border-slate-200 px-5 py-4 rounded-2xl focus:border-blue-600 outline-none font-bold text-slate-800"
                  >
                    <option value="">Select City</option>
                    {(cities[formData.state] || cities["default"]).map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default MyProfile;
