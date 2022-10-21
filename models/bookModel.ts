import mongoose, { Types } from "mongoose"

const { Schema, model} = mongoose


// to add : img, writtenBy
interface IBook {
    name: string;
    author: string;
    category: string;
    released: number;
    swapFor: String;
    description: string;
    created: Date;
    swapPlace: string
}

const bookSchema = new Schema<IBook>({
    name: { type: String, required: true},
    author: { type: String, required: true},
    category: {type: String, required: true},
    released: {type: Number, required: true},
    swapFor: {type: String, required: true},
    description: {type: String, required: true},
    swapPlace: {type: String, required: true }
})

export const Book = mongoose.model("Book", bookSchema )

