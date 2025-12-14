import api from "./axios";

// đăng ký
export const registerUser = (data) => api.post("/auth/register", data);

// đăng nhập
export const loginUser = (data) => api.post("/auth/login", data);

// logout
export const logoutUser = () => api.post("/auth/logout");

// quên mật khẩu
export const forgotPassword = (data) => api.post("/auth/forgot-password", data);

// reset password
export const resetPassword = (token, data) =>
    api.post(`/auth/reset-password/${token}`, data);
export const getMe = () => api.get("/auth/me");
