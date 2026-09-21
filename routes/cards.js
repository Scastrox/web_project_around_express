const express = require('express');
const path = require('path');
const fs = require('fs').promises;

const router = express.Router();

const cardsPath = path.join(__dirname, '..', 'data', 'cards.json');

const SERVER_ERROR_MESSAGE = 'Ha ocurrido un error en el servidor';

router.get('/', (req, res) => {
  fs.readFile(cardsPath, { encoding: 'utf8' })
    .then((data) => res.send(JSON.parse(data)))
    .catch(() => res.status(500).send({ message: SERVER_ERROR_MESSAGE }));
});

module.exports = router;
