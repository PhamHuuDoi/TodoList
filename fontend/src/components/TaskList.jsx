import React from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Trash2, Pencil } from "lucide-react";
import { toast } from "sonner";
import api from "@/lib/axios";

const statusColors = {
  pending: "bg-gray-400",
  "in-progress": "bg-blue-500",
  completed: "bg-green-500",
  overdue: "bg-red-500",
};

// helper hiển thị trạng thái theo ngày
const getDisplayStatus = (task) => {
  if (!task.endDate || task.status === "completed") return task.status;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const end = new Date(task.endDate);
  end.setHours(0, 0, 0, 0);

  if (end < today) return "overdue";
  if (end.getTime() === today.getTime()) return "due-soon";

  return task.status;
};

const TaskList = ({ filteredTasks, handleTaskChanged, onEditTask }) => {
  if (!filteredTasks.length) {
    return (
      <div className="text-gray-500 text-center py-4">
        Không có nhiệm vụ nào.
      </div>
    );
  }

  // Xóa task 
  const deleteTask = async (task) => {
    if (!confirm("Bạn có chắc muốn xoá nhiệm vụ này?")) return;

    try {
      await api.delete(`/tasks/${task._id}`);
      toast.success("Đã xoá nhiệm vụ.");
      handleTaskChanged();
    } catch {
      toast.error("Không thể xoá nhiệm vụ.");
    }
  };

  return (
    <div className="mt-6 space-y-4">
      {filteredTasks.map((task) => {
        const displayStatus = getDisplayStatus(task);

        return (
          <Card key={task._id} className="p-5 shadow-sm border-border/40">
            <div className="flex flex-col sm:flex-row justify-between gap-4">
              {/* LEFT */}
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
                    {task.endDate ? task.endDate.slice(0, 10) : "-"}
                  </span>
                </div>

                <span
                  className={`inline-block px-3 py-1 rounded-full text-white text-xs mt-2 ${
                    displayStatus === "due-soon"
                      ? "bg-orange-500"
                      : statusColors[displayStatus]
                  }`}
                >
                  {displayStatus === "due-soon"
                    ? "Cận đến hạn"
                    : displayStatus}
                </span>
              </div>

              {/* RIGHT */}
              <div className="flex flex-col justify-center gap-3">
                {/* CHỈNH SỬA */}
                <Button
                  variant="outline"
                  className="flex items-center gap-2"
                  onClick={() => onEditTask(task)}
                >
                  <Pencil className="w-4 h-4" />
                  Chỉnh sửa
                </Button>

                {/* XOÁ */}
                <Button
                  variant="destructive"
                  className="flex items-center gap-2"
                  onClick={() => deleteTask(task)}
                >
                  <Trash2 className="w-4 h-4" />
                  Xoá
                </Button>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
};

export default TaskList;
