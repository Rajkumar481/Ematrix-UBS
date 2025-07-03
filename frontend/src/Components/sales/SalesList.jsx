import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function SalesList() {
  const navigate = useNavigate();
  const [salesData, setSalesData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSale, setEditingSale] = useState(null);

  // Filters
  const [searchProduct, setSearchProduct] = useState("");
  const [searchUsername, setSearchUsername] = useState("");
  const [startDate, setStartDate] = useState(() => {
    const today = new Date().toISOString().split("T")[0];
    return today;
  });
  const [endDate, setEndDate] = useState(() => {
    const today = new Date().toISOString().split("T")[0];
    return today;
  });

  const fetchSales = async () => {
    try {
      const response = await axios.get("http://localhost:3000/sales");
      setSalesData(response.data);
      setFilteredData(response.data);
      console.log(response.data);
    } catch (error) {
      console.error("Error fetching sales data:", error);
      alert("Failed to fetch sales data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSales();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [searchProduct, searchUsername, startDate, endDate, salesData]);

  const applyFilters = () => {
    const filtered = salesData.filter((item) => {
      const productMatch = searchProduct
        ? item.items.some((it) =>
            it.productName.toLowerCase().includes(searchProduct.toLowerCase())
          )
        : true;

      const usernameMatch = searchUsername
        ? item.userId?.userName
            ?.toLowerCase()
            .includes(searchUsername.toLowerCase())
        : true;

      const createdAtDate = new Date(item.createdAt)
        .toISOString()
        .split("T")[0];
      const afterStart = startDate ? createdAtDate >= startDate : true;
      const beforeEnd = endDate ? createdAtDate <= endDate : true;

      return productMatch && usernameMatch && afterStart && beforeEnd;
    });
    setFilteredData(filtered);
  };

  const handleEdit = (id) => {
    const sale = salesData.find((item) => item._id === id);
    if (sale) {
      setEditingSale({
        ...sale,
        quantity: sale.quantity?.toString() || "",
        billingDate: sale.billingDate,
        dueDate: sale.dueDate,
        modeOfPayment: sale.modeOfPayment || "Cash",
      });
      setIsModalOpen(true);
    }
  };

  const handleModalSave = async () => {
    try {
      const updatedSale = {
        quantity: editingSale.quantity,
        billingDate: editingSale.billingDate,
        dueDate: editingSale.dueDate,
        modeOfPayment: editingSale.modeOfPayment,
      };
      const response = await axios.patch(
        `http://localhost:3000/sales/${editingSale._id}`,
        updatedSale
      );
      setSalesData((prev) =>
        prev.map((item) =>
          item._id === editingSale._id ? response.data : item
        )
      );
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error updating sales record:", error);
      alert("Failed to update sales record. Please try again.");
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/sales/${id}`);
      setSalesData((prev) => prev.filter((item) => item._id !== id));
    } catch (error) {
      console.error("Error deleting sales record:", error);
      alert("Failed to delete sales record. Please try again.");
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Sales</h1>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label className="text-sm text-gray-700">Product Name</label>
          <input
            type="text"
            value={searchProduct}
            onChange={(e) => setSearchProduct(e.target.value)}
            className="mt-1 w-full border-gray-300 rounded-md shadow-sm"
            placeholder="Search by product"
          />
        </div>
        <div>
          <label className="text-sm text-gray-700">Username</label>
          <input
            type="text"
            value={searchUsername}
            onChange={(e) => setSearchUsername(e.target.value)}
            className="mt-1 w-full border-gray-300 rounded-md shadow-sm"
            placeholder="Search by username"
          />
        </div>
        <div>
          <label className="text-sm text-gray-700">Start Date</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="mt-1 w-full border-gray-300 rounded-md shadow-sm"
          />
        </div>
        <div>
          <label className="text-sm text-gray-700">End Date</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="mt-1 w-full border-gray-300 rounded-md shadow-sm"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow-lg border border-grey-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                S.No
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Product Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Username
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Quantity
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total Amount
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredData.map((item, index) => (
              <tr
                key={item._id}
                className="hover:bg-gray-50 transition-colors duration-200"
                onClick={() => navigate(`/sales/${item._id}`)}
              >
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {index + 1}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {item.items?.map((i) => i.productName).join(", ") || "N/A"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                  {item.userId?.userName || "N/A"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                  {item.items?.reduce((sum, i) => sum + i.quantity, 0) || 0}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-700">
                  {(Number(item.grandTotal) || 0).toFixed(2)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  <div className="flex items-center justify-center gap-3">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEdit(item._id);
                      }}
                      className="text-blue-600 hover:text-blue-800 hover:bg-blue-100 p-2 rounded-full transition-all duration-200"
                      title="Edit"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                        />
                      </svg>
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(item._id);
                      }}
                      className="text-red-600 hover:text-red-800 hover:bg-red-100 p-2 rounded-full transition-all duration-200"
                      title="Delete"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {loading && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">Loading sales data...</p>
        </div>
      )}

      {!loading && filteredData.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No sales data available</p>
        </div>
      )}

      {/* Modal */}
      {isModalOpen && editingSale && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg relative">
            <button
              className="absolute top-2 right-2 text-gray-600 hover:text-gray-900"
              onClick={() => setIsModalOpen(false)}
            >
              &times;
            </button>
            <h2 className="text-xl font-bold mb-4">Edit Sale</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Quantity
                </label>
                <input
                  type="number"
                  value={editingSale.quantity}
                  onChange={(e) =>
                    setEditingSale({ ...editingSale, quantity: e.target.value })
                  }
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Billing Date
                </label>
                <input
                  type="date"
                  value={editingSale.billingDate}
                  onChange={(e) =>
                    setEditingSale({
                      ...editingSale,
                      billingDate: e.target.value,
                    })
                  }
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Due Date
                </label>
                <input
                  type="date"
                  value={editingSale.dueDate}
                  onChange={(e) =>
                    setEditingSale({ ...editingSale, dueDate: e.target.value })
                  }
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Mode of Payment
                </label>
                <select
                  value={editingSale.modeOfPayment}
                  onChange={(e) =>
                    setEditingSale({
                      ...editingSale,
                      modeOfPayment: e.target.value,
                    })
                  }
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="Cash">Cash</option>
                  <option value="Credit">Credit</option>
                </select>
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setIsModalOpen(false)}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleModalSave}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
