import express, { Request, Response } from "express";
import { body } from "express-validator";
import { BadRequestError } from "../errors/bad-reuqest-error";
import { validateRequest } from "../middleware/validate-requests";
import { User } from "../models/user";
import jwt from "jsonwebtoken";

const router = express.Router();

router.post(
  "/api/users/signup",
  [
    body("email").isEmail().withMessage("Email must be in a valid format"),
    body("password")
      .trim()
      .isLength({ min: 4, max: 20 })
      .withMessage("Password must be between 4 to 20 characters"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log("Email already in use");
      throw new BadRequestError("Email already in use");
    }

    const newUser = User.build({ email, password });
    await newUser.save();

    // generate JWT
    const userJWT = jwt.sign(
      {
        id: newUser.id,
        email: newUser.email,
      },
      process.env.JWT_KEY!
    );

    // set session
    req.session = {
      jwt: userJWT,
    };

    res.status(201).send(newUser);
  }
);

export { router as signUpRouter };
