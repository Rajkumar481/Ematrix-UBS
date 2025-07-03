import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

export default function SalesDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [sale, setSale] = useState(null);

  useEffect(() => {
    const fetchSale = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/sales/${id}`);
        setSale(response.data);
      } catch (error) {
        console.error("Error fetching sales details:", error);
      }
    };
    fetchSale();
  }, [id]);

  if (!sale) return <div className="text-center py-12">Loading...</div>;

  return (
    <>
      <style>
        {`
          body {
            background-color: #e5e7eb;
            display: flex;
            justify-content: center;
            align-items: start;
            min-height: 100vh;
            margin: 0;
            padding: 20px;
            font-family: "Segoe UI", Arial, sans-serif;
            font-size: 12px;
            color: #000;
          }

          h1, h2 {
            font-size: 16px;
            font-weight: bold;
          }

          strong {
            font-weight: 600;
          }

          table, td, th {
            font-size: 12px;
          }

          @media print {
            @page {
              size: A5 portrait;
              margin: 1cm;
            }

            body {
              background-color: white !important;
              -webkit-print-color-adjust: exact;
              color-adjust: exact;
            }

            .no-print {
              display: none !important;
            }
          }
        `}
      </style>

      <div
        className="invoice my-4 p-6 border shadow rounded text-gray-800"
        style={{
          width: "14.8cm",
          minHeight: "21cm",
          backgroundColor: "white",
          boxShadow: "0 0 20px rgba(0,0,0,0.1)",
        }}
      >
        <h1 className="text-center mb-2">Tax Invoice</h1>

        {/* Invoice Info */}
        <div className="flex flex-col sm:flex-row justify-between border p-4 mb-6">
          <div className="space-y-1">
            <div>
              <strong>Order ID:</strong> {sale.orderId}
            </div>
            <div>
              <strong>Billing Date:</strong> {sale.billingDate}
            </div>
            <div>
              <strong>Due Date:</strong> {sale.dueDate}
            </div>
            <div>
              <strong>Mode of Payment:</strong> {sale.modeOfPayment}
            </div>
          </div>
          <div className="space-y-1 text-right">
            <div>
              <strong>Generated On:</strong> {new Date().toLocaleDateString()}
            </div>
          </div>
        </div>

        {/* Seller & Buyer Details */}
        <div className="flex justify-between border p-4 mb-6">
          <div className="w-1/2 pr-4">
            <h2 className="mb-2">Seller Details</h2>
            <div>
              <strong>Company:</strong> Ematix Embedded and Software Pvt Ltd
            </div>
            <div>
              <strong>Address:</strong> Sai Towers, 201, Cherry Rd,
              Kumarasamipatti, Salem, Tamil Nadu 636007
            </div>
            <div>
              <strong>GSTIN:</strong> 29XXXXX1234Z5A
            </div>
          </div>
          <div className="w-1/2 pl-4 text-left">
            <h2 className="mb-2">Buyer Details</h2>
            <div>
              <strong>Name:</strong> {sale.userId?.userName}
            </div>
            <div>
              <strong>Email:</strong> {sale.userId?.email}
            </div>
            <div>
              <strong>Phone:</strong> {sale.userId?.phone}
            </div>
            <div>
              <strong>Address:</strong> {sale.userId?.address}
            </div>
            <div>
              <strong>GST %:</strong> {sale.userId?.gst}%
            </div>
          </div>
        </div>

        {/* Product Table */}
        <div className="overflow-x-auto mb-6">
          <table className="min-w-full border text-sm">
            <thead className="bg-gray-100">
              <tr className="border-b">
                <th className="p-2 text-left">Sl No.</th>
                <th className="p-2 text-left">Description of Goods</th>
                <th className="p-2 text-left">HSN</th>
                <th className="p-2 text-right">Quantity</th>
                <th className="p-2 text-right">Rate</th>
                <th className="p-2 text-right">Amount</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b">
                <td className="p-2">1</td>
                <td className="p-2">{sale.purchaseId?.productName}</td>
                <td className="p-2">{sale.purchaseId?.hsnCode}</td>
                <td className="p-2 text-right">{sale.quantity}</td>
                <td className="p-2 text-right">
                  ₹{(Number(sale.purchaseId?.sellingPrice) || 0).toFixed(2)}
                </td>
                <td className="p-2 text-right">
                  ₹{(Number(sale.total) || 0).toFixed(2)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Tax Summary */}
        <div className="border p-4 mb-6">
          <div className="flex justify-between mb-2">
            <div>Taxable Value:</div>
            <div>₹{(Number(sale.total) || 0).toFixed(2)}</div>
          </div>
          <div className="flex justify-between mb-2">
            <div>GST ({sale.purchaseId?.gst || 0}%):</div>
            <div>₹{(Number(sale.gstAmount) || 0).toFixed(2)}</div>
          </div>
          <div className="flex justify-between border-t pt-2 font-bold">
            <div>Total Amount:</div>
            <div>₹{(Number(sale.totalAmount) || 0).toFixed(2)}</div>
          </div>
        </div>

        {/* Amount in Words */}
        <div className="italic mb-6">
          Amount Chargeable (in words):{" "}
          <strong>Rupees {numberToWords(Number(sale.totalAmount))} Only</strong>
        </div>

        {/* Declaration */}
        <div className="text-xs text-gray-600 border-t pt-2 mb-6">
          We declare that this invoice shows the actual price of the goods
          described and that all particulars are true and correct.
        </div>

        <div className="text-right text-sm">
          <p>Authorized Signatory</p>
        </div>

        <div className="flex justify-end mt-8 gap-4 no-print">
          <button
            onClick={() => navigate(-1)}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Back
          </button>
          <button
            onClick={() => window.print()}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Print Invoice
          </button>
        </div>
      </div>
    </>
  );
}

function numberToWords(amount) {
  if (isNaN(amount) || amount <= 0) return "Zero";
  const words = [
    "",
    "One",
    "Two",
    "Three",
    "Four",
    "Five",
    "Six",
    "Seven",
    "Eight",
    "Nine",
  ];
  const num = parseInt(amount);
  if (num < 10) return words[num];
  if (num < 20) return words[num - 10] + "teen";
  if (num < 100)
    return (words[Math.floor(num / 10)] + "ty " + words[num % 10]).trim();
  if (num < 1000)
    return (
      words[Math.floor(num / 100)] +
      " Hundred " +
      numberToWords(num % 100)
    ).trim();
  return num.toString();
}
