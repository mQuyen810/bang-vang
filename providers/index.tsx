"use client";

import { ConfigProvider, theme } from "antd";

export default function Providers({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ConfigProvider
      theme={{
        algorithm: theme.darkAlgorithm,

        token: {
          colorPrimary: "#4f7cff",

          borderRadius: 16,

          colorText: "#ffffff",

          colorBgContainer: "rgba(255,255,255,0.05)",
        },
      }}
    >
      {children}
    </ConfigProvider>
  );
}