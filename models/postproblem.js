const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PostProblemSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  contributer: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
    unique: true,
  },
  technologies: {
    type: String,
    required: true,
  },
  domain: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  outcome: {
    type: String,
    required: true,
  },
  dueDate: {
    type: Date,
    required: true,
  },
  attachments: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now(),
  },
});
module.exports = PostProblem=mongoose.model("postproblem", PostProblemSchema);;