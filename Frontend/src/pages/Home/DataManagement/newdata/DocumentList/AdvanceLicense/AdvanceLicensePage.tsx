import React, { useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';
import axios from 'axios';
import { useCookies } from 'react-cookie';
import { authAtom } from '../../../../../../atoms/authAtom';
import { BACKEND_URL } from '../../../../../../Globle';
import InputField from '../../../../../components/InputField';
import NewDataButtons from '../../NewDataButtons';
import Loading from '../../../../../components/Loading';
import NewDataHeaderComponent from '../../NewDataHeaderComponent';
import Divider from '../../../../../components/Divider';
import { fetchCustomers } from '../../../../../utility/dataFetch';
import { CustomerDetail } from '../../../../../utility/types/customerDetail';

const AdvanceLicensePage = () => {
    const { user } = useRecoilValue(authAtom);
    const [cookies] = useCookies(['token']);
    const [loading, setLoading] = useState(false);
    const [customerNames, setCustomerNames] = useState<CustomerDetail[]>([]);

    // State to manage Advance License details
    const [advanceLicenseDetails, setAdvanceLicenseDetails] = useState({
      srNo: '', // A
      customerName: '', // B
      licenseNo: '', // C
      licenseDate: '', // D
      fileNo: '', // E
      fileDate: '', // F
      sion: '', // G
      licenseType: '', // H
      importDataQuantity: '', // I
      importDataCifValueInr: '', // J
      importDataCifValueUsd: '', // K
      importDataDutySavedValue: '', // L
      exportDataQuantity: '', // M
      exportDataFobValueInr: '', // N
      exportDataFobValueUsd: '', // O
      exportDataValueAdditionPercent: '', // P
      actualImportQuantity: '', // Q
      actualImportCifValueInr: '', // R
      actualImportCifValueUsd: '', // S
      actualImportDutySavedValue: '', // T
      actualImportNoOfBillOfEntries: '', // U
      exportObligationImposedQuantity: '', // V
      exportObligationImposedFobValueInr: '', // W
      exportObligationImposedFobValueUsd: '', // X
      exportObligationImposedValueAdditionPercent: '', // Y
      exportDataActualDoneDirectExportQuantity: '', // Z
      exportDataActualDoneDirectExportFobValueInr: '', // AA
      exportDataActualDoneDirectExportFobValueUsd: '', // AB
      exportDataActualDoneDirectExportValueAdditionPercent: '', // AC
      exportDataActualDoneDirectExportNoOfShippingBills: '', // AD
      exportDataActualDoneIndirectExportQuantity: '', // AE
      exportDataActualDoneIndirectExportFobValueInr: '', // AF
      exportDataActualDoneIndirectExportFobValueUsd: '', // AG
      exportDataActualDoneIndirectExportValueAdditionPercent: '', // AH
      exportDataActualDoneIndirectExportNoOfShippingBills: '', // AI
      exportDataActualDoneTotalExportQuantity: '', // AJ
      exportDataActualDoneTotalExportFobValueInr: '', // AK
      exportDataActualDoneTotalExportFobValueUsd: '', // AL
      exportDataActualDoneTotalExportValueAdditionPercent: '', // AM
      exportDataActualDoneTotalExportNoOfShippingBills: '', // AN
      remarks: '' // AO
    });

    useEffect(() => {
        setLoading(true);
        fetchCustomers(cookies.token).then((data) => {
            setCustomerNames(data);
            setLoading(false);
        });
    }, [cookies.token]);

    const calculateDerivedFields = (details) => {
        const {
            importDataCifValueUsd,
            exportDataFobValueUsd,
            importDataQuantity,
            exportDataQuantity,
            actualImportQuantity,
            importDataCifValueInr,
            exportDataFobValueInr,
            actualImportCifValueUsd,
            actualImportCifValueInr,
            exportDataActualDoneDirectExportFobValueUsd,
            exportDataActualDoneIndirectExportFobValueUsd,
            exportDataActualDoneDirectExportQuantity,
            exportDataActualDoneIndirectExportQuantity,
            exportDataActualDoneDirectExportFobValueInr,
            exportDataActualDoneIndirectExportFobValueInr,
            exportDataActualDoneDirectExportNoOfShippingBills,
            exportDataActualDoneTotalExportFobValueUsd,
        } = details;
    
        const P = ((exportDataFobValueUsd - importDataCifValueUsd) / importDataCifValueUsd) * 100;
        const V = (actualImportQuantity * exportDataQuantity) / importDataQuantity;
        const W = (exportDataFobValueInr * actualImportCifValueInr) / importDataCifValueInr;
        const X = (exportDataFobValueUsd * actualImportCifValueUsd) / importDataCifValueUsd;
        const Y = ((X - actualImportCifValueUsd) / actualImportCifValueUsd) * 100;
        const AC = ((exportDataActualDoneDirectExportFobValueUsd - actualImportCifValueUsd) / actualImportCifValueUsd) * 100;
        const AH = ((exportDataActualDoneIndirectExportFobValueUsd - actualImportCifValueUsd) / actualImportCifValueUsd) * 100;
        const AJ = exportDataActualDoneDirectExportQuantity + exportDataActualDoneIndirectExportQuantity;
        const AK = exportDataActualDoneDirectExportFobValueInr + exportDataActualDoneIndirectExportFobValueInr;
        const AL = exportDataActualDoneDirectExportFobValueUsd + exportDataActualDoneIndirectExportFobValueUsd;
        const AM = ((AL - actualImportCifValueUsd) / actualImportCifValueUsd) * 100;
        const AN = exportDataActualDoneDirectExportNoOfShippingBills + exportDataActualDoneTotalExportFobValueUsd;
    
        return {
            ...details,
            exportDataValueAdditionPercent: P,
            exportObligationImposedQuantity: V,
            exportObligationImposedFobValueInr: W,
            exportObligationImposedFobValueUsd: X,
            exportObligationImposedValueAdditionPercent: Y,
            exportDataActualDoneDirectExportValueAdditionPercent: AC,
            exportDataActualDoneIndirectExportValueAdditionPercent: AH,
            exportDataActualDoneTotalExportQuantity: AJ,
            exportDataActualDoneTotalExportFobValueInr: AK,
            exportDataActualDoneTotalExportFobValueUsd: AL,
            exportDataActualDoneTotalExportValueAdditionPercent: AM,
            exportDataActualDoneTotalExportNoOfShippingBills: AN,
        };
    };
    
    const handleInputChange = (field, value) => {
        const updatedDetails = { ...advanceLicenseDetails, [field]: value };
        const recalculatedDetails = calculateDerivedFields(updatedDetails);
        setAdvanceLicenseDetails(recalculatedDetails);
    };

    const handleSubmit = async () => {
        setLoading(true);
        const jsonData = {
            ...Object.fromEntries(
          Object.entries(advanceLicenseDetails).map(([key, value]) => [key, String(value)])
            ),
            addedByUserId: String(user.id),
        };

        console.log('jsonData', jsonData);

        try {
            const res = await axios.post(
                `${BACKEND_URL}/documentslist/advancelicense`,
                jsonData,
                {
                    headers: {
                        Authorization: cookies.token,
                    },
                }
            );

            alert(res.data.message);
            setLoading(false);
        } catch (error) {
            alert('Error in saving data');
            setLoading(false);
        }
    };

    return (
        <div className="bg-[#e6e7e9] w-full h-full min-h-screen">
            <div className="container mx-auto px-4 py-8">
                {loading && <Loading />}
                <NewDataHeaderComponent
                    backLink={"/datamanagement"}
                    nextLink={"/datamanagement/newdata/part2"}
                />
                <div className="container mx-auto px-4 py-8">
                    <div className="container text-center text-green-700 font-sans font-semibold text-[24px]">
                        Advance License
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 mt-2 gap-4">
                        <div className="bg-white p-4 rounded-md">
                            <div className="container text-center text-green-700 font-sans font-semibold text-lg">
                                Basic Details
                            </div>
                            <InputField
                                label="Sr No"
                                value={advanceLicenseDetails.srNo}
                                onChange={(e) => handleInputChange('srNo', e.target.value)}
                                type="number"
                            />
                            <InputField
                                label="Customer Name"
                                type="select"
                                options={customerNames.map((customer) => customer.customerName)}
                                value={advanceLicenseDetails.customerName}
                                onChange={(e) => handleInputChange('customerName', e.target.value)}
                            />
                            <InputField
                                label="File No"
                                value={advanceLicenseDetails.fileNo}
                                onChange={(e) => handleInputChange('fileNo', e.target.value)}
                                type="text"
                            />
                            <InputField
                                label="File Date"
                                value={advanceLicenseDetails.fileDate}
                                onChange={(e) => handleInputChange('fileDate', e.target.value)}
                                type="date"
                            />
                            <InputField
                                label="License No"
                                value={advanceLicenseDetails.licenseNo}
                                onChange={(e) => handleInputChange('licenseNo', e.target.value)}
                                type="number"
                            />
                            <InputField
                                label="License Date"
                                value={advanceLicenseDetails.licenseDate}
                                onChange={(e) => handleInputChange('licenseDate', e.target.value)}
                                type="date"
                            />
                            <InputField
                                label="SION"
                                value={advanceLicenseDetails.sion}
                                onChange={(e) => handleInputChange('sion', e.target.value)}
                                type="select"
                                options={['Domestic', 'Import', 'SEZ']}
                            />
                            <InputField
                                label="License Type"
                                value={advanceLicenseDetails.licenseType}
                                onChange={(e) => handleInputChange('licenseType', e.target.value)}
                                type="text"
                            />
                        </div>
                        <div className="bg-white p-4 rounded-md">
                            <div className="container text-center text-green-700 font-sans font-semibold text-lg">
                                Import Data
                            </div>
                            <InputField
                                label="Quantity"
                                value={advanceLicenseDetails.importDataQuantity}
                                onChange={(e) => handleInputChange('importDataQuantity', e.target.value)}
                                type="number"
                            />
                            <InputField
                                label="CIF Value (INR)"
                                value={advanceLicenseDetails.importDataCifValueInr}
                                onChange={(e) => handleInputChange('importDataCifValueInr', e.target.value)}
                                type="number"
                            />
                            <InputField
                                label="CIF Value (USD)"
                                value={advanceLicenseDetails.importDataCifValueUsd}
                                onChange={(e) => handleInputChange('importDataCifValueUsd', e.target.value)}
                                type="number"
                            />
                            <InputField
                                label="Duty Saved Value"
                                value={advanceLicenseDetails.importDataDutySavedValue}
                                onChange={(e) => handleInputChange('importDataDutySavedValue', e.target.value)}
                                type="number"
                            />
                        </div>
                        <div className="bg-white p-4 rounded-md">
                            <div className="container text-center text-green-700 font-sans font-semibold text-lg">
                                Export Data
                            </div>
                            <InputField
                                label="Quantity"
                                value={advanceLicenseDetails.exportDataQuantity}
                                onChange={(e) => handleInputChange('exportDataQuantity', e.target.value)}
                                type="number"
                            />
                            <InputField
                                label="FOB Value (INR)"
                                value={advanceLicenseDetails.exportDataFobValueInr}
                                onChange={(e) => handleInputChange('exportDataFobValueInr', e.target.value)}
                                type="number"
                            />
                            <InputField
                                label="FOB Value (USD)"
                                value={advanceLicenseDetails.exportDataFobValueUsd}
                                onChange={(e) => handleInputChange('exportDataFobValueUsd', e.target.value)}
                                type="number"
                            />
                            <InputField
                                label="Value Addition Percent"
                                value={advanceLicenseDetails.exportDataValueAdditionPercent}
                                onChange={(e) => handleInputChange('exportDataValueAdditionPercent', e.target.value)}
                                type="number"
                            />
                        </div>
                        <div className="bg-white p-4 rounded-md">
                            <div className="container text-center text-green-700 font-sans font-semibold text-lg">
                                Actual Import Data
                            </div>
                            <InputField
                                label="Quantity"
                                value={advanceLicenseDetails.actualImportQuantity}
                                onChange={(e) => handleInputChange('actualImportQuantity', e.target.value)}
                                type="number"
                            />
                            <InputField
                                label="CIF Value (INR)"
                                value={advanceLicenseDetails.actualImportCifValueInr}
                                onChange={(e) => handleInputChange('actualImportCifValueInr', e.target.value)}
                                type="number"
                            />
                            <InputField
                                label="CIF Value (USD)"
                                value={advanceLicenseDetails.actualImportCifValueUsd}
                                onChange={(e) => handleInputChange('actualImportCifValueUsd', e.target.value)}
                                type="number"
                            />
                            <InputField
                                label="Duty Saved Value"
                                value={advanceLicenseDetails.actualImportDutySavedValue}
                                onChange={(e) => handleInputChange('actualImportDutySavedValue', e.target.value)}
                                type="number"
                            />
                            <InputField
                                label="No Of Bill Of Entries"
                                value={advanceLicenseDetails.actualImportNoOfBillOfEntries}
                                onChange={(e) => handleInputChange('actualImportNoOfBillOfEntries', e.target.value)}
                                type="number"
                            />
                        </div>
                        <div className="bg-white p-4 rounded-md">
                            <div className="container text-center text-green-700 font-sans font-semibold text-lg">
                                Export Obligation Imposed
                            </div>
                            <InputField
                                label="Quantity"
                                value={advanceLicenseDetails.exportObligationImposedQuantity}
                                onChange={(e) => handleInputChange('exportObligationImposedQuantity', e.target.value)}
                                type="number"
                            />
                            <InputField
                                label="FOB Value (INR)"
                                value={advanceLicenseDetails.exportObligationImposedFobValueInr}
                                onChange={(e) => handleInputChange('exportObligationImposedFobValueInr', e.target.value)}
                                type="number"
                            />
                            <InputField
                                label="FOB Value (USD)"
                                value={advanceLicenseDetails.exportObligationImposedFobValueUsd}
                                onChange={(e) => handleInputChange('exportObligationImposedFobValueUsd', e.target.value)}
                                type="number"
                            />
                            <InputField
                                label="Value Addition Percent"
                                value={advanceLicenseDetails.exportObligationImposedValueAdditionPercent}
                                onChange={(e) => handleInputChange('exportObligationImposedValueAdditionPercent', e.target.value)}
                                type="number"
                            />
                        </div>
                        <div className="bg-white p-4 rounded-md">
                            <div className="container text-center text-green-700 font-sans font-semibold text-lg">
                                Export Data Actual Done (Direct Export)
                            </div>
                            <InputField
                                label="Quantity"
                                value={advanceLicenseDetails.exportDataActualDoneDirectExportQuantity}
                                onChange={(e) => handleInputChange('exportDataActualDoneDirectExportQuantity', e.target.value)}
                                type="number"
                            />
                            <InputField
                                label="FOB Value (INR)"
                                value={advanceLicenseDetails.exportDataActualDoneDirectExportFobValueInr}
                                onChange={(e) => handleInputChange('exportDataActualDoneDirectExportFobValueInr', e.target.value)}
                                type="number"
                            />
                            <InputField
                                label="FOB Value (USD)"
                                value={advanceLicenseDetails.exportDataActualDoneDirectExportFobValueUsd}
                                onChange={(e) => handleInputChange('exportDataActualDoneDirectExportFobValueUsd', e.target.value)}
                                type="number"
                            />
                            <InputField
                                label="Value Addition Percent"
                                value={advanceLicenseDetails.exportDataActualDoneDirectExportValueAdditionPercent}
                                onChange={(e) => handleInputChange('exportDataActualDoneDirectExportValueAdditionPercent', e.target.value)}
                                type="number"
                            />
                            <InputField
                                label="No Of Shipping Bills"
                                value={advanceLicenseDetails.exportDataActualDoneDirectExportNoOfShippingBills}
                                onChange={(e) => handleInputChange('exportDataActualDoneDirectExportNoOfShippingBills', e.target.value)}
                                type="number"
                            />
                        </div>
                        <div className="bg-white p-4 rounded-md">
                            <div className="container text-center text-green-700 font-sans font-semibold text-lg">
                                Export Data Actual Done (Indirect Export)
                            </div>
                            <InputField
                                label="Quantity"
                                value={advanceLicenseDetails.exportDataActualDoneIndirectExportQuantity}
                                onChange={(e) => handleInputChange('exportDataActualDoneIndirectExportQuantity', e.target.value)}
                                type="number"
                            />
                            <InputField
                                label="FOB Value (INR)"
                                value={advanceLicenseDetails.exportDataActualDoneIndirectExportFobValueInr}
                                onChange={(e) => handleInputChange('exportDataActualDoneIndirectExportFobValueInr', e.target.value)}
                                type="number"
                            />
                            <InputField
                                label="FOB Value (USD)"
                                value={advanceLicenseDetails.exportDataActualDoneIndirectExportFobValueUsd}
                                onChange={(e) => handleInputChange('exportDataActualDoneIndirectExportFobValueUsd', e.target.value)}
                                type="number"
                            />
                            <InputField
                                label="Value Addition Percent"
                                value={advanceLicenseDetails.exportDataActualDoneIndirectExportValueAdditionPercent}
                                onChange={(e) => handleInputChange('exportDataActualDoneIndirectExportValueAdditionPercent', e.target.value)}
                                type="number"
                            />
                            <InputField
                                label="No Of Shipping Bills"
                                value={advanceLicenseDetails.exportDataActualDoneIndirectExportNoOfShippingBills}
                                onChange={(e) => handleInputChange('exportDataActualDoneIndirectExportNoOfShippingBills', e.target.value)}
                                type="number"
                            />
                        </div>
                        <div className="bg-white p-4 rounded-md">
                            <div className="container text-center text-green-700 font-sans font-semibold text-lg">
                                Export Data Actual Done (Total Export)
                            </div>
                            <InputField
                                label="Quantity"
                                value={advanceLicenseDetails.exportDataActualDoneTotalExportQuantity}
                                onChange={(e) => handleInputChange('exportDataActualDoneTotalExportQuantity', e.target.value)}
                                type="number"
                            />
                            <InputField
                                label="FOB Value (INR)"
                                value={advanceLicenseDetails.exportDataActualDoneTotalExportFobValueInr}
                                onChange={(e) => handleInputChange('exportDataActualDoneTotalExportFobValueInr', e.target.value)}
                                type="number"
                            />
                            <InputField
                                label="FOB Value (USD)"
                                value={advanceLicenseDetails.exportDataActualDoneTotalExportFobValueUsd}
                                onChange={(e) => handleInputChange('exportDataActualDoneTotalExportFobValueUsd', e.target.value)}
                                type="number"
                            />
                            <InputField
                                label="Value Addition Percent"
                                value={advanceLicenseDetails.exportDataActualDoneTotalExportValueAdditionPercent}
                                onChange={(e) => handleInputChange('exportDataActualDoneTotalExportValueAdditionPercent', e.target.value)}
                                type="number"
                            />
                            <InputField
                                label="No Of Shipping Bills"
                                value={advanceLicenseDetails.exportDataActualDoneTotalExportNoOfShippingBills}
                                onChange={(e) => handleInputChange('exportDataActualDoneTotalExportNoOfShippingBills', e.target.value)}
                                type="number"
                            />
                        </div>
                        <div className="bg-white p-4 rounded-md">
                            <div className="container text-center text-green-700 font-sans font-semibold text-lg">
                                Remarks
                            </div>
                            <InputField
                                label="Remarks"
                                value={advanceLicenseDetails.remarks}
                                onChange={(e) => handleInputChange('remarks', e.target.value)}
                                type="text"
                            />
                        </div>
                    </div>
                    <NewDataButtons
                        backLink=""
                        nextLink=""
                        handleSubmit={handleSubmit}
                    />
                </div>
            </div>
        </div>
    );
};

export default AdvanceLicensePage;
