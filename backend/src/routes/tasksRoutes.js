import express from "express";
import taskController from "../controllers/tasksControllers.js";

const router = express.Router();

router.get("/", taskController.getTasks);
router.get("/stats/day", taskController.getStatsByDay);
router.post("/", taskController.createTask);
router.put("/:id", taskController.updateTask);
router.delete("/:id", taskController.deleteTask);

export default router;
