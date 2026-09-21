const express = require('express');
const path = require('path');
const fs = require('fs').promises;

const router = express.Router();

const usersPath = path.join(__dirname, '..', 'data', 'users.json');

const SERVER_ERROR_MESSAGE = 'Ha ocurrido un error en el servidor';

const readUsers = () => fs.readFile(usersPath, { encoding: 'utf8' }).then((data) => JSON.parse(data));

router.get('/', (req, res) => {
  readUsers()
    .then((users) => res.send(users))
    .catch(() => res.status(500).send({ message: SERVER_ERROR_MESSAGE }));
});

router.get('/:id', (req, res) => {
  readUsers()
    .then((users) => {
      const user = users.find((item) => item._id === req.params.id);

      if (!user) {
        res.status(404).send({ message: 'ID de usuario no encontrado' });
        return;
      }

      res.send(user);
    })
    .catch(() => res.status(500).send({ message: SERVER_ERROR_MESSAGE }));
});

module.exports = router;
