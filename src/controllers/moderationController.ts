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

    if (!content || !type) {
      res.status(400).json({
        message: "Content and type are required",
        success: false,
      });
      return;
    }

    console.log("Approving joke:", { id, content, type });

    const success = await jokeService.approveJoke(id, {
      content,
      type,
    });

    if (!success) {
      res.status(500).json({
        message: "Failed to approve joke",
        success: false,
      });
      return;
    }

    res.json({
      message: "Joke approved successfully",
      success: true,
    });
  } catch (error: any) {
    console.error("Error in approveJoke controller:", error);
    res.status(500).json({
      message: "Internal server error",
      error: error.message,
      success: false,
    });
  }
};

export const rejectJoke = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    if (!id) {
      res.status(400).json({
        success: false,
        message: "Joke ID is required",
      });
      return;
    }

    try {
      const success = await jokeService.rejectJoke(id);

      if (success) {
        res.json({
          success: true,
          message: "Joke rejected successfully",
        });
      } else {
        res.status(500).json({
          success: false,
          message: "Failed to reject joke",
        });
      }
    } catch (error) {
      if (error instanceof Error && error.message === "Joke not found") {
        res.status(404).json({
          success: false,
          message: "Joke not found",
        });
      } else {
        throw error; // Re-throw for general error handling
      }
    }
  } catch (error) {
    console.error("Error in rejectJoke controller:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error instanceof Error ? error.message : "Unknown error",
    });
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
