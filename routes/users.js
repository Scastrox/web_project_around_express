const express = require('express');
const path = require('path');
const fs = require('fs').promises;

const router = express.Router();

const usersPath = path.join(__dirname, '..', 'data', 'users.json');

const readUsers = () => fs.readFile(usersPath, { encoding: 'utf8' }).then((data) => JSON.parse(data));

router.get('/', (req, res) => {
  readUsers()
    .then((users) => res.send(users))
    .catch(() => res.status(500).send({ message: 'Error al leer los datos de usuarios' }));
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
    .catch(() => res.status(500).send({ message: 'Error al leer los datos de usuarios' }));
});

module.exports = router;
