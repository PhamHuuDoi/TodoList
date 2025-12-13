import Task from "../models/Task.js";

/* ===== helpers ===== */
const normalizeDate = (d) => {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
};

const calculateStatus = (task) => {
  if (task.status === "completed") return "completed";
  if (!task.endDate) return task.status;

  const today = normalizeDate(new Date());
  const end = normalizeDate(task.endDate);

  if (end < today) return "overdue";
  if (end.getTime() === today.getTime()) return "due-soon";

  return task.status;
};

/* ===== CRUD ===== */
const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find().sort({ createdAt: -1 });

    const result = tasks.map((t) => {
      const obj = t.toObject();
      obj.status = calculateStatus(obj);
      return obj;
    });

    res.json(result);
  } catch (err) {
    res.status(500).json({ error: "Lỗi server" });
  }
};

const getTaskById = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: "Task not found" });

    const obj = task.toObject();
    obj.status = calculateStatus(obj);

    res.json(obj);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const createTask = async (req, res) => {
  try {
    const data = req.body;

    if (data.status === "overdue") {
      return res.status(400).json({ error: "Không thể set quá hạn thủ công" });
    }

    if (data.startDate && data.endDate) {
      if (new Date(data.endDate) < new Date(data.startDate)) {
        return res
          .status(400)
          .json({ error: "Ngày kết thúc phải sau ngày bắt đầu" });
      }
    }

    const task = new Task(data);
    const saved = await task.save();

    const obj = saved.toObject();
    obj.status = calculateStatus(obj);

    res.status(201).json(obj);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const updateTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: "Task not found" });

    if (req.body.status === "overdue") {
      return res.status(400).json({ error: "Không thể set quá hạn thủ công" });
    }

    Object.assign(task, req.body);
    await task.save();

    const obj = task.toObject();
    obj.status = calculateStatus(obj);

    res.json(obj);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const deleteTask = async (req, res) => {
  try {
    const deleted = await Task.findByIdAndDelete(req.params.id);
    if (!deleted)
      return res.status(404).json({ message: "Task not found" });

    res.json({ message: "Task deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* ===== STATS: 7 ngày gần nhất ===== */
const getStatsByDay = async (req, res) => {
  try {
    const days = parseInt(req.query.days || "7", 10);

    const end = new Date();
    end.setHours(23, 59, 59, 999);

    const start = new Date();
    start.setDate(end.getDate() - (days - 1));
    start.setHours(0, 0, 0, 0);

    const raw = await Task.aggregate([
      {
        $match: {
          createdAt: { $gte: start, $lte: end },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
          },
          count: { $sum: 1 },
        },
      },
    ]);

    const map = {};
    raw.forEach((r) => {
      map[r._id] = r.count;
    });

    const result = [];
    for (let i = 0; i < days; i++) {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      const key = d.toISOString().slice(0, 10);

      result.push({
        day: key,
        count: map[key] || 0,
      });
    }

    res.json(result);
  } catch (err) {
    console.error("Stats error:", err);
    res.status(500).json({ error: "Stats error" });
  }
};

/* ===== EXPORT ===== */
export default {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
  getStatsByDay,
};