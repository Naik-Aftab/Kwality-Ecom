const PDFDocument = require("pdfkit");

const createInvoice = (order) => {
  const doc = new PDFDocument({ margin: 50 });
  let buffers = [];

  // Capture the PDF output in a buffer
  doc.on("data", buffers.push.bind(buffers));

  // Kwality Chicken Center Heading
  doc
    .fontSize(24)
    .fillColor("#4A90E2")
    .text("Kwality Chicken Center", { align: "center" })
    .moveDown(0.5);
  doc
    .fontSize(12)
    .fillColor("#555")
    .text("Shop No, 55 56, Pune - 1", { align: "center" })
    .text("nr. St. Xaviers Church, Shivaji Market, Camp", { align: "center" })
    .text("Pune, Maharashtra 411001", { align: "center" })
    .moveDown(2);

  // Order Info Section
  doc
    .fillColor("#333")
    .fontSize(16)
    .text(`Invoice #: ${order.orderId}`, 50, doc.y, { align: "left" })
    .text(`Order Date: ${order.createdAt.toLocaleDateString()}`, 400, doc.y, {
      align: "right",
    })
    .moveDown(1);

  // Customer Information Section
  doc
    .fontSize(16)
    .fillColor("#333")
    .text("Customer Information", { underline: true })
    .moveDown(0.5)
    .fillColor("#555")
    .fontSize(14)
    .text(`Name: ${order.customer.fullName}`)
    .text(`Email: ${order.customer.email}`)
    .text(`Phone: ${order.customer.phone}`)
    .moveDown(1);

  // Order Details Section Title
  doc
    .fontSize(16)
    .fillColor("#333")
    .text("Order Details", { underline: true })
    .moveDown(0.5);

  // Table Header
  const headers = ["#", "Product", "Quantity", "Unit Price", "Total"];
  const headerY = doc.y;
  const rowHeight = 25;

  headers.forEach((header, index) => {
    const x = 50 + index * 100;
    doc
      .fillColor("#4A90E2")
      .fontSize(12)
      .text(header, x, headerY, { align: "left", continued: true })
      .fillColor("#000");
  });

  let y = headerY + rowHeight;

  // Populate Product Details Table with Serial Numbers
  order.products.forEach((item, i) => {
    const { product, quantity } = item;

    if (product) {
      doc
        .fontSize(12)
        .fillColor("#000")
        .text(i + 1, 50, y) // Serial Number
        .text(product.name, 90, y)
        .text(quantity, 200, y)
        .text(`₹${product.salePrice.toFixed(2)}`, 300, y)
        .text(`₹${(product.salePrice * quantity).toFixed(2)}`, 400, y);

      y += rowHeight;
    }
  });

  // Total Amount Section
  doc.moveDown(1);
  doc
    .fontSize(14)
    .fillColor("#333")
    .text(`Total Amount: ₹${order.totalAmount.toFixed(2)}`, { align: "right" })
    .text(`Shipping Charge: ₹${order.shippingCharge.toFixed(2)}`, {
      align: "right",
    })
    .moveDown(0.5)
    .font("Helvetica-Bold")
    .text(`Grand Total: ₹${(order.totalAmount + order.shippingCharge).toFixed(2)}`, {
      align: "right",
      underline: true,
    })
    .moveDown(2);

  // Thank You Message
  doc
    .font("Helvetica-Oblique")
    .fontSize(14)
    .fillColor("#4A90E2")
    .text("Thank you for your purchase!", { align: "center" })
    .moveDown();

  // Finalize the document
  doc.end();

  // Return buffer once the PDF generation is complete
  return new Promise((resolve) => {
    doc.on("end", () => resolve(Buffer.concat(buffers)));
  });
};

module.exports = createInvoice;
