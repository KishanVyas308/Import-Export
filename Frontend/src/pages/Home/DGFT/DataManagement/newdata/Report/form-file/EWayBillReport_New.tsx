import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faFilePdf, 
  faSearch, 
  faRefresh, 
  faPrint,
  faDownload
} from '@fortawesome/free-solid-svg-icons';
import { useCookies } from 'react-cookie';

// Define interfaces for the real data structure
interface EWayBillDetails {
  id: string;
  ewaybillNo: string;
  ewaybillGeneratedDate: string;
  ewaybillValidUpto: string;
  ewaybillValidFrom: string;
  ewaybillModeOfTransportation: string;
  ewaybillApproxDistance: string;
  ewaybillDocumentType: string;
  ewaybillDocumentNumber: string;
  ewaybillDocumentDate: string;
  ewaybillSupplyType: string;
  ewaybillSubType: string;
  ewaybillTransactionType: string;
  ewaybillIrnNo: string;
  supplierGstin: string;
  supplierName: string;
  supplierState: string;
  supplierDispatchFromAddress: string;
  recipientGstin: string;
  recipientName: string;
  recipientState: string;
  recipientShipToAddress: string;
  goodDetailsHsnCode: string;
  goodDetailsProductNameAndDescription: string;
  goodDetailsQuantity: string;
  goodDetailsUnit: string;
  goodDetailsTaxRate: string;
  goodDetailsTotalTaxableAmount: string;
  goodDetailsCgstAmount: string;
  goodDetailsSgstAmount: string;
  goodDetailsIgstAmount: string;
  goodDetailsCessAmount: string;
  goodDetailsOtherAmount: string;
  goodDetailsTotalInvoiceAmount: string;
  transporterGstnOrEnrolmentId: string;
  lrNoAndDate: string;
  multiVehicleInfo: string;
  vehicleType: string;
  vehicleNo: string;
  addedByUserId: string;
  uploadedDate: string;
  user: {
    id: string;
    contactPersonName: string;
    email: string;
    companyName: string;
  };
}

