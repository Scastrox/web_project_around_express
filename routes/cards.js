const express = require('express');
const path = require('path');
const fs = require('fs').promises;

const router = express.Router();

const cardsPath = path.join(__dirname, '..', 'data', 'cards.json');

router.get('/', (req, res, next) => {
  fs.readFile(cardsPath, { encoding: 'utf8' })
    .then((data) => res.send(JSON.parse(data)))
    .catch(next);
});

module.exports = router;
