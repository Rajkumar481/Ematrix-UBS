import React, { useState } from 'react';
import axios from 'axios';
import Salescalculation from './Salescalculation';

const SalesForm = () => {
  // List of known users
  const userList = [
    {
      username: 'joyel',
      email: 'joyel@gmail.com',
      phone: '8848347848',
      address: 'kadhathur',
    },
    {
      username: 'kamal',
      email: 'kamalakannan@gmail.com',
      phone: '8737438797',
      address: 'gugai',
    },
    {
      username: 'karan',
      email: 'karan@gmail.com',
      phone: '8948397595',
      address: '5roads',
    },
  ];

  const [userForm, setUserForm] = useState({
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

  const handleUserChange = (e) => {
    const { name, value } = e.target;

    if (name === 'username') {
      const selectedUser = userList.find(user => user.username === value);
      if (selectedUser) {
        setUserForm({
          username: selectedUser.username,
          email: selectedUser.email,
          phone: selectedUser.phone,
          address: selectedUser.address
        });
        return;
      }
    }

    setUserForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleOrderChange = (e) => {
    setOrderForm(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleOrderSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...orderForm,
        ...userForm
      };
      const res = await axios.post('/api/order-details', payload);
      console.log('Order details submitted:', res.data);
      alert('Order details submitted!');
    } catch (error) {
      console.error('Error:', error.response?.data || error.message);
      alert('Failed to submit order details');
    }
  };

  return (
    <div className="max-w-5xl mx-auto mt-10 grid grid-cols-1 md:grid-cols-2 gap-10">
      
      {/* User Details Form */}
      <form className="bg-white p-6 rounded-lg shadow-md space-y-4">
        <h2 className="text-xl font-semibold mb-4">User Details</h2>
        
        <div>
          <label className="block mb-1">Username:</label>
          <input
            list="usernames"
            name="username"
            value={userForm.username}
            onChange={handleUserChange}
            className="w-full border p-2 rounded-md"
          />
          <datalist id="usernames">
            {userList.map((user, index) => (
              <option key={index} value={user.username} />
            ))}
          </datalist>
        </div>
        
        <div>
          <label className="block mb-1">Email:</label>
          <input
            type="email"
            name="email"
            value={userForm.email}
            onChange={handleUserChange}
            className="w-full border p-2 rounded-md"
          />
        </div>
        
        <div>
          <label className="block mb-1">Phone Number:</label>
          <input
            type="tel"
            name="phone"
            value={userForm.phone}
            onChange={handleUserChange}
            className="w-full border p-2 rounded-md"
          />
        </div>
        
        <div>
          <label className="block mb-1">Address:</label>
          <input
            type="text"
            name="address"
            value={userForm.address}
            onChange={handleUserChange}
            className="w-full border p-2 rounded-md"
          />
        </div>
      </form>

      {/* Order Details Form */}
      <form
        onSubmit={handleOrderSubmit}
        className="bg-white p-6 rounded-lg shadow-md space-y-4"
      >
        <h2 className="text-xl font-semibold mb-4">Order Details</h2>
        
        <div>
          <label className="block mb-1">Order ID:</label>
          <input
            type="text"
            name="orderId"
            value={orderForm.orderId}
            onChange={handleOrderChange}
            required
            className="w-full border p-2 rounded-md"
          />
        </div>
        
        <div>
          <label className="block mb-1">Billing Date:</label>
          <input
            type="date"
            name="billingDate"
            value={orderForm.billingDate}
            onChange={handleOrderChange}
            required
            className="w-full border p-2 rounded-md"
          />
        </div>
        
        <div>
          <label className="block mb-1">Due Date:</label>
          <input
            type="date"
            name="dueDate"
            value={orderForm.dueDate}
            onChange={handleOrderChange}
            required
            className="w-full border p-2 rounded-md"
          />
        </div>

        <div>
          <label className="block mb-1">Mode of Payment:</label>
          <select
            name="modeOfPayment"
            value={orderForm.modeOfPayment}
            onChange={handleOrderChange}
            className="w-full border p-2 rounded-md"
          >
            <option value="Cash">Cash</option>
            <option value="Credit">Credit</option>
          </select>
        </div>

        <button
          type="submit"
          className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700 transition"
        >
          Submit Order Details
        </button>
      </form>
      <Salescalculation></Salescalculation>
    </div>
  );
};

export default SalesForm;
