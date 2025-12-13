import React, { useState } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import api from "@/lib/axios";
import { toast } from "sonner";

const EditTaskModal = ({ task, onClose, onUpdated }) => {
  const [form, setForm] = useState({
    title: task.title,
    description: task.description || "",
    startDate: task.startDate ? task.startDate.slice(0, 10) : "",
    endDate: task.endDate ? task.endDate.slice(0, 10) : "",
    status: task.status,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    // validate ngày
    if (form.startDate && form.endDate) {
      if (new Date(form.endDate) < new Date(form.startDate)) {
        toast.error("Ngày kết thúc phải sau hoặc bằng ngày bắt đầu.");
        return;
      }
    }

    try {
      await api.put(`/tasks/${task._id}`, form);
      toast.success("Đã cập nhật nhiệm vụ");
      onUpdated();
      onClose();
    } catch {
      toast.error("Không thể cập nhật nhiệm vụ");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <Card className="w-full max-w-md p-6 space-y-4">
        <h2 className="text-lg font-semibold">Chỉnh sửa nhiệm vụ</h2>

        <Input
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="Tiêu đề"
        />

        <Textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Mô tả"
        />

        <div className="grid grid-cols-2 gap-4">
          <Input
            type="date"
            name="startDate"
            value={form.startDate}
            onChange={handleChange}
          />
          <Input
            type="date"
            name="endDate"
            value={form.endDate}
            onChange={handleChange}
          />
        </div>

        {/* Đổi trạng thái*/}
        <select
          name="status"
          value={form.status}
          onChange={handleChange}
          className="w-full border rounded-md px-3 py-2"
        >
          <option value="pending">Chờ xử lý</option>
          <option value="in-progress">Đang thực hiện</option>
          <option value="completed">Hoàn thành</option>
        </select>

        <div className="flex justify-end gap-3 pt-2">
          <Button variant="outline" onClick={onClose}>
            Huỷ
          </Button>
          <Button onClick={handleSave}>
            Lưu
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default EditTaskModal;
