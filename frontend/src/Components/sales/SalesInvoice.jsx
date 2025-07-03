import React from "react";

export default function InvoicePage({ sale }) {
  if (!sale) return <div className="text-center py-10">Loading invoice...</div>;
  console.log(sale, "from slaes");

  const calculateTotalAmount = () =>
    sale.items?.reduce(
      (sum, item) => sum + (item.quantity || 0) * (item.sellingPrice || 0),
      0
    ) || 0;

  const calculateTotalGST = () =>
    sale.items?.reduce((sum, item) => sum + (item.gstAmount || 0), 0) || 0;

  const grandTotal = calculateTotalAmount() + calculateTotalGST();

  return (
    <div className="max-w-4xl mx-auto p-8 bg-white shadow rounded">
      <h1 className="text-3xl font-bold mb-6 text-center">Tax Invoice</h1>

      <div className="grid grid-cols-2 gap-4 text-sm mb-6 border-b pb-4">
        <div>
          <p>
            <span className="font-semibold">Order ID:</span> {sale.orderId}
          </p>
          <p>
            <span className="font-semibold">Billing Date:</span>{" "}
            {sale.billingDate}
          </p>
          <p>
            <span className="font-semibold">Due Date:</span> {sale.dueDate}
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
          {sale.items?.map((item, idx) => (
            <tr key={idx}>
              <td className="border p-2">{idx + 1}</td>
              <td className="border p-2">{item.productName || "N/A"}</td>
              <td className="border p-2">
                {item.purchaseId?.hsnCode || "N/A"}
              </td>
              <td className="border p-2 text-right">{item.quantity || 0}</td>
              <td className="border p-2 text-right">
                ₹{Number(item.sellingPrice || 0).toFixed(2)}
              </td>
              <td className="border p-2 text-right">
                ₹{((item.quantity || 0) * (item.sellingPrice || 0)).toFixed(2)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

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
        Amount Chargeable (in words): Rupees Zero Only
      </p>
    </div>
  );
}
