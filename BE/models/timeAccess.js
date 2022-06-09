const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const timeAccessSchema = new Schema(
  {
    userId: {
      type: mongoose.Types.ObjectId,
      require: true,
      ref: "User",
    },
    times: {
      type: Number,
      required: true,
      default: 0,
    },
    createdAt: {
      type: Date,
      default: Date.now,
      expires: 10,
    },
  },
  {
    collection: "tcat-times",
    timestamps: true,
  }
);
// đánh index
timeAccessSchema.index({ createdAt: 1 }, { expireAfterSeconds: 10 });
module.exports = mongoose.model("Time", timeAccessSchema);
