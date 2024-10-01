import { render, screen, fireEvent } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { isAuthenticated, setIsAuthenticated } from "./utils";

// Mock localStorage
const sessionStorageMock = (function () {
  let store = {};

  return {
    getItem(key) {
      return store[key] || null;
    },

    setItem(key, value) {
      store[key] = value.toString();
    },

    removeItem(key) {
      delete store[key];
    },

    clear() {
      store = {};
    },
  };
})();

Object.defineProperty(window, "sessionStorage", {
  value: sessionStorageMock,
});

// Mock isAuthenticated and setIsAuthenticated
jest.mock("./utils", () => ({
  ...jest.requireActual("./utils"), // This keeps other imports from utils
  isAuthenticated: jest.fn(),
  setIsAuthenticated: jest.fn(),
}));

describe("App", () => {
  beforeEach(() => {
    isAuthenticated.mockClear();
    setIsAuthenticated.mockClear();
  });

  it("renders login form when not authenticated", () => {
    // Mock isAuthenticated to return false
    isAuthenticated.mockReturnValue(false);

    render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    );

    // Be more specific about the Login element
    expect(screen.getByRole("heading", { name: /Login/i })).toBeInTheDocument();
  });

  it("handles logout", async () => {
    isAuthenticated.mockReturnValue(true);

    render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    );

    fireEvent.click(screen.getByText(/Logout/i));

    isAuthenticated.mockReturnValue(false);

    expect(screen.getByRole("heading", { name: /Login/i })).toBeInTheDocument();
  });

  it("renders dashboard and task list when authenticated", () => {
    isAuthenticated.mockReturnValue(true);

    render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    );

    expect(screen.getByRole("heading", { name: /Login/i })).toBeInTheDocument();
    expect(screen.getByText(/User Dashboard/i)).toBeInTheDocument();
    expect(screen.getByText(/Task List/i)).toBeInTheDocument();
  });
});
