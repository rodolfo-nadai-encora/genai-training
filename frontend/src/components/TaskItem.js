import React, { useState } from "react";
import axios from "axios";
import { backendUrl } from "../constants";

const TaskItem = ({ task, onTaskUpdate, onEditTask }) => {
  const [status, setStatus] = useState(task.status || "pending");
  const [showDescription, setShowDescription] = useState(false);

  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);

  const handleDelete = async () => {
    try {
      await axios.delete(`${backendUrl}/api/tasks/${task._id}`, {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
      });
      onTaskUpdate();
    } catch (error) {
      console.error("Error deleting task:", error);
    }
    setShowDeleteConfirmation(false); // Close confirmation after deleting
  };

  const handleStatusChange = async (e) => {
    const newStatus = e.target.value;
    setStatus(newStatus);

    try {
      await axios.patch(
        `${backendUrl}/api/tasks/${task._id}`,
        { status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
          },
        }
      );
      onTaskUpdate();
    } catch (error) {
      console.error("Error updating task:", error);
      setStatus(task.status);
    }
  };

  const getTitleColorClass = () => {
    if (status === "completed") {
      return "text-gray-500 line-through";
    } else if (new Date(task.dueDate) < new Date() && status !== "completed") {
      return "text-red-500";
    } else if (status === "in-progress") {
      return "text-green-500";
    } else {
      return "text-yellow-500";
    }
  };

  return (
    <div>
      {showDeleteConfirmation && (
        <div className="z-10 absolute top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-4 rounded-md shadow-md">
            <p className="text-lg mb-4">
              Are you sure you want to delete this task?
            </p>
            <div className="flex justify-end">
              <button
                onClick={() => setShowDeleteConfirmation(false)}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-l mr-2"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-r"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
      <li
        className="bg-gray-100 p-4 mb-2 flex items-center relative" // Added relative for positioning
        onMouseEnter={() => setShowDescription(true)}
        onMouseLeave={() => setShowDescription(false)}
      >
        <div className="flex-grow">
          <h2 className={`text-lg font-medium ${getTitleColorClass()}`}>
            {task.title}
          </h2>
          <p className="text-gray-600 text-sm">
            Due: {new Date(task.dueDate).toLocaleDateString()}
          </p>{" "}
          {showDescription && (
            <div className="absolute bg-gray-800 text-white p-2 rounded-md shadow-md z-10 left-0 -bottom-16">
              {task.description}
            </div>
          )}
        </div>

        <select value={status} onChange={handleStatusChange} className="mr-4">
          <option value="pending">Pending</option>
          <option value="in-progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>

        <button
          onClick={() => onEditTask(task)} // Call onEditTask with the task data
          className="text-blue-500 hover:text-blue-700 mr-2"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
          </svg>
        </button>
        <button
          onClick={() => setShowDeleteConfirmation(true)} // Show confirmation
          className="text-red-500 hover:text-red-700"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </li>
    </div>
  );
};

export default TaskItem;
