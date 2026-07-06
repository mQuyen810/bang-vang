export const breadcrumbMap: Record<
  string,
  {
    title: string;
    href?: string;
  }[]
> = {
  "/dashboard": [
    {
      title: "Trang chủ",
      href: "/dashboard",
    },
    {
      title: "Tổng quan",
      href: "/dashboard",
    },
  ],
  "/personal": [
    {
      title: "Trang chủ",
      href: "/dashboard",
    },
    {
      title: "Cá nhân",
      href: "/personal",
    },
  ],

  "/ranking": [
    {
      title: "Trang chủ",
      href: "/dashboard",
    },
    {
      title: "Tổng xếp hạng",
      href: "/ranking",
    },
  ],
  "/overdue": [
    {
      title: "Trang chủ",
      href: "/dashboard",
    },
    {
      title: "Quá hạn",
      href: "/overdue",
    },
  ],
  "/logwork": [
    {
      title: "Trang chủ",
      href: "/dashboard",
    },
    {
      title: "Quá hạn logwork",
      href: "/logwork",
    },
  ],
  "/usbudget": [
    {
      title: "Trang chủ",
      href: "/dashboard",
    },
    {
      title: "Quá budget",
      href: "/usbudget",
    },
  ],
};
