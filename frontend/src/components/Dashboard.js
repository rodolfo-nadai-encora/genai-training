import React, { useState, useEffect } from "react";
import axios from "axios";
import { backendUrl } from "../constants";

const Dashboard = () => {
  const [taskSummary, setTaskSummary] = useState({
    totalTasks: 0,
    dueSoon: 0,
    completed: 0,
  });

  const [secondsRemaining, setSecondsRemaining] = useState(60); // Start with 60 seconds

  useEffect(() => {
    const fetchTaskSummary = async () => {
      try {
        const response = await axios.get(`${backendUrl}/api/tasks`, {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
          },
        });

        const tasks = response.data;

        const total = tasks.length;
        const dueSoonCount = tasks.filter(
          (task) =>
            task.status === "pending" &&
            new Date(task.dueDate) < new Date(Date.now() + 24 * 60 * 60 * 1000)
        ).length;
        const completedCount = tasks.filter(
          (task) => task.status === "completed"
        ).length;

        setTaskSummary({
          totalTasks: total,
          dueSoon: dueSoonCount,
          completed: completedCount,
        });
      } catch (error) {
        console.error("Error fetching task summary:", error);
        // Handle error, display message to user
      }
    };

    fetchTaskSummary();

    const intervalId = setInterval(() => {
      fetchTaskSummary();
      setSecondsRemaining(60); // Reset countdown after fetching tasks
    }, 60000);

    // Countdown timer for next update
    const timerId = setInterval(() => {
      setSecondsRemaining((prevSeconds) => {
        if (prevSeconds <= 1) {
          setSecondsRemaining(60); // Reset countdown after 1 second
          return 0;
        } else {
          return prevSeconds - 1;
        }
      });
    }, 1000);

    return () => {
      clearInterval(intervalId);
      clearInterval(timerId); // Clear both intervals on unmount
    };
  }, []);
  return (
    <div className="container mx-auto my-5">
      <div className="bg-white rounded-md shadow-md p-6">
        <h2 className="text-2xl font-bold mb-4">User Dashboard</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gray-100 p-4 rounded-md">
            <p className="text-gray-600">Total Tasks</p>
            <h3 className="text-2xl font-bold">{taskSummary.totalTasks}</h3>
          </div>
          <div className="bg-gray-100 p-4 rounded-md">
            <p className="text-gray-600">Due Soon</p>
            <h3 className="text-2xl font-bold">{taskSummary.dueSoon}</h3>
          </div>
          <div className="bg-gray-100 p-4 rounded-md">
            <p className="text-gray-600">Completed</p>
            <h3 className="text-2xl font-bold">{taskSummary.completed}</h3>
          </div>
        </div>
      </div>
      <div className="text-center mt-4 text-gray-500">
        Next dashboard update in: {secondsRemaining} seconds
      </div>
    </div>
  );
};

export default Dashboard;
