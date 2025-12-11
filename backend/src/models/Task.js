import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
  {
    title: { 
      type: String, 
      required: true, 
      trim: true 
    },

    description: {
      type: String,
      default: ""
    },

    startDate: {
      type: Date,
      default: null
    },

    endDate: {
      type: Date,
      default: null
    },

    status: {
      type: String,
      enum: ["pending", "in-progress", "completed", "overdue"],
      default: "pending",
    },

    completedAt: {
      type: Date,
      default: null,
    }
  },
  {
    timestamps: true, 
  }
);

export default mongoose.model("Task", taskSchema);
