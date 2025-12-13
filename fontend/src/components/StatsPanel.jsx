import React, { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import api from "@/lib/axios";

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

const COLORS = {
  pending: "#9CA3AF",
  "in-progress": "#6366F1",
  completed: "#22C55E",
  overdue: "#EF4444",
};

const formatDay = (dateStr) => {
  const d = new Date(dateStr);
  return `${d.getDate()}/${d.getMonth() + 1}`;
};

const StatsPanel = ({ refreshKey }) => {
  const [statusStats, setStatusStats] = useState([]);
  const [dailyStats, setDailyStats] = useState([]);

  useEffect(() => {
    fetchStats();
  }, [refreshKey]);

  const fetchStats = async () => {
    try {
      const [statusRes, dayRes] = await Promise.all([
        api.get("/tasks/stats/status"),
        api.get("/tasks/stats/day?days=7"),
      ]);

      // ===== PIE DATA =====
      const pieData = Object.entries(statusRes.data)
        .filter(([_, v]) => v > 0)
        .map(([k, v]) => ({
          name: k,
          value: v,
        }));

      setStatusStats(pieData);

      // ===== BAR DATA (FIX CHUẨN) =====
      const barData = dayRes.data.map((d) => ({
        ...d,
        label: formatDay(d.day),
      }));

      setDailyStats(barData);
    } catch (err) {
      console.error("Stats error:", err);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* ===== PIE ===== */}
      <Card className="p-5">
        <h3 className="font-semibold mb-4">Thống kê theo trạng thái</h3>

        <ResponsiveContainer width="100%" height={260}>
          <PieChart>
            <Pie
              data={statusStats}
              dataKey="value"
              nameKey="name"
              innerRadius={65}
              outerRadius={95}
              paddingAngle={4}
            >
              {statusStats.map((entry) => (
                <Cell
                  key={entry.name}
                  fill={COLORS[entry.name] || "#8884d8"}
                />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>

        <div className="flex justify-center gap-4 mt-4 text-sm">
          {statusStats.map((s) => (
            <div key={s.name} className="flex items-center gap-2">
              <span
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: COLORS[s.name] }}
              />
              <span>
                {s.name}: {s.value}
              </span>
            </div>
          ))}
        </div>
      </Card>

      {/* ===== BAR ===== */}
      <Card className="p-5">
        <h3 className="font-semibold mb-4">7 ngày gần nhất</h3>

        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={dailyStats}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="label" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Bar
              dataKey="count"
              fill="#6366F1"
              barSize={28}
              radius={[6, 6, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </Card>
    </div>
  );
};

export default StatsPanel;
