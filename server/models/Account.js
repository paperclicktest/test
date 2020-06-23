var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var AccountSchema = new Schema({
  username: String,
  repos: [{ body: String, date: Date }],
});
const accountModel = mongoose.model("account", AccountSchema);
