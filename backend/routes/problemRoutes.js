import express from "express";
import { getProblems ,createProblem} from "../controllers/problemController.js";

const router = express.Router();

// list problems
router.get("/", getProblems);

router.post("/",createProblem);
// router.post("/search", searchProblems);

export default router;
