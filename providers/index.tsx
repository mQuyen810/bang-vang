"use client";

import { ConfigProvider, theme, App } from "antd";
import { AntdRegistry } from "@ant-design/nextjs-registry";

export default function Providers({ children }: { children: React.ReactNode }) {
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
      <AntdRegistry>
        <App>{children}</App>
      </AntdRegistry>
    </ConfigProvider>
  );
}
