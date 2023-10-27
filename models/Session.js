const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const SessionModel = new Schema({});

module.exports = mongoose.model("session", SessionModel);
