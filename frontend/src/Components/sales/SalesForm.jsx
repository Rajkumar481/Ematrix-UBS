import React, { useEffect, useState } from "react";
import axios from "axios";
import Salescalculation from "./Salescalculation";
import { toast } from "react-toastify";

const SalesForm = () => {
  const [userList, setUserList] = useState([]);
  const today = new Date().toISOString().split("T")[0];
  const tomorrow = new Date(Date.now() + 86400000).toISOString().split("T")[0];

  const [userForm, setUserForm] = useState({
    userId: "",
    username: "",
    email: "",
    phone: "",
    address: "",
  });

  const [orderForm, setOrderForm] = useState({
    orderId: "",
    billingDate: today,
    dueDate: "",
    modeOfPayment: "Credit",
  });

  const [productData, setProductData] = useState([]);
  const [resetFlag, setResetFlag] = useState(false);

  useEffect(() => {
    axios
      .get("http://localhost:3000/user")
      .then((res) => setUserList(res.data))
      .catch((err) => console.error("Failed to load users", err));
  }, []);

  const handleUserChange = (e) => {
    const { name, value } = e.target;
    if (name === "username") {
      const selected = userList.find((u) => u.userName === value);
      if (selected) {
        return setUserForm({
          userId: selected._id,
          username: selected.userName,
          email: selected.email,
          phone: selected.phone,
          address: selected.address,
        });
      }
    }
    setUserForm((f) => ({ ...f, [name]: value }));
  };

  const handleOrderChange = (e) => {
    setOrderForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!userForm.userId || productData.length === 0) {
      toast.error("Please complete all required fields (user & products)");
      return;
    }

    const payload = productData.map((prod) => ({
      userId: userForm.userId,
      purchaseId: prod.purchaseId,
      productName: prod.productName,
      quantity: Number(prod.quantity),
      orderId: orderForm.orderId,
      billingDate: orderForm.billingDate,
      dueDate: orderForm.dueDate,
      modeOfPayment: orderForm.modeOfPayment,
    }));

    console.log("Submitting payload:", payload);

    try {
      await axios.post("http://localhost:3000/sales/", payload);
      toast.success("Sales submitted!");

      setUserForm({
        userId: "",
        username: "",
        email: "",
        phone: "",
        address: "",
      });
      setOrderForm({
        orderId: "",
        billingDate: today,
        dueDate: "",
        modeOfPayment: "Credit",
      });
      setProductData([]);
      setResetFlag(true);
      setTimeout(() => setResetFlag(false), 100);
    } catch (err) {
      console.error(err);
      toast.error("Failed to submit sales", { msg: err });
    }
  };

  return (
    <div className="max-w-7xl mx-auto mt-10 px-4 space-y-10">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* User Form */}
        <form className="bg-white p-6 rounded shadow space-y-4">
          <h2 className="text-xl font-bold" style={{ fontSize: "30px" }}>
            User Details
          </h2>

          <label>Username:</label>
          <input
            list="usernames"
            name="username"
            value={userForm.username}
            onChange={handleUserChange}
            className="w-full border p-2 rounded-md"
          />
          <datalist id="usernames">
            {userList.map((u) => (
              <option key={u._id} value={u.userName} />
            ))}
          </datalist>

          <label>Email:</label>
          <input
            name="email"
            value={userForm.email}
            onChange={handleUserChange}
            className="w-full border p-2 rounded-md"
          />

          <label>Phone:</label>
          <input
            name="phone"
            value={userForm.phone}
            onChange={handleUserChange}
            className="w-full border p-2 rounded-md"
          />

          <label>Address:</label>
          <input
            name="address"
            value={userForm.address}
            onChange={handleUserChange}
            className="w-full border p-2 rounded-md"
          />
        </form>

        {/* Order Form */}
        <form
          onSubmit={handleSubmit}
          className="bg-white p-6 rounded shadow space-y-4"
        >
          <h2 className="text-xl  font-semibold" style={{ fontSize: "30px" }}>
            Order Details
          </h2>

          <label>Order ID:</label>
          <input
            name="orderId"
            value={orderForm.orderId}
            onChange={handleOrderChange}
            className="w-full border p-2 rounded-md"
            required
          />

          <label>Billing Date:</label>
          <input
            type="date"
            name="billingDate"
            value={orderForm.billingDate}
            onChange={handleOrderChange}
            className="w-full border p-2 rounded-md"
            required
            max={today}
          />

          <label>Due Date:</label>
          <input
            type="date"
            name="dueDate"
            value={orderForm.dueDate}
            onChange={handleOrderChange}
            className="w-full border p-2 rounded-md"
            required
            min={tomorrow}
          />

          <label>Mode of Payment:</label>
          <select
            name="modeOfPayment"
            value={orderForm.modeOfPayment}
            onChange={handleOrderChange}
            className="w-full border p-2 rounded-md"
            required
          >
            <option value="Credit">Credit</option>
            <option value="Cash">Cash</option>
          </select>
        </form>
      </div>

      <Salescalculation
        onChange={setProductData}
        onSubmit={handleSubmit}
        reset={resetFlag}
      />
    </div>
  );
};

export default SalesForm;
