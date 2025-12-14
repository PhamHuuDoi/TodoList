import express from "express";
import taskController from "../controllers/tasksControllers.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.use(protect);

router.get("/", taskController.getTasks);
router.get("/stats/day", taskController.getStatsByDay);
router.post("/", taskController.createTask);
router.put("/:id", taskController.updateTask);
router.delete("/:id", taskController.deleteTask);

export default router;
