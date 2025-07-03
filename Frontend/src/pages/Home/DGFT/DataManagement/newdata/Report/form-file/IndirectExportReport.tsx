import React, { useState, useEffect, useCallback } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faSearch, 
    faFileExport, 
    faSpinner, 
    faTable,
    faChevronDown,
    faUser,
    faBuilding,
    faCalendar,
    faHashtag,
    faDollarSign,
    faShip,
    faInfoCircle,
    faInbox,
    faCheckCircle,
    faExclamationTriangle,
    faRedo,
    faFilter,
    faFileExcel,
    faDownload,
    faSync
} from '@fortawesome/free-solid-svg-icons';
import { useCookies } from "react-cookie";
import axios from 'axios';
import * as XLSX from 'xlsx';
import { BACKEND_URL } from '../../../../../../../Globle';

// Loading Component
const Loading = () => (
    <div className="fixed inset-0 flex items-center justify-center z-50">
        <div className="bg-white p-5 rounded-lg shadow-xl flex items-center space-x-4">
            <FontAwesomeIcon icon={faSpinner} className="text-green-500 text-2xl animate-spin" />
            <p className="text-gray-700 font-medium">Loading...</p>
        </div>
    </div>
);

interface User {
    email: string;
    companyName: string;
    contactPersonName: string;
}

interface IndirectExportBasicSheetData {
    id: string;
    companyName: string;
    srNo: string;
    shippingBillNo: string;
    shippingBillDate?: string;
    thirdPartyExporter: string;
    hsCodeAndDescription: string;
    epcgLicNo?: string;
    cifValue: string;
    freight: string;
    insurance: string;
    brc: string;
    exchangeRate: string;
    cifValue2: string;
    freight2: string;
    insurance2: string;
    brc2: string;
    exchangeRate2: string;
    invoiceNo: string;
    invoiceDate: string;
    basicAmount: string;
    invoiceValue: string;
    bankPaymentReceivedDate: string;
    amountReceived: string;
    amountRealised: string;
    qtyAsPerInvoiceAndSbMatch: string;
    epcgLicNoInTaxInvoice: string;
    lorryReceiptOrEwayBill: string;
    bankStatement: string;
    product?: string;
    remarks?: string;
    user: User;
    uploadedDate: string;
}

interface IndirectExportAnnexure1Data {
    id: string;
    srNo: string;
    shippingBillNo: string;
    shippingBillDate?: string;
    shippingBillCifValue?: string;
    brcValue?: string;
    lowerOfSbAndBrc?: string;
    shippingBillFreight?: string;
    shippingBillInsurance?: string;
    fobValueInDollars?: string;
    exchangeRatePerShippingBill?: string;
    fobValueInRupees?: string;
    user: User;
    uploadedDate: string;
}

interface IndirectExportAnnexure2Data {
    id: string;
    srNo: string;
    shippingBillNo: string;
    shippingBillDate?: string;
    taxInvoiceBillNo: string;
    taxInvoiceDate: string;
    taxInvoiceBasicAmount: string;
    taxInvoiceTax: string;
    taxInvoiceInvoiceValue: string;
    paymentDetailsDate: string;
    paymentDetailsAmountReceived: string;
    paymentDetailsAmountRealised: string;
    lowerOfInvoiceAndBankStatement: string;
    proportionateAmountOf6ForInRs: string;
    exchangeRatePerShippingBill: string;
    forInUsd: string;
    user: User;
    uploadedDate: string;
}

interface IndirectExportCalculationSheetData {
    id: string;
    srNo: string;
    sameProductOrAlternativeProductService: string;
    shippingBillNo: string;
    shippingBillDate?: string;
    fobValueRealizationProceedsRs: string;
    fobValueRealizationProceedsUs: string;
    fobValueAnnexure1Rs: string;
    fobValueAnnexure1Us: string;
    fobValueAnnexure2Rs: string;
    fobValueAnnexure2Us: string;
    fobValueLowerOf5_6_7Rs: string;
    fobValueLowerOf5_6_7Us: string;
    user: User;
    uploadedDate: string;
}

interface IndirectExportNewDeptSheetData {
    id: string;
    srNo: string;
    shippingBillNo: string;
    shippingBillDate?: string;
    invoiceNo: string;
    invoiceDate: string;
    amountRealisedAsPerBrcUs: string;
    amountRealisedAsPerBrcExchRate: string;
    amountRealisedAsPerBrcRs: string;
    amountRealisedInBankRs: string;
    amountLessOfCol6And7Rs: string;
    convertedIntoUsd: string;
    user: User;
    uploadedDate: string;
}

interface IndirectExportAnnexureAData {
    id: string;
    srNo: string;
    sameProductOrService: string;
    shippingBillNo: string;
    shippingBillDate?: string;
    directExportsRs: string;
    directExportsUs: string;
    deemedExports: string;
    thirdPartyExportsRs: string;
    thirdPartyExportsUs: string;
    byGroupCompany: string;
    otherRnDServicesOrRoyalty: string;
    totalRs: string;
    totalUs: string;
    user: User;
    uploadedDate: string;
}

interface ConsolidatedRow {
    srNo: string;
    basicSheet: IndirectExportBasicSheetData | null;
    annexure1: IndirectExportAnnexure1Data | null;
    annexure2: IndirectExportAnnexure2Data | null;
    calculationSheet: IndirectExportCalculationSheetData | null;
    newDeptSheet: IndirectExportNewDeptSheetData | null;
    annexureA: IndirectExportAnnexureAData | null;
    user: User;
    uploadedDate: string;
}

interface TableSection {
    name: string;
    key: string;
    data: any[];
    count: number;
    hasMore: boolean;
}

interface PaginationInfo {
    currentPage: number;
    limit: number;
    totalRecords: number;
    hasMore: boolean;
}

interface ApiResponse {
    success: boolean;
    message: string;
    data: {
        indirectExportBasicSheet: { data: IndirectExportBasicSheetData[]; count: number; hasMore: boolean };
        indirectExportAnnexure1: { data: IndirectExportAnnexure1Data[]; count: number; hasMore: boolean };
        indirectExportAnnexure2: { data: IndirectExportAnnexure2Data[]; count: number; hasMore: boolean };
        indirectExportCalculationSheet: { data: IndirectExportCalculationSheetData[]; count: number; hasMore: boolean };
        indirectExportNewDeptSheet: { data: IndirectExportNewDeptSheetData[]; count: number; hasMore: boolean };
        indirectExportAnnexureA: { data: IndirectExportAnnexureAData[]; count: number; hasMore: boolean };
        pagination: PaginationInfo;
    };
}

// Define sections outside component to prevent re-renders
const SECTIONS = [
    { key: 'indirectExportBasicSheet', name: 'Basic Sheet', icon: faTable, shortName: 'BS' },
    { key: 'indirectExportAnnexure1', name: 'Annexure 1', icon: faFileExport, shortName: 'A1' },
    { key: 'indirectExportAnnexure2', name: 'Annexure 2', icon: faFileExport, shortName: 'A2' },
    { key: 'indirectExportCalculationSheet', name: 'Calculation Sheet', icon: faTable, shortName: 'CS' },
    { key: 'indirectExportNewDeptSheet', name: 'New Dept Sheet', icon: faTable, shortName: 'NDS' },
    { key: 'indirectExportAnnexureA', name: 'Annexure A', icon: faFileExport, shortName: 'AA' }
];

