"use client";

import React from "react";
import Link from "next/link";
import { House } from "lucide-react";
import { usePathname } from "next/navigation";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

import { breadcrumbMap } from "@/constants/breadcrumb";

import styles from "./styles.module.scss";

export default function PageBreadcrumb() {
  const pathname = usePathname() ?? "";

  const crumbs = breadcrumbMap[pathname] ?? [
    {
      title: "Trang chủ",
      href: "/",
    },
  ];

  return (
    <div className={styles.wrapper}>
      <Breadcrumb className={styles.breadcrumb}>
        <BreadcrumbList>
          {crumbs.map((item, index) => (
            <React.Fragment key={item.title}>
              <BreadcrumbItem className={styles.item}>
                {index === crumbs.length - 1 ? (
                  <BreadcrumbPage className={styles.current}>
                    {item.title}
                  </BreadcrumbPage>
                ) : (
                  <BreadcrumbLink
                    asChild
                    className={index === 0 ? styles.home : styles.link}
                  >
                    <Link href={item.href ?? "/"}>
                      {index === 0 ? <House size={15} /> : item.title}
                    </Link>
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>

              {index < crumbs.length - 1 && (
                <BreadcrumbSeparator className={styles.separator} />
              )}
            </React.Fragment>
          ))}
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  );
}
