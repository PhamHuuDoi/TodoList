import api from "./axios";

// lấy danh sách
export const getTasks = () => api.get("/tasks");

// tạo task
export const createTask = (data) => api.post("/tasks", data);

// update task
export const updateTask = (id, data) => api.put(`/tasks/${id}`, data);

// xóa task
export const deleteTask = (id) => api.delete(`/tasks/${id}`);

// thống kê
export const getStats = (days) => api.get(`/tasks/stats?days=${days}`);
