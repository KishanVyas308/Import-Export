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
    faSync,
    faIdCard,
    faShield,
    faFileContract
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

interface DocumentEpcgLicenseEoAsPerLicense {
    id: string;
    hsCodeEoInr: string;
    descriptionEoUsd: string;
}

interface DocumentEpcgLicenseActualExport {
    id: string;
    hsCodeEoImposedAsPerLicense: string;
    descriptionNoOfYears: string;
    descriptionTotalAEOImposed: string;
}

interface EPCGLicenseData {
    id: string;
    srNo: string;
    customerName: string;
    licenseNo: string;
    licenseDate: string;
    fileNo: string;
    fileDate: string;
    licenseType: string;
    bankGuaranteeAmountRs: string;
    bankGuaranteeValidityFrom: string;
    bankGuaranteeValidityTo: string;
    bankGuaranteeSubmittedTo: string;
    dutySavedValueAmountInr: string;
    dutyUtilizedValue: string;
    remarks: string;
    uploadedDate: string;
    user: User;
    DocumentEpcgLicenseEoAsPerLicense: DocumentEpcgLicenseEoAsPerLicense[];
    DocumentEpcgLicenseActualExport: DocumentEpcgLicenseActualExport[];
}

interface EPCGLicenseResponse {
    epcgLicenses: {
        data: EPCGLicenseData[];
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
    data: EPCGLicenseResponse;
}

const EPCGLicenseReport: React.FC = () => {
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [epcgLicenseData, setEpcgLicenseData] = useState<EPCGLicenseData[]>([]);
    const [pagination, setPagination] = useState<EPCGLicenseResponse['pagination'] | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [cookies] = useCookies(["token"]);
    
    // Filter states
    const [showFilters, setShowFilters] = useState(false);
    const [filterLicenseType, setFilterLicenseType] = useState("");
    const [filterDateFrom, setFilterDateFrom] = useState("");
    const [filterDateTo, setFilterDateTo] = useState("");
    const [filterCompany, setFilterCompany] = useState("");

    // Fetch data function
    const fetchData = useCallback(async (page = 1, search = "", append = false) => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get<ApiResponse>(
                `${BACKEND_URL}/reports/document/epcglicense`,
                {
                    params: { page, limit: 50, search },
                    headers: { Authorization: cookies.token }
                }
            );

            if (response.data.success) {
                const newData = response.data.data.epcgLicenses.data;
                setEpcgLicenseData(append ? prev => [...prev, ...newData] : newData);
                setPagination(response.data.data.pagination);
                if (!append) {
                    setCurrentPage(page);
                } else {
                    setCurrentPage(prev => prev + 1);
                }
            } else {
                setError(response.data.message || 'Failed to fetch data');
            }
        } catch (error) {
            console.error("Error fetching EPCG License data:", error);
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
        if (!value || value === "0.00" || value === "") return "₹0.00";
        const num = parseFloat(value);
        if (isNaN(num)) return "₹0.00";
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            minimumFractionDigits: 2
        }).format(num);
    };

    // Format date
    const formatDate = (dateString: string) => {
        if (!dateString) return '-';
        try {
            return new Date(dateString).toLocaleDateString('en-IN', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            });
        } catch {
            return dateString;
        }
    };

    // Export to Excel function - Complete consolidated report
    const exportToExcel = () => {
        try {
            // Get all unique EO fields dynamically
            const allEOFields = new Set<string>();
            const allAEFields = new Set<string>();
            
            epcgLicenseData.forEach(license => {
                license.DocumentEpcgLicenseEoAsPerLicense.forEach((eo, index) => {
                    allEOFields.add(`EO_${index + 1}_HS_Code_INR`);
                    allEOFields.add(`EO_${index + 1}_Description_USD`);
                });
                license.DocumentEpcgLicenseActualExport.forEach((ae, index) => {
                    allAEFields.add(`AE_${index + 1}_HS_Code_Imposed`);
                    allAEFields.add(`AE_${index + 1}_Years`);
                    allAEFields.add(`AE_${index + 1}_Total_AEO`);
                });
            });

            // Prepare consolidated data for Excel export with ALL fields
            const consolidatedExcelData = epcgLicenseData.map((license, index) => {
                const baseData: any = {
                    'Sr No': license.srNo || '-',
                    'Customer Name': license.customerName || '-',
                    'License No': license.licenseNo || '-',
                    'License Date': license.licenseDate ? formatDate(license.licenseDate) : '-',
                    'File No': license.fileNo || '-',
                    'File Date': license.fileDate ? formatDate(license.fileDate) : '-',
                    'License Type': license.licenseType || '-',
                    'Bank Guarantee Amount (₹)': license.bankGuaranteeAmountRs ? formatCurrency(license.bankGuaranteeAmountRs) : '-',
                    'BG Validity From': license.bankGuaranteeValidityFrom ? formatDate(license.bankGuaranteeValidityFrom) : '-',
                    'BG Validity To': license.bankGuaranteeValidityTo ? formatDate(license.bankGuaranteeValidityTo) : '-',
                    'BG Submitted To': license.bankGuaranteeSubmittedTo || '-',
                    'Duty Saved Value (₹)': license.dutySavedValueAmountInr ? formatCurrency(license.dutySavedValueAmountInr) : '-',
                    'Duty Utilized Value': license.dutyUtilizedValue || '-',
                    'Remarks': license.remarks || '-',
                };

                // Add EO data dynamically
                license.DocumentEpcgLicenseEoAsPerLicense.forEach((eo, eoIndex) => {
                    baseData[`EO_${eoIndex + 1}_HS_Code_INR`] = eo.hsCodeEoInr || '-';
                    baseData[`EO_${eoIndex + 1}_Description_USD`] = eo.descriptionEoUsd || '-';
                });

                // Add AE data dynamically
                license.DocumentEpcgLicenseActualExport.forEach((ae, aeIndex) => {
                    baseData[`AE_${aeIndex + 1}_HS_Code_Imposed`] = ae.hsCodeEoImposedAsPerLicense || '-';
                    baseData[`AE_${aeIndex + 1}_Years`] = ae.descriptionNoOfYears || '-';
                    baseData[`AE_${aeIndex + 1}_Total_AEO`] = ae.descriptionTotalAEOImposed || '-';
                });

                // Fill missing dynamic fields with '-'
                Array.from(allEOFields).forEach(field => {
                    if (!(field in baseData)) {
                        baseData[field] = '-';
                    }
                });
                Array.from(allAEFields).forEach(field => {
                    if (!(field in baseData)) {
                        baseData[field] = '-';
                    }
                });

                // Add user data
                baseData['Uploaded Date'] = formatDate(license.uploadedDate);
                baseData['User Name'] = license.user.contactPersonName || 'Unknown';
                baseData['Company Name'] = license.user.companyName || 'N/A';
                baseData['User Email'] = license.user.email || 'N/A';

                return baseData;
            });

            // Create workbook
            const wb = XLSX.utils.book_new();
            
            // Main consolidated sheet
            const wsMain = XLSX.utils.json_to_sheet(consolidatedExcelData);
            
            // Set column widths for better readability
            const colWidths = Object.keys(consolidatedExcelData[0] || {}).map(() => ({ wch: 20 }));
            wsMain['!cols'] = colWidths;
            
            XLSX.utils.book_append_sheet(wb, wsMain, "EPCG License Complete Report");

            // Separate EO data sheet
            const eoData: any[] = [];
            epcgLicenseData.forEach(license => {
                license.DocumentEpcgLicenseEoAsPerLicense.forEach((eo, index) => {
                    eoData.push({
                        'License ID': license.id,
                        'Sr No': license.srNo,
                        'License No': license.licenseNo,
                        'Customer Name': license.customerName,
                        'EO Index': index + 1,
                        'HS Code EO (INR)': eo.hsCodeEoInr || '-',
                        'Description EO (USD)': eo.descriptionEoUsd || '-',
                        'License Date': license.licenseDate ? formatDate(license.licenseDate) : '-',
                        'User Name': license.user.contactPersonName || 'Unknown',
                        'Company Name': license.user.companyName || 'N/A'
                    });
                });
            });

            if (eoData.length > 0) {
                const wsEO = XLSX.utils.json_to_sheet(eoData);
                wsEO['!cols'] = Array(Object.keys(eoData[0]).length).fill({ wch: 18 });
                XLSX.utils.book_append_sheet(wb, wsEO, "EO As Per License Detail");
            }

            // Separate Actual Export data sheet
            const aeData: any[] = [];
            epcgLicenseData.forEach(license => {
                license.DocumentEpcgLicenseActualExport.forEach((ae, index) => {
                    aeData.push({
                        'License ID': license.id,
                        'Sr No': license.srNo,
                        'License No': license.licenseNo,
                        'Customer Name': license.customerName,
                        'AE Index': index + 1,
                        'HS Code EO Imposed': ae.hsCodeEoImposedAsPerLicense || '-',
                        'Description No of Years': ae.descriptionNoOfYears || '-',
                        'Total AEO Imposed': ae.descriptionTotalAEOImposed || '-',
                        'License Date': license.licenseDate ? formatDate(license.licenseDate) : '-',
                        'User Name': license.user.contactPersonName || 'Unknown',
                        'Company Name': license.user.companyName || 'N/A'
                    });
                });
            });

            if (aeData.length > 0) {
                const wsAE = XLSX.utils.json_to_sheet(aeData);
                wsAE['!cols'] = Array(Object.keys(aeData[0]).length).fill({ wch: 18 });
                XLSX.utils.book_append_sheet(wb, wsAE, "Actual Export Detail");
            }

            // Save the file
            const currentDate = new Date().toISOString().split('T')[0];
            const fileName = `EPCG_License_Complete_Report_${currentDate}.xlsx`;
            XLSX.writeFile(wb, fileName);
            
            console.log('Excel file exported successfully with dynamic columns');
        } catch (error) {
            console.error("Error exporting to Excel:", error);
            alert("Error exporting data to Excel. Please try again.");
        }
    };

    // Calculate maximum counts for dynamic columns
    const getMaxCounts = () => {
        const maxEOCount = Math.max(0, ...epcgLicenseData.map(license => license.DocumentEpcgLicenseEoAsPerLicense.length));
        const maxAECount = Math.max(0, ...epcgLicenseData.map(license => license.DocumentEpcgLicenseActualExport.length));
        return { maxEOCount, maxAECount };
    };

    const { maxEOCount, maxAECount } = getMaxCounts();

    // Generate dynamic column headers for EO
    const generateEOHeaders = (): JSX.Element[] => {
        const headers: JSX.Element[] = [];
        for (let i = 1; i <= maxEOCount; i++) {
            headers.push(
                <th key={`eo-hs-${i}`} className="px-3 py-4 text-left text-xs font-bold text-blue-800 uppercase tracking-wider border-r border-blue-200">
                    EO {i} HS Code
                </th>,
                <th key={`eo-desc-${i}`} className="px-3 py-4 text-left text-xs font-bold text-blue-800 uppercase tracking-wider border-r border-blue-200">
                    EO {i} Description
                </th>
            );
        }
        return headers;
    };

    // Generate dynamic column headers for AE
    const generateAEHeaders = (): JSX.Element[] => {
        const headers: JSX.Element[] = [];
        for (let i = 1; i <= maxAECount; i++) {
            headers.push(
                <th key={`ae-hs-${i}`} className="px-3 py-4 text-left text-xs font-bold text-blue-800 uppercase tracking-wider border-r border-blue-200">
                    AE {i} HS Code
                </th>,
                <th key={`ae-years-${i}`} className="px-3 py-4 text-left text-xs font-bold text-blue-800 uppercase tracking-wider border-r border-blue-200">
                    AE {i} Years
                </th>,
                <th key={`ae-aeo-${i}`} className="px-3 py-4 text-left text-xs font-bold text-blue-800 uppercase tracking-wider border-r border-blue-200">
                    AE {i} Total AEO
                </th>
            );
        }
        return headers;
    };

    // Generate dynamic EO data cells for a license
    const generateEOCells = (license: EPCGLicenseData): JSX.Element[] => {
        const cells: JSX.Element[] = [];
        for (let i = 1; i <= maxEOCount; i++) {
            const eo = license.DocumentEpcgLicenseEoAsPerLicense[i - 1];
            cells.push(
                <td key={`eo-hs-${i}-${license.id}`} className="px-3 py-3 text-sm text-gray-700 border-r border-gray-200">
                    {eo?.hsCodeEoInr || '-'}
                </td>,
                <td key={`eo-desc-${i}-${license.id}`} className="px-3 py-3 text-sm text-gray-700 border-r border-gray-200 max-w-xs">
                    <div className="truncate" title={eo?.descriptionEoUsd || '-'}>
                        {eo?.descriptionEoUsd || '-'}
                    </div>
                </td>
            );
        }
        return cells;
    };

    // Generate dynamic AE data cells for a license
    const generateAECells = (license: EPCGLicenseData): JSX.Element[] => {
        const cells: JSX.Element[] = [];
        for (let i = 1; i <= maxAECount; i++) {
            const ae = license.DocumentEpcgLicenseActualExport[i - 1];
            cells.push(
                <td key={`ae-hs-${i}-${license.id}`} className="px-3 py-3 text-sm text-gray-700 border-r border-gray-200">
                    {ae?.hsCodeEoImposedAsPerLicense || '-'}
                </td>,
                <td key={`ae-years-${i}-${license.id}`} className="px-3 py-3 text-sm text-gray-700 border-r border-gray-200">
                    {ae?.descriptionNoOfYears || '-'}
                </td>,
                <td key={`ae-aeo-${i}-${license.id}`} className="px-3 py-3 text-sm text-gray-700 border-r border-gray-200 max-w-xs">
                    <div className="truncate" title={ae?.descriptionTotalAEOImposed || '-'}>
                        {ae?.descriptionTotalAEOImposed || '-'}
                    </div>
                </td>
            );
        }
        return cells;
    };

    // Initial data load
    useEffect(() => {
        fetchData();
    }, [fetchData]);

    // Error state
    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center">
                <div className="bg-white p-8 rounded-lg shadow-xl max-w-md w-full mx-4">
                    <div className="text-center">
                        <FontAwesomeIcon icon={faExclamationTriangle} className="text-red-500 text-4xl mb-4" />
                        <h2 className="text-xl font-semibold text-gray-800 mb-2">Error Loading Data</h2>
                        <p className="text-gray-600 mb-4">{error}</p>
                        <button
                            onClick={() => fetchData()}
                            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                        >
                            <FontAwesomeIcon icon={faRedo} className="mr-2" />
                            Retry
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden relative">
            {loading && <Loading />}

            <div className="p-6">
                {/* Header */}
                <div className="bg-white rounded-xl shadow-lg mb-6 p-6">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                        <div className="flex items-center space-x-3 mb-4 lg:mb-0">
                            <div className="bg-blue-500 p-3 rounded-lg">
                                <FontAwesomeIcon icon={faFileContract} className="text-white text-xl" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-gray-800">EPCG License Report</h1>
                                <p className="text-gray-600">Export Promotion Capital Goods License Management</p>
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-3">
                            <button
                                onClick={exportToExcel}
                                disabled={epcgLicenseData.length === 0}
                                className="bg-green-500 hover:bg-green-600 disabled:bg-gray-300 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center justify-center"
                            >
                                <FontAwesomeIcon icon={faFileExcel} className="mr-2" />
                                Export to Excel
                            </button>
                            <button
                                onClick={() => fetchData(1, searchTerm, false)}
                                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center justify-center"
                            >
                                <FontAwesomeIcon icon={faSync} className="mr-2" />
                                Refresh
                            </button>
                        </div>
                    </div>
                </div>

                {/* Summary Cards */}
                {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                    <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-6 text-white">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-blue-100 text-sm font-medium">Total Licenses</p>
                                <p className="text-2xl font-bold">{pagination?.totalRecords || 0}</p>
                            </div>
                            <div className="bg-white/20 p-3 rounded-lg">
                                <FontAwesomeIcon icon={faFileContract} className="text-2xl" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-6 text-white">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-green-100 text-sm font-medium">Total Duty Saved</p>
                                <p className="text-2xl font-bold">
                                    {formatCurrency(
                                        epcgLicenseData.reduce((total, license) => {
                                            const amount = parseFloat(license.dutySavedValueAmountInr) || 0;
                                            return total + amount;
                                        }, 0).toString()
                                    )}
                                </p>
                            </div>
                            <div className="bg-white/20 p-3 rounded-lg">
                                <FontAwesomeIcon icon={faDollarSign} className="text-2xl" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl p-6 text-white">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-orange-100 text-sm font-medium">Total BG Amount</p>
                                <p className="text-2xl font-bold">
                                    {formatCurrency(
                                        epcgLicenseData.reduce((total, license) => {
                                            const amount = parseFloat(license.bankGuaranteeAmountRs) || 0;
                                            return total + amount;
                                        }, 0).toString()
                                    )}
                                </p>
                            </div>
                            <div className="bg-white/20 p-3 rounded-lg">
                                <FontAwesomeIcon icon={faShield} className="text-2xl" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-6 text-white">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-purple-100 text-sm font-medium">Active Companies</p>
                                <p className="text-2xl font-bold">
                                    {new Set(epcgLicenseData.map(license => license.user.companyName).filter(Boolean)).size}
                                </p>
                            </div>
                            <div className="bg-white/20 p-3 rounded-lg">
                                <FontAwesomeIcon icon={faBuilding} className="text-2xl" />
                            </div>
                        </div>
                    </div>
                </div> */}

                {/* Search and Stats */}
                <div className="bg-white rounded-xl shadow-lg mb-6 p-6">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                        <div className="relative flex-1 max-w-md mb-4 lg:mb-0">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <FontAwesomeIcon icon={faSearch} className="text-gray-400" />
                            </div>
                            <input
                                type="text"
                                placeholder="Search by customer name, license no, file no..."
                                value={searchTerm}
                                onChange={(e) => handleSearch(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>

                        <div className="flex flex-wrap gap-4">
                            <div className="bg-blue-50 px-4 py-2 rounded-lg">
                                <div className="flex items-center space-x-2">
                                    <FontAwesomeIcon icon={faTable} className="text-blue-500" />
                                    <span className="text-sm text-gray-600">Total Records:</span>
                                    <span className="font-semibold text-blue-600">
                                        {pagination?.totalRecords || 0}
                                    </span>
                                </div>
                            </div>
                            <div className="bg-green-50 px-4 py-2 rounded-lg">
                                <div className="flex items-center space-x-2">

                                    <FontAwesomeIcon icon={faCheckCircle} className="text-green-500" />
                                    <span className="text-sm text-gray-600">Showing:</span>
                                    <span className="font-semibold text-green-600">
                                        {epcgLicenseData.length}
                                    </span>
                                </div>
                            </div>
                            <div className="bg-yellow-50 px-4 py-2 rounded-lg">
                                <div className="flex items-center space-x-2">
                                    <FontAwesomeIcon icon={faInfoCircle} className="text-yellow-500" />
                                    <span className="text-sm text-gray-600">EO Records:</span>
                                    <span className="font-semibold text-yellow-600">
                                        {epcgLicenseData.reduce((total, license) => total + license.DocumentEpcgLicenseEoAsPerLicense.length, 0)}
                                    </span>
                                </div>
                            </div>
                            <div className="bg-purple-50 px-4 py-2 rounded-lg">
                                <div className="flex items-center space-x-2">
                                    <FontAwesomeIcon icon={faShip} className="text-purple-500" />
                                    <span className="text-sm text-gray-600">AE Records:</span>
                                    <span className="font-semibold text-purple-600">
                                        {epcgLicenseData.reduce((total, license) => total + license.DocumentEpcgLicenseActualExport.length, 0)}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Dynamic Data Table */}
                <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full table-auto">
                            <thead className="bg-gradient-to-r from-blue-50 to-blue-100 border-b-2 border-blue-200">
                                <tr>
                                    <th className="px-3 py-4 text-left text-xs font-bold text-blue-800 uppercase tracking-wider border-r border-blue-200">
                                        Sr No
                                    </th>
                                    <th className="px-3 py-4 text-left text-xs font-bold text-blue-800 uppercase tracking-wider border-r border-blue-200">
                                        Customer Name
                                    </th>
                                    <th className="px-3 py-4 text-left text-xs font-bold text-blue-800 uppercase tracking-wider border-r border-blue-200">
                                        License No
                                    </th>
                                    <th className="px-3 py-4 text-left text-xs font-bold text-blue-800 uppercase tracking-wider border-r border-blue-200">
                                        License Date
                                    </th>
                                    <th className="px-3 py-4 text-left text-xs font-bold text-blue-800 uppercase tracking-wider border-r border-blue-200">
                                        File No
                                    </th>
                                    <th className="px-3 py-4 text-left text-xs font-bold text-blue-800 uppercase tracking-wider border-r border-blue-200">
                                        File Date
                                    </th>
                                    <th className="px-3 py-4 text-left text-xs font-bold text-blue-800 uppercase tracking-wider border-r border-blue-200">
                                        License Type
                                    </th>
                                    <th className="px-3 py-4 text-left text-xs font-bold text-blue-800 uppercase tracking-wider border-r border-blue-200">
                                        BG Amount (₹)
                                    </th>
                                    <th className="px-3 py-4 text-left text-xs font-bold text-blue-800 uppercase tracking-wider border-r border-blue-200">
                                        BG Validity From
                                    </th>
                                    <th className="px-3 py-4 text-left text-xs font-bold text-blue-800 uppercase tracking-wider border-r border-blue-200">
                                        BG Validity To
                                    </th>
                                    <th className="px-3 py-4 text-left text-xs font-bold text-blue-800 uppercase tracking-wider border-r border-blue-200">
                                        BG Submitted To
                                    </th>
                                    <th className="px-3 py-4 text-left text-xs font-bold text-blue-800 uppercase tracking-wider border-r border-blue-200">
                                        Duty Saved (₹)
                                    </th>
                                    <th className="px-3 py-4 text-left text-xs font-bold text-blue-800 uppercase tracking-wider border-r border-blue-200">
                                        Duty Utilized
                                    </th>
                                    <th className="px-3 py-4 text-left text-xs font-bold text-blue-800 uppercase tracking-wider border-r border-blue-200">
                                        EO Data
                                    </th>
                                    <th className="px-3 py-4 text-left text-xs font-bold text-blue-800 uppercase tracking-wider border-r border-blue-200">
                                        Actual Export
                                    </th>
                                    <th className="px-3 py-4 text-left text-xs font-bold text-blue-800 uppercase tracking-wider border-r border-blue-200">
                                        Remarks
                                    </th>
                                    <th className="px-3 py-4 text-left text-xs font-bold text-blue-800 uppercase tracking-wider border-r border-blue-200">
                                        Upload Date
                                    </th>
                                    <th className="px-3 py-4 text-left text-xs font-bold text-blue-800 uppercase tracking-wider border-r border-blue-200">
                                        User Name
                                    </th>
                                    <th className="px-3 py-4 text-left text-xs font-bold text-blue-800 uppercase tracking-wider border-r border-blue-200">
                                        Company
                                    </th>
                                    <th className="px-3 py-4 text-left text-xs font-bold text-blue-800 uppercase tracking-wider">
                                        Email
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {epcgLicenseData.map((license, index) => (
                                    <tr key={license.id} className={`transition-all duration-200 hover:bg-blue-50 ${
                                        index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                                    }`}>
                                        {/* Sr No */}
                                        <td className="px-3 py-3 text-sm text-gray-900 border-r border-gray-200 font-medium">
                                            {license.srNo || '-'}
                                        </td>

                                        {/* Customer Name */}
                                        <td className="px-3 py-3 text-sm border-r border-gray-200">
                                            <div className="flex items-center space-x-2">
                                                <FontAwesomeIcon icon={faUser} className="text-green-500 text-xs" />
                                                <span className="font-medium text-gray-900">
                                                    {license.customerName || 'N/A'}
                                                </span>
                                            </div>
                                        </td>

                                        {/* License No */}
                                        <td className="px-3 py-3 text-sm border-r border-gray-200">
                                            <div className="flex items-center space-x-2">
                                                <FontAwesomeIcon icon={faIdCard} className="text-blue-500 text-xs" />
                                                <span className="font-medium text-blue-900">
                                                    {license.licenseNo || 'N/A'}
                                                </span>
                                            </div>
                                        </td>

                                        {/* License Date */}
                                        <td className="px-3 py-3 text-sm text-gray-700 border-r border-gray-200">
                                            {formatDate(license.licenseDate)}
                                        </td>

                                        {/* File No */}
                                        <td className="px-3 py-3 text-sm border-r border-gray-200">
                                            <div className="flex items-center space-x-2">
                                                <FontAwesomeIcon icon={faHashtag} className="text-purple-500 text-xs" />
                                                <span className="text-gray-900">
                                                    {license.fileNo || 'N/A'}
                                                </span>
                                            </div>
                                        </td>

                                        {/* File Date */}
                                        <td className="px-3 py-3 text-sm text-gray-700 border-r border-gray-200">
                                            {formatDate(license.fileDate)}
                                        </td>

                                        {/* License Type */}
                                        <td className="px-3 py-3 text-sm border-r border-gray-200">
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                                license.licenseType 
                                                    ? 'bg-blue-100 text-blue-800' 
                                                    : 'bg-gray-100 text-gray-600'
                                            }`}>
                                                {license.licenseType || 'N/A'}
                                            </span>
                                        </td>

                                        {/* BG Amount */}
                                        <td className="px-3 py-3 text-sm border-r border-gray-200">
                                            <div className="flex items-center space-x-1">
                                                <FontAwesomeIcon icon={faShield} className="text-orange-500 text-xs" />
                                                <span className="font-medium text-orange-700">
                                                    {formatCurrency(license.bankGuaranteeAmountRs)}
                                                </span>
                                            </div>
                                        </td>

                                        {/* BG Validity From */}
                                        <td className="px-3 py-3 text-sm text-gray-700 border-r border-gray-200">
                                            {formatDate(license.bankGuaranteeValidityFrom)}
                                        </td>

                                        {/* BG Validity To */}
                                        <td className="px-3 py-3 text-sm text-gray-700 border-r border-gray-200">
                                            {formatDate(license.bankGuaranteeValidityTo)}
                                        </td>

                                        {/* BG Submitted To */}
                                        <td className="px-3 py-3 text-sm text-gray-700 border-r border-gray-200 max-w-xs">
                                            <div className="truncate" title={license.bankGuaranteeSubmittedTo || 'N/A'}>
                                                {license.bankGuaranteeSubmittedTo || 'N/A'}
                                            </div>
                                        </td>

                                        {/* Duty Saved */}
                                        <td className="px-3 py-3 text-sm border-r border-gray-200">
                                            <div className="flex items-center space-x-1">
                                                <FontAwesomeIcon icon={faDollarSign} className="text-green-500 text-xs" />
                                                <span className="font-medium text-green-700">
                                                    {formatCurrency(license.dutySavedValueAmountInr)}
                                                </span>
                                            </div>
                                        </td>

                                        {/* Duty Utilized */}
                                        <td className="px-3 py-3 text-sm text-gray-700 border-r border-gray-200">
                                            {license.dutyUtilizedValue || 'N/A'}
                                        </td>

                                        {/* EO Data */}
                                        <td className="px-3 py-3 text-sm border-r border-gray-200">
                                            <div className="space-y-1">
                                                <div className="flex items-center space-x-1">
                                                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded font-medium">
                                                        Count: {license.DocumentEpcgLicenseEoAsPerLicense.length}
                                                    </span>
                                                </div>
                                                {license.DocumentEpcgLicenseEoAsPerLicense.length > 0 && (
                                                    <div className="max-h-20 overflow-y-auto space-y-1">
                                                        {license.DocumentEpcgLicenseEoAsPerLicense.slice(0, 2).map((eo, eoIndex) => (
                                                            <div key={eo.id} className="text-xs bg-blue-50 p-1 rounded">
                                                                <div className="font-medium text-blue-900 truncate">
                                                                    HS: {eo.hsCodeEoInr || 'N/A'}
                                                                </div>
                                                                <div className="text-blue-700 truncate">
                                                                    Desc: {eo.descriptionEoUsd || 'N/A'}
                                                                </div>
                                                            </div>
                                                        ))}
                                                        {license.DocumentEpcgLicenseEoAsPerLicense.length > 2 && (
                                                            <div className="text-xs text-blue-600 italic">
                                                                +{license.DocumentEpcgLicenseEoAsPerLicense.length - 2} more...
                                                            </div>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        </td>

                                        {/* Actual Export */}
                                        <td className="px-3 py-3 text-sm border-r border-gray-200">
                                            <div className="space-y-1">
                                                <div className="flex items-center space-x-1">
                                                    <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded font-medium">
                                                        Count: {license.DocumentEpcgLicenseActualExport.length}
                                                    </span>
                                                </div>
                                                {license.DocumentEpcgLicenseActualExport.length > 0 && (
                                                    <div className="max-h-20 overflow-y-auto space-y-1">
                                                        {license.DocumentEpcgLicenseActualExport.slice(0, 2).map((ae, aeIndex) => (
                                                            <div key={ae.id} className="text-xs bg-green-50 p-1 rounded">
                                                                <div className="font-medium text-green-900 truncate">
                                                                    HS: {ae.hsCodeEoImposedAsPerLicense || 'N/A'}
                                                                </div>
                                                                <div className="text-green-700 truncate">
                                                                    Years: {ae.descriptionNoOfYears || 'N/A'}
                                                                </div>
                                                                <div className="text-green-700 truncate">
                                                                    AEO: {ae.descriptionTotalAEOImposed || 'N/A'}
                                                                </div>
                                                            </div>
                                                        ))}
                                                        {license.DocumentEpcgLicenseActualExport.length > 2 && (
                                                            <div className="text-xs text-green-600 italic">
                                                                +{license.DocumentEpcgLicenseActualExport.length - 2} more...
                                                            </div>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        </td>

                                        {/* Remarks */}
                                        <td className="px-3 py-3 text-sm text-gray-700 border-r border-gray-200 max-w-xs">
                                            {license.remarks ? (
                                                <div className="flex items-start space-x-1">
                                                    <FontAwesomeIcon icon={faInfoCircle} className="text-blue-500 text-xs mt-0.5" />
                                                    <div className="truncate" title={license.remarks}>
                                                        {license.remarks}
                                                    </div>
                                                </div>
                                            ) : (
                                                <span className="text-gray-400 italic">No remarks</span>
                                            )}
                                        </td>

                                        {/* Upload Date */}
                                        <td className="px-3 py-3 text-sm border-r border-gray-200">
                                            <div className="flex items-center space-x-1">
                                                <FontAwesomeIcon icon={faCalendar} className="text-gray-500 text-xs" />
                                                <span className="text-gray-700">
                                                    {formatDate(license.uploadedDate)}
                                                </span>
                                            </div>
                                        </td>

                                        {/* User Name */}
                                        <td className="px-3 py-3 text-sm border-r border-gray-200">
                                            <div className="flex items-center space-x-1">
                                                <FontAwesomeIcon icon={faUser} className="text-indigo-500 text-xs" />
                                                <span className="font-medium text-gray-900">
                                                    {license.user.contactPersonName || 'Unknown'}
                                                </span>
                                            </div>
                                        </td>

                                        {/* Company */}
                                        <td className="px-3 py-3 text-sm border-r border-gray-200 max-w-xs">
                                            <div className="flex items-center space-x-1">
                                                <FontAwesomeIcon icon={faBuilding} className="text-gray-500 text-xs" />
                                                <div className="truncate" title={license.user.companyName || 'N/A'}>
                                                    {license.user.companyName || 'N/A'}
                                                </div>
                                            </div>
                                        </td>

                                        {/* Email */}
                                        <td className="px-3 py-3 text-sm text-gray-700">
                                            <div className="truncate max-w-xs" title={license.user.email || 'N/A'}>
                                                {license.user.email || 'N/A'}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Load More Button */}
                    {pagination?.hasMore && (
                        <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
                            <div className="text-center">
                                <button
                                    onClick={loadMore}
                                    disabled={loading}
                                    className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 text-white px-6 py-2 rounded-lg font-medium transition-colors flex items-center justify-center mx-auto"
                                >
                                    {loading ? (
                                        <>
                                            <FontAwesomeIcon icon={faSpinner} className="mr-2 animate-spin" />
                                            Loading...
                                        </>
                                    ) : (
                                        <>
                                            <FontAwesomeIcon icon={faChevronDown} className="mr-2" />
                                            Load More
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Empty State */}
                    {epcgLicenseData.length === 0 && !loading && (
                        <div className="text-center py-12">
                            <FontAwesomeIcon icon={faInbox} className="text-gray-400 text-4xl mb-4" />
                            <h3 className="text-lg font-medium text-gray-900 mb-2">No EPCG License Data Found</h3>
                            <p className="text-gray-500 mb-4">
                                {searchTerm ? "Try adjusting your search terms." : "No data has been uploaded yet."}
                            </p>
                            {searchTerm && (
                                <button
                                    onClick={() => handleSearch("")}
                                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                                >
                                    Clear Search
                                </button>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default EPCGLicenseReport;


