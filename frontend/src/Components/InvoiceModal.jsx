import React from "react";
import { useNavigate } from "react-router-dom";

const InvoiceModal = ({ product, buyer, onClose }) => {
  const navigate = useNavigate();

  if (!product || !buyer) return null;

  const formatDate = (dateStr) =>
    new Date(dateStr).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

  return (
    <div className="fixed inset-0 bg-white bg-opacity-60 flex items-center justify-center z-50 overflow-auto">
      <div
        className="bg-white p-6 rounded-lg shadow-xl w-[14.8cm] max-w-full relative text-sm mt-80"
        style={{
          minHeight: "21cm", // A5 height
          fontFamily: "Segoe UI, Arial, sans-serif",
          fontSize: "12px",
        }}
      >
        <button
          className="absolute top-2 right-4 text-xl font-bold text-red-900"
          onClick={onClose}
        >
          x
        </button>

        <h2 className="text-xl font-bold text-center mb-2">Tax Invoice</h2>

        <div className="grid grid-cols-2 gap-4 text-xs border border-black p-4 mb-2">
          <div className="space-y-4">
            <h3 className="font-semibold mb-4">Buyer Details</h3>
            <p>
              <strong>Company Name:</strong> {buyer.companyName}
            </p>
            <p>
              <strong>E-mail:</strong> {buyer.email}
            </p>
            <p>
              <strong>Phone:</strong> {buyer.phone}
            </p>
            <p>
              <strong>Address:</strong> {buyer.address}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2 mt-4">
            <p>
              <strong>Quantity</strong>
            </p>
            <p>{product.quantity}</p>
            <p>
              <strong>Dated</strong>
            </p>
            <p>{formatDate(product.billingDate)}</p>
            <p>
              <strong>Buyer's Order No.</strong>
            </p>
            <p>{product.purchaseOrderId}</p>
            <p>
              <strong>Dispatched through</strong>
            </p>
            <p>{product.despatchedThrough}</p>
            <p>
              <strong>Vehicle No.</strong>
            </p>
            <p>{product.vehicleNo}</p>
            <p>
              <strong>Driver Contact</strong>
            </p>
            <p>{product.driverPhoneNo}</p>
          </div>
        </div>

        <table className="w-full border border-black text-xs mb-2">
          <thead className="bg-gray-100">
            <tr>
              <th className="border p-1">Sl No</th>
              <th className="border p-1">Description of Goods</th>
              <th className="border p-1">HSN/SAC</th>
              <th className="border p-1">Qty</th>
              <th className="border p-1">Rate</th>
              <th className="border p-1">Amount</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border p-1 text-center">1</td>
              <td className="border p-1">{product.productName}</td>
              <td className="border p-1 text-center">{product.hsnCode}</td>
              <td className="border p-1 text-center">{product.quantity}</td>
              <td className="border p-1 text-right">
                ₹{product.purchasePrice}
              </td>
              <td className="border p-1 text-right">₹{product.total}</td>
            </tr>
            <tr>
              <td colSpan="5" className="border p-1 text-right font-semibold">
                GST
              </td>
              <td className="border p-1 text-right">₹{product.gstAmount}</td>
            </tr>

            <tr>
              <td colSpan="5" className="border p-1 text-right font-bold">
                Total
              </td>
              <td className="border p-1 text-right font-bold">
                ₹{product.totalAmount}
              </td>
            </tr>
            <tr>
              <td colSpan="5" className="border p-1 text-right font-bold">
                Profit
              </td>
              <td className="border p-1 text-right font-bold">
                ₹{product.profit}
              </td>
            </tr>
          </tbody>
        </table>

        <div className="text-xs border border-black mb-2">
          <table className="w-full text-center">
            <thead className="bg-gray-100">
              <tr>
                <th className="border p-1">HSN/SAC</th>
                <th className="border p-1">Taxable Value</th>

                <th className="border p-1"> Tax (Rate)</th>
                <th className="border p-1"> Tax (Amt)</th>
                <th className="border p-1">Total Tax</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border p-1">{product.hsnCode}</td>
                <td className="border p-1">₹{product.total}</td>

                <td className="border p-1">{product.gst}%</td>
                <td className="border p-1">₹{product.gstAmount}</td>
                <td className="border p-1">₹{product.gstAmount * 2}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="text-xs mb-4">
          <p>
            <strong>Tax Amount (in words):</strong> Indian Rupee{" "}
            {numberToWords(product.gstAmount * 2)} Only
          </p>
          <p>
            <strong>Amount Chargeable (in words):</strong> Indian Rupee{" "}
            {numberToWords(product.totalAmount)} Only
          </p>
        </div>

        <div className="border-t pt-2 text-xs text-gray-700 italic">
          <p>
            We declare that this invoice shows the actual price of the goods
            described and that all particulars are true and correct.
          </p>
        </div>

        <p className="text-right text-xs">Authorised Signatory</p>

        {/* ✅ Buttons */}
        <div className="flex justify-end gap-4 mt-6">
          <button
            onClick={onClose}
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 text-sm"
          >
            Back
          </button>
          <button
            onClick={() => window.print()}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-sm"
          >
            Print
          </button>
        </div>
      </div>
    </div>
  );
};

function numberToWords(amount) {
  try {
    const formatter = new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      currencyDisplay: "name",
    });
    return formatter.format(amount).replace("Indian rupees", "").trim();
  } catch {
    return amount;
  }
}

export default InvoiceModal;
