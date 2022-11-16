import express, { Request, Response, NextFunction, response } from "express";
import { Book } from "../models/bookModel";
import User from "../models/userModel";
import { customRequest } from "./authController";
import { imageValidate } from "../utils/imageValidate";

// Controller for getting all the Books data

export const getBooks = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // query will store our filters (name filter and category filter) if only the queryCondition will be true
    let query = {};
    let queryCondition = false;

    //
    let categoryQuery = {};
    const filterByCategory = req.params.category || "";
    if (filterByCategory) {
      queryCondition = true;
      categoryQuery = { category: filterByCategory };
    }

    const recordsPerPage = Number(req.query.records) || 10;
    // number of the page choosen by user on frontend
    const pageNum = Number(req.query.pageNum) || 1;
    // number of books in total in database
    const totalBooks = await Book.countDocuments();
    let sort = {};
    const sortOption = req.query.sort || "";

    // here I split the "sort" query (which should look something like name_1 or name_-1, author_1, author_-1 etc.),
    //  then I assigned the first value of this array (sortOpt after split) to dynamic key of sort, and second to the value of that key

    if (sortOption) {
      let sortOpt = (sortOption as string).split("_");
      sort = { [sortOpt[0]]: Number(sortOpt[1]) };
    }

    const filterBySearch = req.params.searchQuery || "";
    let search = {};
    let select = {};

    if (filterBySearch) {
      queryCondition = true;
      search = { $text: { $search: filterBySearch } };
      select = {
        score: { $meta: "textScore" },
      };
      sort = { score: { $meta: "textScore" } };
    }

    if (queryCondition) {
      query = {
        $and: [categoryQuery, search],
      };
    }

    // books that should be visible on actual page
    const books = await Book.find(query)
      .select(select)
      .skip(recordsPerPage * (pageNum - 1))
      .sort(sort)
      .limit(recordsPerPage);
    const booksLength = books.length;
    // amount of pages to choose in pagination component
    const paginationNumbers = Math.ceil(booksLength / recordsPerPage);

    res.status(200).json({
      books,
      pageNum,
      totalBooks,
      booksLength,
      paginationNumbers,
    });
  } catch (err) {
    console.log(err);
    res.status(404).json({
      status: "failed",
      message:
        "something went wrong, try again later or change your search values",
    });
  }
};

// searching for a single book, will be used for displaying subpage after clicking displayed book on the list

export const getOneBook = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const oneBook = await Book.findById(req.params.id);

    res.status(200).json({
      data: {
        oneBook,
      },
    });
  } catch (err) {}
};

// Controller for Post request
export const createBook = async (
  req: customRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    console.log("123");
    const {
      nameOfTheBook,
      author,
      category,
      releaseDate,
      swapFor,
      description,
      swapPlace,
    } = req.body;
    if (
      !nameOfTheBook ||
      !author ||
      !category ||
      !releaseDate ||
      !swapFor ||
      !description ||
      !swapPlace
    ) {
      return res
        .status(400)
        .json({ status: "failed", message: "Lack of the data about book" });
    }
    const newBook = req.body;
    newBook.createdBy = req.user?.id;

    const createdBook = await Book.create(newBook);
    const creator = await User.findById(req.user?.id);
    console.log(req.user);

    creator?.swaps?.push(createdBook._id);
    creator?.save();

    res.status(201).json({
      status: "success",
      data: {
        book: createdBook,
      },
    });
  } catch (err) {
    return res.status(401).json({
      status: "fail",
      message: err,
    });
  }
};

export const uploadImage = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.files || Boolean(req.files.images) == false) {
      return res.status(400).send("no image uploaded");
    }

    const validateImageRequest = imageValidate(req.files.images);
    if (validateImageRequest.err) {
      return res.status(400).send(validateImageRequest.err);
    }

    const path = require("path");
    const { v4: uuidv4 } = require("uuid");

    // todo <- I will use that sentence to find the place in code where i should do something later but not now
    //  to add: after connecting backend with frontend (the files together) -> create a path to the frontend images folder to store them there

    let imagesTable = [];
    if (Array.isArray(req.files.images)) {
      imagesTable = req.files.images;
    } else {
      imagesTable.push(req.files.images);
    }

    for (let image of imagesTable) {
    }
  } catch (err) {}
};
