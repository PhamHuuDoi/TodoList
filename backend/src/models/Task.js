import mongoose from 'mongoose';

const TaskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, default: '' },

  status: {
    type: String,
    enum: ['pending', 'in-progress', 'completed', 'overdue'],
    default: 'pending'
  },

  startDate: Date,
  endDate: Date,
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Task', TaskSchema);
