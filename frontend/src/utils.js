import axios from "axios";
import { backendUrl } from "./constants";

// Function to check if the user is authenticated based on session storage
const isAuthenticated = () => {
  // Get the token from session storage
  const token = sessionStorage.getItem("token");
  // Check if the token exists and is not empty
  if (token) {
    return verifyToken(token); // User is authenticated
  } else {
    return false; // User is not authenticated
  }
};

const setIsAuthenticated = (value) => {
  if (value) {
    // Assuming you receive a token upon successful authentication
    sessionStorage.setItem("token", value);
  } else {
    sessionStorage.removeItem("token");
  }
};

const verifyToken = async (token) => {
  try {
    const response = await axios.post(
      `${backendUrl}/api/auth/verify`, // Assuming your backend has a /verify route
      {}, // You might not need to send any data, but adjust if needed
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    // Check the response status and data to determine validity
    if (response.status === 200 && response.data.success) {
      return true; // Token is valid
    } else {
      return false; // Token is invalid
    }
  } catch (error) {
    console.error("Error verifying token:", error);
    return false; // Treat errors as invalid token
  }
};

export { isAuthenticated, setIsAuthenticated };
