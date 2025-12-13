import express from 'express';
import ctrl from '../controllers/tasksControllers.js';

const router = express.Router();
router.get('/', ctrl.getTasks);
router.post('/', ctrl.createTask);
router.get('/stats/status', ctrl.getStatsByStatus);
router.get('/stats/day', ctrl.getStatsByDay);
router.get('/:id', ctrl.getTaskById);
router.put('/:id', ctrl.updateTask);
router.delete('/:id', ctrl.deleteTask);
export default router;