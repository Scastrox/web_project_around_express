const express = require('express');
const path = require('path');
const fs = require('fs').promises;

const router = express.Router();

const usersPath = path.join(__dirname, '..', 'data', 'users.json');

const readUsers = () => fs.readFile(usersPath, { encoding: 'utf8' }).then((data) => JSON.parse(data));

router.get('/', (req, res, next) => {
  readUsers()
    .then((users) => res.send(users))
    .catch(next);
});

router.get('/:id', (req, res, next) => {
  readUsers()
    .then((users) => {
      const user = users.find((item) => item._id === req.params.id);

      if (!user) {
        res.status(404).send({ message: 'ID de usuario no encontrado' });
        return;
      }

      res.send(user);
    })
    .catch(next);
});

module.exports = router;
