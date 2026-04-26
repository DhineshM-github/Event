import { useEffect, useState, useMemo } from "react";
import { getAddOnEvents } from "../../Services/api"; // adjust path

function parseDate(d) {
  const [dd, mm, yy] = d.split("/");
  return new Date(yy, mm - 1, dd);
}

export default function AddOnSpotBooking() {
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState(null);
  const [sortDir, setSortDir] = useState(1);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);

  // ✅ API CALL
  useEffect(() => {
    const fetchData = async () => {
      try {
        const resData = await getAddOnEvents();

        const formatted = resData.map((item) => ({
          code: item.event_code,
          name: item.event_name,
          start: new Date(item.start_date).toLocaleDateString("en-GB"),
          end: new Date(item.end_date).toLocaleDateString("en-GB"),
        }));

        setData(formatted);
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
  }, []);

  const handleSort = (key) => {
    if (sortKey === key) setSortDir((d) => d * -1);
    else {
      setSortKey(key);
      setSortDir(1);
    }
    setPage(1);
  };

  const sortIcon = (key) =>
    sortKey === key ? (sortDir === 1 ? "↑" : "↓") : "↑↓";

  const filtered = useMemo(() => {
    const q = search.toLowerCase();

    let filteredData = data.filter(
      (r) =>
        r.code.toLowerCase().includes(q) ||
        r.name.toLowerCase().includes(q) ||
        r.start.includes(q) ||
        r.end.includes(q)
    );

    if (sortKey) {
      filteredData = [...filteredData].sort((a, b) => {
        let av = a[sortKey],
          bv = b[sortKey];

        if (sortKey === "start" || sortKey === "end") {
          av = parseDate(av);
          bv = parseDate(bv);
        }

        return av > bv ? sortDir : av < bv ? -sortDir : 0;
      });
    }

    return filteredData;
  }, [search, sortKey, sortDir, data]);

  const totalPages = Math.ceil(filtered.length / perPage) || 1;
  const startIndex = (page - 1) * perPage;
  const slice = filtered.slice(startIndex, startIndex + perPage);

  return (
    <div style={{ padding: "24px" }}>
      <h1 style={{ fontSize: 22, fontWeight: 500, marginBottom: 20 }}>
        Add-On Spot Booking
      </h1>

      <input
        type="text"
        placeholder="Search Keyword"
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setPage(1);
        }}
        style={{
          width: 220,
          height: 36,
          padding: "0 12px",
          fontSize: 14,
          border: "1px solid #d1d5db",
          borderRadius: 6,
          marginBottom: 16,
        }}
      />

      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          border: "1px solid #e5e7eb",
          fontSize: 13,
        }}
      >
        <thead>
            <tr className="bg-sky-600 text-white">
            {[
              { key: "Code", label: "Event Code" },
              { key: "Name", label: "Event Name" },
              { key: "start", label: "Event StartDate" },
              { key: "end", label: "Event EndDate" },
            ].map(({ key, label }) => (
              <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider"
                key={key}
                onClick={() => handleSort(key)}
                style={{
          padding: "11px 16px",
          textAlign: "left",
          fontWeight: "700", // Bold
          color: "#ffffff",  // White color
          borderBottom: "1px solid #0284c7",
          cursor: "pointer",
        }}
              >
                {label}{" "}
                <span style={{ fontSize: 11 }}>{sortIcon(key)}</span>
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {slice.map((row, i) => (
            <tr
              key={i}
              style={{
                background: i % 2 === 0 ? "#fff" : "#f8fafc",
              }}
            >
              <td style={{ padding: "11px 16px" }}>{row.code}</td>
              <td style={{ padding: "11px 16px" }}>{row.name}</td>
              <td style={{ padding: "11px 16px" }}>{row.start}</td>
              <td style={{ padding: "11px 16px" }}>{row.end}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          marginTop: 16,
          fontSize: 13,
          color: "#64748b",
        }}
      >
        <span style={{ flex: 1 }}>
          Showing {filtered.length === 0 ? 0 : startIndex + 1} to{" "}
          {Math.min(startIndex + perPage, filtered.length)} of{" "}
          {filtered.length} entries
        </span>

        <div style={{ display: "flex", gap: 4 }}>
          {[["«", 1], ["‹", page - 1], [page, page], ["›", page + 1], ["»", totalPages]].map(
            ([label, p], idx) => (
              <button
                key={idx}
                onClick={() => setPage(p)}
                disabled={p < 1 || p > totalPages || p === page}
                style={{
                  width: 28,
                  height: 28,
                  border: "1px solid #d1d5db",
                  borderRadius: 6,
                  background: p === page ? "#2563EB" : "#fff",
                  color: p === page ? "#fff" : "#64748b",
                  cursor: "pointer",
                }}
              >
                {label}
              </button>
            )
          )}
        </div>

        <select
          value={perPage}
          onChange={(e) => {
            setPerPage(+e.target.value);
            setPage(1);
          }}
          style={{
            height: 32,
            padding: "0 8px",
            border: "1px solid #d1d5db",
            borderRadius: 6,
          }}
        >
          <option value={10}>10</option>
          <option value={25}>25</option>
          <option value={50}>50</option>
        </select>
      </div>
    </div>
  );
}