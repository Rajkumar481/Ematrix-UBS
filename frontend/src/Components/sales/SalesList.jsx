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

  const [searchProduct, setSearchProduct] = useState("");
  const [searchCompany, setSearchCompany] = useState("");
  const [startDate, setStartDate] = useState(
    () => new Date().toISOString().split("T")[0]
  );
  const [endDate, setEndDate] = useState(
    () => new Date().toISOString().split("T")[0]
  );

  const fetchSales = async () => {
    try {
      const response = await axios.get("http://localhost:3000/sales");
      setSalesData(response.data);
      setFilteredData(response.data);
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
  }, [searchProduct, searchCompany, startDate, endDate, salesData]);

  const applyFilters = () => {
    const filtered = salesData.filter((item) => {
      const { items, userId, createdAt } = item;
      const productMatch = searchProduct
        ? items?.some((it) =>
            it.productName.toLowerCase().includes(searchProduct.toLowerCase())
          )
        : true;
      const companyMatch = searchCompany
        ? userId?.userName?.toLowerCase().includes(searchCompany.toLowerCase())
        : true;
      const createdDate = new Date(createdAt).toISOString().split("T")[0];
      const afterStart = startDate ? createdDate >= startDate : true;
      const beforeEnd = endDate ? createdDate <= endDate : true;
      return productMatch && companyMatch && afterStart && beforeEnd;
    });
    setFilteredData(filtered);
  };

  const handleEdit = (id) => {
    const sale = salesData.find((item) => item._id === id);
    if (sale) {
      setEditingSale({
        ...sale,
        billingDate: sale.billingDate,
        deliveryDate: sale.deliveryDate,
      });
      setIsModalOpen(true);
    }
  };

  const handleModalSave = async () => {
    try {
      const updatedSale = {
        billingDate: editingSale.billingDate,
        deliveryDate: editingSale.deliveryDate,
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

  const handlePurchaseClick = async (purchaseId) => {
    try {
      const response = await axios.get(
        `http://localhost:3000/purchase/${purchaseId}`
      );
      console.log("Purchase details:", response.data);
      alert(`Purchase details fetched! Check console.`);
    } catch (error) {
      console.error("Error fetching purchase details:", error);
      alert("Failed to fetch purchase details. Please try again.");
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Sales</h1>
      </div>

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
          <label className="text-sm text-gray-700">Company Name</label>
          <input
            type="text"
            value={searchCompany}
            onChange={(e) => setSearchCompany(e.target.value)}
            className="mt-1 w-full border-gray-300 rounded-md shadow-sm"
            placeholder="Search by company"
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

      <div className="bg-white rounded-lg shadow-lg border overflow-hidden">
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
                Company Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Quantity
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Grand Total
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Purchase ID
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredData.map((item, index) => {
              const { _id, items, userId, grandTotal } = item;
              const totalQuantity = items?.reduce(
                (sum, i) => sum + i.quantity,
                0
              );

              return (
                <tr
                  key={_id}
                  className="hover:bg-gray-50 transition-colors duration-200"
                  onClick={() => navigate(`/sales/${_id}`)}
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {index + 1}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {items?.map((i) => i.productName).join(", ") || "N/A"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {userId?.userName || "N/A"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {totalQuantity || 0}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-700">
                    {grandTotal}
                  </td>
                  {/* <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600 underline cursor-pointer">
                    {items?.map((i) => (
                      <div
                        key={i.purchaseId?._id}
                        onClick={(e) => {
                          e.stopPropagation();
                          handlePurchaseClick(i.purchaseId?._id);
                        }}
                      >
                        {i.purchaseId?._id || "N/A"}
                      </div>
                    ))}
                  </td> */}
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <div className="flex items-center justify-center gap-3">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEdit(_id);
                        }}
                        className="text-blue-600 hover:text-blue-800 hover:bg-blue-100 p-2 rounded-full transition-all duration-200"
                        title="Edit"
                      >
                        ✏️
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(_id);
                        }}
                        className="text-red-600 hover:text-red-800 hover:bg-red-100 p-2 rounded-full transition-all duration-200"
                        title="Delete"
                      >
                        🗑️
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
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
                  Delivery Date
                </label>
                <input
                  type="date"
                  value={editingSale.deliveryDate}
                  onChange={(e) =>
                    setEditingSale({
                      ...editingSale,
                      deliveryDate: e.target.value,
                    })
                  }
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
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
