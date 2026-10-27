const User = require('../models/user');

const getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.send(users))
    .catch(next);
};

const getUserById = (req, res, next) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (!user) {
        res.status(404).send({ message: 'ID de usuario no encontrado' });
        return;
      }

      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(400).send({ message: 'ID de usuario no válido' });
        return;
      }

      next(err);
    });
};

const createUser = (req, res, next) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((user) => res.status(201).send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: 'Datos de usuario no válidos' });
        return;
      }

      next(err);
    });
};

module.exports = { getUsers, getUserById, createUser };
