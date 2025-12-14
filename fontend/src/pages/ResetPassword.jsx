import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { resetPassword } from "../api/auth";

export default function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();

    if (password.length < 6) {
      alert("Mật khẩu phải ít nhất 6 ký tự");
      return;
    }

    if (password !== confirm) {
      alert("Mật khẩu xác nhận không khớp");
      return;
    }

    try {
      setLoading(true);
      await resetPassword(token, { password });
      alert("Đổi mật khẩu thành công");
      navigate("/login");
    } catch (err) {
      alert(err.response?.data?.message || "Link không hợp lệ hoặc đã hết hạn");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.wrapper}>
      <form onSubmit={submit} style={styles.form}>
        <h2 style={styles.title}>Đặt lại mật khẩu</h2>

        <input
          style={styles.input}
          type="password"
          placeholder="Mật khẩu mới"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <input
          style={styles.input}
          type="password"
          placeholder="Xác nhận mật khẩu"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          required
        />

        <button style={styles.button} disabled={loading}>
          {loading ? "Đang xử lý..." : "Đổi mật khẩu"}
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
    background: "#16a34a",
    color: "#fff",
    fontWeight: "bold",
    cursor: "pointer",
  },
  links: {
    textAlign: "center",
    fontSize: "13px",
  },
};
