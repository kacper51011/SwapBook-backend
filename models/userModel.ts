import mongoose, { Types } from "mongoose";
import validator from "validator";
import bcrypt from "bcryptjs";

const { Schema, model } = mongoose;

interface IUser {
  nickname: string;
  email: string;
  password: string;
  confirmPassword: string | undefined;
  photo?: string;
  swaps?: Types.ObjectId[];
}

const userSchema = new Schema<IUser>({
  nickname: {
    type: String,
    required: true,
    unique: true,
    minlength: 5,
    maxlength: 20,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, "invalid Email"],
  },
  password: {
    type: String,
    required: true,
    select: false,
    minlength: 6,
  },
  confirmPassword: {
    type: String,
  },

  photo: {
    type: String,
  },
  swaps: [{ type: Schema.Types.ObjectId, ref: "Book" }],
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 12);
  this.confirmPassword = undefined;
});

const User = mongoose.model("User", userSchema);

export default User;
