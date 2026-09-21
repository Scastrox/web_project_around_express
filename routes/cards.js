const express = require('express');
const path = require('path');
const fs = require('fs').promises;

const router = express.Router();

const cardsPath = path.join(__dirname, '..', 'data', 'cards.json');

router.get('/', (req, res) => {
  fs.readFile(cardsPath, { encoding: 'utf8' })
    .then((data) => res.send(JSON.parse(data)))
    .catch(() => res.status(500).send({ message: 'Error al leer los datos de tarjetas' }));
});

module.exports = router;
