import mongoose, { Types } from "mongoose";

const { Schema, model } = mongoose;

// to add : img, writtenBy
interface IBook {
  name: string;
  author: string;
  category: string;
  released: number;
  swapFor: String;
  description: string;
  created: Date;
  swapPlace: string;
  createdBy: string;
}

const bookSchema = new Schema<IBook>({
  name: { type: String, required: true, minlength: 5, maxlength: 50 },
  author: { type: String, required: true, minlength: 4, maxlength: 30 },
  category: { type: String, required: true },
  released: { type: Number, required: true, min: 1900, max: 2022 },
  swapFor: { type: String, required: true, minlength: 5, maxlength: 100 },
  description: { type: String, required: true, minlength: 10, maxlength: 200 },
  swapPlace: { type: String, required: true },
  created: { type: Date, default: Date.now() },
});

export const Book = mongoose.model("Book", bookSchema);
