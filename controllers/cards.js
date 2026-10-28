const Card = require('../models/card');
const { CREATED, BAD_REQUEST, NOT_FOUND } = require('../utils/statusCodes');

const getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.send(cards))
    .catch(next);
};

const createCard = (req, res, next) => {
  const { name, link } = req.body;

  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.status(CREATED).send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(BAD_REQUEST).send({ message: 'Datos de tarjeta no válidos' });
      }

      return next(err);
    });
};

const deleteCard = (req, res, next) => {
  Card.findByIdAndDelete(req.params.cardId)
    .orFail()
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(BAD_REQUEST).send({ message: 'ID de tarjeta no válido' });
      }

      if (err.name === 'DocumentNotFoundError') {
        return res.status(NOT_FOUND).send({ message: 'ID de tarjeta no encontrado' });
      }

      return next(err);
    });
};

const updateLikes = (req, res, next, operator) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { [operator]: { likes: req.user._id } },
    { new: true },
  )
    .orFail()
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(BAD_REQUEST).send({ message: 'ID de tarjeta no válido' });
      }

      if (err.name === 'DocumentNotFoundError') {
        return res.status(NOT_FOUND).send({ message: 'ID de tarjeta no encontrado' });
      }

      return next(err);
    });
};

const likeCard = (req, res, next) => updateLikes(req, res, next, '$addToSet');

const dislikeCard = (req, res, next) => updateLikes(req, res, next, '$pull');

module.exports = {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
};
