const Task = require('../models/task');

exports.createTask = async (req, res) => {
  const { title, description, status } = req.body;
  const task = new Task({ title, description, status, userId: req.user.id });
  await task.save();
  res.status(201).json(task);
};

exports.getTasks = async (req, res) => {
  const tasks = await Task.find({ userId: req.user.id });
  res.json(tasks);
};

exports.updateTask = async (req, res) => {
  const { id } = req.params;
  const task = await Task.findByIdAndUpdate(id, req.body, { new: true });
  res.json(task);
};

exports.deleteTask = async (req, res) => {
  const { id } = req.params;
  await Task.findByIdAndDelete(id);
  res.json({ message: 'Task deleted' });
};
