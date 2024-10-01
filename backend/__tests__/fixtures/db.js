// fixtures/db.js

const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const User = require("../../src/models/User"); // Adjust path if needed
const Task = require("../../src/models/Task"); // Adjust path if needed

describe("Database Fixtures", () => {
  it("should have setupDatabase function defined", () => {
    expect(setupDatabase).toBeDefined();
  });
});

const userOneId = new mongoose.Types.ObjectId();
const userOne = {
  _id: userOneId,
  username: "user1",
  email: "user1@example.com",
  password: "password123",
  tokens: [
    {
      token: jwt.sign({ _id: userOneId }, process.env.JWT_SECRET),
    },
  ],
};

const userTwoId = new mongoose.Types.ObjectId();
const userTwo = {
  _id: userTwoId,
  username: "user2",
  email: "user2@example.com",
  password: "password456",
  tokens: [
    {
      token: jwt.sign({ _id: userTwoId }, process.env.JWT_SECRET),
    },
  ],
};

const taskOneId = new mongoose.Types.ObjectId();
const taskOne = {
  _id: taskOneId,
  title: "Task One",
  description: "This is task one",
  dueDate: "2024-03-10T12:00:00.000Z",
  status: "pending",
  user: userOneId,
};

const taskTwoId = new mongoose.Types.ObjectId();
const taskTwo = {
  _id: taskTwoId,
  title: "Task Two",
  description: "This is task two",
  dueDate: "2024-03-15T12:00:00.000Z",
  status: "in-progress",
  user: userOneId,
};

const setupDatabase = async () => {
  await User.deleteMany();
  await Task.deleteMany();
  // Check if userOne already exists
  let existingUserOne = await User.findOne({ username: userOne.username });
  if (!existingUserOne) {
    await new User(userOne).save();
  } else {
    userOne._id = existingUserOne._id; // Update userOne._id if user already exists
  }

  // Check if userTwo already exists
  let existingUserTwo = await User.findOne({ username: userTwo.username });
  if (!existingUserTwo) {
    await new User(userTwo).save();
  } else {
    userTwo._id = existingUserTwo._id; // Update userTwo._id if user already exists
  }

  await new Task(taskOne).save();
  await new Task(taskTwo).save();
};

module.exports = {
  userOne,
  userTwo,
  taskOne,
  taskTwo,
  setupDatabase,
};
