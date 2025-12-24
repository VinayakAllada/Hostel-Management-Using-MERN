import express from "express";
import { submitRegistrationRequest } from "../controllers/StudentRegRequest.js";

const router = express.Router();

router.post("/request", submitRegistrationRequest);

export default router;
