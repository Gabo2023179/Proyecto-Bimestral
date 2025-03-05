import Invoice from "../invoice/invoice.model.js";
import Product from "../product/product.model.js";
import fs from "fs";
import { generateInvoicePDF, validateInvoiceStock } from "../helpers/db-validators.js";

/**
 * Obtiene todas las facturas, opcionalmente filtradas por usuario.
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
 * Se revierte el stock de los items anteriores, se valida el stock para los nuevos items y se actualizan los productos.
 */
export const updateInvoice = async (req, res) => {
  try {
    const { id } = req.params;

    // Buscar la factura existente
    const existingInvoice = await Invoice.findById(id);
    if (!existingInvoice) {
      return res.status(404).json({
        success: false,
        message: "Factura no encontrada para actualizar",
      });
    }

    // Si se actualizan los items, se debe ajustar el stock de los productos
    if (req.body.items) {
      // Revertir el stock de los items anteriores
      for (const oldItem of existingInvoice.items) {
        const product = await Product.findById(oldItem.product);
        if (product) {
          product.stock += oldItem.quantity;
          product.sold = Math.max((product.sold || 0) - oldItem.quantity, 0);
          await product.save();
        }
      }

      // Validar stock para los nuevos items
      await validateInvoiceStock(req.body.items);

      let newTotal = 0;
      // Actualizar stock y ventas para los nuevos items
      for (const newItem of req.body.items) {
        const product = await Product.findById(newItem.product);
        newTotal += product.price * newItem.quantity;
        product.stock -= newItem.quantity;
        product.sold = (product.sold || 0) + newItem.quantity;
        await product.save();
      }
      req.body.total = newTotal;
    }

    // Actualizar la factura
    const updatedInvoice = await Invoice.findByIdAndUpdate(id, req.body, { new: true });
    if (!updatedInvoice) {
      return res.status(404).json({
        success: false,
        message: "Factura no encontrada para actualizar",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Factura actualizada exitosamente",
      invoice: updatedInvoice,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Error al actualizar la factura",
      error: err.message,
    });
  }
};


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

    // Llamar al helper para generar el PDF
    const pdfPath = await generateInvoicePDF(invoice);

    // Configurar cabeceras para indicar descarga
    res.setHeader("Content-Disposition", `attachment; filename=factura_${invoice._id}.pdf`);
    res.setHeader("Content-Type", "application/pdf");

    // Enviar el archivo PDF al cliente y luego eliminar el archivo temporal
    res.download(pdfPath, `factura_${invoice._id}.pdf`, (err) => {
      if (err) {
        console.error("Error enviando el PDF:", err);
      }
      fs.unlink(pdfPath, (unlinkErr) => {
        if (unlinkErr) {
          console.error("Error eliminando el archivo temporal:", unlinkErr);
        }
      });
    });
  } catch (err) {
    console.error("Error al generar el PDF:", err);
    return res.status(500).json({
      success: false,
      message: "Error al generar el PDF",
      error: err.message,
    });
  }
};