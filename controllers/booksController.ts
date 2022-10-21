import express, {Request, Response, NextFunction} from 'express';
import {Book} from '../models/bookModel';

// Controller for getting all the Books data

export const getBooks = async (req:Request, res:Response, next:NextFunction) => {
    try {
        const books = await Book.find()

        res.status(200).json({
            results: books.length,
            data: {
                books
            }
        })
    } catch(err) {res.status(404).json({
        status: "failed"
    })}
}

export const getOneBook = async (req:Request, res:Response, next:NextFunction) => {
    try {
        const oneBook = await Book.findById(req.params.id)

        res.status(200).json({
            data: {
                oneBook
            }
        })
    } catch(err){

    }
}

// Controller for Post request
export const createBook = async (req:Request, res:Response, next:NextFunction) => {
    try {
        const newBook = await Book.create(req.body);

        res.status(201).json({
            status: "success",
            data: {
                "book": newBook
            }

        })
        
    } catch(err){
        res.status(401).json({
            status: "fail",
            message: "invalid data"
        })
        console.log(err)
    }

}