import User from "../models/userModel";
import express, {Request, Response, NextFunction} from 'express';

export const signUp = async (req:Request, res: Response, next: NextFunction) =>{
    const newUser = await User.create(req.body)

    res.status(201).json({
        status: "success"
    })


}