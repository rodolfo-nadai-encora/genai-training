import React, { useState, useEffect } from "react";
import { Routes, Route, useNavigate, Navigate, Link } from "react-router-dom";
import Dashboard from "./components/Dashboard";
import Settings from "./components/Settings";
import TaskList from "./components/TaskList";
import AuthForm from "./components/AuthForm";
import { isAuthenticated, setIsAuthenticated } from "./utils";

function App() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true); // Add loading state

  useEffect(() => {
    const token = sessionStorage.getItem("token");
    if (token) {
      setIsAuthenticated(token);
    }
    setIsLoading(false); // Set loading to false after checking authentication
  }, []);

  const handleAuthSuccess = (token) => {
    setIsAuthenticated(token);
    navigate("/");
  };

  const handleLogout = () => {
    setIsAuthenticated(undefined);
    navigate("/login");
  };

  return (
    <div className="App">
      {isAuthenticated() && (
        <header className="mb-4">
          <nav className="flex items-center justify-between bg-gray-200 p-3 rounded-md shadow-md">
            <Link to="/" className="text-lg font-bold">
              Task Manager
            </Link>
            <div>
              <Link
                to="/settings"
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded mr-2"
              >
                Settings
              </Link>
              <button
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                onClick={handleLogout}
              >
                Logout
              </button>
            </div>
          </nav>
        </header>
      )}
      <div className="container mx-auto">
        {isLoading ? (
          <div>Loading...</div>
        ) : (
          <Routes>
            <Route
              path="/login"
              element={<AuthForm onAuthSuccess={handleAuthSuccess} />}
            />
            {isAuthenticated() ? (
              <>
                <Route
                  path="/"
                  element={
                    <>
                      <Dashboard />
                      <TaskList />
                    </>
                  }
                />
                <Route path="/settings" element={<Settings />} />
              </>
            ) : (
              <Route path="*" element={<Navigate to="/login" replace />} />
            )}
          </Routes>
        )}
      </div>
    </div>
  );
}

export default App;
