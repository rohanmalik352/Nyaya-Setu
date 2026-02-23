import mongoose from 'mongoose';
const Schema = mongoose.Schema;

import passportLocalMongoose from "passport-local-mongoose";

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },

  role: {
    type: String,
    enum: ["police", "judge"],
    required: true
  },

  officerId: {
    type: String
  },

  judgeId: {
    type: String
  }
});

userSchema.plugin(passportLocalMongoose.default);

const User= mongoose.model("User", userSchema);
export default User;