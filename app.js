const express = require('express');
const mongoose = require('mongoose');

const usersRouter = require('./routes/users');
const cardsRouter = require('./routes/cards');
const { NOT_FOUND, INTERNAL_SERVER_ERROR } = require('./utils/errors');

const { PORT = 3000 } = process.env;

const app = express();

mongoose
  .connect('mongodb://localhost:27017/aroundb')
  .then(() => console.log('Conectado a MongoDB'))
  .catch((err) => console.error('Error al conectar con MongoDB:', err));

app.use(express.json());

app.use((req, res, next) => {
  req.body = req.body || {};

  next();
});

app.use((req, res, next) => {
  req.user = {
    _id: '6ae12445ec03712923c33f64',
  };

  next();
});

app.use('/users', usersRouter);
app.use('/cards', cardsRouter);

app.use((req, res) => {
  res.status(NOT_FOUND).send({ message: 'Recurso solicitado no encontrado' });
});

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  const { status = INTERNAL_SERVER_ERROR } = err;

  if (status < INTERNAL_SERVER_ERROR) {
    return res.status(status).send({ message: 'Solicitud no válida' });
  }

  console.error(err);
  return res.status(INTERNAL_SERVER_ERROR).send({ message: 'Ha ocurrido un error en el servidor' });
});

app.listen(PORT, () => {
  console.log(`El servidor está escuchando en el puerto ${PORT}`);
});
