import { Award } from "lucide-react";
import styles from "./styles.module.scss";

interface SectionHeaderProps {
  eyebrow: string;
  title: string;
  desc: string;
  variant?: "default" | "bug";
}

export function SectionHeader({ 
  eyebrow, 
  title, 
  desc, 
  variant = "default" 
}: SectionHeaderProps) {
  const gradientClass = variant === "bug" 
    ? styles.bugGradient 
    : styles.defaultGradient;

  return (
    <div className={styles.headerWrapper}>
      <div>
        <div className={styles.eyebrow}>
          <Award className={styles.eyebrowIcon} />
          {eyebrow}
        </div>
        <h2 className={`${styles.title} ${gradientClass}`}>
          {title}
        </h2>
        <p className={styles.description}>{desc}</p>
      </div>
    </div>
  );
}