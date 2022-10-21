import express, {Request, Response, NextFunction} from 'express';
import {Book} from '../models/bookModel';


export const getBooks = async (req:Request, res:Response, next:NextFunction) => {
    try {
        const books = await Book.find({}).sort({name: "asc"}).orFail()
    } catch(error) {res.status(400)}
}


export const createBook = async (req:Request, res:Response) => {
    try {
        const newBook = await Book.create(req.body);

        res.status(201).json({
            status: "success",
            data: {
                "book": newBook
            }

        })
        
    } catch(err){
        res.status(400).json({
            status: "fail",
            message: "invalid data"
        })
        console.log(err)
    }

}