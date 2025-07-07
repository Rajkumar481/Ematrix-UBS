// src/components/AddProduct.jsx
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const AddProduct = ({ setActiveComponent }) => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [buyers, setBuyers] = useState([]);
  const [companyData, setCompanyData] = useState({
    companyName: "",
    email: "",
    phone: "",
    address: "",
    purchaseId: "",
  });

  const [formDetails, setFormDetails] = useState({
    invoiceNo: "",
    billingDate: "",
    deliveryDate: "",
    vehicleNo: "",
    driverPhoneNo: "",
    purchaseOrderId: "",
  });

  const [productRows, setProductRows] = useState([
    {
      productName: "",
      hsnCode: "",
      quantity: "",
      purchasePrice: "",
      sellingPrice: "",
      gst: "",
    },
  ]);

  useEffect(() => {
    axios
      .get("http://localhost:3000/company")
      .then((res) => setBuyers(res.data))
      .catch((err) => console.error("Failed to fetch buyers", err));
  }, []);

  useEffect(() => {
    // Set billing date to today by default in create mode
    if (!id && buyers.length > 0) {
      const today = new Date().toISOString().split("T")[0];
      setFormDetails((prev) => ({
        ...prev,
        billingDate: today,
      }));
    }

    if (!id || buyers.length === 0) return;

    axios
      .get(`http://localhost:3000/purchase/${id}`)
      .then((res) => {
        const data = res.data;
        const company = buyers.find((b) => b._id === data.purchaseId);

        setCompanyData({
          companyName: company?.companyName || "",
          email: company?.email || "",
          phone: company?.phone || "",
          address: company?.address || "",
          purchaseId: data.purchaseId || "",
        });

        setFormDetails({
          invoiceNo: data.invoiceNo || "",
          billingDate: data.billingDate?.substring(0, 10) || "",
          deliveryDate: data.deliveryDate?.substring(0, 10) || "",
          vehicleNo: data.vehicleNo || "",
          driverPhoneNo: data.driverPhoneNo || "",
          purchaseOrderId: data.purchaseOrderId || "",
        });

        setProductRows([
          {
            productName: data.productName || "",
            hsnCode: data.hsnCode || "",
            quantity: data.quantity || "",
            purchasePrice: data.purchasePrice || "",
            sellingPrice: data.sellingPrice || "",
            gst: data.gst || "",
          },
        ]);
      })
      .catch((err) => console.error("Failed to fetch product", err));
  }, [id, buyers]);

  const handleCompanyChange = (e) => {
    const name = e.target.value;
    setCompanyData((prev) => ({ ...prev, companyName: name }));

    const matched = buyers.find(
      (b) => b.companyName.toLowerCase() === name.toLowerCase()
    );
    if (matched) {
      setCompanyData((prev) => ({
        ...prev,
        companyName: matched.companyName,
        email: matched.email,
        phone: matched.phone,
        address: matched.address,
        purchaseId: matched._id,
      }));
    } else {
      setCompanyData((prev) => ({
        ...prev,
        email: "",
        phone: "",
        address: "",
        purchaseId: "",
      }));
    }
  };

  const handleRowChange = (index, e) => {
    const { name, value } = e.target;
    const updatedRows = [...productRows];
    updatedRows[index][name] = value;
    setProductRows(updatedRows);
  };

  const addRow = () => {
    const lastRow = productRows[productRows.length - 1];
    const allFilled = Object.values(lastRow).every(
      (val) => val.toString().trim() !== ""
    );

    if (!allFilled) {
      alert("Please fill all fields before adding a new row.");
      return;
    }

    setProductRows([
      ...productRows,
      {
        productName: "",
        hsnCode: "",
        quantity: "",
        purchasePrice: "",
        sellingPrice: "",
        gst: "",
      },
    ]);
  };

  const calculate = (row) => {
    const qty = parseFloat(row.quantity) || 0;
    const pp = parseFloat(row.purchasePrice) || 0;
    const sp = parseFloat(row.sellingPrice) || 0;
    const gst = parseFloat(row.gst) || 0;

    const total = qty * pp;
    const gstAmount = (total * gst) / 100;
    const totalAmount = total + gstAmount;
    const profit = (sp - pp) * qty;

    return { total, gstAmount, totalAmount, profit };
  };

  const handleSubmit = async () => {
    try {
      for (const product of productRows) {
        const { gstAmount, total, totalAmount, profit } = calculate(product);

        const payload = {
          purchaseId: companyData.purchaseId,

          invoiceNo: formDetails.invoiceNo,
          productName: product.productName,
          despatchedThrough: "lorry",
          billingDate: new String(formDetails.billingDate),
          deliveryDate: new String(formDetails.deliveryDate),

          vehicleNo: String(formDetails.vehicleNo),
          driverPhoneNo: String(formDetails.driverPhoneNo),
          purchaseOrderId: String(formDetails.purchaseOrderId),

          hsnCode: String(product.hsnCode),
          quantity: String(product.quantity),
          purchasePrice: String(product.purchasePrice),
          sellingPrice: String(product.sellingPrice),
          gst: String(product.gst),

          total,
          gstAmount,
          totalAmount,
          profit,
        };

        console.log("Sending payload:", payload);

        if (id) {
          await axios.patch(`http://localhost:3000/purchase/${id}`, payload);
        } else {
          await axios.post("http://localhost:3000/purchase", payload);
        }
      }

      alert(
        id
          ? "Product updated successfully!"
          : "Products submitted successfully!"
      );
      if (setActiveComponent) setActiveComponent("product");
      navigate("/");
    } catch (error) {
      console.error("Error submitting products:", error);
      toast.error("Failed to submit products");
    }
  };

  const today = new Date().toISOString().split("T")[0];
  const tomorrow = new Date(Date.now() + 86400000).toISOString().split("T")[0];

  return (
    <div className="bg-white p-6 rounded shadow-lg max-w-5xl mx-auto mt-6">
      <h2 className="text-2xl font-bold mb-6">
        {id ? "Edit Product" : "Add Product"}
      </h2>
      <form className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-5">
          <div>
            <label className="block text-sm font-medium">Company Name</label>
            <input
              required
              type="text"
              value={companyData.companyName}
              onChange={handleCompanyChange}
              className="w-full px-2 py-1 border rounded text-sm"
              placeholder="Enter or select company name"
              list="company-list"
            />
            <datalist id="company-list">
              {buyers.map((b) => (
                <option key={b._id} value={b.companyName} />
              ))}
            </datalist>
          </div>
          <div>
            <label className="block text-sm font-medium">Email</label>
            <input
              required
              type="email"
              value={companyData.email}
              onChange={(e) =>
                setCompanyData((prev) => ({ ...prev, email: e.target.value }))
              }
              className="w-full px-2 py-1 border rounded text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Phone</label>
            <input
              required
              type="tel"
              value={companyData.phone}
              onChange={(e) =>
                setCompanyData((prev) => ({ ...prev, phone: e.target.value }))
              }
              className="w-full px-2 py-1 border rounded text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Address</label>
            <input
              required
              value={companyData.address}
              onChange={(e) =>
                setCompanyData((prev) => ({ ...prev, address: e.target.value }))
              }
              className="w-full px-2 py-1 border rounded text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Invoice No</label>
            <input
              required
              className="w-full px-2 py-1 border rounded text-sm"
              value={formDetails.invoiceNo}
              onChange={(e) =>
                setFormDetails((prev) => ({
                  ...prev,
                  invoiceNo: e.target.value,
                }))
              }
            />
          </div>
        </div>

        <div className="space-y-5">
          {[
            "Billing Date",
            "Delivery Date",
            "Vehicle No",
            "Driver No",
            "Purchase ID",
          ].map((label, i) => (
            <div key={i}>
              <label className="block text-sm font-medium">{label}</label>
              <input
                required
                type={label.includes("Date") ? "date" : "text"}
                min={
                  label === "Billing Date"
                    ? today
                    : label === "Delivery Date"
                    ? tomorrow
                    : undefined
                }
                className="w-full px-2 py-1 border rounded text-sm"
                value={
                  formDetails[
                    label === "Billing Date"
                      ? "billingDate"
                      : label === "Delivery Date"
                      ? "deliveryDate"
                      : label === "Vehicle No"
                      ? "vehicleNo"
                      : label === "Driver No"
                      ? "driverPhoneNo"
                      : "purchaseOrderId"
                  ]
                }
                onChange={(e) => {
                  const field =
                    label === "Billing Date"
                      ? "billingDate"
                      : label === "Delivery Date"
                      ? "deliveryDate"
                      : label === "Vehicle No"
                      ? "vehicleNo"
                      : label === "Driver No"
                      ? "driverPhoneNo"
                      : "purchaseOrderId";
                  setFormDetails((prev) => ({
                    ...prev,
                    [field]: e.target.value,
                  }));
                }}
              />
            </div>
          ))}
        </div>
      </form>

      <table className="w-full border-collapse mt-6 text-sm table-fixed">
        <thead>
          <tr className="bg-gray-100">
            {[
              "S.No",
              "Product Name",
              "HSN",
              "Quantity",
              "Purchase Price",
              "Selling Price",
              "GST (%)",
              "GST Amount",
              "Total",
              "Total Amount",
              "Profit",
            ].map((h, i) => (
              <th key={i} className="border px-2 py-1">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {productRows.map((row, index) => {
            const { gstAmount, total, totalAmount, profit } = calculate(row);
            return (
              <tr key={index}>
                <td className="border px-2 py-1 text-center">{index + 1}</td>
                {[
                  "productName",
                  "hsnCode",
                  "quantity",
                  "purchasePrice",
                  "sellingPrice",
                  "gst",
                ].map((field, i) => (
                  <td key={i} className="border px-2 py-1">
                    <input
                      required
                      name={field}
                      value={row[field]}
                      onChange={(e) => handleRowChange(index, e)}
                      onKeyDown={(e) => {
                        if (
                          e.key === "Enter" &&
                          index === productRows.length - 1
                        ) {
                          addRow();
                        }
                      }}
                      className="w-full px-1 py-0.5"
                    />
                  </td>
                ))}
                <td className="border px-2 py-1 text-center">{gstAmount}</td>
                <td className="border px-2 py-1 text-center">{total}</td>
                <td className="border px-2 py-1 text-center">{totalAmount}</td>
                <td className="border px-2 py-1 text-center">{profit}</td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <div className="flex justify-end mt-12 gap-3">
        <button
          onClick={() => navigate(-1)}
          className="px-6 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
        >
          Back
        </button>
        <button
          onClick={handleSubmit}
          className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          Submit
        </button>
      </div>
    </div>
  );
};

export default AddProduct;
