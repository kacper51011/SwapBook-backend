import express, { Request, Response, NextFunction } from "express";
import User from "../models/userModel";
import { customRequest } from "./authController";

export const getUsers = async (
  req: customRequest,
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
    if (!user) {
      return res.status(400).json({
        status: "failed",
        message: "invalid credentials",
      });
    }

    user.nickname = req.body.nickname || user.nickname;
    user.photo = req.body.photo || user.photo || undefined;
    user.password = user.password;

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

export const getUserById = async (
  req: customRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = User.findById(req.params.id).orFail();
    return res.send(user);
  } catch (err) {
    next(err);
  }
};
