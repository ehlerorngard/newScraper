var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var NoteSchema = new Schema({
  title: {type: String},
  corpus: {type: String}
});

var Note = mongoose.model("Note", NoteSchema);

module.exports = Note;
