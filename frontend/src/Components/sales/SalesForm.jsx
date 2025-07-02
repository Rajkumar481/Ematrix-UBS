import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Salescalculation from './Salescalculation';

const SalesForm = () => {
  const [userList, setUserList] = useState([]);
  const [productList, setProductList] = useState([]);

  const [userForm, setUserForm] = useState({
    userId: '',
    username: '',
    email: '',
    phone: '',
    address: ''
  });

  const [orderForm, setOrderForm] = useState({
    orderId: '',
    billingDate: '',
    dueDate: '',
    modeOfPayment: 'Cash'
  });

  const [productData, setProductData] = useState({
    purchaseId: '',
    productName: '',
    quantity: ''
  });

  useEffect(() => {
    axios.get('http://localhost:3000/user')
      .then(res => setUserList(res.data))
      .catch(err => console.error('Failed to load users', err));

    axios.get('http://localhost:3000/purchase')
      .then(res => setProductList(res.data))
      .catch(err => console.error('Failed to load products', err));
  }, []);

  const handleUserChange = e => {
    const { name, value } = e.target;
    if (name === 'username') {
      const selected = userList.find(u => u.userName === value);
      if (selected) {
        return setUserForm({
          userId: selected._id,
          username: selected.userName,
          email: selected.email,
          phone: selected.phone,
          address: selected.address
        });
      }
    }
    setUserForm(f => ({ ...f, [name]: value }));
  };

  const handleOrderChange = e => {
    setOrderForm(f => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      userId: userForm.userId,
      purchaseId: productData.purchaseId,
      productName: productData.productName,
      quantity: productData.quantity,
      orderId: orderForm.orderId,
      billingDate: orderForm.billingDate,
      dueDate: orderForm.dueDate,
      modeOfPayment: orderForm.modeOfPayment
    };

    try {
      const res = await axios.post('http://localhost:3000/sales', payload);
      console.log('Sales submission successful:', res.data);
      alert('Sales submitted!');
    } catch (err) {
      console.error('Submission error:', err.response?.data || err.message);
      alert('Sales submission failed');
    }
  };

  return (
    <div className="max-w-7xl mx-auto mt-10 px-4 space-y-10">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* User Form */}
        <form className="bg-white p-6 rounded shadow space-y-4">
          <h2 className="text-xl font-semibold">User Details</h2>

          <label>Username:</label>
          <input
            list="usernames"
            name="username"
            value={userForm.username}
            onChange={handleUserChange}
            className="w-full border p-2 rounded-md"
          />
          <datalist id="usernames">
            {userList.map(u => (
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
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow space-y-4">
          <h2 className="text-xl font-semibold">Order Details</h2>

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
          />

          <label>Due Date:</label>
          <input
            type="date"
            name="dueDate"
            value={orderForm.dueDate}
            onChange={handleOrderChange}
            className="w-full border p-2 rounded-md"
            required
          />

          <label>Mode of Payment:</label>
          <select
            name="modeOfPayment"
            value={orderForm.modeOfPayment}
            onChange={handleOrderChange}
            className="w-full border p-2 rounded-md"
          >
            <option value="Cash">Cash</option>
            <option value="Credit">Credit</option>
          </select>
        </form>
      </div>

      {/* Product Entry and Final Submit */}
      <Salescalculation onChange={setProductData} onSubmit={handleSubmit} />
    </div>
  );
};

export default SalesForm;
