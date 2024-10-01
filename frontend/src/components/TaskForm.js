import React, { useState } from "react";
import axios from "axios";
import { backendUrl } from "../constants";

const TaskForm = ({ initialTask, onSave, onClose }) => {
  const [title, setTitle] = useState(initialTask?.title || "");
  const [description, setDescription] = useState(
    initialTask?.description || ""
  );
  const [dueDate, setDueDate] = useState(
    initialTask?.dueDate
      ? new Date(initialTask.dueDate).toISOString().slice(0, 10) // Format date for input
      : ""
  );
  const [status, setStatus] = useState(initialTask?.status || "pending");
  const [titleError, setTitleError] = useState("");
  const [descriptionError, setDescriptionError] = useState("");
  const [dueDateError, setDueDateError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Reset errors
    setTitleError("");
    setDueDateError("");
    setDescriptionError("");

    // Validation
    if (!title.trim()) {
      setTitleError("Title is required");
      return;
    }

    if (!description.trim()) {
      setTitleError("Title is required");
      return;
    }

    if (!dueDate) {
      setDueDateError("Due date is required");
      return;
    }

    const taskData = { title, description, dueDate, status };

    try {
      if (initialTask) {
        // Update existing task
        await axios.put(
          `${backendUrl}/api/tasks/${initialTask._id}`,
          taskData,
          {
            headers: {
              Authorization: `Bearer ${sessionStorage.getItem("token")}`,
            },
          }
        );
      } else {
        // Create new task
        await axios.post(`${backendUrl}/api/tasks`, taskData, {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
          },
        });
      }
      onSave();
      onClose();
    } catch (error) {
      console.error("Error saving task:", error);
      // Handle error, display message to user
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 bg-white rounded-md shadow-md">
      <h2 className="text-xl font-bold mb-4">
        {initialTask ? "Edit Task" : "Create Task"}
      </h2>

      {/* Title Input */}
      <div className="mb-4">
        <label htmlFor="title" className="block text-gray-700 font-bold mb-2">
          Title:
        </label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
            setTitleError("");
          }}
          className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
            titleError ? "border-red-500" : ""
          }`}
          required
        />
        {titleError && (
          <p className="text-red-500 text-xs italic">{titleError}</p>
        )}
      </div>

      {/* Description Input */}
      <div className="mb-4">
        <label
          htmlFor="description"
          className="block text-gray-700 font-bold mb-2"
        >
          Description:
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => {
            setDescription(e.target.value);
            setDescriptionError("");
          }}
          className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
            titleError ? "border-red-500" : ""
          }`}
          required
        />
        {descriptionError && (
          <p className="text-red-500 text-xs italic">{descriptionError}</p>
        )}
      </div>

      {/* Due Date Input */}
      <div className="mb-4">
        <label htmlFor="dueDate" className="block text-gray-700 font-bold mb-2">
          Due Date:
        </label>
        <input
          type="date"
          id="dueDate"
          value={dueDate}
          onChange={(e) => {
            setDueDate(e.target.value);
            setDueDateError("");
          }}
          className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
            dueDateError ? "border-red-500" : ""
          }`}
          required
        />
        {dueDateError && (
          <p className="text-red-500 text-xs italic">{dueDateError}</p>
        )}
      </div>

      {/* Status Select */}
      <div className="mb-4">
        <label htmlFor="status" className="block text-gray-700 font-bold mb-2">
          Status:
        </label>
        <select
          id="status"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        >
          <option value="pending">Pending</option>
          <option value="in-progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>
      </div>

      {/* Buttons */}
      <div className="flex justify-end">
        <button
          type="button"
          onClick={onClose}
          className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded mr-2"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Save
        </button>
      </div>
    </form>
  );
};

export default TaskForm;
