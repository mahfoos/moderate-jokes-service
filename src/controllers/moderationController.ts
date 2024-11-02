import { Request, Response } from "express";
import { body, ValidationChain } from "express-validator";
import { JokeService } from "../services/jokeService";

const jokeService = new JokeService();

export const validateJokeUpdate: ValidationChain[] = [
  body("content").isString().notEmpty(),
  body("type").isString().notEmpty(),
];

export const getNextJoke = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const joke = await jokeService.getUnmoderatedJoke();
    if (!joke) {
      res.status(404).json({ message: "No jokes available for moderation" });
      return;
    }
    res.json(joke);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

export const approveJoke = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const { content, type } = req.body;

    const success = await jokeService.approveJoke(parseInt(id), {
      content,
      type,
    });
    if (!success) {
      res.status(500).json({ message: "Failed to approve joke" });
      return;
    }

    res.json({ message: "Joke approved successfully" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

export const rejectJoke = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const success = await jokeService.rejectJoke(parseInt(id));

    if (!success) {
      res.status(500).json({ message: "Failed to reject joke" });
      return;
    }

    res.json({ message: "Joke rejected successfully" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getJokeTypes = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const types = await jokeService.getJokeTypes();
    res.json(types);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};
