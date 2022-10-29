import User from "../models/userModel";
import express, { Request, Response, NextFunction } from "express";
import bcrypt from "bcryptjs";
const jwt = require("jsonwebtoken");

export const signUp = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { nickname, email, password, confirmPassword } = req.body;

    // inputs check
    if (!(nickname && email && password)) {
      return res.status(400).send("all inputs are required");
      next();
    }
    // email already in database check
    let userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).send("this email is already in use");
      next();
    }

    // nickname already in database check
    userExists = await User.findOne({ nickname });
    if (userExists) {
      return res.status(400).send("this nickname is already in use");
      next();
    }
    // confirm password === password check
    if (password !== confirmPassword) {
      return res.status(400).send("passwords do not match!");
      next();
    }
    const newUser = await User.create(req.body);

    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRE,
    });

    res.status(201).json({
      status: "success",
    });
    next();
  } catch (err) {
    next(err);
  }
};

export const signIn = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        status: "failed",
        message: "Provide email and password",
      });
      next();
    }

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return res.status(400).json({
        status: "failed",
        message: "Can`t find any user with that email",
      });
      next();
    }

    const passwordValidation = await bcrypt.compare(password, user.password);
    if (!passwordValidation) {
      return res.status(400).json({
        status: "failed",
        message: "Uncorrect password",
      });
      next();
    }

    const token = "";
    res.status(200).json({ status: "success" });
  } catch (err) {
    next(err);
  }
};
