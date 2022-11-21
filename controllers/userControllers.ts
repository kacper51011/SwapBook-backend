import express, { Request, Response, NextFunction } from "express";
import User from "../models/userModel";
import { customRequest } from "./authController";

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
    const user = await User.findById(req.user?.id);
    console.log(user);
    if (!user) {
      return res.status(400).json({
        status: "failed",
        message: "invalid credentials",
      });
    }
    if (req.body.nickname) {
      user.nickname = req.body.nickname;
    }
    user.password = req.body.password || user.password;
    if (req.file) {
      user.photo = req.file.filename;
    }

    if (req.body.oldPassword && req.body.oldPassword === user.password) {
      user.password = req.body.password;
    }
    if (req.body.oldPassword && req.body.oldPassword !== user.password) {
      return res.status(400).json({
        status: "failed",
        message: "Invalid old password!",
      });
    }

    await user.save();
  } catch (error) {}
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
const multer = require("multer");
const sharp = require("sharp");

const multerStorage = multer.memoryStorage();

// image filter

const multerFilter = ({ req, file, cb }: IMulter) => {
  const acceptableExtension = "jpg" || "png" || "jpeg";
  const extension = file.mimetype.split("/")[1];
  if (extension == acceptableExtension) {
    cb(null, true);
  } else {
    cb(new Error("only images are allowed!"), false);
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
  limits: { fileSize: 10000000 },
});
export const uploadUserPhoto = upload.single("photo");

// todo in patch:

export const resizeUserPhoto = async (
  req: customRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    // todo: in patch, check if user already have a photo, then delete the previous one
    if (!req.file) return next();

    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);

    // setting filename
    req.file.filename = `user-${req.user?.id}-${uniqueSuffix}.jpeg}`;

    // resizing the image, etc
    await sharp(req.file.buffer)
      .resize(500, 500)
      .toFormat("jpeg")
      .jpeg({ quality: 90 })
      .toFile(`../public/images/users/${req.file.filename}`);

    next();
  } catch (err) {
    return res.status(400).json({
      status: "failed",
      message: err,
    });
  }
};
