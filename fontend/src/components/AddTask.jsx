import React, { useState } from "react";
import { Card } from "./ui/card";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import api from "@/lib/axios";

const AddTask = ({ handleNewTaskAdded }) => {
  const [form, setForm] = useState({
    title: "",
    description: "",
    startDate: "",
    endDate: "",
    status: "pending",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const addTask = async () => {
    if (!form.title.trim()) {
      toast.error("Bạn phải nhập tiêu đề nhiệm vụ.");
      return;
    }

    // VALIDATE ngày
    if (form.startDate && form.endDate) {
      if (new Date(form.endDate) < new Date(form.startDate)) {
        toast.error("Ngày kết thúc phải sau ngày bắt đầu.");
        return;
      }
    }
    try {
      await api.post("/tasks", {
        ...form,
        startDate: form.startDate || null,
        endDate: form.endDate || null,
      });

      toast.success(`Đã thêm nhiệm vụ: ${form.title}`);
      setForm({
        title: "",
        description: "",
        startDate: "",
        endDate: "",
        status: "pending",
      });

      handleNewTaskAdded();
    } catch (error) {
      console.error(error);
      toast.error("Lỗi xảy ra khi thêm nhiệm vụ.");
    }
  };

  return (
    <Card className="p-6 border-0 bg-gradient-card shadow-custom-lg">
      <div className="flex flex-col gap-4">
        {/* TIÊU ĐỀ */}
        <Input
          type="text"
          name="title"
          placeholder="Tên nhiệm vụ..."
          className="h-12 text-base bg-slate-50 border-border/50"
          value={form.title}
          onChange={handleChange}
        />

        {/* MÔ TẢ */}
        <Textarea
          name="description"
          placeholder="Mô tả nhiệm vụ..."
          className="bg-slate-50 border-border/50"
          value={form.description}
          onChange={handleChange}
        />

        {/* NGÀY THÁNG */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-sm text-gray-600">Ngày bắt đầu</label>
            <Input
              type="date"
              name="startDate"
              className="bg-slate-50 border-border/50"
              value={form.startDate}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="text-sm text-gray-600">Ngày kết thúc</label>
            <Input
              type="date"
              name="endDate"
              className="bg-slate-50 border-border/50"
              value={form.endDate}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* TRẠNG THÁI */}
        <div>
          <label className="text-sm text-gray-600">Trạng thái</label>
          <select
            name="status"
            className="w-full h-11 rounded-md bg-slate-50 border border-border/50 px-3"
            value={form.status}
            onChange={handleChange}
          >
            <option value="pending">Chờ xử lý</option>
            <option value="in-progress">Đang thực hiện</option>
            <option value="completed">Hoàn thành</option>
          </select>

        </div>

        {/* BUTTON */}
        <Button
          variant="gradient"
          size="xl"
          className="px-6 mt-2"
          onClick={addTask}
        >
          <Plus className="size-5" />
          Thêm nhiệm vụ
        </Button>
      </div>
    </Card>
  );
};

export default AddTask;
