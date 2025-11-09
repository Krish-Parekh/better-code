import { Router } from "express";
import {
	getAllProblems,
	getProblemById,
} from "../controllers/problems.controller";
import { authMiddleware } from "../middlewares/auth.middleware";


const router = Router();

router.get("/", authMiddleware, getAllProblems);
router.get("/:id", authMiddleware, getProblemById);

export default router;
