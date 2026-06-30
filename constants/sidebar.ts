import {
  LayoutDashboard,
  User,
  Bug,
  Trophy,
  ClipboardCheck,
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
        path: "/ranking",
        icon: ClipboardCheck,
      },
    ],
  },
];
