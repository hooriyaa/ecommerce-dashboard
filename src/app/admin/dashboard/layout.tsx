

import Sidebar from "@/components/sidebar";

export default function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar for desktop */}
      <div className="hidden lg:block fixed inset-y-0 left-0 z-50">
        <Sidebar />
      </div>

      {/* Header and main content for mobile and desktop */}
      <div className="flex-1 lg:pl-64">
        {/* Header for mobile */}
        <header className="lg:hidden p-4 flex items-center justify-between bg-[#029FAE] text-white fixed top-0 left-0 right-0 z-40">
          <h2 className="text-xl font-bold">Admin Dashboard</h2>
          <div className="flex items-center">
            <Sidebar />
          </div>
        </header>

        {/* Main content */}
        <main className="p-6 mt-16 lg:mt-0">{children}</main>
      </div>
    </div>
  );
}