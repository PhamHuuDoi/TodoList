import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Kết nối CSDL thành công");
  } catch (error) {
    console.error("Lỗi khi kết nối CSDL:", error);
  }
};
