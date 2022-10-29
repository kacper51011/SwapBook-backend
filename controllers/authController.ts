import User from "../models/userModel";
import express, {Request, Response, NextFunction} from 'express';

export const signUp = async (req:Request, res: Response, next: NextFunction) =>{
    try {
        const {nickname, email, password, confirmPassword} = req.body
        if(!(nickname && email && password)) {
            return res.status(400).send("all inputs are required")
        }

        let userExists = await User.findOne({ email })
        if (userExists) {
            return res.status(400).send("this email is already in use")
        }
        userExists = await User.findOne({nickname})
        if (userExists) {
            return res.status(400).send("this nickname is already in use")
        }
        if (password !== confirmPassword) {
            return res.status(400).send("passwords do not match!")
        }
        const newUser = await User.create(req.body)
    
     res.status(201).json({
        status: "success"
    })
    
    }catch(err){
        next(err)
    }
    

   

    

    



}

