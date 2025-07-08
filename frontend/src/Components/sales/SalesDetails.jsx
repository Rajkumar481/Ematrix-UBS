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
        const { data: saleData } = await axios.get(
          `http://localhost:3000/sales/${id}`
        );  

        const enrichedItems = await Promise.all(
          saleData.items.map(async (item) => {
            if (item.purchaseId?._id) {
              try {
                const { data: purchaseData } = await axios.get(
                  `http://localhost:3000/purchase/${item.purchaseId._id}`
                );

                const matchedItem = purchaseData.items.find(
                  (pItem) => pItem.productName === item.productName
                );

                return {
                  ...item,
                  purchaseId: matchedItem || {},
                };
              } catch (err) {
                console.error("Error fetching purchase item:", err);
                return item;
              }
            }
            return item;
          })
        );

        saleData.items = enrichedItems;
        setSale(saleData);
      } catch (error) {
        console.error("Error fetching sales details:", error);
      }
    };

    fetchSale();
  }, [id]);

  if (!sale) return <div className="text-center py-12">Loading...</div>;

  const calculateTotalAmount = () =>
    sale.items?.reduce(
      (sum, item) =>
        sum + (item.quantity || 0) * (item.purchaseId?.sellingPrice || 0),
      0
    ) || 0;

  const calculateTotalGST = () =>
    sale.items?.reduce((sum, item) => sum + (item.gstAmount || 0), 0) || 0;

  const grandTotal = calculateTotalAmount() + calculateTotalGST();

  return (
    <>
      <style>
        {`
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

          body, .invoice {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          }
        `}
      </style>

      <div
        className="invoice mx-auto p-6 border shadow rounded text-gray-800"
        style={{
          fontSize: "13px",
          fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
          width: "14.8cm",
          minHeight: "21cm",
          backgroundColor: "white",
        }}
      >
        <h1 className="text-center mb-4 text-xl font-bold">Tax Invoice</h1>

        <div className="flex flex-col sm:flex-row justify-between border p-4 mb-6 text-[13px]">
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
              <strong>Generated On:</strong>{" "}
              {new Date(sale.createdAt).toLocaleDateString()}
            </div>
          </div>
        </div>

        <div className="flex justify-between border p-4 mb-6 text-[13px]">
          <div className="w-1/2 pr-4">
            <h2 className="mb-2 font-semibold">Seller Details</h2>
            <div>
              <strong>Company:</strong> Ematix Embedded and Software Pvt Ltd
            </div>
            <div>
              <strong>Address:</strong> Sai Towers, 201, Cherry Rd,
              Kumarasamipatti, Salem, Tamil Nadu 636007
            </div>
            <div>
              <strong>GSTIN:</strong> 29XXXXXX1234Z5A
            </div>
          </div>
          <div className="w-1/2 pl-4 text-left">
            <h2 className="mb-2 font-semibold">Buyer Details</h2>
            <div>
              <strong>Name:</strong> {sale.userId?.userName || "N/A"}
            </div>
            <div>
              <strong>Email:</strong> {sale.userId?.email || "N/A"}
            </div>
            <div>
              <strong>Phone:</strong> {sale.userId?.phone || "N/A"}
            </div>
            <div>
              <strong>Address:</strong> {sale.userId?.address || "N/A"}
            </div>
          </div>
        </div>

        <div className="overflow-x-auto mb-6">
          <table className="min-w-full border text-[13px]">
            <thead className="bg-gray-100 font-semibold">
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
              {sale.items?.map((item, idx) => (
                <tr key={idx} className="border-b">
                  <td className="p-2">{idx + 1}</td>
                  <td className="p-2">{item.productName || "N/A"}</td>
                  <td className="p-2">{item.purchaseId?.hsnCode || "N/A"}</td>
                  <td className="p-2 text-right">{item.quantity || 0}</td>
                  <td className="p-2 text-right">
                    ₹{Number(item.purchaseId?.sellingPrice || 0).toFixed(2)}
                  </td>
                  <td className="p-2 text-right">
                    ₹
                    {(
                      (item.quantity || 0) *
                      (item.purchaseId?.sellingPrice || 0)
                    ).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="border p-4 mb-6 text-[13px]">
          <div className="flex justify-between mb-2">
            <div>Taxable Value:</div>
            <div>₹{calculateTotalAmount().toFixed(2)}</div>
          </div>
          <div className="flex justify-between mb-2">
            <div>GST:</div>
            <div>₹{calculateTotalGST().toFixed(2)}</div>
          </div>
          <div className="flex justify-between border-t pt-2 font-bold">
            <div>Total Amount:</div>
            <div>₹{grandTotal.toFixed(2)}</div>
          </div>
        </div>

        <div className="italic mb-6 text-[13px]">
          Amount Chargeable (in words):{" "}
          <strong>Rupees {numberToWords(grandTotal)} Only</strong>
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
    "Ten",
    "Eleven",
    "Twelve",
    "Thirteen",
    "Fourteen",
    "Fifteen",
    "Sixteen",
    "Seventeen",
    "Eighteen",
    "Nineteen",
  ];
  const tens = [
    "",
    "",
    "Twenty",
    "Thirty",
    "Forty",
    "Fifty",
    "Sixty",
    "Seventy",
    "Eighty",
    "Ninety",
  ];

  const numToWords = (n) => {
    if (n < 20) return words[n];
    if (n < 100) return ` ${tens[Math.floor(n / 10)]} ${words[n % 10]}`.trim();
    if (n < 1000)
      return `${words[Math.floor(n / 100)]} Hundred ${numToWords(
        n % 100
      )}`.trim();
    if (n < 100000)
      return `${numToWords(Math.floor(n / 1000))} Thousand ${numToWords(
        n % 1000
      )}`.trim();
    return n.toString();
  };

  return numToWords(Math.floor(amount));
}
