const request = require("supertest");
const app = require("../src/app"); // Assuming your app is initialized in app.js
const Task = require("../src/models/Task"); // Assuming your task model is in task.js
const {
  userOne,
  userTwo,
  taskOne,
  taskTwo,
  setupDatabase,
} = require("./fixtures/db"); // Helper for setting up test data

const url = "/api";

// Before each test, clear the database and set up test users and tasks
beforeEach(setupDatabase);

describe("Task Endpoints", () => {
  it("Should create a new task for user", async () => {
    const response = await request(app)
      .post(url + "/tasks") // Replace with your actual route
      .set("Authorization", `Bearer ${userOne.tokens[0].token}`) // Assuming JWT auth
      .send({
        title: "Test Task",
        description: "This is a test task",
        dueDate: "2024-03-10",
        status: "pending",
      })
      .expect(201); // Expect a 201 Created status

    // Assertions about the created task
    const task = await Task.findById(response.body._id);
    expect(task).not.toBeNull();
    expect(task.title).toBe("Test Task");
    expect(task.user).toEqual(userOne._id);
  });

  it("Should get all tasks for the authenticated user", async () => {
    const response = await request(app)
      .get(url + "/tasks")
      .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
      .expect(200);

    // Assertions about the returned tasks
    expect(response.body.length).toBe(2); // Assuming userOne has two tasks in the fixture
    expect(response.body[0].user).toEqual(userOne._id.toString());
  });

  // Add more tests for updating, deleting, filtering, and sorting tasks
  // ...

  it("Should not allow user to access other user tasks", async () => {
    await request(app)
      .get(`${url}/tasks/${taskOne._id}`)
      .set("Authorization", `Bearer ${userTwo.tokens[0].token}`)
      .expect(404); // Or 403 if you're specifically checking for Forbidden
  });

  // User Authentication and Authorization Tests
  it("Should allow user signup with valid credentials", async () => {
    const response = await request(app)
      .post(url + "/auth/signup") // Assuming '/users' is your signup route
      .send({
        username: "Test User",
        email: "test@example.com",
        password: "testpassword",
      })
      .expect(201);

    // Assertions for successful signup
    expect(response.body).toHaveProperty("token"); // Check for JWT token
  });

  it("Should allow user login with correct credentials", async () => {
    const response = await request(app)
      .post(url + "/auth/login") // Assuming '/users/login' is your login route
      .send({
        username: userOne.username,
        password: userOne.password,
      })
      .expect(200);

    // Assertions for successful login
    expect(response.body).toHaveProperty("token");
  });

  it("Should allow user to update their own task", async () => {
    const response = await request(app)
      .put(`${url}/tasks/${taskOne._id}`)
      .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
      .send({
        ...taskOne,
        title: "Updated Task Title",
        status: "in-progress",
        dueDate: "2024-03-10",
      })
      .expect(200);

    // Assertions for successful update
    const updatedTask = await Task.findById(taskOne._id);
    expect(updatedTask.title).toBe("Updated Task Title");
    expect(updatedTask.status).toBe("in-progress");
  });

  it("Should allow user to delete their own task", async () => {
    await request(app)
      .delete(`${url}/tasks/${taskOne._id}`)
      .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
      .expect(200);

    // Assertion to check if the task is actually deleted
    const deletedTask = await Task.findById(taskOne._id);
    expect(deletedTask).toBeNull();
  });

  it("Should allow user to filter tasks by status", async () => {
    const response = await request(app)
      .get(url + "/tasks?status=pending") // Assuming query parameter for filtering
      .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
      .expect(200);

    // Assertions to check if all returned tasks have status 'pending'
    response.body.forEach((task) => {
      expect(task.status).toBe("pending");
    });
  });

  it("Should not update task with invalid data", async () => {
    await request(app)
      .put(`${url}/tasks/${taskOne._id}`)
      .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
      .send({
        ...taskOne,
        title: "", // Invalid: Title should not be empty
        dueDate: "invalid-date", // Invalid date format
      })
      .expect(400); // Or another appropriate error code for validation failure

    // You might also want to assert that the task in the database remains unchanged
  });

  it("Should not allow user to delete a task that doesn't belong to them", async () => {
    await request(app)
      .delete(`${url}/tasks/${taskOne._id}`)
      .set("Authorization", `Bearer ${userTwo.tokens[0].token}`) // userTwo trying to delete userOne's task
      .expect(404); // Or 403 if you're specifically checking for Forbidden

    // Assert that the task still exists in the database
    const task = await Task.findById(taskOne._id);
    expect(task).not.toBeNull();
  });

  it("Should allow user to sort tasks by due date (ascending)", async () => {
    const response = await request(app)
      .get(url + "/tasks?sortBy=dueDate:asc")
      .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
      .expect(200);

    // Assert that the response is sorted correctly
    // Assuming dueDate is a Date object
    for (let i = 0; i < response.body.length - 1; i++) {
      expect(new Date(response.body[i].dueDate).getTime()).toBeLessThanOrEqual(
        new Date(response.body[i + 1].dueDate).getTime()
      );
    }
  });

  it("Should allow user to sort tasks by due date (descending)", async () => {
    const response = await request(app)
      .get(url + "/tasks?sortBy=dueDate:desc")
      .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
      .expect(200);

    // Assert that the response is sorted correctly
    // Assuming dueDate is a Date object
    for (let i = 0; i < response.body.length - 1; i++) {
      expect(
        new Date(response.body[i].dueDate).getTime()
      ).toBeGreaterThanOrEqual(
        new Date(response.body[i + 1].dueDate).getTime()
      );
    }
  });
});
