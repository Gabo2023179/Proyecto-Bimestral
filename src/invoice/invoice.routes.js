import { Router } from "express";
import {getInvoices,getInvoiceById,createInvoice,updateInvoice,downloadInvoicePDF} from "../invoice/invoice.controller.js";
import {createInvoiceValidator,updateInvoiceValidator,getInvoiceByIdValidator} from "../middlewares/invoice-validators.js";

const router = Router();

router.get("/", getInvoices);
router.get("/:id", getInvoiceByIdValidator, getInvoiceById);
router.post("/createInvoice", createInvoiceValidator, createInvoice);
router.put("/:id", updateInvoiceValidator, updateInvoice);
router.get("/:id/pdf", getInvoiceByIdValidator, downloadInvoicePDF);

export default router;
