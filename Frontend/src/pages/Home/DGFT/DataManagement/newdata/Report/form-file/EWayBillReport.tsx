import React from 'react';
import { Download } from 'lucide-react';

const dummyEwayBill = [
  {
    id: "242JWJODJ2OJ3JI4",
    // 1.E-Way Bill Detail
    eWayBillNo: "2323 8233 2323",
    generatedDate: "01/11/2023 02:23 PM",
    generatedBY : "ejfeijfiejfiejf",
    validUpTo : "01/11/2023 02:23 PM",
    mode: "Road",
    aproxDistence: "242km",
    type: "Outward - Supply",
    documentDetails: "Tax Invoice - RYMEG/41/23-24 - 01/11/2023",
    transactionType: "Bill To - Ship To",

    //2. Address Details
    from : {
        GSTIN : "24AAF CN301 3J1ZS",
        address: "NRV YARNS PRIVATE LIMITED, GUJARAT",
        dispatchFrom: "ATKOT GONDAL HIGHWAY, AT-KHARACHIYA JAM",
    },
    to : {
        GSTIN : "24AAF CN301 3J1ZS",
        address: "NRV YARNS PRIVATE LIMITED, GUJARAT",
        shipTo: "ATKOT GONDAL HIGHWAY, AT-KHARACHIYA JAM",
    },

    // 3. Goods details
    HSNCode : 52052310,
    ProductNameDesc :  "COTTON YARN & 28 CCH",
    Quantity : "21319.20KGS",
    TaxableAmountRs : "5201885.00",
    TaxRateC_S_I_Cess_CessNonAdvol :  "2.500+2.500+NE+0.000+0.00",

    //table
    TotTaxbleAmt : 8887.00, 
    CGSTAmt: 130047.13,
    SGSTAmt : 130047.13,
    IGSTAmt: 0.00,
    CESSAmt: 0.00,
    CESSNonAdvolAmt: 0.00,
    OtherAmt: 0.00,
    TotalInvAmt: 5461979.25,

    // 4 TransportationDetails
    transporterIdAndName : "98437HUH878HJKB & ACCURACY SHIPPING LTD",
    transporterDocNoansDate : "1234567890 & 01/11/2023",

    // 5 . Vehicle Details
    Mode: "Road",
    VehicleTrans: "98437HUH878HJKB",
    DocNoDt: "1234567890 & 01/11/2023",
    FromEnteredDateEnteredBy: "01/11/2023 02:23 PM",
    CEWBNo: "-",
    MultiVehI: "-"
  }
];

