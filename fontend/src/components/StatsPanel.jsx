import React, { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import api from "@/lib/axios";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
} from "chart.js";
import { Doughnut, Bar } from "react-chartjs-2";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement
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

  const [dailyStats, setDailyStats] = useState([]);

  const fetchStats = async () => {
    const [tasksRes, dayRes] = await Promise.all([
      api.get("/tasks"),
      api.get("/tasks/stats/day?days=7"),
    ]);

    const map = {
      pending: 0,
      "in-progress": 0,
      "due-soon": 0,
      completed: 0,
      overdue: 0,
    };

    tasksRes.data.forEach((t) => {
      const status = getDisplayStatus(t);
      map[status]++;
    });

    setStats(map);
    setDailyStats(dayRes.data);
  };

  useEffect(() => {
    fetchStats();
  }, [refreshKey]);

  // ===== DONUT =====
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
          "#f59e0b", // due-soon (cam)
          "#22c55e", // completed
          "#ef4444", // overdue
        ],
        borderWidth: 4,
        cutout: "70%",
      },
    ],
  };

  // ===== BAR =====
  const barData = {
    labels: dailyStats.map((d) =>
      new Date(d.day).toLocaleDateString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
      })
    ),
    datasets: [
      {
        label: "Số nhiệm vụ tạo",
        data: dailyStats.map((d) => d.count),
        backgroundColor: "#6366f1",
        borderRadius: 8,
        maxBarThickness: 32,
      },
    ],
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        ticks: { stepSize: 1 },
      },
    },
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card className="p-6">
        <h3 className="font-semibold mb-4">Thống kê theo trạng thái</h3>
        <Doughnut data={doughnutData} />
      </Card>

      <Card className="p-6 h-[320px]">
        <h3 className="font-semibold mb-4">7 ngày gần nhất</h3>
        <Bar data={barData} options={barOptions} />
      </Card>
    </div>
  );
};

export default StatsPanel;
