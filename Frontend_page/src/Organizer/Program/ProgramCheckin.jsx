import React from "react";

export const ProgramCheckin = () => {
  return (
    <div className="min-h-screen bg-gray-100 p-6">

      {/* Title */}
      <h1 className="text-2xl font-semibold text-gray-700 mb-6">
        Program Check-In / Check-Out
      </h1>

      {/* Card Container */}
      <div className="bg-white shadow rounded-lg px-6 py-4 border">

        {/* Search */}
        <div className="mb-4">
          <input
            type="text"
            placeholder="Search Keyword"
            className="border rounded-md px-4 py-2 w-72 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        {/* Table */}
        <div className="overflow-x-auto">

          <table className="w-full">

            <thead className="bg-gray-200 text-gray-700">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">Action</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                  Event Code ↑↓
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                  Event Name ↑↓
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                  Event Start Date ↑↓
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                  Event End Date ↑↓
                </th>
              </tr>
            </thead>

            <tbody>
              <tr>
                <td
                  colSpan="5"
                  className="text-center py-4 text-gray-500 border"
                >
                  No Data Found.
                </td>
              </tr>
            </tbody>

          </table>

        </div>

        {/* Footer Pagination */}
        <div className="flex items-center justify-between mt-4 text-gray-600 text-sm">

          <div>
            Showing 0 to 0 of 0 entries
          </div>

          <div className="flex items-center space-x-2">

            <button className="px-2 py-1 border rounded hover:bg-gray-100">
              «
            </button>

            <button className="px-2 py-1 border rounded hover:bg-gray-100">
              ‹
            </button>

            <button className="px-2 py-1 border rounded hover:bg-gray-100">
              ›
            </button>

            <button className="px-2 py-1 border rounded hover:bg-gray-100">
              »
            </button>

            <select className="border px-2 py-1 rounded">
              <option>10</option>
              <option>25</option>
              <option>50</option>
            </select>

          </div>

        </div>

      </div>
    </div>
  );
};


