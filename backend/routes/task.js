const express = require('express');
const { createTask, getTasks, updateTask, deleteTask } = require('../controllers/taskcontroller');
const auth = require('../middlewares/auth');
const router = express.Router();

router.post('/tasks', auth, createTask);
router.get('/tasks', auth, getTasks);
router.put('/tasks/:id', auth, updateTask);
router.delete('/tasks/:id', auth, deleteTask);

module.exports = router;
