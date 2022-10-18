import mongoose, { Types } from "mongoose"

const { Schema, Model} = mongoose



interface IBook {
    name: string;
    category: string;
    swapFor: Types.Array<string>;
    writtenBy: string;
    img: string;
    description: string;
    created: Date
}

const bookSchema = new Schema<IBook>({
    name: { type: String, required: true},
    category: {type: String, required: true},
    swapFor: {type: [String], required: true},
    writtenBy: {type: String, required: true},
    img: {type: String, required: true},
    description: {type: String, required: true},
    created: {type: Date, default: Date.now}
})

const Book = new Model ("Book", bookSchema )

module.exports = Book