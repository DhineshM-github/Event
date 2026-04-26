import React from "react";

export const Feedback = () => {
  return (
    <div className="min-h-screen bg-gray-200 p-6">
      
      {/* Page Title */}
      <h1 className="text-2xl font-semibold text-blue-700 mb-4">
        Feedback
      </h1>

      {/* Table Container */}
      <div className="bg-white border rounded shadow">

        {/* Table */}
        <table className="w-full">

          {/* Table Head */}
          <thead className="bg-gray-100 border-b">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">Action</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                Event Name ↑↓
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                No of Reviewers ↑↓
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                Overall Rating out of 5 ↑↓
              </th>
            </tr>
          </thead>

          {/* Table Body */}
          <tbody>
            <tr>
              <td
                colSpan="4"
                className="text-center py-6 text-gray-600 border"
              >
                No Data found.
              </td>
            </tr>
          </tbody>
        </table>

        {/* Pagination Section */}
        <div className="flex items-center justify-between px-4 py-3 bg-gray-50 border-t">

          <div className="text-sm text-gray-600">
            Showing 0 to 0 of 0 entries
          </div>

          <div className="flex items-center gap-2">

            <button className="px-2 py-1 border rounded text-gray-500">
              {"<<"}
            </button>

            <button className="px-2 py-1 border rounded text-gray-500">
              {"<"}
            </button>

            <button className="px-2 py-1 border rounded text-gray-500">
              {">"}
            </button>

            <button className="px-2 py-1 border rounded text-gray-500">
              {">>"}
            </button>

            <select className="ml-2 border rounded px-2 py-1">
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

export default Feedback;
