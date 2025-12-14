  import React, { useEffect, useState } from "react";
  import { toast } from "sonner";

  import AddTask from "@/components/AddTask";
  import EditTaskModal from "@/components/EditTaskModal";
  import DateTimeFilter from "@/components/DateTimeFilter";
  import Footer from "@/components/Footer";
  import { Header } from "@/components/Header";
  import TaskList from "@/components/TaskList";
  import TaskListPagination from "@/components/TaskListPagination";
  import StatsPanel from "@/components/StatsPanel";

  import api from "@/api/axios";
  import { visibleTaskLimit } from "@/lib/data";

  const HomePage = () => {
    const [taskBuffer, setTaskBuffer] = useState([]);
    const [activeTaskCount, setActiveTaskCount] = useState(0);
    const [completeTaskCount, setCompleteTaskCount] = useState(0);

    const [filter, setFilter] = useState("all");
    const [dateQuery, setDateQuery] = useState("all");
    const [page, setPage] = useState(1);

    // ===== STATS =====
    const [showStats, setShowStats] = useState(false);
    const [statsKey, setStatsKey] = useState(0);

    // ===== EDIT =====
    const [editingTask, setEditingTask] = useState(null);

    // ================= FETCH TASK =================
    const fetchTasks = async () => {
      try {
        const res = await api.get("/tasks");
        const tasks = Array.isArray(res.data) ? res.data : [];

        setTaskBuffer(tasks);

        setActiveTaskCount(
          tasks.filter(
            (t) => t.status === "pending" || t.status === "in-progress"
          ).length
        );

        setCompleteTaskCount(
          tasks.filter((t) => t.status === "completed").length
        );

        // refresh stats realtime
        setStatsKey((prev) => prev + 1);
      } catch (error) {
        console.error("Fetch tasks error:", error);
        toast.error("Không thể tải danh sách nhiệm vụ!");
        setTaskBuffer([]);
      }
    };

    useEffect(() => {
      fetchTasks();
    }, [dateQuery]);

    useEffect(() => {
      setPage(1);
    }, [filter, dateQuery]);

    const handleTaskChanged = () => {
      fetchTasks();
    };

    // ================= FILTER =================
    const filteredTasks = taskBuffer.filter((task) => {
      switch (filter) {
        case "active":
          return ["pending", "in-progress"].includes(task.status);
        case "completed":
          return task.status === "completed";
        case "overdue":
          return task.status === "overdue";
        default:
          return true;
      }
    });

    // ================= PAGINATION =================
    const visibleTasks = filteredTasks.slice(
      (page - 1) * visibleTaskLimit,
      page * visibleTaskLimit
    );

    const totalPages = Math.ceil(filteredTasks.length / visibleTaskLimit);

    const handleNext = () => {
      if (page < totalPages) setPage((p) => p + 1);
    };

    const handlePrev = () => {
      if (page > 1) setPage((p) => p - 1);
    };

    const handlePageChange = (p) => {
      setPage(p);
    };

    const handleEditTask = (task) => {
      setEditingTask(task);
    };

    return (
      <div className="min-h-screen w-full bg-[#fefcff] relative">
        {/* BACKGROUND */}
        <div
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: `
              radial-gradient(circle at 30% 70%, rgba(173, 216, 230, 0.35), transparent 60%),
              radial-gradient(circle at 70% 30%, rgba(255, 182, 193, 0.4), transparent 60%)
            `,
          }}
        />

        <div className="container relative z-10 pt-8 mx-auto">
          <div className="w-full max-w-2xl p-6 mx-auto space-y-6">
            {/* HEADER */}
            <Header />

            {/* ADD TASK */}
            <AddTask handleNewTaskAdded={handleTaskChanged} />

            {/* ===== STATS TOGGLE ===== */}
            <div className="flex justify-end">
              <button
                className="px-4 py-2 rounded-md bg-primary text-white hover:opacity-90 transition"
                onClick={() => setShowStats((v) => !v)}
              >
                {showStats ? "Ẩn thống kê" : "Xem thống kê"}
              </button>
            </div>

            {showStats && <StatsPanel refreshKey={statsKey} />}

            {/* TASK LIST */}
            <TaskList
              filteredTasks={visibleTasks}
              handleTaskChanged={handleTaskChanged}
              onEditTask={handleEditTask}
            />

            {/* PAGINATION + DATE FILTER */}
            <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
              <TaskListPagination
                handleNext={handleNext}
                handlePrev={handlePrev}
                handlePageChange={handlePageChange}
                page={page}
                totalPages={totalPages}
              />

              <DateTimeFilter dateQuery={dateQuery} setDateQuery={setDateQuery} />
            </div>

            {/* FOOTER */}
            <Footer
              activeTasksCount={activeTaskCount}
              completedTasksCount={completeTaskCount}
            />
          </div>
        </div>

        {/* MODAL EDIT */}
        {editingTask && (
          <EditTaskModal
            task={editingTask}
            onClose={() => setEditingTask(null)}
            onUpdated={handleTaskChanged}
          />
        )}
      </div>
    );
  };

  export default HomePage;
