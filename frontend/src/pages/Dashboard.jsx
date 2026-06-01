import { useEffect, useState } from "react";
import api from "../services/api";

function Dashboard() {

  const [stats, setStats] = useState({
    totalProducts: 0,
    totalCustomers: 0,
    totalOrders: 0,
    lowStockProducts: []
  });

  useEffect(() => {

    fetchDashboardData();

  }, []);

  const fetchDashboardData = async () => {

    try {

      const productsResponse = await api.get("/products/");
      const customersResponse = await api.get("/customers/");
      const ordersResponse = await api.get("/orders/");

      const lowStock = productsResponse.data.filter(
        (product) => product.quantity < 5
      );

      setStats({
        totalProducts: productsResponse.data.length,
        totalCustomers: customersResponse.data.length,
        totalOrders: ordersResponse.data.length,
        lowStockProducts: lowStock
      });

    } catch (error) {

      console.log(error);
    }
  };

  return (
    <div>

      <h2>Dashboard</h2>

      <div
        style={{
          display: "flex",
          gap: "20px",
          flexWrap: "wrap"
        }}
      >

        <div style={cardStyle}>
          <h3>Total Products</h3>
          <p>{stats.totalProducts}</p>
        </div>

        <div style={cardStyle}>
          <h3>Total Customers</h3>
          <p>{stats.totalCustomers}</p>
        </div>

        <div style={cardStyle}>
          <h3>Total Orders</h3>
          <p>{stats.totalOrders}</p>
        </div>

      </div>

      <hr />

      <h3>Low Stock Products</h3>

      {
        stats.lowStockProducts.length === 0
        ? (
          <p>No low stock products</p>
        )
        : (
          stats.lowStockProducts.map((product) => (

            <div
              key={product.id}
              style={{
                border: "1px solid red",
                padding: "10px",
                marginBottom: "10px"
              }}
            >

              <p>{product.name}</p>

              <p>Remaining Quantity: {product.quantity}</p>

            </div>
          ))
        )
      }

    </div>
  );
}

const cardStyle = {
  border: "1px solid gray",
  padding: "20px",
  minWidth: "200px"
};

export default Dashboard;