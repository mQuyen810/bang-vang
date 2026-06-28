import type { Metadata } from "next";
import Providers from "@/providers";
import "./globals.scss";
import { Inter } from "next/font/google";
import { SidebarProvider } from "@/components/Sidebar/SidebarProvider";

const inter = Inter({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Bảng vàng",
  description: "Vinh danh những người có đóng góp xuất sắc cho cộng đồng",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body className={inter.className}>
        <Providers>
          <SidebarProvider>{children}</SidebarProvider>
        </Providers>
      </body>
    </html>
  );
}
