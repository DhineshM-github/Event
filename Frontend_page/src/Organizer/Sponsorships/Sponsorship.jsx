import { useState, useEffect } from "react";
import axios from "axios";
import { Eye, Plus, X, CheckCircle, AlertCircle, Trash2 } from "lucide-react";

import { getSponsors, getSponsorById, createSponsor } from "../../Services/api";

export const SponsorshipPage = () => {
  const [sponsors, setSponsors] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [viewData, setViewData] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [imagePreview, setImagePreview] = useState(null);

  const [toast, setToast] = useState(null);
  const [errors, setErrors] = useState({});

  const [form, setForm] = useState({
    sponsor_name: "",
    primary_contact: "",
    secondary_contact: "",
    mail_id: "",
    address: "",
    status: "Active",
    sponsor_image: "",
  });

  const [documents, setDocuments] = useState([
    {
      document_type: "",
      document_number: "",
      document_file: "",
      preview: "",
    },
  ]);

  useEffect(() => {
    loadSponsors();
  }, []);

  // Auto-close toast after 5 seconds
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  // ================= TOAST NOTIFICATION =================

  const showToast = (message, type = "success") => {
    setToast({ message, type });
  };

  // ================= LOAD SPONSORS =================

  const loadSponsors = async () => {
    try {
      const res = await getSponsors();
      setSponsors(res);
    } catch (error) {
      showToast("Failed to load sponsors", "error");
    }
  };

  // ================= FORM =================

  const handleChange = (e) => {
    let { name, value } = e.target;
    setErrors({ ...errors, [name]: "" });

    // 1. Spacing Restriction
    if (typeof value === "string") {
      if (name === "mail_id" || name === "primary_contact" || name === "secondary_contact") {
        value = value.replace(/\s/g, ""); // No spaces allowed at all
      } else {
        value = value.trimStart(); // No leading spaces
      }
    }

    // 2. Contact Number Restriction (Numbers Only, Max 10 digits)
    if (name === "primary_contact" || name === "secondary_contact") {
      if (value !== "" && !/^\d*$/.test(value)) {
        return; // Block alphabets/special chars
      }
      if (value.length > 10) return; // Restrict to 10 digits
    }

    setForm({ ...form, [name]: value });
  };

  const handleImage = (e) => {
    const file = e.target.files[0];

    const reader = new FileReader();

    reader.readAsDataURL(file);

    reader.onload = () => {
      setImagePreview(reader.result);

      setForm({
        ...form,
        sponsor_image: reader.result,
      });
    };
  };

  // ================= DOCUMENT =================

  const handleDocChange = (e, index) => {
    const temp = [...documents];

    temp[index][e.target.name] = e.target.value;

    setDocuments(temp);
  };

  const handleDocument = (e, index) => {
    const file = e.target.files[0];

    const reader = new FileReader();

    reader.readAsDataURL(file);

    reader.onload = () => {
      const temp = [...documents];

      temp[index].document_file = reader.result;
      temp[index].preview = reader.result;

      setDocuments(temp);
    };
  };

  const addDocument = () => {
    setDocuments([
      ...documents,
      {
        document_type: "",
        document_number: "",
        document_file: "",
        preview: "",
      },
    ]);
  };

  const removeDocument = (index) => {
    if (documents.length > 1) {
      setDocuments(documents.filter((_, i) => i !== index));
    } else {
      // If it's the last one, just clear it instead of removing
      setDocuments([
        {
          document_type: "",
          document_number: "",
          document_file: "",
          preview: "",
        },
      ]);
    }
  };

  // ================= SAVE =================

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};

    // 1. Mandatory Field Validation
    if (!form.sponsor_name.trim()) newErrors.sponsor_name = "Sponsor Name is required";
    if (!form.primary_contact.trim()) newErrors.primary_contact = "Primary contact is required";
    if (!form.mail_id.trim()) newErrors.mail_id = "Mail ID is required";
    if (!form.address.trim()) newErrors.address = "Address is required";

    // 2. Email Validation
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (form.mail_id && !emailRegex.test(form.mail_id)) {
      newErrors.mail_id = "Invalid email format (e.g., abc@gmail.com)";
    }

    // 3. Contact Number Validation
    if (form.primary_contact && form.primary_contact.length !== 10) {
      newErrors.primary_contact = "Contact must be exactly 10 digits";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      await createSponsor(form);

      showToast("✓ Sponsor Created Successfully!", "success");

      setShowForm(false);

      // Reset form
      setForm({
        sponsor_name: "",
        primary_contact: "",
        secondary_contact: "",
        mail_id: "",
        address: "",
        status: "Active",
        sponsor_image: "",
      });

      setDocuments([
        {
          document_type: "",
          document_number: "",
          document_file: "",
          preview: "",
        },
      ]);

      setImagePreview(null);

      loadSponsors();
    } catch (error) {
      showToast(
        error.response?.data?.message ||
          "Failed to create sponsor. Please try again.",
        "error",
      );
    }
  };

  // ================= VIEW =================

  const viewSponsor = async (id) => {
    try {
      const res = await getSponsorById(id);

      setViewData(res);
    } catch (error) {
      showToast("Failed to load sponsor details", "error");
    }
  };

  const closeModal = () => {
    setViewData(null);
  };

  // ================= SEARCH =================

  const filteredSponsors = sponsors.filter(
    (s) =>
      (s.sponsor_name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (s.sponsor_code || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (s.address || "").toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8">
      {/* TOAST NOTIFICATION */}
      {toast && (
        <div
          className={`fixed top-6 right-6 flex items-center gap-4 px-6 py-4 rounded-2xl shadow-2xl z-[9999] animate-in fade-in slide-in-from-right duration-300 border-l-4 ${
            toast.type === "success"
              ? "bg-white border-emerald-500"
              : "bg-white border-rose-500"
          }`}
        >
          <div className={`p-2 rounded-xl ${toast.type === "success" ? "bg-emerald-100" : "bg-rose-100"}`}>
            {toast.type === "success" ? (
              <CheckCircle size={20} className="text-emerald-600" />
            ) : (
              <AlertCircle size={20} className="text-rose-600" />
            )}
          </div>
          <div className="flex flex-col">
            <span className="text-slate-800 font-bold text-sm tracking-tight">
              {toast.type === "success" ? "Success" : "Notification"}
            </span>
            <span className="text-slate-500 text-xs font-medium">{toast.message}</span>
          </div>
          <button
            onClick={() => setToast(null)}
            className="ml-4 p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X size={16} />
          </button>
        </div>
      )}

      {/* MAIN CONTAINER */}
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* HEADER SECTION */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100">
          <div>
            <h1 className="text-3xl font-black text-slate-800 tracking-tight flex items-center gap-2">
              <div className="w-2 h-8 bg-sky-500 rounded-full" />
              Sponsorship
            </h1>
            <p className="text-slate-500 text-sm font-medium mt-1">Manage and track your official event sponsors</p>
          </div>

          <button
            onClick={() => setShowForm(true)}
            className="bg-sky-600 text-white px-6 py-3 rounded-2xl font-bold flex gap-2 items-center hover:bg-sky-700 transition shadow-lg shadow-sky-100 hover:scale-[1.02] active:scale-95"
          >
            <Plus size={20} />
            Add Sponsor
          </button>
        </div>

        {/* SEARCH & FILTERS */}
        <div className="relative group max-w-md">
          <input
            placeholder="Search by name, code or location..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-3 pl-12 rounded-2xl bg-white border border-slate-200 text-slate-700 font-medium placeholder:text-slate-400 focus:ring-4 focus:ring-sky-500/10 focus:border-sky-500 outline-none transition-all shadow-sm group-hover:shadow-md"
          />
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-sky-500 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        {/* DATA TABLE */}
        <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-sky-600 text-white">
                  
                  <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">Code</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">Sponsor Name</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">Primary Contact</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">Mail ID</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">View</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-50">
                {filteredSponsors.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="p-12 text-center">
                      <div className="flex flex-col items-center gap-3">
                        <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center">
                          <Eye className="text-slate-300" size={32} />
                        </div>
                        <p className="text-slate-400 font-bold italic">No sponsors found matching your criteria</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredSponsors.map((s) => (
                    <tr
                      key={s.id}
                      className="hover:bg-sky-50/30 transition-all group"
                    >
                      

                      <td className="p-4">
                        <span className="font-mono text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200">
                          {s.sponsor_code}
                        </span>
                      </td>

                      <td className="p-4">
                        <div className="flex flex-col">
                          <span className="text-sm font-black text-slate-800">{s.sponsor_name}</span>
                          <span className="text-[10px] font-bold text-slate-400 truncate max-w-[150px]">{s.address}</span>
                        </div>
                      </td>

                      <td className="p-4">
                        <span className="text-sm font-bold text-slate-600">{s.primary_contact}</span>
                      </td>

                      <td className="p-4">
                        <span className="text-sm font-medium text-sky-600 hover:underline cursor-pointer">{s.mail_id}</span>
                      </td>

                      <td className="p-4">
                        <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
                          s.status === "Active" 
                            ? "bg-emerald-100 text-emerald-600 border border-emerald-200" 
                            : "bg-amber-100 text-amber-600 border border-amber-200"
                        }`}>
                          {s.status}
                        </span>
                      </td>
                      <td className="p-4 pl-8">
                        <button
                          onClick={() => viewSponsor(s.id)}
                          className="w-10 h-10 bg-slate-50 text-slate-400 rounded-xl flex items-center justify-center hover:bg-sky-500 hover:text-white hover:scale-110 transition-all shadow-sm"
                        >
                          <Eye size={18} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ================= CREATE MODAL ================= */}

      {showForm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50">
          <div className="bg-sky-50 border border-blue-200 shadow-2xl rounded-3xl w-[900px] max-h-[90vh] overflow-y-auto">
            {/* HEADER */}

            <div className="flex justify-between items-center px-8 py-5 border-b border-blue-100 bg-gradient-to-r from-sky-500 to-blue-600 rounded-t-3xl">
              <h2 className="text-2xl font-bold text-white tracking-tight">
                New Sponsor Details
              </h2>

              <button
                onClick={() => {
                  setShowForm(false);
                  setErrors({});
                  setForm({
                    sponsor_name: "",
                    primary_contact: "",
                    secondary_contact: "",
                    mail_id: "",
                    address: "",
                    status: "Active",
                    sponsor_image: "",
                  });
                  setDocuments([{ document_type: "", document_number: "", document_file: "", preview: "" }]);
                  setImagePreview(null);
                }}
                className="bg-white/20 p-2 rounded-full text-white hover:bg-red-500 transition-all duration-300 hover:scale-110"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                
                {/* LEFT SIDE: SPONSOR INFORMATION */}
                <div className="space-y-6">
                  <div className="bg-white p-6 rounded-2xl border border-blue-100 shadow-sm h-full">
                    <h3 className="text-lg font-bold text-blue-700 mb-5 flex items-center gap-2">
                      <span className="w-1 h-6 bg-blue-500 rounded-full"></span>
                      Sponsor Information
                    </h3>

                    <div className="space-y-4">
                      {/* Name & Primary Contact */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-[10px] font-black text-blue-400 uppercase tracking-widest ml-1">
                            Sponsor Name <span className="text-red-500 font-bold lowercase tracking-normal ml-1">*</span>
                          </label>
                          <input
                            name="sponsor_name"
                            placeholder="Enter Name"
                            value={form.sponsor_name}
                            onChange={handleChange}
                            className={`w-full p-3 rounded-xl bg-blue-50/50 border ${errors.sponsor_name ? 'border-red-400' : 'border-blue-100'} focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all outline-none text-blue-900 text-sm font-semibold placeholder:text-blue-200`}
                          />
                          {errors.sponsor_name && <p className="text-red-400 text-[10px] mt-1 ml-1">{errors.sponsor_name}</p>}
                        </div>

                        <div className="space-y-1">
                          <label className="text-[10px] font-black text-blue-400 uppercase tracking-widest ml-1">
                            Primary Contact <span className="text-red-500 font-bold lowercase tracking-normal ml-1">*</span>
                          </label>
                          <input
                            name="primary_contact"
                            placeholder="Primary No"
                            value={form.primary_contact}
                            onChange={handleChange}
                            className={`w-full p-3 rounded-xl bg-blue-50/50 border ${errors.primary_contact ? 'border-red-400' : 'border-blue-100'} focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all outline-none text-blue-900 text-sm font-semibold placeholder:text-blue-200`}
                          />
                          {errors.primary_contact && <p className="text-red-400 text-[10px] mt-1 ml-1">{errors.primary_contact}</p>}
                        </div>
                      </div>

                      {/* Secondary & Mail */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-[10px] font-black text-blue-400 uppercase tracking-widest ml-1">
                            Secondary Contact
                          </label>
                          <input
                            name="secondary_contact"
                            placeholder="Secondary No"
                            value={form.secondary_contact}
                            onChange={handleChange}
                            className="w-full p-3 rounded-xl bg-blue-50/50 border border-blue-100 focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all outline-none text-blue-900 text-sm font-semibold placeholder:text-blue-200"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[10px] font-black text-blue-400 uppercase tracking-widest ml-1">
                            Mail ID <span className="text-red-500 font-bold lowercase tracking-normal ml-1">*</span>
                          </label>
                          <input
                            name="mail_id"
                            placeholder="Email ID"
                            value={form.mail_id}
                            onChange={handleChange}
                            className={`w-full p-3 rounded-xl bg-blue-50/50 border ${errors.mail_id ? 'border-red-400' : 'border-blue-100'} focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all outline-none text-blue-900 text-sm font-semibold placeholder:text-blue-200`}
                          />
                          {errors.mail_id && <p className="text-red-400 text-[10px] mt-1 ml-1">{errors.mail_id}</p>}
                        </div>
                      </div>

                      {/* Address */}
                      <div className="space-y-1">
                        <label className="text-[10px] font-black text-blue-400 uppercase tracking-widest ml-1">
                          Address <span className="text-red-500 font-bold lowercase tracking-normal ml-1">*</span>
                        </label>
                        <textarea
                          name="address"
                          placeholder="Complete Address"
                          value={form.address}
                          onChange={handleChange}
                          className={`w-full p-3 rounded-xl bg-blue-50/50 border ${errors.address ? 'border-red-400' : 'border-blue-100'} focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all outline-none text-blue-900 text-sm font-semibold placeholder:text-blue-200 min-h-[80px] resize-none`}
                        />
                        {errors.address && <p className="text-red-400 text-[10px] mt-1 ml-1">{errors.address}</p>}
                      </div>
                    </div>
                  </div>
                </div>

                {/* RIGHT SIDE: DOCUMENTS & ACTION */}
                <div className="space-y-6">
                  <div className="bg-white p-6 rounded-2xl border border-blue-100 shadow-sm h-full flex flex-col">
                    <h3 className="text-lg font-bold text-blue-700 mb-5 flex items-center gap-2">
                      <span className="w-1 h-6 bg-blue-500 rounded-full"></span>
                      Sponsor Documents
                    </h3>

                    <div className="flex-1 space-y-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                      {documents.map((doc, index) => (
                        <div
                          key={index}
                          className="relative bg-blue-50/30 p-4 rounded-xl border border-blue-50 animate-in slide-in-from-right duration-300"
                        >
                          <div className="grid grid-cols-2 gap-3 mb-3">
                            <select
                              name="document_type"
                              value={doc.document_type}
                              onChange={(e) => handleDocChange(e, index)}
                              className="p-2.5 rounded-lg bg-white border border-blue-100 focus:ring-2 focus:ring-blue-500 outline-none text-blue-900 text-xs font-semibold"
                            >
                              <option>Document Type</option>
                              <option>Aadhar</option>
                              <option>PAN</option>
                              <option>License</option>
                            </select>
                            <input
                              name="document_number"
                              placeholder="Number"
                              value={doc.document_number}
                              onChange={(e) => handleDocChange(e, index)}
                              className="p-2.5 rounded-lg bg-white border border-blue-100 focus:ring-2 focus:ring-blue-500 outline-none text-blue-900 text-xs font-semibold placeholder:text-blue-200"
                            />
                          </div>
                          <input
                            type="file"
                            onChange={(e) => handleDocument(e, index)}
                            className="w-full text-[10px] text-blue-600 font-bold file:mr-3 file:py-1.5 file:px-3 file:rounded-full file:border-0 file:text-[10px] file:font-black file:bg-blue-100 file:text-blue-700 hover:file:bg-blue-200 transition-all cursor-pointer bg-white/50 p-1.5 rounded-lg border border-blue-50"
                          />
                          <button
                            type="button"
                            onClick={() => removeDocument(index)}
                            className="absolute -top-2 -right-2 bg-white text-red-500 p-1.5 rounded-full shadow-md border border-red-100 hover:bg-red-500 hover:text-white transition-all duration-300"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      ))}
                    </div>

                    <button
                      type="button"
                      onClick={addDocument}
                      className="mt-4 w-full bg-blue-100 hover:bg-blue-200 text-blue-700 transition py-3 rounded-xl font-black text-[11px] uppercase tracking-widest shadow-sm"
                    >
                      + Add Document
                    </button>
                  </div>

                  {/* SAVE BUTTON */}
                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-blue-500 to-sky-600 hover:scale-[1.01] transition-all transform p-5 rounded-2xl font-black text-lg text-white shadow-xl shadow-blue-100 uppercase tracking-widest"
                  >
                    Save Sponsor
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= VIEW MODAL ================= */}

      {viewData && (
        <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50 backdrop-blur-sm">
          <div className="bg-sky-50 w-[700px] rounded-3xl border border-blue-200 shadow-2xl overflow-hidden">
            <div className="flex justify-between items-center px-8 py-5 bg-gradient-to-r from-blue-600 to-sky-500 text-white">
              <h2 className="text-xl font-bold tracking-tight">
                Sponsor Details View
              </h2>
              <button
                onClick={closeModal}
                className="bg-white/20 p-2 rounded-full hover:bg-red-500 transition-all duration-300"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-8 grid grid-cols-2 gap-6">
              {/* Sponsor Code */}
              <div className="space-y-1">
                <label className="text-xs font-black text-blue-400 uppercase tracking-widest ml-1">
                  Sponsor Code
                </label>
                <input
                  type="text"
                  disabled
                  value={viewData.sponsor_code}
                  className="w-full px-4 py-3 bg-white border border-blue-100 rounded-xl text-blue-900 font-bold disabled:opacity-75 disabled:cursor-not-allowed focus:outline-none shadow-sm"
                />
              </div>

              {/* Sponsor Name */}
              <div className="space-y-1">
                <label className="text-xs font-black text-blue-400 uppercase tracking-widest ml-1">
                  Sponsor Name
                </label>
                <input
                  type="text"
                  disabled
                  value={viewData.sponsor_name}
                  className="w-full px-4 py-3 bg-white border border-blue-100 rounded-xl text-blue-900 font-bold disabled:opacity-75 disabled:cursor-not-allowed focus:outline-none shadow-sm"
                />
              </div>

              {/* Primary Contact */}
              <div className="space-y-1">
                <label className="text-xs font-black text-blue-400 uppercase tracking-widest ml-1">
                  Primary Contact
                </label>
                <input
                  type="text"
                  disabled
                  value={viewData.primary_contact}
                  className="w-full px-4 py-3 bg-white border border-blue-100 rounded-xl text-blue-900 font-bold disabled:opacity-75 disabled:cursor-not-allowed focus:outline-none shadow-sm"
                />
              </div>

              {/* Secondary Contact */}
              {viewData.secondary_contact && (
                <div className="space-y-1">
                  <label className="text-xs font-black text-blue-400 uppercase tracking-widest ml-1">
                    Secondary Contact
                  </label>
                  <input
                    type="text"
                    disabled
                    value={viewData.secondary_contact}
                    className="w-full px-4 py-3 bg-white border border-blue-100 rounded-xl text-blue-900 font-bold disabled:opacity-75 disabled:cursor-not-allowed focus:outline-none shadow-sm"
                  />
                </div>
              )}

              {/* Mail ID */}
              <div className="space-y-1">
                <label className="text-xs font-black text-blue-400 uppercase tracking-widest ml-1">
                  Mail ID
                </label>
                <input
                  type="email"
                  disabled
                  value={viewData.mail_id}
                  className="w-full px-4 py-3 bg-white border border-blue-100 rounded-xl text-blue-900 font-bold disabled:opacity-75 disabled:cursor-not-allowed focus:outline-none shadow-sm"
                />
              </div>

              {/* Status */}
              <div className="space-y-1">
                <label className="text-xs font-black text-blue-400 uppercase tracking-widest ml-1">
                  Status
                </label>
                <input
                  type="text"
                  disabled
                  value={viewData.status}
                  className="w-full px-4 py-3 bg-white border border-blue-100 rounded-xl text-blue-900 font-bold disabled:opacity-75 disabled:cursor-not-allowed focus:outline-none shadow-sm"
                />
              </div>

              {/* Address */}
              <div className="col-span-2 space-y-1">
                <label className="text-xs font-black text-blue-400 uppercase tracking-widest ml-1">
                  Address
                </label>
                <textarea
                  disabled
                  value={viewData.address}
                  rows="3"
                  className="w-full px-4 py-3 bg-white border border-blue-100 rounded-xl text-blue-900 font-bold disabled:opacity-75 disabled:cursor-not-allowed focus:outline-none resize-none shadow-sm"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
