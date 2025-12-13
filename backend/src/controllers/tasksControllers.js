import Task from '../models/Task.js';


function normalizeDate(d) {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}

function calculateStatus(task) {
  if (!task.endDate) return task.status;

  const today = normalizeDate(new Date());
  const end = normalizeDate(task.endDate);

  if (task.status !== 'completed' && end < today) {
    return 'overdue';
  }
  return task.status;
}


const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find().sort({ createdAt: -1 });

    const result = tasks.map(t => {
      const obj = t.toObject();
      obj.status = calculateStatus(obj); // không lưu DB
      return obj;
    });

    res.json(result);
  } catch (err) {
    res.status(500).json({ error: 'Lỗi server' });
  }
};

const getTaskById = async (req, res) => {
  try {
    const t = await Task.findById(req.params.id);
    if (!t) return res.status(404).json({ message: 'Task not found' });

    const obj = t.toObject();
    obj.status = calculateStatus(obj);

    res.json(obj);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const createTask = async (req, res) => {
  try {
    const data = req.body;

    // không cho set overdue
    if (data.status === 'overdue') {
      return res.status(400).json({ error: 'Không thể set quá hạn thủ công' });
    }

    if (data.startDate && data.endDate) {
      if (new Date(data.endDate) < new Date(data.startDate)) {
        return res.status(400).json({ error: 'Ngày kết thúc phải sau ngày bắt đầu' });
      }
    }

    const t = new Task(data);
    const saved = await t.save();

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
    if (!task) return res.status(404).json({ message: 'Task not found' });

    // chặn sửa task đã quá hạn
    const today = normalizeDate(new Date());
    if (
      task.endDate &&
      normalizeDate(task.endDate) < today &&
      task.status !== 'completed'
    ) {
      return res.status(400).json({
        error: 'Task đã quá hạn, không thể chỉnh sửa'
      });
    }

    // không cho set overdue
    if (req.body.status === 'overdue') {
      return res.status(400).json({ error: 'Không thể set quá hạn thủ công' });
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
    if (!deleted) return res.status(404).json({ message: 'Task not found' });
    res.json({ message: 'Task deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export default {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask
};
