const express = require("express");
const path = require("path");
const fs = require("fs/promises");

const app = express();
app.use(express.json());

const jsonPath = path.resolve("./file/taks.json");

app.get("/api/v1/tasks", async (req, res) => {
  const jsonFile = await fs.readFile(jsonPath, "utf-8");
  res.send(jsonFile);
});

app.post("/api/v1/tasks", async (req, res) => {
  const tasks = req.body;
  const tasksArray = JSON.parse(await fs.readFile(jsonPath, "utf-8"));

  const lastIndex = tasksArray.length - 1;
  const newId = tasksArray[lastIndex].id + 1;

  tasksArray.push({ ...tasks, id: newId });

  await fs.writeFile(jsonPath, JSON.stringify(tasksArray));
  res.end();
});

app.put("/api/v1/tasks", async (req, res) => {
  const tasksArray = JSON.parse(await fs.readFile(jsonPath, "utf-8"));

  const { id, status } = req.body;
  const taskIndex = tasksArray.findIndex((taks) => taks.id === id);
  tasksArray[taskIndex].status = status;

  await fs.writeFile(jsonPath, JSON.stringify(tasksArray));
  res.end();
});

app.delete("/api/v1/tasks", async (req, res) => {
  const tasksArray = JSON.parse(await fs.readFile(jsonPath, "utf-8"));

  const { id } = req.body;
  const taskIndex = tasksArray.findIndex((taks) => taks.id === id);

  tasksArray.splice(taskIndex, 1);
  await fs.writeFile(jsonPath, JSON.stringify(tasksArray));
  res.end();
});

const PORT = 8000;
app.listen(PORT, () => {
  console.log("Servidor escuchando");
});
