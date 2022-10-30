import express, { Request, Response, NextFunction } from "express";
import User from "../models/userModel";

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

    res.status(200).json({
      data: {
        users,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "failed",
      message: err,
    });
  }
};
