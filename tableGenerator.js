// tableGenerator.js

// Definitions and constants
const CONTINGENT_INTEREST_RATE_ANNUAL = 0.122; // 12.20%
const CONTINGENT_INTEREST_RATE_MONTHLY = 0.0101667; // 1.01667%
const CONTINGENT_INTEREST_PAYMENT = 10.1667; // per $1,000 note per month
const BUFFER_THRESHOLD = -0.10; // -10.00%
const BUFFER_AMOUNT = 0.10; // 10.00%
const PRINCIPAL = 1000;

// Function to calculate Payment at Maturity
function calculatePaymentAtMaturity(underlyingReturn) {
    // Error prediction: Check for valid input
    if (typeof underlyingReturn !== 'number' || underlyingReturn < -1 || underlyingReturn > 1) {
        console.warn(`Warning: Underlying Return ${underlyingReturn} is out of expected range (-100% to 100%).`);
    }

    // If Underlying Return >= Buffer Threshold (-10%), pay principal + contingent interest
    if (underlyingReturn >= BUFFER_THRESHOLD) {
        return PRINCIPAL + CONTINGENT_INTEREST_PAYMENT;
    } else {
        // If Underlying Return < Buffer Threshold, apply buffer formula
        return PRINCIPAL + (PRINCIPAL * (underlyingReturn + BUFFER_AMOUNT));
    }
}

// Function to generate the table
function generateTable(returnsArray) {
    console.log("Underlying Return\tPayment at Maturity");
    returnsArray.forEach(ret => {
        const payment = calculatePaymentAtMaturity(ret / 100);
        // Format output to match sample
        console.log(`${ret.toFixed(2)}%\t\t$${payment.toFixed(4)}`);
    });
}

// Example returns as per your table
const returnsArray = [60, 40, 20, 5, 2, 0, -5, -10, -10.01, -20, -30, -40, -60, -80, -100];

// Run the table generator
generateTable(returnsArray);

// Bonus 2: Export to docx
// To use this, install docx: npm install docx
const fs = require('fs');
const { Document, Packer, Paragraph, Table, TableRow, TableCell, TextRun } = require('docx');

function exportTableToDocx(returnsArray, filename = "table.docx") {
    const tableRows = [
        new TableRow({
            children: [
                new TableCell({ children: [new Paragraph("Underlying Return")] }),
                new TableCell({ children: [new Paragraph("Payment at Maturity")] }),
            ],
        }),
    ];

    returnsArray.forEach(ret => {
        const payment = calculatePaymentAtMaturity(ret / 100);
        tableRows.push(
            new TableRow({
                children: [
                    new TableCell({ children: [new Paragraph(`${ret.toFixed(2)}%`)] }),
                    new TableCell({ children: [new Paragraph(`$${payment.toFixed(4)}`)] }),
                ],
            })
        );
    });

    const doc = new Document({
        sections: [{
            children: [
                new Paragraph("Contingent Interest Table"),
                new Table({ rows: tableRows }),
            ],
        }],
    });

    Packer.toBuffer(doc).then(buffer => {
        fs.writeFileSync(filename, buffer);
        console.log(`Table exported to ${filename}`);
    });
}

// Uncomment to export to docx
exportTableToDocx(returnsArray);
