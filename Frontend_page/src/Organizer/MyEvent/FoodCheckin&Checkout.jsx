import React, { useState } from "react";

export default function FoodCheckIn() {
  const [search, setSearch] = useState("");

  return (
    <div className="min-h-screen bg-gray-50 p-8 font-sans">
      {/* Title */}
      <h1 className="text-3xl font-bold mb-6">Food Check-In / Check-Out</h1>

      {/* Search Bar */}
      <div className="flex items-center mb-6">
        <input
          type="text"
          placeholder="Search Keyword"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border border-gray-300 rounded px-4 py-2 w-1/3 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-sky-600 text-white">
              <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">Action</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">Event Code ↑↓</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">Event Name ↑↓</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">Event Start Date ↑↓</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">Event End Date ↑↓</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td
                colSpan="5"
                className="text-center text-gray-500 py-6 border"
              >
                No Data Found.
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-4 text-sm text-gray-600">
        <span>Showing 0 to 0 of 0 entries</span>
        <div className="flex items-center space-x-2">
          <button className="px-2 py-1 border rounded">«</button>
          <button className="px-2 py-1 border rounded bg-blue-100">1</button>
          <button className="px-2 py-1 border rounded">»</button>
          <select className="border rounded px-2 py-1">
            <option>10</option>
            <option>25</option>
            <option>50</option>
          </select>
        </div>
      </div>
    </div>
  );
}