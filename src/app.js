const express = require("express");
const cors = require("cors");

const { v4: uuid, validate: isUuid } = require('uuid');

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

app.get("/repositories", (request, response) => {
    return response.json(repositories)
});

app.post("/repositories", (request, response) => {
    const { title, url, techs } = request.body
    const repository = {
        id: uuid(),
        title,
        url,
        techs,
        likes: 0
    }

    repositories.push(repository)

    return response.json(repository)
});

app.put("/repositories/:id", (request, response) => {
    const { id } = request.params
    const { title, url, techs } = request.body

    const index = repositories.findIndex(repository =>
        repository.id === id
    )

    if (index === -1) {
        return response.status(400).json({ error: 'repository dos not exists' })
    }

    const repository = {
        id,
        title,
        url,
        techs,
        likes: repositories[index].likes
    }

    repositories[index] = repository
    return response.json(repository)
});

app.delete("/repositories/:id", (request, response) => {
    const { id } = request.params
    const index = repositories.findIndex(repository =>
        repository.id === id
    )

    if (index >= 0) {
        repositories.splice(index, 1)
    } else {
        return response.status(400).send()
    }

    return response.status(204).send()
});

app.post("/repositories/:id/like", (request, response) => {
    const { id } = request.params

    const index = repositories.findIndex(repository =>
        repository.id === id
    )

    if (index === -1) return response.status(400).json({ error: 'Repository dos not exist' })

    const likes = repositories[index].likes + 1
    const repository = {
        ...repositories[index],
        likes
    }

    repositories[index] = repository
    return response.json(repository)
});

module.exports = app;