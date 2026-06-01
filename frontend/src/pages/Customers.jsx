import { useEffect, useState } from "react";
import api from "../services/api";

function Customers() {

  const [customers, setCustomers] = useState([]);

  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    phone: ""
  });

  const fetchCustomers = async () => {

    try {

      const response = await api.get("/customers/");

      setCustomers(response.data);

    } catch (error) {
      console.log(error);
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

      fetchCustomers();

    } catch (error) {
      alert(error.response.data.detail);
    }
  };

  const deleteCustomer = async (id) => {

    try {

      await api.delete(`/customers/${id}`);

      fetchCustomers();

    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>

      <h2>Customers</h2>

      <form onSubmit={handleSubmit}>

        <input
          type="text"
          name="full_name"
          placeholder="Full Name"
          value={formData.full_name}
          onChange={handleChange}
        />

        <br /><br />

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
        />

        <br /><br />

        <input
          type="text"
          name="phone"
          placeholder="Phone"
          value={formData.phone}
          onChange={handleChange}
        />

        <br /><br />

        <button type="submit">
          Add Customer
        </button>

      </form>

      <hr />

      <h3>Customer List</h3>

      {
        customers.map((customer) => (

          <div
            key={customer.id}
            style={{
              border: "1px solid gray",
              padding: "10px",
              marginBottom: "10px"
            }}
          >

            <p>Name: {customer.full_name}</p>
            <p>Email: {customer.email}</p>
            <p>Phone: {customer.phone}</p>

            <button onClick={() => deleteCustomer(customer.id)}>
              Delete
            </button>

          </div>
        ))
      }

    </div>
  );
}

export default Customers;