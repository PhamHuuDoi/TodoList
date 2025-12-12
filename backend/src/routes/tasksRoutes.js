const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/taskController');

router.get('/', ctrl.getTasks);
router.get('/:id', ctrl.getTask);
router.post('/', ctrl.createTask);
router.put('/:id', ctrl.updateTask);
router.delete('/:id', ctrl.deleteTask);

router.get('/stats/status', ctrl.getStatsByStatus);
router.get('/stats/daily', ctrl.getStatsByDay);

module.exports = router;
