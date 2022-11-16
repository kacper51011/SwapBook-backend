import mongoose, { Types } from "mongoose";

const { Schema, model } = mongoose;

// todo add : img,
interface IBook {
  nameOfTheBook: string;
  author: string;
  category: string;
  releaseDate: number;
  swapFor: String;
  description: string;
  created: Date;
  swapPlace: string;
  createdBy: Types.ObjectId;
}

const bookSchema = new Schema<IBook>({
  nameOfTheBook: { type: String, required: true, minlength: 5, maxlength: 50 },
  author: { type: String, required: true, minlength: 4, maxlength: 30 },
  category: { type: String, required: true },
  releaseDate: { type: Number, required: true, min: 1900, max: 2022 },
  swapFor: { type: String, required: true, minlength: 5, maxlength: 100 },
  description: { type: String, required: true, minlength: 10, maxlength: 200 },
  swapPlace: { type: String, required: true },
  created: { type: Date, default: Date.now() },
  createdBy: { type: Schema.Types.ObjectId, ref: "User" },
});

export const Book = mongoose.model("Book", bookSchema);
