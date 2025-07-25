import React, { useState, useEffect } from 'react';
import { faDownload } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import { BACKEND_URL } from '../../../../../../../Globle';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faRefresh, faFilePdf, faEye, faPrint } from '@fortawesome/free-solid-svg-icons';
import { useCookies } from 'react-cookie';
import Loading from '../../../../../../components/Loading';

// Define interfaces for the real data structure
interface EInvoiceProductDetail {
  id: string;
  productDetailSrNo: string;
  productDetailDescription: string;
  productDetailHSN: string;
  productDetailTypeOfProductsUQC: string;
  productDetailQty: string;
  productDetailRateOfProduct: string;
  productDetailAmount: string;
  productDetailTaxPayableOnRcm: string;
}

interface EInvoice {
  id: string;
  sellerName: string;
  sellerAddress: string;
  sellerPanNumber: string;
  sellerGstNumber: string;
  eInvoiceDetailQRCode: string;
  eInvoiceDetailIrnNo: string;
  eInvoiceDetailAckNo: string;
  eInvoiceDetailAckDate: string;
  eInvoiceDetailEWayBillNo: string;
  BuyerDetailBillToName: string;
  BuyerDetailBillToAddress: string;
  BuyerDetailBillToContactNumber: string;
  BuyerDetailBillToGstNumber: string;
  BuyerDetailShipToName: string;
  BuyerDetailShipToAddress: string;
  BuyerDetailShipToContactNumber: string;
  BuyerDetailShipToGstNumber: string;
  invoiceDetailNumber: string;
  invoiceDetailDate: string;
  invoiceDetailQuickResponseCode: string;
  subTotal: string;
  amountInWords: string;
  notes: string;
  bankDetailBankName: string;
  bankDetailAccountNumber: string;
  bankDetailIfscCode: string;
  taxCalculationTaxRate: string;
  taxCalculationIgstEitherCgstOrSgst: string;
  termsAndConditions: string;
  authorizedSignature: string;
  addedByUserId: string;
  uploadedDate: string;
  productDetails: EInvoiceProductDetail[];
  user: {
    id: string;
    contactPersonName: string;
    email: string;
    companyName: string;
  };
}

