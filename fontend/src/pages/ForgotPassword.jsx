import { useState } from "react";
import { Link } from "react-router-dom";
import { forgotPassword } from "../api/auth";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (!email) return;

    try {
      setLoading(true);
      await forgotPassword({ email });
      alert("Nếu email tồn tại, hệ thống đã gửi link reset mật khẩu");
      setEmail("");
    } catch (err) {
      alert("Có lỗi xảy ra, vui lòng thử lại");
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

        <input
          style={styles.input}
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <button style={styles.button} disabled={loading}>
          {loading ? "Đang gửi..." : "Gửi link"}
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
    background: "#f1f5f9",
  },
  form: {
    width: "380px",
    padding: "24px",
    background: "#fff",
    borderRadius: "8px",
    boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
    display: "flex",
    flexDirection: "column",
    gap: "14px",
  },
  title: {
    textAlign: "center",
  },
  desc: {
    fontSize: "13px",
    color: "#64748b",
    textAlign: "center",
  },
  input: {
    padding: "10px",
    fontSize: "14px",
    borderRadius: "6px",
    border: "1px solid #cbd5e1",
  },
  button: {
    padding: "10px",
    borderRadius: "6px",
    border: "none",
    background: "#2563eb",
    color: "#fff",
    fontWeight: "bold",
    cursor: "pointer",
  },
  links: {
    textAlign: "center",
    fontSize: "13px",
  },
};
