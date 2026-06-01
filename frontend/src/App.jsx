import { BrowserRouter, Routes, Route, Link } from "react-router-dom";

import Dashboard from "./pages/Dashboard";
import Products from "./pages/Products";
import Customers from "./pages/Customers";
import Orders from "./pages/Orders";

function App() {
  return (
    <BrowserRouter>
      <div style={{ padding: "20px", fontFamily: "Arial" }}>

        <h1>Inventory Management System</h1>

        <nav style={{ marginBottom: "20px" }}>
          <Link to="/" style={{ marginRight: "15px" }}>Dashboard</Link>
          <Link to="/products" style={{ marginRight: "15px" }}>Products</Link>
          <Link to="/customers" style={{ marginRight: "15px" }}>Customers</Link>
          <Link to="/orders">Orders</Link>
        </nav>

        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/products" element={<Products />} />
          <Route path="/customers" element={<Customers />} />
          <Route path="/orders" element={<Orders />} />
        </Routes>

      </div>
    </BrowserRouter>
  );
}

export default App;