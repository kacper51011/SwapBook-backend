import express, {Request, Response, NextFunction} from 'express';
import {Book} from '../models/bookModel';
import {recordsPerPage} from "../config/pagination";

// Controller for getting all the Books data

export const getBooks = async (req:Request, res:Response, next:NextFunction) => {
    try {
        // number of the page choosen by user on frontend
        const pageNum = Number(req.query.pageNum) || 1
        // number of books in total in database
        const totalBooks = await Book.countDocuments()
        let sort = {}
        const sortOption = req.query.sort || ""
        if (sortOption) {
            let sortOpt = (sortOption as string).split("_")
            sort = {[sortOpt[0]]: Number(sortOpt[1])}
        }
        // books that should be visible on actual page
        const books = await Book.find().skip(recordsPerPage * (pageNum - 1)).sort({name: 1}).limit(recordsPerPage)
        // amount of pages to choose in pagination component
        const paginationNumbers = Math.ceil(totalBooks / recordsPerPage)

        res.status(200).json({
           books, pageNum, totalBooks, paginationNumbers
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