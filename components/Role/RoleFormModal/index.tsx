"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { App, Spin } from "antd";
import { Check, KeyRound, Loader2, Search, X } from "lucide-react";

import styles from "./styles.module.scss";

import type { Role } from "@/types/role";
import { useRoleStore } from "@/stores/role.store";
import { getPermissions } from "@/utils/rolePermissions";
import { ModalShell } from "@/components/ModalShell";

export function RoleFormModal({
  role,
  onClose,
}: {
  role: Role | null;
  onClose: () => void;
}) {
  const { message } = App.useApp();
  const { createRole, updateRole } = useRoleStore();

  const isEdit = !!role;

  const [name, setName] = useState(role?.name ?? "");
  const [permissions, setPermissions] = useState<string[]>(
    role?.permissions ?? [],
  );

  const [errors, setErrors] = useState<{ name?: string; permissions?: string }>(
    {},
  );
  const [saving, setSaving] = useState(false);

  const [permissionsOptions, setPermissionsOptions] = useState<string[]>([]);
  const [loadingPermissions, setLoadingPermissions] = useState(false);

  // Initial state covers this since the modal is unmounted on close.

  useEffect(() => {
    const load = async () => {
      setLoadingPermissions(true);
      try {
        const perms = await getPermissions();
        setPermissionsOptions(perms);
      } catch {
        message.error("Không tải được danh sách permission");
      } finally {
        setLoadingPermissions(false);
      }
    };

    void load();
  }, [message]);

  const validate = () => {
    const e: typeof errors = {};
    if (!name.trim()) e.name = "Role name is required.";

    if (!permissions.length) e.permissions = "Select at least one permission.";

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;
    setSaving(true);
    try {
      const payload = {
        name: name.trim(),
        permissions,
      };

      if (isEdit && role) {
        await updateRole(role.id, payload);
        message.success("Cập nhật thông tin vai trò thành công.");
      } else {
        await createRole(payload);
        message.success("Tạo vai trò mới thành công.");
      }

      onClose();
    } catch {
      message.error("Lưu thất bại.");
    } finally {
      setSaving(false);
    }
  };

  const title = isEdit ? "Sửa Vai Trò" : "Thêm Vai Trò";

  const permissionList = useMemo(
    () => permissionsOptions,
    [permissionsOptions],
  );

  return (
    <ModalShell onClose={onClose}>
      <div
        className={`glass-strong ${styles.modalContent}`}
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <div className={styles.iconWrapper}>
              <KeyRound className={styles.icon} />
            </div>
            <div>
              <h2 className={styles.title}>{title}</h2>
              <p className={styles.subtitle}>
                Xác định tên vai trò và phân quyền.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Đóng"
            className={styles.closeBtn}
          >
            <X size={16} />
          </button>
        </div>

        <div className={styles.body}>
          {/* Role Name */}
          <div className={styles.fieldWrapper}>
            <label className={styles.label}>
              Tên vai trò <span className={styles.required}>*</span>
            </label>
            <input
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="VD: Quản trị viên, Quản lý..."
              className={`${styles.input} ${errors.name ? styles.inputError : ""}`}
            />
            <div className={styles.hintWrapper}>
              {errors.name ? (
                <p className={styles.errorText}>{errors.name}</p>
              ) : (
                <span />
              )}
            </div>
          </div>

          {/* Permissions */}
          <div className={styles.fieldWrapper}>
            <label className={styles.label}>
              Quyền hạn <span className={styles.required}>*</span>
            </label>

            {loadingPermissions ? (
              <div className={styles.loadingText}>
                <Spin size="small" /> Đang tải...
              </div>
            ) : (
              <>
                <PermissionMultiSelect
                  value={permissions}
                  onChange={setPermissions}
                  options={permissionList}
                  invalid={!!errors.permissions}
                />
                {errors.permissions && (
                  <p
                    className={styles.errorText}
                    style={{ marginTop: "0.25rem" }}
                  >
                    {errors.permissions}
                  </p>
                )}
              </>
            )}
          </div>
        </div>

        <div className={styles.footer}>
          <button
            onClick={onClose}
            disabled={saving}
            className={styles.cancelBtn}
          >
            Hủy
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className={styles.saveBtn}
          >
            {saving && <Loader2 size={16} className="animate-spin" />}
            Lưu
          </button>
        </div>
      </div>
    </ModalShell>
  );
}

function PermissionMultiSelect({
  value,
  onChange,
  options,
  invalid,
}: {
  value: string[];
  onChange: (v: string[]) => void;
  options: string[];
  invalid?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node))
        setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [open]);

  const filtered = options.filter((p) =>
    p.toLowerCase().includes(search.trim().toLowerCase()),
  );

  const toggle = (p: string) => {
    onChange(value.includes(p) ? value.filter((v) => v !== p) : [...value, p]);
  };

  return (
    <div className={styles.multiSelectWrapper} ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={`${styles.selectButton} ${invalid ? styles.invalid : ""}`}
      >
        {value.length === 0 ? (
          <span className={styles.placeholder}>Chọn quyền hạn...</span>
        ) : (
          <div className={styles.tagsWrapper}>
            {value.map((p) => (
              <span key={p} className={styles.tag}>
                {p}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggle(p);
                  }}
                  aria-label={`Xóa ${p}`}
                >
                  <X size={12} />
                </button>
              </span>
            ))}
          </div>
        )}
      </button>

      {open && (
        <div className={`glass-strong ${styles.dropdown}`}>
          <div className={styles.searchInputWrapper}>
            <Search className={styles.searchIcon} />
            <input
              autoFocus
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Tìm kiếm quyền hạn..."
              className={styles.searchInput}
            />
          </div>
          <ul className={styles.optionsList}>
            {filtered.length === 0 && (
              <li className={styles.emptyOptions}>
                Không tìm thấy quyền hạn nào
              </li>
            )}
            {filtered.map((p) => {
              const checked = value.includes(p);
              return (
                <li key={p}>
                  <button
                    type="button"
                    onClick={() => toggle(p)}
                    className={styles.optionButton}
                  >
                    <span
                      className={`${styles.checkbox} ${checked ? styles.checked : ""}`}
                    >
                      {checked && <Check size={12} />}
                    </span>
                    <span className={styles.optionText}>{p}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}
