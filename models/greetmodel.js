const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const greetSchema = new Schema({
  groupid: { type: String, required: true, unique: true },
  msg: String,
  media: String,
  type: String
});

const Greet = mongoose.model('Greet', greetSchema, 'greets');

module.exports = Greet;
