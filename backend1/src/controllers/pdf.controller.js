import PDFParser from "pdf2json";
import { PDF } from "../models/pdf.models.js";

export const uploadPDF = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "No PDF uploaded" });
    }

    const pdfParser = new PDFParser();

    const extractedText = await new Promise((resolve, reject) => {
      pdfParser.on("pdfParser_dataReady", (pdfData) => {
        const text = pdfData.Pages.map(page =>
          page.Texts.map(t => decodeURIComponent(t.R[0].T)).join(" ")
        ).join("\n");
        resolve(text);
      });
      pdfParser.on("pdfParser_dataError", reject);
      pdfParser.parseBuffer(req.file.buffer);
    });

    const savedPDF = await PDF.create({
      user: req.user._id,
      title: req.file.originalname,
      text: extractedText
    });

    res.json({ success: true, pdfId: savedPDF._id });

  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};