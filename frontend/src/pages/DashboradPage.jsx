import React, { useState } from "react";
import User from "../Components/User";
import Buyer from "../Components/Buyer";
import SidebarLayout from "../Components/Sidebar";
import Product from "../Components/Product";
import SalesForm from "../Components/sales/SalesForm";
import SalesList from "../Components/sales/SalesList";

const Dashboard = () => {
  const [activeComponent, setActiveComponent] = useState("");

  const renderComponent = () => {
    switch (activeComponent) {
      case "user":
        return <User />;
      case "buyer":
        return <Buyer />;
      case "product":
        return <Product />;
      case "sales":
        return <SalesForm />;
      case "sales-list":
        return <SalesList />;
      default:
        return (
          <div className="text-gray-500 text-lg h-full flex items-center justify-center">
            Select a section
          </div>
        );
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <SidebarLayout setActiveComponent={setActiveComponent} />
      <main className="flex-1 p-4 overflow-y-auto">{renderComponent()}</main>
    </div>
  );
};

export default Dashboard;
