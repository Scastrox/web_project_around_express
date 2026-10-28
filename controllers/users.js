const User = require('../models/user');
const { BAD_REQUEST, NOT_FOUND } = require('../utils/errors');

const getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.send(users))
    .catch(next);
};

const getUserById = (req, res, next) => {
  User.findById(req.params.userId)
    .orFail()
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(BAD_REQUEST).send({ message: 'ID de usuario no válido' });
      }

      if (err.name === 'DocumentNotFoundError') {
        return res.status(NOT_FOUND).send({ message: 'ID de usuario no encontrado' });
      }

      return next(err);
    });
};

const createUser = (req, res, next) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((user) => res.status(201).send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(BAD_REQUEST).send({ message: 'Datos de usuario no válidos' });
      }

      return next(err);
    });
};

const updateUser = (req, res, next, data) => {
  const hasData = Object.values(data).some((value) => value !== undefined);

  if (!hasData) {
    return res.status(BAD_REQUEST).send({ message: 'Datos de usuario no válidos' });
  }

  return User.findByIdAndUpdate(req.user._id, data, { new: true, runValidators: true })
    .orFail()
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        return res.status(BAD_REQUEST).send({ message: 'Datos de usuario no válidos' });
      }

      if (err.name === 'DocumentNotFoundError') {
        return res.status(NOT_FOUND).send({ message: 'ID de usuario no encontrado' });
      }

      return next(err);
    });
};

const updateProfile = (req, res, next) => {
  const { name, about } = req.body;

  updateUser(req, res, next, { name, about });
};

const updateAvatar = (req, res, next) => {
  const { avatar } = req.body;

  updateUser(req, res, next, { avatar });
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateProfile,
  updateAvatar,
};
