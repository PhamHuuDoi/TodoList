import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { getMe, logoutUser } from "@/api/auth";

export const Header = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    getMe()
      .then((res) => setUser(res.data))
      .catch(() => setUser(null));
  }, []);

  const handleLogout = async () => {
    try {
      await logoutUser();
      toast.success("Đã đăng xuất");
      navigate("/login");
    } catch {
      toast.error("Đăng xuất thất bại");
    }
  };

  return (
    <div className="relative space-y-2 text-center">
      {/* ===== USER + LOGOUT (TOP RIGHT) ===== */}
      {user && (
        <div className="absolute top-0 right-0 flex items-center gap-3">
          <span className="text-sm text-muted-foreground">
            Xin chào, <b>{user.username}</b>
          </span>

          <button
            onClick={handleLogout}
            className="px-3 py-1 text-sm rounded-md bg-red-500 text-white hover:bg-red-600 transition"
          >
            Đăng xuất
          </button>
        </div>
      )}

      {/* ===== TITLE ===== */}
      <h1 className="text-4xl font-bold text-transparent bg-primary bg-clip-text">
        TodoX
      </h1>

      {/* ===== SUBTITLE ===== */}
      <p className="text-muted-foreground">
        Quản lý công việc cá nhân hiệu quả
      </p>
    </div>
  );
};
