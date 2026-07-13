"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { User, Lock, Eye, EyeOff, Trophy, Loader2 } from "lucide-react";
import { App } from "antd";
import { Background } from "@/components/ui/Background";
// import { message } from "antd"; // Removed

import { Mascot } from "@/components/ui/Mascot";
import { useAuthStore } from "@/stores/auth.store";
import { NeonField } from "./NeonField";
import { FloatingDecor } from "./FloatingDecor";
import styles from "./styles.module.scss";

export default function LoginForm() {
  const { message } = App.useApp();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [focus, setFocus] = useState<"username" | "password" | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [cursorRatio, setCursorRatio] = useState(0.5);
  const [eyeTarget, setEyeTarget] = useState({ x: 0, y: 0 });

  const userInputRef = useRef<HTMLInputElement>(null);
  const mascotRef = useRef<HTMLDivElement>(null);
  const { login, loading } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      const el = mascotRef.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      const dx = (e.clientX - cx) / Math.max(window.innerWidth / 2, 1);
      const dy = (e.clientY - cy) / Math.max(window.innerHeight / 2, 1);
      setEyeTarget({
        x: Math.max(-1, Math.min(1, dx * 1.5)),
        y: Math.max(-1, Math.min(1, dy * 1.5)),
      });
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  const effectiveEye =
    focus === "username" ? { x: cursorRatio * 2 - 1, y: 0.4 } : eyeTarget;

  const mode: "idle" | "username" | "password" | "surprised" =
    focus === "password"
      ? showPassword
        ? "surprised"
        : "password"
      : focus === "username"
        ? "username"
        : "idle";

  const updateCursor = () => {
    const el = userInputRef.current;
    if (!el) return;
    const len = Math.max(1, el.value.length || 1);
    const ratio = Math.min(1, Math.max(0, (el.selectionStart ?? 0) / len));
    setCursorRatio(ratio);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setError("");

    try {
      const userData = await login(username, password);

      message.success("Đăng nhập thành công!");

      if (userData?.super_admin === 1) {
        router.push("/admin");
      } else {
        router.push("/dashboard");
      }
    } catch (err) {
      const e = err as unknown as {
        response?: { data?: { message?: string } };
      };
      let errorMessage = e.response?.data?.message || "Sai tài khoản hoặc mật khẩu";

      // Hide technical errors from users
      if (errorMessage.includes("SQLSTATE") || errorMessage.includes("Connection: mysql")) {
        errorMessage = "Lỗi kết nối cơ sở dữ liệu. Vui lòng liên hệ quản trị viên.";
      } else if (errorMessage.includes("cURL error") || errorMessage.includes("Could not resolve host")) {
        errorMessage = "Không thể kết nối đến hệ thống Jira. Vui lòng liên hệ quản trị viên.";
      }

      setError(errorMessage);
    }

  };



  return (
    <App>
      <div className={styles.container}>
        <Background />
        <FloatingDecor />

        <div className={styles.wrapper}>
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className={styles.logoWrapper}
          >
            <div className={styles.logoBadge}>
              <Trophy className={styles.logoIcon} />
              <span className={styles.logoLabel}>Vinh danh</span>
              <Trophy className={styles.logoIcon} />
            </div>
            <h1 className={styles.logoTitle}>BẢNG VÀNG</h1>
            <p className={styles.logoSubtitle}>HỆ THỐNG XẾP HẠNG NHÂN VIÊN</p>
          </motion.div>


          {/* Mascot */}
          <div className={styles.mascotWrapper}>
            <div ref={mascotRef} className={styles.mascotContainer}>
              <Mascot mode={mode} eyeTarget={effectiveEye} />
            </div>
          </div>

          {/* Login Card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: [0, -4, 0] }}
            transition={{
              opacity: { duration: 0.8 },
              y: { duration: 5, repeat: Infinity, ease: "easeInOut" },
            }}
            className={styles.cardWrapper}
          >
            <div className={styles.cardGlow} />
            <div className={styles.card}>
              <div className={styles.cardShine} />

              <form onSubmit={handleSubmit} className={styles.form}>
                {error && <div className={styles.error}>{error}</div>}

                {/* Username Field */}
                <NeonField focused={focus === "username"}>
                  <User className={styles.fieldIcon} />
                  <input
                    ref={userInputRef}
                    type="text"
                    placeholder="Tên đăng nhập"
                    value={username}
                    onChange={(e) => {
                      setUsername(e.target.value);
                      updateCursor();
                    }}
                    onKeyUp={updateCursor}
                    onClick={updateCursor}
                    onFocus={() => setFocus("username")}
                    onBlur={() => setFocus(null)}
                    className={styles.fieldInput}
                    disabled={loading}
                  />
                </NeonField>

                {/* Password Field */}
                <NeonField focused={focus === "password"}>
                  <Lock className={styles.fieldIcon} />
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Mật khẩu"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onFocus={() => setFocus("password")}
                    onBlur={() => setFocus(null)}
                    className={styles.fieldInput}
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className={styles.eyeButton}
                    tabIndex={-1}
                    aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                  >
                    {showPassword ? (
                      <EyeOff className={styles.eyeIcon} />
                    ) : (
                      <Eye className={styles.eyeIcon} />
                    )}
                  </button>
                </NeonField>

                {/* Submit Button */}
                <motion.button
                  type="submit"
                  whileHover={{
                    y: -2,
                    boxShadow: "0 0 40px rgba(139,92,246,0.7)",
                  }}
                  whileTap={{ scale: 0.96 }}
                  className={styles.submitButton}
                  disabled={loading}
                >
                  <motion.span
                    className={styles.submitShine}
                    animate={{ x: ["-100%", "100%"] }}
                    transition={{
                      duration: 2.5,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                  />
                  <span className={styles.submitText}>
                    {loading ? (
                      <>
                        <Loader2 className={styles.spinner} />
                        Đang đăng nhập...
                      </>
                    ) : (
                      "Đăng nhập"
                    )}
                  </span>
                </motion.button>
              </form>
            </div>
          </motion.div>

          <p className={styles.poweredBy}>Phát triển bởi Bảng Vàng • v1.0</p>

        </div>
      </div>
    </App>
  );
}
