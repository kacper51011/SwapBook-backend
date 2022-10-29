import mongoose, { Types } from "mongoose"
import validator from "validator";
import bcrypt from "bcryptjs"

const { Schema, model} = mongoose

interface IUser{
    nickname: string
    email: string
    password: string
    confirmPassword: string | undefined
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
        type: String, required: true, select: false
    },
    confirmPassword: {
        type: String, required: true,
    },
    
    photo: {
        type: String
    }

})

userSchema.pre("save", async function(next) {
    if(!this.isModified("password")) return next();

    this.password = await bcrypt.hash(this.password, 12)
    this.confirmPassword = undefined
    
})

const User = mongoose.model("User", userSchema)

export default User
