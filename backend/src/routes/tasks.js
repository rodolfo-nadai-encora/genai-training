// tasks.js
const express = require("express");
const router = express.Router();
const Task = require("../models/Task");
const { isAuthenticated } = require("../middleware/auth");

function isValidDate(dateString) {
  const regEx = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateString.match(regEx)) return false; // Invalid format
  const d = new Date(dateString);
  const dNum = d.getTime();
  if (!dNum && dNum !== 0) return false; // NaN value, Invalid date
  return d.toISOString().slice(0, 10) === dateString; // Check if the date is valid
}

// GET all tasks for the logged-in user
router.get("/", isAuthenticated, async (req, res) => {
  try {
    const { status, sortBy } = req.query;

    // Create a query object to build the MongoDB query
    const query = { user: req.user._id };

    // Add filtering by status if provided
    if (status) {
      query.status = status;
    }

    // Find tasks based on the query
    let tasks = await Task.find(query);

    // Add sorting by due date if provided
    if (sortBy === "dueDate:asc") {
      tasks = tasks.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
    } else if (sortBy === "dueDate:desc") {
      tasks = tasks.sort((a, b) => new Date(b.dueDate) - new Date(a.dueDate));
    }

    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: "Error fetching tasks" });
  }
});

// CREATE a new task
router.post("/", isAuthenticated, async (req, res) => {
  try {
    const { title, description, dueDate, status } = req.body;

    // Validation: Check for required fields
    if (!title || !description || !dueDate) {
      return res.status(400).json({
        message: "Title, description, and due date are required fields.",
      });
    }

    if (!isValidDate(dueDate)) {
      return res
        .status(400)
        .json({ message: "Invalid due date format. Use YYYY-MM-DD." });
    }

    const newTask = new Task({
      ...req.body,
      user: req.user._id, // Associate task with the logged-in user
    });
    const savedTask = await newTask.save();
    res.status(201).json(savedTask);
  } catch (error) {
    res
      .status(400)
      .json({ message: "Error creating task", error: error.message });
  }
});

// GET a single task by ID for the logged-in user
router.get("/:id", isAuthenticated, async (req, res) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, user: req.user._id });
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }
    res.json(task);
  } catch (error) {
    res.status(500).json({ message: "Error fetching task" });
  }
});

// UPDATE a task by ID for the logged-in user
router.put("/:id", isAuthenticated, async (req, res) => {
  try {
    const { title, description, dueDate, status } = req.body;

    // Validation: At least one field should be updated
    if (!title || !description || !dueDate || !status) {
      return res
        .status(400)
        .json({ message: "Please provide at least one field to update." });
    }

    if (!isValidDate(dueDate)) {
      return res
        .status(400)
        .json({ message: "Invalid due date format. Use YYYY-MM-DD." });
    }

    const updatedTask = await Task.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      req.body,
      { new: true } // Return the updated document
    );
    if (!updatedTask) {
      return res.status(404).json({ message: "Task not found" });
    }
    res.json(updatedTask);
  } catch (error) {
    res.status(400).json({ message: "Error updating task" });
  }
});

router.patch("/:id", isAuthenticated, async (req, res) => {
  try {
    const { status } = req.body;

    // Validation: Check if status is provided
    if (!status) {
      return res.status(400).json({ message: "Status is required." });
    }

    // Find the task and update the status
    const updatedTask = await Task.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      { status: status }, // Update only the status field
      { new: true } // Return the updated document
    );

    if (!updatedTask) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.json(updatedTask);
  } catch (error) {
    res.status(400).json({ message: "Error updating task status" });
  }
});

// DELETE a task by ID for the logged-in user
router.delete("/:id", isAuthenticated, async (req, res) => {
  try {
    const deletedTask = await Task.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });
    if (!deletedTask) {
      return res.status(404).json({ message: "Task not found" });
    }
    res.json({ message: "Task deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting task" });
  }
});

module.exports = router;
