const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const TokenSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    token: {
      type: String,
    },
    createAt: {
      type: Date,
      default: Date.now,
      expires: 3600, // 1h
    },
  },
  {
    collection: "tcat-tokens",
    timestamps: true,
  }
);

// obj giong voi primary key
// createAt from timestamps
// danh index
TokenSchema.index(
  { createAt: 1 },
  { expireAfterSeconds: +process.env.TOKEN_EXPIRED }
);
module.exports = mongoose.model("Token", TokenSchema);
