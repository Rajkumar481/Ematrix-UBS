// src/components/Product.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';

const Product = () => {
  const [userdata, setUserData] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get('http://localhost:3000/purchase');
      setUserData(response.data);
    } catch (error) {
      console.error(error);
      toast.error('Failed to fetch users');
    }
  };

  return (
    <div className="bg-white p-6 rounded shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold">Product Details</h3>
        <Link
          to="/add-product"
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 !no-underline"
        >
          Add product
        </Link>

      </div>

      <table className="min-w-full table-auto border-collapse">
        <thead>
          <tr className="bg-gray-100 text-center">
            <th className="px-4 py-2 border">S.No</th>
            <th className="px-4 py-2 border">Companyname</th>
            <th className="px-4 py-2 border">productName</th>
            <th className="px-4 py-2 border">id</th>
            <th className="px-4 py-2 border">quantity</th>
            <th className="px-4 py-2 border">purchase price</th>
            <th className="px-4 py-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {userdata.map((user, index) => (
            <tr key={user._id} className="text-center border-t">
              <td className="px-4 py-2 border">{index + 1}</td>
              <td className="px-4 py-2 border">{user.purchaseId.companyName}</td>
              <td className="px-4 py-2 border">{user.productName}</td>
              <td className="px-4 py-2 border">{user.purchaseOrderId}</td>
              <td className="px-4 py-2 border">{user.quantity}</td>
              <td className="px-4 py-2 border">{user.purchasePrice}</td>
              <td className="px-4 py-2 border space-x-2">
                <button className="text-blue-500">
                  <FaEdit />
                </button>
                <button className="text-red-500">
                  <FaTrash />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Product;
