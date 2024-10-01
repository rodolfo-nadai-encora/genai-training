import React, { useState, useEffect } from "react";
import axios from "axios";
import { backendUrl } from "../constants";
import TaskItem from "./TaskItem";
import TaskForm from "./TaskForm"; // Import TaskForm

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingTask, setEditingTask] = useState(null);
  const [showTaskForm, setShowTaskForm] = useState(false); // State for form visibility
  const [filterStatus, setFilterStatus] = useState("all"); // "all", "pending", "in-progress", "completed"
  const [sortOrder, setSortOrder] = useState("none"); // "none", "asc", "desc"

  const handleEditTask = (task) => {
    setEditingTask(task);
    setShowTaskForm(true);
  };

  const fetchTasks = async () => {
    try {
      // Construct the query parameters for filtering and sorting
      const queryParams = new URLSearchParams({
        status: filterStatus !== "all" ? filterStatus : "", // Only add status if not "all"
        sortBy: sortOrder !== "none" ? `dueDate:${sortOrder}` : "", // Add sortBy if not "none"
      });

      const response = await axios.get(
        `${backendUrl}/api/tasks?${queryParams.toString()}`, // Append query parameters to URL
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
          },
        }
      );
      setTasks(response.data);
    } catch (error) {
      setError("Error fetching tasks");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks(); // Call fetchTasks whenever filterStatus or sortOrder changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterStatus, sortOrder]);

  useEffect(() => {
    // Function to check for and show notifications
    const checkAndShowNotifications = () => {
      const now = new Date();
      const oneDayAhead = new Date(now.getTime() + 24 * 60 * 60 * 1000);

      tasks.forEach((task) => {
        const taskDueDate = new Date(task.dueDate);

        if (
          task.status === "pending" &&
          sessionStorage.getItem("notificationsEnabled") === "true"
        ) {
          if (taskDueDate < now && !task.overdueNotified) {
            // Overdue notification
            showNotification("Task Overdue!", `"${task.title}" is overdue.`);
            // Mark task as overdue notified (you might need to update this in your backend as well)
            task.overdueNotified = true;
          } else if (
            taskDueDate > now &&
            taskDueDate < oneDayAhead &&
            !task.dueSoonNotified
          ) {
            // Due soon notification
            showNotification(
              "Task Due Soon!",
              `"${task.title}" is due in less than 24 hours.`
            );
            // Mark task as due soon notified
            task.dueSoonNotified = true;
          }
        }
      });
    };

    // Function to show a browser notification
    const showNotification = (title, body) => {
      if (Notification.permission === "granted") {
        new Notification(title, { body });
      } else if (Notification.permission !== "denied") {
        Notification.requestPermission().then((permission) => {
          if (permission === "granted") {
            new Notification(title, { body });
          }
        });
      }
    };

    // Check for notifications every minute (adjust as needed)
    const intervalId = setInterval(checkAndShowNotifications, 5000);

    // Clean up the interval when the component unmounts
    return () => clearInterval(intervalId);
  }, [tasks]); // Run this effect whenever the tasks array changes

  const handleTaskSave = () => {
    // Refresh the task list after saving a new or edited task
    setShowTaskForm(false); // Close the form
    fetchTasks(); // Re-fetch tasks to update the list
  };

  // Function to handle filtering tasks
  const handleFilterChange = (event) => {
    setFilterStatus(event.target.value);
  };

  // Function to handle sorting order
  const handleSortChange = () => {
    setSortOrder((prevSortOrder) => {
      if (prevSortOrder === "none") return "asc";
      if (prevSortOrder === "asc") return "desc";
      return "none";
    });
  };

  return (
    <div className="container mx-auto ">
      <div className="bg-white rounded-md p-4 shadow-md">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold mb-4">Task List</h1>
          {!showTaskForm && (
            <div className="mb-4 flex space-x-4">
              <button
                onClick={() => setShowTaskForm(true)}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              >
                Add Task
              </button>

              {/* Filter Dropdown */}
              <select
                value={filterStatus}
                onChange={handleFilterChange}
                className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              >
                <option value="all">All Tasks</option>
                <option value="pending">Pending</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>

              {/* Sort Button */}
              <button
                onClick={handleSortChange}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
              >
                Sort by Due Date (
                {sortOrder === "asc" ? "↑" : sortOrder === "desc" ? "↓" : "↕"})
              </button>
            </div>
          )}
        </div>
        <hr />
        <div className="mt-5">
          {/* Tsk Form (conditionally rendered) */}
          {showTaskForm && (
            <TaskForm
              initialTask={editingTask} // Pass editingTask as initialTask
              onSave={handleTaskSave}
              onClose={() => {
                setShowTaskForm(false);
                setEditingTask(null); // Clear editingTask when closing the form
              }}
            />
          )}

          {isLoading && <div>Loading tasks...</div>}
          {error && <div>Error: {error}</div>}

          {!showTaskForm && (
            <ul>
              {tasks.map((task) => (
                <TaskItem
                  key={task._id}
                  task={task}
                  onTaskUpdate={fetchTasks}
                  onEditTask={handleEditTask} // Pass handleEditTask to TaskItem
                />
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskList;
