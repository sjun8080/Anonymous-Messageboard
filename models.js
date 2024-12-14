const mongoose = require("mongoose");
const { Schema } = mongoose;

const date = new Date();

const ReplySchema = new Schema({
  text: { type: String },
  delete_password : { type: String },
  created_on: { type: Date, default: date},
  bumped_on: { type: Date, default: date},
  reported_on: { type: Boolean, default: false},
});
const Reply = mongoose.model("Reply", ReplySchema);

//2//
const ThreadSchema = new Schema({
  text: { type: String },
  delete_password : { type: String },
  reported: { type: Boolean, default: false},
  created_on: { type: Date, default: date},
  bumped_on: { type: Date, default: date},
  replies: { type: [ReplySchema]},
});
const Thread = mongoose.model("Thread", ThreadSchema);

const BoarddSchema = new Schema({
  name: { type: String },
  threads: { type: [ThreadSchema]}
});

const Board = mongoose.model("Board", BoardSchema);

exports.Board = Board;
exports.Thread = Thread;
exports.Reply = Reply;

//Corrected Version//
/*const mongoose = require("mongoose");
const { Schema } = mongoose;

const ReplySchema = new Schema({
  text: { type: String },
  delete_password: { type: String },
  created_on: { type: Date, default: Date.now }, // Dynamic default
  bumped_on: { type: Date, default: Date.now }, // Dynamic default
  reported_on: { type: Boolean, default: false },
});
const Reply = mongoose.model("Reply", ReplySchema);

const ThreadSchema = new Schema({
  text: { type: String },
  delete_password: { type: String },
  reported: { type: Boolean, default: false },
  created_on: { type: Date, default: Date.now }, // Dynamic default
  bumped_on: { type: Date, default: Date.now }, // Dynamic default
  replies: { type: [ReplySchema] },
});
const Thread = mongoose.model("Thread", ThreadSchema);

const BoardSchema = new Schema({
  name: { type: String },
  threads: { type: [ThreadSchema] },
});
const Board = mongoose.model("Board", BoardSchema);

exports.Board = Board;
exports.Thread = Thread;
exports.Reply = Reply;
*/
