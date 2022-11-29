import express, { Request, Response, NextFunction } from "express";

import multer from "multer";

import User from "../models/userModel";
import { customRequest } from "./authController";
import { unlink } from "fs";

export interface IMulter {
  req: customRequest;
  file: Express.Multer.File;
  cb: (error: Error | null, destination: string | boolean) => void;
}

export const getUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    let query = {};

    const filterByNickname = req.params.nickname || "";
    if (filterByNickname) {
      query = { nickname: filterByNickname };
    }

    const users = await User.find(query);

    return res.status(200).json({
      data: {
        users,
      },
    });
  } catch (err) {
    return err;
  }
};

// Controller for updating user data

export const updateUser = async (
  req: customRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    // getting the user data from database (based on the token)
    const opts = { runValidators: true };

    if (!req.user) {
      return res.status(400).json({
        status: "failed",
        message: "invalid credentials",
      });
    }

    if (req.body.nickname) {
      await User.findByIdAndUpdate(
        req.user.id,
        {
          nickname: req.body.nickname,
        },
        opts
      );
    }

    if (req.body.password) {
      await User.findByIdAndUpdate(
        req.user.id,
        {
          password: req.body.password,
        },
        opts
      );
    }

    if (req.body.email) {
      await User.findByIdAndUpdate(
        req.user.id,
        { email: req.body.email },
        opts
      );
    }

    return res.status(200).json({
      status: "success",
    });
  } catch (error) {
    res.status(400).json({
      status: "failed",
      message: error,
    });
  }
};

// Controller for getting user by ID (I will probably not merge this controller with the first getUser, the cause is authorization and the usage of information)
export const getUserById = async (
  req: customRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) {
      return res.status(403).json({
        status: "failed",
        message: "unauthorized",
      });
    }
    const user = await User.findById(req.user.id);
    return res.status(200).json({
      user,
    });
  } catch (err) {
    return res.status(400).json({
      status: "failed",
      message: err,
    });
  }
};

// implementing image upload for user (photo)

// storage of image
const multerStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/images/users/");
  },
  filename: function (req: customRequest, file, cb) {
    cb(null, `user_${req.user?.id}_${Date.now()}.jpeg`);
  },
});

const upload = multer({
  storage: multerStorage,
  limits: { fileSize: 5 * 1000 * 1000 },
});

export const uploadUserPhoto = upload.single("photo");

export const updatePhoto = async (
  req: customRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.file || !req.user) {
      return res
        .status(401)
        .json({ status: "failed", message: "something went wrong" });
    }
    const userData = await User.findById(req.user.id);

    // deleting the old user photo if it exists

    if (userData && userData.photo) {
      const photo = userData.photo;
      unlink(`./public/images/users/${photo}`, (err) => {
        if (err) throw err;
      });
    }

    // updating the user photo in mongo
    await User.findByIdAndUpdate(req.user?.id, { photo: req.file.filename });

    return res.status(200).json({
      status: "success",
      data: req.file.filename,
    });
  } catch (err) {
    return res.status(400).json({
      status: "failed",
      message: err,
    });
  }
};

// getting the user swap offers
export const getUserOffers = async (
  req: customRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) {
      return res.status(401).json({ status: "failed", message: "no User" });
    }
    const loggedUser = await User.findOne({ _id: req.user.id }).populate(
      "swaps"
    );

    res.status(200).json({
      status: "success",
      data: loggedUser?.swaps,
    });
  } catch (err) {
    res.status(400).json({
      status: "failed",
      data: err,
    });
  }
};
