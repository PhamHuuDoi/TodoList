import React from "react";
import api from "@/lib/axios";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";

const statusColors = {
  pending: "bg-gray-400",
  "in-progress": "bg-blue-500",
  completed: "bg-green-500",
  overdue: "bg-red-500",
};

const TaskList = ({ filteredTasks, handleTaskChanged }) => {
  if (!filteredTasks.length) {
    return (
      <div className="text-gray-500 text-center py-4">
        Không có nhiệm vụ nào.
      </div>
    );
  }

  //️⃣ Cập nhật trạng thái
  const updateStatus = async (taskId, newStatus) => {
    try {
      await api.put(`/tasks/${taskId}`, { status: newStatus });
      toast.success(`Đã cập nhật trạng thái thành "${newStatus}".`);
      handleTaskChanged();
    } catch (error) {
      console.error(error);
      toast.error("Không thể cập nhật trạng thái.");
    }
  };

  //️⃣ Xóa task
  const deleteTask = async (id) => {
    if (!confirm("Bạn có chắc muốn xoá nhiệm vụ này?")) return;

    try {
      await api.delete(`/tasks/${id}`);
      toast.success("Đã xoá nhiệm vụ.");
      handleTaskChanged();
    } catch (error) {
      console.error(error);
      toast.error("Không thể xoá nhiệm vụ.");
    }
  };

  return (
    <div className="mt-6 space-y-4">
      {filteredTasks.map((task) => (
        <Card key={task._id} className="p-5 shadow-sm border-border/40">
          <div className="flex flex-col sm:flex-row justify-between gap-4">
            {/* LEFT: thông tin task */}
            <div className="flex-1 space-y-1">
              <h3 className="font-semibold text-lg">{task.title}</h3>

              {task.description && (
                <p className="text-gray-600">{task.description}</p>
              )}

              <div className="text-sm text-gray-500 space-x-4">
                <span>
                  <strong>Bắt đầu:</strong>{" "}
                  {task.startDate ? task.startDate.slice(0, 10) : "-"}
                </span>
                <span>
                  <strong>Kết thúc:</strong>{" "}
                  {task.dueDate ? task.dueDate.slice(0, 10) : "-"}
                </span>
              </div>

              <span
                className={`inline-block px-3 py-1 rounded-full text-white text-xs mt-2 ${statusColors[task.status]}`}
              >
                {task.status}
              </span>
            </div>

            {/* RIGHT: Chọn trạng thái + xóa */}
            <div className="flex flex-col justify-center gap-3">
              <select
                className="border px-3 py-2 rounded-md text-sm"
                value={task.status}
                onChange={(e) => updateStatus(task._id, e.target.value)}
              >
                <option value="pending">Chờ xử lý</option>
                <option value="in-progress">Đang thực hiện</option>
                <option value="completed">Hoàn thành</option>
                <option value="overdue">Quá hạn</option>
              </select>

              <Button
                variant="destructive"
                className="flex items-center gap-2"
                onClick={() => deleteTask(task._id)}
              >
                <Trash2 className="w-4 h-4" />
                Xoá
              </Button>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default TaskList;
