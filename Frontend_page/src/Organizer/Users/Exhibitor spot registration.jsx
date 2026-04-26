import { useState } from "react";

export default function PassGeneration() {
  const [search, setSearch] = useState("");

  return (
    <div style={{ minHeight: "100vh", background: "#eef2f7", padding: 24, fontFamily: "'Segoe UI', sans-serif" }}>

      {/* Title */}
      <h1 style={{ fontSize: 22, fontWeight: 700, color: "#1e3a5f", marginBottom: 20 }}>
        Pass Generation
      </h1>

      {/* Card */}
      <div style={{ background: "white", borderRadius: 4, border: "1px solid #e2e8f0", boxShadow: "0 1px 3px rgba(0,0,0,0.06)", overflow: "hidden" }}>

        {/* Search Row */}
        <div style={{ padding: "14px 16px", borderBottom: "1px solid #e2e8f0" }}>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search Keyword"
            style={{
              border: "1px solid #cbd5e1", borderRadius: 4, padding: "7px 12px",
              fontSize: 13, color: "#475569", width: 210, outline: "none",
            }}
          />
        </div>

        {/* Table */}
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
            <thead>
            <tr className="bg-sky-600 text-white">
                <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider" style={{ textAlign: "left", padding: "11px 16px", fontWeight: 600, color: "#374151", width: 160, borderRight: "1px solid #e2e8f0" }}>
                  Action
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider" style={{ textAlign: "left", padding: "11px 16px", fontWeight: 600, color: "#374151", borderRight: "1px solid #e2e8f0" }}>
                  <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                    Event Code
                    <span style={{ display: "inline-flex", flexDirection: "column", gap: 1 }}>
                      <svg width="8" height="5" viewBox="0 0 8 5" fill="none"><path d="M4 0L7.5 4.5H0.5L4 0Z" fill="#94a3b8" /></svg>
                      <svg width="8" height="5" viewBox="0 0 8 5" fill="none"><path d="M4 5L0.5 0.5H7.5L4 5Z" fill="#94a3b8" /></svg>
                    </span>
                  </span>
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider" style={{ textAlign: "left", padding: "11px 16px", fontWeight: 600, color: "#374151" }}>
                  <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                    Event Name
                    <span style={{ display: "inline-flex", flexDirection: "column", gap: 1 }}>
                      <svg width="8" height="5" viewBox="0 0 8 5" fill="none"><path d="M4 0L7.5 4.5H0.5L4 0Z" fill="#94a3b8" /></svg>
                      <svg width="8" height="5" viewBox="0 0 8 5" fill="none"><path d="M4 5L0.5 0.5H7.5L4 5Z" fill="#94a3b8" /></svg>
                    </span>
                  </span>
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colSpan={3} style={{ padding: "14px 16px", color: "#64748b", fontSize: 13 }}>
                  No Data Found.
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div style={{ padding: "10px 16px", display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 6, borderTop: "1px solid #e2e8f0" }}>
          <span style={{ fontSize: 13, color: "#64748b", marginRight: 8 }}>Showing 0 to 0 of 0 entries</span>

          {["«", "‹", "›", "»"].map((ch) => (
            <button key={ch} disabled style={{ width: 28, height: 28, display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid #cbd5e1", borderRadius: 4, fontSize: 13, color: "#64748b", background: "white", cursor: "not-allowed", opacity: 0.4 }}>
              {ch}
            </button>
          ))}

          <select style={{ border: "1px solid #cbd5e1", borderRadius: 4, padding: "4px 8px", fontSize: 13, color: "#475569", background: "white", marginLeft: 4 }}>
            <option>10</option>
          </select>
        </div>

      </div>
    </div>
  );
}