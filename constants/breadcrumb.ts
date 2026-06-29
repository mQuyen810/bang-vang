export const breadcrumbMap: Record<
  string,
  {
    title: string;
    href?: string;
  }[]
> = {
  "/": [
    {
      title: "Trang chủ",
      href: "/",
    },
    {
      title: "Tổng quan",
      href: "/",
    },
  ],
  "/personal": [
    {
      title: "Trang chủ",
      href: "/",
    },
    {
      title: "Cá nhân",
      href: "/personal",
    },
  ],

  "/personal/bugs": [
    {
      title: "Trang chủ",
      href: "/",
    },
    {
      title: "Cá nhân",
      href: "/personal",
    },
    {
      title: "Bug đã xử lý",
    },
  ],

  "/personal/tasks": [
    {
      title: "Trang chủ",
      href: "/",
    },
    {
      title: "Cá nhân",
      href: "/personal",
    },
    {
      title: "Sub-task hoàn thành",
    },
  ],

    "/ranking": [
    {
      title: "Trang chủ",
      href: "/",
    },
    {
      title: "Tổng xếp hạng",
      href: "/ranking",
    }
  ],

  "/ranking/bug": [
    {
      title: "Trang chủ",
      href: "/",
    },
    {
      title: "Bảng xếp hạng",
      href: "/ranking",
    },
    {
      title: "Bug Rate",
    },
  ],

  "/ranking/performance": [
    {
      title: "Trang chủ",
      href: "/",
    },
    {
      title: "Bảng xếp hạng",
      href: "/ranking",
    },
    {
      title: "Năng lực sản xuất",
    },
  ],
};