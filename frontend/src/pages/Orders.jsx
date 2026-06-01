import { useEffect, useState } from "react";
import api from "../services/api";
import Loader from "../components/Loader";

function Orders() {

  const [orders, setOrders] = useState([]);

  const [customers, setCustomers] = useState([]);

  const [products, setProducts] = useState([]);

  const [loading, setLoading] = useState(true);
  const [listLoading, setListLoading] = useState(false);

  const [formData, setFormData] = useState({
    customer_id: "",
    product_id: "",
    quantity: ""
  });

  const fetchOrders = async (isRefresh = false) => {

    if (isRefresh) {
      setListLoading(true);
    }

    try {

      const response = await api.get("/orders/");

      setOrders(response.data);

    } catch (error) {
      console.log(error);
    } finally {
      if (isRefresh) {
        setListLoading(false);
      }
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

  const loadPageData = async () => {

    setLoading(true);

    try {
      await Promise.all([fetchOrders(), fetchCustomers(), fetchProducts()]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {

    loadPageData();

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

      await Promise.all([fetchOrders(true), fetchProducts()]);

      alert("Order created successfully");

    } catch (error) {

      alert(error.response.data.detail);
    }
  };

  const deleteOrder = async (id) => {

    try {

      await api.delete(`/orders/${id}`);

      fetchOrders(true);

    } catch (error) {
      console.log(error);
    }
  };

  if (loading) {
    return (
      <Loader
        fullPage
        message="Loading orders, customers & products..."
      />
    );
  }

  return (
    <div className="page-shell">
      <header>
        <h1 className="page-title">Orders</h1>
        <p className="page-subtitle">Create and track customer orders</p>
      </header>

      <section className="panel">
        <div className="panel-header">
          <h2 className="text-base font-semibold text-white">Create order</h2>
        </div>
        <div className="panel-body">
          <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div>
              <label className="field-label" htmlFor="customer_id">Customer</label>
              <select
                id="customer_id"
                className="select"
                name="customer_id"
                value={formData.customer_id}
                onChange={handleChange}
              >
                <option value="">Select customer</option>
                {customers.map((customer) => (
                  <option key={customer.id} value={customer.id}>
                    {customer.full_name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="field-label" htmlFor="product_id">Product</label>
              <select
                id="product_id"
                className="select"
                name="product_id"
                value={formData.product_id}
                onChange={handleChange}
              >
                <option value="">Select product</option>
                {products.map((product) => (
                  <option key={product.id} value={product.id}>
                    {product.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="field-label" htmlFor="quantity">Quantity</label>
              <input
                id="quantity"
                className="input"
                type="number"
                name="quantity"
                placeholder="1"
                value={formData.quantity}
                onChange={handleChange}
              />
            </div>

            <div className="sm:col-span-2 lg:col-span-3">
              <button type="submit" className="btn-primary">
                Create order
              </button>
            </div>
          </form>
        </div>
      </section>

      <section className="panel">
        <div className="panel-header">
          <h2 className="text-base font-semibold text-white">Order history</h2>
          <p className="text-xs text-zinc-500 mt-0.5">{orders.length} total</p>
        </div>
        <div className="panel-body">
          {listLoading ? (
            <Loader message="Refreshing order history..." />
          ) : orders.length === 0 ? (
            <p className="empty-state">No orders yet. Create one using the form above.</p>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <article
                  key={order.id}
                  className="rounded-xl border border-white/10 bg-white/[0.02] p-4 sm:p-5 transition hover:border-white/15"
                >
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-white">Order #{order.id}</p>
                      <p className="text-xs text-zinc-500 mt-0.5 break-words">
                        Customer ID {order.customer_id}
                      </p>
                    </div>
                    <div className="flex items-center justify-between gap-3 sm:flex-col sm:items-end sm:shrink-0">
                      <p className="text-lg font-semibold text-emerald-400 tabular-nums">
                        ₹{order.total_amount}
                      </p>
                      <button
                        type="button"
                        className="btn-danger sm:mt-1"
                        onClick={() => deleteOrder(order.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>

                  <ul className="mt-4 space-y-2 border-t border-white/10 pt-4">
                    {order.items.map((item, index) => (
                      <li
                        key={index}
                        className="flex flex-wrap justify-between gap-2 text-sm text-zinc-400"
                      >
                        <span className="break-words">Product ID {item.product_id}</span>
                        <span className="text-zinc-300 shrink-0">Qty {item.quantity}</span>
                      </li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

export default Orders;
