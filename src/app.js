const express = require("express");
const cors = require("cors");

const { uuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;

  const repository = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0,
  };
  repositories.push(repository);

  return response.json(repository);
});

app.put("/repositories/:id", (request, response) => {
  const { title, url, techs } = request.body;
  const { id } = request.params;

  const findRepoIndex = repositories.findIndex(
    (repository) => repository.id === id
  );

  if (findRepoIndex === -1) {
    return response.status(400).json({ error: "Repository does not exists" });
  }

  const repository = {
    id,
    title,
    url,
    techs,
    likes: repositories[findRepoIndex].likes,
  };

  repositories[findRepoIndex] = repository;

  return response.json(repository);
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;

  const findRepoIndex = repositories.findIndex(
    (repository) => repository.id === id
  );

  if (findRepoIndex >= 0) {
    repositories.splice(findRepoIndex, 1);
  } else {
    return response.status(400).json({ error: "Repository does not exists." });
  }

  return response.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;

  const findRepoIndex = repositories.findIndex(
    (repository) => repository.id === id
  );

  if (findRepoIndex === -1) {
    return response.status(400).json({ error: "Repository does not exists" });
  }

  repositories[findRepoIndex].likes++;

  return response.json(repositories[findRepoIndex]);
});

module.exports = app;
