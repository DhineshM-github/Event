import { useState, useEffect, useCallback, useRef } from "react";
import { getExhibitorBookings } from "../../Services/api";
import { Search, Download, ListFilter, RefreshCw, AlertCircle } from "lucide-react";

/* ─── Status badge mapping ─────────────────────────────────────────────────── */
const BADGE_STYLES = {
  Active: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200",
  Inactive: "bg-slate-100 text-slate-500 ring-1 ring-slate-200",
  Pending: "bg-amber-50 text-amber-700 ring-1 ring-amber-200",
  Cancelled: "bg-red-50 text-red-600 ring-1 ring-red-200",
  Approved: "bg-blue-50 text-blue-700 ring-1 ring-blue-200",
  Rejected: "bg-rose-50 text-rose-600 ring-1 ring-rose-200",
};

const Badge = ({ value }) => {
  const displayValue = value ? value.charAt(0).toUpperCase() + value.slice(1) : "Unknown";
  const cls = BADGE_STYLES[displayValue] ?? "bg-gray-100 text-gray-500";
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${cls}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-60" />
      {displayValue}
    </span>
  );
};

/* ─── Sortable header cell component ────────────────────────────────────────── */
const SortableHeader = ({ col, label, sortCol, sortDir, onSort }) => {
  return (
    <th
      onClick={() => onSort(col)}
      className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap cursor-pointer hover:bg-slate-100 transition-colors border-l border-slate-100 first:border-l-0"
    >
      <div className="flex items-center justify-between gap-2">
        {label}
        <span className="text-slate-300">
           {sortCol === col ? (sortDir === "asc" ? "↑" : "↓") : "↑↓"}
        </span>
      </div>
    </th>
  );
};

/* ─── Column definitions ─────────────────────────────────────────────────── */
const COLUMNS = [
  { key: "company_name", label: "Company Name" },
  { key: "name", label: "Exhibitor Name" },
  { key: "mobile", label: "Contact No" },
  { key: "email", label: "Email" },
  { key: "stall_area", label: "Stall Area" },
  { key: "products", label: "Products" },
  { key: "address", label: "Address" },
  { key: "status", label: "Status", badge: true },
];

const POLL_MS = 10000; // Refresh every 10 seconds

