import mongoose, { Types } from "mongoose"
import validator from "validator";

const { Schema, model} = mongoose

interface IUser{
    nickname: string
    email: string
    password: string
    confirmPassword: string
    photo?: string
}


const userSchema = new Schema<IUser>({
    nickname: {
        type: String, required: true, unique: true
    },
    email: {
        type: String, required: true, unique: true, lowercase: true , validate: [validator.isEmail, "invalid Email"]
    },
    password: {
        type: String, required: true, 
    },
    confirmPassword: {
        type: String, required: true
    },
    photo: {
        type: String
    }

})

const User = mongoose.model("User", userSchema)

export default User
