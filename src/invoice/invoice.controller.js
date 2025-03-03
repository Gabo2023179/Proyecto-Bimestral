import Invoice from "../models/invoice.model.js";
import { generateInvoicePDF } from "../helpers/db-validators.js";

/**
 * Obtiene todas las facturas. Si se pasa el query 'user', filtra por usuario.
 */
export const getInvoices = async (req, res) => {
  try {
    const query = {};

    if (req.query.user) {
      query.user = req.query.user;
    }

    const invoices = await Invoice.find(query)
      .populate("user", "name email")
      .populate("items.product", "name price");

    return res.status(200).json({ 
        success: true,
        invoices 
        });

  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Error al obtener las facturas",
      error: err.message,
    });
  }
};

/**
 * Obtiene una factura por su ID.
 */
export const getInvoiceById = async (req, res) => {
  try {
    const { id } = req.params;

    const invoice = await Invoice.findById(id)
      .populate("user", "name email")
      .populate("items.product", "name price");

    if (!invoice) {
      return res.status(404).json({
         success: false,
         message: "Factura no encontrada"
         });
    }

    return res.status(200).json({ 
        success: true,
        invoice 
        });

  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Error al obtener la factura",
      error: err.message,
    });
  }
};

/**
 * Crea una nueva factura.
 */
export const createInvoice = async (req, res) => {
  try {
    const { user, items, total } = req.body;

    const invoice = new Invoice({ user, items, total });

    await invoice.save();

    return res.status(201).json({ 
        success: true,
        message: "Factura creada exitosamente", 
        invoice 
        });

  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Error al crear la factura",
      error: err.message,
    });
  }
};

/**
 * Actualiza una factura existente.
 */
export const updateInvoice = async (req, res) => {
  try {
    const { id } = req.params;

    const updatedInvoice = await Invoice.findByIdAndUpdate(id, req.body, { new: true });

    if (!updatedInvoice) {
      return res.status(404).json({ 
        success: false,
        message: "Factura no encontrada para actualizar"
        });
    }

    return res.status(200).json({ 
        success: true,
        message: "Factura actualizada exitosamente",
        invoice: updatedInvoice 
        });

  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Error al actualizar la factura",
      error: err.message,
    });
  }
};

/**
 * Genera el PDF de una factura y lo envía para descarga.
 */
export const downloadInvoicePDF = async (req, res) => {
  try {
    const { id } = req.params;

    const invoice = await Invoice.findById(id)
      .populate("user", "name email")
      .populate("items.product", "name price");

    if (!invoice) {
      return res.status(404).json({ 
        success: false,
        message: "Factura no encontrada" 
        });
    }

    const pdfPath = await generateInvoicePDF(invoice);

    return res.download(pdfPath, `factura_${invoice._id}.pdf`, (err) => {
      if (err) {
        console.error("Error enviando el PDF", err);
      }
      // Se puede eliminar el archivo temporal si se desea
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Error al generar el PDF",
      error: err.message,
    });
  }
};
