import { useEffect, useState } from "react";
import api from "../services/api";

function Orders() {

  const [orders, setOrders] = useState([]);

  const [customers, setCustomers] = useState([]);

  const [products, setProducts] = useState([]);

  const [formData, setFormData] = useState({
    customer_id: "",
    product_id: "",
    quantity: ""
  });

  const fetchOrders = async () => {

    try {

      const response = await api.get("/orders/");

      setOrders(response.data);

    } catch (error) {
      console.log(error);
    }
  };

  const fetchCustomers = async () => {

    try {

      const response = await api.get("/customers/");

      setCustomers(response.data);

    } catch (error) {
      console.log(error);
    }
  };

  const fetchProducts = async () => {

    try {

      const response = await api.get("/products/");

      setProducts(response.data);

    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {

    fetchOrders();
    fetchCustomers();
    fetchProducts();

  }, []);

  const handleChange = (e) => {

    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      await api.post("/orders/", {
        customer_id: Number(formData.customer_id),
        items: [
          {
            product_id: Number(formData.product_id),
            quantity: Number(formData.quantity)
          }
        ]
      });

      setFormData({
        customer_id: "",
        product_id: "",
        quantity: ""
      });

      fetchOrders();
      fetchProducts();

      alert("Order created successfully");

    } catch (error) {

      alert(error.response.data.detail);
    }
  };

  const deleteOrder = async (id) => {

    try {

      await api.delete(`/orders/${id}`);

      fetchOrders();

    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>

      <h2>Orders</h2>

      <form onSubmit={handleSubmit}>

        <select
          name="customer_id"
          value={formData.customer_id}
          onChange={handleChange}
        >

          <option value="">
            Select Customer
          </option>

          {
            customers.map((customer) => (
              <option
                key={customer.id}
                value={customer.id}
              >
                {customer.full_name}
              </option>
            ))
          }

        </select>

        <br /><br />

        <select
          name="product_id"
          value={formData.product_id}
          onChange={handleChange}
        >

          <option value="">
            Select Product
          </option>

          {
            products.map((product) => (
              <option
                key={product.id}
                value={product.id}
              >
                {product.name}
              </option>
            ))
          }

        </select>

        <br /><br />

        <input
          type="number"
          name="quantity"
          placeholder="Quantity"
          value={formData.quantity}
          onChange={handleChange}
        />

        <br /><br />

        <button type="submit">
          Create Order
        </button>

      </form>

      <hr />

      <h3>Order List</h3>

      {
        orders.map((order) => (

          <div
            key={order.id}
            style={{
              border: "1px solid gray",
              padding: "10px",
              marginBottom: "10px"
            }}
          >

            <p>Order ID: {order.id}</p>

            <p>Customer ID: {order.customer_id}</p>

            <p>Total Amount: ₹{order.total_amount}</p>

            <p>Items:</p>

            <ul>

              {
                order.items.map((item, index) => (
                  <li key={index}>
                    Product ID: {item.product_id}
                    {" | "}
                    Quantity: {item.quantity}
                  </li>
                ))
              }

            </ul>

            <button onClick={() => deleteOrder(order.id)}>
              Delete Order
            </button>

          </div>
        ))
      }

    </div>
  );
}

export default Orders;