import express from "express";
const app = express();
export default app;

import employees from "./db/employees.js"; // Add .js if using ES modules

// Middleware to parse JSON body
app.use(express.json());

// Root route
app.get("/", (req, res) => {
  res.send("Hello employees!");
});

// Get all employees
app.get("/employees", (req, res) => {
  res.send(employees);
});

// Get a random employee
app.get("/employees/random", (req, res) => {
  const randomIndex = Math.floor(Math.random() * employees.length);
  res.send(employees[randomIndex]);
});

// Get employee by ID
app.get("/employees/:id", (req, res) => {
  const { id } = req.params;
  const employee = employees.find((e) => e.id === +id);

  if (!employee) {
    return res.status(404).send("Employee not found");
  }

  res.send(employee);
});

// ✅ POST new employee at the correct path
app.post("/employees", (req, res) => {
  const { name } = req.body;

  if (!name || typeof name !== "string" || name.trim() === "") {
    return res.status(400).send({ error: "Name is required and must be a non-empty string." });
  }

  const newEmployee = {
    id: employees.length ? Math.max(...employees.map(e => e.id)) + 1 : 1,
    name: name.trim(),
  };

  employees.push(newEmployee);
  res.status(201).send(newEmployee);
});

// Catch-all error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});