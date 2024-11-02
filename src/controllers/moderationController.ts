import { Request, Response } from "express";
import { body, ValidationChain } from "express-validator";
import { JokeService } from "../services/jokeService";

const jokeService = new JokeService();

export const validateJokeUpdate: ValidationChain[] = [
  body("content").isString().notEmpty(),
  body("type").isString().notEmpty(),
];

/**
 * @swagger
 * components:
 *   schemas:
 *     Joke:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         content:
 *           type: string
 *         type:
 *           type: string
 *         isActive:
 *           type: boolean
 *
 * /jokes/next:
 *   get:
 *     summary: Get next unmoderated joke
 *     tags: [Jokes]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Returns the next unmoderated joke
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Joke'
 *       404:
 *         description: No jokes available for moderation
 *
 * /jokes/{id}/approve:
 *   post:
 *     summary: Approve a joke
 *     tags: [Jokes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - content
 *               - type
 *             properties:
 *               content:
 *                 type: string
 *               type:
 *                 type: string
 *     responses:
 *       200:
 *         description: Joke approved successfully
 *
 * /jokes/{id}/reject:
 *   post:
 *     summary: Reject a joke
 *     tags: [Jokes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Joke rejected successfully
 *
 * /jokes/types:
 *   get:
 *     summary: Get all joke types
 *     tags: [Jokes]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Returns array of joke types
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: string
 */
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
