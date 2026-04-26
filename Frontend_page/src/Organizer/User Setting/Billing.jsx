import React from "react";

export const Billing = () => {
  return (
    <div className="bg-white border rounded shadow-sm p-6">

      {/* Header */}
      <h1 className="text-2xl font-semibold text-gray-700 mb-6">
        My Billings
      </h1>

      <div className="grid grid-cols-2 gap-6">

        {/* LEFT PANEL */}
        <div className="border rounded p-5">

          <h2 className="text-xl text-blue-600 font-semibold mb-4">
            Billing Address
          </h2>

          {/* Address */}
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-1">
              Address
            </label>

            <textarea
              className="w-full border rounded p-2 h-20 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          {/* City State Country */}
          <div className="grid grid-cols-3 gap-4">

            <div>
              <label className="block font-medium text-gray-700 mb-1">
                City
              </label>
              <input
                type="text"
                defaultValue="CHENNAI"
                className="w-full border rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>

            <div>
              <label className="block font-medium text-gray-700 mb-1">
                State
              </label>
              <input
                type="text"
                defaultValue="TAMIL NADU"
                className="w-full border rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>

            <div>
              <label className="block font-medium text-gray-700 mb-1">
                Country
              </label>
              <input
                type="text"
                defaultValue="INDIA"
                className="w-full border rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>

          </div>

        </div>

        {/* RIGHT PANEL */}
        <div className="border rounded p-5">

          <h2 className="text-xl text-blue-600 font-semibold mb-4">
            Payment History
          </h2>

          {/* Table */}
          <div className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden">

            <table className="w-full">

              <thead className="bg-gray-100">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">Date</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">Description</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">Plan Code</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">Amount</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">Invoice</th>
                </tr>
              </thead>

              <tbody>
                <tr className="text-gray-700">
                  <td className="p-3 border">Mar 3, 2025</td>
                  <td className="p-3 border">Upgraded to Enterprise Plan</td>
                  <td className="p-3 border">EP005</td>
                  <td className="p-3 border">₹5,000.99</td>

                  <td className="p-3 border text-center">
                    <button className="border rounded px-2 py-1 hover:bg-gray-100">
                      🖨
                    </button>
                  </td>
                </tr>
              </tbody>

            </table>

          </div>

          {/* Footer */}
          <div className="flex justify-between items-center mt-4 text-sm text-gray-600">

            <span>
              Showing 1 to 1 of 1 entries
            </span>

            <div className="flex items-center gap-2">

              <button className="border px-2 py-1 rounded hover:bg-gray-100">
                «
              </button>

              <button className="bg-blue-600 text-white px-3 py-1 rounded">
                1
              </button>

              <button className="border px-2 py-1 rounded hover:bg-gray-100">
                »
              </button>

              <select className="border p-1 rounded ml-2">
                <option>10</option>
                <option>25</option>
                <option>50</option>
              </select>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
};


