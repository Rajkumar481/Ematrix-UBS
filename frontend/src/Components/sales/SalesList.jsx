import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import EditSaleModal from "./EditSales";

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

  const handleEdit = async (id) => {
    const sale = salesData.find((item) => item._id === id);
    if (!sale) return;

    const enrichedItems = await Promise.all(
      sale.items.map(async (item) => {
        if (!item.purchaseId?._id) return item;
        try {
          const res = await axios.get(
            `http://localhost:3000/purchase/${item.purchaseId._id}`
          );
          return {
            ...item,
            purchaseId: res.data,
          };
        } catch (err) {
          console.error("Failed to fetch purchase detail", err);
          return item;
        }
      })
    );

    setEditingSale({ ...sale, items: enrichedItems });
    setIsModalOpen(true);
  };

  const handleModalSave = async (updatedSale) => {
    try {
      const {
        _id,
        billingDate,
        deliveryDate,
        dueDate,
        modeOfPayment,
        orderId,
        items,
        userId,
      } = updatedSale;
      const payload = {
        billingDate,
        deliveryDate,
        dueDate,
        modeOfPayment,
        orderId,
        items,
        userId: userId?._id || userId,
      };
      const response = await axios.patch(
        `http://localhost:3000/sales/${_id}`,
        payload
      );
      setSalesData((prev) =>
        prev.map((sale) => (sale._id === _id ? response.data : sale))
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

  const grandTotal = filteredData.reduce(
    (sum, item) => sum + Number(item.grandTotal || 0),
    0
  );

  return (
    <div className="w-full max-w-6xl mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Sales</h1>
      </div>

      <div className="bg-white p-4 rounded-lg shadow mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label>Product Name</label>
          <input
            type="text"
            value={searchProduct}
            onChange={(e) => setSearchProduct(e.target.value)}
            className="mt-1 w-full border-gray-300 rounded-md"
          />
        </div>
        <div>
          <label>Company Name</label>
          <input
            type="text"
            value={searchCompany}
            onChange={(e) => setSearchCompany(e.target.value)}
            className="mt-1 w-full border-gray-300 rounded-md"
          />
        </div>
        <div>
          <label>Start Date</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="mt-1 w-full border-gray-300 rounded-md"
          />
        </div>
        <div>
          <label>End Date</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="mt-1 w-full border-gray-300 rounded-md"
          />
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-lg border overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3">S.No</th>
              <th className="px-4 py-3">Product Name</th>
              <th className="px-4 py-3">Company</th>
              <th className="px-4 py-3">Quantity</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((item, idx) => {
              const qty = item.items?.reduce((s, i) => s + i.quantity, 0);
              return (
                <tr
                  key={item._id}
                  onClick={() => navigate(`/sales/${item._id}`)}
                  className="hover:bg-gray-50 cursor-pointer"
                >
                  <td className="px-4 py-2">{idx + 1}</td>
                  <td className="px-4 py-2">
                    {item.items?.map((i) => i.productName).join(", ")}
                  </td>
                  <td className="px-4 py-2">
                    {item.userId?.userName || "N/A"}
                  </td>
                  <td className="px-4 py-2">{qty || 0}</td>
                  <td className="px-4 py-2 text-center">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEdit(item._id);
                      }}
                      className="mr-2"
                    >
                      ✏
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(item._id);
                      }}
                    >
                      🗑
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
          <tfoot className="bg-gray-100">
            <tr>
              <td colSpan="4" className="text-right font-bold px-4 py-2">
                Grand Total
              </td>
              <td className="text-green-600 font-semibold px-4 py-2">
                ₹{grandTotal.toFixed(2)}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>

      {loading && <div className="text-center mt-6">Loading sales data...</div>}
      {!loading && filteredData.length === 0 && (
        <div className="text-center mt-6">No sales data available</div>
      )}

      {isModalOpen && editingSale && (
        <EditSaleModal
          open={isModalOpen}
          sale={editingSale}
          onClose={() => setIsModalOpen(false)}
          onSave={handleModalSave}
        />
      )}
    </div>
  );
}