const IndirectExportReport: React.FC = () => {
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [consolidatedData, setConsolidatedData] = useState<ConsolidatedRow[]>([]);
    const [pagination, setPagination] = useState<PaginationInfo | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [cookies] = useCookies(["token"]);

    // Consolidate data by srNo
    const consolidateData = (tableSections: TableSection[]): ConsolidatedRow[] => {
        const consolidatedMap = new Map<string, ConsolidatedRow>();

        tableSections.forEach(section => {
            section.data.forEach(item => {
                const srNo = item.srNo || 'unknown';
                
                if (!consolidatedMap.has(srNo)) {
                    consolidatedMap.set(srNo, {
                        srNo,
                        basicSheet: null,
                        annexure1: null,
                        annexure2: null,
                        calculationSheet: null,
                        newDeptSheet: null,
                        annexureA: null,
                        user: item.user,
                        uploadedDate: item.uploadedDate
                    });
                }

                const consolidated = consolidatedMap.get(srNo)!;
                
                switch (section.key) {
                    case 'indirectExportBasicSheet':
                        consolidated.basicSheet = item;
                        break;
                    case 'indirectExportAnnexure1':
                        consolidated.annexure1 = item;
                        break;
                    case 'indirectExportAnnexure2':
                        consolidated.annexure2 = item;
                        break;
                    case 'indirectExportCalculationSheet':
                        consolidated.calculationSheet = item;
                        break;
                    case 'indirectExportNewDeptSheet':
                        consolidated.newDeptSheet = item;
                        break;
                    case 'indirectExportAnnexureA':
                        consolidated.annexureA = item;
                        break;
                }
            });
        });

        return Array.from(consolidatedMap.values()).sort((a, b) => {
            const aNum = parseInt(a.srNo) || 0;
            const bNum = parseInt(b.srNo) || 0;
            return aNum - bNum;
        });
    };

    // Fetch data function
    const fetchData = useCallback(async (page = 1, search = "", append = false) => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get<ApiResponse>(
                `${BACKEND_URL}/reports/form/indirectexport`,
                {
                    params: { page, limit: 50, search },
                    headers: { Authorization: cookies.token }
                }
            );

            if (response.data.success) {
                const { data } = response.data;
                
                const newSections: TableSection[] = SECTIONS.map(section => {
                    const sectionData = data[section.key as keyof typeof data];
                    if (sectionData && typeof sectionData === 'object' && 'data' in sectionData) {
                        return {
                            name: section.name,
                            key: section.key,
                            data: sectionData.data || [],
                            count: sectionData.count || 0,
                            hasMore: sectionData.hasMore || false
                        };
                    }
                    return {
                        name: section.name,
                        key: section.key,
                        data: [],
                        count: 0,
                        hasMore: false
                    };
                });

                const consolidated = consolidateData(newSections);

                if (append) {
                    setConsolidatedData(prev => [...prev, ...consolidated]);
                } else {
                    setConsolidatedData(consolidated);
                }

                setPagination(data.pagination);
                setCurrentPage(page);
            } else {
                throw new Error(response.data.message || 'Failed to fetch data');
            }
        } catch (error) {
            console.error("Error fetching indirect export data:", error);
            setError(error instanceof Error ? error.message : 'An unknown error occurred');
        } finally {
            setLoading(false);
        }
    }, [cookies.token]);

    // Load more data
    const loadMore = () => {
        if (pagination?.hasMore && !loading) {
            fetchData(currentPage + 1, searchTerm, true);
        }
    };

    // Handle search
    const handleSearch = (value: string) => {
        setSearchTerm(value);
        setCurrentPage(1);
        fetchData(1, value, false);
    };

    // Format currency
    const formatCurrency = (value: string | undefined) => {
        if (!value || value === "0.00") return "₹0.00";
        const num = parseFloat(value);
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            minimumFractionDigits: 2
        }).format(num);
    };

    // Format USD currency
    const formatUSDCurrency = (value: string | undefined) => {
        if (!value || value === "0.00") return "$0.00";
        const num = parseFloat(value);
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2
        }).format(num);
    };

    // Format date
    const formatDate = (dateString: string | undefined) => {
        if (!dateString) return '-';
        return new Date(dateString).toLocaleDateString('en-IN', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    // Format exchange rate
    const formatRate = (value: string | undefined) => {
        if (!value || value === "0.0000") return "0.0000";
        const num = parseFloat(value);
        return num.toFixed(4);
    };

    // Get data source badges
    const getDataSourceBadge = (row: ConsolidatedRow): string[] => {
        const sources: string[] = [];
        if (row.basicSheet) sources.push('BS');
        if (row.annexure1) sources.push('A1');
        if (row.annexure2) sources.push('A2');
        if (row.calculationSheet) sources.push('CS');
        if (row.newDeptSheet) sources.push('NDS');
        if (row.annexureA) sources.push('AA');
        return sources;
    };

    // Export to Excel function with ALL fields
    const exportToExcel = () => {
        try {
            const excelData = consolidatedData.map((row, index) => ({
                'Sr No': row.srNo,
                'Data Sources': getDataSourceBadge(row).join(', '),
                
                // Basic Sheet Data - ALL FIELDS
                'BS: Company Name': row.basicSheet?.companyName || '-',
                'BS: Shipping Bill No': row.basicSheet?.shippingBillNo || '-',
                'BS: Shipping Bill Date': row.basicSheet?.shippingBillDate ? formatDate(row.basicSheet.shippingBillDate) : '-',
                'BS: Third Party Exporter': row.basicSheet?.thirdPartyExporter || '-',
                'BS: HS Code': row.basicSheet?.hsCodeAndDescription || '-',
                'BS: EPCG Lic No': row.basicSheet?.epcgLicNo || '-',
                'BS: CIF Value': row.basicSheet?.cifValue || '-',
                'BS: Freight': row.basicSheet?.freight || '-',
                'BS: Insurance': row.basicSheet?.insurance || '-',
                'BS: BRC': row.basicSheet?.brc || '-',
                'BS: Exchange Rate': row.basicSheet?.exchangeRate || '-',
                'BS: CIF Value 2': row.basicSheet?.cifValue2 || '-',
                'BS: Freight 2': row.basicSheet?.freight2 || '-',
                'BS: Insurance 2': row.basicSheet?.insurance2 || '-',
                'BS: BRC 2': row.basicSheet?.brc2 || '-',
                'BS: Exchange Rate 2': row.basicSheet?.exchangeRate2 || '-',
                'BS: Invoice No': row.basicSheet?.invoiceNo || '-',
                'BS: Invoice Date': row.basicSheet?.invoiceDate || '-',
                'BS: Basic Amount': row.basicSheet?.basicAmount || '-',
                'BS: Invoice Value': row.basicSheet?.invoiceValue || '-',
                'BS: Bank Payment Received Date': row.basicSheet?.bankPaymentReceivedDate || '-',
                'BS: Amount Received': row.basicSheet?.amountReceived || '-',
                'BS: Amount Realised': row.basicSheet?.amountRealised || '-',
                'BS: Qty As Per Invoice And SB Match': row.basicSheet?.qtyAsPerInvoiceAndSbMatch || '-',
                'BS: EPCG Lic No In Tax Invoice': row.basicSheet?.epcgLicNoInTaxInvoice || '-',
                'BS: Lorry Receipt Or Eway Bill': row.basicSheet?.lorryReceiptOrEwayBill || '-',
                'BS: Bank Statement': row.basicSheet?.bankStatement || '-',
                'BS: Product': row.basicSheet?.product || '-',
                'BS: Remarks': row.basicSheet?.remarks || '-',
                
                // Annexure1 Data - ALL FIELDS
                'A1: Shipping Bill No': row.annexure1?.shippingBillNo || '-',
                'A1: Shipping Bill Date': row.annexure1?.shippingBillDate ? formatDate(row.annexure1.shippingBillDate) : '-',
                'A1: Shipping Bill CIF Value': row.annexure1?.shippingBillCifValue || '-',
                'A1: BRC Value': row.annexure1?.brcValue || '-',
                'A1: Lower Of SB And BRC': row.annexure1?.lowerOfSbAndBrc || '-',
                'A1: Shipping Bill Freight': row.annexure1?.shippingBillFreight || '-',
                'A1: Shipping Bill Insurance': row.annexure1?.shippingBillInsurance || '-',
                'A1: FOB Value In Dollars': row.annexure1?.fobValueInDollars || '-',
                'A1: Exchange Rate Per Shipping Bill': row.annexure1?.exchangeRatePerShippingBill || '-',
                'A1: FOB Value In Rupees': row.annexure1?.fobValueInRupees || '-',
                
                // Annexure2 Data - ALL FIELDS
                'A2: Shipping Bill No': row.annexure2?.shippingBillNo || '-',
                'A2: Shipping Bill Date': row.annexure2?.shippingBillDate ? formatDate(row.annexure2.shippingBillDate) : '-',
                'A2: Tax Invoice Bill No': row.annexure2?.taxInvoiceBillNo || '-',
                'A2: Tax Invoice Date': row.annexure2?.taxInvoiceDate || '-',
                'A2: Tax Invoice Basic Amount': row.annexure2?.taxInvoiceBasicAmount || '-',
                'A2: Tax Invoice Tax': row.annexure2?.taxInvoiceTax || '-',
                'A2: Tax Invoice Invoice Value': row.annexure2?.taxInvoiceInvoiceValue || '-',
                'A2: Payment Details Date': row.annexure2?.paymentDetailsDate || '-',
                'A2: Payment Details Amount Received': row.annexure2?.paymentDetailsAmountReceived || '-',
                'A2: Payment Details Amount Realised': row.annexure2?.paymentDetailsAmountRealised || '-',
                'A2: Lower Of Invoice And Bank Statement': row.annexure2?.lowerOfInvoiceAndBankStatement || '-',
                'A2: Proportionate Amount Of 6 For In Rs': row.annexure2?.proportionateAmountOf6ForInRs || '-',
                'A2: Exchange Rate Per Shipping Bill': row.annexure2?.exchangeRatePerShippingBill || '-',
                'A2: For In USD': row.annexure2?.forInUsd || '-',
                
                // Calculation Sheet Data - ALL FIELDS
                'CS: Same Product Or Alternative Product Service': row.calculationSheet?.sameProductOrAlternativeProductService || '-',
                'CS: Shipping Bill No': row.calculationSheet?.shippingBillNo || '-',
                'CS: Shipping Bill Date': row.calculationSheet?.shippingBillDate ? formatDate(row.calculationSheet.shippingBillDate) : '-',
                'CS: FOB Value Realization Proceeds Rs': row.calculationSheet?.fobValueRealizationProceedsRs || '-',
                'CS: FOB Value Realization Proceeds Us': row.calculationSheet?.fobValueRealizationProceedsUs || '-',
                'CS: FOB Value Annexure1 Rs': row.calculationSheet?.fobValueAnnexure1Rs || '-',
                'CS: FOB Value Annexure1 Us': row.calculationSheet?.fobValueAnnexure1Us || '-',
                'CS: FOB Value Annexure2 Rs': row.calculationSheet?.fobValueAnnexure2Rs || '-',
                'CS: FOB Value Annexure2 Us': row.calculationSheet?.fobValueAnnexure2Us || '-',
                'CS: FOB Value Lower Of 5_6_7 Rs': row.calculationSheet?.fobValueLowerOf5_6_7Rs || '-',
                'CS: FOB Value Lower Of 5_6_7 Us': row.calculationSheet?.fobValueLowerOf5_6_7Us || '-',
                
                // New Dept Sheet Data - ALL FIELDS
                'NDS: Shipping Bill No': row.newDeptSheet?.shippingBillNo || '-',
                'NDS: Shipping Bill Date': row.newDeptSheet?.shippingBillDate ? formatDate(row.newDeptSheet.shippingBillDate) : '-',
                'NDS: Invoice No': row.newDeptSheet?.invoiceNo || '-',
                'NDS: Invoice Date': row.newDeptSheet?.invoiceDate || '-',
                'NDS: Amount Realised As Per BRC Us': row.newDeptSheet?.amountRealisedAsPerBrcUs || '-',
                'NDS: Amount Realised As Per BRC Exch Rate': row.newDeptSheet?.amountRealisedAsPerBrcExchRate || '-',
                'NDS: Amount Realised As Per BRC Rs': row.newDeptSheet?.amountRealisedAsPerBrcRs || '-',
                'NDS: Amount Realised In Bank Rs': row.newDeptSheet?.amountRealisedInBankRs || '-',
                'NDS: Amount Less Of Col6 And 7 Rs': row.newDeptSheet?.amountLessOfCol6And7Rs || '-',
                'NDS: Converted Into USD': row.newDeptSheet?.convertedIntoUsd || '-',
                
                // AnnexureA Data - ALL FIELDS
                'AA: Same Product Or Service': row.annexureA?.sameProductOrService || '-',
                'AA: Shipping Bill No': row.annexureA?.shippingBillNo || '-',
                'AA: Shipping Bill Date': row.annexureA?.shippingBillDate ? formatDate(row.annexureA.shippingBillDate) : '-',
                'AA: Direct Exports Rs': row.annexureA?.directExportsRs || '-',
                'AA: Direct Exports Us': row.annexureA?.directExportsUs || '-',
                'AA: Deemed Exports': row.annexureA?.deemedExports || '-',
                'AA: Third Party Exports Rs': row.annexureA?.thirdPartyExportsRs || '-',
                'AA: Third Party Exports Us': row.annexureA?.thirdPartyExportsUs || '-',
                'AA: By Group Company': row.annexureA?.byGroupCompany || '-',
                'AA: Other RnD Services Or Royalty': row.annexureA?.otherRnDServicesOrRoyalty || '-',
                'AA: Total Rs': row.annexureA?.totalRs || '-',
                'AA: Total Us': row.annexureA?.totalUs || '-',
                
                // Common Data
                'Uploaded Date': formatDate(row.uploadedDate),
                'User Name': row.user.contactPersonName || 'Unknown',
                'Company Name': row.user.companyName || 'N/A',
                'User Email': row.user.email || 'N/A'
            }));

            const wb = XLSX.utils.book_new();
            const ws = XLSX.utils.json_to_sheet(excelData);

            // Set column widths for better readability
            const colWidths = Array(Object.keys(excelData[0] || {}).length).fill({ wch: 20 });
            ws['!cols'] = colWidths;

            XLSX.utils.book_append_sheet(wb, ws, 'Indirect Export Complete Report');

            const currentDate = new Date().toISOString().split('T')[0];
            const filename = `Indirect_Export_Complete_Report_${currentDate}.xlsx`;

            XLSX.writeFile(wb, filename);
            console.log('Excel file exported successfully with all fields');
        } catch (error) {
            console.error('Error exporting to Excel:', error);
            alert('Error exporting to Excel. Please try again.');
        }
    };

    // Render consolidated table (Excel-like format)
    const renderConsolidatedTable = () => (
        <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200 rounded-lg">
                <thead>
                    <tr>
                        <th className="px-3 py-3.5 text-left text-xs font-medium uppercase tracking-wider border-b-2 border-gray-200 bg-gray-50 text-gray-600 sticky top-0">Sr No</th>
                        <th className="px-3 py-3.5 text-left text-xs font-medium uppercase tracking-wider border-b-2 border-gray-200 bg-gray-50 text-gray-600 sticky top-0">Sources</th>
                        
                        {/* Basic Sheet Columns - ALL FIELDS */}
                        <th className="px-3 py-3.5 text-left text-xs font-medium uppercase tracking-wider border-b-2 border-gray-200 bg-green-50 text-green-700 sticky top-0">Company Name</th>
                        <th className="px-3 py-3.5 text-left text-xs font-medium uppercase tracking-wider border-b-2 border-gray-200 bg-green-50 text-green-700 sticky top-0">Shipping Bill No</th>
                        <th className="px-3 py-3.5 text-left text-xs font-medium uppercase tracking-wider border-b-2 border-gray-200 bg-green-50 text-green-700 sticky top-0">Shipping Bill Date</th>
                        <th className="px-3 py-3.5 text-left text-xs font-medium uppercase tracking-wider border-b-2 border-gray-200 bg-green-50 text-green-700 sticky top-0">Third Party Exporter</th>
                        <th className="px-3 py-3.5 text-left text-xs font-medium uppercase tracking-wider border-b-2 border-gray-200 bg-green-50 text-green-700 sticky top-0">HS Code</th>
                        <th className="px-3 py-3.5 text-left text-xs font-medium uppercase tracking-wider border-b-2 border-gray-200 bg-green-50 text-green-700 sticky top-0">EPCG Lic No</th>
                        <th className="px-3 py-3.5 text-left text-xs font-medium uppercase tracking-wider border-b-2 border-gray-200 bg-green-50 text-green-700 sticky top-0">CIF Value</th>
                        <th className="px-3 py-3.5 text-left text-xs font-medium uppercase tracking-wider border-b-2 border-gray-200 bg-green-50 text-green-700 sticky top-0">Freight</th>
                        <th className="px-3 py-3.5 text-left text-xs font-medium uppercase tracking-wider border-b-2 border-gray-200 bg-green-50 text-green-700 sticky top-0">Insurance</th>
                        <th className="px-3 py-3.5 text-left text-xs font-medium uppercase tracking-wider border-b-2 border-gray-200 bg-green-50 text-green-700 sticky top-0">BRC</th>
                        <th className="px-3 py-3.5 text-left text-xs font-medium uppercase tracking-wider border-b-2 border-gray-200 bg-green-50 text-green-700 sticky top-0">Exchange Rate</th>
                        <th className="px-3 py-3.5 text-left text-xs font-medium uppercase tracking-wider border-b-2 border-gray-200 bg-green-50 text-green-700 sticky top-0">CIF Value 2</th>
                        <th className="px-3 py-3.5 text-left text-xs font-medium uppercase tracking-wider border-b-2 border-gray-200 bg-green-50 text-green-700 sticky top-0">Freight 2</th>
                        <th className="px-3 py-3.5 text-left text-xs font-medium uppercase tracking-wider border-b-2 border-gray-200 bg-green-50 text-green-700 sticky top-0">Insurance 2</th>
                        <th className="px-3 py-3.5 text-left text-xs font-medium uppercase tracking-wider border-b-2 border-gray-200 bg-green-50 text-green-700 sticky top-0">BRC 2</th>
                        <th className="px-3 py-3.5 text-left text-xs font-medium uppercase tracking-wider border-b-2 border-gray-200 bg-green-50 text-green-700 sticky top-0">Exchange Rate 2</th>
                        <th className="px-3 py-3.5 text-left text-xs font-medium uppercase tracking-wider border-b-2 border-gray-200 bg-green-50 text-green-700 sticky top-0">Invoice No</th>
                        <th className="px-3 py-3.5 text-left text-xs font-medium uppercase tracking-wider border-b-2 border-gray-200 bg-green-50 text-green-700 sticky top-0">Invoice Date</th>
                        <th className="px-3 py-3.5 text-left text-xs font-medium uppercase tracking-wider border-b-2 border-gray-200 bg-green-50 text-green-700 sticky top-0">Basic Amount</th>
                        <th className="px-3 py-3.5 text-left text-xs font-medium uppercase tracking-wider border-b-2 border-gray-200 bg-green-50 text-green-700 sticky top-0">Invoice Value</th>
                        <th className="px-3 py-3.5 text-left text-xs font-medium uppercase tracking-wider border-b-2 border-gray-200 bg-green-50 text-green-700 sticky top-0">Bank Payment Date</th>
                        <th className="px-3 py-3.5 text-left text-xs font-medium uppercase tracking-wider border-b-2 border-gray-200 bg-green-50 text-green-700 sticky top-0">Amount Received</th>
                        <th className="px-3 py-3.5 text-left text-xs font-medium uppercase tracking-wider border-b-2 border-gray-200 bg-green-50 text-green-700 sticky top-0">Amount Realised</th>
                        <th className="px-3 py-3.5 text-left text-xs font-medium uppercase tracking-wider border-b-2 border-gray-200 bg-green-50 text-green-700 sticky top-0">Qty Match</th>
                        <th className="px-3 py-3.5 text-left text-xs font-medium uppercase tracking-wider border-b-2 border-gray-200 bg-green-50 text-green-700 sticky top-0">EPCG Tax Invoice</th>
                        <th className="px-3 py-3.5 text-left text-xs font-medium uppercase tracking-wider border-b-2 border-gray-200 bg-green-50 text-green-700 sticky top-0">Lorry Receipt</th>
                        <th className="px-3 py-3.5 text-left text-xs font-medium uppercase tracking-wider border-b-2 border-gray-200 bg-green-50 text-green-700 sticky top-0">Bank Statement</th>
                        <th className="px-3 py-3.5 text-left text-xs font-medium uppercase tracking-wider border-b-2 border-gray-200 bg-green-50 text-green-700 sticky top-0">Product</th>
                        <th className="px-3 py-3.5 text-left text-xs font-medium uppercase tracking-wider border-b-2 border-gray-200 bg-green-50 text-green-700 sticky top-0">Remarks</th>
                        
                        {/* Annexure1 Columns - ALL FIELDS */}
                        <th className="px-3 py-3.5 text-left text-xs font-medium uppercase tracking-wider border-b-2 border-gray-200 bg-blue-50 text-blue-700 sticky top-0">A1: Shipping Bill No</th>
                        <th className="px-3 py-3.5 text-left text-xs font-medium uppercase tracking-wider border-b-2 border-gray-200 bg-blue-50 text-blue-700 sticky top-0">A1: Shipping Bill Date</th>
                        <th className="px-3 py-3.5 text-left text-xs font-medium uppercase tracking-wider border-b-2 border-gray-200 bg-blue-50 text-blue-700 sticky top-0">A1: CIF Value</th>
                        <th className="px-3 py-3.5 text-left text-xs font-medium uppercase tracking-wider border-b-2 border-gray-200 bg-blue-50 text-blue-700 sticky top-0">A1: BRC Value</th>
                        <th className="px-3 py-3.5 text-left text-xs font-medium uppercase tracking-wider border-b-2 border-gray-200 bg-blue-50 text-blue-700 sticky top-0">A1: Lower SB & BRC</th>
                        <th className="px-3 py-3.5 text-left text-xs font-medium uppercase tracking-wider border-b-2 border-gray-200 bg-blue-50 text-blue-700 sticky top-0">A1: Freight</th>
                        <th className="px-3 py-3.5 text-left text-xs font-medium uppercase tracking-wider border-b-2 border-gray-200 bg-blue-50 text-blue-700 sticky top-0">A1: Insurance</th>
                        <th className="px-3 py-3.5 text-left text-xs font-medium uppercase tracking-wider border-b-2 border-gray-200 bg-blue-50 text-blue-700 sticky top-0">A1: FOB Value (USD)</th>
                        <th className="px-3 py-3.5 text-left text-xs font-medium uppercase tracking-wider border-b-2 border-gray-200 bg-blue-50 text-blue-700 sticky top-0">A1: Exchange Rate</th>
                        <th className="px-3 py-3.5 text-left text-xs font-medium uppercase tracking-wider border-b-2 border-gray-200 bg-blue-50 text-blue-700 sticky top-0">A1: FOB Value (INR)</th>
                        
                        {/* Annexure2 Columns - ALL FIELDS */}
                        <th className="px-3 py-3.5 text-left text-xs font-medium uppercase tracking-wider border-b-2 border-gray-200 bg-purple-50 text-purple-700 sticky top-0">A2: Shipping Bill No</th>
                        <th className="px-3 py-3.5 text-left text-xs font-medium uppercase tracking-wider border-b-2 border-gray-200 bg-purple-50 text-purple-700 sticky top-0">A2: Shipping Bill Date</th>
                        <th className="px-3 py-3.5 text-left text-xs font-medium uppercase tracking-wider border-b-2 border-gray-200 bg-purple-50 text-purple-700 sticky top-0">A2: Tax Invoice No</th>
                        <th className="px-3 py-3.5 text-left text-xs font-medium uppercase tracking-wider border-b-2 border-gray-200 bg-purple-50 text-purple-700 sticky top-0">A2: Tax Invoice Date</th>
                        <th className="px-3 py-3.5 text-left text-xs font-medium uppercase tracking-wider border-b-2 border-gray-200 bg-purple-50 text-purple-700 sticky top-0">A2: Basic Amount</th>
                        <th className="px-3 py-3.5 text-left text-xs font-medium uppercase tracking-wider border-b-2 border-gray-200 bg-purple-50 text-purple-700 sticky top-0">A2: Tax</th>
                        <th className="px-3 py-3.5 text-left text-xs font-medium uppercase tracking-wider border-b-2 border-gray-200 bg-purple-50 text-purple-700 sticky top-0">A2: Invoice Value</th>
                        <th className="px-3 py-3.5 text-left text-xs font-medium uppercase tracking-wider border-b-2 border-gray-200 bg-purple-50 text-purple-700 sticky top-0">A2: Payment Date</th>
                        <th className="px-3 py-3.5 text-left text-xs font-medium uppercase tracking-wider border-b-2 border-gray-200 bg-purple-50 text-purple-700 sticky top-0">A2: Amount Received</th>
                        <th className="px-3 py-3.5 text-left text-xs font-medium uppercase tracking-wider border-b-2 border-gray-200 bg-purple-50 text-purple-700 sticky top-0">A2: Amount Realised</th>
                        <th className="px-3 py-3.5 text-left text-xs font-medium uppercase tracking-wider border-b-2 border-gray-200 bg-purple-50 text-purple-700 sticky top-0">A2: Lower Invoice & Bank</th>
                        <th className="px-3 py-3.5 text-left text-xs font-medium uppercase tracking-wider border-b-2 border-gray-200 bg-purple-50 text-purple-700 sticky top-0">A2: Proportionate Amount</th>
                        <th className="px-3 py-3.5 text-left text-xs font-medium uppercase tracking-wider border-b-2 border-gray-200 bg-purple-50 text-purple-700 sticky top-0">A2: Exchange Rate</th>
                        <th className="px-3 py-3.5 text-left text-xs font-medium uppercase tracking-wider border-b-2 border-gray-200 bg-purple-50 text-purple-700 sticky top-0">A2: For In USD</th>
                        
                        {/* Calculation Sheet Columns - ALL FIELDS */}
                        <th className="px-3 py-3.5 text-left text-xs font-medium uppercase tracking-wider border-b-2 border-gray-200 bg-orange-50 text-orange-700 sticky top-0">CS: Product/Service</th>
                        <th className="px-3 py-3.5 text-left text-xs font-medium uppercase tracking-wider border-b-2 border-gray-200 bg-orange-50 text-orange-700 sticky top-0">CS: Shipping Bill No</th>
                        <th className="px-3 py-3.5 text-left text-xs font-medium uppercase tracking-wider border-b-2 border-gray-200 bg-orange-50 text-orange-700 sticky top-0">CS: Shipping Bill Date</th>
                        <th className="px-3 py-3.5 text-left text-xs font-medium uppercase tracking-wider border-b-2 border-gray-200 bg-orange-50 text-orange-700 sticky top-0">CS: FOB Proceeds (Rs)</th>
                        <th className="px-3 py-3.5 text-left text-xs font-medium uppercase tracking-wider border-b-2 border-gray-200 bg-orange-50 text-orange-700 sticky top-0">CS: FOB Proceeds (USD)</th>
                        <th className="px-3 py-3.5 text-left text-xs font-medium uppercase tracking-wider border-b-2 border-gray-200 bg-orange-50 text-orange-700 sticky top-0">CS: FOB Annexure1 (Rs)</th>
                        <th className="px-3 py-3.5 text-left text-xs font-medium uppercase tracking-wider border-b-2 border-gray-200 bg-orange-50 text-orange-700 sticky top-0">CS: FOB Annexure1 (USD)</th>
                        <th className="px-3 py-3.5 text-left text-xs font-medium uppercase tracking-wider border-b-2 border-gray-200 bg-orange-50 text-orange-700 sticky top-0">CS: FOB Annexure2 (Rs)</th>
                        <th className="px-3 py-3.5 text-left text-xs font-medium uppercase tracking-wider border-b-2 border-gray-200 bg-orange-50 text-orange-700 sticky top-0">CS: FOB Annexure2 (USD)</th>
                        <th className="px-3 py-3.5 text-left text-xs font-medium uppercase tracking-wider border-b-2 border-gray-200 bg-orange-50 text-orange-700 sticky top-0">CS: FOB Lower Value (Rs)</th>
                        <th className="px-3 py-3.5 text-left text-xs font-medium uppercase tracking-wider border-b-2 border-gray-200 bg-orange-50 text-orange-700 sticky top-0">CS: FOB Lower Value (USD)</th>
                        
                        {/* New Dept Sheet Columns - ALL FIELDS */}
                        <th className="px-3 py-3.5 text-left text-xs font-medium uppercase tracking-wider border-b-2 border-gray-200 bg-teal-50 text-teal-700 sticky top-0">NDS: Shipping Bill No</th>
                        <th className="px-3 py-3.5 text-left text-xs font-medium uppercase tracking-wider border-b-2 border-gray-200 bg-teal-50 text-teal-700 sticky top-0">NDS: Shipping Bill Date</th>
                        <th className="px-3 py-3.5 text-left text-xs font-medium uppercase tracking-wider border-b-2 border-gray-200 bg-teal-50 text-teal-700 sticky top-0">NDS: Invoice No</th>
                        <th className="px-3 py-3.5 text-left text-xs font-medium uppercase tracking-wider border-b-2 border-gray-200 bg-teal-50 text-teal-700 sticky top-0">NDS: Invoice Date</th>
                        <th className="px-3 py-3.5 text-left text-xs font-medium uppercase tracking-wider border-b-2 border-gray-200 bg-teal-50 text-teal-700 sticky top-0">NDS: BRC Amount (USD)</th>
                        <th className="px-3 py-3.5 text-left text-xs font-medium uppercase tracking-wider border-b-2 border-gray-200 bg-teal-50 text-teal-700 sticky top-0">NDS: BRC Exchange Rate</th>
                        <th className="px-3 py-3.5 text-left text-xs font-medium uppercase tracking-wider border-b-2 border-gray-200 bg-teal-50 text-teal-700 sticky top-0">NDS: BRC Amount (Rs)</th>
                        <th className="px-3 py-3.5 text-left text-xs font-medium uppercase tracking-wider border-b-2 border-gray-200 bg-teal-50 text-teal-700 sticky top-0">NDS: Bank Amount (Rs)</th>
                        <th className="px-3 py-3.5 text-left text-xs font-medium uppercase tracking-wider border-b-2 border-gray-200 bg-teal-50 text-teal-700 sticky top-0">NDS: Amount Less Col6&7</th>
                        <th className="px-3 py-3.5 text-left text-xs font-medium uppercase tracking-wider border-b-2 border-gray-200 bg-teal-50 text-teal-700 sticky top-0">NDS: Converted USD</th>
                        
                        {/* AnnexureA Columns - ALL FIELDS */}
                        <th className="px-3 py-3.5 text-left text-xs font-medium uppercase tracking-wider border-b-2 border-gray-200 bg-indigo-50 text-indigo-700 sticky top-0">AA: Product/Service</th>
                        <th className="px-3 py-3.5 text-left text-xs font-medium uppercase tracking-wider border-b-2 border-gray-200 bg-indigo-50 text-indigo-700 sticky top-0">AA: Shipping Bill No</th>
                        <th className="px-3 py-3.5 text-left text-xs font-medium uppercase tracking-wider border-b-2 border-gray-200 bg-indigo-50 text-indigo-700 sticky top-0">AA: Shipping Bill Date</th>
                        <th className="px-3 py-3.5 text-left text-xs font-medium uppercase tracking-wider border-b-2 border-gray-200 bg-indigo-50 text-indigo-700 sticky top-0">AA: Direct Exports (Rs)</th>
                        <th className="px-3 py-3.5 text-left text-xs font-medium uppercase tracking-wider border-b-2 border-gray-200 bg-indigo-50 text-indigo-700 sticky top-0">AA: Direct Exports (USD)</th>
                        <th className="px-3 py-3.5 text-left text-xs font-medium uppercase tracking-wider border-b-2 border-gray-200 bg-indigo-50 text-indigo-700 sticky top-0">AA: Deemed Exports</th>
                        <th className="px-3 py-3.5 text-left text-xs font-medium uppercase tracking-wider border-b-2 border-gray-200 bg-indigo-50 text-indigo-700 sticky top-0">AA: Third Party (Rs)</th>
                        <th className="px-3 py-3.5 text-left text-xs font-medium uppercase tracking-wider border-b-2 border-gray-200 bg-indigo-50 text-indigo-700 sticky top-0">AA: Third Party (USD)</th>
                        <th className="px-3 py-3.5 text-left text-xs font-medium uppercase tracking-wider border-b-2 border-gray-200 bg-indigo-50 text-indigo-700 sticky top-0">AA: By Group Company</th>
                        <th className="px-3 py-3.5 text-left text-xs font-medium uppercase tracking-wider border-b-2 border-gray-200 bg-indigo-50 text-indigo-700 sticky top-0">AA: Other RnD/Royalty</th>
                        <th className="px-3 py-3.5 text-left text-xs font-medium uppercase tracking-wider border-b-2 border-gray-200 bg-indigo-50 text-indigo-700 sticky top-0">AA: Total (Rs)</th>
                        <th className="px-3 py-3.5 text-left text-xs font-medium uppercase tracking-wider border-b-2 border-gray-200 bg-indigo-50 text-indigo-700 sticky top-0">AA: Total (USD)</th>
                        
                        <th className="px-3 py-3.5 text-left text-xs font-medium uppercase tracking-wider border-b-2 border-gray-200 bg-gray-50 text-gray-600 sticky top-0">Uploaded Date</th>
                        <th className="px-3 py-3.5 text-left text-xs font-medium uppercase tracking-wider border-b-2 border-gray-200 bg-gray-50 text-gray-600 sticky top-0">User</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                    {consolidatedData.map((row, index) => (
                        <tr key={`${row.srNo}-${index}`} className={index % 2 === 0 ? "bg-white hover:bg-gray-50" : "bg-gray-50 hover:bg-gray-100"} style={{transition: "all 0.2s"}}>
                            <td className="px-3 py-3 text-sm font-medium text-green-600 border-r border-gray-100">{row.srNo}</td>
                            <td className="px-3 py-3 border-r border-gray-100">
                                <div className="flex space-x-1">
                                    {getDataSourceBadge(row).map(source => {
                                        let badgeClass = "";
                                        if (source === "BS") {
                                            badgeClass = "bg-green-100 text-green-800";
                                        } else if (source === "A1") {
                                            badgeClass = "bg-blue-100 text-blue-800";
                                        } else if (source === "A2") {
                                            badgeClass = "bg-purple-100 text-purple-800";
                                        } else if (source === "CS") {
                                            badgeClass = "bg-orange-100 text-orange-800";
                                        } else if (source === "NDS") {
                                            badgeClass = "bg-teal-100 text-teal-800";
                                        } else if (source === "AA") {
                                            badgeClass = "bg-indigo-100 text-indigo-800";
                                        }
                                        return (
                                            <span key={source} className={`inline-block text-xs px-2 py-1 rounded-md font-medium ${badgeClass}`}>
                                                {source}
                                            </span>
                                        );
                                    })}
                                </div>
                            </td>
                            
                            {/* Basic Sheet Data - ALL FIELDS */}
                            <td className="px-3 py-3 text-sm text-gray-900 border-r border-gray-100 bg-green-25">{row.basicSheet?.companyName || '-'}</td>
                            <td className="px-3 py-3 text-sm text-gray-900 border-r border-gray-100 bg-green-25">{row.basicSheet?.shippingBillNo || '-'}</td>
                            <td className="px-3 py-3 text-sm text-gray-900 border-r border-gray-100 bg-green-25">
                                {row.basicSheet?.shippingBillDate ? formatDate(row.basicSheet.shippingBillDate) : '-'}
                            </td>
                            <td className="px-3 py-3 text-sm text-gray-900 border-r border-gray-100 bg-green-25">{row.basicSheet?.thirdPartyExporter || '-'}</td>
                            <td className="px-3 py-3 text-sm text-gray-900 border-r border-gray-100 bg-green-25">{row.basicSheet?.hsCodeAndDescription || '-'}</td>
                            <td className="px-3 py-3 text-sm text-gray-900 border-r border-gray-100 bg-green-25">{row.basicSheet?.epcgLicNo || '-'}</td>
                            <td className="px-3 py-3 text-sm font-medium text-green-600 border-r border-gray-100 bg-green-25">{row.basicSheet?.cifValue ? formatCurrency(row.basicSheet.cifValue) : '-'}</td>
                            <td className="px-3 py-3 text-sm font-medium text-green-600 border-r border-gray-100 bg-green-25">{row.basicSheet?.freight ? formatCurrency(row.basicSheet.freight) : '-'}</td>
                            <td className="px-3 py-3 text-sm font-medium text-green-600 border-r border-gray-100 bg-green-25">{row.basicSheet?.insurance ? formatCurrency(row.basicSheet.insurance) : '-'}</td>
                            <td className="px-3 py-3 text-sm font-medium text-green-600 border-r border-gray-100 bg-green-25">{row.basicSheet?.brc ? formatCurrency(row.basicSheet.brc) : '-'}</td>
                            <td className="px-3 py-3 text-sm text-gray-900 border-r border-gray-100 bg-green-25">{row.basicSheet?.exchangeRate ? formatRate(row.basicSheet.exchangeRate) : '-'}</td>
                            <td className="px-3 py-3 text-sm font-medium text-green-600 border-r border-gray-100 bg-green-25">{row.basicSheet?.cifValue2 ? formatCurrency(row.basicSheet.cifValue2) : '-'}</td>
                            <td className="px-3 py-3 text-sm font-medium text-green-600 border-r border-gray-100 bg-green-25">{row.basicSheet?.freight2 ? formatCurrency(row.basicSheet.freight2) : '-'}</td>
                            <td className="px-3 py-3 text-sm font-medium text-green-600 border-r border-gray-100 bg-green-25">{row.basicSheet?.insurance2 ? formatCurrency(row.basicSheet.insurance2) : '-'}</td>
                            <td className="px-3 py-3 text-sm font-medium text-green-600 border-r border-gray-100 bg-green-25">{row.basicSheet?.brc2 ? formatCurrency(row.basicSheet.brc2) : '-'}</td>
                            <td className="px-3 py-3 text-sm text-gray-900 border-r border-gray-100 bg-green-25">{row.basicSheet?.exchangeRate2 ? formatRate(row.basicSheet.exchangeRate2) : '-'}</td>
                            <td className="px-3 py-3 text-sm text-gray-900 border-r border-gray-100 bg-green-25">{row.basicSheet?.invoiceNo || '-'}</td>
                            <td className="px-3 py-3 text-sm text-gray-900 border-r border-gray-100 bg-green-25">{row.basicSheet?.invoiceDate ? formatDate(row.basicSheet.invoiceDate) : '-'}</td>
                            <td className="px-3 py-3 text-sm font-medium text-green-600 border-r border-gray-100 bg-green-25">{row.basicSheet?.basicAmount ? formatCurrency(row.basicSheet.basicAmount) : '-'}</td>
                            <td className="px-3 py-3 text-sm font-medium text-green-600 border-r border-gray-100 bg-green-25">{row.basicSheet?.invoiceValue ? formatCurrency(row.basicSheet.invoiceValue) : '-'}</td>
                            <td className="px-3 py-3 text-sm text-gray-900 border-r border-gray-100 bg-green-25">{row.basicSheet?.bankPaymentReceivedDate ? formatDate(row.basicSheet.bankPaymentReceivedDate) : '-'}</td>
                            <td className="px-3 py-3 text-sm font-medium text-green-600 border-r border-gray-100 bg-green-25">{row.basicSheet?.amountReceived ? formatCurrency(row.basicSheet.amountReceived) : '-'}</td>
                            <td className="px-3 py-3 text-sm font-medium text-green-600 border-r border-gray-100 bg-green-25">{row.basicSheet?.amountRealised ? formatCurrency(row.basicSheet.amountRealised) : '-'}</td>
                            <td className="px-3 py-3 text-sm text-gray-900 border-r border-gray-100 bg-green-25">{row.basicSheet?.qtyAsPerInvoiceAndSbMatch || '-'}</td>
                            <td className="px-3 py-3 text-sm text-gray-900 border-r border-gray-100 bg-green-25">{row.basicSheet?.epcgLicNoInTaxInvoice || '-'}</td>
                            <td className="px-3 py-3 text-sm text-gray-900 border-r border-gray-100 bg-green-25">{row.basicSheet?.lorryReceiptOrEwayBill || '-'}</td>
                            <td className="px-3 py-3 text-sm text-gray-900 border-r border-gray-100 bg-green-25">{row.basicSheet?.bankStatement || '-'}</td>
                            <td className="px-3 py-3 text-sm text-gray-900 border-r border-gray-100 bg-green-25">{row.basicSheet?.product || '-'}</td>
                            <td className="px-3 py-3 text-sm text-gray-900 border-r border-gray-100 bg-green-25">{row.basicSheet?.remarks || '-'}</td>
                            
                            {/* Annexure1 Data - ALL FIELDS */}
                            <td className="px-3 py-3 text-sm text-gray-900 border-r border-gray-100 bg-blue-25">{row.annexure1?.shippingBillNo || '-'}</td>
                            <td className="px-3 py-3 text-sm text-gray-900 border-r border-gray-100 bg-blue-25">
                                {row.annexure1?.shippingBillDate ? formatDate(row.annexure1.shippingBillDate) : '-'}
                            </td>
                            <td className="px-3 py-3 text-sm font-medium text-blue-600 border-r border-gray-100 bg-blue-25">
                                {row.annexure1?.shippingBillCifValue ? formatCurrency(row.annexure1.shippingBillCifValue) : '-'}
                            </td>
                            <td className="px-3 py-3 text-sm font-medium text-blue-600 border-r border-gray-100 bg-blue-25">
                                {row.annexure1?.brcValue ? formatCurrency(row.annexure1.brcValue) : '-'}
                            </td>
                            <td className="px-3 py-3 text-sm font-medium text-blue-600 border-r border-gray-100 bg-blue-25">
                                {row.annexure1?.lowerOfSbAndBrc ? formatCurrency(row.annexure1.lowerOfSbAndBrc) : '-'}
                            </td>
                            <td className="px-3 py-3 text-sm font-medium text-blue-600 border-r border-gray-100 bg-blue-25">
                                {row.annexure1?.shippingBillFreight ? formatCurrency(row.annexure1.shippingBillFreight) : '-'}
                            </td>
                            <td className="px-3 py-3 text-sm font-medium text-blue-600 border-r border-gray-100 bg-blue-25">
                                {row.annexure1?.shippingBillInsurance ? formatCurrency(row.annexure1.shippingBillInsurance) : '-'}
                            </td>
                            <td className="px-3 py-3 text-sm font-medium text-blue-600 border-r border-gray-100 bg-blue-25">
                                {row.annexure1?.fobValueInDollars ? formatUSDCurrency(row.annexure1.fobValueInDollars) : '-'}
                            </td>
                            <td className="px-3 py-3 text-sm text-gray-900 border-r border-gray-100 bg-blue-25">
                                {row.annexure1?.exchangeRatePerShippingBill ? formatRate(row.annexure1.exchangeRatePerShippingBill) : '-'}
                            </td>
                            <td className="px-3 py-3 text-sm font-medium text-blue-600 border-r border-gray-100 bg-blue-25">
                                {row.annexure1?.fobValueInRupees ? formatCurrency(row.annexure1.fobValueInRupees) : '-'}
                            </td>
                            
                            {/* Annexure2 Data - ALL FIELDS */}
                            <td className="px-3 py-3 text-sm text-gray-900 border-r border-gray-100 bg-purple-25">{row.annexure2?.shippingBillNo || '-'}</td>
                            <td className="px-3 py-3 text-sm text-gray-900 border-r border-gray-100 bg-purple-25">
                                {row.annexure2?.shippingBillDate ? formatDate(row.annexure2.shippingBillDate) : '-'}
                            </td>
                            <td className="px-3 py-3 text-sm text-gray-900 border-r border-gray-100 bg-purple-25">{row.annexure2?.taxInvoiceBillNo || '-'}</td>
                            <td className="px-3 py-3 text-sm text-gray-900 border-r border-gray-100 bg-purple-25">{row.annexure2?.taxInvoiceDate ? formatDate(row.annexure2.taxInvoiceDate) : '-'}</td>
                            <td className="px-3 py-3 text-sm font-medium text-purple-600 border-r border-gray-100 bg-purple-25">
                                {row.annexure2?.taxInvoiceBasicAmount ? formatCurrency(row.annexure2.taxInvoiceBasicAmount) : '-'}
                            </td>
                            <td className="px-3 py-3 text-sm font-medium text-purple-600 border-r border-gray-100 bg-purple-25">
                                {row.annexure2?.taxInvoiceTax ? formatCurrency(row.annexure2.taxInvoiceTax) : '-'}
                            </td>
                            <td className="px-3 py-3 text-sm font-medium text-purple-600 border-r border-gray-100 bg-purple-25">
                                {row.annexure2?.taxInvoiceInvoiceValue ? formatCurrency(row.annexure2.taxInvoiceInvoiceValue) : '-'}
                            </td>
                            <td className="px-3 py-3 text-sm text-gray-900 border-r border-gray-100 bg-purple-25">
                                {row.annexure2?.paymentDetailsDate ? formatDate(row.annexure2.paymentDetailsDate) : '-'}
                            </td>
                            <td className="px-3 py-3 text-sm font-medium text-purple-600 border-r border-gray-100 bg-purple-25">
                                {row.annexure2?.paymentDetailsAmountReceived ? formatCurrency(row.annexure2.paymentDetailsAmountReceived) : '-'}
                            </td>
                            <td className="px-3 py-3 text-sm font-medium text-purple-600 border-r border-gray-100 bg-purple-25">
                                {row.annexure2?.paymentDetailsAmountRealised ? formatCurrency(row.annexure2.paymentDetailsAmountRealised) : '-'}
                            </td>
                            <td className="px-3 py-3 text-sm font-medium text-purple-600 border-r border-gray-100 bg-purple-25">
                                {row.annexure2?.lowerOfInvoiceAndBankStatement ? formatCurrency(row.annexure2.lowerOfInvoiceAndBankStatement) : '-'}
                            </td>
                            <td className="px-3 py-3 text-sm font-medium text-purple-600 border-r border-gray-100 bg-purple-25">
                                {row.annexure2?.proportionateAmountOf6ForInRs ? formatCurrency(row.annexure2.proportionateAmountOf6ForInRs) : '-'}
                            </td>
                            <td className="px-3 py-3 text-sm text-gray-900 border-r border-gray-100 bg-purple-25">
                                {row.annexure2?.exchangeRatePerShippingBill ? formatRate(row.annexure2.exchangeRatePerShippingBill) : '-'}
                            </td>
                            <td className="px-3 py-3 text-sm font-medium text-purple-600 border-r border-gray-100 bg-purple-25">
                                {row.annexure2?.forInUsd ? formatUSDCurrency(row.annexure2.forInUsd) : '-'}
                            </td>
                            
                            {/* Calculation Sheet Data - ALL FIELDS */}
                            <td className="px-3 py-3 text-sm text-gray-900 border-r border-gray-100 bg-orange-25">{row.calculationSheet?.sameProductOrAlternativeProductService || '-'}</td>
                            <td className="px-3 py-3 text-sm text-gray-900 border-r border-gray-100 bg-orange-25">{row.calculationSheet?.shippingBillNo || '-'}</td>
                            <td className="px-3 py-3 text-sm text-gray-900 border-r border-gray-100 bg-orange-25">
                                {row.calculationSheet?.shippingBillDate ? formatDate(row.calculationSheet.shippingBillDate) : '-'}
                            </td>
                            <td className="px-3 py-3 text-sm font-medium text-orange-600 border-r border-gray-100 bg-orange-25">
                                {row.calculationSheet?.fobValueRealizationProceedsRs ? formatCurrency(row.calculationSheet.fobValueRealizationProceedsRs) : '-'}
                            </td>
                            <td className="px-3 py-3 text-sm font-medium text-orange-600 border-r border-gray-100 bg-orange-25">
                                {row.calculationSheet?.fobValueRealizationProceedsUs ? formatUSDCurrency(row.calculationSheet.fobValueRealizationProceedsUs) : '-'}
                            </td>
                            <td className="px-3 py-3 text-sm font-medium text-orange-600 border-r border-gray-100 bg-orange-25">
                                {row.calculationSheet?.fobValueAnnexure1Rs ? formatCurrency(row.calculationSheet.fobValueAnnexure1Rs) : '-'}
                            </td>
                            <td className="px-3 py-3 text-sm font-medium text-orange-600 border-r border-gray-100 bg-orange-25">
                                {row.calculationSheet?.fobValueAnnexure1Us ? formatUSDCurrency(row.calculationSheet.fobValueAnnexure1Us) : '-'}
                            </td>
                            <td className="px-3 py-3 text-sm font-medium text-orange-600 border-r border-gray-100 bg-orange-25">
                                {row.calculationSheet?.fobValueAnnexure2Rs ? formatCurrency(row.calculationSheet.fobValueAnnexure2Rs) : '-'}
                            </td>
                            <td className="px-3 py-3 text-sm font-medium text-orange-600 border-r border-gray-100 bg-orange-25">
                                {row.calculationSheet?.fobValueAnnexure2Us ? formatUSDCurrency(row.calculationSheet.fobValueAnnexure2Us) : '-'}
                            </td>
                            <td className="px-3 py-3 text-sm font-medium text-orange-600 border-r border-gray-100 bg-orange-25">
                                {row.calculationSheet?.fobValueLowerOf5_6_7Rs ? formatCurrency(row.calculationSheet.fobValueLowerOf5_6_7Rs) : '-'}
                            </td>
                            <td className="px-3 py-3 text-sm font-medium text-orange-600 border-r border-gray-100 bg-orange-25">
                                {row.calculationSheet?.fobValueLowerOf5_6_7Us ? formatUSDCurrency(row.calculationSheet.fobValueLowerOf5_6_7Us) : '-'}
                            </td>
                            
                            {/* New Dept Sheet Data - ALL FIELDS */}
                            <td className="px-3 py-3 text-sm text-gray-900 border-r border-gray-100 bg-teal-25">{row.newDeptSheet?.shippingBillNo || '-'}</td>
                            <td className="px-3 py-3 text-sm text-gray-900 border-r border-gray-100 bg-teal-25">
                                {row.newDeptSheet?.shippingBillDate ? formatDate(row.newDeptSheet.shippingBillDate) : '-'}
                            </td>
                            <td className="px-3 py-3 text-sm text-gray-900 border-r border-gray-100 bg-teal-25">{row.newDeptSheet?.invoiceNo || '-'}</td>
                            <td className="px-3 py-3 text-sm text-gray-900 border-r border-gray-100 bg-teal-25">
                                {row.newDeptSheet?.invoiceDate ? formatDate(row.newDeptSheet.invoiceDate) : '-'}
                            </td>
                            <td className="px-3 py-3 text-sm font-medium text-teal-600 border-r border-gray-100 bg-teal-25">
                                {row.newDeptSheet?.amountRealisedAsPerBrcUs ? formatUSDCurrency(row.newDeptSheet.amountRealisedAsPerBrcUs) : '-'}
                            </td>
                            <td className="px-3 py-3 text-sm text-gray-900 border-r border-gray-100 bg-teal-25">
                                {row.newDeptSheet?.amountRealisedAsPerBrcExchRate ? formatRate(row.newDeptSheet.amountRealisedAsPerBrcExchRate) : '-'}
                            </td>
                            <td className="px-3 py-3 text-sm font-medium text-teal-600 border-r border-gray-100 bg-teal-25">
                                {row.newDeptSheet?.amountRealisedAsPerBrcRs ? formatCurrency(row.newDeptSheet.amountRealisedAsPerBrcRs) : '-'}
                            </td>
                            <td className="px-3 py-3 text-sm font-medium text-teal-600 border-r border-gray-100 bg-teal-25">
                                {row.newDeptSheet?.amountRealisedInBankRs ? formatCurrency(row.newDeptSheet.amountRealisedInBankRs) : '-'}
                            </td>
                            <td className="px-3 py-3 text-sm font-medium text-teal-600 border-r border-gray-100 bg-teal-25">
                                {row.newDeptSheet?.amountLessOfCol6And7Rs ? formatCurrency(row.newDeptSheet.amountLessOfCol6And7Rs) : '-'}
                            </td>
                            <td className="px-3 py-3 text-sm font-medium text-teal-600 border-r border-gray-100 bg-teal-25">
                                {row.newDeptSheet?.convertedIntoUsd ? formatUSDCurrency(row.newDeptSheet.convertedIntoUsd) : '-'}
                            </td>
                            
                            {/* AnnexureA Data - ALL FIELDS */}
                            <td className="px-3 py-3 text-sm text-gray-900 border-r border-gray-100 bg-indigo-25">{row.annexureA?.sameProductOrService || '-'}</td>
                            <td className="px-3 py-3 text-sm text-gray-900 border-r border-gray-100 bg-indigo-25">{row.annexureA?.shippingBillNo || '-'}</td>
                            <td className="px-3 py-3 text-sm text-gray-900 border-r border-gray-100 bg-indigo-25">
                                {row.annexureA?.shippingBillDate ? formatDate(row.annexureA.shippingBillDate) : '-'}
                            </td>
                            <td className="px-3 py-3 text-sm font-medium text-indigo-600 border-r border-gray-100 bg-indigo-25">
                                {row.annexureA?.directExportsRs ? formatCurrency(row.annexureA.directExportsRs) : '-'}
                            </td>
                            <td className="px-3 py-3 text-sm font-medium text-indigo-600 border-r border-gray-100 bg-indigo-25">
                                {row.annexureA?.directExportsUs ? formatUSDCurrency(row.annexureA.directExportsUs) : '-'}
                            </td>
                            <td className="px-3 py-3 text-sm font-medium text-indigo-600 border-r border-gray-100 bg-indigo-25">
                                {row.annexureA?.deemedExports ? formatCurrency(row.annexureA.deemedExports) : '-'}
                            </td>
                            <td className="px-3 py-3 text-sm font-medium text-indigo-600 border-r border-gray-100 bg-indigo-25">
                                {row.annexureA?.thirdPartyExportsRs ? formatCurrency(row.annexureA.thirdPartyExportsRs) : '-'}
                            </td>
                            <td className="px-3 py-3 text-sm font-medium text-indigo-600 border-r border-gray-100 bg-indigo-25">
                                {row.annexureA?.thirdPartyExportsUs ? formatUSDCurrency(row.annexureA.thirdPartyExportsUs) : '-'}
                            </td>
                            <td className="px-3 py-3 text-sm font-medium text-indigo-600 border-r border-gray-100 bg-indigo-25">
                                {row.annexureA?.byGroupCompany ? formatCurrency(row.annexureA.byGroupCompany) : '-'}
                            </td>
                            <td className="px-3 py-3 text-sm font-medium text-indigo-600 border-r border-gray-100 bg-indigo-25">
                                {row.annexureA?.otherRnDServicesOrRoyalty ? formatCurrency(row.annexureA.otherRnDServicesOrRoyalty) : '-'}
                            </td>
                            <td className="px-3 py-3 text-sm font-medium text-indigo-600 border-r border-gray-100 bg-indigo-25">
                                {row.annexureA?.totalRs ? formatCurrency(row.annexureA.totalRs) : '-'}
                            </td>
                            <td className="px-3 py-3 text-sm font-medium text-indigo-600 border-r border-gray-100 bg-indigo-25">
                                {row.annexureA?.totalUs ? formatUSDCurrency(row.annexureA.totalUs) : '-'}
                            </td>
                            
                            {/* Common Data */}
                            <td className="px-3 py-3 text-sm text-gray-700 border-r border-gray-100">
                                {formatDate(row.uploadedDate)}
                            </td>
                            <td className="px-3 py-3 text-sm text-gray-700">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0 h-8 w-8 bg-green-100 rounded-full flex items-center justify-center">
                                        <span className="text-green-700 font-bold text-sm">{row.user.contactPersonName?.charAt(0) || 'U'}</span>
                                    </div>
                                    <div className="ml-3">
                                        <p className="text-sm font-medium text-gray-700">{row.user.contactPersonName || 'Unknown'}</p>
                                        <p className="text-xs text-gray-500">{row.user.companyName || 'N/A'}</p>
                                    </div>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );

    // Initial data load
    useEffect(() => {
        fetchData();
    }, [fetchData]);

    // Error state
    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6 flex items-center justify-center">
                <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center border border-gray-200">
                    <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
                        <FontAwesomeIcon icon={faExclamationTriangle} className="text-4xl text-green-500" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Error Loading Data</h2>
                    <p className="text-gray-600 mb-6 bg-gray-50 p-3 rounded-lg">{error}</p>
                    <button
                        onClick={() => fetchData(1, searchTerm, false)}
                        className="bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-xl hover:from-green-600 hover:to-green-700 transition-all duration-300 shadow-md font-medium"
                    >
                        <FontAwesomeIcon icon={faRedo} className="mr-2" />
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden relative">
            {loading && <Loading />}
            
            <div className="max-w-full mx-auto p-6">
                {/* Header */}
                <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 border border-gray-100">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-800 mb-2 flex items-center">
                                <FontAwesomeIcon icon={faFileExport} className="mr-3 text-green-500" />
                                Indirect Export Complete Report
                            </h1>
                            <p className="text-gray-600">
                                Complete consolidated view of all indirect export data with all database fields
                            </p>
                        </div>

                        {/* Search and Actions */}
                        <div className="flex flex-col lg:flex-row gap-4">
                            <div className="relative">
                                <FontAwesomeIcon
                                    icon={faSearch}
                                    className="absolute left-4 top-1/2 transform -translate-y-1/2 text-green-500"
                                />
                                <input
                                    type="text"
                                    placeholder="Search by Sr No, Company, Product..."
                                    value={searchTerm}
                                    onChange={(e) => handleSearch(e.target.value)}
                                    className="pl-12 pr-4 py-3 w-full lg:w-80 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-300 text-lg"
                                />
                            </div>
                            <button 
                                className="flex items-center justify-center px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl hover:from-green-600 hover:to-green-700 transition-all duration-300 shadow-md"
                                onClick={() => fetchData(1, searchTerm, false)}
                            >
                                <FontAwesomeIcon icon={faSync} className="mr-2" />
                                Refresh Data
                            </button>
                            <button 
                                className="flex items-center justify-center px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                                onClick={exportToExcel}
                                disabled={consolidatedData.length === 0}
                            >
                                <FontAwesomeIcon icon={faFileExcel} className="mr-2" />
                                Export Complete Excel
                            </button>
                        </div>
                    </div>
                </div>

                {/* Summary Cards */}
                {pagination && (
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                        <div className="bg-white rounded-xl p-6 shadow-lg border-l-4 border-green-500 hover:shadow-xl transition-all duration-300">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-gray-500 text-sm font-medium">Total Records</p>
                                    <p className="text-3xl font-bold text-gray-800">{pagination.totalRecords}</p>
                                </div>
                                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                                    <FontAwesomeIcon icon={faHashtag} className="text-2xl text-green-600" />
                                </div>
                            </div>
                        </div>
                        <div className="bg-white rounded-xl p-6 shadow-lg border-l-4 border-blue-500 hover:shadow-xl transition-all duration-300">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-gray-500 text-sm font-medium">Consolidated Records</p>
                                    <p className="text-3xl font-bold text-gray-800">{consolidatedData.length}</p>
                                </div>
                                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                                    <FontAwesomeIcon icon={faTable} className="text-2xl text-blue-600" />
                                </div>
                            </div>
                        </div>
                        <div className="bg-white rounded-xl p-6 shadow-lg border-l-4 border-purple-500 hover:shadow-xl transition-all duration-300">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-gray-500 text-sm font-medium">Current Page</p>
                                    <p className="text-3xl font-bold text-gray-800">{pagination.currentPage}</p>
                                </div>
                                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                                    <FontAwesomeIcon icon={faCalendar} className="text-2xl text-purple-600" />
                                </div>
                            </div>
                        </div>
                        <div className="bg-white rounded-xl p-6 shadow-lg border-l-4 border-amber-500 hover:shadow-xl transition-all duration-300">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-gray-500 text-sm font-medium">More Data</p>
                                    <p className="text-3xl font-bold text-gray-800">{pagination.hasMore ? 'Yes' : 'No'}</p>
                                </div>
                                <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center">
                                    <FontAwesomeIcon icon={pagination.hasMore ? faChevronDown : faCheckCircle} className="text-2xl text-amber-600" />
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Legend */}
                <div className="bg-white rounded-xl shadow-lg p-6 mb-8 hover:shadow-xl transition-all duration-300">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                        <FontAwesomeIcon icon={faInfoCircle} className="mr-2 text-green-500" />
                        Data Source Legend
                    </h3>
                    <div className="flex flex-wrap gap-4 text-sm">
                        <div className="flex items-center px-4 py-2 bg-green-50 rounded-lg">
                            <span className="inline-block bg-green-100 text-green-700 text-xs px-2 py-1 rounded-md font-medium mr-2">BS</span>
                            <span className="text-gray-700">Basic Sheet</span>
                        </div>
                        <div className="flex items-center px-4 py-2 bg-blue-50 rounded-lg">
                            <span className="inline-block bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-md font-medium mr-2">A1</span>
                            <span className="text-gray-700">Annexure 1</span>
                        </div>
                        <div className="flex items-center px-4 py-2 bg-purple-50 rounded-lg">
                            <span className="inline-block bg-purple-100 text-purple-700 text-xs px-2 py-1 rounded-md font-medium mr-2">A2</span>
                            <span className="text-gray-700">Annexure 2</span>
                        </div>
                        <div className="flex items-center px-4 py-2 bg-orange-50 rounded-lg">
                            <span className="inline-block bg-orange-100 text-orange-700 text-xs px-2 py-1 rounded-md font-medium mr-2">CS</span>
                            <span className="text-gray-700">Calculation Sheet</span>
                        </div>
                        <div className="flex items-center px-4 py-2 bg-teal-50 rounded-lg">
                            <span className="inline-block bg-teal-100 text-teal-700 text-xs px-2 py-1 rounded-md font-medium mr-2">NDS</span>
                            <span className="text-gray-700">New Dept Sheet</span>
                        </div>
                        <div className="flex items-center px-4 py-2 bg-indigo-50 rounded-lg">
                            <span className="inline-block bg-indigo-100 text-indigo-700 text-xs px-2 py-1 rounded-md font-medium mr-2">AA</span>
                            <span className="text-gray-700">Annexure A</span>
                        </div>
                    </div>
                </div>

                {/* Consolidated Data Table */}
                <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden hover:shadow-2xl transition-all duration-300">
                    <div className="bg-gradient-to-r from-green-50 to-green-100 p-6">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                                <FontAwesomeIcon icon={faTable} className="text-2xl text-green-500" />
                                <div>
                                    <h2 className="text-xl font-bold text-gray-800">Consolidated Indirect Export Data</h2>
                                    <p className="text-gray-600">All data sources matched by Serial Number</p>
                                </div>
                            </div>
                            <div className="flex items-center space-x-2">
                                <button className="flex items-center text-gray-700 hover:text-green-600 transition-colors duration-300">
                                    <FontAwesomeIcon icon={faFilter} className="mr-1" />
                                    <span>Filter</span>
                                </button>
                                <button 
                                    className="flex items-center text-gray-700 hover:text-green-600 transition-colors duration-300 ml-4"
                                    onClick={exportToExcel}
                                    disabled={consolidatedData.length === 0}
                                >
                                    <FontAwesomeIcon icon={faDownload} className="mr-1" />
                                    <span>Download</span>
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="p-6">
                        {consolidatedData.length > 0 ? (
                            <>
                                {renderConsolidatedTable()}
                                
                                {pagination?.hasMore && (
                                    <div className="mt-6 text-center">
                                        <button
                                            onClick={loadMore}
                                            disabled={loading}
                                            className="bg-gradient-to-r from-green-500 to-green-600 text-white px-8 py-3 rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-300 disabled:opacity-50 font-medium"
                                        >
                                            {loading ? (
                                                <FontAwesomeIcon icon={faSpinner} className="mr-2 animate-spin" />
                                            ) : (
                                                <FontAwesomeIcon icon={faChevronDown} className="mr-2" />
                                            )}
                                            Load More Records
                                        </button>
                                    </div>
                                )}

                                {!pagination?.hasMore && (
                                    <div className="text-center mt-6 text-gray-500">
                                        <FontAwesomeIcon icon={faCheckCircle} className="mr-2" />
                                        All records loaded
                                    </div>
                                )}
                            </>
                        ) : (
                            <div className="text-center py-20">
                                {loading ? (
                                    <>
                                        <FontAwesomeIcon icon={faSpinner} className="text-6xl text-green-500 animate-spin mb-4" />
                                        <p className="text-gray-600 text-xl">Loading consolidated indirect export data...</p>
                                        <p className="text-gray-500 text-sm mt-2">
                                            Processing data from all indirect export sources
                                        </p>
                                    </>
                                ): (
                                <>
                                    <FontAwesomeIcon icon={faInbox} className="text-6xl text-gray-300 mb-4" />
                                    <p className="text-gray-500 text-xl">No consolidated data available</p>
                                    <p className="text-gray-400 text-sm mt-2">
                                        Try adjusting your search criteria or check if data exists in the system
                                    </p>
                                </>
                            )}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Loading Overlay */}
            {loading && <Loading />}
        </div>
    );
};

export default IndirectExportReport;