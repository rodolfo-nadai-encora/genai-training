import React, { useState } from "react";
import axios from "axios";
import { backendUrl } from "../constants";

const AuthForm = ({ onAuthSuccess }) => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState(true); // Default to login
  const [passwordError, setPasswordError] = useState("");
  const [errorMessage, setErrorMessage] = useState(null); // State for error message

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic password validation
    if (
      password.length < 8 ||
      !/[A-Z]/.test(password) ||
      !/\d/.test(password) ||
      !/[!@#$%^&*(),.?":{}|<>]/.test(password)
    ) {
      setPasswordError(
        "Password must be at least 8 characters long and contain at least one uppercase letter, one number, and one special character."
      );
      return; // Don't submit if password is invalid
    }

    const url = isLogin ? "/api/auth/login" : "/api/auth/signup";
    try {
      const response = await axios.post(`${backendUrl}${url}`, {
        username,
        email,
        password,
      });
      onAuthSuccess(response?.data?.token);
      setErrorMessage(null); // Clear any previous error messages
    } catch (error) {
      console.error("Authentication error:", error);
      // Set the error message from the API response
      setErrorMessage(error.response?.data?.message || "An error occurred.");
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="max-w-md mx-auto bg-white rounded-md shadow-md p-6">
        <h2 className="text-2xl font-bold text-center mb-6">
          {isLogin ? "Login" : "Sign Up"}
        </h2>
        <form onSubmit={handleSubmit}>
          {isLogin ? (
            <div className="mb-4">
              <label
                htmlFor="username"
                className="block text-gray-700 font-bold mb-2"
              >
                Username:
              </label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                required
              />
            </div>
          ) : (
            <div>
              <div className="mb-4">
                <label
                  htmlFor="username"
                  className="block text-gray-700 font-bold mb-2"
                >
                  Username:
                </label>
                <input
                  type="text"
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  required
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="email"
                  className="block text-gray-700 font-bold mb-2"
                >
                  Email:
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  required
                />
              </div>
            </div>
          )}
          <div className="mb-4">
            <label
              htmlFor="password"
              className="block text-gray-700 font-bold mb-2"
            >
              Password:
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setPasswordError("");
              }} // Clear error on input change
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
            {passwordError && (
              <p className="text-red-500 text-xs italic">{passwordError}</p>
            )}{" "}
            {/* Display error message */}
          </div>
          <div className="flex items-center justify-between">
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              {isLogin ? "Login" : "Sign Up"}
            </button>
            <a
              href="#"
              onClick={() => setIsLogin(!isLogin)}
              className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800"
            >
              {isLogin ? "Don't have an account?" : "Already have an account?"}
            </a>
          </div>
        </form>
        {/* Display error message if it exists */}
        {errorMessage && (
          <div className="text-red-500 text-xs italic mb-4">{errorMessage}</div>
        )}
      </div>
    </div>
  );
};

export default AuthForm;
