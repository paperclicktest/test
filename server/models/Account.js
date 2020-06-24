var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var AccountSchema = new Schema({
  // saves user email, validation of email address is done in paylod
  username: {
    type: String,
    unique: true,
    required: true,
  },
  // hashed password is saved
  password: {
    type: String,
    required: true,
  },
  company: {
    type: String,
    required: false,
  },
  blog: {
    type: String,
    required: false,
  },
  location: {
    type: String,
    required: false,
  },
  email: {
    type: String,
    required: false,
  },
  createdAt: {
    type: String,
    required: false,
  },
  email: {
    type: String,
    required: false,
  },
  bio: {
    type: String,
    required: false,
  },
  total_private_repos: {
    type: Number,
    required: false,
  },
});
const Account = mongoose.model("account", AccountSchema);
module.exports = Account;
