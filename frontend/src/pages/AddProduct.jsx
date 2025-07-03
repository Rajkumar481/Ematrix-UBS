import React from "react";
import { useNavigate } from "react-router-dom";

const AddProduct = () => {
  const navigate = useNavigate();

  const today = new Date().toISOString().split("T")[0];
  const tomorrow = new Date(Date.now() + 86400000).toISOString().split("T")[0]; // today + 1 day

  return (
    <div className="bg-white p-6 rounded shadow-md max-w-5xl mx-auto mt-6">
      <h2 className="text-2xl font-bold mb-6">Add Product</h2>
      <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label className="block font-medium">Company Name</label>
            <input type="text" className="w-full p-2 border rounded" />
          </div>
          <div>
            <label className="block font-medium">Email</label>
            <input type="email" className="w-full p-2 border rounded" />
          </div>
          <div>
            <label className="block font-medium">Phone</label>
            <input type="tel" className="w-full p-2 border rounded" />
          </div>
          <div>
            <label className="block font-medium">Address</label>
            <textarea className="w-full p-2 border rounded" rows="3" />
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block font-medium">Invoice No</label>
            <input type="text" className="w-full p-2 border rounded" />
          </div>
          <div>
            <label className="block font-medium">Billing Date</label>
            <input
              type="date"
              className="w-full p-2 border rounded bg-gray-100 cursor-not-allowed"
              value={today}
              readOnly
            />
          </div>
          <div>
            <label className="block font-medium">Delivery Date</label>
            <input
              type="date"
              className="w-full p-2 border rounded"
              min={tomorrow}
            />
          </div>
          <div>
            <label className="block font-medium">Vehicle No</label>
            <input type="text" className="w-full p-2 border rounded" />
          </div>
          <div>
            <label className="block font-medium">Driver No</label>
            <input type="text" className="w-full p-2 border rounded" />
          </div>
          <div>
            <label className="block font-medium">Purchase ID</label>
            <input type="text" className="w-full p-2 border rounded" />
          </div>
        </div>
      </form>

      <table className="w-full border-collapse mt-6">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2">S.No</th>
            <th className="border p-2">Product Name</th>
            <th className="border p-2">HSN</th>
            <th className="border p-2">Quantity</th>
            <th className="border p-2">Purchase Price</th>
            <th className="border p-2">Selling Price</th>
            <th className="border p-2">GST (%)</th>
            <th className="border p-2">GST Amount</th>
            <th className="border p-2">Total</th>
            <th className="border p-2">Total Amount</th>
            <th className="border p-2">Profit</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="border p-2 text-center">1</td>
            <td className="border p-2">
              <input type="text" className="w-full p-1 border rounded" />
            </td>
            <td className="border p-2">
              <input type="text" className="w-full p-1 border rounded" />
            </td>
            <td className="border p-2">
              <input type="number" className="w-full p-1 border rounded" />
            </td>
            <td className="border p-2">
              <input type="number" className="w-full p-1 border rounded" />
            </td>
            <td className="border p-2">
              <input type="number" className="w-full p-1 border rounded" />
            </td>
            <td className="border p-2">
              <input type="number" className="w-full p-1 border rounded" />
            </td>
            <td className="border p-2 text-center"></td>
            <td className="border p-2 text-center"></td>
            <td className="border p-2 text-center"></td>
            <td className="border p-2 text-center"></td>
          </tr>
        </tbody>
      </table>

      <div className="flex justify-end mt-12 gap-3 space-x-4">
        <button
          onClick={() => navigate(-1)}
          className="px-6 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
        >
          Back
        </button>
        <button className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700">
          Submit
        </button>
      </div>
    </div>
  );
};

export default AddProduct;
