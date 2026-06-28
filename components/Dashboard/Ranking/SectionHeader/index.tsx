import { Award, ChevronRight, ArrowRight } from "lucide-react";
import Link from "next/link";
import styles from "./styles.module.scss";

interface SectionHeaderProps {
  eyebrow: string;
  title: string;
  desc: string;
  variant?: "default" | "bug";
  viewAll?: {
    href: string;
    label?: string;
  };
}

export function SectionHeader({ 
  eyebrow, 
  title, 
  desc, 
  variant = "default",
  viewAll,
}: SectionHeaderProps) {
  const gradientClass = variant === "bug" 
    ? styles.bugGradient 
    : styles.defaultGradient;

  return (
    <div className={styles.headerWrapper}>
      <div className={styles.headerLeft}>
        <div className={styles.eyebrow}>
          <Award className={styles.eyebrowIcon} />
          {eyebrow}
        </div>
        <h2 className={`${styles.title} ${gradientClass}`}>
          {title}
        </h2>
        <p className={styles.description}>{desc}</p>
      </div>
      
      {viewAll && (
        <div className={styles.headerRight}>
          <Link href={viewAll.href} className={styles.viewAll}>
            <span>{viewAll.label || "Xem tất cả"}</span>
            <ArrowRight className={styles.viewAllIcon} />
          </Link>
        </div>
      )}
    </div>
  );
}