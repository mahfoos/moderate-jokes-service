import { Request, Response } from "express";
import { body, ValidationChain } from "express-validator";
import jwt from "jsonwebtoken";

export const loginValidation: ValidationChain[] = [
  body("email").isEmail().normalizeEmail(),
  body("password").isLength({ min: 6 }),
];

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (
      email !== process.env.ADMIN_EMAIL ||
      password !== process.env.ADMIN_PASSWORD
    ) {
      res.status(401).json({ message: "Invalid credentials" });
      return;
    }

    const token = jwt.sign({ email, role: "admin" }, process.env.JWT_SECRET!, {
      expiresIn: "1h",
    });

    res.json({ token });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};
