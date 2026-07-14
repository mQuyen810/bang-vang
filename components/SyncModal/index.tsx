import React, { useState } from "react";
import { Modal, DatePicker, Select, App } from "antd";
import dayjs from "dayjs";
import styles from "./styles.module.scss";
import { useDashboardStore } from "@/stores/dashboard.store";
import { useIssuesStore } from "@/stores/sync.store";
import { issuesService } from "@/services/sync.service";

interface SyncModalProps {
  open: boolean;
  onClose: () => void;
}

export default function SyncModal({ open, onClose }: SyncModalProps) {
  const { projects } = useDashboardStore();
  const {
    syncFromLastIssues,
    syncCustomIssues,
    setLoadingLast,
    setLoadingFull,
    triggerRefresh,
  } = useIssuesStore();
  const { message } = App.useApp();

  const [loading, setLoading] = useState(false);
  const [selectedProjects, setSelectedProjects] = useState<string[]>([]);
  const [dates, setDates] = useState<[dayjs.Dayjs | null, dayjs.Dayjs | null]>([
    null,
    null,
  ]);

  const currentMonth = dayjs().format("MM/YYYY");

  const pollSync = async (mode: "last" | "full") => {
    return new Promise<void>((resolve, reject) => {
      const interval = setInterval(async () => {
        try {
          const res = await issuesService.getSyncStatus(mode);
          if (res.status !== "running") {
            clearInterval(interval);
            resolve();
          }
        } catch (error) {
          clearInterval(interval);
          reject(error);
        }
      }, 3000);
    });
  };

  const handleSmartSync = async () => {
    if (loading) return;
    try {
      setLoading(true);
      setLoadingLast(true);
      const res = await syncFromLastIssues();
      message.info(res.message || "Đã nhận yêu cầu đồng bộ, đang xử lý nền...");
      onClose();

      await pollSync("last");
      message.success("Đồng bộ thành công!");
      triggerRefresh();
    } catch (error) {
      message.error("Đồng bộ dữ liệu thất bại!");
    } finally {
      setLoading(false);
      setLoadingLast(false);
    }
  };

  const handleCustomSync = async () => {
    if (loading) return;
    if (!dates[0] || !dates[1]) {
      message.warning("Vui lòng chọn khoảng thời gian!");
      return;
    }

    if (dates[0].isAfter(dates[1], "month")) {
      message.warning("Thời gian 'Từ tháng' không được lớn hơn 'Đến tháng'!");
      return;
    }

    try {
      setLoading(true);
      setLoadingFull(true);
      const fromMonth = dates[0].format("MM-YYYY");
      const toMonth = dates[1].format("MM-YYYY");
      const projs =
        selectedProjects.length > 0
          ? selectedProjects
          : projects.map((p) => p.name);

      const res = await syncCustomIssues(fromMonth, toMonth, projs);
      message.info(res.message || "Đã nhận yêu cầu đồng bộ, đang xử lý nền...");
      onClose();

      await pollSync("full");
      message.success("Đồng bộ thành công!");
      triggerRefresh();
    } catch (error) {
      message.error("Đồng bộ dữ liệu thất bại!");
    } finally {
      setLoading(false);
      setLoadingFull(false);
    }
  };

  return (
    <Modal
      title="Đồng bộ dữ liệu"
      open={open}
      onCancel={onClose}
      footer={null}
      width={480}
      className={styles.modal}
      centered
    >
      <div className={styles.section}>
        <div className={styles.info}>
          <span>
            Tháng hiện tại: <strong>{currentMonth}</strong>
          </span>
          <span>
            Dự án: <strong>Tất cả</strong>
          </span>
        </div>

        <button
          className={styles.primaryBtn}
          onClick={handleSmartSync}
          disabled={loading}
        >
          {loading ? "Đang xử lý..." : "🚀 Bắt đầu đồng bộ nhanh"}
        </button>
      </div>

      <div className={styles.divider}>Hoặc tùy chỉnh nâng cao</div>

      <div className={styles.section}>
        <div className={styles.formGroup}>
          <label>Khoảng thời gian (Tháng)</label>
          <DatePicker.RangePicker
            picker="month"
            format="MM/YYYY"
            value={dates}
            // @ts-expect-error type matching issue
            onChange={(val) => setDates(val)}
            style={{ width: "100%" }}
            placeholder={["Từ tháng", "Đến tháng"]}
          />
        </div>

        <div className={styles.formGroup}>
          <label>Dự án (Bỏ trống để chọn tất cả)</label>
          <Select
            mode="multiple"
            placeholder="Chọn dự án..."
            value={selectedProjects}
            onChange={setSelectedProjects}
            style={{ width: "100%" }}
            options={projects.map((p) => ({ label: p.name, value: p.name }))}
            maxTagCount="responsive"
          />
        </div>

        <button
          className={styles.secondaryBtn}
          onClick={handleCustomSync}
          disabled={loading}
        >
          Đồng bộ tùy chỉnh
        </button>
      </div>
    </Modal>
  );
}
