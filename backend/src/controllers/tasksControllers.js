import Task from "../models/Task.js";

/* ===== helpers ===== */
const calculateStatus = (task) => {
  if (task.status === "completed") return "completed";
  if (!task.endDate) return task.status;

  if (task.endDate < new Date()) return "overdue";
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
  } catch {
    res.status(500).json({ error: "Lỗi server" });
  }
};

// LẤY 1 TASK
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

// TẠO TASK
const createTask = async (req, res) => {
  try {
    if (req.body.status === "overdue") {
      return res.status(400).json({
        error: "Không thể set quá hạn thủ công",
      });
    }

    const task = new Task({
      ...req.body,
      userId: req.userId,
    });

    const saved = await task.save(); // schema tự validate

    const obj = saved.toObject();
    obj.status = calculateStatus(obj);

    res.status(201).json(obj);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// UPDATE
const updateTask = async (req, res) => {
  try {
    const task = await Task.findOne({
      _id: req.params.id,
      userId: req.userId,
    });

    if (!task) return res.status(404).json({ message: "Task not found" });

    if (req.body.status === "overdue") {
      return res.status(400).json({
        error: "Không thể set quá hạn thủ công",
      });
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

// DELETE
const deleteTask = async (req, res) => {
  try {
    const deleted = await Task.findOneAndDelete({
      _id: req.params.id,
      userId: req.userId,
    });

    if (!deleted)
      return res.status(404).json({ message: "Task not found" });

    res.json({ message: "Task deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export default {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
};
