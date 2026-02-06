// PDF Generation Service for KEW Forms
const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");
const logger = require("../config/logger");

class PDFService {
  /**
   * Generate KEW Animal Care Record PDF (KEW.AH-7)
   */
  async generateCareRecordPDF(careRecord, animal) {
    return new Promise((resolve, reject) => {
      try {
        const doc = new PDFDocument({ bufferPages: true });
        const filename = `care-record-${careRecord.id}.pdf`;
        const filepath = path.join(__dirname, "../uploads/documents", filename);

        // Ensure directory exists
        if (!fs.existsSync(path.dirname(filepath))) {
          fs.mkdirSync(path.dirname(filepath), { recursive: true });
        }

        const stream = fs.createWriteStream(filepath);
        doc.pipe(stream);

        // Header
        doc
          .fontSize(16)
          .font("Helvetica-Bold")
          .text("REKOD PENJAGAAN HAIWAN", { align: "center" });
        doc
          .fontSize(11)
          .font("Helvetica")
          .text("(KEW.AH-7)", { align: "center" });
        doc.moveDown(0.5);

        // Animal Details
        doc
          .fontSize(11)
          .font("Helvetica-Bold")
          .text("Maklumat Haiwan:", { underline: true });
        doc.font("Helvetica").fontSize(10);
        doc.text(`Kodperkhidmatan Haiwan: ${animal.animalCode || "N/A"}`);
        doc.text(`Nama Haiwan: ${animal.name || "N/A"}`);
        doc.text(`Spesies: ${animal.species || "N/A"}`);
        doc.text(
          `Tarikh Pendaftaran: ${animal.registeredDate ? new Date(animal.registeredDate).toLocaleDateString("ms-MY") : "N/A"}`,
        );
        doc.moveDown(0.5);

        // Care Record Details
        doc
          .fontSize(11)
          .font("Helvetica-Bold")
          .text("Maklumat Penjagaan:", { underline: true });
        doc.font("Helvetica").fontSize(10);
        doc.text(`Jenis Penjagaan: ${careRecord.careType || "N/A"}`);
        doc.text(
          `Tarikh Penjagaan: ${careRecord.dateOfCare ? new Date(careRecord.dateOfCare).toLocaleDateString("ms-MY") : "N/A"}`,
        );
        doc.text(`Penerangan: ${careRecord.description || "N/A"}`);
        doc.text(`Doktor Haiwan: ${careRecord.veterinarian || "N/A"}`);
        doc.text(`Kos: RM ${parseFloat(careRecord.cost || 0).toFixed(2)}`);
        doc.text(`Rujukan Kontrak: ${careRecord.contractRef || "N/A"}`);
        doc.text(`Catatan: ${careRecord.notes || "N/A"}`);
        doc.moveDown(1);

        // Footer
        doc
          .fontSize(9)
          .font("Helvetica")
          .text(`Generated: ${new Date().toLocaleString("ms-MY")}`, {
            align: "center",
            color: "#666666",
          });

        doc.end();

        stream.on("finish", () => {
          logger.info(`PDF generated: ${filename}`);
          resolve({ filename, filepath });
        });
      } catch (error) {
        logger.error("PDF generation error:", error);
        reject(error);
      }
    });
  }

  /**
   * Generate KEW Livestock Incident Report PDF (KEW.AH-9)
   */
  async generateIncidentReportPDF(incident, animal) {
    return new Promise((resolve, reject) => {
      try {
        const doc = new PDFDocument({ bufferPages: true });
        const filename = `incident-${incident.id}.pdf`;
        const filepath = path.join(__dirname, "../uploads/documents", filename);

        if (!fs.existsSync(path.dirname(filepath))) {
          fs.mkdirSync(path.dirname(filepath), { recursive: true });
        }

        const stream = fs.createWriteStream(filepath);
        doc.pipe(stream);

        // Header
        doc
          .fontSize(16)
          .font("Helvetica-Bold")
          .text("LAPORAN INSIDEN HAIWAN", { align: "center" });
        doc
          .fontSize(11)
          .font("Helvetica")
          .text("(KEW.AH-9)", { align: "center" });
        doc.moveDown(0.5);

        // Animal & Incident Details
        doc
          .fontSize(11)
          .font("Helvetica-Bold")
          .text("Butiran Haiwan:", { underline: true });
        doc.font("Helvetica").fontSize(10);
        doc.text(`Kod Haiwan: ${animal.animalCode || "N/A"}`);
        doc.text(`Nama: ${animal.name || "N/A"}`);
        doc.moveDown(0.3);

        doc
          .fontSize(11)
          .font("Helvetica-Bold")
          .text("Butiran Insiden:", { underline: true });
        doc.font("Helvetica").fontSize(10);
        doc.text(`Jenis Insiden: ${incident.incidentType || "N/A"}`);
        doc.text(
          `Tarikh Dikenal Pasti: ${incident.dateIdentified ? new Date(incident.dateIdentified).toLocaleDateString("ms-MY") : "N/A"}`,
        );
        doc.text(`Penerangan: ${incident.description || "N/A"}`);
        doc.text(
          `Anggaran Kos Rawatan: RM ${parseFloat(incident.estimatedTreatmentCost || 0).toFixed(2)}`,
        );
        doc.text(`Cadangan: ${incident.recommendation || "N/A"}`);
        doc.text(`Status Kelulusan: ${incident.approvalStatus || "Pending"}`);
        doc.moveDown(1);

        // Approval Section
        doc
          .fontSize(11)
          .font("Helvetica-Bold")
          .text("Maklumat Kelulusan:", { underline: true });
        doc.font("Helvetica").fontSize(10);
        doc.text(
          `Nama Penyelaras/Pengurus: ${incident.approverName || "___________________________"}`,
        );
        doc.text(
          `Jawatan: ${incident.approverPosition || "___________________________"}`,
        );
        doc.text(
          `Tandatangan: ___________________________     Tarikh: _______________`,
        );
        doc.moveDown(1);

        // Footer
        doc
          .fontSize(9)
          .font("Helvetica")
          .text(`Generated: ${new Date().toLocaleString("ms-MY")}`, {
            align: "center",
            color: "#666666",
          });

        doc.end();

        stream.on("finish", () => {
          logger.info(`PDF generated: ${filename}`);
          resolve({ filename, filepath });
        });
      } catch (error) {
        logger.error("PDF generation error:", error);
        reject(error);
      }
    });
  }

