import {
  LayoutDashboard,
  User,
  ClipboardCheck,
  TriangleAlert,
} from "lucide-react";

import { LucideIcon } from "lucide-react";

export interface SidebarItem {
  label: string;
  path: string;
  icon: LucideIcon;
  activePath?: string;
}

export interface SidebarGroup {
  title: string;
  items: SidebarItem[];
}

export const SIDEBAR_MENU: SidebarGroup[] = [
  {
    title: "TỔNG QUAN",
    items: [
      {
        label: "Tổng quan",
        path: "/dashboard",
        icon: LayoutDashboard,
      },
    ],
  },

  // {
  //   title: "CÁ NHÂN",
  //   items: [
  //     {
  //       label: "Hồ sơ cá nhân",
  //       path: "/personal",
  //       icon: User,
  //     },
  //   ],
  // },

  {
    title: "BẢNG XẾP HẠNG",
    items: [
      {
        label: "Tổng xếp hạng",
        path: "/ranking?tab=prod",
        activePath: "/ranking",
        icon: ClipboardCheck,
      },
    ],
  },
  {
    title: "THỐNG KÊ",
    items: [
      {
        label: "Quá hạn",
        path: "/overdue",
        icon: TriangleAlert,
      },
      {
        label: "Quá hạn logwork",
        path: "/logwork",
        icon: TriangleAlert,
      },
      {
        label: "Quá budget",
        path: "/usbudget",
        icon: TriangleAlert,
      },
    ],
  },
];