const EWayBillReport = () => {
  const ewayBill = dummyEwayBill[0];

  const generatePDF = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert('Pop-up blocked! Please allow pop-ups for this website to generate the PDF.');
      return;
    }
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>E-Way Bill - ${ewayBill.eWayBillNo}</title>
        <style>
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          body {
            font-family: Arial, sans-serif;
            font-size: 11px;
            line-height: 1.3;
            color: #000;
            background: white;
            padding: 20px;
          }
          .eway-container {
            max-width: 800px;
            margin: 0 auto;
            border: 2px solid #000;
            background: white;
          }
          .header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 15px 20px;
            border-bottom: 1px solid #000;
          }
          .title {
            font-size: 18px;
            font-weight: bold;
          }
          .qr-code {
            width: 80px;
            height: 80px;
            border: 1px solid #000;
            display: flex;
            align-items: center;
            justify-content: center;
            background: #f0f0f0;
            font-size: 8px;
            text-align: center;
          }
          .section {
            border-bottom: 1px solid #000;
          }
          .section-header {
            background: #e8e8e8;
            padding: 8px 15px;
            font-weight: bold;
            border-bottom: 1px solid #000;
            font-size: 12px;
          }
          .section-content {
            padding: 15px;
          }
          .detail-row {
            display: flex;
            margin-bottom: 8px;
            align-items: center;
          }
          .detail-item {
            margin-right: 30px;
          }
          .detail-item strong {
            font-weight: bold;
          }
          .address-section {
            display: flex;
            gap: 20px;
          }
          .address-column {
            flex: 1;
            border: 1px solid #ccc;
            padding: 15px;
          }
          .address-title {
            font-weight: bold;
            margin-bottom: 10px;
            font-size: 12px;
          }
          .address-content {
            margin-bottom: 8px;
          }
          .goods-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 15px;
          }
          .goods-table th,
          .goods-table td {
            border: 1px solid #000;
            padding: 8px;
            text-align: left;
            font-size: 10px;
          }
          .goods-table th {
            background: #f0f0f0;
            font-weight: bold;
            text-align: center;
          }
          .text-center {
            text-align: center;
          }
          .text-right {
            text-align: right;
          }
          .totals-table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 10px;
          }
          .totals-table th,
          .totals-table td {
            border: 1px solid #000;
            padding: 5px;
            font-size: 10px;
          }
          .totals-table th {
            background: #f0f0f0;
            font-weight: bold;
            text-align: center;
          }
          .vehicle-table {
            width: 100%;
            border-collapse: collapse;
          }
          .vehicle-table th,
          .vehicle-table td {
            border: 1px solid #000;
            padding: 8px;
            text-align: center;
            font-size: 10px;
          }
          .vehicle-table th {
            background: #f0f0f0;
            font-weight: bold;
          }
          .barcode {
            text-align: center;
            padding: 15px;
            font-family: 'Courier New', monospace;
            font-size: 24px;
            letter-spacing: 2px;
          }
          @media print {
            body { 
              margin: 0; 
              padding: 10px;
            }
            .eway-container { 
              border: 2px solid #000; 
              margin: 0; 
            }
          }
        </style>
      </head>
      <body>
        <div class="eway-container">
          <!-- Header -->
          <div class="header">
            <div class="title">e-Way Bill</div>
            <div class="qr-code">
              QR CODE<br/>
              (Sample)
            </div>
          </div>

          <!-- 1. E-WAY BILL Details -->
          <div class="section">
            <div class="section-header">1. E-WAY BILL Details</div>
            <div class="section-content">
              <div class="detail-row">
                <div class="detail-item">
                  <strong>eWay Bill No:</strong> ${ewayBill.eWayBillNo}
                </div>
                <div class="detail-item">
                  <strong>Generated Date:</strong> ${ewayBill.generatedDate}
                </div>
                <div class="detail-item">
                  <strong>Generated By:</strong> ${ewayBill.generatedBY}
                </div>
              </div>
              <div class="detail-row">
                <div class="detail-item">
                  <strong>Valid Upto:</strong> ${ewayBill.validUpTo}
                </div>
              </div>
              <div class="detail-row">
                <div class="detail-item">
                  <strong>Mode:</strong> ${ewayBill.mode}
                </div>
                <div class="detail-item">
                  <strong>Approx Distance:</strong> ${ewayBill.aproxDistence}
                </div>
              </div>
              <div class="detail-row">
                <div class="detail-item">
                  <strong>Type:</strong> ${ewayBill.type}
                </div>
                <div class="detail-item">
                  <strong>Document Details:</strong> ${ewayBill.documentDetails}
                </div>
                <div class="detail-item">
                  <strong>Transaction type:</strong> ${ewayBill.transactionType}
                </div>
              </div>
            </div>
          </div>

          <!-- 2. Address Details -->
          <div class="section">
            <div class="section-header">2. Address Details</div>
            <div class="section-content">
              <div class="address-section">
                <div class="address-column">
                  <div class="address-title">From</div>
                  <div class="address-content">
                    <strong>GSTIN:</strong> ${ewayBill.from.GSTIN}
                  </div>
                  <div class="address-content">
                    ${ewayBill.from.address}
                  </div>
                  <div class="address-content">
                    <strong>:: Dispatch From ::</strong><br/>
                    ${ewayBill.from.dispatchFrom}
                  </div>
                </div>
                <div class="address-column">
                  <div class="address-title">To</div>
                  <div class="address-content">
                    <strong>GSTIN:</strong> ${ewayBill.to.GSTIN}
                  </div>
                  <div class="address-content">
                    ${ewayBill.to.address}
                  </div>
                  <div class="address-content">
                    <strong>:: Ship To ::</strong><br/>
                    ${ewayBill.to.shipTo}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 3. Goods Details -->
          <div class="section">
            <div class="section-header">3. Goods Details</div>
            <div class="section-content">
              <table class="goods-table">
                <thead>
                  <tr>
                    <th>HSN<br/>Code</th>
                    <th>Product Name & Desc.</th>
                    <th>Quantity</th>
                    <th>Taxable<br/>Amount Rs.</th>
                    <th>Tax Rate (C+S+I+Cess+Cess<br/>Non.Advol)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td class="text-center">${ewayBill.HSNCode}</td>
                    <td>${ewayBill.ProductNameDesc}</td>
                    <td class="text-center">${ewayBill.Quantity}</td>
                    <td class="text-right">${ewayBill.TaxableAmountRs}</td>
                    <td class="text-center">${ewayBill.TaxRateC_S_I_Cess_CessNonAdvol}</td>
                  </tr>
                </tbody>
              </table>

              <table class="totals-table">
                <thead>
                  <tr>
                    <th>Tot. Tax'ble Amt</th>
                    <th>CGST Amt</th>
                    <th>SGST Amt</th>
                    <th>IGST Amt</th>
                    <th>CESS Amt</th>
                    <th>CESS Non.Advol Amt</th>
                    <th>Other Amt</th>
                    <th>Total Inv.Amt</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td class="text-right">${ewayBill.TotTaxbleAmt.toFixed(2)}</td>
                    <td class="text-right">${ewayBill.CGSTAmt.toFixed(2)}</td>
                    <td class="text-right">${ewayBill.SGSTAmt.toFixed(2)}</td>
                    <td class="text-right">${ewayBill.IGSTAmt.toFixed(2)}</td>
                    <td class="text-right">${ewayBill.CESSAmt.toFixed(2)}</td>
                    <td class="text-right">${ewayBill.CESSNonAdvolAmt.toFixed(2)}</td>
                    <td class="text-right">${ewayBill.OtherAmt.toFixed(2)}</td>
                    <td class="text-right">${ewayBill.TotalInvAmt.toFixed(2)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- 4. Transportation Details -->
          <div class="section">
            <div class="section-header">4. Transportation Details</div>
            <div class="section-content">
              <div class="detail-row">
                <div class="detail-item">
                  <strong>Transporter ID & Name:</strong> ${ewayBill.transporterIdAndName}
                </div>
                <div class="detail-item">
                  <strong>Transporter Doc. No & Date:</strong> ${ewayBill.transporterDocNoansDate}
                </div>
              </div>
            </div>
          </div>

          <!-- 5. Vehicle Details -->
          <div class="section">
            <div class="section-header">5. Vehicle Details</div>
            <div class="section-content">
              <table class="vehicle-table">
                <thead>
                  <tr>
                    <th>Mode</th>
                    <th>Vehicle / Trans<br/>Doc No & Dt</th>
                    <th>From</th>
                    <th>Entered Date</th>
                    <th>Entered By</th>
                    <th>CEWB No.<br/>(if any)</th>
                    <th>Multi Veh.Info<br/>(if any)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>${ewayBill.Mode}</td>
                    <td>${ewayBill.VehicleTrans} & ${ewayBill.DocNoDt}</td>
                    <td>KHARACHIYA JAM</td>
                    <td>${ewayBill.FromEnteredDateEnteredBy}</td>
                    <td>${ewayBill.generatedBY}</td>
                    <td>${ewayBill.CEWBNo}</td>
                    <td>${ewayBill.MultiVehI}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- Barcode -->
          <div class="barcode">
            ||||| |||| || ||| |||| ||| |||| ||||
            <br/>
            <small style="font-size: 8px;">01953708085</small>
          </div>
        </div>
      </body>
      </html>
    `;

    printWindow.document.write(htmlContent);
    printWindow.document.close();
    
    // Wait for content to load, then print
    printWindow.onload = function() {
      setTimeout(() => {
        printWindow.print();
      }, 500);
    };
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">E-Way Bill PDF Generator - Dummy</h1>
        <p className="text-gray-600 mb-6">
          Generate and download E-Way Bill PDF based on the provided data structure.
        </p>
        
        <div className="bg-gray-50 p-4 rounded-lg mb-6">
          <h2 className="text-lg font-semibold mb-2">E-Way Bill Details:</h2>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium">E-Way Bill No:</span> {ewayBill.eWayBillNo}
            </div>
            <div>
              <span className="font-medium">Generated Date:</span> {ewayBill.generatedDate}
            </div>
            <div>
              <span className="font-medium">Mode:</span> {ewayBill.mode}
            </div>
            <div>
              <span className="font-medium">Distance:</span> {ewayBill.aproxDistence}
            </div>
            <div>
              <span className="font-medium">Type:</span> {ewayBill.type}
            </div>
            <div>
              <span className="font-medium">Total Amount:</span> ₹{ewayBill.TotalInvAmt.toFixed(2)}
            </div>
          </div>
        </div>

        <div className="bg-blue-50 p-4 rounded-lg mb-6">
          <h3 className="font-semibold text-blue-800 mb-2">Address Details:</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium">From:</span> {ewayBill.from.address}
            </div>
            <div>
              <span className="font-medium">To:</span> {ewayBill.to.address}
            </div>
          </div>
        </div>

        <div className="bg-green-50 p-4 rounded-lg mb-6">
          <h3 className="font-semibold text-green-800 mb-2">Goods Details:</h3>
          <div className="text-sm">
            <div className="mb-2">
              <span className="font-medium">HSN Code:</span> {ewayBill.HSNCode}
            </div>
            <div className="mb-2">
              <span className="font-medium">Product:</span> {ewayBill.ProductNameDesc}
            </div>
            <div className="mb-2">
              <span className="font-medium">Quantity:</span> {ewayBill.Quantity}
            </div>
            <div>
              <span className="font-medium">Taxable Amount:</span> ₹{ewayBill.TaxableAmountRs}
            </div>
          </div>
        </div>

        <button
          onClick={generatePDF}
          className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Download size={20} />
          Download E-Way Bill PDF
        </button>
      </div>

     
    </div>
  );
};

export default EWayBillReport;