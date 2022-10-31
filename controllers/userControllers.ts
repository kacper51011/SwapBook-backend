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
    next();
  } catch (err) {
    return res.status(400).json({
      status: "failed",
      message: err,
    });
  }
};
