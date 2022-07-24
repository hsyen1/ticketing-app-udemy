import express from "express";
import { authCheck } from "../middleware/auth-check";
import { currentUser } from "../middleware/current-user";

const router = express.Router();

router.get("/api/users/currentuser", currentUser, authCheck, (req, res) => {
  res.send({ currentUser: req.currentUser || null });
});

export { router as currentUserRouter };
