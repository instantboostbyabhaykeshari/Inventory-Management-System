import { useEffect } from "react";
import { NavLink, Outlet, useLocation } from "react-router-dom";

const navItems = [
  { to: "/", label: "Dashboard", end: true },
  { to: "/products", label: "Products" },
  { to: "/customers", label: "Customers" },
  { to: "/orders", label: "Orders" },
];

function Layout() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <div className="min-h-screen min-h-[100dvh]">
      <aside className="hidden md:flex fixed top-0 left-0 z-40 h-screen w-64 flex-col border-r border-white/10 bg-[#0b0f1a]">
        <div className="shrink-0 px-6 py-6 border-b border-white/10">
          <Brand />
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          {navItems.map((item) => (
            <SidebarLink key={item.to} item={item} />
          ))}
        </nav>

        <div className="shrink-0 px-6 py-4 border-t border-white/10">
          <p className="text-xs text-zinc-500">Stock & orders at a glance</p>
        </div>
      </aside>

      <div className="md:pl-64 min-h-screen min-h-[100dvh] flex flex-col">
        <header className="md:hidden sticky top-0 z-30 border-b border-white/10 bg-[#0b0f1a]/95 backdrop-blur-xl px-4 py-3 pt-[max(0.75rem,env(safe-area-inset-top))]">
          <Brand compact />
        </header>

        <main className="main-content flex-1 w-full max-w-6xl mx-auto min-w-0">
          <Outlet />
        </main>

        <nav
          className="md:hidden fixed bottom-0 left-0 right-0 z-50 border-t border-white/10 bg-[#0b0f1a]/95 backdrop-blur-xl"
          aria-label="Main navigation"
        >
          <div className="grid grid-cols-4 gap-0 px-1 pt-1 pb-[max(0.5rem,env(safe-area-inset-bottom))]">
            {navItems.map((item) => (
              <BottomNavLink key={item.to} item={item} />
            ))}
          </div>
        </nav>
      </div>
    </div>
  );
}

function Brand({ compact = false }) {
  return (
    <div className={`flex items-center gap-3 ${compact ? "" : ""}`}>
      <div className="h-9 w-9 shrink-0 rounded-lg bg-gradient-to-br from-blue-500 to-emerald-400 flex items-center justify-center text-sm font-bold text-white shadow-lg shadow-blue-500/20">
        IM
      </div>
      <div className="min-w-0">
        <p className={`font-semibold text-white tracking-tight truncate ${compact ? "text-sm" : "text-sm"}`}>
          Inventory
        </p>
        <p className="text-xs text-zinc-500 truncate">
          {compact ? "Management System" : "Management"}
        </p>
      </div>
    </div>
  );
}

function SidebarLink({ item }) {
  return (
    <NavLink
      to={item.to}
      end={item.end}
      className={({ isActive }) =>
        `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
          isActive
            ? "bg-white/10 text-white"
            : "text-zinc-400 hover:text-white hover:bg-white/5"
        }`
      }
    >
      <NavIcon route={item.to} />
      {item.label}
    </NavLink>
  );
}

function BottomNavLink({ item }) {
  return (
    <NavLink
      to={item.to}
      end={item.end}
      className={({ isActive }) =>
        `flex flex-col items-center justify-center gap-0.5 rounded-lg py-2 min-h-[52px] text-[10px] sm:text-xs font-medium transition-colors touch-manipulation ${
          isActive ? "text-blue-400" : "text-zinc-500 active:text-zinc-300"
        }`
      }
    >
      {({ isActive }) => (
        <>
          <span
            className={`flex h-8 w-8 items-center justify-center rounded-lg transition-colors ${
              isActive ? "bg-blue-500/20 text-blue-400" : "text-zinc-400"
            }`}
          >
            <NavIcon route={item.to} className="h-5 w-5" />
          </span>
          <span className="truncate max-w-full px-0.5">{item.label}</span>
        </>
      )}
    </NavLink>
  );
}

function NavIcon({ route, className = "h-4 w-4 opacity-70" }) {
  if (route === "/") {
    return (
      <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
      </svg>
    );
  }
  if (route === "/products") {
    return (
      <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
      </svg>
    );
  }
  if (route === "/customers") {
    return (
      <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
      </svg>
    );
  }
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" />
    </svg>
  );
}

export default Layout;
