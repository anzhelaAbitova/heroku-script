const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const receiptsScheme = new Schema({
    userLogin: {
      type: String,
      required: true,
    },
    receipts: {
      type: [String],
      required: true,
    }
});

const Receipts = mongoose.model("Receipts", receiptsScheme);
module.exports = { Receipts }