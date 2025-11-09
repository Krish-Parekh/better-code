import { Router } from "express";
import {
	getAllProblems,
	getProblemById,
} from "../controllers/problems.controller";

const router = Router();

router.get("/", getAllProblems);
router.get("/:id", getProblemById);

export default router;
