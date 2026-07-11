import { jsPDF } from "jspdf";

export interface DocumentMetadata {
  paymentId: string;
  bookingId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  apartmentName: string;
  apartmentAddress: string;
  builderName: string;
  floorName: string;
  flatNumber: string;
  flatType: string;
  area: number;
  bookingType: string;
  amount: number;
  date: string;
  time: string;
}

export async function generatePDF(type: "RECEIPT" | "INVOICE" | "AGREEMENT" | "CERTIFICATE", metadata: DocumentMetadata) {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  // Base colors
  const brandBlue = [29, 78, 216]; // #1d4ed8
  const textDark = [15, 23, 42]; // #0f172a
  const textGray = [100, 116, 139]; // #64748b
  const borderLight = [226, 232, 240]; // #e2e8f0

  const drawHeader = (title: string) => {
    // Top banner
    doc.setFillColor(brandBlue[0], brandBlue[1], brandBlue[2]);
    doc.rect(0, 0, 210, 35, "F");

    // Brand logo
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    doc.text("PropVista AI", 15, 22);

    // Subtitle
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.text("Intelligent Booking & Society Hub", 15, 28);

    // Document Title
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.text(title, 195, 22, { align: "right" });
  };

  const drawFooter = () => {
    const totalPages = 1;
    doc.setDrawColor(borderLight[0], borderLight[1], borderLight[2]);
    doc.line(15, 280, 195, 280);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(textGray[0], textGray[1], textGray[2]);
    doc.text("PropVista AI • Automated Legal Documents Registry System", 15, 286);
    doc.text(`Page 1 of ${totalPages}`, 195, 286, { align: "right" });
  };

  const drawMetadataTable = (x: number, y: number, data: { label: string; value: string }[]) => {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    let currentY = y;
    data.forEach((row) => {
      doc.setTextColor(textGray[0], textGray[1], textGray[2]);
      doc.text(row.label, x, currentY);
      doc.setTextColor(textDark[0], textDark[1], textDark[2]);
      doc.setFont("helvetica", "bold");
      doc.text(row.value, x + 40, currentY);
      doc.setFont("helvetica", "normal");
      currentY += 6;
    });
  };

  if (type === "RECEIPT") {
    drawHeader("PAYMENT RECEIPT");

    // SUCCESS stamp
    doc.setFillColor(240, 253, 244); // light green bg
    doc.rect(145, 45, 50, 15, "F");
    doc.setDrawColor(34, 197, 94); // green border
    doc.setLineWidth(0.5);
    doc.rect(145, 45, 50, 15, "S");
    doc.setTextColor(21, 128, 61); // green text
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.text("SUCCESSFUL", 170, 54, { align: "center" });

    // Client/Customer Info
    doc.setTextColor(textDark[0], textDark[1], textDark[2]);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.text("Customer Information", 15, 50);
    doc.line(15, 52, 100, 52);

    drawMetadataTable(15, 58, [
      { label: "Customer Name:", value: metadata.customerName },
      { label: "Email Address:", value: metadata.customerEmail },
      { label: "Phone Number:", value: metadata.customerPhone },
    ]);

    // Transaction Details
    doc.setTextColor(textDark[0], textDark[1], textDark[2]);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.text("Transaction Information", 15, 85);
    doc.line(15, 87, 195, 87);

    drawMetadataTable(15, 93, [
      { label: "Payment ID:", value: metadata.paymentId },
      { label: "Booking ID:", value: metadata.bookingId },
      { label: "Date & Time:", value: `${metadata.date} ${metadata.time}` },
      { label: "Payment Method:", value: "Razorpay Local Settlement" },
      { label: "Transaction Ref:", value: `TXN-${metadata.paymentId.substring(4)}` },
    ]);

    // Property Details
    doc.setTextColor(textDark[0], textDark[1], textDark[2]);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.text("Acquired Property Details", 15, 130);
    doc.line(15, 132, 195, 132);

    drawMetadataTable(15, 138, [
      { label: "Apartment Community:", value: metadata.apartmentName },
      { label: "Property Address:", value: metadata.apartmentAddress },
      { label: "Builder Name:", value: metadata.builderName },
      { label: "Level/Floor:", value: metadata.floorName },
      { label: "Flat Number:", value: `Flat ${metadata.flatNumber}` },
      { label: "Unit Config:", value: metadata.flatType },
      { label: "Super Area:", value: `${metadata.area} sqft` },
      { label: "Acquisition Type:", value: metadata.bookingType },
    ]);

    // Amount Table Box
    doc.setFillColor(248, 250, 252);
    doc.rect(15, 195, 180, 25, "F");
    doc.setDrawColor(borderLight[0], borderLight[1], borderLight[2]);
    doc.rect(15, 195, 180, 25, "S");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.setTextColor(brandBlue[0], brandBlue[1], brandBlue[2]);
    doc.text("Total Amount Dues Cleared", 25, 210);
    doc.setFontSize(16);
    doc.text(`INR ${metadata.amount.toLocaleString()}`, 185, 211, { align: "right" });

    // Authorization Signature block
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(textGray[0], textGray[1], textGray[2]);
    doc.text("This receipt is automatically generated and digitally signed. No physical signature required.", 15, 240);

    drawFooter();
  }

  else if (type === "INVOICE") {
    drawHeader("TAX INVOICE");

    // Invoice Meta
    doc.setTextColor(textDark[0], textDark[1], textDark[2]);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.text("Invoice Metadata", 15, 50);
    doc.line(15, 52, 195, 52);

    drawMetadataTable(15, 58, [
      { label: "Invoice Number:", value: `INV-${metadata.paymentId.substring(4)}` },
      { label: "Date of Issue:", value: metadata.date },
      { label: "Due Date:", value: metadata.date },
      { label: "Order Reference:", value: metadata.bookingId },
    ]);

    // Parties info
    doc.setFont("helvetica", "bold");
    doc.text("Builder (Seller)", 15, 90);
    doc.line(15, 92, 100, 92);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(textGray[0], textGray[1], textGray[2]);
    doc.text([
      metadata.builderName,
      metadata.apartmentAddress,
      "GSTIN: 27AAPCS1429B1Z8",
    ], 15, 96);

    doc.setFont("helvetica", "bold");
    doc.setTextColor(textDark[0], textDark[1], textDark[2]);
    doc.text("Recipient (Buyer)", 110, 90);
    doc.line(110, 92, 195, 92);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(textGray[0], textGray[1], textGray[2]);
    doc.text([
      metadata.customerName,
      `Email: ${metadata.customerEmail}`,
      `Phone: ${metadata.customerPhone}`,
    ], 110, 96);

    // Line items table
    doc.setFillColor(248, 250, 252);
    doc.rect(15, 120, 180, 8, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(textDark[0], textDark[1], textDark[2]);
    doc.text("Description", 20, 125);
    doc.text("Qty", 120, 125);
    doc.text("Rate", 140, 125);
    doc.text("Total", 175, 125, { align: "right" });

    // Item row
    doc.setFont("helvetica", "normal");
    const desc = `${metadata.bookingType === "BUY" ? "Booking Advance" : "Security Deposit"} - Flat ${metadata.flatNumber}, ${metadata.apartmentName}`;
    doc.text(desc, 20, 136);
    doc.text("1", 120, 136);
    doc.text(metadata.amount.toLocaleString(), 140, 136);
    doc.text(metadata.amount.toLocaleString(), 180, 136, { align: "right" });

    doc.setDrawColor(borderLight[0], borderLight[1], borderLight[2]);
    doc.line(15, 142, 195, 142);

    // Totals block
    doc.setFont("helvetica", "bold");
    doc.text("Total Invoice Value:", 130, 160);
    doc.text(`INR ${metadata.amount.toLocaleString()}`, 180, 160, { align: "right" });

    // Payment Info
    doc.setFillColor(240, 253, 244);
    doc.rect(15, 180, 180, 12, "F");
    doc.setFont("helvetica", "bold");
    doc.setTextColor(21, 128, 61);
    doc.text("STATUS: FULLY PAID & REGISTERED", 20, 188);

    drawFooter();
  }

  else if (type === "AGREEMENT") {
    drawHeader(metadata.bookingType === "BUY" ? "SALE AGREEMENT" : "RENTAL AGREEMENT");

    doc.setTextColor(textDark[0], textDark[1], textDark[2]);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(13);
    doc.text("LEGAL DEED OF AGREEMENT", 105, 50, { align: "center" });

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9.5);
    doc.setTextColor(textDark[0], textDark[1], textDark[2]);

    const introText = `This agreement is entered into on this ${metadata.date} between:\n\n1. THE DEVELOPER/BUILDER: ${metadata.builderName}, having office at ${metadata.apartmentAddress} (hereinafter referred to as the First Party/Owner).\n\nAND\n\n2. THE ACQUISITION CUSTOMER: ${metadata.customerName}, residing at Email: ${metadata.customerEmail} (hereinafter referred to as the Second Party/Resident).`;
    doc.text(doc.splitTextToSize(introText, 180), 15, 60);

    doc.setFont("helvetica", "bold");
    doc.text("SUBJECT AND PROPERTY DESCRIPTION:", 15, 105);
    doc.setFont("helvetica", "normal");

    const subjectText = `The First Party hereby agrees to transfer possession of the flat unit details as follows:\n\n• Apartment Community: ${metadata.apartmentName}\n• Flat Number: Unit ${metadata.flatNumber}\n• Level/Floor: ${metadata.floorName}\n• Configuration: ${metadata.flatType}\n• Built-up Area: ${metadata.area} sqft\n• Acquisition Type: ${metadata.bookingType}\n• Agreed Consideration Amount: INR ${metadata.amount.toLocaleString()}`;
    doc.text(doc.splitTextToSize(subjectText, 180), 15, 112);

    doc.setFont("helvetica", "bold");
    doc.text("TERMS AND CONDITIONS:", 15, 165);
    doc.setFont("helvetica", "normal");

    const termsText = `1. The Second Party has successfully completed the advance checkout and local transaction clearance under ID ${metadata.paymentId}.\n2. The Flat is marked locked and SOLD on the registry dashboard.\n3. The Second Party receives resident community credentials pending administrative activation.\n4. Both parties execute this automated deed digitally with encryption keys.`;
    doc.text(doc.splitTextToSize(termsText, 180), 15, 172);

    // Signatures
    doc.setFont("helvetica", "bold");
    doc.text("For First Party (Owner)", 15, 230);
    doc.line(15, 245, 75, 245);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.text("Authorized Developer Seal", 15, 249);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(9.5);
    doc.text("For Second Party (Buyer)", 120, 230);
    doc.line(120, 245, 180, 245);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.text("Digitally Certified Buyer", 120, 249);

    drawFooter();
  }

  else if (type === "CERTIFICATE") {
    // Borders for certificate
    doc.setDrawColor(brandBlue[0], brandBlue[1], brandBlue[2]);
    doc.setLineWidth(1.5);
    doc.rect(5, 5, 200, 287, "S");
    doc.setDrawColor(220, 180, 100); // Gold border inner
    doc.setLineWidth(0.5);
    doc.rect(8, 8, 194, 281, "S");

    // Header logo
    doc.setTextColor(brandBlue[0], brandBlue[1], brandBlue[2]);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(28);
    doc.text("PropVista AI", 105, 35, { align: "center" });
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(textGray[0], textGray[1], textGray[2]);
    doc.text("INTELLIGENT BOOKING & SOCIETY HUB", 105, 42, { align: "center" });

    // Decorative line
    doc.setDrawColor(220, 180, 100);
    doc.line(70, 48, 140, 48);

    // Title
    doc.setTextColor(textDark[0], textDark[1], textDark[2]);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(20);
    doc.text("CERTIFICATE OF OWNERSHIP", 105, 70, { align: "center" });

    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    doc.text("This is to certify and officially register that", 105, 90, { align: "center" });

    // Name
    doc.setTextColor(brandBlue[0], brandBlue[1], brandBlue[2]);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    doc.text(metadata.customerName.toUpperCase(), 105, 105, { align: "center" });

    // Subtext
    doc.setTextColor(textDark[0], textDark[1], textDark[2]);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    doc.text("is the registered owner of the following property unit:", 105, 120, { align: "center" });

    // Box details
    doc.setFillColor(248, 250, 252);
    doc.rect(25, 130, 160, 65, "F");
    doc.setDrawColor(borderLight[0], borderLight[1], borderLight[2]);
    doc.rect(25, 130, 160, 65, "S");

    drawMetadataTable(35, 142, [
      { label: "Community Name:", value: metadata.apartmentName },
      { label: "Unit Number:", value: `Flat ${metadata.flatNumber}` },
      { label: "Level/Floor:", value: metadata.floorName },
      { label: "Unit Configuration:", value: metadata.flatType },
      { label: "Super Area Size:", value: `${metadata.area} sqft` },
      { label: "Address location:", value: metadata.apartmentAddress },
      { label: "Registration ID:", value: metadata.bookingId },
    ]);

    // Bottom certify text
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    const bottomText = `This title is certified after full payment clearance of INR ${metadata.amount.toLocaleString()} received on ${metadata.date} under settlement transaction record ID ${metadata.paymentId}.`;
    doc.text(doc.splitTextToSize(bottomText, 150), 105, 215, { align: "center" });

    // Gold seal star
    doc.setFillColor(220, 180, 100);
    doc.ellipse(105, 250, 12, 12, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.text("SEAL", 105, 253, { align: "center" });

    drawFooter();
  }

  // Save the PDF
  const filename = `${type.toLowerCase()}_${metadata.flatNumber || "unit"}.pdf`;
  doc.save(filename);
}
