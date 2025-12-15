import React, { useState } from "react";
import { Card } from "./ui/card";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import api from "@/lib/axios";
import { normalizeDate } from "../utils/date.js";

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

    const today = normalizeDate(new Date());

    // endDate < hôm nay
    if (form.endDate) {
      const end = normalizeDate(form.endDate);
      if (end < today) {
        toast.error("Ngày kết thúc không được nhỏ hơn hôm nay.");
        return;
      }
    }

    // endDate < startDate
    if (form.startDate && form.endDate) {
      const start = normalizeDate(form.startDate);
      const end = normalizeDate(form.endDate);

      if (end < start) {
        toast.error("Ngày kết thúc phải sau hoặc bằng ngày bắt đầu.");
        return;
      }
    }

    try {
      const payload = {
        title: form.title,
        description: form.description,
      };

      if (form.startDate) payload.startDate = form.startDate;
      if (form.endDate) payload.endDate = form.endDate;

      await api.post("/tasks", payload);

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
      console.error("AXIOS ERROR:", error.response?.data);
      toast.error(error.response?.data?.error || "Lỗi xảy ra khi thêm nhiệm vụ.");
    }
  };

  return (
    <Card className="p-6 border-0 bg-gradient-card shadow-custom-lg">
      <div className="flex flex-col gap-4">
        <Input
          type="text"
          name="title"
          placeholder="Tên nhiệm vụ..."
          className="h-12 text-base bg-slate-50 border-border/50"
          value={form.title}
          onChange={handleChange}
        />

        <Textarea
          name="description"
          placeholder="Mô tả nhiệm vụ..."
          className="bg-slate-50 border-border/50"
          value={form.description}
          onChange={handleChange}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-sm text-gray-600">Ngày bắt đầu</label>
            <Input
              type="date"
              name="startDate"
              value={form.startDate}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="text-sm text-gray-600">Ngày kết thúc</label>
            <Input
              type="date"
              name="endDate"
              value={form.endDate}
              onChange={handleChange}
            />
          </div>
        </div>

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
