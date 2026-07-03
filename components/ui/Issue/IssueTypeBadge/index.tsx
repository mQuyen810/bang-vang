import styles from "./styles.module.scss";

interface AlertBadgeProps {
  text?: string | null;
}

export function AlertBadge({ text }: AlertBadgeProps) {
  const lower = (text ?? "").toLowerCase();

  let variant = styles.warning;

  if (lower.includes("missing")) {
    variant = styles.missing;
  } else if (lower.includes("overdue")) {
    variant = styles.overdue;
  }

  return <span className={`${styles.badge} ${variant}`}>{text || "--"}</span>;
}
