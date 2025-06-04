const express = require('express');
const router = express.Router();

const {
  createTask,
  getTasks,
  updateTask,
  deleteTask,
} = require('../controllers/task.controller');

const { protect, authorizeRoles } = require('../middleware/auth.middleware');

// All routes below require login
router.use(protect);

// Managers: Create a new task
router.post('/', authorizeRoles('Manager'), createTask);

// All: Get relevant tasks (Manager: All created, Employee: Assigned)
router.get('/', getTasks);

// All: Update task (Manager: full, Employee: status only)
router.patch('/:id', updateTask);

// Managers: Delete a task
router.delete('/:id', authorizeRoles('Manager'), deleteTask);

module.exports = router;
