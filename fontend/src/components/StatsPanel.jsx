import React, { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import api from "@/lib/axios";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Doughnut } from "react-chartjs-2";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend
);

// ===== helper =====
const normalizeDate = (d) => {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
};

const getDisplayStatus = (task) => {
  if (task.status === "completed") return "completed";
  if (!task.endDate) return task.status;

  const today = normalizeDate(new Date());
  const end = normalizeDate(task.endDate);

  if (end < today) return "overdue";
  if (end.getTime() === today.getTime()) return "due-soon";

  return task.status;
};

const StatsPanel = ({ refreshKey }) => {
  const [stats, setStats] = useState({
    pending: 0,
    "in-progress": 0,
    "due-soon": 0,
    completed: 0,
    overdue: 0,
  });

  const fetchStats = async () => {
    const res = await api.get("/tasks");

    const map = {
      pending: 0,
      "in-progress": 0,
      "due-soon": 0,
      completed: 0,
      overdue: 0,
    };

    res.data.forEach((t) => {
      const status = getDisplayStatus(t);
      map[status]++;
    });

    setStats(map);
  };

  useEffect(() => {
    fetchStats();
  }, [refreshKey]);

  // ===== DOUGHNUT =====
  const doughnutData = {
    labels: [
      "Chờ xử lý",
      "Đang làm",
      "Gần đến hạn",
      "Hoàn thành",
      "Quá hạn",
    ],
    datasets: [
      {
        data: [
          stats.pending,
          stats["in-progress"],
          stats["due-soon"],
          stats.completed,
          stats.overdue,
        ],
        backgroundColor: [
          "#9ca3af", // pending
          "#6366f1", // in-progress
          "#f59e0b", // due-soon
          "#22c55e", // completed
          "#ef4444", // overdue
        ],
        borderWidth: 4,
        cutout: "70%",
      },
    ],
  };

  return (
    <div className="grid grid-cols-1">
      <Card className="p-6 max-w-md mx-auto">
        <h3 className="font-semibold mb-4 text-center">
          Thống kê công việc
        </h3>
        <Doughnut data={doughnutData} />
      </Card>
    </div>
  );
};

export default StatsPanel;
