import React, { useEffect, useState } from "react";
import axios from "axios";

export default function InvoicePage({ sale }) {
  const [purchases, setPurchases] = useState([]);
  const [loadingPurchases, setLoadingPurchases] = useState(true);

  useEffect(() => {
    const fetchPurchases = async () => {
      try {
        if (sale?.items?.length) {
          const fetched = await Promise.all(
            sale.items.map((item) =>
              axios
                .get(`http://localhost:3000/purchase/${item.purchaseId?._id}`)
                .then((res) => res.data)
                .catch((err) => {
                  console.error("Error fetching purchase:", err);
                  return null;
                })
            )
          );
          setPurchases(fetched);
        }
      } catch (error) {
        console.error("Error fetching purchases:", error);
      } finally {
        setLoadingPurchases(false);
      }
    };

    fetchPurchases();
  }, [sale]);

  if (!sale) return <div className="text-center py-10">Loading invoice...</div>;
  if (loadingPurchases)
    return <div className="text-center py-10">Loading purchase details...</div>;

  const calculateTotalAmount = () =>
    sale.items?.reduce((sum, item) => {
      const purchase = purchases.find((p) => p?._id === item.purchaseId?._id);
      const rate = purchase?.sellingPrice || 0;
      return sum + (item.quantity || 0) * rate;
    }, 0) || 0;

  const calculateTotalGST = () =>
    sale.items?.reduce((sum, item) => sum + (Number(item.gstAmount) || 0), 0) ||
    0;

  const grandTotal = calculateTotalAmount() + calculateTotalGST();

  return (
    <div className="max-w-4xl mx-auto p-8 bg-white shadow rounded">
      <h1 className="text-3xl font-bold mb-6 text-center">Tax Invoice</h1>

      {/* Invoice Metadata */}
      <div className="grid grid-cols-2 gap-4 text-sm mb-6 border-b pb-4">
        <div>
          <p>
            <span className="font-semibold">Order ID:</span> {sale.orderId}
          </p>
          <p>
            <span className="font-semibold">Billing Date:</span>{" "}
            {sale.billingDate || "N/A"}
          </p>
          <p>
            <span className="font-semibold">Due Date:</span>{" "}
            {sale.dueDate || "N/A"}
          </p>
          <p>
            <span className="font-semibold">Mode of Payment:</span>{" "}
            {sale.modeOfPayment}
          </p>
        </div>
        <div className="text-right">
          <p>
            <span className="font-semibold">Generated On:</span>{" "}
            {new Date(sale.createdAt).toLocaleDateString()}
          </p>
        </div>
      </div>

      {/* Seller & Buyer Details */}
      <div className="grid grid-cols-2 gap-8 text-sm mb-6 border p-4 rounded">
        <div>
          <h2 className="font-bold mb-2">Seller Details</h2>
          <p>
            <span className="font-semibold">Company:</span> Ematix Embedded and
            Software Pvt Ltd
          </p>
          <p>
            <span className="font-semibold">Address:</span> Sai Towers, 201,
            Cherry Rd, Kumarasamipatti, Salem, Tamil Nadu 636007
          </p>
          <p>
            <span className="font-semibold">GSTIN:</span> 29XXXXXX1234Z5A
          </p>
        </div>
        <div>
          <h2 className="font-bold mb-2">Buyer Details</h2>
          <p>
            <span className="font-semibold">Name:</span>{" "}
            {sale.userId?.userName || "N/A"}
          </p>
          <p>
            <span className="font-semibold">Email:</span>{" "}
            {sale.userId?.email || "N/A"}
          </p>
          <p>
            <span className="font-semibold">Phone:</span>{" "}
            {sale.userId?.phone || "N/A"}
          </p>
          <p>
            <span className="font-semibold">Address:</span>{" "}
            {sale.userId?.address || "N/A"}
          </p>
        </div>
      </div>

      {/* Items Table */}
      <table className="w-full text-sm border mb-6">
        <thead className="bg-gray-100">
          <tr>
            <th className="border p-2 text-left">Sl No.</th>
            <th className="border p-2 text-left">Description of Goods</th>
            <th className="border p-2 text-left">HSN</th>
            <th className="border p-2 text-right">Quantity</th>
            <th className="border p-2 text-right">Rate</th>
            <th className="border p-2 text-right">Amount</th>
          </tr>
        </thead>
        <tbody>
          {sale.items?.map((item, idx) => {
            const purchase = purchases.find(
              (p) => p?._id === item.purchaseId?._id
            );
            const hsn = purchase?.hsnCode || "N/A";
            const rate = purchase?.sellingPrice || 0;
            const qty = item.quantity || 0;
            const amount = qty * rate;

            return (
              <tr key={idx}>
                <td className="border p-2">{idx + 1}</td>
                <td className="border p-2">{item.productName || "N/A"}</td>
                <td className="border p-2">{hsn}</td>
                <td className="border p-2 text-right">{qty}</td>
                <td className="border p-2 text-right">₹{rate.toFixed(2)}</td>
                <td className="border p-2 text-right">₹{amount.toFixed(2)}</td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* Totals */}
      <div className="flex justify-end text-sm border p-4 rounded mb-4">
        <div className="w-64">
          <div className="flex justify-between mb-2">
            <span>Taxable Value:</span>
            <span>₹{calculateTotalAmount().toFixed(2)}</span>
          </div>
          <div className="flex justify-between mb-2">
            <span>GST:</span>
            <span>₹{calculateTotalGST().toFixed(2)}</span>
          </div>
          <hr className="my-2" />
          <div className="flex justify-between font-bold text-lg">
            <span>Total Amount:</span>
            <span>₹{grandTotal.toFixed(2)}</span>
          </div>
        </div>
      </div>

      <p className="text-xs text-gray-600 italic mt-4">
        Amount Chargeable (in words): Rupees One Hundred Eight Only
      </p>
    </div>
  );
}
