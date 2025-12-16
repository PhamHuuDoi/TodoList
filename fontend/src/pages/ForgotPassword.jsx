import { useState } from "react";
import { Link } from "react-router-dom";
import { forgotPassword } from "../api/auth";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    if (!email) return;

    try {
      setLoading(true);
      setError("");
      setMessage("");

      const res = await forgotPassword({ email });
      setMessage(res.data.message || "Đã gửi link reset mật khẩu");

      setEmail("");
    } catch (err) {
      setError(
        err.response?.data?.message || "Có lỗi xảy ra, vui lòng thử lại"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.wrapper}>
      <form onSubmit={submit} style={styles.form}>
        <h2 style={styles.title}>Quên mật khẩu</h2>

        <p style={styles.desc}>
          Nhập email bạn đã đăng ký. Chúng tôi sẽ gửi link đặt lại mật khẩu.
        </p>

        {message && <div style={styles.success}>{message}</div>}
        {error && <div style={styles.error}>{error}</div>}

        <input
          style={styles.input}
          type="email"
          placeholder="Email đăng ký"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <button style={styles.button} disabled={loading}>
          {loading ? "Đang gửi..." : "Gửi link reset"}
        </button>

        <div style={styles.links}>
          <Link to="/login">← Quay lại đăng nhập</Link>
        </div>
      </form>
    </div>
  );
}

const styles = {
  wrapper: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "linear-gradient(135deg, #e0f2fe 0%, #f8fafc 100%)",
  },
  form: {
    width: "400px",
    padding: "28px",
    background: "#fff",
    borderRadius: "12px",
    boxShadow: "0 20px 40px rgba(0,0,0,0.08)",
    display: "flex",
    flexDirection: "column",
    gap: "14px",
  },
  title: {
    textAlign: "center",
    fontSize: "22px",
    fontWeight: "700",
  },
  desc: {
    fontSize: "14px",
    color: "#64748b",
    textAlign: "center",
    marginBottom: "6px",
  },
  input: {
    padding: "12px",
    fontSize: "14px",
    borderRadius: "8px",
    border: "1px solid #cbd5e1",
    outline: "none",
  },
  button: {
    padding: "12px",
    borderRadius: "8px",
    border: "none",
    background: "#2563eb",
    color: "#fff",
    fontWeight: "600",
    cursor: "pointer",
    transition: "0.2s",
  },
  links: {
    textAlign: "center",
    fontSize: "13px",
    marginTop: "8px",
  },
  success: {
    padding: "10px",
    borderRadius: "6px",
    background: "#dcfce7",
    color: "#166534",
    fontSize: "13px",
    textAlign: "center",
  },
  error: {
    padding: "10px",
    borderRadius: "6px",
    background: "#fee2e2",
    color: "#991b1b",
    fontSize: "13px",
    textAlign: "center",
  },
};
