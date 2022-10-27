import express, {Request, Response, NextFunction} from 'express';
import {Book} from '../models/bookModel';


// Controller for getting all the Books data

export const getBooks = async (req:Request, res:Response, next:NextFunction) => {
    try {
        // query condition will store our filters (name filter and category filter) if only the queryCondition will be true
        let query = {}
        let queryCondition = false

        // 
        let categoryQuery = {}
        const filterByCategory = req.params.category || ""
        if (filterByCategory) {
            queryCondition= true
            categoryQuery = {category: filterByCategory}
        }

       

        



        const recordsPerPage = Number(req.query.records) || 10
        // number of the page choosen by user on frontend
        const pageNum = Number(req.query.pageNum) || 1
        // number of books in total in database
        const totalBooks = await Book.countDocuments()
        let sort = {}
        const sortOption = req.query.sort || ""

        // here I split the "sort" query (which should look something like name_1 or name_-1, author_1, author_-1 etc.),
        //  then I assigned the first value of this array (sortOpt after split) to dynamic key of sort, and second to the value of that key

        if (sortOption) {
            let sortOpt = (sortOption as string).split("_")
            sort = {[sortOpt[0]]: Number(sortOpt[1])}
        }

       
        let searchQuery = {}
        let select = {}
        const filterBySearch = req.query.search || ""
        if (filterBySearch) {
            queryCondition = true
            searchQuery = { $text: { $search: searchQuery } }
        select = {
            score: { $meta: "textScore" }
        }
        sort = { score: { $meta: "textScore" } }
        }

        if (queryCondition) {
            query = {
                $and: [
                categoryQuery,
                searchQuery

                ],
            };
            }
        

        // books that should be visible on actual page
        const books = await Book.find(query).skip(recordsPerPage * (pageNum - 1)).sort(sort).limit(recordsPerPage)
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