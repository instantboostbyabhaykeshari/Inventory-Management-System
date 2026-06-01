import { useEffect, useState } from "react";
import api from "../services/api";
import Loader from "../components/Loader";

function Dashboard() {

  const [loading, setLoading] = useState(true);
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

    setLoading(true);

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

    } finally {

      setLoading(false);

    }
  };

  const statCards = [
    { label: "Total Products", value: stats.totalProducts, accent: "from-blue-500/20 to-blue-500/5" },
    { label: "Total Customers", value: stats.totalCustomers, accent: "from-emerald-500/20 to-emerald-500/5" },
    { label: "Total Orders", value: stats.totalOrders, accent: "from-violet-500/20 to-violet-500/5" },
  ];

  if (loading) {
    return (
      <Loader
        fullPage
        message="Loading dashboard overview..."
      />
    );
  }

  return (
    <div className="page-shell">
      <header>
        <h1 className="page-title">Dashboard</h1>
        <p className="page-subtitle">Overview of inventory, customers, and orders</p>
      </header>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
        {statCards.map((card) => (
          <div
            key={card.label}
            className={`panel p-5 bg-gradient-to-br ${card.accent}`}
          >
            <p className="text-sm text-zinc-400">{card.label}</p>
            <p className="mt-2 text-3xl font-semibold text-white tabular-nums">{card.value}</p>
          </div>
        ))}
      </div>

      <section className="panel">
        <div className="panel-header flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-base font-semibold text-white">Low stock alerts</h2>
            <p className="text-xs text-zinc-500 mt-0.5">Products with quantity below 5</p>
          </div>
          {stats.lowStockProducts.length > 0 && (
            <span className="badge-warning w-fit">{stats.lowStockProducts.length} items</span>
          )}
        </div>

        <div className="panel-body p-0 sm:p-5">
          {stats.lowStockProducts.length === 0 ? (
            <p className="empty-state px-4">No low stock products — you&apos;re in good shape.</p>
          ) : (
            <>
              <ul className="list-mobile">
                {stats.lowStockProducts.map((product) => (
                  <li key={product.id} className="mobile-list-item">
                    <div className="mobile-list-row">
                      <span className="font-medium text-white break-words">{product.name}</span>
                      <span className="badge-warning shrink-0">{product.quantity}</span>
                    </div>
                  </li>
                ))}
              </ul>
              <div className="table-desktop">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Product</th>
                      <th className="text-right">Quantity</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.lowStockProducts.map((product) => (
                      <tr key={product.id}>
                        <td className="font-medium text-white">{product.name}</td>
                        <td className="text-right">
                          <span className="badge-warning">{product.quantity}</span>
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

export default Dashboard;
