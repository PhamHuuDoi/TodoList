const Task = require('../models/Task');

// Auto set overdue if endDate < today
const markOverdueIfNeeded = (task) => {
  if (!task) return task;

  if (task.status !== 'completed' && task.endDate) {
    const now = new Date();
    if (new Date(task.endDate) < now) {
      task.status = 'overdue';
    }
  }

  return task;
};

exports.getTasks = async (req, res) => {
  try {
    const filter = {};
    if (req.query.status) filter.status = req.query.status;
    
    let tasks = await Task.find(filter).sort({ createdAt: -1 });

    tasks = tasks.map(t => markOverdueIfNeeded(t.toObject()));

    res.json(tasks);
  } catch (err) { res.status(500).json({ error: err.message }); }
};

exports.getTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: 'Not found' });

    res.json(markOverdueIfNeeded(task.toObject()));
  } catch (err) { res.status(500).json({ error: err.message }); }
};

exports.createTask = async (req, res) => {
  try {
    const data = req.body;

    if (data.startDate && data.endDate && new Date(data.endDate) < new Date(data.startDate)) {
      return res.status(400).json({ error: 'endDate must be after startDate' });
    }

    const t = new Task(data);
    const saved = await t.save();
    res.status(201).json(saved);

  } catch (err) { res.status(400).json({ error: err.message }); }
};

exports.updateTask = async (req, res) => {
  try {
    const data = req.body;

    if (data.startDate && data.endDate && new Date(data.endDate) < new Date(data.startDate)) {
      return res.status(400).json({ error: 'endDate must be after startDate' });
    }

    const updated = await Task.findByIdAndUpdate(req.params.id, data, { new: true });
    if (!updated) return res.status(404).json({ message: 'Not found' });

    res.json(markOverdueIfNeeded(updated.toObject()));

  } catch (err) { res.status(400).json({ error: err.message }); }
};

exports.deleteTask = async (req, res) => {
  try {
    const deleted = await Task.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Not found' });

    res.json({ message: 'Deleted' });

  } catch (err) { res.status(500).json({ error: err.message }); }
};

// Statistic by status
exports.getStatsByStatus = async (req, res) => {
  try {
    const stats = await Task.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } }
    ]);

    // default 4 statuses
    const map = { 'pending':0, 'in-progress':0, 'completed':0, 'overdue':0 };
    stats.forEach(s => map[s._id] = s.count);

    res.json(map);

  } catch (err) { res.status(500).json({ error: err.message }); }
};

// Statistic by day
exports.getStatsByDay = async (req, res) => {
  try {
    const days = parseInt(req.query.days || '7', 10);

    const start = new Date();
    start.setHours(0,0,0,0);
    start.setDate(start.getDate() - (days - 1));

    const stats = await Task.aggregate([
      { $match: { createdAt: { $gte: start } } },
      { $project: {
          day: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } }
      }},
      { $group: { _id: "$day", count: { $sum: 1 } } },
      { $sort: { _id: 1 } }
    ]);

    const result = [];
    for (let i = 0; i < days; i++) {
      const d = new Date();
      d.setHours(0,0,0,0);
      d.setDate(d.getDate() - (days - 1 - i));

      const key = d.toISOString().slice(0,10);
      const f = stats.find(s => s._id === key);

      result.push({ day: key, count: f ? f.count : 0 });
    }

    res.json(result);

  } catch (err) { res.status(500).json({ error: err.message }); }
};
