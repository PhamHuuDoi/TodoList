  import jwt from "jsonwebtoken";

  export const protect = (req, res, next) => {
    // COOKIE
    const token = req.cookies?.token;

    if (!token) {
      return res.status(401).json({ message: "Chưa đăng nhập" });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.userId = decoded.id;
      // GẮN USER ID
      next();
    } catch (err) {
      res.status(401).json({ message: "Token không hợp lệ hoặc hết hạn" });
    }
  };
