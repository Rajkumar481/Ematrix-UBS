import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Salescalculation = ({ onChange, onSubmit }) => {
  const [productList, setProductList] = useState([]);
  const [productRow, setProductRow] = useState({
    productName: '',
    hsn: '',
    rate: '',
    gst: '',
    quantity: '',
    purchaseId: ''
  });

  useEffect(() => {
    axios
      .get('http://localhost:3000/purchase')
      .then((res) => setProductList(res.data))
      .catch((err) => console.error('Error loading products:', err));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'productName') {
      const trimmedValue = value.trim().toLowerCase();

      const selected = productList.find(
        (p) => p.productName.trim().toLowerCase() === trimmedValue
      );

      if (selected) {
        const updated = {
          productName: selected.productName,
          hsn: selected.hsnCode,
          rate: selected.sellingPrice,
          gst: selected.gst,
          quantity: '',
          purchaseId: selected._id
        };
        setProductRow(updated);
        onChange({
          purchaseId: selected._id,
          productName: selected.productName,
          quantity: ''
        });
        return;
      } else {
        console.warn('No matching product found for:', value);
      }
    }

    const updatedRow = { ...productRow, [name]: value };
    setProductRow(updatedRow);

    if (name === 'quantity') {
      onChange({
        purchaseId: productRow.purchaseId,
        productName: productRow.productName,
        quantity: value
      });
    }
  };

  const gstAmount = (productRow.rate * productRow.quantity * productRow.gst) / 100 || 0;
  const total = productRow.rate * productRow.quantity || 0;
  const totalAmount = total + gstAmount;
  const profit = (totalAmount * 0.1).toFixed(2);

  return (
    <div className="mt-10 space-y-4 bg-white shadow p-6 rounded">
      <table className="w-full border-collapse">
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
            <th className="border p-2">Profit</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="border p-2 text-center">1</td>
            <td className="border p-2">
              <input
                list="products"
                name="productName"
                value={productRow.productName}
                onChange={handleChange}
                className="w-full p-1 border rounded"
              />
              <datalist id="products">
                {productList.map((product, index) => (
                  <option key={index} value={product.productName} />
                ))}
              </datalist>
            </td>
            <td className="border p-2">
              <input
                type="text"
                name="hsn"
                value={productRow.hsn}
                className="w-full p-1 border rounded"
                readOnly
              />
            </td>
            <td className="border p-2">
              <input
                type="number"
                name="quantity"
                value={productRow.quantity}
                onChange={handleChange}
                className="w-full p-1 border rounded"
              />
            </td>
            <td className="border p-2">
              <input
                type="number"
                name="rate"
                value={productRow.rate}
                className="w-full p-1 border rounded"
                readOnly
              />
            </td>
            <td className="border p-2">
              <input
                type="number"
                name="gst"
                value={productRow.gst}
                className="w-full p-1 border rounded"
                readOnly
              />
            </td>
            <td className="border p-2 text-center">{gstAmount.toFixed(2)}</td>
            <td className="border p-2 text-center">{total.toFixed(2)}</td>
            <td className="border p-2 text-center">{totalAmount.toFixed(2)}</td>
            <td className="border p-2 text-center">{profit}</td>
          </tr>
        </tbody>
      </table>

      {/* Submit Button below the table */}
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
