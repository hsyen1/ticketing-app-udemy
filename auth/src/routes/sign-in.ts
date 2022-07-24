import express, { Request, Response } from "express";
import { body } from "express-validator";
import { BadRequestError } from "../errors/bad-reuqest-error";
import { validateRequest } from "../middleware/validate-requests";
import { User } from "../models/user";
import { PasswordUtil } from "../services/utils/password-util";
import jwt from "jsonwebtoken";

const router = express.Router();

router.post(
  "/api/users/signin",
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
    if (!existingUser) {
      throw new BadRequestError("Invalid credentials");
    }

    const passwordsMatch = await PasswordUtil.compare(
      existingUser.password,
      password
    );
    if (!passwordsMatch) {
      throw new BadRequestError("Invalid credentials");
    }

    const userJWT = jwt.sign(
      {
        id: existingUser.id,
        email: existingUser.email,
      },
      process.env.JWT_KEY!
    );

    // set session
    req.session = {
      jwt: userJWT,
    };

    res.status(200).send(existingUser);
  }
);

export { router as signInRouter };
