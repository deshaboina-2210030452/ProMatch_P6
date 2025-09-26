import express from "express";
import { getProblems ,createProblem,vectorSearch} from "../controllers/problemController.js";

const router = express.Router();

// list problems
router.get("/", getProblems);

router.post("/",createProblem);
// router.post("/search", searchProblems);
router.post("/search/vector", vectorSearch);

export default router;