export default function ExhibitorTable() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sortCol, setSortCol] = useState(null);
  const [sortDir, setSortDir] = useState("asc");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const timerRef = useRef(null);

  const fetchData = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    else setIsRefreshing(true);
    
    try {
      const response = await getExhibitorBookings();
      const dataArray = Array.isArray(response.data) ? response.data : [];
      setRows(dataArray);
      setError("");
    } catch (e) {
      setError("Failed to sync bookings. Please check your connection.");
      console.error(e);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
    timerRef.current = setInterval(() => fetchData(true), POLL_MS);
    return () => clearInterval(timerRef.current);
  }, [fetchData]);

  const handleSort = (col) => {
    if (sortCol === col) setSortDir(d => d === "asc" ? "desc" : "asc");
    else { setSortCol(col); setSortDir("asc"); }
    setPage(1);
  };

  /* ── Filter → Sort → Paginate ───────────────────────────────────────────── */
  const q = search.toLowerCase();
  const currentRows = Array.isArray(rows) ? rows : [];
  let filtered = currentRows.filter(r =>
    COLUMNS.some(c => String(r[c.key] ?? "").toLowerCase().includes(q))
  );

  if (sortCol) {
    filtered = [...filtered].sort((a, b) => {
      const av = String(a[sortCol] ?? "").toLowerCase();
      const bv = String(b[sortCol] ?? "").toLowerCase();
      return sortDir === "asc" ? av.localeCompare(bv) : bv.localeCompare(av);
    });
  }

  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const safePage = Math.min(page, totalPages);
  const sliced = filtered.slice((safePage - 1) * pageSize, safePage * pageSize);
  const fromEntry = total === 0 ? 0 : (safePage - 1) * pageSize + 1;
  const toEntry = Math.min(safePage * pageSize, total);

  const exportCSV = () => {
    const header = COLUMNS.map(c => c.label).join(",");
    const body = filtered.map(r => COLUMNS.map(c => `"${r[c.key] ?? ""}"`).join(",")).join("\n");
    const blob = new Blob([header + "\n" + body], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = "exhibitor_bookings.csv"; a.click();
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] font-sans text-slate-700">
      <main className="max-w-[1920px] mx-auto px-6 py-8">
        
        {/* Header Section */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-black text-slate-800 tracking-tight flex items-center gap-3">
              Exhibitor Stall Bookings
              {isRefreshing && <RefreshCw size={18} className="animate-spin text-blue-500" />}
            </h1>
            <p className="text-sm text-slate-500 font-medium">Manage and monitor live exhibitor registration data</p>
          </div>
          
          <div className="flex items-center gap-3">
             <button 
               onClick={exportCSV}
               className="flex items-center gap-2 bg-white border border-slate-200 px-4 py-2.5 rounded-xl text-sm font-bold shadow-sm hover:bg-slate-50 transition-all active:scale-95"
             >
                <Download size={18} className="text-blue-600" />
                Export CSV
             </button>
             <button 
               onClick={() => fetchData()}
               className="p-2.5 bg-blue-50 text-blue-600 border border-blue-100 rounded-xl hover:bg-blue-100 transition-colors"
             >
                <RefreshCw size={20} />
             </button>
          </div>
        </div>

        {/* Search & Stats Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4 mb-6 flex flex-wrap items-center justify-between gap-4">
          <div className="relative w-full max-w-md">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" />
            <input
              type="text"
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(1); }}
              placeholder="Search by name, company, or products..."
              className="w-full bg-slate-50 border border-slate-200 pl-11 pr-4 py-2.5 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all placeholder:text-slate-300"
            />
          </div>
          
          <div className="flex items-center gap-6 px-4">
             <div className="text-center">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Total Bookings</div>
                <div className="text-lg font-black text-slate-800">{total}</div>
             </div>
             <div className="h-8 w-px bg-slate-100"></div>
             <div className="text-center">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Page</div>
                <div className="text-lg font-black text-slate-800">{safePage} <span className="text-slate-300 font-medium">/</span> {totalPages}</div>
             </div>
          </div>
        </div>

        {/* Error State */}
        {error && (
          <div className="mb-6 flex items-center gap-3 bg-red-50 border border-red-100 rounded-2xl px-6 py-4 text-red-600 animate-in fade-in slide-in-from-top-2">
            <AlertCircle size={20} />
            <span className="text-sm font-semibold">{error}</span>
          </div>
        )}

        {/* Table Container */}
        <div className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden">
          <div className="overflow-x-auto min-h-[400px]">
            <table className="w-full">
              <thead className="bg-slate-50/80 border-b border-slate-100">
                <tr>
                  {COLUMNS.map(col => (
                    <SortableHeader 
                      key={col.key} 
                      col={col.key} 
                      label={col.label}
                      sortCol={sortCol} 
                      sortDir={sortDir} 
                      onSort={handleSort} 
                    />
                  ))}
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-50">
                {loading ? (
                  <tr>
                    <td colSpan={COLUMNS.length} className="py-24 text-center">
                      <div className="flex flex-col items-center gap-3">
                         <div className="w-10 h-10 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin" />
                         <span className="text-slate-400 font-bold text-xs uppercase tracking-widest">Syncing Records...</span>
                      </div>
                    </td>
                  </tr>
                ) : sliced.length === 0 ? (
                  <tr>
                    <td colSpan={COLUMNS.length} className="py-32 text-center">
                      <div className="flex flex-col items-center gap-3 text-slate-300">
                         <ListFilter size={48} className="opacity-20" />
                         <p className="font-bold text-lg">No Results Found</p>
                         <p className="text-xs font-medium text-slate-400">Try adjusting your search filters</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  sliced.map((row, i) => (
                    <tr key={row.id ?? i} className="hover:bg-sky-50/50 transition-colors duration-200 group">
                      {COLUMNS.map((col, cIdx) => (
                        <td key={col.key} className={`px-6 py-4 text-slate-600 whitespace-nowrap ${cIdx > 0 ? "border-l border-slate-50" : ""}`}>
                          {col.badge ? (
                            <Badge value={row[col.key]} />
                          ) : (
                            <span className={col.key === 'company_name' ? "font-bold text-slate-800" : ""}>
                               {row[col.key] ?? "—"}
                            </span>
                          )}
                        </td>
                      ))}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Footer */}
          <div className="bg-slate-50/50 border-t border-slate-100 px-6 py-4 flex items-center justify-between">
            <div className="text-[11px] text-slate-500 font-medium">
              Showing <span className="text-slate-800 font-bold">{fromEntry}</span> to <span className="text-slate-800 font-bold">{toEntry}</span> of <span className="text-slate-800 font-bold">{total}</span> records
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5 mr-4">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Per Page</span>
                <select
                  value={pageSize}
                  onChange={e => { setPageSize(Number(e.target.value)); setPage(1); }}
                  className="bg-white border border-slate-200 rounded-lg text-xs p-1.5 outline-none font-bold text-slate-600 focus:ring-2 focus:ring-blue-500/10"
                >
                  {[10, 25, 50].map(n => <option key={n} value={n}>{n}</option>)}
                </select>
              </div>

              <div className="flex items-center gap-1">
                {[
                  { icon: "<<", fn: () => setPage(1), disabled: safePage === 1 },
                  { icon: "<", fn: () => setPage(p => Math.max(1, p - 1)), disabled: safePage === 1 },
                  { icon: ">", fn: () => setPage(p => Math.min(totalPages, p + 1)), disabled: safePage === totalPages },
                  { icon: ">>", fn: () => setPage(totalPages), disabled: safePage === totalPages },
                ].map((btn, bIdx) => (
                  <button 
                    key={bIdx} 
                    onClick={btn.fn}
                    disabled={btn.disabled}
                    className="w-8 h-8 flex items-center justify-center text-[10px] font-black border border-slate-200 rounded-lg bg-white text-slate-600 hover:bg-blue-600 hover:text-white hover:border-blue-600 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                  >
                    {btn.icon}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}