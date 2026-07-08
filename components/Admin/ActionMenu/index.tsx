"use client";

import { useState, useEffect, useRef } from "react";
import { MoreVertical } from "lucide-react";

import type { ManagerItem } from "@/types/admin";
import styles from "./styles.module.scss";

interface ActionMenuProps {
  user: ManagerItem;
  onDelete: () => void;
}

export function ActionMenu({ user: _user }: ActionMenuProps) {
  void _user;
  const [isOpen, setIsOpen] = useState(false);


  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Intentionally left blank (no unused handler). 


  return (
    <div className={styles.menuContainer} ref={menuRef}>
      <button
        className={styles.menuTrigger}
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Actions"
      >
        <MoreVertical className={styles.menuIcon} />
      </button>
    </div>
  );
}
