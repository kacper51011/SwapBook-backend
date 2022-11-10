import User from "../models/userModel";
import express, { Request, Response, NextFunction } from "express";
import bcrypt from "bcryptjs";
const jwt = require("jsonwebtoken");

interface IJWT {
  id: string;
  email: string;
  nickname: string;
}

export interface customRequest extends Request {
  user?: IJWT | undefined;
}

// sign up / register

export const signUp = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { nickname, email, password, confirmPassword } = req.body;

    // inputs check
    if (!(nickname && email && password)) {
      return res.status(400).json({
        status: "failed",
        message: "Provide all inputs!",
      });
    }
    // email already in database check
    let userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({
        status: "failed",
        message: "email already in use!",
      });
    }

    // nickname already in database check
    userExists = await User.findOne({ nickname });
    if (userExists) {
      return res.status(400).json({
        status: "failed",
        message: "nickname already in use!",
      });
    }
    // confirm password === password check
    if (password !== confirmPassword) {
      return res.status(400).json({
        status: "failed",
        message: "passwords do not match!",
      });
    }
    const newUser = await User.create(req.body);

    const token = jwt.sign(
      { id: newUser._id, nickname: newUser.nickname, email: newUser.email },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRE,
      }
    );

    res
      .status(201)
      .cookie("access_token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
      })
      .json({
        status: "success",
        data: {
          newUser,
        },
      });
    next();
  } catch (err) {
    next(console.log(err));
  }
};

// sign in / login

export const signIn = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password, dontLogout } = req.body;

    // email and password input check

    if (!email || !password) {
      return res.status(400).json({
        status: "failed",
        message: "Provide email and password",
      });
    }

    const user = await User.findOne({ email }).select("+password");

    // is user existing in database check

    if (!user) {
      return res.status(400).json({
        status: "failed",
        message: "Can`t find any user with that email",
      });
    }

    // is the password correct check

    const passwordValidation = await bcrypt.compare(password, user.password);
    if (!passwordValidation) {
      return res.status(400).json({
        status: "failed",
        message: "Uncorrect password",
      });
    }

    const token = jwt.sign(
      { id: user._id, nickname: user.nickname, email: user.email },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRE,
      }
    );

    let cookieOptions = {};
    if (dontLogout) {
      cookieOptions = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 1000 * 60 * 60 * 24 * 7,
      };
    } else {
      cookieOptions = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
      };
    }

    res.status(200).cookie("access_token", token, cookieOptions).json({
      status: "success",
      user: user,
      cookieOptions: cookieOptions,
    });
    next();
  } catch (err) {
    next(err);
  }
};

// this controller will protect our routes (the ones where being logged in is needed)

export const verifyIsLoggedIn = async (
  req: customRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.cookies.access_token;

    if (!token) {
      return res.status(403).send("Token is required for authentication!");
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      // assigning the req.user to the decoded token, it allow us to use user data after authorization
      req.user = decoded;
    } catch (err) {
      return res.status(400).send("Invalid token!");
    }
  } catch (err) {
    return next(err);
  }

  next();
};