const EInvoiceReport = () => {
  const [loading, setLoading] = useState(false);
  const [invoices, setInvoices] = useState<EInvoice[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [cookies] = useCookies(['token']);

  // Fetch all invoices from backend
  const fetchAllInvoices = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${BACKEND_URL}/forms/einvoice`, {
        headers: {
          Authorization: cookies.token,
        },
      });
      console.log('Fetched invoices:', response.data);
      setInvoices(response.data);
    } catch (error) {
      console.error("Error fetching invoices:", error);
      alert("Failed to fetch invoices");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllInvoices();
  }, []);

  // Filter invoices based on search term
  const filteredInvoices = invoices.filter(invoice =>
    invoice.sellerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    invoice.invoiceDetailNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    invoice.BuyerDetailBillToName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    invoice.eInvoiceDetailIrnNo?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Convert real invoice data to dummy format for PDF generation
  const convertToLegacyFormat = (invoice: EInvoice) => {
    return {
      id: invoice.invoiceDetailNumber || invoice.id,
      irn: invoice.eInvoiceDetailIrnNo || "",
      ackNo: invoice.eInvoiceDetailAckNo || "",
      ackDate: invoice.eInvoiceDetailAckDate || "",
      suppltTypeCode: "B2B",
      documentNumber: invoice.invoiceDetailNumber || "",
      IGSTapplicableDespiteSupplierAndRecipientLocatedInSameState: invoice.taxCalculationIgstEitherCgstOrSgst === "IGST" ? "yes" : "no",
      placeOfSupply: "GUJARAT",
      documentType: "Tax Invoice",
      documentDate: invoice.invoiceDetailDate || "",
      supplier: {
        GSTIN: invoice.sellerGstNumber || "",
        address: invoice.sellerAddress || "",
        email: invoice.user?.email || ""
      },
      recipient: {
        GSTIN: invoice.BuyerDetailBillToGstNumber || "",
        address: invoice.BuyerDetailBillToAddress || "",
        email: ""
      },
      shipTo: {
        GSTIN: invoice.BuyerDetailShipToGstNumber || "",
        address: invoice.BuyerDetailShipToAddress || "",
        email: ""
      },
      items: invoice.productDetails.map((product, index) => ({
        slNo: index + 1,
        description: product.productDetailDescription || "",
        hsn: product.productDetailHSN || "",
        qty: parseFloat(product.productDetailQty || "0"),
        unit: product.productDetailTypeOfProductsUQC || "",
        unitPrice: parseFloat(product.productDetailRateOfProduct || "0"),
        discount: 0,
        taxableAmount: parseFloat(product.productDetailAmount || "0"),
        cgstRate: parseFloat(invoice.taxCalculationTaxRate || "0") / 2,
        cgstAmount: (parseFloat(product.productDetailAmount || "0") * parseFloat(invoice.taxCalculationTaxRate || "0")) / 200,
        sgstRate: parseFloat(invoice.taxCalculationTaxRate || "0") / 2,
        sgstAmount: (parseFloat(product.productDetailAmount || "0") * parseFloat(invoice.taxCalculationTaxRate || "0")) / 200,
        igstRate: invoice.taxCalculationIgstEitherCgstOrSgst === "IGST" ? parseFloat(invoice.taxCalculationTaxRate || "0") : 0,
        igstAmount: invoice.taxCalculationIgstEitherCgstOrSgst === "IGST" ? (parseFloat(product.productDetailAmount || "0") * parseFloat(invoice.taxCalculationTaxRate || "0")) / 100 : 0,
        totalAmount: parseFloat(product.productDetailAmount || "0") + ((parseFloat(product.productDetailAmount || "0") * parseFloat(invoice.taxCalculationTaxRate || "0")) / 100)
      })),
      totals: {
        TaxableAmount: parseFloat(invoice.subTotal || "0"),
        CgstAmount: invoice.taxCalculationIgstEitherCgstOrSgst !== "IGST" ? (parseFloat(invoice.subTotal || "0") * parseFloat(invoice.taxCalculationTaxRate || "0")) / 200 : 0,
        SgstAmount: invoice.taxCalculationIgstEitherCgstOrSgst !== "IGST" ? (parseFloat(invoice.subTotal || "0") * parseFloat(invoice.taxCalculationTaxRate || "0")) / 200 : 0,
        IgstAmount: invoice.taxCalculationIgstEitherCgstOrSgst === "IGST" ? (parseFloat(invoice.subTotal || "0") * parseFloat(invoice.taxCalculationTaxRate || "0")) / 100 : 0,
        CessAmount: 0,
        Discount: 0,
        OtherCharges: 0,
        RoundOffAmount: 0,
        TotalInvAmount: parseFloat(invoice.subTotal || "0") + ((parseFloat(invoice.subTotal || "0") * parseFloat(invoice.taxCalculationTaxRate || "0")) / 100)
      },
      EwayBillNo: invoice.eInvoiceDetailEWayBillNo || "",
      EwayBillDate: invoice.eInvoiceDetailAckDate || "",
      validTillDate: invoice.eInvoiceDetailAckDate || "",
      generatedBy: invoice.user?.contactPersonName || "",
      printDate: new Date().toLocaleString()
    };
  };

  const generatePDF = (selectedInvoice: EInvoice) => {
    const invoice = convertToLegacyFormat(selectedInvoice);
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert('Pop-up blocked! Please allow pop-ups for this website to generate the PDF.');
      return;
    }
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Invoice - ${invoice.id}</title>
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
          }
          .invoice-container {
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
            border: 2px solid #000;
            background: white;
          }
          .header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 20px;
            border-bottom: 1px solid #ccc;
            padding-bottom: 15px;
          }
          .company-info {
            flex: 1;
          }
          .company-name {
            font-size: 16px;
            font-weight: bold;
            margin-bottom: 5px;
          }
          .invoice-id {
            font-size: 14px;
            font-weight: bold;
            margin-bottom: 10px;
          }
          .qr-code {
            width: 120px;
            height: 120px;
            border: 1px solid #000;
            display: flex;
            align-items: center;
            justify-content: center;
            background: #f0f0f0;
            font-size: 10px;
            text-align: center;
          }
          .section {
            margin-bottom: 15px;
            border: 1px solid #000;
          }
          .section-header {
            background: #f0f0f0;
            padding: 5px 10px;
            font-weight: bold;
            border-bottom: 1px solid #000;
          }
          .section-content {
            padding: 10px;
          }
          .row {
            display: flex;
            margin-bottom: 5px;
          }
          .col-half {
            flex: 1;
            padding-right: 10px;
          }
          .col-half:last-child {
            padding-right: 0;
            padding-left: 10px;
          }
          .party-details {
            display: flex;
            gap: 10px;
          }
          .party-column {
            flex: 1;
            border-right: 1px solid #ccc;
            padding-right: 10px;
          }
          .party-column:last-child {
            border-right: none;
            padding-right: 0;
            padding-left: 10px;
          }
          .party-title {
            font-weight: bold;
            margin-bottom: 5px;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 10px;
          }
          th, td {
            border: 1px solid #000;
            padding: 5px;
            text-align: left;
            font-size: 10px;
          }
          th {
            background: #f0f0f0;
            font-weight: bold;
            text-align: center;
          }
          .text-right {
            text-align: right;
          }
          .text-center {
            text-align: center;
          }
          .totals-table {
            margin-top: 10px;
          }
          .totals-table td {
            padding: 3px 8px;
          }
          .eway-section {
            display: flex;
            justify-content: space-between;
            align-items: center;
          }
          .generated-by {
            margin-top: 20px;
            font-size: 10px;
          }
          .signature-section {
            margin-top: 30px;
            text-align: right;
          }
          @media print {
            body { margin: 0; }
            .invoice-container { border: none; margin: 0; padding: 15px; }
          }
        </style>
      </head>
      <body>
        <div class="invoice-container">
          <!-- Header -->
          <div class="header">
            <div class="company-info">
              <div class="invoice-id">${invoice.id}</div>
              <div class="company-name">WINTAS TEXTILES</div>
            </div>
            <div class="qr-code">
              QR CODE<br/>
              (Sample)
            </div>
          </div>

          <!-- 1. E-Invoice Details -->
          <div class="section">
            <div class="section-header">1. E-Invoice Details</div>
            <div class="section-content">
              <div class="row">
                <div class="col-half">
                  <strong>IRN:</strong> ${invoice.irn}
                </div>
                <div class="col-half">
                  <strong>Ack No.:</strong> ${invoice.ackNo} &nbsp;&nbsp;&nbsp; <strong>Ack Date:</strong> ${invoice.ackDate}
                </div>
              </div>
            </div>
          </div>

          <!-- 2. Transaction Details -->
          <div class="section">
            <div class="section-header">2. Transaction Details</div>
            <div class="section-content">
              <div class="row">
                <div class="col-half">
                  <strong>Supply type Code:</strong> ${invoice.suppltTypeCode}
                </div>
                <div class="col-half">
                  <strong>Document No.:</strong> ${invoice.documentNumber}
                </div>
              </div>
              <div class="row">
                <div class="col-half">
                  <strong>Place of Supply:</strong> ${invoice.placeOfSupply}
                </div>
                <div class="col-half">
                  <strong>IGST applicable despite Supplier and Recipient located in same State:</strong> ${invoice.IGSTapplicableDespiteSupplierAndRecipientLocatedInSameState}
                </div>
              </div>
              <div class="row">
                <div class="col-half">
                  <strong>Document Type:</strong> ${invoice.documentType}
                </div>
                <div class="col-half">
                  <strong>Document Date:</strong> ${invoice.documentDate}
                </div>
              </div>
            </div>
          </div>

          <!-- 3. Party Details -->
          <div class="section">
            <div class="section-header">3. Party Details</div>
            <div class="section-content">
              <div class="party-details">
                <div class="party-column">
                  <div class="party-title">Supplier:</div>
                  <div><strong>GSTIN:</strong> ${invoice.supplier.GSTIN}</div>
                  <div><strong>Address:</strong> ${invoice.supplier.address}</div>
                  <div><strong>Email:</strong> ${invoice.supplier.email}</div>
                </div>
                <div class="party-column">
                  <div class="party-title">Recipient:</div>
                  <div><strong>GSTIN:</strong> ${invoice.recipient.GSTIN}</div>
                  <div><strong>Address:</strong> ${invoice.recipient.address}</div>
                  <div><strong>Email:</strong> ${invoice.recipient.email}</div>
                </div>
              </div>
              <div style="margin-top: 15px;">
                <div class="party-title">Ship To:</div>
                <div><strong>GSTIN:</strong> ${invoice.shipTo.GSTIN}</div>
                <div><strong>Address:</strong> ${invoice.shipTo.address}</div>
                <div><strong>Email:</strong> ${invoice.shipTo.email}</div>
              </div>
            </div>
          </div>

          <!-- 4. Details of Goods / Services -->
          <div class="section">
            <div class="section-header">4. Details of Goods / Services</div>
            <div class="section-content">
              <table>
                <thead>
                  <tr>
                    <th>S.No</th>
                    <th>Item Description</th>
                    <th>HSN Code</th>
                    <th>Quantity</th>
                    <th>Unit</th>
                    <th>Unit Price(Rs)</th>
                    <th>Discount(Rs)</th>
                    <th>Taxable Amount(Rs)</th>
                    <th>Tax Rate(GST + Cess)</th>
                    <th>Other Charges</th>
                    <th>Total</th>
                  </tr>
                </thead>
                <tbody>
                  ${invoice.items.map(item => `
                    <tr>
                      <td class="text-center">${item.slNo}</td>
                      <td>${item.description}</td>
                      <td class="text-center">${item.hsn}</td>
                      <td class="text-center">${item.qty}</td>
                      <td class="text-center">${item.unit}</td>
                      <td class="text-right">${item.unitPrice.toFixed(2)}</td>
                      <td class="text-right">${item.discount}</td>
                      <td class="text-right">${item.taxableAmount.toFixed(2)}</td>
                      <td class="text-center">
                        CGST ${item.cgstRate}%<br/>
                        SGST ${item.sgstRate}%<br/>
                        IGST ${item.igstRate}%<br/>
                        Cess ${item.cgstRate + item.sgstRate}%
                      </td>
                      <td class="text-right">0</td>
                      <td class="text-right">${item.totalAmount.toFixed(2)}</td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
              
              <table class="totals-table">
                <tr>
                  <td><strong>Taxable Amt</strong></td>
                  <td><strong>CGST Amt</strong></td>
                  <td><strong>SGST Amt</strong></td>
                  <td><strong>IGST Amt</strong></td>
                  <td><strong>CESS Amt</strong></td>
                  <td><strong>State CESS</strong></td>
                  <td><strong>Discount</strong></td>
                  <td><strong>Other Charges</strong></td>
                  <td><strong>Round off Amt</strong></td>
                  <td><strong>Tot Inv. Amt</strong></td>
                </tr>
                <tr>
                  <td class="text-right">${invoice.totals.TaxableAmount.toFixed(2)}</td>
                  <td class="text-right">${invoice.totals.CgstAmount.toFixed(2)}</td>
                  <td class="text-right">${invoice.totals.SgstAmount.toFixed(2)}</td>
                  <td class="text-right">${invoice.totals.IgstAmount.toFixed(2)}</td>
                  <td class="text-right">${invoice.totals.CessAmount.toFixed(2)}</td>
                  <td class="text-right">0.00</td>
                  <td class="text-right">${invoice.totals.Discount.toFixed(2)}</td>
                  <td class="text-right">${invoice.totals.OtherCharges.toFixed(2)}</td>
                  <td class="text-right">${invoice.totals.RoundOffAmount.toFixed(2)}</td>
                  <td class="text-right">${invoice.totals.TotalInvAmount.toFixed(2)}</td>
                </tr>
              </table>
            </div>
          </div>

          <!-- 5. Eway Bill Details -->
          <div class="section">
            <div class="section-header">5. Eway Bill Details</div>
            <div class="section-content">
              <div class="eway-section">
                <div>
                  <strong>Eway Bill No.:</strong> ${invoice.EwayBillNo} &nbsp;&nbsp;&nbsp;
                  <strong>Eway Bill Date.:</strong> ${invoice.EwayBillDate} &nbsp;&nbsp;&nbsp;
                  <strong>Valid Till Date:</strong> ${invoice.validTillDate}
                </div>
                <div style="text-align: right;">
                  <div style="color: #0066cc; font-weight: bold; font-size: 14px;">eSign</div>
                  <div style="font-size: 9px;">Digitally Signed by NIC-IRP</div>
                  <div style="font-size: 9px;">on ${invoice.printDate}</div>
                </div>
              </div>
            </div>
          </div>

          <!-- Generated By -->
          <div class="generated-by">
            <strong>Generated By:</strong> ${invoice.generatedBy}<br/>
            <strong>Print Date:</strong> ${invoice.printDate}
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      {loading && <Loading />}
      
      <div className=" mx-auto">
        {/* Header Section */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">E-Invoice Reports</h1>
              <p className="text-gray-600">Manage and generate PDF reports for all E-Invoices</p>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="relative">
                <FontAwesomeIcon 
                  icon={faSearch} 
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                />
                <input
                  type="text"
                  placeholder="Search invoices..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 w-64"
                />
              </div>
              
              <button
                onClick={fetchAllInvoices}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
              >
                <FontAwesomeIcon icon={faRefresh} />
                <span>Refresh</span>
              </button>
            </div>
          </div>
        </div>

    

        {/* Excel-like Table Section */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800">E-Invoice Data Table</h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead className="bg-gray-100 sticky top-0">
                <tr>
                  <th className="border border-gray-300 px-3 py-2 text-left text-xs font-medium text-gray-700 uppercase tracking-wider min-w-[100px]">
                    Invoice No.
                  </th>
                  <th className="border border-gray-300 px-3 py-2 text-left text-xs font-medium text-gray-700 uppercase tracking-wider min-w-[120px]">
                    Seller Name
                  </th>
                  <th className="border border-gray-300 px-3 py-2 text-left text-xs font-medium text-gray-700 uppercase tracking-wider min-w-[120px]">
                    Buyer Name
                  </th>
                  <th className="border border-gray-300 px-3 py-2 text-left text-xs font-medium text-gray-700 uppercase tracking-wider min-w-[100px]">
                    Invoice Date
                  </th>
                  <th className="border border-gray-300 px-3 py-2 text-left text-xs font-medium text-gray-700 uppercase tracking-wider min-w-[100px]">
                    Sub Total
                  </th>
                  <th className="border border-gray-300 px-3 py-2 text-left text-xs font-medium text-gray-700 uppercase tracking-wider min-w-[100px]">
                    Tax Rate
                  </th>
                  <th className="border border-gray-300 px-3 py-2 text-left text-xs font-medium text-gray-700 uppercase tracking-wider min-w-[150px]">
                    IRN No.
                  </th>
                  <th className="border border-gray-300 px-3 py-2 text-left text-xs font-medium text-gray-700 uppercase tracking-wider min-w-[100px]">
                    E-Way Bill
                  </th>
                  <th className="border border-gray-300 px-3 py-2 text-left text-xs font-medium text-gray-700 uppercase tracking-wider min-w-[80px]">
                    Items
                  </th>
                  <th className="border border-gray-300 px-3 py-2 text-left text-xs font-medium text-gray-700 uppercase tracking-wider min-w-[100px]">
                    Created By
                  </th>
                  <th className="border border-gray-300 px-3 py-2 text-left text-xs font-medium text-gray-700 uppercase tracking-wider min-w-[100px]">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white">
                {filteredInvoices.length === 0 ? (
                  <tr>
                    <td colSpan={11} className="border border-gray-300 px-6 py-8 text-center text-gray-500">
                      <div className="flex flex-col items-center">
                        <FontAwesomeIcon icon={faFilePdf} className="text-6xl mb-4 opacity-30" />
                        <div className="text-lg font-medium">No invoices found</div>
                        <div className="text-sm">Try adjusting your search criteria or refresh the data</div>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredInvoices.map((invoice, index) => (
                    <tr key={invoice.id} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                      <td className="border border-gray-300 px-3 py-2 text-sm font-medium text-gray-900">
                        {invoice.invoiceDetailNumber || '-'}
                      </td>
                      <td className="border border-gray-300 px-3 py-2 text-sm text-gray-700">
                        <div className="max-w-[120px] truncate" title={invoice.sellerName}>
                          {invoice.sellerName || '-'}
                        </div>
                        <div className="text-xs text-gray-500">
                          GST: {invoice.sellerGstNumber?.substring(0, 15)}...
                        </div>
                      </td>
                      <td className="border border-gray-300 px-3 py-2 text-sm text-gray-700">
                        <div className="max-w-[120px] truncate" title={invoice.BuyerDetailBillToName}>
                          {invoice.BuyerDetailBillToName || '-'}
                        </div>
                        <div className="text-xs text-gray-500">
                          GST: {invoice.BuyerDetailBillToGstNumber?.substring(0, 15)}...
                        </div>
                      </td>
                      <td className="border border-gray-300 px-3 py-2 text-sm text-gray-700">
                        {invoice.invoiceDetailDate || '-'}
                      </td>
                      <td className="border border-gray-300 px-3 py-2 text-sm font-medium text-green-600">
                        ₹{parseFloat(invoice.subTotal || '0').toLocaleString()}
                      </td>
                      <td className="border border-gray-300 px-3 py-2 text-sm text-gray-700">
                        {invoice.taxCalculationTaxRate || '0'}%
                        <div className="text-xs text-gray-500">
                          {invoice.taxCalculationIgstEitherCgstOrSgst || 'CGST+SGST'}
                        </div>
                      </td>
                      <td className="border border-gray-300 px-3 py-2 text-sm text-gray-700">
                        <div className="max-w-[150px] truncate text-xs" title={invoice.eInvoiceDetailIrnNo}>
                          {invoice.eInvoiceDetailIrnNo?.substring(0, 20)}...
                        </div>
                        <div className="text-xs text-gray-500">
                          Ack: {invoice.eInvoiceDetailAckNo}
                        </div>
                      </td>
                      <td className="border border-gray-300 px-3 py-2 text-sm text-gray-700">
                        {invoice.eInvoiceDetailEWayBillNo || '-'}
                      </td>
                      <td className="border border-gray-300 px-3 py-2 text-sm text-center font-medium text-blue-600">
                        {invoice.productDetails?.length || 0}
                      </td>
                      <td className="border border-gray-300 px-3 py-2 text-sm text-gray-700">
                        <div className="max-w-[100px] truncate" title={invoice.user?.contactPersonName}>
                          {invoice.user?.contactPersonName || '-'}
                        </div>
                        <div className="text-xs text-gray-500">
                          {new Date(invoice.uploadedDate).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="border border-gray-300 px-3 py-2 text-center">
                        <button
                          onClick={() => generatePDF(invoice)}
                          className="bg-red-600 text-white px-3 py-1 rounded text-xs hover:bg-red-700 transition-colors flex items-center space-x-1 mx-auto"
                          title="Generate PDF"
                        >
                          <FontAwesomeIcon icon={faPrint} />
                          <span>PDF</span>
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Summary Section */}
        {filteredInvoices.length > 0 && (
          <div className="mt-8 bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Summary Statistics</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg border">
                <div className="text-2xl font-bold text-blue-600">{filteredInvoices.length}</div>
                <div className="text-sm text-gray-600">Total Records</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg border">
                <div className="text-2xl font-bold text-green-600">
                  ₹{filteredInvoices.reduce((total, inv) => total + parseFloat(inv.subTotal || '0'), 0).toLocaleString()}
                </div>
                <div className="text-sm text-gray-600">Total Amount</div>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg border">
                <div className="text-2xl font-bold text-purple-600">
                  {filteredInvoices.reduce((total, inv) => total + (inv.productDetails?.length || 0), 0)}
                </div>
                <div className="text-sm text-gray-600">Total Items</div>
              </div>
              <div className="text-center p-4 bg-orange-50 rounded-lg border">
                <div className="text-2xl font-bold text-orange-600">
                  {new Set(filteredInvoices.map(inv => inv.sellerGstNumber)).size}
                </div>
                <div className="text-sm text-gray-600">Unique Sellers</div>
              </div>
            </div>
          </div>
        )}

        {/* Export Options */}
        <div className="mt-8 bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Export Options</h3>
          <div className="flex flex-wrap gap-4">
            <button
              onClick={() => {
                filteredInvoices.forEach(invoice => generatePDF(invoice));
              }}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
              disabled={filteredInvoices.length === 0}
            >
              <FontAwesomeIcon icon={faDownload} />
              <span>Download All PDFs</span>
            </button>
            
            <button
              onClick={() => {
                const csvContent = "data:text/csv;charset=utf-8," 
                  + "Invoice No,Seller Name,Buyer Name,Invoice Date,Sub Total,Tax Rate,IRN No,E-Way Bill,Items Count,Created By\n"
                  + filteredInvoices.map(inv => 
                    `"${inv.invoiceDetailNumber}","${inv.sellerName}","${inv.BuyerDetailBillToName}","${inv.invoiceDetailDate}","${inv.subTotal}","${inv.taxCalculationTaxRate}","${inv.eInvoiceDetailIrnNo}","${inv.eInvoiceDetailEWayBillNo}","${inv.productDetails?.length || 0}","${inv.user?.contactPersonName}"`
                  ).join("\n");
                
                const encodedUri = encodeURI(csvContent);
                const link = document.createElement("a");
                link.setAttribute("href", encodedUri);
                link.setAttribute("download", "einvoice_data.csv");
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
              }}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
              disabled={filteredInvoices.length === 0}
            >
              <FontAwesomeIcon icon={faFilePdf} />
              <span>Export to CSV</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EInvoiceReport;