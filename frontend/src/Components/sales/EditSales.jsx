import React, { useEffect, useState } from "react";
import axios from "axios";

export default function EditSaleModal({ sale, onClose, onSave }) {
  const [editedSale, setEditedSale] = useState({ ...sale });
  const [productDetails, setProductDetails] = useState([]);

  useEffect(() => {
    const fetchProductDetails = async () => {
      const enrichedItems = await Promise.all(
        sale.items.map(async (item) => {
          if (item.purchaseId?._id) {
            try {
              const { data: purchaseData } = await axios.get(
                `http://localhost:3000/purchase/${item.purchaseId._id}`
              );

              const matched = purchaseData.items.find(
                (pItem) => pItem.productName === item.productName
              );

              return {
                ...item,
                purchaseDetails: matched || {},
              };
            } catch (err) {
              console.error("Failed to fetch purchase info", err);
              return { ...item, purchaseDetails: {} };
            }
          }
          return { ...item, purchaseDetails: {} };
        })
      );

      setProductDetails(enrichedItems);
    };

    fetchProductDetails();
  }, [sale]);

  const handleQuantityChange = (index, value) => {
    const updatedItems = [...editedSale.items];
    updatedItems[index].quantity = parseFloat(value) || 0;
    setEditedSale({ ...editedSale, items: updatedItems });

    const updatedDetails = [...productDetails];
    updatedDetails[index].quantity = parseFloat(value) || 0;
    setProductDetails(updatedDetails);
  };

  const handleFieldChange = (field, value) => {
    setEditedSale({ ...editedSale, [field]: value });
  };

  const calculateTotals = () => {
    return productDetails.reduce(
      (totals, item) => {
        const qty = parseFloat(item.quantity || 0);
        const rate = parseFloat(item.purchaseDetails?.sellingPrice || 0);
        const gst = parseFloat(item.purchaseDetails?.gst || 0);

        const total = rate * qty;
        const gstAmt = (total * gst) / 100;
        const totalAmt = total + gstAmt;

        totals.taxable += total;
        totals.gst += gstAmt;
        totals.grand += totalAmt;

        return totals;
      },
      { taxable: 0, gst: 0, grand: 0 }
    );
  };

  const { taxable, gst, grand } = calculateTotals();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-auto">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-6xl relative max-h-[95vh] overflow-y-auto">
        <button className="absolute top-2 right-4 text-2xl" onClick={onClose}>
          &times;
        </button>

        <h2 className="text-2xl font-bold mb-4">Edit Sale</h2>

        {/* User + Order Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="border p-4 rounded-md shadow-sm">
            <h3 className="text-lg font-semibold mb-3">User Details</h3>
            {["userName", "email", "phone", "address"].map((field) => (
              <div key={field} className="mb-3">
                <label className="block text-sm font-medium capitalize">
                  {field}
                </label>
                <input
                  type="text"
                  value={editedSale.userId?.[field] || ""}
                  onChange={(e) =>
                    setEditedSale({
                      ...editedSale,
                      userId: {
                        ...editedSale.userId,
                        [field]: e.target.value,
                      },
                    })
                  }
                  className="mt-1 w-full border-gray-300 rounded-md"
                />
              </div>
            ))}
          </div>

          <div className="border p-4 rounded-md shadow-sm">
            <h3 className="text-lg font-semibold mb-3">Order Details</h3>
            <div className="mb-3">
              <label className="block text-sm font-medium">Order ID</label>
              <input
                type="text"
                value={editedSale.orderId || ""}
                onChange={(e) => handleFieldChange("orderId", e.target.value)}
                className="mt-1 w-full border-gray-300 rounded-md"
              />
            </div>

            <div className="mb-3">
              <label className="block text-sm font-medium">Billing Date</label>
              <input
                type="date"
                value={editedSale.billingDate || ""}
                onChange={(e) =>
                  handleFieldChange("billingDate", e.target.value)
                }
                className="mt-1 w-full border-gray-300 rounded-md"
              />
            </div>

            <div className="mb-3">
              <label className="block text-sm font-medium">Due Date</label>
              <input
                type="date"
                value={editedSale.dueDate || ""}
                onChange={(e) => handleFieldChange("dueDate", e.target.value)}
                className="mt-1 w-full border-gray-300 rounded-md"
              />
            </div>

            <div>
              <label className="block text-sm font-medium">
                Mode of Payment
              </label>
              <select
                value={editedSale.modeOfPayment || ""}
                onChange={(e) =>
                  handleFieldChange("modeOfPayment", e.target.value)
                }
                className="mt-1 w-full border-gray-300 rounded-md"
              >
                <option value="">Select</option>
                <option value="Credit">Credit</option>
                <option value="Cash">Cash</option>
              </select>
            </div>
          </div>
        </div>

        {/* Items Table */}
        <div className="overflow-x-auto border rounded-md shadow-sm">
          <table className="min-w-full text-sm text-left">
            <thead className="bg-gray-100 font-semibold">
              <tr>
                <th className="px-2 py-2">S.No</th>
                <th className="px-2 py-2">Product</th>
                <th className="px-2 py-2">HSN</th>
                <th className="px-2 py-2">Qty</th>
                <th className="px-2 py-2">Rate</th>
                <th className="px-2 py-2">GST %</th>
                <th className="px-2 py-2">GST Amt</th>
                <th className="px-2 py-2">Total</th>
                <th className="px-2 py-2">Total Amt</th>
              </tr>
            </thead>
            <tbody>
              {productDetails.map((item, index) => {
                const purchase = item.purchaseDetails || {};
                const qty = parseFloat(item.quantity || 0);
                const rate = parseFloat(purchase.sellingPrice || 0);
                const gst = parseFloat(purchase.gst || 0);
                const total = rate * qty;
                const gstAmt = (total * gst) / 100;
                const totalAmt = total + gstAmt;

                return (
                  <tr key={index} className="border-t text-center">
                    <td className="px-2 py-2">{index + 1}</td>
                    <td className="px-2 py-2">{item.productName}</td>
                    <td className="px-2 py-2">{purchase.hsnCode || "-"}</td>
                    <td className="px-2 py-2">
                      <input
                        type="number"
                        value={qty}
                        min="0"
                        className="w-20 border rounded px-1"
                        onChange={(e) =>
                          handleQuantityChange(index, e.target.value)
                        }
                      />
                    </td>
                    <td className="px-2 py-2">{rate.toFixed(2)}</td>
                    <td className="px-2 py-2">{gst.toFixed(2)}</td>
                    <td className="px-2 py-2">{gstAmt.toFixed(2)}</td>
                    <td className="px-2 py-2">{total.toFixed(2)}</td>
                    <td className="px-2 py-2">{totalAmt.toFixed(2)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Totals */}
        <div className="flex justify-end mt-4 gap-6 text-sm font-semibold">
          <div>
            {/* <div>Taxable Total: ₹{taxable.toFixed(2)}</div>
            <div>GST Total: ₹{gst.toFixed(2)}</div> */}
            <div className="mt-1 text-xl border-t pt-2" style={{ color: "green" }}>
              Grand Total: ₹{grand.toFixed(2)}
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="mt-6 text-right">
          <button
            onClick={() => onSave(editedSale)}
            className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
          >
            Update
          </button>
        </div>
      </div>
    </div>
  );
}
