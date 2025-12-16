import mongoose from "mongoose";
const normalizeDate = (d) => {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
};

const TaskSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, default: "" },

    status: {
      type: String,
      enum: ["pending", "in-progress", "completed", "overdue"],
      default: "pending",
    },

    startDate: Date,

    endDate: {
      type: Date,
      validate: {
        validator: function (value) {
          if (!value) return true;

          return normalizeDate(value) >= normalizeDate(new Date());
        },
        message: "Ngày kết thúc không được nhỏ hơn ngày hôm nay",
      },
    },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Task", TaskSchema);