const EWayBillReport = () => {
  const [loading, setLoading] = useState(false);
  const [ewayBills, setEwayBills] = useState<EWayBillDetails[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [cookies] = useCookies(['token']);

  // Fetch all E-Way Bills from backend
  const fetchAllEwayBills = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:8000/api/form/eway-bill-data', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${cookies.token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setEwayBills(data);
      } else {
        console.error('Failed to fetch E-Way Bill data');
      }
    } catch (error) {
      console.error('Error fetching E-Way Bill data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllEwayBills();
  }, []);

  // Filter E-Way Bills based on search term
  const filteredEwayBills = ewayBills.filter(ewayBill =>
    ewayBill.supplierName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ewayBill.ewaybillNo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ewayBill.recipientName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ewayBill.ewaybillDocumentNumber?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Convert real E-Way Bill data to dummy format for PDF generation
  const convertToLegacyFormat = (ewayBill: EWayBillDetails) => {
    return {
      id: ewayBill.id,
      eWayBillNo: ewayBill.ewaybillNo || "",
      generatedDate: ewayBill.ewaybillGeneratedDate || "",
      generatedBY: ewayBill.user?.contactPersonName || "",
      validUpTo: ewayBill.ewaybillValidUpto || "",
      mode: ewayBill.ewaybillModeOfTransportation || "",
      aproxDistence: ewayBill.ewaybillApproxDistance || "",
      type: ewayBill.ewaybillSupplyType || "",
      documentDetails: `${ewayBill.ewaybillDocumentType || ""} - ${ewayBill.ewaybillDocumentNumber || ""} - ${ewayBill.ewaybillDocumentDate || ""}`,
      transactionType: ewayBill.ewaybillTransactionType || "",
      from: {
        GSTIN: ewayBill.supplierGstin || "",
        address: `${ewayBill.supplierName || ""}, ${ewayBill.supplierState || ""}`,
        dispatchFrom: ewayBill.supplierDispatchFromAddress || "",
      },
      to: {
        GSTIN: ewayBill.recipientGstin || "",
        address: `${ewayBill.recipientName || ""}, ${ewayBill.recipientState || ""}`,
        shipTo: ewayBill.recipientShipToAddress || "",
      },
      HSNCode: ewayBill.goodDetailsHsnCode || "",
      ProductNameDesc: ewayBill.goodDetailsProductNameAndDescription || "",
      Quantity: `${ewayBill.goodDetailsQuantity || ""}${ewayBill.goodDetailsUnit || ""}`,
      TaxableAmountRs: ewayBill.goodDetailsTotalTaxableAmount || "0.00",
      TaxRateC_S_I_Cess_CessNonAdvol: `${ewayBill.goodDetailsTaxRate || "0"}%`,
      TotTaxbleAmt: parseFloat(ewayBill.goodDetailsTotalTaxableAmount || "0"),
      CGSTAmt: parseFloat(ewayBill.goodDetailsCgstAmount || "0"),
      SGSTAmt: parseFloat(ewayBill.goodDetailsSgstAmount || "0"),
      IGSTAmt: parseFloat(ewayBill.goodDetailsIgstAmount || "0"),
      CESSAmt: parseFloat(ewayBill.goodDetailsCessAmount || "0"),
      CESSNonAdvolAmt: 0.00,
      OtherAmt: parseFloat(ewayBill.goodDetailsOtherAmount || "0"),
      TotalInvAmt: parseFloat(ewayBill.goodDetailsTotalInvoiceAmount || "0"),
      transporterIdAndName: ewayBill.transporterGstnOrEnrolmentId || "",
      transporterDocNoansDate: ewayBill.lrNoAndDate || "",
      Mode: ewayBill.ewaybillModeOfTransportation || "",
      VehicleTrans: ewayBill.vehicleNo || "",
      DocNoDt: ewayBill.lrNoAndDate || "",
      FromEnteredDateEnteredBy: ewayBill.ewaybillGeneratedDate || "",
      CEWBNo: "-",
      MultiVehI: ewayBill.multiVehicleInfo || "-"
    };
  };

  const generatePDF = (selectedEwayBill: EWayBillDetails) => {
    const ewayBill = convertToLegacyFormat(selectedEwayBill);
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
                    <td>${ewayBill.from.dispatchFrom}</td>
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-center">Loading...</p>
          </div>
        </div>
      )}
      
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">E-Way Bill Reports</h1>
              <p className="text-gray-600">Manage and generate PDF reports for all E-Way Bills</p>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="relative">
                <FontAwesomeIcon 
                  icon={faSearch} 
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                />
                <input
                  type="text"
                  placeholder="Search E-Way Bills..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-64"
                />
              </div>
              
              <button
                onClick={fetchAllEwayBills}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
              >
                <FontAwesomeIcon icon={faRefresh} />
                <span>Refresh</span>
              </button>
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-xl shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold">Total E-Way Bills</h3>
                <p className="text-3xl font-bold">{ewayBills.length}</p>
              </div>
              <FontAwesomeIcon icon={faFilePdf} className="text-4xl opacity-80" />
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-6 rounded-xl shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold">Filtered Results</h3>
                <p className="text-3xl font-bold">{filteredEwayBills.length}</p>
              </div>
              <FontAwesomeIcon icon={faSearch} className="text-4xl opacity-80" />
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-6 rounded-xl shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold">Total Value</h3>
                <p className="text-3xl font-bold">
                  ₹{ewayBills.reduce((total, bill) => total + parseFloat(bill.goodDetailsTotalInvoiceAmount || '0'), 0).toLocaleString()}
                </p>
              </div>
              <FontAwesomeIcon icon={faFilePdf} className="text-4xl opacity-80" />
            </div>
          </div>
        </div>

        {/* Excel-like Table Section */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800">E-Way Bill Data Table</h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead className="bg-gray-100 sticky top-0">
                <tr>
                  <th className="border border-gray-300 px-3 py-2 text-left text-xs font-medium text-gray-700 uppercase tracking-wider min-w-[120px]">
                    E-Way Bill No.
                  </th>
                  <th className="border border-gray-300 px-3 py-2 text-left text-xs font-medium text-gray-700 uppercase tracking-wider min-w-[120px]">
                    Supplier Name
                  </th>
                  <th className="border border-gray-300 px-3 py-2 text-left text-xs font-medium text-gray-700 uppercase tracking-wider min-w-[120px]">
                    Recipient Name
                  </th>
                  <th className="border border-gray-300 px-3 py-2 text-left text-xs font-medium text-gray-700 uppercase tracking-wider min-w-[100px]">
                    Generated Date
                  </th>
                  <th className="border border-gray-300 px-3 py-2 text-left text-xs font-medium text-gray-700 uppercase tracking-wider min-w-[100px]">
                    Valid Until
                  </th>
                  <th className="border border-gray-300 px-3 py-2 text-left text-xs font-medium text-gray-700 uppercase tracking-wider min-w-[80px]">
                    Mode
                  </th>
                  <th className="border border-gray-300 px-3 py-2 text-left text-xs font-medium text-gray-700 uppercase tracking-wider min-w-[100px]">
                    Distance
                  </th>
                  <th className="border border-gray-300 px-3 py-2 text-left text-xs font-medium text-gray-700 uppercase tracking-wider min-w-[100px]">
                    Document No.
                  </th>
                  <th className="border border-gray-300 px-3 py-2 text-left text-xs font-medium text-gray-700 uppercase tracking-wider min-w-[100px]">
                    Vehicle No.
                  </th>
                  <th className="border border-gray-300 px-3 py-2 text-left text-xs font-medium text-gray-700 uppercase tracking-wider min-w-[100px]">
                    Total Amount
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
                {filteredEwayBills.length === 0 ? (
                  <tr>
                    <td colSpan={12} className="border border-gray-300 px-6 py-8 text-center text-gray-500">
                      <div className="flex flex-col items-center">
                        <FontAwesomeIcon icon={faFilePdf} className="text-6xl mb-4 opacity-30" />
                        <div className="text-lg font-medium">No E-Way Bills found</div>
                        <div className="text-sm">Try adjusting your search criteria or refresh the data</div>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredEwayBills.map((ewayBill, index) => (
                    <tr key={ewayBill.id} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                      <td className="border border-gray-300 px-3 py-2 text-sm font-medium text-gray-900">
                        {ewayBill.ewaybillNo || '-'}
                      </td>
                      <td className="border border-gray-300 px-3 py-2 text-sm text-gray-700">
                        <div className="max-w-[120px] truncate" title={ewayBill.supplierName}>
                          {ewayBill.supplierName || '-'}
                        </div>
                        <div className="text-xs text-gray-500">
                          GST: {ewayBill.supplierGstin?.substring(0, 15)}...
                        </div>
                      </td>
                      <td className="border border-gray-300 px-3 py-2 text-sm text-gray-700">
                        <div className="max-w-[120px] truncate" title={ewayBill.recipientName}>
                          {ewayBill.recipientName || '-'}
                        </div>
                        <div className="text-xs text-gray-500">
                          GST: {ewayBill.recipientGstin?.substring(0, 15)}...
                        </div>
                      </td>
                      <td className="border border-gray-300 px-3 py-2 text-sm text-gray-700">
                        {ewayBill.ewaybillGeneratedDate || '-'}
                      </td>
                      <td className="border border-gray-300 px-3 py-2 text-sm text-gray-700">
                        {ewayBill.ewaybillValidUpto || '-'}
                      </td>
                      <td className="border border-gray-300 px-3 py-2 text-sm text-gray-700">
                        {ewayBill.ewaybillModeOfTransportation || '-'}
                      </td>
                      <td className="border border-gray-300 px-3 py-2 text-sm text-gray-700">
                        {ewayBill.ewaybillApproxDistance || '-'}
                      </td>
                      <td className="border border-gray-300 px-3 py-2 text-sm text-gray-700">
                        <div className="max-w-[100px] truncate" title={ewayBill.ewaybillDocumentNumber}>
                          {ewayBill.ewaybillDocumentNumber || '-'}
                        </div>
                        <div className="text-xs text-gray-500">
                          {ewayBill.ewaybillDocumentDate}
                        </div>
                      </td>
                      <td className="border border-gray-300 px-3 py-2 text-sm text-gray-700">
                        {ewayBill.vehicleNo || '-'}
                      </td>
                      <td className="border border-gray-300 px-3 py-2 text-sm font-medium text-green-600">
                        ₹{parseFloat(ewayBill.goodDetailsTotalInvoiceAmount || '0').toLocaleString()}
                      </td>
                      <td className="border border-gray-300 px-3 py-2 text-sm text-gray-700">
                        <div className="max-w-[100px] truncate" title={ewayBill.user?.contactPersonName}>
                          {ewayBill.user?.contactPersonName || '-'}
                        </div>
                        <div className="text-xs text-gray-500">
                          {new Date(ewayBill.uploadedDate).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="border border-gray-300 px-3 py-2 text-center">
                        <button
                          onClick={() => generatePDF(ewayBill)}
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
        {filteredEwayBills.length > 0 && (
          <div className="mt-8 bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Summary Statistics</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg border">
                <div className="text-2xl font-bold text-blue-600">{filteredEwayBills.length}</div>
                <div className="text-sm text-gray-600">Total Records</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg border">
                <div className="text-2xl font-bold text-green-600">
                  ₹{filteredEwayBills.reduce((total, bill) => total + parseFloat(bill.goodDetailsTotalInvoiceAmount || '0'), 0).toLocaleString()}
                </div>
                <div className="text-sm text-gray-600">Total Amount</div>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg border">
                <div className="text-2xl font-bold text-purple-600">
                  {new Set(filteredEwayBills.map(bill => bill.ewaybillModeOfTransportation)).size}
                </div>
                <div className="text-sm text-gray-600">Transport Modes</div>
              </div>
              <div className="text-center p-4 bg-orange-50 rounded-lg border">
                <div className="text-2xl font-bold text-orange-600">
                  {new Set(filteredEwayBills.map(bill => bill.supplierGstin)).size}
                </div>
                <div className="text-sm text-gray-600">Unique Suppliers</div>
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
                filteredEwayBills.forEach(ewayBill => generatePDF(ewayBill));
              }}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
              disabled={filteredEwayBills.length === 0}
            >
              <FontAwesomeIcon icon={faDownload} />
              <span>Download All PDFs</span>
            </button>
            
            <button
              onClick={() => {
                const csvContent = "data:text/csv;charset=utf-8," 
                  + "E-Way Bill No,Supplier Name,Recipient Name,Generated Date,Valid Until,Mode,Distance,Document No,Vehicle No,Total Amount,Created By\n"
                  + filteredEwayBills.map(bill => 
                    `"${bill.ewaybillNo}","${bill.supplierName}","${bill.recipientName}","${bill.ewaybillGeneratedDate}","${bill.ewaybillValidUpto}","${bill.ewaybillModeOfTransportation}","${bill.ewaybillApproxDistance}","${bill.ewaybillDocumentNumber}","${bill.vehicleNo}","${bill.goodDetailsTotalInvoiceAmount}","${bill.user?.contactPersonName}"`
                  ).join("\n");
                
                const encodedUri = encodeURI(csvContent);
                const link = document.createElement("a");
                link.setAttribute("href", encodedUri);
                link.setAttribute("download", "eway_bill_data.csv");
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
              }}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
              disabled={filteredEwayBills.length === 0}
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

export default EWayBillReport;
