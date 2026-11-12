import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import HeaderAdmin from "../HeaderAdmin";
import Sidebar from "../Sidebar";
import AdminGuard from "../AdminGuard";

/**
 * Shared shell of every admin screen.
 *
 * The sidebar is a fixed 256px column on a large screen and a slide-in
 * drawer on a phone, so the tables keep the full width of the viewport.
 * The guard checks the role of the visitor before the content is rendered.
 */
type Props = {
  children: React.ReactNode;
  /** Title rendered above the content. */
  title?: string;
};

const AdminLayout = ({ children, title }: Props) => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { pathname } = useLocation();

  // Navigating to another screen closes the drawer.
  useEffect(() => {
    setDrawerOpen(false);
  }, [pathname]);

  return (
    <AdminGuard>
      <div className="bg-[#F2F9F6] w-full min-h-screen">
        <div className="flex">
          {/* Desktop sidebar */}
          <div className="hidden lg:block w-64 shrink-0 bg-white">
            <Sidebar />
          </div>

          {/* Mobile drawer */}
          {drawerOpen && (
            <div className="lg:hidden fixed inset-0 z-40">
              <div
                className="absolute inset-0 bg-black/40"
                onClick={() => setDrawerOpen(false)}
              />
              <div className="absolute left-0 top-0 h-full bg-white w-64 overflow-y-auto">
                <Sidebar />
              </div>
            </div>
          )}

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 lg:hidden px-4 pt-4">
              <button
                type="button"
                aria-label="Mở/đóng menu"
                onClick={() => setDrawerOpen((open) => !open)}
                className="p-2 rounded-md bg-white shadow"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="size-6"
                >
                  {drawerOpen ? (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  ) : (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                    />
                  )}
                </svg>
              </button>
              {title ? (
                <h2 className="text-xl font-semibold">{title}</h2>
              ) : null}
            </div>

            <div className="hidden lg:block px-6 pt-4">
              {title ? (
                <h2 className="text-2xl font-semibold">{title}</h2>
              ) : null}
            </div>

            <HeaderAdmin />

            <div className="p-4 lg:p-6">{children}</div>
          </div>
        </div>
      </div>
    </AdminGuard>
  );
};

export default AdminLayout;
