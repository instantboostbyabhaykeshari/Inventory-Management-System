import { useEffect, useState } from "react";
import api from "../services/api";
import Loader from "../components/Loader";

function Products() {

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [listLoading, setListLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    sku: "",
    price: "",
    quantity: ""
  });

  const fetchProducts = async (isRefresh = false) => {
    if (isRefresh) {
      setListLoading(true);
    } else {
      setLoading(true);
    }

    try {
      const response = await api.get("/products/");
      setProducts(response.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
      setListLoading(false);
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

      fetchProducts(true);

    } catch (error) {
      alert(error.response.data.detail);
    }
  };

  const deleteProduct = async (id) => {

    try {
      await api.delete(`/products/${id}`);
      fetchProducts(true);
    } catch (error) {
      console.log(error);
    }
  };

  if (loading) {
    return (
      <Loader
        fullPage
        message="Loading products from database..."
      />
    );
  }

  return (
    <div className="page-shell">
      <header>
        <h1 className="page-title">Products</h1>
        <p className="page-subtitle">Add items and manage stock levels</p>
      </header>

      <section className="panel">
        <div className="panel-header">
          <h2 className="panel-title">Add product</h2>
        </div>
        <div className="panel-body">
          <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <label className="field-label" htmlFor="name">Name</label>
              <input
                id="name"
                className="input"
                type="text"
                name="name"
                placeholder="Product name"
                value={formData.name}
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="field-label" htmlFor="sku">SKU</label>
              <input
                id="sku"
                className="input"
                type="text"
                name="sku"
                placeholder="SKU-001"
                value={formData.sku}
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="field-label" htmlFor="price">Price</label>
              <input
                id="price"
                className="input"
                type="number"
                name="price"
                placeholder="0"
                value={formData.price}
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="field-label" htmlFor="quantity">Quantity</label>
              <input
                id="quantity"
                className="input"
                type="number"
                name="quantity"
                placeholder="0"
                value={formData.quantity}
                onChange={handleChange}
              />
            </div>

            <div className="sm:col-span-2 lg:col-span-4">
              <button type="submit" className="btn-primary">
                Add product
              </button>
            </div>
          </form>
        </div>
      </section>

      <section className="panel">
        <div className="panel-header">
          <h2 className="panel-title">Product list</h2>
          <p className="text-xs text-zinc-500 mt-0.5">{products.length} total</p>
        </div>
        <div className="panel-body p-0">
          {listLoading ? (
            <Loader message="Refreshing product list..." />
          ) : products.length === 0 ? (
            <p className="empty-state">No products yet. Add your first item above.</p>
          ) : (
            <>
              <ul className="list-mobile">
                {products.map((product) => (
                  <li key={product.id} className="mobile-list-item">
                    <div className="mobile-list-row">
                      <p className="font-medium text-white break-words pr-2">{product.name}</p>
                      <button
                        type="button"
                        className="btn-danger shrink-0"
                        onClick={() => deleteProduct(product.id)}
                      >
                        Delete
                      </button>
                    </div>
                    <dl className="mobile-list-meta">
                      <div>
                        <dt className="mobile-list-label">SKU</dt>
                        <dd className="mobile-list-value">{product.sku}</dd>
                      </div>
                      <div>
                        <dt className="mobile-list-label">Price</dt>
                        <dd className="mobile-list-value">₹{product.price}</dd>
                      </div>
                      <div className="col-span-2">
                        <dt className="mobile-list-label">Quantity</dt>
                        <dd>
                          {product.quantity < 5 ? (
                            <span className="badge-warning">{product.quantity}</span>
                          ) : (
                            <span className="mobile-list-value">{product.quantity}</span>
                          )}
                        </dd>
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
                      <th>SKU</th>
                      <th>Price</th>
                      <th>Qty</th>
                      <th className="text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((product) => (
                      <tr key={product.id}>
                        <td className="font-medium text-white">{product.name}</td>
                        <td className="text-zinc-400">{product.sku}</td>
                        <td>₹{product.price}</td>
                        <td>
                          {product.quantity < 5 ? (
                            <span className="badge-warning">{product.quantity}</span>
                          ) : (
                            product.quantity
                          )}
                        </td>
                        <td className="text-right">
                          <button
                            type="button"
                            className="btn-danger"
                            onClick={() => deleteProduct(product.id)}
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

export default Products;
