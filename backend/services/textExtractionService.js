const mammoth = require("mammoth");
const pdfParse = require("pdf-parse");

async function extractTextFromFile(file) {
  const extension = file.originalname.split(".").pop()?.toLowerCase();

  if (extension === "pdf") {
    const parsed = await pdfParse(file.buffer);
    return parsed.text || "";
  }

  if (extension === "docx") {
    const parsed = await mammoth.extractRawText({ buffer: file.buffer });
    return parsed.value || "";
  }

  if (extension === "txt") {
    return file.buffer.toString("utf-8");
  }

  throw new Error("Unsupported file type.");
}

module.exports = {
  extractTextFromFile
};