  /**
   * Generate KEW Livestock Disposal Report PDF (KEW.AH-16/18/20)
   */
  async generateDisposalReportPDF(disposal, animal) {
    return new Promise((resolve, reject) => {
      try {
        const doc = new PDFDocument({ bufferPages: true });
        const filename = `disposal-${disposal.id}.pdf`;
        const filepath = path.join(__dirname, "../uploads/documents", filename);

        if (!fs.existsSync(path.dirname(filepath))) {
          fs.mkdirSync(path.dirname(filepath), { recursive: true });
        }

        const stream = fs.createWriteStream(filepath);
        doc.pipe(stream);

        // Header
        doc
          .fontSize(16)
          .font("Helvetica-Bold")
          .text("LAPORAN PELUPUSAN HAIWAN", { align: "center" });
        doc
          .fontSize(11)
          .font("Helvetica")
          .text("(KEW.AH-16/18/20)", { align: "center" });
        doc.moveDown(0.5);

        // Animal Details
        doc
          .fontSize(11)
          .font("Helvetica-Bold")
          .text("Butiran Haiwan:", { underline: true });
        doc.font("Helvetica").fontSize(10);
        doc.text(`Kod Haiwan: ${animal.animalCode || "N/A"}`);
        doc.text(`Nama: ${animal.name || "N/A"}`);
        doc.moveDown(0.3);

        // Disposal Details
        doc
          .fontSize(11)
          .font("Helvetica-Bold")
          .text("Butiran Pelupusan:", { underline: true });
        doc.font("Helvetica").fontSize(10);
        doc.text(`Kaedah Pelupusan: ${disposal.disposalMethod || "N/A"}`);
        doc.text(
          `Tarikh Pelupusan: ${disposal.disposalDate ? new Date(disposal.disposalDate).toLocaleDateString("ms-MY") : "N/A"}`,
        );
        doc.text(`Penerima/Pembeli: ${disposal.recipientName || "N/A"}`);
        doc.text(
          `Harga Jual: RM ${parseFloat(disposal.proceedsAmount || 0).toFixed(2)}`,
        );
        doc.text(`Jumlah Saksi: ${disposal.numberOfWitnesses || 0}`);
        doc.text(
          `Nama Saksi: ${disposal.witnessNames ? disposal.witnessNames.join(", ") : "N/A"}`,
        );
        doc.text(`Catatan: ${disposal.remarks || "N/A"}`);
        doc.moveDown(1);

        // Approval Section
        doc
          .fontSize(11)
          .font("Helvetica-Bold")
          .text("Maklumat Kelulusan:", { underline: true });
        doc.font("Helvetica").fontSize(10);
        doc.text(`Dibenarkan oleh: ___________________________`);
        doc.text(`Jawatan: ___________________________`);
        doc.text(
          `Tandatangan: ___________________________     Tarikh: _______________`,
        );
        doc.moveDown(1);

        // Footer
        doc
          .fontSize(9)
          .font("Helvetica")
          .text(`Generated: ${new Date().toLocaleString("ms-MY")}`, {
            align: "center",
            color: "#666666",
          });

        doc.end();

        stream.on("finish", () => {
          logger.info(`PDF generated: ${filename}`);
          resolve({ filename, filepath });
        });
      } catch (error) {
        logger.error("PDF generation error:", error);
        reject(error);
      }
    });
  }

