const Task = require('../models/Task');
function applyOverdue(taskObj) {
  if (!taskObj) return taskObj;
  try {
    if (taskObj.status !== 'completed' && taskObj.endDate) {
      const now = new Date();
      if (new Date(taskObj.endDate) < now) {
        taskObj.status = 'overdue';
      }
    }
  } catch (e) {
  }
  return taskObj;
}

exports.getTasks = async (req, res) => {
  try {
    const filter = {};
    if (req.query.status) filter.status = req.query.status;
    const tasks = await Task.find(filter).sort({ createdAt: -1 });
    const out = tasks.map(t => applyOverdue(t.toObject()));
    res.json(out);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getTaskById = async (req, res) => {
  try {
    const t = await Task.findById(req.params.id);
    if (!t) return res.status(404).json({ message: 'Task not found' });
    res.json(applyOverdue(t.toObject()));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createTask = async (req, res) => {
  try {
    const data = req.body;
    if (data.startDate && data.endDate) {
      if (new Date(data.endDate) < new Date(data.startDate)) {
        return res.status(400).json({ error: 'endDate must be same or after startDate' });
      }
    }
    const t = new Task(data);
    const saved = await t.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
exports.updateTask = async (req, res) => {
  try {
    const data = req.body;
    if (data.startDate && data.endDate) {
      if (new Date(data.endDate) < new Date(data.startDate)) {
        return res.status(400).json({ error: 'endDate must be same or after startDate' });
      }
    }
    const updated = await Task.findByIdAndUpdate(req.params.id, data, { new: true });
    if (!updated) return res.status(404).json({ message: 'Task not found' });
    res.json(applyOverdue(updated.toObject()));
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
exports.deleteTask = async (req, res) => {
  try {
    const deleted = await Task.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Task not found' });
    res.json({ message: 'Task deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
// stats by status
exports.getStatsByStatus = async (req, res) => {
  try {
    const stats = await Task.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);
    const map = { pending: 0, 'in-progress': 0, completed: 0, overdue: 0 };
    stats.forEach(s => { map[s._id] = s.count; });
    const now = new Date();
    const candidates = await Task.find({ status: { $ne: 'completed' }, endDate: { $exists: true } });
    candidates.forEach(t => {
      if (t.endDate && new Date(t.endDate) < now) {
        // if DB status already 'overdue' it's counted; otherwise adjust
        if (t.status !== 'overdue') {
          map['overdue'] = (map['overdue'] || 0) + 1;
          map[t.status] = Math.max(0, (map[t.status] || 0) - 1);
        }
      }
    });

    res.json(map);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// stats by day (createdAt) for last N days (default 7)
exports.getStatsByDay = async (req, res) => {
  try {
    const days = parseInt(req.query.days || '7', 10);
    const start = new Date();
    start.setHours(0,0,0,0);
    start.setDate(start.getDate() - (days - 1));

    const stats = await Task.aggregate([
      { $match: { createdAt: { $gte: start } } },
      { $project: { day: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } } } },
      { $group: { _id: '$day', count: { $sum: 1 } } },
      { $sort: { _id: 1 } }
    ]);

    const result = [];
    for (let i = 0; i < days; i++) {
      const d = new Date();
      d.setHours(0,0,0,0);
      d.setDate(d.getDate() - (days - 1 - i));
      const key = d.toISOString().slice(0,10);
      const found = stats.find(s => s._id === key);
      result.push({ day: key, count: found ? found.count : 0 });
    }

    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
