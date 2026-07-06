import {
  LayoutDashboard,
  User,
  Bug,
  Trophy,
  ClipboardCheck,
  TriangleAlert,
} from "lucide-react";

export const SIDEBAR_MENU = [
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

  {
    title: "CÁ NHÂN",
    items: [
      {
        label: "Hồ sơ cá nhân",
        path: "/personal",
        icon: User,
      },
    ],
  },

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
