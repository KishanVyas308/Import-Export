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

interface BasicSheetData {
    id: string;
    companyName: string;
    uploadedDate: string;
    srNo: string;
    shippingBillNo: string;
    shippingBillDate?: string;
    exportersName?: string;
    hsCodeAndDescription?: string;
    epcgLicNo?: string;
    cifValue: string;
    freight: string;
    insurance: string;
    brc: string;
    exchangeRateOrProprtionRatio: string;
    cifValue2: string;
    freight2: string;
    insurance2: string;
    brc2: string;
    exchangeRate: string;
    product?: string;
    remarks?: string;
    user: User;
}

interface Annexure1Data {
    id: string;
    srNo: string;
    shippingBillNo: string;
    shippingBillDate?: string;
    shippingBillCifValueInDoller?: string;
    brcValue?: string;
    lowerOfSbAndBrc?: string;
    shippingBillFreight?: string;
    shippingBillInsurance?: string;
    fobValueInDoller?: string;
    ExchangeRatePerShippingBill?: string;
    fobValueInRupees?: string;
    uploadedDate: string;
    user: User;
}

interface AnnexureAData {
    id: string;
    srNo: string;
    productExportered: string;
    shippingBillNumber: string;
    shippingBillDate: string;
    directExportsInRupees: string;
    directExportsInDollars: string;
    deemedExports: string;
    thirdPartyExportsInRupees: string;
    thirdPartyExportsInDollars: string;
    byGroupCompany: string;
    otherRWseries: string;
    totalInRupees: string;
    totalInDollars: string;
    uploadedDate: string;
    user: User;
}

interface ConsolidatedRow {
    srNo: string;
    basicSheet: BasicSheetData | null;
    annexure1: Annexure1Data | null;
    annexureA: AnnexureAData | null;
    user: User;
    uploadedDate: string;
}

interface DirectExportData {
    consolidatedData: {
        data: ConsolidatedRow[];
        count: number;
        hasMore: boolean;
    };
    pagination: {
        currentPage: number;
        limit: number;
        totalRecords: number;
        hasMore: boolean;
    };
}

interface ApiResponse {
    success: boolean;
    message: string;
    data: DirectExportData;
}

