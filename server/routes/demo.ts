import { Request, Response } from "express";

export async function handleDemo(req: Request, res: Response) {
  res.json({
    message: "Demo endpoint disabled - app now uses only user data",
    status: "disabled"
  });
}