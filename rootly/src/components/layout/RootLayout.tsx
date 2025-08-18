// src/components/layout/RootLayout.tsx
import { Header } from "./Header";
import { Sidebar } from "./Sidebar";
import { Outlet } from "react-router-dom";

export function RootLayout() {
  return (
    <div className="min-h-screen bg-background antialiased">
      <Header />
      <div className="container">
        <div className="flex gap-6">
          <Sidebar />
          <main className="flex-1 py-6">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}


