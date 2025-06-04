const Task = require('../models/Task');
const User = require('../models/User');
const { ioInstance, getSocketIdByUserId } = require('../sockets/socket');

// CREATE TASK (Manager)
exports.createTask = async (req, res) => {
  try {
    const { title, description, assignedTo, dueDate } = req.body;

    if (!title || !description || !assignedTo || !dueDate)
      return res.status(400).json({ message: 'All fields are required' });

    const assignedUser = await User.findById(assignedTo);
    if (!assignedUser || assignedUser.role !== 'Employee')
      return res.status(400).json({ message: 'Assigned user must be a valid employee' });

    const task = await Task.create({
      title,
      description,
      assignedTo,
      dueDate,
      createdBy: req.user._id
    });

    // 🔔 Real-time Notify Assigned Employee
    const assignedSocket = getSocketIdByUserId(assignedTo);
    if (assignedSocket && ioInstance.io) {
      ioInstance.io.to(assignedSocket).emit('newTask', {
        message: `You have a new task: ${task.title}`,
        task
      });
    }

    res.status(201).json({ message: 'Task created successfully', task });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// UPDATE TASK
exports.updateTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });

    if (req.user.role === 'Manager') {
      const { title, description, assignedTo, dueDate, status } = req.body;

      if (assignedTo) {
        const assignedUser = await User.findById(assignedTo);
        if (!assignedUser || assignedUser.role !== 'Employee') {
          return res.status(400).json({ message: 'Assigned user must be a valid employee' });
        }
      }

      task.title = title || task.title;
      task.description = description || task.description;
      task.assignedTo = assignedTo || task.assignedTo;
      task.dueDate = dueDate || task.dueDate;
      task.status = status || task.status;

      // Notify the assigned employee about the update
      const assignedSocket = getSocketIdByUserId(task.assignedTo);
      if (assignedSocket && ioInstance.io) {
        ioInstance.io.to(assignedSocket).emit('taskUpdated', {
          message: `Task "${task.title}" has been updated`,
          task
        });
      }
    } else if (req.user.role === 'Employee') {
      if (String(task.assignedTo) !== String(req.user._id))
        return res.status(403).json({ message: 'You are not assigned to this task' });

      task.status = req.body.status || task.status;

      // 🔔 Notify Manager on status update
      const managerSocket = getSocketIdByUserId(task.createdBy);
      if (managerSocket && ioInstance.io) {
        ioInstance.io.to(managerSocket).emit('taskStatusChanged', {
          message: `${req.user.name} updated task status`,
          task
        });
      }
    }

    await task.save();
    res.status(200).json({ message: 'Task updated successfully', task });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// DELETE TASK (Manager only)
exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });

    // Only manager who created the task can delete
    if (req.user.role !== 'Manager' || String(task.createdBy) !== String(req.user._id)) {
      return res.status(403).json({ message: 'Not authorized to delete this task' });
    }

    const assignedTo = task.assignedTo;
    const taskTitle = task.title;

    await task.deleteOne();

    // 🔔 Notify assigned employee about deletion
    const assignedSocket = getSocketIdByUserId(assignedTo);
    if (assignedSocket && ioInstance.io) {
      ioInstance.io.to(assignedSocket).emit('taskDeleted', {
        message: `Task "${taskTitle}" has been deleted.`,
        taskId: req.params.id
      });
    }

    res.status(200).json({ message: 'Task deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
// GET TASKS (All users)
exports.getTasks = async (req, res) => {
  try {
    let tasks;
    if (req.user.role === 'Manager') {
      // Managers see all tasks they created
      tasks = await Task.find({ createdBy: req.user._id }).populate('assignedTo', 'name email');
    } else if (req.user.role === 'Employee') {
      // Employees see only tasks assigned to them
      tasks = await Task.find({ assignedTo: req.user._id }).populate('createdBy', 'name email');
    } else {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.status(200).json({ message: 'Tasks retrieved successfully', tasks });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
}