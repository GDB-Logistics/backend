import { Request, Response } from "express";

export const newOrder = (req: Request, res: Response): void => {
  res.status(201).json({ message: "ok" });
};
