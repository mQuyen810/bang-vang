import Dashboard from "@/components/Dashboard";
import MainLayout from "@/layouts/MainLayout";

export const metadata = {
  title: "Dashboard — Bảng Vàng",
  description: "Tổng quan thành tích đội ngũ — Top productivity & bug resolution champions.",
};

export default function DashboardPage() {
  return (
    <MainLayout>
      <Dashboard />
    </MainLayout>
  );
}