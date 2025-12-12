import React, { useEffect, useState } from "react";
import api from "@/lib/axios";
import { Card } from "./ui/card";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
} from "chart.js";
import { Pie, Bar } from "react-chartjs-2";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement
);

const Stats = () => {
  const [statusStats, setStatusStats] = useState({
    pending: 0,
    "in-progress": 0,
    completed: 0,
    overdue: 0,
  });

  const [dailyStats, setDailyStats] = useState([]);

  const loadStats = async () => {
    try {
      const statusRes = await api.get("/tasks/stats/status");
      const dailyRes = await api.get("/tasks/stats/day?days=7");

      setStatusStats(statusRes.data);
      setDailyStats(dailyRes.data);
    } catch (error) {
      console.error(error);
    }
  };

useEffect(() => {
  const load = async () => {
    await loadStats();
  };

  load();
}, []);
  const pieData = {
    labels: ["Chờ xử lý", "Đang thực hiện", "Hoàn thành", "Quá hạn"],
    datasets: [
      {
        data: [
          statusStats.pending,
          statusStats["in-progress"],
          statusStats.completed,
          statusStats.overdue,
        ],
        backgroundColor: ["#9e9e9e", "#1e88e5", "#43a047", "#e53935"],
      },
    ],
  };

  const barData = {
    labels: dailyStats.map((d) => d.day),
    datasets: [
      {
        label: "Số nhiệm vụ tạo",
        data: dailyStats.map((d) => d.count),
        backgroundColor: "#1e88e5",
      },
    ],
  };

  return (
    <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card className="p-6 shadow border-border/40">
        <h2 className="font-semibold text-lg mb-4">Thống kê theo trạng thái</h2>
        <Pie data={pieData} />
      </Card>

      <Card className="p-6 shadow border-border/40">
        <h2 className="font-semibold text-lg mb-4">Thống kê 7 ngày gần nhất</h2>
        <Bar data={barData} />
      </Card>
    </div>
  );
};

export default Stats;
