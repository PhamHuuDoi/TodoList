import React from "react";
import StatsAndFilters from "@/components/StatsAndFilters";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const StatsPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#fefcff]">
      <div className="container mx-auto max-w-4xl p-6 space-y-6">
        <Header />

        <div className="flex justify-end">
          <Button variant="outline" onClick={() => navigate("/")}>
            ← Quay lại danh sách
          </Button>
        </div>

        {/* BIỂU ĐỒ */}
        <StatsAndFilters
          filter="all"
          setFilter={() => {}}
          activeTasksCount={0}
          completedTasksCount={0}
        />
      </div>
    </div>
  );
};

export default StatsPage;
