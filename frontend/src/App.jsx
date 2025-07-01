import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Dashboard from './pages/DashboradPage';
import AddProduct from './pages/AddProduct'; 

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/add-product" element={<AddProduct />} /> 
      </Routes>
    </Router>
  );
}

export default App;
