const PDFDocument = require("pdfkit");

const createInvoice = (order) => {
  const doc = new PDFDocument({ margin: 50 });
  let buffers = [];

  // Capture the PDF output in a buffer
  doc.on("data", buffers.push.bind(buffers));
  doc.on("end", () => {
    const pdfBuffer = Buffer.concat(buffers);
    return pdfBuffer;
  });

  // Add a title
  doc.fillColor("#333").fontSize(30).text(`Invoice #${order.orderId}`, { align: "center" });
  doc.moveDown();

  // Customer Information
  doc.fillColor("#555").fontSize(16).text(`Customer: ${order.customer.fullName}`, { align: "left" });
  doc.text(`Email: ${order.customer.email}`, { align: "left" });
  doc.text(`Phone: ${order.customer.phone}`, { align: "left" });
  doc.text(`Order Date: ${order.createdAt.toLocaleDateString()}`, { align: "left" });
  doc.moveDown(1.5);

  // Order Details Section
  doc.fillColor("#000").fontSize(18).text("Order Details", { underline: true });
  doc.moveDown();

  // Table Headers
  const headers = ["Product", "Quantity", "Price (₹)", "Total (₹)"];
  const headerHeight = 20;
  const rowHeight = 25;
  const startX = 50;
  const startY = doc.y;

  // Draw Header
  headers.forEach((header, i) => {
    doc.rect(startX + i * 120, startY, 120, headerHeight).fill("#4A90E2").stroke();
    doc.fillColor("#fff").fontSize(14).text(header, startX + i * 120 + 10, startY + 5);
  });

  // Table Rows
  let y = startY + headerHeight + 5; // Add spacing below headers
  order.products.forEach((item) => {
    const { product, quantity } = item;

    if (product) {
      doc.fillColor("#000").fontSize(12).text(product.name, startX + 10, y);
      doc.text(quantity, startX + 130, y);
      doc.text(`₹${product.salePrice.toFixed(2)}`, startX + 250, y);
      doc.text(`₹${(product.salePrice * quantity).toFixed(2)}`, startX + 370, y);
      y += rowHeight;
    }
  });

  // Total Amounts
  doc.moveDown(1.5);
  doc.fillColor("#333").fontSize(16);
  doc.text(`Total Amount: ₹${order.totalAmount.toFixed(2)}`, { align: "right" });
  doc.text(`Shipping Charge: ₹${order.shippingCharge.toFixed(2)}`, { align: "right" });
  doc.text(`Grand Total: ₹${(order.totalAmount + order.shippingCharge).toFixed(2)}`, { align: "right", underline: true });
  
  // Finalize the document
  doc.end();

  // Return the PDF as a buffer
  return new Promise((resolve) => {
    doc.on("end", () => resolve(Buffer.concat(buffers)));
  });
};

module.exports = createInvoice;
