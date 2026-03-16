import "./globals.css";
import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import { SidebarDrawerProvider } from "@/components/SidebarDrawerContext";

export const metadata: Metadata = {
  title: "RehmonnyaHub",
  description: "A Reddit-style community platform for Mon people."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <SidebarDrawerProvider>
          <Navbar />
          <div className="mx-auto flex max-w-6xl gap-6 px-4 pb-8 pt-6">
            <Sidebar />
            <main className="flex-1">{children}</main>
          </div>
        </SidebarDrawerProvider>
      </body>
    </html>
  );
}
