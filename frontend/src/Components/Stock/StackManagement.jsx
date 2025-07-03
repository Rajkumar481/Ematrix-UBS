import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaEdit, FaTrash } from "react-icons/fa";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";

const StackManagement = () => {
  const [userdata, setUserData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [filters, setFilters] = useState({
    companyName: "",
    productName: "",
    startDate: "",
    endDate: "",
  });

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [filters, userdata]);

  const fetchData = async () => {
    try {
      const response = await axios.get("http://localhost:3000/purchase");
      setUserData(response.data);
      setFilteredData(response.data);
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch products");
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const applyFilters = () => {
    let data = [...userdata];

    if (filters.companyName) {
      data = data.filter((item) =>
        item.purchaseId.companyName
          .toLowerCase()
          .includes(filters.companyName.toLowerCase())
      );
    }

    if (filters.productName) {
      data = data.filter((item) =>
        item.productName
          .toLowerCase()
          .includes(filters.productName.toLowerCase())
      );
    }

    if (filters.startDate) {
      data = data.filter(
        (item) => new Date(item.createdAt) >= new Date(filters.startDate)
      );
    }

    if (filters.endDate) {
      data = data.filter(
        (item) => new Date(item.createdAt) <= new Date(filters.endDate)
      );
    }

    setFilteredData(data);
  };

  return (
    <div className="bg-white p-6 rounded shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold">Product Details</h3>
      </div>

      {/* Filter Controls */}
      <div className="grid md:grid-cols-4 sm:grid-cols-2 gap-4 mb-6">
        <input
          type="text"
          name="companyName"
          value={filters.companyName}
          onChange={handleFilterChange}
          placeholder="Filter by Company Name"
          className="border p-2 rounded"
        />
        <input
          type="text"
          name="productName"
          value={filters.productName}
          onChange={handleFilterChange}
          placeholder="Filter by Product Name"
          className="border p-2 rounded"
        />
        <input
          type="date"
          name="startDate"
          value={filters.startDate}
          onChange={handleFilterChange}
          className="border p-2 rounded"
        />
        <input
          type="date"
          name="endDate"
          value={filters.endDate}
          onChange={handleFilterChange}
          className="border p-2 rounded"
        />
      </div>

      <table className="min-w-full table-auto border-collapse">
        <thead>
          <tr className="bg-gray-100 text-center">
            <th className="px-4 py-2 border">S.No</th>
            <th className="px-4 py-2 border">Company Name</th>
            <th className="px-4 py-2 border">Product Name</th>
            <th className="px-4 py-2 border">Quantity</th>
            <th className="px-4 py-2 border">Selling Price</th>
            <th className="px-4 py-2 border">Purchase Price</th>
            <th className="px-4 py-2 border">Profit</th>
          </tr>
        </thead>
        <tbody>
          {filteredData.map((user, index) => (
            <tr key={user._id} className="text-center border-t">
              <td className="px-4 py-2 border">{index + 1}</td>
              <td className="px-4 py-2 border">
                {user.purchaseId.companyName}
              </td>
              <td className="px-4 py-2 border">{user.productName}</td>
              <td className="px-4 py-2 border">{user.quantity}</td>
              <td className="px-4 py-2 border">{user.sellingPrice}</td>
              <td className="px-4 py-2 border">{user.purchasePrice}</td>
              <td className="px-4 py-2 border">{user.profit}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default StackManagement;
