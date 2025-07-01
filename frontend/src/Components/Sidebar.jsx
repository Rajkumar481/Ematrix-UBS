import React from "react";

const SidebarLayout = ({ setActiveComponent }) => {
  const buttons = [
    { label: "User Details", value: "user" },
    { label: "Buyer Details", value: "buyer" },
     { label: "Product Details", value: "product" },
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

export default SidebarLayout;
