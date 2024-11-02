// src/routes/index.ts
import { Router, Request, Response, NextFunction } from "express";
import { login, loginValidation } from "../controllers/authController";
import {
  getNextJoke,
  approveJoke,
  rejectJoke,
  getJokeTypes,
  validateJokeUpdate,
} from "../controllers/moderationController";
import { authMiddleware } from "../middleware/auth";

const router = Router();

// Auth routes
router.post("/auth/login", loginValidation, login);

// Protected routes
router.use((req: Request, res: Response, next: NextFunction) =>
  authMiddleware(req, res, next)
);
router.get("/jokes/next", getNextJoke);
router.post("/jokes/:id/approve", validateJokeUpdate, approveJoke);
router.post("/jokes/:id/reject", rejectJoke);
router.get("/jokes/types", getJokeTypes);

export default router;
