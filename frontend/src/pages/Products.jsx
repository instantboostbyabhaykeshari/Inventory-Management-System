import { useEffect, useState } from "react";
import api from "../services/api";

function Products() {

  const [products, setProducts] = useState([]);

  const [formData, setFormData] = useState({
    name: "",
    sku: "",
    price: "",
    quantity: ""
  });

  const fetchProducts = async () => {
    try {
      const response = await api.get("/products/");
      setProducts(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
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

      await api.post("/products/", {
        ...formData,
        price: Number(formData.price),
        quantity: Number(formData.quantity)
      });

      setFormData({
        name: "",
        sku: "",
        price: "",
        quantity: ""
      });

      fetchProducts();

    } catch (error) {
      alert(error.response.data.detail);
    }
  };

  const deleteProduct = async (id) => {

    try {
      await api.delete(`/products/${id}`);
      fetchProducts();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>

      <h2>Products</h2>

      <form onSubmit={handleSubmit}>

        <input
          type="text"
          name="name"
          placeholder="Product Name"
          value={formData.name}
          onChange={handleChange}
        />

        <br /><br />

        <input
          type="text"
          name="sku"
          placeholder="SKU"
          value={formData.sku}
          onChange={handleChange}
        />

        <br /><br />

        <input
          type="number"
          name="price"
          placeholder="Price"
          value={formData.price}
          onChange={handleChange}
        />

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
          Add Product
        </button>

      </form>

      <hr />

      <h3>Product List</h3>

      {
        products.map((product) => (
          <div
            key={product.id}
            style={{
              border: "1px solid gray",
              padding: "10px",
              marginBottom: "10px"
            }}
          >

            <p>Name: {product.name}</p>
            <p>SKU: {product.sku}</p>
            <p>Price: ₹{product.price}</p>
            <p>Quantity: {product.quantity}</p>

            <button onClick={() => deleteProduct(product.id)}>
              Delete
            </button>

          </div>
        ))
      }

    </div>
  );
}

export default Products;