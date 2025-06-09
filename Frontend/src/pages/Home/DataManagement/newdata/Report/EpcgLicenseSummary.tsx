import React, { useEffect, useMemo, useState } from 'react';
import { useRecoilValue } from 'recoil';
import axios from 'axios';
import { useCookies } from 'react-cookie';
import { authAtom } from '../../../../../atoms/authAtom';
import { CustomerDetail } from '../../../../utility/types/customerDetail';
import { fetchCustomers } from '../../../../utility/dataFetch';
import { fetchEpcgLicenseBySrNo } from '../../../../utility/epcgService';
import { BACKEND_URL } from '../../../../../Globle';
import Loading from '../../../../components/Loading';
import InputField from '../../../../components/InputField';
import Divider from '../../../../components/Divider';
import NewDataButtons from '../NewDataButtons';
import { useNavigate } from 'react-router-dom';

const EpcgLicenseSummary = () => {

    const { user } = useRecoilValue(authAtom);
    const [cookies] = useCookies(['token']);    const [loading, setLoading] = useState(false);
    const [customerNames, setCustomerNames] = useState<CustomerDetail[]>([]);
      // State for array data from database
    const [hsCodeEoList, setHsCodeEoList] = useState<any[]>([]);
    const [averageExportList, setAverageExportList] = useState<any[]>([]);

    // Functions to handle array operations
    const addHsCodeEoEntry = () => {
        setHsCodeEoList([...hsCodeEoList, { hsCodeEoInr: '', descriptionEoUsd: '' }]);
    };

    const removeHsCodeEoEntry = (index: number) => {
        const updatedList = hsCodeEoList.filter((_, i) => i !== index);
        setHsCodeEoList(updatedList);
        // Update single value fields if first entry was removed
        if (index === 0 && updatedList.length > 0) {
            setEpcgLicenseDetails(prev => ({
                ...prev,
                hsCodeEoInr: updatedList[0].hsCodeEoInr || '',
                descriptionEoUsd: updatedList[0].descriptionEoUsd || ''
            }));
        } else if (updatedList.length === 0) {
            setEpcgLicenseDetails(prev => ({
                ...prev,
                hsCodeEoInr: '',
                descriptionEoUsd: ''
            }));
        }
    };

    const addAverageExportEntry = () => {
        setAverageExportList([...averageExportList, { hsCodeEoImposedAsPerLicense: '', descriptionNoOfYears: '' }]);
    };

    const removeAverageExportEntry = (index: number) => {
        const updatedList = averageExportList.filter((_, i) => i !== index);
        setAverageExportList(updatedList);
        // Update single value fields if first entry was removed
        if (index === 0 && updatedList.length > 0) {
            setEpcgLicenseDetails(prev => ({
                ...prev,
                hsCodeEoImposedAsPerLicense: updatedList[0].hsCodeEoImposedAsPerLicense || '',
                descriptionNoOfYears: updatedList[0].descriptionNoOfYears || ''
            }));
        } else if (updatedList.length === 0) {
            setEpcgLicenseDetails(prev => ({
                ...prev,
                hsCodeEoImposedAsPerLicense: '',
                descriptionNoOfYears: ''
            }));
        }
    };

    const navigate = useNavigate()

    // Drop Down means - type = select and opttion = array of given things    // State to manage EPCG License details
    const [epcgLicenseDetails, setEpcgLicenseDetails] = useState({
        srNo: '', // A // no calculation  // Number  // manualy
        partyName: '', // B // no calculation  // Customer Name Drop Down Fetch from Customer List
        licenseNo: '', // C // no calculation // Number
        licenseDate: '', // D // no calculation // Date
        fileNo: '', // E // no calculation // Number
        fileDate: '', // F  // no calculation // Date  // manualy
        licenseType: '', // G // no calculation // Drop Down [Domestic, Import]
        bankGuaranteeAmountRs: '', // H // no calculation  // Number
        bankGuaranteeValidityFrom: '', // I.1 // no calculation // Date
        bankGuaranteeValidityTo: '', // I.2 // no calculation // Date
        bankGuaranteeSubmittedTo: '', // J // no calculation // text
        dutySavedValueAmountInr: '', // K // no calculation // Number

        hsCodeEoInr: '', // L // no calculation // Number (from array)
        descriptionEoUsd: '', // M // no calculation // Number (from array)

        dutyUtilizedValue: '', // N // no calculation // Number
        hsCodeAsPerEoFullfillmentSummaryEoInr: '', // O // (L * N) / K // Number 
        descriptionAsPerEoFullfillmentSummaryEoUsd: '', // P // (M * N) / K // Number
        installationDate: '', // Q // no calculation // Date  // manualy

        hsCodeEoImposedAsPerLicense: '', // R // no calculation // Number (from array)
        descriptionNoOfYears: '', // S // no calculation // Number (from array)
        descriptionTotalAEOImposed: '', // T // (R * S) // Number
        averageExportFulfilledInr: '', // U // no calculation // Number
        averageExportNoOfShippingBills: '', // V // no calculation // Number
        averageExportFulfilledPercent: '', // W // (U / T) // Number

        block1stImposedBlockCompletionDate: '', // X // (D + 4 years - 1 day) // Date
        block1stImposedBlockExtension: '', // Y // no calculation // Drop Down [Yes, No]  // manualy
        block1stImposedExtensionYearIfAny: '', // Z // no calculation // Drop Down [5 years, 6 years]  // manualy
        block1stImposedBlockExtensionDate: '', // AA // (D + 6 years - 1 day) // Date
        block1stImposedBlockBlanceDaysCompletionDate: '', // AB (X - Current Date) // Number
        block1stImposedBlockBlanceDaysExtensionDate: '', // AC (AA - Current Date) // Number
        block1stImposedEoInr: '', // AD // (O * 50%) // Number
        block1stImposedEoUsd: '', // AE // (P * 50%) // Number
    });    // Load data from localStorage on component mount
    useEffect(() => {
        const savedData = localStorage.getItem('epcgLicenseDetails');
        const savedHsCodeList = localStorage.getItem('hsCodeEoList');
        const savedExportList = localStorage.getItem('averageExportList');

        if (savedData) {
            setEpcgLicenseDetails(JSON.parse(savedData));
        }
        if (savedHsCodeList) {
            setHsCodeEoList(JSON.parse(savedHsCodeList));
        }
        if (savedExportList) {
            setAverageExportList(JSON.parse(savedExportList));
        }

        setLoading(true);
        fetchCustomers(cookies.token).then((data) => {
            setCustomerNames(data);
            setLoading(false);
        })

        setLoading(false);
    }, []);

    // Save to localStorage whenever data changes
    useEffect(() => {
        localStorage.setItem('epcgLicenseDetails', JSON.stringify(epcgLicenseDetails));
    }, [epcgLicenseDetails]);

    useEffect(() => {
        localStorage.setItem('hsCodeEoList', JSON.stringify(hsCodeEoList));
    }, [hsCodeEoList]);

    useEffect(() => {
        localStorage.setItem('averageExportList', JSON.stringify(averageExportList));
    }, [averageExportList]);// Fetch EPCG License data when srNo changes
    useEffect(() => {
        if (epcgLicenseDetails.srNo && epcgLicenseDetails.srNo !== '') {
            setLoading(true);
            fetchEpcgLicenseBySrNo(cookies.token, epcgLicenseDetails.srNo)
                .then((response) => {
                    if (response.data) {
                        const data = response.data;


                        
                        // Get first element from arrays for single value fields
                        const hsCodeData = data.DocumentEpcgLicenseEoAsPerLicense?.[0] || {};
                        const exportData = data.DocumentEpcgLicenseActualExport?.[0] || {};

                        console.log('Fetched EPCG License Data:', data);    
                        
                        
                        // Map backend data to frontend state
                        setEpcgLicenseDetails(prev => ({
                            ...prev,
                            srNo: data.srNo || '',
                            partyName: data.customerName || '',
                            licenseNo: data.licenseNo || '',
                            licenseDate: data.licenseDate ? new Date(data.licenseDate).toISOString().split('T')[0] : '',
                            fileNo: data.fileNo || '',
                            fileDate: data.fileDate ? new Date(data.fileDate).toISOString().split('T')[0] : '',
                            licenseType: data.licenseType || '',
                            bankGuaranteeAmountRs: data.bankGuaranteeAmountRs || '',
                            bankGuaranteeValidityFrom: data.bankGuaranteeValidityFrom ? new Date(data.bankGuaranteeValidityFrom).toISOString().split('T')[0] : '',
                            bankGuaranteeValidityTo: data.bankGuaranteeValidityTo ? new Date(data.bankGuaranteeValidityTo).toISOString().split('T')[0] : '',
                            bankGuaranteeSubmittedTo: data.bankGuaranteeSubmittedTo || '',
                            dutySavedValueAmountInr: data.dutySavedValueAmountInr || '',
                            
                            // Array data - taking first element
                            hsCodeEoInr: hsCodeData.hsCodeEoInr || '',
                            descriptionEoUsd: hsCodeData.descriptionEoUsd || '',
                            
                            dutyUtilizedValue: data.dutyUtilizedValue || '',
                            
                            // Array data from actual export
                            hsCodeEoImposedAsPerLicense: exportData.hsCodeEoImposedAsPerLicense || '',
                            descriptionNoOfYears: exportData.descriptionNoOfYears || '',
                            
                            averageExportFulfilledInr: data.averageExportFulfilledInr || '',
                            averageExportNoOfShippingBills: data.averageExportNoOfShippingBills || '',
                            block1stImposedBlockExtension: data.block1stImposedBlockExtension || '',
                            block1stImposedExtensionYearIfAny: data.block1stImposedExtensionYearIfAny || '',
                        }));
                        
                        // Set array data
                        setHsCodeEoList(data.DocumentEpcgLicenseEoAsPerLicense || []);
                        setAverageExportList(data.DocumentEpcgLicenseActualExport || []);
                    }
                })
                .catch((error) => {
                    console.error('Error fetching EPCG License data:', error);
                })
                .finally(() => {
                    setLoading(false);
                });
        }
    }, [epcgLicenseDetails.srNo, cookies.token]);    const calculatedEpcgLicenseDetails = useMemo(() => {
        const {
            dutySavedValueAmountInr,
            hsCodeEoInr,
            descriptionEoUsd,
            dutyUtilizedValue,
            licenseDate,
            hsCodeEoImposedAsPerLicense,
            descriptionNoOfYears,
        } = epcgLicenseDetails;

        // Helper function to safely parse numbers
        const safeNumber = (value: string) => {
            const num = parseFloat(value);
            return isNaN(num) ? 0 : num;
        };

        // O = (L * N) / K
        const L = safeNumber(hsCodeEoInr);
        const N = safeNumber(dutyUtilizedValue);
        const K = safeNumber(dutySavedValueAmountInr);
        const O = K !== 0 ? String((L * N) / K) : '0';
        
        // P = (M * N) / K  
        const M = safeNumber(descriptionEoUsd);
        const P = K !== 0 ? String((M * N) / K) : '0';
        
        // T = (R * S)
        const R = safeNumber(hsCodeEoImposedAsPerLicense);
        const S = safeNumber(descriptionNoOfYears);
        const T = String(R * S);
        
        // W = (U / T) * 100
        const U = safeNumber(epcgLicenseDetails.averageExportFulfilledInr);
        const T_num = safeNumber(T);
        const W = T_num !== 0 ? String((U / T_num) * 100) : '0';
        
        // X = (D + 4 years - 1 day)
        const X = licenseDate ? (() => {
            const date = new Date(licenseDate);
            date.setFullYear(date.getFullYear() + 4);
            date.setDate(date.getDate() - 1);
            return date.toISOString().split('T')[0];
        })() : '';
        
        // AA = (D + 6 years - 1 day)
        const AA = licenseDate ? (() => {
            const date = new Date(licenseDate);
            date.setFullYear(date.getFullYear() + 6);
            date.setDate(date.getDate() - 1);
            return date.toISOString().split('T')[0];
        })() : '';
        
        // AB = (X - Current Date)
        const AB = X ? String(Math.ceil((new Date(X).getTime() - new Date().getTime()) / (1000 * 3600 * 24))) : '0';
        
        // AC = (AA - Current Date)
        const AC = AA ? String(Math.ceil((new Date(AA).getTime() - new Date().getTime()) / (1000 * 3600 * 24))) : '0';
        
        // AD = (O * 50%)
        const AD = String(safeNumber(O) * 0.5);
        
        // AE = (P * 50%)
        const AE = String(safeNumber(P) * 0.5);

        return {
            ...epcgLicenseDetails,
            hsCodeAsPerEoFullfillmentSummaryEoInr: O,
            descriptionAsPerEoFullfillmentSummaryEoUsd: P,
            descriptionTotalAEOImposed: T,
            averageExportFulfilledPercent: W,
            block1stImposedBlockCompletionDate: X,
            block1stImposedBlockExtensionDate: AA,
            block1stImposedBlockBlanceDaysCompletionDate: AB,
            block1stImposedBlockBlanceDaysExtensionDate: AC,
            block1stImposedEoInr: AD,
            block1stImposedEoUsd: AE,
        };
    }, [
        epcgLicenseDetails.dutySavedValueAmountInr,
        epcgLicenseDetails.hsCodeEoInr,
        epcgLicenseDetails.descriptionEoUsd,
        epcgLicenseDetails.dutyUtilizedValue,
        epcgLicenseDetails.licenseDate,
        epcgLicenseDetails.hsCodeEoImposedAsPerLicense,
        epcgLicenseDetails.descriptionNoOfYears,
        epcgLicenseDetails.averageExportFulfilledInr,
    ]);useEffect(() => {
        setEpcgLicenseDetails(prev => ({
            ...prev,
            ...calculatedEpcgLicenseDetails,
        }));
    }, [
        calculatedEpcgLicenseDetails.hsCodeAsPerEoFullfillmentSummaryEoInr,
        calculatedEpcgLicenseDetails.descriptionAsPerEoFullfillmentSummaryEoUsd,
        calculatedEpcgLicenseDetails.descriptionTotalAEOImposed,
        calculatedEpcgLicenseDetails.averageExportFulfilledPercent,
        calculatedEpcgLicenseDetails.block1stImposedBlockBlanceDaysCompletionDate,
        calculatedEpcgLicenseDetails.block1stImposedBlockBlanceDaysExtensionDate,
        calculatedEpcgLicenseDetails.block1stImposedEoInr,        calculatedEpcgLicenseDetails.block1stImposedEoUsd,
    ]);    // Validation function
    const validateForm = () => {
        const requiredFields = [
            { field: 'srNo', label: 'SR No' },
            { field: 'partyName', label: 'Party Name' },
            { field: 'licenseNo', label: 'License No' },
            { field: 'licenseDate', label: 'License Date' },
            { field: 'dutySavedValueAmountInr', label: 'Duty Saved Value Amount' }
        ];

        const missingFields = requiredFields.filter(({ field }) => 
            !epcgLicenseDetails[field as keyof typeof epcgLicenseDetails] || 
            epcgLicenseDetails[field as keyof typeof epcgLicenseDetails] === ''
        );

        if (missingFields.length > 0) {
            const fieldNames = missingFields.map(f => f.label).join(', ');
            alert(`Please fill in the following required fields: ${fieldNames}`);
            return false;
        }

        if (hsCodeEoList.length === 0) {
            alert('Please add at least one EO entry');
            return false;
        }

        if (averageExportList.length === 0) {
            alert('Please add at least one export entry');
            return false;
        }

        return true;
    };

    // Reset form function
    const resetForm = () => {
        if (confirm('Are you sure you want to clear all form data? This action cannot be undone.')) {
            const initialState = {
                srNo: '',
                partyName: '',
                licenseNo: '',
                licenseDate: '',
                fileNo: '',
                fileDate: '',
                licenseType: '',
                bankGuaranteeAmountRs: '',
                bankGuaranteeValidityFrom: '',
                bankGuaranteeValidityTo: '',
                bankGuaranteeSubmittedTo: '',
                dutySavedValueAmountInr: '',
                hsCodeEoInr: '',
                descriptionEoUsd: '',
                dutyUtilizedValue: '',
                hsCodeAsPerEoFullfillmentSummaryEoInr: '',
                descriptionAsPerEoFullfillmentSummaryEoUsd: '',
                installationDate: '',
                hsCodeEoImposedAsPerLicense: '',
                descriptionNoOfYears: '',
                descriptionTotalAEOImposed: '',
                averageExportFulfilledInr: '',
                averageExportNoOfShippingBills: '',
                averageExportFulfilledPercent: '',
                block1stImposedBlockCompletionDate: '',
                block1stImposedBlockExtension: '',
                block1stImposedExtensionYearIfAny: '',
                block1stImposedBlockExtensionDate: '',
                block1stImposedBlockBlanceDaysCompletionDate: '',
                block1stImposedBlockBlanceDaysExtensionDate: '',
                block1stImposedEoInr: '',
                block1stImposedEoUsd: '',
            };            setEpcgLicenseDetails(initialState);
            setHsCodeEoList([]);
            setAverageExportList([]);
            
            // Clear localStorage
            localStorage.removeItem('epcgLicenseDetails');
            localStorage.removeItem('hsCodeEoList');
            localStorage.removeItem('averageExportList');
            localStorage.removeItem('epcgAnalyticsData');
        }
    };

    return (


        <div className="bg-[#f5f5f5] w-full h-full min-h-screen">


            <div className="container mx-auto px-4 py-8">
                {loading && <Loading />}

                <div className="container mx-auto px-4 py-4">
                    <div className="container text-center text-green-700 font-sans font-semibold text-[24px]">
                        EPCG License Summary
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 mt-2 gap-4">
                        <div className="bg-white p-4 rounded-md">
                            <div className="container text-center text-green-700 font-sans font-semibold text-lg">
                                Basic Details
                            </div>
                            <InputField
                                label="Sr No"
                                value={epcgLicenseDetails.srNo}
                                onChange={(e) =>
                                    setEpcgLicenseDetails({ ...epcgLicenseDetails, srNo: e.target.value })
                                }
                                type="number"
                            />
                            <InputField
                                label="Party Name"
                                type="select"
                                options={
                                    customerNames.map((customer) => customer.customerName)
                                }
                                value={epcgLicenseDetails.partyName}
                                onChange={(e) =>
                                    setEpcgLicenseDetails({ ...epcgLicenseDetails, partyName: e.target.value })
                                }
                            />
                            <InputField
                                label="File No"
                                value={epcgLicenseDetails.fileNo}
                                onChange={(e) =>
                                    setEpcgLicenseDetails({ ...epcgLicenseDetails, fileNo: e.target.value })
                                }
                                type="text"
                            />
                            <InputField
                                label="File Date"
                                value={epcgLicenseDetails.fileDate}
                                onChange={(e) =>
                                    setEpcgLicenseDetails({ ...epcgLicenseDetails, fileDate: e.target.value })
                                }
                                type="date"
                            />
                            <InputField
                                label="License No"
                                value={epcgLicenseDetails.licenseNo}
                                onChange={(e) =>
                                    setEpcgLicenseDetails({ ...epcgLicenseDetails, licenseNo: e.target.value })
                                }
                                type="number"
                            />
                            <InputField
                                label="License Date"
                                value={epcgLicenseDetails.licenseDate}
                                onChange={(e) =>
                                    setEpcgLicenseDetails({ ...epcgLicenseDetails, licenseDate: e.target.value })
                                }
                                type="date"
                            />
                            <InputField
                                label="License Type"
                                value={epcgLicenseDetails.licenseType}
                                onChange={(e) =>
                                    setEpcgLicenseDetails({ ...epcgLicenseDetails, licenseType: e.target.value })
                                }
                                options={['Domestic', 'Import']}
                                type="select"
                            />
                        </div>
                        <div className="bg-white p-4 rounded-md">
                            <div className="container text-center text-green-700 font-sans font-semibold text-lg">
                                Bank Guarantee Details
                            </div>
                            <InputField
                                label="Amount (Rs)"
                                value={epcgLicenseDetails.bankGuaranteeAmountRs}
                                onChange={(e) =>
                                    setEpcgLicenseDetails({ ...epcgLicenseDetails, bankGuaranteeAmountRs: e.target.value })
                                }
                                type="number"
                            />
                            <InputField
                                label="Submitted To"
                                value={epcgLicenseDetails.bankGuaranteeSubmittedTo}
                                onChange={(e) =>
                                    setEpcgLicenseDetails({ ...epcgLicenseDetails, bankGuaranteeSubmittedTo: e.target.value })
                                }
                                type="text"
                            />
                            <InputField
                                label="Validity From"
                                value={epcgLicenseDetails.bankGuaranteeValidityFrom}
                                onChange={(e) =>
                                    setEpcgLicenseDetails({ ...epcgLicenseDetails, bankGuaranteeValidityFrom: e.target.value })
                                }
                                type="date"
                            />
                            <InputField
                                label="Validity To"
                                value={epcgLicenseDetails.bankGuaranteeValidityTo}
                                onChange={(e) =>
                                    setEpcgLicenseDetails({ ...epcgLicenseDetails, bankGuaranteeValidityTo: e.target.value })
                                }
                                type="date"
                            />
                        </div>                        <div className="bg-white p-4 rounded-md">
                            <div className="container text-center text-green-700 font-sans font-semibold text-lg">
                                Duty Saved Value (As per License)
                            </div>
                            <InputField
                                label="Amount (INR)"
                                value={epcgLicenseDetails.dutySavedValueAmountInr}
                                onChange={(e) =>
                                    setEpcgLicenseDetails({ ...epcgLicenseDetails, dutySavedValueAmountInr: e.target.value })
                                }
                                type="number"
                            />
                              <Divider />
                            <div className="container text-center text-green-700 font-sans font-semibold text-base mt-4 mb-2">
                                EO As Per License (Array Data)
                            </div>
                            
                            <div className="flex justify-end mb-3">
                                <button
                                    type="button"
                                    onClick={addHsCodeEoEntry}
                                    className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm"
                                >
                                    + Add EO Entry
                                </button>
                            </div>
                            
                            {hsCodeEoList.length > 0 ? (
                                hsCodeEoList.map((item, index) => (
                                    <div key={item.id || index} className="border p-3 mb-3 rounded bg-gray-50">
                                        <div className="flex justify-between items-center mb-2">
                                            <div className="text-sm font-semibold text-gray-600">Entry {index + 1}</div>
                                            {hsCodeEoList.length > 1 && (
                                                <button
                                                    type="button"
                                                    onClick={() => removeHsCodeEoEntry(index)}
                                                    className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded text-xs"
                                                >
                                                    Remove
                                                </button>
                                            )}
                                        </div>
                                        <InputField
                                            label="HS Code EO (INR)"
                                            value={item.hsCodeEoInr || ''}
                                            onChange={(e) => {
                                                const updatedList = [...hsCodeEoList];
                                                updatedList[index] = { ...updatedList[index], hsCodeEoInr: e.target.value };
                                                setHsCodeEoList(updatedList);
                                                // Update the single value fields for calculations
                                                if (index === 0) {
                                                    setEpcgLicenseDetails(prev => ({ ...prev, hsCodeEoInr: e.target.value }));
                                                }
                                            }}
                                            type="number"
                                        />
                                        <InputField
                                            label="Description EO (USD)"
                                            value={item.descriptionEoUsd || ''}
                                            onChange={(e) => {
                                                const updatedList = [...hsCodeEoList];
                                                updatedList[index] = { ...updatedList[index], descriptionEoUsd: e.target.value };
                                                setHsCodeEoList(updatedList);
                                                // Update the single value fields for calculations
                                                if (index === 0) {
                                                    setEpcgLicenseDetails(prev => ({ ...prev, descriptionEoUsd: e.target.value }));
                                                }
                                            }}
                                            type="number"
                                        />
                                    </div>
                                ))
                            ) : (
                                <div className="text-gray-500 text-center py-4">
                                    No EO data available
                                    <div className="mt-2">
                                        <button
                                            type="button"
                                            onClick={addHsCodeEoEntry}
                                            className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm"
                                        >
                                            Add First Entry
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                        <div className="bg-white p-4 rounded-md">
                            <div className="container text-center text-green-700 font-sans font-semibold text-lg">
                                Actual Utilization Base
                            </div>                            <InputField
                                label="Duty Utilized Value"
                                value={epcgLicenseDetails.dutyUtilizedValue}
                                onChange={(e) =>
                                    setEpcgLicenseDetails({ ...epcgLicenseDetails, dutyUtilizedValue: e.target.value })
                                }
                                type="number"
                            />
                            <InputField
                                label="HS Code (INR)"
                                value={epcgLicenseDetails.hsCodeAsPerEoFullfillmentSummaryEoInr}
                                onChange={(e) =>
                                    setEpcgLicenseDetails({ ...epcgLicenseDetails, hsCodeAsPerEoFullfillmentSummaryEoInr: e.target.value })
                                }
                                type="number"
                            />
                            <InputField
                                label="Description (USD)"
                                value={epcgLicenseDetails.descriptionAsPerEoFullfillmentSummaryEoUsd}
                                onChange={(e) =>
                                    setEpcgLicenseDetails({ ...epcgLicenseDetails, descriptionAsPerEoFullfillmentSummaryEoUsd: e.target.value })
                                }
                                type="number"
                            />
                            <Divider />
                            <InputField
                                label="Installation Date"
                                value={epcgLicenseDetails.installationDate}
                                onChange={(e) =>
                                    setEpcgLicenseDetails({ ...epcgLicenseDetails, installationDate: e.target.value })
                                }
                                type="date"
                            />
                        </div>                        <div className="bg-white p-4 rounded-md">
                            <div className="container text-center text-green-700 font-sans font-semibold text-lg">
                                Average Export (INR)
                            </div>
                              <div className="container text-center text-green-700 font-sans font-semibold text-base mt-4 mb-2">
                                Actual Export Data (Array Data)
                            </div>
                            
                            <div className="flex justify-end mb-3">
                                <button
                                    type="button"
                                    onClick={addAverageExportEntry}
                                    className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm"
                                >
                                    + Add Export Entry
                                </button>
                            </div>
                            
                            {averageExportList.length > 0 ? (
                                averageExportList.map((item, index) => (
                                    <div key={item.id || index} className="border p-3 mb-3 rounded bg-gray-50">
                                        <div className="flex justify-between items-center mb-2">
                                            <div className="text-sm font-semibold text-gray-600">Export Entry {index + 1}</div>
                                            {averageExportList.length > 1 && (
                                                <button
                                                    type="button"
                                                    onClick={() => removeAverageExportEntry(index)}
                                                    className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded text-xs"
                                                >
                                                    Remove
                                                </button>
                                            )}
                                        </div>
                                        <InputField
                                            label="Imposed As Per License (INR)"
                                            value={item.hsCodeEoImposedAsPerLicense || ''}
                                            onChange={(e) => {
                                                const updatedList = [...averageExportList];
                                                updatedList[index] = { ...updatedList[index], hsCodeEoImposedAsPerLicense: e.target.value };
                                                setAverageExportList(updatedList);
                                                // Update the single value fields for calculations
                                                if (index === 0) {
                                                    setEpcgLicenseDetails(prev => ({ ...prev, hsCodeEoImposedAsPerLicense: e.target.value }));
                                                }
                                            }}
                                            type="number"
                                        />
                                        <InputField
                                            label="No Of Years"
                                            value={item.descriptionNoOfYears || ''}
                                            onChange={(e) => {
                                                const updatedList = [...averageExportList];
                                                updatedList[index] = { ...updatedList[index], descriptionNoOfYears: e.target.value };
                                                setAverageExportList(updatedList);
                                                // Update the single value fields for calculations
                                                if (index === 0) {
                                                    setEpcgLicenseDetails(prev => ({ ...prev, descriptionNoOfYears: e.target.value }));
                                                }
                                            }}
                                            type="number"
                                        />
                                    </div>
                                ))
                            ) : (
                                <div className="text-gray-500 text-center py-4">
                                    No actual export data available
                                    <div className="mt-2">
                                        <button
                                            type="button"
                                            onClick={addAverageExportEntry}
                                            className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm"
                                        >
                                            Add First Entry
                                        </button>
                                    </div>
                                </div>
                            )}

                            <Divider />
                            <div className="container text-center text-green-700 font-sans font-semibold text-base mt-4 mb-2">
                                Calculated Values
                            </div>
                            
                            <InputField
                                label="Total AEO Imposed (INR)"
                                value={epcgLicenseDetails.descriptionTotalAEOImposed}
                                onChange={(e) =>
                                    setEpcgLicenseDetails({ ...epcgLicenseDetails, descriptionTotalAEOImposed: e.target.value })
                                }
                                type="number"
                            />
                            <InputField
                                label="Fulfilled (INR)"
                                value={epcgLicenseDetails.averageExportFulfilledInr}
                                onChange={(e) =>
                                    setEpcgLicenseDetails({ ...epcgLicenseDetails, averageExportFulfilledInr: e.target.value })
                                }
                                type="number"
                            />
                            <InputField
                                label="No Of Shipping Bills"
                                value={epcgLicenseDetails.averageExportNoOfShippingBills}
                                onChange={(e) =>
                                    setEpcgLicenseDetails({ ...epcgLicenseDetails, averageExportNoOfShippingBills: e.target.value })
                                }
                                type="number"
                            />
                            <InputField
                                label="Fulfilled (%)"
                                value={epcgLicenseDetails.averageExportFulfilledPercent}
                                onChange={(e) =>
                                    setEpcgLicenseDetails({ ...epcgLicenseDetails, averageExportFulfilledPercent: e.target.value })
                                }
                                type="number"
                            />
                        </div>
                        <div className="bg-white p-4 rounded-md">
                            <div className="container text-center text-green-700 font-sans font-semibold text-lg">
                                Block 1st Imposed
                            </div>
                            <InputField
                                label="Block Completion Date"
                                value={epcgLicenseDetails.block1stImposedBlockCompletionDate}
                                onChange={(e) =>
                                    setEpcgLicenseDetails({ ...epcgLicenseDetails, block1stImposedBlockCompletionDate: e.target.value })
                                }
                                type="date"
                            />
                            <InputField
                                label="Block Extension"
                                value={epcgLicenseDetails.block1stImposedBlockExtension}
                                onChange={(e) =>
                                    setEpcgLicenseDetails({ ...epcgLicenseDetails, block1stImposedBlockExtension: e.target.value })
                                }
                                options={['Yes', 'No']}
                                type="select"
                            />
                            <InputField
                                label="Extension Year If Any"
                                value={epcgLicenseDetails.block1stImposedExtensionYearIfAny}
                                onChange={(e) =>
                                    setEpcgLicenseDetails({ ...epcgLicenseDetails, block1stImposedExtensionYearIfAny: e.target.value })
                                }
                                options={['5 years', '6 years']}
                                type="select"
                            />
                            <InputField
                                label="Block Extension Date"
                                value={epcgLicenseDetails.block1stImposedBlockExtensionDate}
                                onChange={(e) =>
                                    setEpcgLicenseDetails({ ...epcgLicenseDetails, block1stImposedBlockExtensionDate: e.target.value })
                                }
                                type="date"
                            />
                            <InputField
                                label="Balance Days Completion Date"
                                value={epcgLicenseDetails.block1stImposedBlockBlanceDaysCompletionDate}
                                onChange={(e) =>
                                    setEpcgLicenseDetails({ ...epcgLicenseDetails, block1stImposedBlockBlanceDaysCompletionDate: e.target.value })
                                }
                                type="number"
                            />
                            <InputField
                                label="Balance Days Extension Date"
                                value={epcgLicenseDetails.block1stImposedBlockBlanceDaysExtensionDate}
                                onChange={(e) =>
                                    setEpcgLicenseDetails({ ...epcgLicenseDetails, block1stImposedBlockBlanceDaysExtensionDate: e.target.value })
                                }
                                type="number"
                            />
                            <InputField
                                label="EO (INR)"
                                value={epcgLicenseDetails.block1stImposedEoInr}
                                onChange={(e) =>
                                    setEpcgLicenseDetails({ ...epcgLicenseDetails, block1stImposedEoInr: e.target.value })
                                }
                                type="number"
                            />
                            <InputField
                                label="EO (USD)"
                                value={epcgLicenseDetails.block1stImposedEoUsd}
                                onChange={(e) =>
                                    setEpcgLicenseDetails({ ...epcgLicenseDetails, block1stImposedEoUsd: e.target.value })
                                }
                                type="number"
                            />                        </div>
                    </div>
                      {/* Summary Section */}
                    <div className="bg-blue-50 p-4 rounded-md border-l-4 border-blue-500 mb-4">
                        <div className="container text-center text-blue-700 font-sans font-semibold text-lg mb-4">
                            Summary & Calculated Values
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div className="text-sm">
                                <strong>EO Array Entries:</strong> {hsCodeEoList.length} entries
                            </div>
                            <div className="text-sm">
                                <strong>Export Array Entries:</strong> {averageExportList.length} entries
                            </div>
                            <div className="text-sm">
                                <strong>Total AEO Imposed:</strong> {epcgLicenseDetails.descriptionTotalAEOImposed || 'Not calculated'}
                            </div>
                            <div className="text-sm">
                                <strong>Fulfillment %:</strong> {epcgLicenseDetails.averageExportFulfilledPercent ? `${parseFloat(epcgLicenseDetails.averageExportFulfilledPercent).toFixed(2)}%` : 'Not calculated'}
                            </div>
                            <div className="text-sm">
                                <strong>Block Completion Date:</strong> {epcgLicenseDetails.block1stImposedBlockCompletionDate || 'Not calculated'}
                            </div>
                            <div className="text-sm">
                                <strong>Balance Days:</strong> {epcgLicenseDetails.block1stImposedBlockBlanceDaysCompletionDate ? `${epcgLicenseDetails.block1stImposedBlockBlanceDaysCompletionDate} days` : 'Not calculated'}
                            </div>
                        </div>
                        <div className="text-center">
                            <button
                                type="button"
                                onClick={resetForm}
                                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
                            >
                                Clear All Data
                            </button>
                        </div>
                    </div>                      <NewDataButtons
                        backLink=""
                        nextLink=""                        handleSubmit={() => {
                            // Validate form before navigation
                            if (!validateForm()) {
                                return;
                            }

                            // Prepare complete data including arrays for analytics
                            const analyticsData = {
                                ...calculatedEpcgLicenseDetails,
                                DocumentEpcgLicenseEoAsPerLicense: hsCodeEoList,
                                DocumentEpcgLicenseActualExport: averageExportList
                            };
                            
                            // Store data in both localStorage and sessionStorage for analytics page
                            localStorage.setItem('epcgAnalyticsData', JSON.stringify(analyticsData));
                            sessionStorage.setItem('epcgAnalyticsData', JSON.stringify(analyticsData));
                            
                            // Navigate to analytics page
                            navigate('/datamanagement/newdata/report/epcg-analytics');
                        }}
                        buttonText='View Analytics'
                    />
                </div>
            </div>
        </div>
    );
};

export default EpcgLicenseSummary;