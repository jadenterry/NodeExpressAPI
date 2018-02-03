
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var TodoSchema = new Schema({
    name: String,
    complete: String
});

module.exports = mongoose.model('Todo', TodoSchema);