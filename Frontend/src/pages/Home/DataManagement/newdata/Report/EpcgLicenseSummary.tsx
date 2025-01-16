import React, { useEffect, useMemo, useState } from 'react';
import { useRecoilValue } from 'recoil';
import axios from 'axios';
import { useCookies } from 'react-cookie';
import { authAtom } from '../../../../../atoms/authAtom';
import { CustomerDetail } from '../../../../utility/types/customerDetail';
import { fetchCustomers } from '../../../../utility/dataFetch';
import { BACKEND_URL } from '../../../../../Globle';
import Loading from '../../../../components/Loading';
import InputField from '../../../../components/InputField';
import Divider from '../../../../components/Divider';
import NewDataButtons from '../NewDataButtons';

const EpcgLicenseSummary = () => {

    const { user } = useRecoilValue(authAtom);
    const [cookies] = useCookies(['token']);
    const [loading, setLoading] = useState(false);
    const [customerNames, setCustomerNames] = useState<CustomerDetail[]>([]);

    // State to manage EPCG License details
    const [epcgLicenseDetails, setEpcgLicenseDetails] = useState({
        srNo: '', // 1
        customerName: '', // 2
        licenseNo: '', // 3
        licenseDate: '', // 4
        fileNo: '', // 5
        fileDate: '', // 6
        licenseType: '', // 7
        bankGuaranteeAmountRs: '', // 8
        bankGuaranteeSubmittedTo: '', // 10
        bankGuaranteeValidityFrom: '', // 9.1
        bankGuaranteeValidityTo: '', // 9.2
        dutySavedValueAmountInr: '', // 11
        dutySavedEoInr: '', // 12
        dutySavedEoUsd: '', // 13
        ActualUtilizationBaseDutyUtilizedValue: '', // 14
        ActualUtilizationBaseDutyeoInr: '', // 15
        ActualUtilizationBaseDutyeoUsd: '', // 16
        installationDate: '', // 17
        AverageExportImposedAsPerLicenseInr: '', // 18
        AverageExportNoOfYears: '', // 19
        AverageExportTotalAeoImposedInr: '', // 20
        AverageExportFulfilledInr: '', // 21
        AverageExportNoOfShippingBills: '', // 22
        AverageExportFulfilledPercent: '', // 23
        block1stImposedBlockCompletionDate: '', // 24
        block1stImposedEoInr: '', // 25
        block1stImposedEoUsd: '', // 26
        block1stDirectExportEoInr: '', // 27
        block1stDirectExportEoUsd: '', // 28
        block1stDirectExportNoOfShippingBills: '', // 29
        block1stDirectExportPercent: '', // 30
        block1stDirectExportPropDutySaved: '', // 31
        block1stIndirectExportEoInr: '', // 32
        block1stIndirectExportEoUsd: '', // 33
        block1stIndirectExportNoOfShippingBills: '', // 34
        block1stIndirectExportPercent: '', // 35
        block1stIndirectExportPropDutySaved: '', // 36
        block1stTotalExportEoInr: '', // 37
        block1stTotalExportEoUsd: '', // 38
        block1stTotalExportNoOfShippingBills: '', // 39
        block1stTotalExportPercent: '', // 40
        block1stTotalExportPropDutySaved: '', // 41
        block2ndImposedBlockCompletionDate: '', // 42
        block2ndImposedEoInr: '', // 43
        block2ndImposedEoUsd: '', // 44
        block2ndDirectExportEoInr: '', // 45
        block2ndDirectExportEoUsd: '', // 46
        block2ndDirectExportNoOfShippingBills: '', // 47
        block2ndDirectExportPercent: '', // 48
        block2ndDirectExportPropDutySaved: '', // 49
        block2ndIndirectExportEoInr: '', // 50
        block2ndIndirectExportEoUsd: '', // 51
        block2ndIndirectExportNoOfShippingBills: '', // 52
        block2ndIndirectExportPercent: '', // 53
        block2ndIndirectExportPropDutySaved: '', // 54
        block2ndTotalExportEoInr: '', // 55
        block2ndTotalExportEoUsd: '', // 56
        block2ndTotalExportNoOfShippingBills: '', // 57
        block2ndTotalExportPercent: '', // 58
        block2ndTotalExportPropDutySaved: '', // 59
        totalEOPeriodDirectExportEoInr: '', // 60
        totalEOPeriodDirectExportEoUsd: '', // 61
        totalEOPeriodDirectExportNoOfShippingBills: '', // 62
        totalEOPeriodDirectExportPercent: '', // 63
        totalEOPeriodDirectExportPropDutySaved: '', // 64
        totalEOPeriodIndirectExportEoInr: '', // 65
        totalEOPeriodIndirectExportEoUsd: '', // 66
        totalEOPeriodIndirectExportNoOfShippingBills: '', // 67
        totalEOPeriodIndirectExportPercent: '', // 68
        totalEOPeriodIndirectExportPropDutySaved: '', // 69
        totalEOPeriodTotalExportEoInr: '', // 70
        totalEOPeriodTotalExportEoUsd: '', // 71
        totalEOPeriodTotalExportNoOfShippingBills: '', // 72
        totalEOPeriodTotalExportPercent: '', // 73
        totalEOPeriodTotalExportPropDutySaved: '', // 74
        remarks: '' // 75
    });

    useEffect(() => {
        setLoading(true);
        fetchCustomers(cookies.token).then((data) => {
            setCustomerNames(data);
            setLoading(false);
        })

        setLoading(false);
    }
        , []);


    useMemo(() => {
        const updatedActualUtilizationBaseDutyeoInr  = 
        (parseFloat(epcgLicenseDetails.dutySavedEoInr) * 
        parseFloat(epcgLicenseDetails.ActualUtilizationBaseDutyUtilizedValue) / 
        parseFloat(epcgLicenseDetails.dutySavedValueAmountInr)).toString();// 15
        const updatedActualUtilizationBaseDutyeoUsd = 
        (parseFloat(epcgLicenseDetails.dutySavedEoUsd) * 
        parseFloat(epcgLicenseDetails.ActualUtilizationBaseDutyUtilizedValue) / 
        parseFloat(epcgLicenseDetails.dutySavedValueAmountInr)).toString();// 16
        const updatedAverageExportTotalAeoImposedInr =
        (parseFloat(epcgLicenseDetails.AverageExportImposedAsPerLicenseInr) * 
        parseFloat(epcgLicenseDetails.AverageExportNoOfYears)).toString();// 20
        const updatedActualExportFulfilledPercent =
        (parseFloat(epcgLicenseDetails.AverageExportFulfilledInr) / 
        parseFloat(epcgLicenseDetails.AverageExportTotalAeoImposedInr)).toString();// 23

        setEpcgLicenseDetails({
            ...epcgLicenseDetails,
            ActualUtilizationBaseDutyeoInr: updatedActualUtilizationBaseDutyeoInr,
            ActualUtilizationBaseDutyeoUsd: updatedActualUtilizationBaseDutyeoUsd,
            AverageExportTotalAeoImposedInr: updatedAverageExportTotalAeoImposedInr,
            AverageExportFulfilledPercent: updatedActualExportFulfilledPercent,
        });

    }, [
        epcgLicenseDetails.dutySavedValueAmountInr, // 11
        epcgLicenseDetails.dutySavedEoInr,// 12
        epcgLicenseDetails.dutySavedEoUsd,// 13
        epcgLicenseDetails.ActualUtilizationBaseDutyUtilizedValue,// 14
        epcgLicenseDetails.AverageExportImposedAsPerLicenseInr,// 18
        epcgLicenseDetails.AverageExportNoOfYears,// 19
        epcgLicenseDetails.AverageExportFulfilledInr,// 21
    ]);
    useEffect(() => {
        const updatedBlock1stImposedEoInr = (parseFloat(epcgLicenseDetails.ActualUtilizationBaseDutyeoInr) * 0.5).toString(); // 25
        const updatedBlock1stImposedEoUsd = (parseFloat(epcgLicenseDetails.ActualUtilizationBaseDutyeoUsd) * 0.5).toString(); // 26
        const updatedBlock1stDirectExportPercent = (parseFloat(epcgLicenseDetails.block1stDirectExportEoUsd) / parseFloat(epcgLicenseDetails.ActualUtilizationBaseDutyeoUsd)).toString(); // 30
        const updatedBlock1stDirectExportPropDutySaved = (parseFloat(epcgLicenseDetails.ActualUtilizationBaseDutyUtilizedValue) *  parseFloat(updatedBlock1stDirectExportPercent)).toString(); // 31
        const updatedBlock1stIndirectExportPercent = (parseFloat(epcgLicenseDetails.block1stIndirectExportEoUsd) / parseFloat(epcgLicenseDetails.ActualUtilizationBaseDutyeoUsd)).toString(); // 35
        const updatedBlock1stIndirectExportPropDutySaved = (parseFloat(epcgLicenseDetails.ActualUtilizationBaseDutyUtilizedValue) * parseFloat(updatedBlock1stIndirectExportPercent)).toString(); // 36
        const updatedBlock1stTotalExportEoInr = (parseFloat(epcgLicenseDetails.block1stDirectExportEoInr) + parseFloat(epcgLicenseDetails.block1stIndirectExportEoInr)).toString(); // 37
        const updatedBlock1stTotalExportEoUsd = (parseFloat(epcgLicenseDetails.block1stDirectExportEoUsd) + parseFloat(epcgLicenseDetails.block1stIndirectExportEoUsd)).toString(); // 38
        const updatedBlock1stTotalExportNoOfShippingBills = (parseFloat(epcgLicenseDetails.block1stDirectExportNoOfShippingBills) + parseFloat(epcgLicenseDetails.block1stIndirectExportNoOfShippingBills)).toString(); // 39
        const updatedBlock1stTotalExportPercent = (parseFloat(updatedBlock1stTotalExportEoUsd) / parseFloat(epcgLicenseDetails.ActualUtilizationBaseDutyeoUsd)).toString(); // 40
        const updatedBlock1stTotalExportPropDutySaved = (parseFloat(epcgLicenseDetails.ActualUtilizationBaseDutyUtilizedValue) *  parseFloat(updatedBlock1stTotalExportPercent)).toString(); // 41
        const updatedBlock2ndImposedEoInr = (parseFloat(epcgLicenseDetails.ActualUtilizationBaseDutyeoInr) * 0.5).toString(); // 43
        const updatedBlock2ndImposedEoUsd = (parseFloat(epcgLicenseDetails.ActualUtilizationBaseDutyeoUsd) * 0.5).toString(); // 44
        const updatedBlock2ndDirectExportPercent = (parseFloat(epcgLicenseDetails.block2ndDirectExportEoUsd) / parseFloat(epcgLicenseDetails.ActualUtilizationBaseDutyeoUsd)).toString(); // 48
        const updatedBlock2ndDirectExportPropDutySaved = (parseFloat(epcgLicenseDetails.ActualUtilizationBaseDutyUtilizedValue) * parseFloat(updatedBlock2ndDirectExportPercent)).toString(); // 49
        const updatedBlock2ndIndirectExportPercent = (parseFloat(epcgLicenseDetails.block2ndIndirectExportEoUsd) / parseFloat(epcgLicenseDetails.ActualUtilizationBaseDutyeoUsd)).toString(); // 53
        const updatedBlock2ndIndirectExportPropDutySaved = (parseFloat(epcgLicenseDetails.ActualUtilizationBaseDutyUtilizedValue) * parseFloat(updatedBlock2ndIndirectExportPercent)).toString(); // 54
        const updatedBlock2ndTotalExportEoInr = (parseFloat(epcgLicenseDetails.block2ndDirectExportEoInr) + parseFloat(epcgLicenseDetails.block2ndIndirectExportEoInr)).toString(); // 55
        const updatedBlock2ndTotalExportEoUsd = (parseFloat(epcgLicenseDetails.block2ndDirectExportEoUsd) + parseFloat(epcgLicenseDetails.block2ndIndirectExportEoUsd)).toString(); // 56
        const updatedBlock2ndTotalExportNoOfShippingBills = (parseFloat(epcgLicenseDetails.block2ndDirectExportNoOfShippingBills) + parseFloat(epcgLicenseDetails.block2ndIndirectExportNoOfShippingBills)).toString(); // 57
        const updatedBlock2ndTotalExportPercent = (parseFloat(updatedBlock2ndTotalExportEoUsd) / parseFloat(epcgLicenseDetails.ActualUtilizationBaseDutyeoUsd)).toString(); // 58
        const updatedBlock2ndTotalExportPropDutySaved = (parseFloat(updatedBlock2ndTotalExportPercent) * parseFloat(epcgLicenseDetails.ActualUtilizationBaseDutyUtilizedValue)).toString(); // 59
        const updatedTotalEOPeriodDirectExportEoInr = (parseFloat(epcgLicenseDetails.block1stDirectExportEoInr) + parseFloat(epcgLicenseDetails.block2ndDirectExportEoInr)).toString(); // 60
        const updatedTotalEOPeriodDirectExportEoUsd = (parseFloat(epcgLicenseDetails.block1stDirectExportEoUsd) + parseFloat(epcgLicenseDetails.block2ndDirectExportEoUsd)).toString(); // 61
        const updatedTotalEOPeriodDirectExportNoOfShippingBills = (parseFloat(epcgLicenseDetails.block1stDirectExportNoOfShippingBills) + parseFloat(epcgLicenseDetails.block2ndDirectExportNoOfShippingBills)).toString(); // 62
        const updatedTotalEOPeriodDirectExportPercent = (parseFloat(epcgLicenseDetails.block1stDirectExportPercent) + parseFloat(epcgLicenseDetails.block2ndDirectExportPercent)).toString(); // 63
        const updatedTotalEOPeriodDirectExportPropDutySaved = (parseFloat(epcgLicenseDetails.block1stDirectExportPropDutySaved) + parseFloat(epcgLicenseDetails.block2ndDirectExportPropDutySaved)).toString(); // 64
        const updatedTotalEOPeriodIndirectExportEoInr = (parseFloat(epcgLicenseDetails.block1stIndirectExportEoInr) + parseFloat(epcgLicenseDetails.block2ndIndirectExportEoInr)).toString(); // 65
        const updatedTotalEOPeriodIndirectExportEoUsd = (parseFloat(epcgLicenseDetails.block1stIndirectExportEoUsd) + parseFloat(epcgLicenseDetails.block2ndIndirectExportEoUsd)).toString(); // 66
        const updatedTotalEOPeriodIndirectExportNoOfShippingBills = (parseFloat(epcgLicenseDetails.block1stIndirectExportNoOfShippingBills) + parseFloat(epcgLicenseDetails.block2ndIndirectExportNoOfShippingBills)).toString(); // 67
        const updatedTotalEOPeriodIndirectExportPercent = (parseFloat(epcgLicenseDetails.block1stIndirectExportPercent) + parseFloat(epcgLicenseDetails.block2ndIndirectExportPercent)).toString(); // 68
        const updatedTotalEOPeriodIndirectExportPropDutySaved = (parseFloat(epcgLicenseDetails.block1stIndirectExportPropDutySaved) + parseFloat(epcgLicenseDetails.block2ndIndirectExportPropDutySaved)).toString(); // 69
        const updatedTotalEOPeriodTotalExportEoInr = (parseFloat(epcgLicenseDetails.totalEOPeriodDirectExportEoInr) + parseFloat(epcgLicenseDetails.totalEOPeriodIndirectExportEoInr)).toString(); // 70
        const updatedTotalEOPeriodTotalExportEoUsd = (parseFloat(epcgLicenseDetails.totalEOPeriodDirectExportEoUsd) + parseFloat(epcgLicenseDetails.totalEOPeriodIndirectExportEoUsd)).toString(); // 71
        const updatedTotalEOPeriodTotalExportNoOfShippingBills = (parseFloat(epcgLicenseDetails.totalEOPeriodDirectExportNoOfShippingBills) + parseFloat(epcgLicenseDetails.totalEOPeriodIndirectExportNoOfShippingBills)).toString(); // 72
        const updatedTotalEOPeriodTotalExportPercent = (parseFloat(epcgLicenseDetails.totalEOPeriodDirectExportPercent) + parseFloat(epcgLicenseDetails.totalEOPeriodIndirectExportPercent)).toString(); // 73
        const updatedTotalEOPeriodTotalExportPropDutySaved = (parseFloat(epcgLicenseDetails.totalEOPeriodDirectExportPropDutySaved) + parseFloat(epcgLicenseDetails.totalEOPeriodIndirectExportPropDutySaved)).toString(); // 74


        setEpcgLicenseDetails({
            ...epcgLicenseDetails,
            block1stImposedEoInr: updatedBlock1stImposedEoInr,
            block1stImposedEoUsd: updatedBlock1stImposedEoUsd,
            block1stDirectExportPercent: updatedBlock1stDirectExportPercent,
            block1stDirectExportPropDutySaved: updatedBlock1stDirectExportPropDutySaved,
            block1stIndirectExportPercent: updatedBlock1stIndirectExportPercent,
            block1stIndirectExportPropDutySaved: updatedBlock1stIndirectExportPropDutySaved,
            block1stTotalExportEoInr: updatedBlock1stTotalExportEoInr,
            block1stTotalExportEoUsd: updatedBlock1stTotalExportEoUsd,
            block1stTotalExportNoOfShippingBills: updatedBlock1stTotalExportNoOfShippingBills,
            block1stTotalExportPercent: updatedBlock1stTotalExportPercent,
            block1stTotalExportPropDutySaved: updatedBlock1stTotalExportPropDutySaved,
            block2ndImposedEoInr: updatedBlock2ndImposedEoInr,
            block2ndImposedEoUsd: updatedBlock2ndImposedEoUsd,
            block2ndDirectExportPercent: updatedBlock2ndDirectExportPercent,
            block2ndDirectExportPropDutySaved: updatedBlock2ndDirectExportPropDutySaved,
            block2ndIndirectExportPercent: updatedBlock2ndIndirectExportPercent,
            block2ndIndirectExportPropDutySaved: updatedBlock2ndIndirectExportPropDutySaved,
            block2ndTotalExportEoInr: updatedBlock2ndTotalExportEoInr,
            block2ndTotalExportEoUsd: updatedBlock2ndTotalExportEoUsd,
            block2ndTotalExportNoOfShippingBills: updatedBlock2ndTotalExportNoOfShippingBills,
            block2ndTotalExportPercent: updatedBlock2ndTotalExportPercent,
            block2ndTotalExportPropDutySaved: updatedBlock2ndTotalExportPropDutySaved,
            totalEOPeriodDirectExportEoInr: updatedTotalEOPeriodDirectExportEoInr,
            totalEOPeriodDirectExportEoUsd: updatedTotalEOPeriodDirectExportEoUsd,
            totalEOPeriodDirectExportNoOfShippingBills: updatedTotalEOPeriodDirectExportNoOfShippingBills,
            totalEOPeriodDirectExportPercent: updatedTotalEOPeriodDirectExportPercent,
            totalEOPeriodDirectExportPropDutySaved: updatedTotalEOPeriodDirectExportPropDutySaved,
            totalEOPeriodIndirectExportEoInr: updatedTotalEOPeriodIndirectExportEoInr,
            totalEOPeriodIndirectExportEoUsd: updatedTotalEOPeriodIndirectExportEoUsd,
            totalEOPeriodIndirectExportPercent: updatedTotalEOPeriodIndirectExportPercent,
            totalEOPeriodIndirectExportPropDutySaved: updatedTotalEOPeriodIndirectExportPropDutySaved,
            totalEOPeriodTotalExportEoInr: updatedTotalEOPeriodTotalExportEoInr,
            totalEOPeriodTotalExportEoUsd: updatedTotalEOPeriodTotalExportEoUsd,
            totalEOPeriodTotalExportPercent: updatedTotalEOPeriodTotalExportPercent,
            totalEOPeriodTotalExportPropDutySaved: updatedTotalEOPeriodTotalExportPropDutySaved,
            totalEOPeriodIndirectExportNoOfShippingBills: updatedTotalEOPeriodIndirectExportNoOfShippingBills,
            totalEOPeriodTotalExportNoOfShippingBills: updatedTotalEOPeriodTotalExportNoOfShippingBills,
        });
    }, [
        epcgLicenseDetails.ActualUtilizationBaseDutyeoInr,
        epcgLicenseDetails.ActualUtilizationBaseDutyeoUsd,
        epcgLicenseDetails.ActualUtilizationBaseDutyUtilizedValue,
        epcgLicenseDetails.block1stDirectExportEoInr,
        epcgLicenseDetails.block1stDirectExportEoUsd,
        epcgLicenseDetails.block1stDirectExportNoOfShippingBills,
        epcgLicenseDetails.block1stDirectExportPercent,
        epcgLicenseDetails.block1stDirectExportPropDutySaved,
        epcgLicenseDetails.block1stIndirectExportEoInr,
        epcgLicenseDetails.block1stIndirectExportEoUsd,
        epcgLicenseDetails.block1stIndirectExportNoOfShippingBills,
        epcgLicenseDetails.block1stIndirectExportPercent,
        epcgLicenseDetails.block1stIndirectExportPropDutySaved,
        epcgLicenseDetails.block1stTotalExportEoInr,
        epcgLicenseDetails.block1stTotalExportEoUsd,
        epcgLicenseDetails.block1stTotalExportNoOfShippingBills,
        epcgLicenseDetails.block1stTotalExportPercent,
        epcgLicenseDetails.block1stTotalExportPropDutySaved,
        epcgLicenseDetails.block2ndDirectExportEoInr,
        epcgLicenseDetails.block2ndDirectExportEoUsd,
        epcgLicenseDetails.block2ndDirectExportNoOfShippingBills,
        epcgLicenseDetails.block2ndDirectExportPercent,
        epcgLicenseDetails.block2ndDirectExportPropDutySaved,
        epcgLicenseDetails.block2ndIndirectExportEoInr,
        epcgLicenseDetails.block2ndIndirectExportEoUsd,
        epcgLicenseDetails.block2ndIndirectExportNoOfShippingBills,
        epcgLicenseDetails.block2ndIndirectExportPercent,
        epcgLicenseDetails.block2ndIndirectExportPropDutySaved,
        epcgLicenseDetails.block2ndTotalExportEoInr,
        epcgLicenseDetails.block2ndTotalExportEoUsd,
        epcgLicenseDetails.block2ndTotalExportNoOfShippingBills,
        epcgLicenseDetails.block2ndTotalExportPercent,
        epcgLicenseDetails.block2ndTotalExportPropDutySaved,
        epcgLicenseDetails.dutySavedEoInr,
        epcgLicenseDetails.dutySavedEoUsd,
        epcgLicenseDetails.dutySavedValueAmountInr,
        epcgLicenseDetails.totalEOPeriodDirectExportEoInr,
        epcgLicenseDetails.totalEOPeriodDirectExportEoUsd,
        epcgLicenseDetails.totalEOPeriodDirectExportNoOfShippingBills,
        epcgLicenseDetails.totalEOPeriodDirectExportPercent,
        epcgLicenseDetails.totalEOPeriodDirectExportPropDutySaved,
        epcgLicenseDetails.totalEOPeriodIndirectExportEoInr,
        epcgLicenseDetails.totalEOPeriodIndirectExportEoUsd,
        epcgLicenseDetails.totalEOPeriodIndirectExportNoOfShippingBills,
        epcgLicenseDetails.totalEOPeriodIndirectExportPercent,
        epcgLicenseDetails.totalEOPeriodIndirectExportPropDutySaved,
        epcgLicenseDetails.totalEOPeriodTotalExportEoInr,
        epcgLicenseDetails.totalEOPeriodTotalExportEoUsd,
        epcgLicenseDetails.totalEOPeriodTotalExportNoOfShippingBills,
        epcgLicenseDetails.totalEOPeriodTotalExportPercent,
        epcgLicenseDetails.totalEOPeriodTotalExportPropDutySaved,
    ]);

    const handleSubmit = async () => {
        setLoading(true);
        const { bankGuaranteeValidityFrom, bankGuaranteeValidityTo, ...restDetails } = epcgLicenseDetails;
        const jsonData = {
            ...restDetails,
            bankGuaranteeValidity: `${bankGuaranteeValidityFrom} to ${bankGuaranteeValidityTo}`,
            addedByUserId: user.id, // Ensure user ID is included
        };

        console.log('jsonData', jsonData);

        try {
            const res = await axios.post(
                `${BACKEND_URL}/documentslist/epcglicense`,
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
               
                <div className="container mx-auto px-4 py-8">
                    <div className="container text-center text-green-700 font-sans font-semibold text-[24px]">
                        EPCG License
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
                                label="Customer Name"
                                type="select"
                                options={
                                    customerNames.map((customer) => customer.customerName)
                                }
                                value={epcgLicenseDetails.customerName}
                                onChange={(e) =>
                                    setEpcgLicenseDetails({ ...epcgLicenseDetails, customerName: e.target.value })
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
                                type="number"
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
                        </div>
                        <div className="bg-white p-4 rounded-md">
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
                            <InputField
                                label="EO (INR)"
                                value={epcgLicenseDetails.dutySavedEoInr}
                                onChange={(e) =>
                                    setEpcgLicenseDetails({ ...epcgLicenseDetails, dutySavedEoInr: e.target.value })
                                }
                                type="number"
                            />
                            <InputField
                                label="EO (USD)"
                                value={epcgLicenseDetails.dutySavedEoUsd}
                                onChange={(e) =>
                                    setEpcgLicenseDetails({ ...epcgLicenseDetails, dutySavedEoUsd: e.target.value })
                                }
                                type="number"
                            />
                        </div>
                        <div className="bg-white p-4 rounded-md">
                            <div className="container text-center text-green-700 font-sans font-semibold text-lg">
                                Actual Utilization Base
                            </div>
                            <InputField
                                label="Duty Utilized Value"
                                value={epcgLicenseDetails.ActualUtilizationBaseDutyUtilizedValue}
                                onChange={(e) =>
                                    setEpcgLicenseDetails({ ...epcgLicenseDetails, ActualUtilizationBaseDutyUtilizedValue: e.target.value })
                                }
                                type="number"
                            />
                            <InputField
                                label="EO (INR)"
                                value={epcgLicenseDetails.ActualUtilizationBaseDutyeoInr}
                                onChange={(e) =>
                                    setEpcgLicenseDetails({ ...epcgLicenseDetails, ActualUtilizationBaseDutyeoInr: e.target.value })
                                }
                                type="number"
                            />
                            <InputField
                                label="EO (USD)"
                                value={epcgLicenseDetails.ActualUtilizationBaseDutyeoUsd}
                                onChange={(e) =>
                                    setEpcgLicenseDetails({ ...epcgLicenseDetails, ActualUtilizationBaseDutyeoUsd: e.target.value })
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
                        </div>
                        <div className="bg-white p-4 rounded-md">
                            <div className="container text-center text-green-700 font-sans font-semibold text-lg">
                                Average Export (INR)
                            </div>
                            <InputField
                                label="Imposed As Per License (INR)"
                                value={epcgLicenseDetails.AverageExportImposedAsPerLicenseInr}
                                onChange={(e) =>
                                    setEpcgLicenseDetails({ ...epcgLicenseDetails, AverageExportImposedAsPerLicenseInr: e.target.value })
                                }
                                type="number"
                            />
                            <InputField
                                label="No Of Years"
                                value={epcgLicenseDetails.AverageExportNoOfYears}
                                onChange={(e) =>
                                    setEpcgLicenseDetails({ ...epcgLicenseDetails, AverageExportNoOfYears: e.target.value })
                                }
                                type="number"
                            />
                            <InputField
                                label="Total AEO Imposed (INR)"
                                value={epcgLicenseDetails.AverageExportTotalAeoImposedInr}
                                onChange={(e) =>
                                    setEpcgLicenseDetails({ ...epcgLicenseDetails, AverageExportTotalAeoImposedInr: e.target.value })
                                }
                                type="number"
                            />
                            <InputField
                                label="Fulfilled (INR)"
                                value={epcgLicenseDetails.AverageExportFulfilledInr}
                                onChange={(e) =>
                                    setEpcgLicenseDetails({ ...epcgLicenseDetails, AverageExportFulfilledInr: e.target.value })
                                }
                                type="number"
                            />
                            <InputField
                                label="No Of Shipping Bills"
                                value={epcgLicenseDetails.AverageExportNoOfShippingBills}
                                onChange={(e) =>
                                    setEpcgLicenseDetails({ ...epcgLicenseDetails, AverageExportNoOfShippingBills: e.target.value })
                                }
                                type="number"
                            />
                            <InputField
                                label="Fulfilled (%)"
                                value={epcgLicenseDetails.AverageExportFulfilledPercent}
                                onChange={(e) =>
                                    setEpcgLicenseDetails({ ...epcgLicenseDetails, AverageExportFulfilledPercent: e.target.value })
                                }
                                type="number"
                            />
                        </div>
                        <div className="bg-white p-4 rounded-md">
                            <div className="container text-center text-green-700 font-sans font-semibold text-lg">
                                Block 1st Details
                            </div>
                            <div className="container text-center text-green-700 font-sans font-semibold text-base">
                                Imposed
                            </div>
                            <InputField
                                label="Imposed Block Completion Date"
                                value={epcgLicenseDetails.block1stImposedBlockCompletionDate}
                                onChange={(e) =>
                                    setEpcgLicenseDetails({ ...epcgLicenseDetails, block1stImposedBlockCompletionDate: e.target.value })
                                }
                                type="date"
                            />
                            <InputField
                                label="Imposed EO (INR)"
                                value={epcgLicenseDetails.block1stImposedEoInr}
                                onChange={(e) =>
                                    setEpcgLicenseDetails({ ...epcgLicenseDetails, block1stImposedEoInr: e.target.value })
                                }
                                type="number"
                            />
                            <InputField
                                label="Imposed EO (USD)"
                                value={epcgLicenseDetails.block1stImposedEoUsd}
                                onChange={(e) =>
                                    setEpcgLicenseDetails({ ...epcgLicenseDetails, block1stImposedEoUsd: e.target.value })
                                }
                                type="number"
                            />
                            <div className="container text-center text-green-700 font-sans font-semibold text-base">
                                Direct Export
                            </div>
                            <InputField
                                label="Direct Export EO (INR)"
                                value={epcgLicenseDetails.block1stDirectExportEoInr}
                                onChange={(e) =>
                                    setEpcgLicenseDetails({ ...epcgLicenseDetails, block1stDirectExportEoInr: e.target.value })
                                }
                                type="number"
                            />
                            <InputField
                                label="Direct Export EO (USD)"
                                value={epcgLicenseDetails.block1stDirectExportEoUsd}
                                onChange={(e) =>
                                    setEpcgLicenseDetails({ ...epcgLicenseDetails, block1stDirectExportEoUsd: e.target.value })
                                }
                                type="number"
                            />
                            <InputField
                                label="Direct Export No Of Shipping Bills"
                                value={epcgLicenseDetails.block1stDirectExportNoOfShippingBills}
                                onChange={(e) =>
                                    setEpcgLicenseDetails({ ...epcgLicenseDetails, block1stDirectExportNoOfShippingBills: e.target.value })
                                }
                                type="number"
                            />
                            <InputField
                                label="Direct Export Percent"
                                value={epcgLicenseDetails.block1stDirectExportPercent}
                                onChange={(e) =>
                                    setEpcgLicenseDetails({ ...epcgLicenseDetails, block1stDirectExportPercent: e.target.value })
                                }
                                type="number"
                            />
                            <InputField
                                label="Direct Export Prop Duty Saved"
                                value={epcgLicenseDetails.block1stDirectExportPropDutySaved}
                                onChange={(e) =>
                                    setEpcgLicenseDetails({ ...epcgLicenseDetails, block1stDirectExportPropDutySaved: e.target.value })
                                }
                                type="number"
                            />
                            <div className="container text-center text-green-700 font-sans font-semibold text-base">
                                Indirect Export
                            </div>
                            <InputField
                                label="Indirect Export EO (INR)"
                                value={epcgLicenseDetails.block1stIndirectExportEoInr}
                                onChange={(e) =>
                                    setEpcgLicenseDetails({ ...epcgLicenseDetails, block1stIndirectExportEoInr: e.target.value })
                                }
                                type="number"
                            />
                            <InputField
                                label="Indirect Export EO (USD)"
                                value={epcgLicenseDetails.block1stIndirectExportEoUsd}
                                onChange={(e) =>
                                    setEpcgLicenseDetails({ ...epcgLicenseDetails, block1stIndirectExportEoUsd: e.target.value })
                                }
                                type="number"
                            />
                            <InputField
                                label="Indirect Export No Of Shipping Bills"
                                value={epcgLicenseDetails.block1stIndirectExportNoOfShippingBills}
                                onChange={(e) =>
                                    setEpcgLicenseDetails({ ...epcgLicenseDetails, block1stIndirectExportNoOfShippingBills: e.target.value })
                                }
                                type="number"
                            />
                            <InputField
                                label="Indirect Export Percent"
                                value={epcgLicenseDetails.block1stIndirectExportPercent}
                                onChange={(e) =>
                                    setEpcgLicenseDetails({ ...epcgLicenseDetails, block1stIndirectExportPercent: e.target.value })
                                }
                                type="number"
                            />
                            <InputField
                                label="Indirect Export Prop Duty Saved"
                                value={epcgLicenseDetails.block1stIndirectExportPropDutySaved}
                                onChange={(e) =>
                                    setEpcgLicenseDetails({ ...epcgLicenseDetails, block1stIndirectExportPropDutySaved: e.target.value })
                                }
                                type="number"
                            />
                            <div className="container text-center text-green-700 font-sans font-semibold text-base">
                                Total Export
                            </div>
                            <InputField
                                label="Total Export EO (INR)"
                                value={epcgLicenseDetails.block1stTotalExportEoInr}
                                onChange={(e) =>
                                    setEpcgLicenseDetails({ ...epcgLicenseDetails, block1stTotalExportEoInr: e.target.value })
                                }
                                type="number"
                            />
                            <InputField
                                label="Total Export EO (USD)"
                                value={epcgLicenseDetails.block1stTotalExportEoUsd}
                                onChange={(e) =>
                                    setEpcgLicenseDetails({ ...epcgLicenseDetails, block1stTotalExportEoUsd: e.target.value })
                                }
                                type="number"
                            />
                            <InputField
                                label="Total Export No Of Shipping Bills"
                                value={epcgLicenseDetails.block1stTotalExportNoOfShippingBills}
                                onChange={(e) =>
                                    setEpcgLicenseDetails({ ...epcgLicenseDetails, block1stTotalExportNoOfShippingBills: e.target.value })
                                }
                                type="number"
                            />
                            <InputField
                                label="Total Export Percent"
                                value={epcgLicenseDetails.block1stTotalExportPercent}
                                onChange={(e) =>
                                    setEpcgLicenseDetails({ ...epcgLicenseDetails, block1stTotalExportPercent: e.target.value })
                                }
                                type="number"
                            />
                            <InputField
                                label="Total Export Prop Duty Saved"
                                value={epcgLicenseDetails.block1stTotalExportPropDutySaved}
                                onChange={(e) =>
                                    setEpcgLicenseDetails({ ...epcgLicenseDetails, block1stTotalExportPropDutySaved: e.target.value })
                                }
                                type="number"
                            />
                        </div>

                        <div className="bg-white p-4 rounded-md">
                            <div className="container text-center text-green-700 font-sans font-semibold text-lg">
                                Block 2nd Details
                            </div>
                            <div className="container text-center text-green-700 font-sans font-semibold text-base">
                                Imposed
                            </div>
                            <InputField
                                label="Imposed Block Completion Date"
                                value={epcgLicenseDetails.block2ndImposedBlockCompletionDate}
                                onChange={(e) =>
                                    setEpcgLicenseDetails({ ...epcgLicenseDetails, block2ndImposedBlockCompletionDate: e.target.value })
                                }
                                type="date"
                            />
                            <InputField
                                label="Imposed EO (INR)"
                                value={epcgLicenseDetails.block2ndImposedEoInr}
                                onChange={(e) =>
                                    setEpcgLicenseDetails({ ...epcgLicenseDetails, block2ndImposedEoInr: e.target.value })
                                }
                                type="number"
                            />
                            <InputField
                                label="Imposed EO (USD)"
                                value={epcgLicenseDetails.block2ndImposedEoUsd}
                                onChange={(e) =>
                                    setEpcgLicenseDetails({ ...epcgLicenseDetails, block2ndImposedEoUsd: e.target.value })
                                }
                                type="number"
                            />
                            <div className="container text-center text-green-700 font-sans font-semibold text-base">
                                Direct Export
                            </div>
                            <InputField
                                label="Direct Export EO (INR)"
                                value={epcgLicenseDetails.block2ndDirectExportEoInr}
                                onChange={(e) =>
                                    setEpcgLicenseDetails({ ...epcgLicenseDetails, block2ndDirectExportEoInr: e.target.value })
                                }
                                type="number"
                            />
                            <InputField
                                label="Direct Export EO (USD)"
                                value={epcgLicenseDetails.block2ndDirectExportEoUsd}
                                onChange={(e) =>
                                    setEpcgLicenseDetails({ ...epcgLicenseDetails, block2ndDirectExportEoUsd: e.target.value })
                                }
                                type="number"
                            />
                            <InputField
                                label="Direct Export No Of Shipping Bills"
                                value={epcgLicenseDetails.block2ndDirectExportNoOfShippingBills}
                                onChange={(e) =>
                                    setEpcgLicenseDetails({ ...epcgLicenseDetails, block2ndDirectExportNoOfShippingBills: e.target.value })
                                }
                                type="number"
                            />
                            <InputField
                                label="Direct Export Percent"
                                value={epcgLicenseDetails.block2ndDirectExportPercent}
                                onChange={(e) =>
                                    setEpcgLicenseDetails({ ...epcgLicenseDetails, block2ndDirectExportPercent: e.target.value })
                                }
                                type="number"
                            />
                            <InputField
                                label="Direct Export Prop Duty Saved"
                                value={epcgLicenseDetails.block2ndDirectExportPropDutySaved}
                                onChange={(e) =>
                                    setEpcgLicenseDetails({ ...epcgLicenseDetails, block2ndDirectExportPropDutySaved: e.target.value })
                                }
                                type="number"
                            />
                            <div className="container text-center text-green-700 font-sans font-semibold text-base">
                                Indirect Export
                            </div>
                            <InputField
                                label="Indirect Export EO (INR)"
                                value={epcgLicenseDetails.block2ndIndirectExportEoInr}
                                onChange={(e) =>
                                    setEpcgLicenseDetails({ ...epcgLicenseDetails, block2ndIndirectExportEoInr: e.target.value })
                                }
                                type="number"
                            />
                            <InputField
                                label="Indirect Export EO (USD)"
                                value={epcgLicenseDetails.block2ndIndirectExportEoUsd}
                                onChange={(e) =>
                                    setEpcgLicenseDetails({ ...epcgLicenseDetails, block2ndIndirectExportEoUsd: e.target.value })
                                }
                                type="number"
                            />
                            <InputField
                                label="Indirect Export No Of Shipping Bills"
                                value={epcgLicenseDetails.block2ndIndirectExportNoOfShippingBills}
                                onChange={(e) =>
                                    setEpcgLicenseDetails({ ...epcgLicenseDetails, block2ndIndirectExportNoOfShippingBills: e.target.value })
                                }
                                type="number"
                            />
                            <InputField
                                label="Indirect Export Percent"
                                value={epcgLicenseDetails.block2ndIndirectExportPercent}
                                onChange={(e) =>
                                    setEpcgLicenseDetails({ ...epcgLicenseDetails, block2ndIndirectExportPercent: e.target.value })
                                }
                                type="number"
                            />
                            <InputField
                                label="Indirect Export Prop Duty Saved"
                                value={epcgLicenseDetails.block2ndIndirectExportPropDutySaved}
                                onChange={(e) =>
                                    setEpcgLicenseDetails({ ...epcgLicenseDetails, block2ndIndirectExportPropDutySaved: e.target.value })
                                }
                                type="number"
                            />
                            <div className="container text-center text-green-700 font-sans font-semibold text-base">
                                Total Export
                            </div>
                            <InputField
                                label="Total Export EO (INR)"
                                value={epcgLicenseDetails.block2ndTotalExportEoInr}
                                onChange={(e) =>
                                    setEpcgLicenseDetails({ ...epcgLicenseDetails, block2ndTotalExportEoInr: e.target.value })
                                }
                                type="number"
                            />
                            <InputField
                                label="Total Export EO (USD)"
                                value={epcgLicenseDetails.block2ndTotalExportEoUsd}
                                onChange={(e) =>
                                    setEpcgLicenseDetails({ ...epcgLicenseDetails, block2ndTotalExportEoUsd: e.target.value })
                                }
                                type="number"
                            />
                            <InputField
                                label="Total Export No Of Shipping Bills"
                                value={epcgLicenseDetails.block2ndTotalExportNoOfShippingBills}
                                onChange={(e) =>
                                    setEpcgLicenseDetails({ ...epcgLicenseDetails, block2ndTotalExportNoOfShippingBills: e.target.value })
                                }
                                type="number"
                            />
                            <InputField
                                label="Total Export Percent"
                                value={epcgLicenseDetails.block2ndTotalExportPercent}
                                onChange={(e) =>
                                    setEpcgLicenseDetails({ ...epcgLicenseDetails, block2ndTotalExportPercent: e.target.value })
                                }
                                type="number"
                            />
                            <InputField
                                label="Total Export Prop Duty Saved"
                                value={epcgLicenseDetails.block2ndTotalExportPropDutySaved}
                                onChange={(e) =>
                                    setEpcgLicenseDetails({ ...epcgLicenseDetails, block2ndTotalExportPropDutySaved: e.target.value })
                                }
                                type="number"
                            />
                        </div>
                        <div className="bg-white p-4 rounded-md">
                            <div className="container text-center text-green-700 font-sans font-semibold text-lg">
                                Total EO Period Details
                            </div>
                            <div className="container text-center text-green-700 font-sans font-semibold text-base">
                                Direct Export
                            </div>
                            <InputField
                                label="Direct Export EO (INR)"
                                value={epcgLicenseDetails.totalEOPeriodDirectExportEoInr}
                                onChange={(e) =>
                                    setEpcgLicenseDetails({ ...epcgLicenseDetails, totalEOPeriodDirectExportEoInr: e.target.value })
                                }
                                type="number"
                            />
                            <InputField
                                label="Direct Export EO (USD)"
                                value={epcgLicenseDetails.totalEOPeriodDirectExportEoUsd}
                                onChange={(e) =>
                                    setEpcgLicenseDetails({ ...epcgLicenseDetails, totalEOPeriodDirectExportEoUsd: e.target.value })
                                }
                                type="number"
                            />
                            <InputField
                                label="Direct Export No Of Shipping Bills"
                                value={epcgLicenseDetails.totalEOPeriodDirectExportNoOfShippingBills}
                                onChange={(e) =>
                                    setEpcgLicenseDetails({ ...epcgLicenseDetails, totalEOPeriodDirectExportNoOfShippingBills: e.target.value })
                                }
                                type="number"
                            />
                            <InputField
                                label="Direct Export Percent"
                                value={epcgLicenseDetails.totalEOPeriodDirectExportPercent}
                                onChange={(e) =>
                                    setEpcgLicenseDetails({ ...epcgLicenseDetails, totalEOPeriodDirectExportPercent: e.target.value })
                                }
                                type="number"
                            />
                            <InputField
                                label="Direct Export Prop Duty Saved"
                                value={epcgLicenseDetails.totalEOPeriodDirectExportPropDutySaved}
                                onChange={(e) =>
                                    setEpcgLicenseDetails({ ...epcgLicenseDetails, totalEOPeriodDirectExportPropDutySaved: e.target.value })
                                }
                                type="number"
                            />
                            <div className="container text-center text-green-700 font-sans font-semibold text-base">
                                Indirect Export
                            </div>
                            <InputField
                                label="Indirect Export EO (INR)"
                                value={epcgLicenseDetails.totalEOPeriodIndirectExportEoInr}
                                onChange={(e) =>
                                    setEpcgLicenseDetails({ ...epcgLicenseDetails, totalEOPeriodIndirectExportEoInr: e.target.value })
                                }
                                type="number"
                            />
                            <InputField
                                label="Indirect Export EO (USD)"
                                value={epcgLicenseDetails.totalEOPeriodIndirectExportEoUsd}
                                onChange={(e) =>
                                    setEpcgLicenseDetails({ ...epcgLicenseDetails, totalEOPeriodIndirectExportEoUsd: e.target.value })
                                }
                                type="number"
                            />
                            <InputField
                                label="Indirect Export No Of Shipping Bills"
                                value={epcgLicenseDetails.totalEOPeriodIndirectExportNoOfShippingBills}
                                onChange={(e) =>
                                    setEpcgLicenseDetails({ ...epcgLicenseDetails, totalEOPeriodIndirectExportNoOfShippingBills: e.target.value })
                                }
                                type="number"
                            />
                            <InputField
                                label="Indirect Export Percent"
                                value={epcgLicenseDetails.totalEOPeriodIndirectExportPercent}
                                onChange={(e) =>
                                    setEpcgLicenseDetails({ ...epcgLicenseDetails, totalEOPeriodIndirectExportPercent: e.target.value })
                                }
                                type="number"
                            />
                            <InputField
                                label="Indirect Export Prop Duty Saved"
                                value={epcgLicenseDetails.totalEOPeriodIndirectExportPropDutySaved}
                                onChange={(e) =>
                                    setEpcgLicenseDetails({ ...epcgLicenseDetails, totalEOPeriodIndirectExportPropDutySaved: e.target.value })
                                }
                                type="number"
                            />
                            <div className="container text-center text-green-700 font-sans font-semibold text-base">
                                Total Export
                            </div>
                            <InputField
                                label="Total Export EO (INR)"
                                value={epcgLicenseDetails.totalEOPeriodTotalExportEoInr}
                                onChange={(e) =>
                                    setEpcgLicenseDetails({ ...epcgLicenseDetails, totalEOPeriodTotalExportEoInr: e.target.value })
                                }
                                type="number"
                            />
                            <InputField
                                label="Total Export EO (USD)"
                                value={epcgLicenseDetails.totalEOPeriodTotalExportEoUsd}
                                onChange={(e) =>
                                    setEpcgLicenseDetails({ ...epcgLicenseDetails, totalEOPeriodTotalExportEoUsd: e.target.value })
                                }
                                type="number"
                            />
                            <InputField
                                label="Total Export No Of Shipping Bills"
                                value={epcgLicenseDetails.totalEOPeriodTotalExportNoOfShippingBills}
                                onChange={(e) =>
                                    setEpcgLicenseDetails({ ...epcgLicenseDetails, totalEOPeriodTotalExportNoOfShippingBills: e.target.value })
                                }
                                type="number"
                            />
                            <InputField
                                label="Total Export Percent"
                                value={epcgLicenseDetails.totalEOPeriodTotalExportPercent}
                                onChange={(e) =>
                                    setEpcgLicenseDetails({ ...epcgLicenseDetails, totalEOPeriodTotalExportPercent: e.target.value })
                                }
                                type="number"
                            />
                            <InputField
                                label="Total Export Prop Duty Saved"
                                value={epcgLicenseDetails.totalEOPeriodTotalExportPropDutySaved}
                                onChange={(e) =>
                                    setEpcgLicenseDetails({ ...epcgLicenseDetails, totalEOPeriodTotalExportPropDutySaved: e.target.value })
                                }
                                type="number"
                            />
                        </div>
                        <div className="bg-white p-4 rounded-md">
                            <div className="container text-center text-green-700 font-sans font-semibold text-lg">
                                Total EO Period Details
                            </div>
                            <div className="container text-center text-green-700 font-sans font-semibold text-base">
                                Direct Export
                            </div>
                            <InputField
                                label="Direct Export EO (INR)"
                                value={epcgLicenseDetails.totalEOPeriodDirectExportEoInr}
                                onChange={(e) =>
                                    setEpcgLicenseDetails({ ...epcgLicenseDetails, totalEOPeriodDirectExportEoInr: e.target.value })
                                }
                                type="number"
                            />
                            <InputField
                                label="Direct Export EO (USD)"
                                value={epcgLicenseDetails.totalEOPeriodDirectExportEoUsd}
                                onChange={(e) =>
                                    setEpcgLicenseDetails({ ...epcgLicenseDetails, totalEOPeriodDirectExportEoUsd: e.target.value })
                                }
                                type="number"
                            />
                            <InputField
                                label="Direct Export No Of Shipping Bills"
                                value={epcgLicenseDetails.totalEOPeriodDirectExportNoOfShippingBills}
                                onChange={(e) =>
                                    setEpcgLicenseDetails({ ...epcgLicenseDetails, totalEOPeriodDirectExportNoOfShippingBills: e.target.value })
                                }
                                type="number"
                            />
                            <InputField
                                label="Direct Export Percent"
                                value={epcgLicenseDetails.totalEOPeriodDirectExportPercent}
                                onChange={(e) =>
                                    setEpcgLicenseDetails({ ...epcgLicenseDetails, totalEOPeriodDirectExportPercent: e.target.value })
                                }
                                type="number"
                            />
                            <InputField
                                label="Direct Export Prop Duty Saved"
                                value={epcgLicenseDetails.totalEOPeriodDirectExportPropDutySaved}
                                onChange={(e) =>
                                    setEpcgLicenseDetails({ ...epcgLicenseDetails, totalEOPeriodDirectExportPropDutySaved: e.target.value })
                                }
                                type="number"
                            />
                            <div className="container text-center text-green-700 font-sans font-semibold text-base">
                                Indirect Export
                            </div>
                            <InputField
                                label="Indirect Export EO (INR)"
                                value={epcgLicenseDetails.totalEOPeriodIndirectExportEoInr}
                                onChange={(e) =>
                                    setEpcgLicenseDetails({ ...epcgLicenseDetails, totalEOPeriodIndirectExportEoInr: e.target.value })
                                }
                                type="number"
                            />
                            <InputField
                                label="Indirect Export EO (USD)"
                                value={epcgLicenseDetails.totalEOPeriodIndirectExportEoUsd}
                                onChange={(e) =>
                                    setEpcgLicenseDetails({ ...epcgLicenseDetails, totalEOPeriodIndirectExportEoUsd: e.target.value })
                                }
                                type="number"
                            />
                            <InputField
                                label="Indirect Export No Of Shipping Bills"
                                value={epcgLicenseDetails.totalEOPeriodIndirectExportNoOfShippingBills}
                                onChange={(e) =>
                                    setEpcgLicenseDetails({ ...epcgLicenseDetails, totalEOPeriodIndirectExportNoOfShippingBills: e.target.value })
                                }
                                type="number"
                            />
                            <InputField
                                label="Indirect Export Percent"
                                value={epcgLicenseDetails.totalEOPeriodIndirectExportPercent}
                                onChange={(e) =>
                                    setEpcgLicenseDetails({ ...epcgLicenseDetails, totalEOPeriodIndirectExportPercent: e.target.value })
                                }
                                type="number"
                            />
                            <InputField
                                label="Indirect Export Prop Duty Saved"
                                value={epcgLicenseDetails.totalEOPeriodIndirectExportPropDutySaved}
                                onChange={(e) =>
                                    setEpcgLicenseDetails({ ...epcgLicenseDetails, totalEOPeriodIndirectExportPropDutySaved: e.target.value })
                                }
                                type="number"
                            />
                            <div className="container text-center text-green-700 font-sans font-semibold text-base">
                                Total Export
                            </div>
                            <InputField
                                label="Total Export EO (INR)"
                                value={epcgLicenseDetails.totalEOPeriodTotalExportEoInr}
                                onChange={(e) =>
                                    setEpcgLicenseDetails({ ...epcgLicenseDetails, totalEOPeriodTotalExportEoInr: e.target.value })
                                }
                                type="number"
                            />
                            <InputField
                                label="Total Export EO (USD)"
                                value={epcgLicenseDetails.totalEOPeriodTotalExportEoUsd}
                                onChange={(e) =>
                                    setEpcgLicenseDetails({ ...epcgLicenseDetails, totalEOPeriodTotalExportEoUsd: e.target.value })
                                }
                                type="number"
                            />
                            <InputField
                                label="Total Export No Of Shipping Bills"
                                value={epcgLicenseDetails.totalEOPeriodTotalExportNoOfShippingBills}
                                onChange={(e) =>
                                    setEpcgLicenseDetails({ ...epcgLicenseDetails, totalEOPeriodTotalExportNoOfShippingBills: e.target.value })
                                }
                                type="number"
                            />
                            <InputField
                                label="Total Export Percent"
                                value={epcgLicenseDetails.totalEOPeriodTotalExportPercent}
                                onChange={(e) =>
                                    setEpcgLicenseDetails({ ...epcgLicenseDetails, totalEOPeriodTotalExportPercent: e.target.value })
                                }
                                type="number"
                            />
                            <InputField
                                label="Total Export Prop Duty Saved"
                                value={epcgLicenseDetails.totalEOPeriodTotalExportPropDutySaved}
                                onChange={(e) =>
                                    setEpcgLicenseDetails({ ...epcgLicenseDetails, totalEOPeriodTotalExportPropDutySaved: e.target.value })
                                }
                                type="number"
                            />
                        </div>
                        <div className="bg-white p-4 rounded-md">
                            <div className="container text-center text-green-700 font-sans font-semibold text-lg">
                                Remarks
                            </div>
                            <InputField
                                label="Remarks"
                                value={epcgLicenseDetails.remarks}
                                onChange={(e) =>
                                    setEpcgLicenseDetails({ ...epcgLicenseDetails, remarks: e.target.value })
                                }
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

export default EpcgLicenseSummary;