const DirectExportReport: React.FC = () => {
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [consolidatedData, setConsolidatedData] = useState<ConsolidatedRow[]>([]);
    const [pagination, setPagination] = useState<DirectExportData['pagination'] | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [cookies] = useCookies(["token"]);

    // Fetch data function
    const fetchData = useCallback(async (page = 1, search = "", append = false) => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get<ApiResponse>(
                `${BACKEND_URL}/reports/form/directexport`,
                {
                    params: { page, limit: 50, search },
                    headers: { Authorization:cookies.token }
                }
            );

            if (response.data.success) {
                const { data } = response.data;
                
                // Debug logging
                console.log("API Response:", response.data);
                console.log("Data structure:", data);
                
                if (data && data.consolidatedData && data.consolidatedData.data) {
                    if (append) {
                        setConsolidatedData(prev => [...prev, ...data.consolidatedData.data]);
                    } else {
                        setConsolidatedData(data.consolidatedData.data);
                    }

                    setPagination(data.pagination);
                    setCurrentPage(page);
                } else {
                    throw new Error('Invalid data structure received from server');
                }
            } else {
                throw new Error(response.data.message || 'Failed to fetch data');
            }
        } catch (error) {
            console.error("Error fetching direct export data:", error);
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
    const formatDate = (dateString: string) => {
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
        if (row.annexureA) sources.push('AA');
        return sources;
    };

    // Export to Excel function
    const exportToExcel = () => {
        try {
            // Prepare data for Excel export
            const excelData = consolidatedData.map((row, index) => ({
                'Sr No': row.srNo,
                'Data Sources': getDataSourceBadge(row).join(', '),
                
                // Basic Sheet Data
                'Company Name': row.basicSheet?.companyName || '-',
                'Shipping Bill No': row.basicSheet?.shippingBillNo || '-',
                'Shipping Bill Date': row.basicSheet?.shippingBillDate ? formatDate(row.basicSheet.shippingBillDate) : '-',
                'Exporters Name': row.basicSheet?.exportersName || '-',
                'HS Code': row.basicSheet?.hsCodeAndDescription || '-',
                'EPCG Lic No': row.basicSheet?.epcgLicNo || '-',
                'CIF Value': row.basicSheet?.cifValue || '-',
                'Freight': row.basicSheet?.freight || '-',
                'Insurance': row.basicSheet?.insurance || '-',
                'BRC': row.basicSheet?.brc || '-',
                'Exchange Rate/Ratio': row.basicSheet?.exchangeRateOrProprtionRatio || '-',
                'CIF Value 2': row.basicSheet?.cifValue2 || '-',
                'Freight 2': row.basicSheet?.freight2 || '-',
                'Insurance 2': row.basicSheet?.insurance2 || '-',
                'BRC 2': row.basicSheet?.brc2 || '-',
                'Exchange Rate': row.basicSheet?.exchangeRate || '-',
                'Product': row.basicSheet?.product || '-',
                'Remarks': row.basicSheet?.remarks || '-',
                
                // Annexure1 Data
                'A1: Shipping Bill No': row.annexure1?.shippingBillNo || '-',
                'A1: Shipping Bill Date': row.annexure1?.shippingBillDate ? formatDate(row.annexure1.shippingBillDate) : '-',
                'A1: CIF Value (USD)': row.annexure1?.shippingBillCifValueInDoller || '-',
                'A1: BRC Value': row.annexure1?.brcValue || '-',
                'A1: Lower of SB & BRC': row.annexure1?.lowerOfSbAndBrc || '-',
                'A1: Freight': row.annexure1?.shippingBillFreight || '-',
                'A1: Insurance': row.annexure1?.shippingBillInsurance || '-',
                'A1: FOB Value (USD)': row.annexure1?.fobValueInDoller || '-',
                'A1: Exchange Rate': row.annexure1?.ExchangeRatePerShippingBill || '-',
                'A1: FOB Value (INR)': row.annexure1?.fobValueInRupees || '-',
                
                // AnnexureA Data
                'AA: Product Exported': row.annexureA?.productExportered || '-',
                'AA: Shipping Bill No': row.annexureA?.shippingBillNumber || '-',
                'AA: Shipping Bill Date': row.annexureA?.shippingBillDate ? formatDate(row.annexureA.shippingBillDate) : '-',
                'AA: Direct Exports (INR)': row.annexureA?.directExportsInRupees || '-',
                'AA: Direct Exports (USD)': row.annexureA?.directExportsInDollars || '-',
                'AA: Deemed Exports': row.annexureA?.deemedExports || '-',
                'AA: Third Party (INR)': row.annexureA?.thirdPartyExportsInRupees || '-',
                'AA: Third Party (USD)': row.annexureA?.thirdPartyExportsInDollars || '-',
                'AA: By Group Company': row.annexureA?.byGroupCompany || '-',
                'AA: Other RW Series': row.annexureA?.otherRWseries || '-',
                'AA: Total (INR)': row.annexureA?.totalInRupees || '-',
                'AA: Total (USD)': row.annexureA?.totalInDollars || '-',
                
                // Common Data
                'Uploaded Date': formatDate(row.uploadedDate),
                'User Name': row.user.contactPersonName || 'Unknown',
                'Company Name (User)': row.user.companyName || 'N/A',
                'User Email': row.user.email || 'N/A'
            }));

            // Create workbook and worksheet
            const wb = XLSX.utils.book_new();
            const ws = XLSX.utils.json_to_sheet(excelData);

            // Set column widths
            const colWidths = [
                { wch: 10 }, // Sr No
                { wch: 15 }, // Data Sources
                { wch: 25 }, // Company Name
                { wch: 20 }, // Shipping Bill No
                { wch: 15 }, // Shipping Bill Date
                { wch: 25 }, // Exporters Name
                { wch: 30 }, // HS Code
                { wch: 15 }, // EPCG Lic No
                { wch: 15 }, // CIF Value
                { wch: 15 }, // Freight
                { wch: 15 }, // Insurance
                { wch: 15 }, // BRC
                { wch: 20 }, // Exchange Rate/Ratio
                { wch: 15 }, // CIF Value 2
                { wch: 15 }, // Freight 2
                { wch: 15 }, // Insurance 2
                { wch: 15 }, // BRC 2
                { wch: 15 }, // Exchange Rate
                { wch: 20 }, // Product
                { wch: 30 }, // Remarks
                { wch: 20 }, // A1 fields
                { wch: 15 },
                { wch: 15 },
                { wch: 15 },
                { wch: 15 },
                { wch: 15 },
                { wch: 15 },
                { wch: 15 },
                { wch: 15 },
                { wch: 15 },
                { wch: 25 }, // AA fields
                { wch: 20 },
                { wch: 15 },
                { wch: 15 },
                { wch: 15 },
                { wch: 15 },
                { wch: 15 },
                { wch: 15 },
                { wch: 15 },
                { wch: 15 },
                { wch: 15 },
                { wch: 15 },
                { wch: 15 }, // Common fields
                { wch: 20 },
                { wch: 25 },
                { wch: 25 }
            ];
            ws['!cols'] = colWidths;

            // Add worksheet to workbook
            XLSX.utils.book_append_sheet(wb, ws, 'Direct Export Report');

            // Generate filename with current date
            const currentDate = new Date().toISOString().split('T')[0];
            const filename = `Direct_Export_Report_${currentDate}.xlsx`;

            // Save file
            XLSX.writeFile(wb, filename);

            console.log('Excel file exported successfully');
        } catch (error) {
            console.error('Error exporting to Excel:', error);
            alert('Error exporting to Excel. Please try again.');
        }
    };

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

    // Render consolidated table (Excel-like format)
    const renderConsolidatedTable = () => (
        <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200 rounded-lg">
                <thead>
                    <tr>
                        <th className="px-3 py-3.5 text-left text-xs font-medium uppercase tracking-wider border-b-2 border-gray-200 bg-gray-50 text-gray-600 sticky top-0">Sr No</th>
                        <th className="px-3 py-3.5 text-left text-xs font-medium uppercase tracking-wider border-b-2 border-gray-200 bg-gray-50 text-gray-600 sticky top-0">Sources</th>
                        
                        {/* Basic Sheet Columns */}
                        <th className="px-3 py-3.5 text-left text-xs font-medium uppercase tracking-wider border-b-2 border-gray-200 bg-green-50 text-green-700 sticky top-0">Company Name</th>
                        <th className="px-3 py-3.5 text-left text-xs font-medium uppercase tracking-wider border-b-2 border-gray-200 bg-green-50 text-green-700 sticky top-0">Shipping Bill No</th>
                        <th className="px-3 py-3.5 text-left text-xs font-medium uppercase tracking-wider border-b-2 border-gray-200 bg-green-50 text-green-700 sticky top-0">Shipping Bill Date</th>
                        <th className="px-3 py-3.5 text-left text-xs font-medium uppercase tracking-wider border-b-2 border-gray-200 bg-green-50 text-green-700 sticky top-0">Exporters Name</th>
                        <th className="px-3 py-3.5 text-left text-xs font-medium uppercase tracking-wider border-b-2 border-gray-200 bg-green-50 text-green-700 sticky top-0">HS Code</th>
                        <th className="px-3 py-3.5 text-left text-xs font-medium uppercase tracking-wider border-b-2 border-gray-200 bg-green-50 text-green-700 sticky top-0">EPCG Lic No</th>
                        <th className="px-3 py-3.5 text-left text-xs font-medium uppercase tracking-wider border-b-2 border-gray-200 bg-green-50 text-green-700 sticky top-0">CIF Value</th>
                        <th className="px-3 py-3.5 text-left text-xs font-medium uppercase tracking-wider border-b-2 border-gray-200 bg-green-50 text-green-700 sticky top-0">Freight</th>
                        <th className="px-3 py-3.5 text-left text-xs font-medium uppercase tracking-wider border-b-2 border-gray-200 bg-green-50 text-green-700 sticky top-0">Insurance</th>
                        <th className="px-3 py-3.5 text-left text-xs font-medium uppercase tracking-wider border-b-2 border-gray-200 bg-green-50 text-green-700 sticky top-0">BRC</th>
                        <th className="px-3 py-3.5 text-left text-xs font-medium uppercase tracking-wider border-b-2 border-gray-200 bg-green-50 text-green-700 sticky top-0">Exchange Rate/Ratio</th>
                        <th className="px-3 py-3.5 text-left text-xs font-medium uppercase tracking-wider border-b-2 border-gray-200 bg-green-50 text-green-700 sticky top-0">CIF Value 2</th>
                        <th className="px-3 py-3.5 text-left text-xs font-medium uppercase tracking-wider border-b-2 border-gray-200 bg-green-50 text-green-700 sticky top-0">Freight 2</th>
                        <th className="px-3 py-3.5 text-left text-xs font-medium uppercase tracking-wider border-b-2 border-gray-200 bg-green-50 text-green-700 sticky top-0">Insurance 2</th>
                        <th className="px-3 py-3.5 text-left text-xs font-medium uppercase tracking-wider border-b-2 border-gray-200 bg-green-50 text-green-700 sticky top-0">BRC 2</th>
                        <th className="px-3 py-3.5 text-left text-xs font-medium uppercase tracking-wider border-b-2 border-gray-200 bg-green-50 text-green-700 sticky top-0">Exchange Rate</th>
                        <th className="px-3 py-3.5 text-left text-xs font-medium uppercase tracking-wider border-b-2 border-gray-200 bg-green-50 text-green-700 sticky top-0">Product</th>
                        <th className="px-3 py-3.5 text-left text-xs font-medium uppercase tracking-wider border-b-2 border-gray-200 bg-green-50 text-green-700 sticky top-0">Remarks</th>
                        
                        {/* Annexure1 Columns */}
                        <th className="px-3 py-3.5 text-left text-xs font-medium uppercase tracking-wider border-b-2 border-gray-200 bg-blue-50 text-blue-700 sticky top-0">A1: Shipping Bill No</th>
                        <th className="px-3 py-3.5 text-left text-xs font-medium uppercase tracking-wider border-b-2 border-gray-200 bg-blue-50 text-blue-700 sticky top-0">A1: Shipping Bill Date</th>
                        <th className="px-3 py-3.5 text-left text-xs font-medium uppercase tracking-wider border-b-2 border-gray-200 bg-blue-50 text-blue-700 sticky top-0">A1: CIF Value (USD)</th>
                        <th className="px-3 py-3.5 text-left text-xs font-medium uppercase tracking-wider border-b-2 border-gray-200 bg-blue-50 text-blue-700 sticky top-0">A1: BRC Value</th>
                        <th className="px-3 py-3.5 text-left text-xs font-medium uppercase tracking-wider border-b-2 border-gray-200 bg-blue-50 text-blue-700 sticky top-0">A1: Lower of SB & BRC</th>
                        <th className="px-3 py-3.5 text-left text-xs font-medium uppercase tracking-wider border-b-2 border-gray-200 bg-blue-50 text-blue-700 sticky top-0">A1: Freight</th>
                        <th className="px-3 py-3.5 text-left text-xs font-medium uppercase tracking-wider border-b-2 border-gray-200 bg-blue-50 text-blue-700 sticky top-0">A1: Insurance</th>
                        <th className="px-3 py-3.5 text-left text-xs font-medium uppercase tracking-wider border-b-2 border-gray-200 bg-blue-50 text-blue-700 sticky top-0">A1: FOB Value (USD)</th>
                        <th className="px-3 py-3.5 text-left text-xs font-medium uppercase tracking-wider border-b-2 border-gray-200 bg-blue-50 text-blue-700 sticky top-0">A1: Exchange Rate</th>
                        <th className="px-3 py-3.5 text-left text-xs font-medium uppercase tracking-wider border-b-2 border-gray-200 bg-blue-50 text-blue-700 sticky top-0">A1: FOB Value (INR)</th>
                        
                        {/* AnnexureA Columns */}
                        <th className="px-3 py-3.5 text-left text-xs font-medium uppercase tracking-wider border-b-2 border-gray-200 bg-purple-50 text-purple-700 sticky top-0">AA: Product Exported</th>
                        <th className="px-3 py-3.5 text-left text-xs font-medium uppercase tracking-wider border-b-2 border-gray-200 bg-purple-50 text-purple-700 sticky top-0">AA: Shipping Bill No</th>
                        <th className="px-3 py-3.5 text-left text-xs font-medium uppercase tracking-wider border-b-2 border-gray-200 bg-purple-50 text-purple-700 sticky top-0">AA: Shipping Bill Date</th>
                        <th className="px-3 py-3.5 text-left text-xs font-medium uppercase tracking-wider border-b-2 border-gray-200 bg-purple-50 text-purple-700 sticky top-0">AA: Direct Exports (INR)</th>
                        <th className="px-3 py-3.5 text-left text-xs font-medium uppercase tracking-wider border-b-2 border-gray-200 bg-purple-50 text-purple-700 sticky top-0">AA: Direct Exports (USD)</th>
                        <th className="px-3 py-3.5 text-left text-xs font-medium uppercase tracking-wider border-b-2 border-gray-200 bg-purple-50 text-purple-700 sticky top-0">AA: Deemed Exports</th>
                        <th className="px-3 py-3.5 text-left text-xs font-medium uppercase tracking-wider border-b-2 border-gray-200 bg-purple-50 text-purple-700 sticky top-0">AA: Third Party (INR)</th>
                        <th className="px-3 py-3.5 text-left text-xs font-medium uppercase tracking-wider border-b-2 border-gray-200 bg-purple-50 text-purple-700 sticky top-0">AA: Third Party (USD)</th>
                        <th className="px-3 py-3.5 text-left text-xs font-medium uppercase tracking-wider border-b-2 border-gray-200 bg-purple-50 text-purple-700 sticky top-0">AA: By Group Company</th>
                        <th className="px-3 py-3.5 text-left text-xs font-medium uppercase tracking-wider border-b-2 border-gray-200 bg-purple-50 text-purple-700 sticky top-0">AA: Other RW Series</th>
                        <th className="px-3 py-3.5 text-left text-xs font-medium uppercase tracking-wider border-b-2 border-gray-200 bg-purple-50 text-purple-700 sticky top-0">AA: Total (INR)</th>
                        <th className="px-3 py-3.5 text-left text-xs font-medium uppercase tracking-wider border-b-2 border-gray-200 bg-purple-50 text-purple-700 sticky top-0">AA: Total (USD)</th>
                        
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
                                        } else if (source === "AA") {
                                            badgeClass = "bg-purple-100 text-purple-800";
                                        }
                                        return (
                                            <span key={source} className={`inline-block text-xs px-2 py-1 rounded-md font-medium ${badgeClass}`}>
                                                {source}
                                            </span>
                                        );
                                    })}
                                </div>
                            </td>
                            
                            {/* Basic Sheet Data */}
                            <td className="px-3 py-3 text-sm text-gray-900 border-r border-gray-100 bg-green-25">{row.basicSheet?.companyName || '-'}</td>
                            <td className="px-3 py-3 text-sm text-gray-900 border-r border-gray-100 bg-green-25">{row.basicSheet?.shippingBillNo || '-'}</td>
                            <td className="px-3 py-3 text-sm text-gray-900 border-r border-gray-100 bg-green-25">
                                {row.basicSheet?.shippingBillDate ? formatDate(row.basicSheet.shippingBillDate) : '-'}
                            </td>
                            <td className="px-3 py-3 text-sm text-gray-900 border-r border-gray-100 bg-green-25">{row.basicSheet?.exportersName || '-'}</td>
                            <td className="px-3 py-3 text-sm text-gray-900 border-r border-gray-100 bg-green-25">{row.basicSheet?.hsCodeAndDescription || '-'}</td>
                            <td className="px-3 py-3 text-sm text-gray-900 border-r border-gray-100 bg-green-25">{row.basicSheet?.epcgLicNo || '-'}</td>
                            <td className="px-3 py-3 text-sm font-medium text-green-600 border-r border-gray-100 bg-green-25">{row.basicSheet?.cifValue ? formatCurrency(row.basicSheet.cifValue) : '-'}</td>
                            <td className="px-3 py-3 text-sm font-medium text-green-600 border-r border-gray-100 bg-green-25">{row.basicSheet?.freight ? formatCurrency(row.basicSheet.freight) : '-'}</td>
                            <td className="px-3 py-3 text-sm font-medium text-green-600 border-r border-gray-100 bg-green-25">{row.basicSheet?.insurance ? formatCurrency(row.basicSheet.insurance) : '-'}</td>
                            <td className="px-3 py-3 text-sm font-medium text-green-600 border-r border-gray-100 bg-green-25">{row.basicSheet?.brc ? formatCurrency(row.basicSheet.brc) : '-'}</td>
                            <td className="px-3 py-3 text-sm text-gray-900 border-r border-gray-100 bg-green-25">{row.basicSheet?.exchangeRateOrProprtionRatio ? formatRate(row.basicSheet.exchangeRateOrProprtionRatio) : '-'}</td>
                            <td className="px-3 py-3 text-sm font-medium text-green-600 border-r border-gray-100 bg-green-25">{row.basicSheet?.cifValue2 ? formatCurrency(row.basicSheet.cifValue2) : '-'}</td>
                            <td className="px-3 py-3 text-sm font-medium text-green-600 border-r border-gray-100 bg-green-25">{row.basicSheet?.freight2 ? formatCurrency(row.basicSheet.freight2) : '-'}</td>
                            <td className="px-3 py-3 text-sm font-medium text-green-600 border-r border-gray-100 bg-green-25">{row.basicSheet?.insurance2 ? formatCurrency(row.basicSheet.insurance2) : '-'}</td>
                            <td className="px-3 py-3 text-sm font-medium text-green-600 border-r border-gray-100 bg-green-25">{row.basicSheet?.brc2 ? formatCurrency(row.basicSheet.brc2) : '-'}</td>
                            <td className="px-3 py-3 text-sm text-gray-900 border-r border-gray-100 bg-green-25">{row.basicSheet?.exchangeRate ? formatRate(row.basicSheet.exchangeRate) : '-'}</td>
                            <td className="px-3 py-3 text-sm text-gray-900 border-r border-gray-100 bg-green-25">{row.basicSheet?.product || '-'}</td>
                            <td className="px-3 py-3 text-sm text-gray-900 border-r border-gray-100 bg-green-25">{row.basicSheet?.remarks || '-'}</td>
                            
                            {/* Annexure1 Data */}
                            <td className="px-3 py-3 text-sm text-gray-900 border-r border-gray-100 bg-blue-25">{row.annexure1?.shippingBillNo || '-'}</td>
                            <td className="px-3 py-3 text-sm text-gray-900 border-r border-gray-100 bg-blue-25">
                                {row.annexure1?.shippingBillDate ? formatDate(row.annexure1.shippingBillDate) : '-'}
                            </td>
                            <td className="px-3 py-3 text-sm font-medium text-blue-600 border-r border-gray-100 bg-blue-25">
                                {row.annexure1?.shippingBillCifValueInDoller ? formatUSDCurrency(row.annexure1.shippingBillCifValueInDoller) : '-'}
                            </td>
                            <td className="px-3 py-3 text-sm font-medium text-blue-600 border-r border-gray-100 bg-blue-25">
                                {row.annexure1?.brcValue ? formatCurrency(row.annexure1.brcValue) : '-'}
                            </td>
                            <td className="px-3 py-3 text-sm font-medium text-blue-600 border-r border-gray-100 bg-blue-25">
                                {row.annexure1?.lowerOfSbAndBrc ? formatCurrency(row.annexure1.lowerOfSbAndBrc) : '-'}
                            </td>
                            <td className="px-3 py-3 text-sm font-medium text-blue-600 border-r border-gray-100 bg-blue-25">
                                {row.annexure1?.shippingBillFreight ? formatUSDCurrency(row.annexure1.shippingBillFreight) : '-'}
                            </td>
                            <td className="px-3 py-3 text-sm font-medium text-blue-600 border-r border-gray-100 bg-blue-25">
                                {row.annexure1?.shippingBillInsurance ? formatUSDCurrency(row.annexure1.shippingBillInsurance) : '-'}
                            </td>
                            <td className="px-3 py-3 text-sm font-medium text-blue-600 border-r border-gray-100 bg-blue-25">
                                {row.annexure1?.fobValueInDoller ? formatUSDCurrency(row.annexure1.fobValueInDoller) : '-'}
                            </td>
                            <td className="px-3 py-3 text-sm text-gray-900 border-r border-gray-100 bg-blue-25">
                                {row.annexure1?.ExchangeRatePerShippingBill ? formatRate(row.annexure1.ExchangeRatePerShippingBill) : '-'}
                            </td>
                            <td className="px-3 py-3 text-sm font-medium text-blue-600 border-r border-gray-100 bg-blue-25">
                                {row.annexure1?.fobValueInRupees ? formatCurrency(row.annexure1.fobValueInRupees) : '-'}
                            </td>
                            
                            {/* AnnexureA Data */}
                            <td className="px-3 py-3 text-sm text-gray-900 border-r border-gray-100 bg-purple-25">{row.annexureA?.productExportered || '-'}</td>
                            <td className="px-3 py-3 text-sm text-gray-900 border-r border-gray-100 bg-purple-25">{row.annexureA?.shippingBillNumber || '-'}</td>
                            <td className="px-3 py-3 text-sm text-gray-900 border-r border-gray-100 bg-purple-25">
                                {row.annexureA?.shippingBillDate ? formatDate(row.annexureA.shippingBillDate) : '-'}
                            </td>
                            <td className="px-3 py-3 text-sm font-medium text-purple-600 border-r border-gray-100 bg-purple-25">
                                {row.annexureA?.directExportsInRupees ? formatCurrency(row.annexureA.directExportsInRupees) : '-'}
                            </td>
                            <td className="px-3 py-3 text-sm font-medium text-purple-600 border-r border-gray-100 bg-purple-25">
                                {row.annexureA?.directExportsInDollars ? formatUSDCurrency(row.annexureA.directExportsInDollars) : '-'}
                            </td>
                            <td className="px-3 py-3 text-sm font-medium text-purple-600 border-r border-gray-100 bg-purple-25">
                                {row.annexureA?.deemedExports ? formatCurrency(row.annexureA.deemedExports) : '-'}
                            </td>
                            <td className="px-3 py-3 text-sm font-medium text-purple-600 border-r border-gray-100 bg-purple-25">
                                {row.annexureA?.thirdPartyExportsInRupees ? formatCurrency(row.annexureA.thirdPartyExportsInRupees) : '-'}
                            </td>
                            <td className="px-3 py-3 text-sm font-medium text-purple-600 border-r border-gray-100 bg-purple-25">
                                {row.annexureA?.thirdPartyExportsInDollars ? formatUSDCurrency(row.annexureA.thirdPartyExportsInDollars) : '-'}
                            </td>
                            <td className="px-3 py-3 text-sm font-medium text-purple-600 border-r border-gray-100 bg-purple-25">
                                {row.annexureA?.byGroupCompany ? formatCurrency(row.annexureA.byGroupCompany) : '-'}
                            </td>
                            <td className="px-3 py-3 text-sm font-medium text-purple-600 border-r border-gray-100 bg-purple-25">
                                {row.annexureA?.otherRWseries ? formatCurrency(row.annexureA.otherRWseries) : '-'}
                            </td>
                            <td className="px-3 py-3 text-sm font-medium text-purple-600 border-r border-gray-100 bg-purple-25">
                                {row.annexureA?.totalInRupees ? formatCurrency(row.annexureA.totalInRupees) : '-'}
                            </td>
                            <td className="px-3 py-3 text-sm font-medium text-purple-600 border-r border-gray-100 bg-purple-25">
                                {row.annexureA?.totalInDollars ? formatUSDCurrency(row.annexureA.totalInDollars) : '-'}
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
                          

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden relative">
            {loading && <Loading />}
            
            <div className="max-w-full mx-auto p-6">
                {/* Header */}
                <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 border border-gray-100">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-800 mb-2 flex items-center">
                                <FontAwesomeIcon icon={faShip} className="mr-3 text-green-500" />
                                Direct Export Consolidated Report
                            </h1>
                            <p className="text-gray-600">
                                Excel-like consolidated view of Basic Sheet, Annexure 1, and Annexure A data matched by Serial Number
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
                                Export Excel
                            </button>
                        </div>
                    </div>
                </div>

                {/* Summary Cards */}
                {/* {pagination && (
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
                                    <p className="text-gray-500 text-sm font-medium">Loaded Records</p>
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
                )} */}

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
                            <span className="inline-block bg-purple-100 text-purple-700 text-xs px-2 py-1 rounded-md font-medium mr-2">AA</span>
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
                                    <h2 className="text-xl font-bold text-gray-800">Consolidated Export Data</h2>
                                    <p className="text-gray-600">All data sources matched by Serial Number</p>
                                </div>
                            </div>
                            <div className="flex items-center space-x-2">
                                <button className="flex items-center text-gray-700 hover:text-green-600 transition-colors duration-300">
                                    <FontAwesomeIcon icon={faFilter} className="mr-1" />
                                    <span>Filter</span>
                                </button>
                                <button className="flex items-center text-gray-700 hover:text-green-600 transition-colors duration-300 ml-4">
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
                            <div className="text-center py-20">                                    {loading ? (
                                        <>
                                            <FontAwesomeIcon icon={faSpinner} className="text-6xl text-green-500 animate-spin mb-4" />
                                            <p className="text-gray-600 text-xl">Loading consolidated export data...</p>
                                            <p className="text-gray-500 text-sm mt-2">
                                                Processing data from Basic Sheet, Annexure 1, and Annexure A
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

export default DirectExportReport;
