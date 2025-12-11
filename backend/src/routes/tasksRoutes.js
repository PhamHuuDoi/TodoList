import express from "express";
import {  createTask, getAllTasks } from "../controllers/tasksControllers.js";

const router =express.Router();

router.get("/",getAllTasks);
router.post("/", createTask);



export default router;

