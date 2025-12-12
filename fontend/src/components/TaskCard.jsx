import React, { useState } from "react";
import api from "@/lib/axios";
import { toast } from "sonner";
import { Pencil, Check, X, Calendar } from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";

const TaskCard = ({ task, handleTaskChanged }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState({
    title: task.title || "",
    description: task.description || "",
    startDate: (task.startDate || task.dueDate || task.start) ? (task.startDate || task.start || "").slice(0,10) : "",
    endDate: (task.endDate || task.dueDate || task.end) ? (task.endDate || task.dueDate || task.end || "").slice(0,10) : "",
    status: task.status || "pending",
  });
  const [saving, setSaving] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(s => ({ ...s, [name]: value }));
  };

  const save = async () => {
    setSaving(true);
    try {
      // Normalize payload: only send fields backend expects
      const payload = {
        title: form.title,
        description: form.description,
        startDate: form.startDate || null,
        endDate: form.endDate || null,
        status: form.status,
      };
      await api.put(`/tasks/${task._id}`, payload);
      toast.success("Cập nhật nhiệm vụ thành công");
      setIsEditing(false);
      handleTaskChanged();
    } catch (err) {
      console.error(err);
      toast.error("Lỗi khi lưu nhiệm vụ");
    } finally {
      setSaving(false);
    }
  };

  const cancel = () => {
    setIsEditing(false);
    setForm({
      title: task.title || "",
      description: task.description || "",
      startDate: (task.startDate || task.start || "").slice(0,10) || "",
      endDate: (task.endDate || task.dueDate || task.end || "").slice(0,10) || "",
      status: task.status || "pending",
    });
  };

  // helper show date safely
  const showDate = (t) => {
    const d = t?.endDate ?? t?.dueDate ?? null;
    return d ? (d.slice ? d.slice(0,10) : new Date(d).toISOString().slice(0,10)) : "-";
  };

  return (
    <Card className="p-5 shadow-sm border-border/40">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="flex-1 space-y-2">
          {!isEditing ? (
            <>
              <h3 className="font-semibold text-lg">{task.title}</h3>
              {task.description && <p className="text-gray-600">{task.description}</p>}
              <div className="text-sm text-gray-500 space-x-4">
                <span><strong>Bắt đầu:</strong> { (task.startDate || task.start) ? (task.startDate || task.start).slice(0,10) : "-" }</span>
                <span><strong>Kết thúc:</strong> { showDate(task) }</span>
              </div>
            </>
          ) : (
            <div className="space-y-2">
              <input
                className="w-full border px-3 py-2 rounded"
                name="title"
                value={form.title}
                onChange={handleChange}
              />
              <textarea
                className="w-full border px-3 py-2 rounded"
                name="description"
                value={form.description}
                onChange={handleChange}
              />
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs text-gray-600">Bắt đầu</label>
                  <input type="date" name="startDate" value={form.startDate} onChange={handleChange} className="w-full border px-2 py-2 rounded" />
                </div>
                <div>
                  <label className="text-xs text-gray-600">Kết thúc</label>
                  <input type="date" name="endDate" value={form.endDate} onChange={handleChange} className="w-full border px-2 py-2 rounded" />
                </div>
              </div>
            </div>
          )}

          <div className="mt-2">
            <span className={`inline-block px-3 py-1 rounded-full text-white text-xs ${ 
              task.status === "pending" ? "bg-gray-400" :
              task.status === "in-progress" ? "bg-blue-500" :
              task.status === "completed" ? "bg-green-500" :
              "bg-red-500"
            }`}>
              {task.status}
            </span>
          </div>
        </div>

        <div className="flex flex-col justify-center gap-3 w-[170px]">
          {!isEditing ? (
            <>
              <select
                className="border px-3 py-2 rounded-md text-sm"
                value={task.status}
                onChange={async (e) => {
                  try {
                    await api.put(`/tasks/${task._id}`, { status: e.target.value });
                    toast.success("Đã cập nhật trạng thái");
                    handleTaskChanged();
                  } catch (err) {
                    console.error(err);
                    toast.error("Không thể cập nhật trạng thái");
                  }
                }}
              >
                <option value="pending">Chờ xử lý</option>
                <option value="in-progress">Đang thực hiện</option>
                <option value="completed">Hoàn thành</option>
                <option value="overdue">Quá hạn</option>
              </select>

              <div className="flex gap-2">
                <Button variant="default" onClick={() => setIsEditing(true)} className="flex-1">
                  <Pencil className="w-4 h-4 mr-2" /> Chỉnh sửa
                </Button>
                <Button variant="destructive" onClick={async () => {
                  if (!confirm("Bạn có chắc muốn xoá nhiệm vụ này?")) return;
                  try {
                    await api.delete(`/tasks/${task._id}`);
                    toast.success("Đã xoá nhiệm vụ");
                    handleTaskChanged();
                  } catch (err) {
                    console.error(err);
                    toast.error("Không thể xoá nhiệm vụ");
                  }
                }}>
                  <TrashIcon />
                  Xoá
                </Button>
              </div>
            </>
          ) : (
            <div className="flex gap-2">
              <Button variant="default" onClick={save} disabled={saving} className="flex-1">
                <Check className="w-4 h-4 mr-2" /> Lưu
              </Button>
              <Button variant="ghost" onClick={cancel}><X className="w-4 h-4" /> Huỷ</Button>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};

// small placeholder for Trash icon if not imported
const TrashIcon = () => <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M3 6h18v2H3z"/><path d="M8 9h1v9H8zM11 9h1v9h-1zM14 9h1v9h-1z"/></svg>;

export default TaskCard;
