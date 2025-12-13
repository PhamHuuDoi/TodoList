import React, { useEffect, useState } from "react";
import api from "@/lib/axios";
import { Card } from "@/components/ui/card";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

const COLORS = {
  pending: "#9CA3AF",
  "in-progress": "#3B82F6",
  completed: "#22C55E",
  overdue: "#EF4444",
};

const StatsCharts = () => {
  const [statusStats, setStatusStats] = useState([]);
  const [dailyStats, setDailyStats] = useState([]);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const statusRes = await api.get("/tasks/stats/status");
      const dayRes = await api.get("/tasks/stats/day");

      setStatusStats(
        Object.entries(statusRes.data).map(([key, value]) => ({
          name: key,
          value,
        }))
      );

      setDailyStats(dayRes.data);
    } catch (err) {
      console.error("Không thể tải thống kê", err);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* PIE */}
      <Card className="p-4">
        <h3 className="font-semibold mb-4">Thống kê theo trạng thái</h3>

        <PieChart width={300} height={300}>
          <Pie
            data={statusStats}
            dataKey="value"
            nameKey="name"
            outerRadius={100}
            label
          >
            {statusStats.map((entry) => (
              <Cell
                key={entry.name}
                fill={COLORS[entry.name] || "#8884d8"}
              />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </Card>

      {/* BAR */}
      <Card className="p-4">
        <h3 className="font-semibold mb-4">Thống kê 7 ngày gần nhất</h3>

        <BarChart width={350} height={300} data={dailyStats}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="day" />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Bar dataKey="count" fill="#3B82F6" />
        </BarChart>
      </Card>
    </div>
  );
};

export default StatsCharts;
