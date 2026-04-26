
import { useState, useEffect, useCallback } from "react";
import { getTasks, createTasks } from "../../Services/api";
 
const fmtDate = (d) => {
  if (!d) return "";
  const [y, m, day] = d.split("-");
  return `${day}/${m}/${y}`;
};
 
const StatusBadge = ({ status }) => {
  const styles = {
    "In-Progress": "bg-blue-100 text-blue-700",
    Completed: "bg-green-100 text-green-700",
    Pending: "bg-amber-100 text-amber-700",
  };
  return (
    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${styles[status] || styles["In-Progress"]}`}>
      {status}
    </span>
  );
};
 
const PctBadge = ({ pct }) => (
  <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-green-100 text-green-700">
    {pct}%
  </span>
);
 
/* ══════════════════════════════════════════
   PAGE 1 — LIST VIEW
══════════════════════════════════════════ */
function ListView({ onAdd }) {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
 
  const fetchTasks = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await getTasks();
      if (res.success) setTasks(res.data);
      else setError(res.error || "Failed to load tasks");
    } catch {
      setError("Cannot connect to backend. Make sure Flask is running on port 5000.");
    } finally {
      setLoading(false);
    }
  }, []);
 
  useEffect(() => { fetchTasks(); }, [fetchTasks]);
 
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this task?")) return;
    try {
      await fetch(`${API_BASE}/tasks/${id}`, { method: "DELETE" });
      setTasks((prev) => prev.filter((t) => t.id !== id));
    } catch {
      alert("Delete failed.");
    }
  };
 
  return (
    <div className="min-h-screen bg-slate-100">
      <div className="bg-white border-b border-slate-200 px-6 py-3 flex items-center justify-between">
        <h1 className="text-xl font-medium text-slate-800">To-Do Task</h1>
        <div className="flex items-center gap-2">
          <button onClick={fetchTasks} className="p-2 rounded text-slate-500 hover:bg-slate-100" title="Refresh">
            <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
              <path d="M4 10a6 6 0 1 0 1.5-3.9" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              <path d="M4 5.5V10H8.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <button onClick={onAdd} className="p-2 rounded text-slate-500 hover:bg-slate-100" title="Add Task">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <rect x="9" y="3" width="2" height="14" rx="1" fill="currentColor" />
              <rect x="3" y="9" width="14" height="2" rx="1" fill="currentColor" />
            </svg>
          </button>
        </div>
      </div>
 
      <div className="m-4 bg-white rounded-xl border border-slate-200 overflow-hidden">
        {error && <div className="px-4 py-3 bg-red-50 text-red-600 text-sm border-b border-red-100">{error}</div>}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
            <tr className="bg-sky-600 text-white">
                <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">Action</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">Task Name</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">To-Do List Name</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">Start Date</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">End Date</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">Assigned To</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">Complete %</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">Remarks</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={9} className="text-center py-10 text-slate-400">Loading...</td></tr>
              ) : tasks.length === 0 ? (
                <tr><td colSpan={9} className="text-center py-10 text-slate-400">No data available. Click + to add a task.</td></tr>
              ) : (
                tasks.map((t) => (
                  <tr key={t.id} className="hover:bg-sky-50/50 transition-colors duration-200 group">
                    <td className="px-3 py-2">
                      <div className="flex gap-1">
                        <button onClick={() => alert(`Task: ${t.task_name}\nDesc: ${t.task_description}\nRemarks: ${t.remarks}`)}
                          className="p-1.5 rounded border border-slate-200 text-slate-400 hover:bg-slate-100" title="View">
                          <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
                            <ellipse cx="8" cy="8" rx="6" ry="4" stroke="currentColor" strokeWidth="1.4" />
                            <circle cx="8" cy="8" r="2" fill="currentColor" />
                          </svg>
                        </button>
                        <button onClick={() => handleDelete(t.id)}
                          className="p-1.5 rounded border border-slate-200 text-red-400 hover:bg-red-50" title="Delete">
                          <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
                            <path d="M3 4h10M6 4V3h4v1M5 4l.5 9h5L11 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </button>
                      </div>
                    </td>
                    <td className="px-3 py-2 text-slate-800 max-w-[160px] truncate">{t.task_name}</td>
                    <td className="px-3 py-2 text-slate-600 max-w-[140px] truncate">{t.todo_list_name}</td>
                    <td className="px-3 py-2 text-slate-600 whitespace-nowrap">{fmtDate(t.start_date)}</td>
                    <td className="px-3 py-2 text-slate-600 whitespace-nowrap">{fmtDate(t.end_date)}</td>
                    <td className="px-3 py-2 text-slate-700">{t.assigned_to}</td>
                    <td className="px-3 py-2"><StatusBadge status={t.status} /></td>
                    <td className="px-3 py-2"><PctBadge pct={t.complete_percent} /></td>
                    <td className="px-3 py-2 text-slate-600 max-w-[180px] truncate">{t.remarks}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <div className="border-t border-slate-100 px-4 py-3 flex items-center gap-2 text-xs text-slate-500">
          <span>Showing 1 to {tasks.length} of {tasks.length} entries</span>
          <div className="flex-1" />
          {["«", "‹", "1", "›", "»"].map((l, i) => (
            <button key={i} className={`w-7 h-7 rounded border text-xs flex items-center justify-center ${l === "1" ? "bg-blue-500 text-white border-blue-500" : "border-slate-200 text-slate-500 hover:bg-slate-50"}`}>{l}</button>
          ))}
          <select className="border border-slate-200 rounded px-2 py-1 text-xs">
            <option>10</option><option>25</option><option>50</option>
          </select>
        </div>
      </div>
    </div>
  );
}
 
/* ══════════════════════════════════════════
   PAGE 2 — FORM VIEW  (exact image match)
══════════════════════════════════════════ */
const EMPTY_ITEM = {
  todo_list_name: "", start_date: "", end_date: "",
  assigned_to: "", status: "In-Progress", complete_percent: "0", remarks: ""
};
 
function FormView({ onSaved }) {
  const [taskName, setTaskName] = useState("");
  const [taskDesc, setTaskDesc] = useState("");
  const [form, setForm] = useState({ ...EMPTY_ITEM });
  const [summaryItems, setSummaryItems] = useState([]);
  const [saving, setSaving] = useState(false);
  const [formErr, setFormErr] = useState("");
  const [saveErr, setSaveErr] = useState("");
 
  const fc = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
 
  const addToSummary = () => {
    const { todo_list_name, start_date, end_date, assigned_to, remarks } = form;
    if (!todo_list_name || !start_date || !end_date || !assigned_to || !remarks) {
      setFormErr("Please fill all required fields."); return;
    }
    setFormErr("");
    setSummaryItems((p) => [...p, { ...form }]);
    setForm({ ...EMPTY_ITEM });
  };
 
  const removeItem = (idx) => setSummaryItems((p) => p.filter((_, i) => i !== idx));
 
  const saveTask = async () => {
  if (!taskName.trim() || !taskDesc.trim()) {
    setSaveErr("Task Name and Description are required.");
    return;
  }
 
  if (summaryItems.length === 0) {
    setSaveErr("Add at least one To-Do List entry before saving.");
    return;
  }
 
  setSaveErr("");
  setSaving(true);
 
  try {
    const res = await createTasks({
      task_name: taskName.trim(),
      task_description: taskDesc.trim(),
      todo_items: summaryItems.map((i) => ({
        ...i,
        complete_percent: parseInt(i.complete_percent) || 0
      }))
    });
 
    if (res.success) onSaved();
    else setSaveErr(res.error || "Save failed.");
 
  } catch {
    setSaveErr("API Error");
  } finally {
    setSaving(false);
  }
};
 
  /* ── shared input classes ── */
  const inp = "w-full border border-slate-300 rounded px-3 py-2 text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-200 bg-white";
  const lbl = "block text-sm font-medium text-slate-700 mb-1";
  const req = <span className="text-red-500 ml-0.5">*</span>;
 
  return (
    /* ── page background ── */
    <div className="min-h-screen bg-slate-100 flex flex-col">
 
      {/* ── top header bar ── */}
      <div className="bg-white border-b border-slate-200 px-6 py-3 flex items-center justify-between flex-shrink-0">
        <h1 className="text-xl font-medium text-slate-800">To-Do Task</h1>
        <div className="flex gap-1">
          {/* Save icon */}
          <button onClick={saveTask} disabled={saving}
            className="p-2 rounded text-slate-500 hover:bg-slate-100 disabled:opacity-40" title="Save">
            {saving ? (
              <svg className="animate-spin" width="20" height="20" viewBox="0 0 20 20" fill="none">
                <circle cx="10" cy="10" r="7" stroke="currentColor" strokeWidth="2" strokeDasharray="32" strokeDashoffset="12" />
              </svg>
            ) : (
              /* floppy-disk icon */
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="3" y="3" width="14" height="14" rx="2" stroke="currentColor" strokeWidth="1.5" />
                <rect x="6.5" y="3" width="7" height="5.5" rx="0.5" fill="currentColor" />
                <rect x="5" y="11" width="10" height="5.5" rx="0.5" fill="currentColor" />
                <rect x="8" y="3.5" width="1.5" height="4" rx="0.5" fill="white" />
              </svg>
            )}
          </button>
          {/* Search icon */}
          <button className="p-2 rounded text-slate-500 hover:bg-slate-100" title="Search">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <circle cx="9" cy="9" r="5.5" stroke="currentColor" strokeWidth="1.5" />
              <path d="M13.5 13.5L17 17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
        </div>
      </div>
 
      {saveErr && (
        <div className="mx-4 mt-3 px-4 py-2 bg-red-50 border border-red-200 rounded text-red-600 text-sm">{saveErr}</div>
      )}
 
      {/* ── three-column body ── */}
      <div className="flex flex-1 gap-0 px-6 py-4" style={{ gap: "1px" }}>
 
        {/* ╔══════════════════╗
            ║ Task Information ║   narrow left panel
            ╚══════════════════╝ */}
        <div className="bg-white border border-slate-200 rounded-l-none rounded-r-none flex flex-col"
          style={{ width: "220px", minWidth: "220px", borderRadius: "0", marginRight: "1px" }}>
          {/* white panel with its own internal padding */}
          <div className="p-5 flex flex-col h-full" style={{ borderRadius: "4px", border: "1px solid #e2e8f0" }}>
            <h2 className="text-base font-semibold mb-4" style={{ color: "#2563eb" }}>Task Information</h2>
            <div className="mb-4">
              <label className={lbl}>Task Name {req}</label>
              <input type="text" value={taskName} onChange={(e) => setTaskName(e.target.value)}
                placeholder="Enter a Taskname" className={inp} />
            </div>
            <div className="flex-1">
              <label className={lbl}>Task Description {req}</label>
              <textarea value={taskDesc} onChange={(e) => setTaskDesc(e.target.value)}
                placeholder="Enter a Description" rows={6}
                className={`${inp} resize-none`} style={{ minHeight: "110px" }} />
            </div>
          </div>
        </div>
 
        {/* ╔═════════════╗
            ║  To-Do List ║   middle panel
            ╚═════════════╝ */}
        <div className="flex-none bg-white p-5" style={{ width: "360px", minWidth: "360px", border: "1px solid #e2e8f0", borderRadius: "4px", marginRight: "1px" }}>
          <h2 className="text-base font-semibold mb-4" style={{ color: "#2563eb" }}>To-Do List</h2>
 
          {/* To-Do List Name */}
          <div className="mb-3">
            <label className={lbl}>To-Do List Name {req}</label>
            <input name="todo_list_name" value={form.todo_list_name} onChange={fc}
              placeholder="Enter a Todo List Name" className={inp} />
          </div>
 
          {/* Start Date / End Date — side by side with calendar icon */}
          <div className="grid grid-cols-2 gap-3 mb-3">
            <div>
              <label className={lbl}>Start Date {req}</label>
              <div className="relative">
                <input type="date" name="start_date" value={form.start_date} onChange={fc}
                  className={`${inp} pr-9`} />
                <span className="absolute right-0 top-0 h-full w-9 flex items-center justify-center rounded-r bg-blue-500 pointer-events-none">
                  <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
                    <rect x="1" y="3" width="14" height="12" rx="1.5" stroke="white" strokeWidth="1.3" />
                    <path d="M1 7h14" stroke="white" strokeWidth="1.3" />
                    <path d="M5 1v4M11 1v4" stroke="white" strokeWidth="1.3" strokeLinecap="round" />
                  </svg>
                </span>
              </div>
            </div>
            <div>
              <label className={lbl}>End Date {req}</label>
              <div className="relative">
                <input type="date" name="end_date" value={form.end_date} onChange={fc}
                  className={`${inp} pr-9`} />
                <span className="absolute right-0 top-0 h-full w-9 flex items-center justify-center rounded-r bg-blue-500 pointer-events-none">
                  <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
                    <rect x="1" y="3" width="14" height="12" rx="1.5" stroke="white" strokeWidth="1.3" />
                    <path d="M1 7h14" stroke="white" strokeWidth="1.3" />
                    <path d="M5 1v4M11 1v4" stroke="white" strokeWidth="1.3" strokeLinecap="round" />
                  </svg>
                </span>
              </div>
            </div>
          </div>
 
          {/* Assign To */}
          <div className="mb-3">
            <label className={lbl}>Assign To {req}</label>
            <input type="text" name="assigned_to" value={form.assigned_to} onChange={fc}
              placeholder="Enter a User" className={inp} />
          </div>
 
          {/* Status / Complete % */}
          <div className="grid grid-cols-2 gap-3 mb-3">
            <div>
              <label className={lbl}>Status {req}</label>
              <div className="relative">
                <select name="status" value={form.status} onChange={fc}
                  className={`${inp} appearance-none pr-8`}>
                  <option>In-Progress</option>
                  <option>Completed</option>
                  <option>Pending</option>
                </select>
                <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                    <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
              </div>
            </div>
            <div>
              <label className={lbl}>Complete %</label>
              <input type="number" name="complete_percent" value={form.complete_percent} onChange={fc}
                min="0" max="100" className={inp} />
            </div>
          </div>
 
          {/* Remarks */}
          <div className="mb-3">
            <label className={lbl}>Remarks {req}</label>
            <textarea name="remarks" value={form.remarks} onChange={fc}
              placeholder="Enter a Remarks" rows={4}
              className={`${inp} resize-y`} style={{ minHeight: "90px" }} />
          </div>
 
          {formErr && <p className="text-xs text-red-500 mb-2">{formErr}</p>}
 
          {/* Add button — centered, outlined style matching screenshot */}
          <div className="flex justify-center mt-1">
            <button onClick={addToSummary}
              className="px-10 py-2 text-sm font-medium text-blue-600 border border-blue-400 rounded hover:bg-blue-50 transition">
              Add
            </button>
          </div>
        </div>
 
        {/* ╔══════════════╗
            ║ Task Summary ║   right panel — takes remaining space
            ╚══════════════╝ */}
        <div className="flex-1 bg-white p-5" style={{ border: "1px solid #e2e8f0", borderRadius: "4px", minWidth: 0 }}>
          <h2 className="text-base font-semibold mb-4" style={{ color: "#2563eb" }}>Task Summary</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
            <tr className="bg-sky-600 text-white">
                  {["Action", "To Do List", "Start Date", "End Date", "Assign To", "Status", "Remarks"].map((h) => (
                    <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider" key={h} className="px-3 py-2 text-left text-xs font-medium text-slate-600 border border-slate-200 bg-white">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {summaryItems.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-3 py-4 text-sm text-slate-500 border border-slate-200">
                      No Data Found.
                    </td>
                  </tr>
                ) : (
                  summaryItems.map((item, i) => (
                    <tr key={i} className="hover:bg-sky-50/50 transition-colors duration-200 group">
                      <td className="px-3 py-2 border border-slate-200">
                        <button onClick={() => removeItem(i)}
                          className="text-red-400 hover:text-red-600 font-bold leading-none">✕</button>
                      </td>
                      <td className="px-3 py-2 border border-slate-200 text-slate-700">{item.todo_list_name}</td>
                      <td className="px-3 py-2 border border-slate-200 text-slate-600 whitespace-nowrap">{fmtDate(item.start_date)}</td>
                      <td className="px-3 py-2 border border-slate-200 text-slate-600 whitespace-nowrap">{fmtDate(item.end_date)}</td>
                      <td className="px-3 py-2 border border-slate-200 text-slate-700">{item.assigned_to}</td>
                      <td className="px-3 py-2 border border-slate-200"><StatusBadge status={item.status} /></td>
                      <td className="px-3 py-2 border border-slate-200 text-slate-600 max-w-[160px] truncate">{item.remarks}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
 
      </div>{/* end three-column body */}
    </div>
  );
}
 
/* ══════════════════════════════════════════
   ROOT
══════════════════════════════════════════ */
export default function ToDoApp() {
  const [page, setPage] = useState("list");
  return page === "list"
    ? <ListView onAdd={() => setPage("form")} />
    : <FormView onSaved={() => setPage("list")} />;
}