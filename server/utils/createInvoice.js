const PDFDocument = require("pdfkit");

const createInvoice = (order) => {
  const doc = new PDFDocument();
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
  doc.moveDown();

  // Add a table-like layout for order details
  doc.fillColor("#000").fontSize(18).text("Order Details", { underline: true });
  doc.moveDown();

  // Draw table headers
  const headers = ["Product", "Quantity", "Price", "Total"];
  const headerHeight = 20;
  const rowHeight = 25;
  const tableTop = doc.y;

  // Draw the header
  headers.forEach((header, index) => {
    doc.rect(50 + index * 120, tableTop, 120, headerHeight).fill("#4A90E2").stroke();
    doc.fillColor("#fff").text(header, 50 + index * 120 + 10, tableTop + 5);
  });

  let y = tableTop + headerHeight;
  
  // Products Table
  order.products.forEach((item) => {
    const { product, quantity } = item; // Destructure product and quantity

    if (product) {
      doc.fillColor("#000").text(product.name, 50, y);
      doc.text(quantity, 170, y);
      doc.text(`₹${product.salePrice.toFixed(2)}`, 290, y);
      doc.text(`₹${(product.salePrice * quantity).toFixed(2)}`, 410, y);
      y += rowHeight;
    }
  });

  // Draw total amount
  doc.moveDown();
  doc.fillColor("#333").fontSize(16).text(`Total Amount: ₹${order.totalAmount.toFixed(2)}`, { align: "right" });
  doc.text(`Shipping Charge: ₹${order.shippingCharge.toFixed(2)}`, { align: "right" });
  doc.text(`Grand Total: ₹${order.totalAmount.toFixed(2)}`, { align: "right", underline: true });
  
  // Finalize the document
  doc.end();

  // Wait for the 'end' event to resolve the promise
  return new Promise((resolve) => {
    doc.on("end", () => resolve(Buffer.concat(buffers)));
  });
};

module.exports = createInvoice;
