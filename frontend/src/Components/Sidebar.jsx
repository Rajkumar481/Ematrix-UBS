import React from "react";

const Sidebar = ({ setActiveComponent }) => {
  const buttons = [
    { label: "Sales Form", value: "sales" },
    { label: "Sales List", value: "sales-list" },
    { label: "Stock Overview", value: "stock" },
    { label: "Stock Management ", value: "stack-management" },
    { label: "Product Details", value: "product" },
    { label: "User Details", value: "user" },
    { label: "Buyer Details", value: "buyer" },
    { label: "Profit ", value: "profit" },
  ];

  return (
    <aside className="w-64 bg-gray-800 text-white p-4 space-y-4">
      <h2 className="text-2xl font-bold mb-6 text-center">UBS</h2>
      {buttons.map(({ label, value }) => (
        <button
          key={value}
          className="w-full text-left p-2 rounded hover:bg-gray-700 transition"
          onClick={() => setActiveComponent(value)}
        >
          {label}
        </button>
      ))}
    </aside>
  );
};

export default Sidebar;
