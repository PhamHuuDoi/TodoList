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

// LẤY TASK RIÊNG THEO USER
const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ userId: req.userId }).sort({
      createdAt: -1,
    });

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

//  LẤY 1 TASK CỦA USER
const getTaskById = async (req, res) => {
  try {
    const task = await Task.findOne({
      _id: req.params.id,
      userId: req.userId,
    });

    if (!task) return res.status(404).json({ message: "Task not found" });

    const obj = task.toObject();
    obj.status = calculateStatus(obj);

    res.json(obj);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

//  TẠO TASK GẮN USER
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

    const createdAt = data.startDate ? new Date(data.startDate) : new Date();

    const task = new Task({
      ...data,
      createdAt,
      userId: req.userId, // lay userId từ middleware bảo vệ
    });

    const saved = await task.save();

    const obj = saved.toObject();
    obj.status = calculateStatus(obj);

    res.status(201).json(obj);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

//UPDATE TASK 
const updateTask = async (req, res) => {
  try {
    const task = await Task.findOne({
      _id: req.params.id,
      userId: req.userId,
    });

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

//  XÓA TASK CỦA USER
const deleteTask = async (req, res) => {
  try {
    const deleted = await Task.findOneAndDelete({
      _id: req.params.id,
      userId: req.userId,
    });

    if (!deleted) return res.status(404).json({ message: "Task not found" });

    res.json({ message: "Task deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* ===== STATS THEO USER ===== */
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
          userId: req.userId,
          createdAt: { $gte: start, $lte: end },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: {
              format: "%Y-%m-%d",
              date: "$createdAt",
            },
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
        day: d,
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
