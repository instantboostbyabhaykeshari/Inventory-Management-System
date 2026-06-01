import { useEffect, useState } from "react";
import api from "../services/api";
import Loader from "../components/Loader";

function Customers() {

  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [listLoading, setListLoading] = useState(false);

  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    phone: ""
  });

  const fetchCustomers = async (isRefresh = false) => {

    if (isRefresh) {
      setListLoading(true);
    } else {
      setLoading(true);
    }

    try {

      const response = await api.get("/customers/");

      setCustomers(response.data);

    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
      setListLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
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

      await api.post("/customers/", formData);

      setFormData({
        full_name: "",
        email: "",
        phone: ""
      });

      fetchCustomers(true);

    } catch (error) {
      alert(error.response.data.detail);
    }
  };

  const deleteCustomer = async (id) => {

    try {

      await api.delete(`/customers/${id}`);

      fetchCustomers(true);

    } catch (error) {
      console.log(error);
    }
  };

  if (loading) {
    return (
      <Loader
        fullPage
        message="Loading customers from database..."
      />
    );
  }

  return (
    <div className="page-shell">
      <header>
        <h1 className="page-title">Customers</h1>
        <p className="page-subtitle">Manage customer records for orders</p>
      </header>

      <section className="panel">
        <div className="panel-header">
          <h2 className="panel-title">Add customer</h2>
        </div>
        <div className="panel-body">
          <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div>
              <label className="field-label" htmlFor="full_name">Full name</label>
              <input
                id="full_name"
                className="input"
                type="text"
                name="full_name"
                placeholder="Jane Doe"
                value={formData.full_name}
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="field-label" htmlFor="email">Email</label>
              <input
                id="email"
                className="input"
                type="email"
                name="email"
                placeholder="jane@example.com"
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="field-label" htmlFor="phone">Phone</label>
              <input
                id="phone"
                className="input"
                type="text"
                name="phone"
                placeholder="+91 98765 43210"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>

            <div className="sm:col-span-2 lg:col-span-3">
              <button type="submit" className="btn-primary">
                Add customer
              </button>
            </div>
          </form>
        </div>
      </section>

      <section className="panel">
        <div className="panel-header">
          <h2 className="panel-title">Customer list</h2>
          <p className="text-xs text-zinc-500 mt-0.5">{customers.length} total</p>
        </div>
        <div className="panel-body p-0">
          {listLoading ? (
            <Loader message="Refreshing customer list..." />
          ) : customers.length === 0 ? (
            <p className="empty-state">No customers yet. Add one using the form above.</p>
          ) : (
            <>
              <ul className="list-mobile">
                {customers.map((customer) => (
                  <li key={customer.id} className="mobile-list-item">
                    <div className="mobile-list-row">
                      <p className="font-medium text-white break-words pr-2">{customer.full_name}</p>
                      <button
                        type="button"
                        className="btn-danger shrink-0"
                        onClick={() => deleteCustomer(customer.id)}
                      >
                        Delete
                      </button>
                    </div>
                    <dl className="space-y-2 text-sm">
                      <div>
                        <dt className="mobile-list-label">Email</dt>
                        <dd className="mobile-list-value break-all">{customer.email}</dd>
                      </div>
                      <div>
                        <dt className="mobile-list-label">Phone</dt>
                        <dd className="mobile-list-value">{customer.phone}</dd>
                      </div>
                    </dl>
                  </li>
                ))}
              </ul>
              <div className="table-desktop">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Phone</th>
                      <th className="text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {customers.map((customer) => (
                      <tr key={customer.id}>
                        <td className="font-medium text-white">{customer.full_name}</td>
                        <td>{customer.email}</td>
                        <td className="text-zinc-400">{customer.phone}</td>
                        <td className="text-right">
                          <button
                            type="button"
                            className="btn-danger"
                            onClick={() => deleteCustomer(customer.id)}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      </section>
    </div>
  );
}

export default Customers;