  /**
   * Generate KEW Inventory Disposal Report PDF (KEW.PS-20/22)
   */
  async generateInventoryDisposalPDF(disposal, inventory) {
    return new Promise((resolve, reject) => {
      try {
        const doc = new PDFDocument({ bufferPages: true });
        const filename = `inventory-disposal-${disposal.id}.pdf`;
        const filepath = path.join(__dirname, "../uploads/documents", filename);

        if (!fs.existsSync(path.dirname(filepath))) {
          fs.mkdirSync(path.dirname(filepath), { recursive: true });
        }

        const stream = fs.createWriteStream(filepath);
        doc.pipe(stream);

        // Header
        doc
          .fontSize(16)
          .font("Helvetica-Bold")
          .text("LAPORAN PELUPUSAN STOK", { align: "center" });
        doc
          .fontSize(11)
          .font("Helvetica")
          .text("(KEW.PS-20/22)", { align: "center" });
        doc.moveDown(0.5);

        // Inventory Details
        doc
          .fontSize(11)
          .font("Helvetica-Bold")
          .text("Butiran Barang:", { underline: true });
        doc.font("Helvetica").fontSize(10);
        doc.text(
          `Kod Barang: ${inventory?.itemCode || disposal.itemCode || "N/A"}`,
        );
        doc.text(
          `Nama Barang: ${inventory?.itemName || disposal.description || "N/A"}`,
        );
        doc.moveDown(0.3);

        // Disposal Details
        doc
          .fontSize(11)
          .font("Helvetica-Bold")
          .text("Butiran Pelupusan:", { underline: true });
        doc.font("Helvetica").fontSize(10);
        doc.text(`Kaedah Pelupusan: ${disposal.disposalMethod || "N/A"}`);
        doc.text(
          `Tarikh Pelupusan: ${disposal.disposalDate ? new Date(disposal.disposalDate).toLocaleDateString("ms-MY") : "N/A"}`,
        );
        doc.text(`Kuantiti: ${disposal.quantity || 0}`);
        doc.text(
          `Nilai Asal: RM ${parseFloat(disposal.originalValue || 0).toFixed(2)}`,
        );
        doc.text(
          `Nilai Semasa: RM ${parseFloat(disposal.currentValue || 0).toFixed(2)}`,
        );
        doc.text(
          `Hasil Penjualan: RM ${parseFloat(disposal.proceedsAmount || 0).toFixed(2)}`,
        );
        doc.text(`Catatan: ${disposal.remarks || "N/A"}`);
        doc.moveDown(1);

        // Approval Section
        doc
          .fontSize(11)
          .font("Helvetica-Bold")
          .text("Maklumat Kelulusan:", { underline: true });
        doc.font("Helvetica").fontSize(10);
        doc.text(`Status: ${disposal.status || "Pending"}`);
        doc.text(`Dipersetujui oleh: ___________________________`);
        doc.text(
          `Tandatangan: ___________________________     Tarikh: _______________`,
        );
        doc.moveDown(1);

        // Footer
        doc
          .fontSize(9)
          .font("Helvetica")
          .text(`Generated: ${new Date().toLocaleString("ms-MY")}`, {
            align: "center",
            color: "#666666",
          });

        doc.end();

        stream.on("finish", () => {
          logger.info(`PDF generated: ${filename}`);
          resolve({ filename, filepath });
        });
      } catch (error) {
        logger.error("PDF generation error:", error);
        reject(error);
      }
    });
  }

  /**
   * Generate Batch Report PDF combining multiple records
   */
  async generateBatchReportPDF(records, reportType, reportTitle) {
    return new Promise((resolve, reject) => {
      try {
        const doc = new PDFDocument({ bufferPages: true });
        const filename = `batch-${reportType}-${Date.now()}.pdf`;
        const filepath = path.join(__dirname, "../uploads/documents", filename);

        if (!fs.existsSync(path.dirname(filepath))) {
          fs.mkdirSync(path.dirname(filepath), { recursive: true });
        }

        const stream = fs.createWriteStream(filepath);
        doc.pipe(stream);

        // Header
        doc
          .fontSize(14)
          .font("Helvetica-Bold")
          .text(reportTitle, { align: "center" });
        doc
          .fontSize(10)
          .font("Helvetica")
          .text(`Total Records: ${records.length}`, { align: "center" });
        doc
          .fontSize(9)
          .text(`Generated: ${new Date().toLocaleString("ms-MY")}`, {
            align: "center",
          });
        doc.moveDown(1);

        // Table of records (simplified)
        records.forEach((record, idx) => {
          doc
            .fontSize(10)
            .font("Helvetica-Bold")
            .text(`Record ${idx + 1}:`);
          doc.font("Helvetica").fontSize(9);
          Object.entries(record).forEach(([key, value]) => {
            doc.text(`  ${key}: ${value || "N/A"}`);
          });
          doc.moveDown(0.5);
        });

        // Footer
        doc
          .fontSize(8)
          .font("Helvetica")
          .text("--- END OF REPORT ---", { align: "center", color: "#999999" });

        doc.end();

        stream.on("finish", () => {
          logger.info(`Batch PDF generated: ${filename}`);
          resolve({ filename, filepath });
        });
      } catch (error) {
        logger.error("Batch PDF generation error:", error);
        reject(error);
      }
    });
  }
}

module.exports = new PDFService();
