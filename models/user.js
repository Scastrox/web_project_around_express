const mongoose = require('mongoose');
const { urlRegex } = require('../utils/validators');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  about: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  avatar: {
    type: String,
    required: true,
    validate: {
      validator: (v) => urlRegex.test(v),
      message: (props) => `${props.value} no es un enlace válido`,
    },
  },
});

module.exports = mongoose.model('user', userSchema);
