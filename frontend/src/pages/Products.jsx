import { useEffect, useState } from "react";
import api from "../services/api";
import Loader from "../components/Loader";
import { getApiError } from "../utils/apiError";

const emptyForm = {
  name: "",
  sku: "",
  price: "",
  quantity: "",
};

function Products() {

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [listLoading, setListLoading] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState(emptyForm);

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
      alert(getApiError(error, "Failed to load products."));
    } finally {
      setLoading(false);
      setListLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const resetForm = () => {
    setEditingId(null);
    setFormData(emptyForm);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const buildPayload = () => {
    const name = formData.name.trim();
    const sku = formData.sku.trim();
    const price = Number(formData.price);
    const quantity = Number(formData.quantity);

    if (!name || !sku || formData.price === "" || formData.quantity === "") {
      alert("Please fill in all required fields.");
      return null;
    }

    if (Number.isNaN(price) || price < 0 || Number.isNaN(quantity) || quantity < 0) {
      alert("Price and quantity must be valid numbers (0 or greater).");
      return null;
    }

    return { name, sku, price, quantity };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = buildPayload();
    if (!payload) return;

    setFormLoading(true);

    try {
      if (editingId) {
        await api.put(`/products/${editingId}`, payload);
      } else {
        await api.post("/products/", payload);
      }

      resetForm();
      fetchProducts(true);
    } catch (error) {
      alert(getApiError(error));
    } finally {
      setFormLoading(false);
    }
  };

  const startEdit = async (id) => {
    setFormLoading(true);

    try {
      const response = await api.get(`/products/${id}`);
      const product = response.data;

      setEditingId(product.id);
      setFormData({
        name: product.name,
        sku: product.sku,
        price: String(product.price),
        quantity: String(product.quantity),
      });

      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (error) {
      alert(getApiError(error, "Product not found."));
    } finally {
      setFormLoading(false);
    }
  };

  const deleteProduct = async (id) => {
    if (!window.confirm("Delete this product?")) return;

    try {
      await api.delete(`/products/${id}`);
      if (editingId === id) resetForm();
      fetchProducts(true);
    } catch (error) {
      alert(getApiError(error, "Failed to delete product."));
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
          <h2 className="panel-title">
            {editingId ? `Edit product #${editingId}` : "Add product"}
          </h2>
        </div>
        <div className="panel-body">
          {formLoading && editingId === null ? (
            <Loader message="Loading product details..." />
          ) : (
            <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div>
                <label className="field-label" htmlFor="name">
                  Name <span className="text-red-400" aria-hidden="true">*</span>
                </label>
                <input
                  id="name"
                  className="input"
                  type="text"
                  name="name"
                  placeholder="Product name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  disabled={formLoading}
                />
              </div>

              <div>
                <label className="field-label" htmlFor="sku">
                  SKU <span className="text-red-400" aria-hidden="true">*</span>
                </label>
                <input
                  id="sku"
                  className="input"
                  type="text"
                  name="sku"
                  placeholder="SKU-001"
                  value={formData.sku}
                  onChange={handleChange}
                  required
                  disabled={formLoading}
                />
              </div>

              <div>
                <label className="field-label" htmlFor="price">
                  Price <span className="text-red-400" aria-hidden="true">*</span>
                </label>
                <input
                  id="price"
                  className="input"
                  type="number"
                  name="price"
                  placeholder="0"
                  min="0"
                  step="0.01"
                  value={formData.price}
                  onChange={handleChange}
                  required
                  disabled={formLoading}
                />
              </div>

              <div>
                <label className="field-label" htmlFor="quantity">
                  Quantity <span className="text-red-400" aria-hidden="true">*</span>
                </label>
                <input
                  id="quantity"
                  className="input"
                  type="number"
                  name="quantity"
                  placeholder="0"
                  min="0"
                  step="1"
                  value={formData.quantity}
                  onChange={handleChange}
                  required
                  disabled={formLoading}
                />
              </div>

              <div className="form-actions">
                <button type="submit" className="btn-primary" disabled={formLoading}>
                  {formLoading
                    ? "Saving..."
                    : editingId
                      ? "Update product"
                      : "Add product"}
                </button>
                {editingId && (
                  <button
                    type="button"
                    className="btn-secondary"
                    onClick={resetForm}
                    disabled={formLoading}
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          )}
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
                      <div className="flex shrink-0 gap-2">
                        <button
                          type="button"
                          className="btn-secondary"
                          onClick={() => startEdit(product.id)}
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          className="btn-danger"
                          onClick={() => deleteProduct(product.id)}
                        >
                          Delete
                        </button>
                      </div>
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
                          <div className="flex justify-end gap-2">
                            <button
                              type="button"
                              className="btn-secondary"
                              onClick={() => startEdit(product.id)}
                            >
                              Edit
                            </button>
                            <button
                              type="button"
                              className="btn-danger"
                              onClick={() => deleteProduct(product.id)}
                            >
                              Delete
                            </button>
                          </div>
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
