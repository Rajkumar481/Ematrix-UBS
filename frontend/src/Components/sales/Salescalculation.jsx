import React, { useEffect, useState } from "react";
import axios from "axios";

const Salescalculation = ({ onChange, onSubmit, reset }) => {
  const [productList, setProductList] = useState([]);
  const [productRows, setProductRows] = useState([
    {
      productName: "",
      hsn: "",
      rate: "",
      gst: "",
      quantity: "",
      purchaseId: "",
    },
  ]);

  useEffect(() => {
    axios
      .get("http://localhost:3000/purchase")
      .then((res) => {
        const flattenedProducts = res.data.flatMap((purchase) =>
          (purchase.items || []).map((item) => ({
            ...item,
            purchaseId: purchase._id, // attach purchase id for your sales payload
          }))
        );
        setProductList(flattenedProducts);
      })
      .catch((err) => console.error("Error loading products:", err));
  }, []);

  useEffect(() => {
    if (reset) {
      setProductRows([
        {
          productName: "",
          hsn: "",
          rate: "",
          gst: "",
          quantity: "",
          purchaseId: "",
        },
      ]);
      onChange([]); // reset products in parent
    }
  }, [reset, onChange]);

  const handleChange = (index, name, value) => {
    const safeValue = value ?? "";

    const updatedRows = productRows.map((row, i) => {
      if (i !== index) return row;

      let updatedRow = { ...row, [name]: safeValue };

      if (name === "productName") {
        updatedRow.productName = safeValue; // set typed value

        const selected = productList.find(
          (p) =>
            (p.productName ?? "").trim().toLowerCase() ===
            safeValue.trim().toLowerCase()
        );

        if (selected) {
          updatedRow = {
            ...updatedRow,
            purchaseId: selected.purchaseId,
            productName: selected.productName,
            hsn: selected.hsnCode,
            rate: selected.sellingPrice,
            gst: selected.gst,
          };
        } else {
          updatedRow = {
            ...updatedRow,
            hsn: "",
            rate: "",
            gst: "",
            purchaseId: "",
          };
        }
      }

      return updatedRow;
    });

    setProductRows(updatedRows);

    if (name === "quantity" && index === productRows.length - 1) {
      setProductRows((prev) => [
        ...updatedRows,
        {
          productName: "",
          hsn: "",
          rate: "",
          gst: "",
          quantity: "",
          purchaseId: "",
        },
      ]);
    }

    const updatedProducts = updatedRows.filter(
      (p) => p.purchaseId && p.quantity
    );
    onChange(updatedProducts);
  };

  return (
    <div className="mt-10 space-y-4 bg-white shadow p-6 rounded overflow-x-auto">
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2">S.No</th>
            <th className="border p-2">Product Name</th>
            <th className="border p-2">HSN</th>
            <th className="border p-2">Quantity</th>
            <th className="border p-2">Rate</th>
            <th className="border p-2">GST (%)</th>
            <th className="border p-2">GST Amount</th>
            <th className="border p-2">Total</th>
            <th className="border p-2">Total Amount</th>
          </tr>
        </thead>
        <tbody>
          {productRows.map((row, index) => {
            const quantityNum = parseFloat(row.quantity) || 0;
            const rateNum = parseFloat(row.rate) || 0;
            const gstNum = parseFloat(row.gst) || 0;
            const gstAmount = (rateNum * quantityNum * gstNum) / 100 || 0;
            const total = rateNum * quantityNum || 0;
            const totalAmount = total + gstAmount;

            return (
              <tr key={index}>
                <td className="border p-2 text-center">{index + 1}</td>
                <td className="border p-2">
                  <input
                    list="products"
                    name="productName"
                    value={row.productName}
                    onChange={(e) =>
                      handleChange(index, "productName", e.target.value)
                    }
                    className="w-full p-1 border rounded"
                  />
                  <datalist id="products">
                    {productList.map((p, idx) => (
                      <option key={idx} value={p.productName} />
                    ))}
                  </datalist>
                </td>
                <td className="border p-2">
                  <input
                    type="text"
                    value={row.hsn}
                    className="w-full p-1 border rounded"
                    readOnly
                  />
                </td>
                <td className="border p-2">
                  <input
                    type="number"
                    name="quantity"
                    value={row.quantity}
                    onChange={(e) =>
                      handleChange(index, "quantity", e.target.value)
                    }
                    className="w-full p-1 border rounded"
                  />
                </td>
                <td className="border p-2">
                  <input
                    type="number"
                    value={row.rate}
                    className="w-full p-1 border rounded"
                    readOnly
                  />
                </td>
                <td className="border p-2">
                  <input
                    type="number"
                    value={row.gst}
                    className="w-full p-1 border rounded"
                    readOnly
                  />
                </td>
                <td className="border p-2 text-center">
                  {gstAmount.toFixed(2)}
                </td>
                <td className="border p-2 text-center">{total.toFixed(2)}</td>
                <td className="border p-2 text-center">
                  {totalAmount.toFixed(2)}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {onSubmit && (
        <div className="text-right">
          <button
            onClick={onSubmit}
            className="mt-4 bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
          >
            Submit
          </button>
        </div>
      )}
    </div>
  );
};

export default Salescalculation;
