import express from "express";
import { protectRoute } from "../middleware/auth.js";
import {
  getMyInvoices,
  getBlockInvoices,
  createInvoice,
  markInvoicePaid,
} from "../controllers/invoices.js";

const router = express.Router();

router.get("/my", protectRoute, getMyInvoices);          // student
router.get("/admin", protectRoute, getBlockInvoices);   // admin
router.post("/", protectRoute, createInvoice);          // admin
router.patch("/:id/pay", protectRoute, markInvoicePaid); // student

export default router;
