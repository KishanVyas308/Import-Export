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
import { useNavigate } from 'react-router-dom';

const EpcgLicenseSummary = () => {

    const { user } = useRecoilValue(authAtom);
    const [cookies] = useCookies(['token']);
    const [loading, setLoading] = useState(false);
    const [customerNames, setCustomerNames] = useState<CustomerDetail[]>([]);

    const navigate = useNavigate()

    // Drop Down means - type = select and opttion = array of given things


    // State to manage EPCG License details
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

        hsCodeAsPerLicenseEoInr: '', // L // no calculation // Number
        descriptionAsPerLicenseEoUsd: '', // M // no calculation // Number
        dutySavedValueDutyUtilizedValue: '', // N // no calculation // Number

        hsCodeAsPerEoFullfillmentSummaryEoInr: '', // O // (L * N) / K // Number 
        descriptionAsPerEoFullfillmentSummaryEoUsd: '', // P // (M * N) / K // Number
        installationDate: '', // Q // no calculation // Date  // manualy

        averageExportImposedAsPerLicenseInr: '', // R // no calculation // Number
        averageExportNoOfYears: '', // S // no calculation // Number
        averageExportTotalAeoImposedInr: '', // T // (R * S) // Number
        averageExportFulfilledInr: '', // U // no calculation // Number
        averageExportNoOfShippingBills: '', // V // no calculation // Number
        averageExportFulfilledPercent: '', // W // (U / T) // Number

        block1stImposedBlockCompletionDate: '', // X // (D + 4 years - 1 day) // Date
        block1stImposedBlockExtension: '', // Y // no calculation // Drop Down [Yes, No]  // manualy
        block1stImposedExtensionYearIfAny: '', // Z // no calculation // Dorp Doen [5 years, 6 years]  // manualy
        block1stImposedBlockExtensionDate: '', // AA // (D + 6 years - 1 day) // Date
        block1stImposedBlockBlanceDaysCompletionDate: '', // AB (x - Current Date) // Number
        block1stImposedBlockBlanceDaysExtensionDate: '', // AC (AA - Current Date) // Number
        block1stImposedEoInr: '', // AD // (O * 50%) // Number
        block1stImposedEoUsd: '', // AE // (P * 50%) // Number

        block1stDirectExportEoInr: '', // AF // no calculation // Number
        block1stDirectExportEoUsd: '', // AG // no calculation // Number
        block1stDirectExportNoOfShippingBills: '', // AH // no calculation // Number
        block1stDirectExportPercent: '', // AI // (AG / P) // Number
        block1stDirectExportPropDutySaved: '', // AJ // (N * AI) // Number

        block1stIndirectExportEoInr: '', // AK // no calculation // Number
        block1stIndirectExportEoUsd: '', // AL // no calculation // Number
        block1stIndirectExportNoOfShippingBills: '', // AM // no calculation // Number 
        block1stIndirectExportPercent: '', // AN // (AL / P) // Number
        block1stIndirectExportPropDutySaved: '', // AO // (N * AN) // Number

        block1stTotalExportEoInr: '', // AP // (AF + AK) // Number
        block1stTotalExportEoUsd: '', // AQ // (AG + AL) // Number
        block1stTotalExportNoOfShippingBills: '', // AR // (AH + AM) // Number
        block1stTotalExportPercent: '', // AS // (AQ / P) // Number
        block1stTotalExportPropDutySaved: '', // AT // (N * AS) // Number

        block1stDifferentialEoEoInr: '', // AU // (AD - AP) // Number
        block1stDifferentialEoEoInrPercent: '', // AV // (AU / O) // Number
        block1stDifferentialEoEoUsd: '', // AW // (AE - AQ) // Number
        block1stDifferentialEoEoUsdPercent: '', // AX // (AW / P) // Number
        block1stDifferentialEoPropDutySaved: '', // AY // (N * AX) // Number


        block2ndImposed2ndBlockEoPeriodCompletionDate: '', // AZ // (D + 6 years - 1 day) // Date
        block2ndImposedEoPeriodExtensionIfAny: '', // BA // no calculation // Drop Down [Yes, No]  // manualy
        block2ndImposedEoPeriodExtensionYear: '', // BB // no calculation // Drop Down [1 years, 2 years]  // manualy
        block2ndImposedEoPeriodExtensionDate: '', // BC // no calculation // Drop Down [D + 8 years - 1 day , D + 7 years - 1 day]
        block2ndImposedEoPeriodBalanceDaysCompletionDate: '', // BD // (AZ - Current Date) // Number
        block2ndImposedEoPeriodBalanceDaysExtensionDate: '', // BE // (BC - Current Date) // Number
        block2ndImposedEoInr: '', // BF // (O * 50%) // Number
        block2ndImposedEoUsd: '', // BG // (P * 50%) // Number

        block2ndDirectExportEoInr: '', // BH // no calculation // Number
        block2ndDirectExportEoUsd: '', // BI // no calculation // Number
        block2ndDirectExportNoOfShippingBills: '', // BJ // no calculation // Number
        block2ndDirectExportPercent: '', // BK // (BI / P) // Number
        block2ndDirectExportPropDutySaved: '', // BL // (N * BK) // Number

        block2ndIndirectExportEoInr: '', // BM // no calculation // Number
        block2ndIndirectExportEoUsd: '', // BN // no calculation // Number
        block2ndIndirectExportNoOfShippingBills: '', // BO // no calculation // Number
        block2ndIndirectExportPercent: '', // BP // (BN / P) // Number
        block2ndIndirectExportPropDutySaved: '', // BQ // (N * BP) // Number

        block2ndTotalExportEoInr: '', // BR // (BH + BM) // Number
        block2ndTotalExportEoUsd: '', // BS // (BI + BN) // Number
        block2ndTotalExportNoOfShippingBills: '', // BT // (BJ + BO) // Number
        block2ndTotalExportPercent: '', // BU // (BS / P) // Number
        block2ndTotalExportPropDutySaved: '', // BV // (N * BU) // Number

        block2ndDifferentialEoEoInr: '', // BW // (BF - BR) // Number
        block2ndDifferentialEoEoInrPercent: '', // BX // (BW / O) // Number
        block2ndDifferentialEoEoUsd: '', // BY // (BG - BS) // Number
        block2ndDifferentialEoEoUsdPercent: '', // BZ // (BY / P) // Number
        block2ndDifferentialEoPropDutySaved: '', // CA // (N * BZ) // Number

        totalEoPeriodImposedEoPeriodCompletionDate: '', // CB // AZ // Date
        totalEoPeriodImposedEoPeriodExtensionIfAny: '', // CC // BA // Drop Down [Yes, No]
        totalEoPeriodImposedEoPeriodExtensionYear: '', // CD // BB // Drop Down [1 years, 2 years]
        totalEoPeriodImposedEoPeriodExtensionDate: '', // CE // BC // Drop Down [D + 8 years - 1 day , D + 7 years - 1 day]
        totalEoPeriodImposedEoPeriodBalanceDaysCompletionDate: '', // CF // BD // Number
        totalEoPeriodImposedEoPeriodBalanceDaysExtensionDate: '', // CG // BE // Number
        totalEoPeriodImposedEoInr: '', // CH // (AD + BF) // Number
        totalEoPeriodImposedEoUsd: '', // CI // (AE + BG) // Number

        totalEOPeriodDirectExportEoInr: '', // CJ // (AF + BH) // Number
        totalEOPeriodDirectExportEoUsd: '', // CK // (AG + BI) // Number
        totalEOPeriodDirectExportNoOfShippingBills: '', // CL // (AH + BJ) // Number
        totalEOPeriodDirectExportPercent: '', // CM // (AI + BK) // Number
        totalEOPeriodDirectExportPropDutySaved: '', // CN // (AJ + BL) // Number

        totalEOPeriodIndirectExportEoInr: '', // CO // (AK + BM) // Number
        totalEOPeriodIndirectExportEoUsd: '', // CP // (AL + BN) // Number
        totalEOPeriodIndirectExportNoOfShippingBills: '', // CQ // (AM + BO) // Number
        totalEOPeriodIndirectExportPercent: '', // CR // (AN + BP) // Number
        totalEOPeriodIndirectExportPropDutySaved: '', // CS // (AO + BQ) // Number

        totalEOPeriodTotalExportEoInr: '', // CT // (CJ + CO) // Number
        totalEOPeriodTotalExportEoUsd: '', // CU // (CK + CP) // Number
        totalEOPeriodTotalExportNoOfShippingBills: '', // CV // (CL + CQ) // Number
        totalEOPeriodTotalExportPercent: '', // CW // (CM + CR) // Number
        totalEOPeriodTotalExportPropDutySaved: '', // CX // (CN + CS) // Number

        totalEoPeriodDifferentialEoEoInr: '', // CY // (O - CT) // Number
        totalEoPeriodDifferentialEoEoInrPercent: '', // CZ // (CY / O) // Number
        totalEoPeriodDifferentialEoEoUsd: '', // DA // (P - CU) // Number
        totalEoPeriodDifferentialEoEoUsdPercent: '', // DB // (DA / P) // Number
        totalEoPeriodDifferentialEoPropDutySaved: '', // DC // (N * DB) // Number

        EarlyEoFullfillment1stEoDate: '', // DD // no calculation // Date  // manualy
        EarlyEoFullfillmentLastEoDate: '', // DE // no calculation // Date  // manualy
        EarlyEoFullfillmentEoPeriodWithin3yearsOrNot: '', // DF // (D - DD) < 3 years 
        EarlyEoFullfillmentEarlyEoFullfillment: '', // DG // no calculation // Drop Down [Yes, No] The condition should be "yes" if the EO period is within three years.

        remarks: '', // DH // no calculation // text  // manualy
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





    // Predefined data based on srNo
    useEffect(() => {
        
        if (epcgLicenseDetails.srNo && epcgLicenseDetails.srNo !== '') {
            const srNo = parseInt(epcgLicenseDetails.srNo);

            let predefinedData = {};

            if (srNo == 1) {
                predefinedData = {
                    licenseNo: '123456',
                    licenseDate: '2022-06-15',
                    fileNo: '78901',
                    bankGuaranteeAmountRs: '500000',
                    bankGuaranteeValidityFrom: '2022-01-01',
                    bankGuaranteeValidityTo: '2025-12-31',
                    bankGuaranteeSubmittedTo: 'State Bank of India',
                    dutySavedValueAmountInr: '1000000',
                    hsCodeAsPerLicenseEoInr: '2000000',
                    descriptionAsPerLicenseEoUsd: '150000',
                    dutySavedValueDutyUtilizedValue: '800000',
                    averageExportImposedAsPerLicenseInr: '500000',
                    averageExportNoOfYears: '3',
                    averageExportFulfilledInr: '300000',
                    averageExportNoOfShippingBills: '25',
                    block1stDirectExportEoInr: '200000',
                    block1stDirectExportEoUsd: '75000',
                    block1stDirectExportNoOfShippingBills: '15',
                    block1stIndirectExportEoInr: '100000',
                    block1stIndirectExportEoUsd: '50000',
                    block1stIndirectExportNoOfShippingBills: '10',
                    block2ndDirectExportEoInr: '150000',
                    block2ndDirectExportEoUsd: '60000',
                    block2ndDirectExportNoOfShippingBills: '12',
                    block2ndIndirectExportEoInr: '80000',
                    block2ndIndirectExportEoUsd: '40000',
                    block2ndIndirectExportNoOfShippingBills: '8',
                };
            } else if (srNo === 2) {
                predefinedData = {
                    licenseNo: '654321',
                    licenseDate: '2021-03-20',
                    fileNo: '10987',
                    bankGuaranteeAmountRs: '750000',
                    bankGuaranteeValidityFrom: '2021-01-01',
                    bankGuaranteeValidityTo: '2026-12-31',
                    bankGuaranteeSubmittedTo: 'HDFC Bank',
                    dutySavedValueAmountInr: '1500000',
                    hsCodeAsPerLicenseEoInr: '3000000',
                    descriptionAsPerLicenseEoUsd: '200000',
                    dutySavedValueDutyUtilizedValue: '1200000',
                    averageExportImposedAsPerLicenseInr: '750000',
                    averageExportNoOfYears: '4',
                    averageExportFulfilledInr: '500000',
                    averageExportNoOfShippingBills: '35',
                    block1stDirectExportEoInr: '300000',
                    block1stDirectExportEoUsd: '100000',
                    block1stDirectExportNoOfShippingBills: '20',
                    block1stIndirectExportEoInr: '150000',
                    block1stIndirectExportEoUsd: '75000',
                    block1stIndirectExportNoOfShippingBills: '15',
                    block2ndDirectExportEoInr: '250000',
                    block2ndDirectExportEoUsd: '90000',
                    block2ndDirectExportNoOfShippingBills: '18',
                    block2ndIndirectExportEoInr: '120000',
                    block2ndIndirectExportEoUsd: '60000',
                    block2ndIndirectExportNoOfShippingBills: '12',
                };
            } else {
                // For any other srNo, clear all non-manual fields
                predefinedData = {
                    licenseNo: '',
                    licenseDate: '',
                    fileNo: '',
                    bankGuaranteeAmountRs: '',
                    bankGuaranteeValidityFrom: '',
                    bankGuaranteeValidityTo: '',
                    bankGuaranteeSubmittedTo: '',
                    dutySavedValueAmountInr: '',
                    hsCodeAsPerLicenseEoInr: '',
                    descriptionAsPerLicenseEoUsd: '',
                    dutySavedValueDutyUtilizedValue: '',
                    averageExportImposedAsPerLicenseInr: '',
                    averageExportNoOfYears: '',
                    averageExportFulfilledInr: '',
                    averageExportNoOfShippingBills: '',
                    block1stDirectExportEoInr: '',
                    block1stDirectExportEoUsd: '',
                    block1stDirectExportNoOfShippingBills: '',
                    block1stIndirectExportEoInr: '',
                    block1stIndirectExportEoUsd: '',
                    block1stIndirectExportNoOfShippingBills: '',
                    block2ndDirectExportEoInr: '',
                    block2ndDirectExportEoUsd: '',
                    block2ndDirectExportNoOfShippingBills: '',
                    block2ndIndirectExportEoInr: '',
                    block2ndIndirectExportEoUsd: '',
                    block2ndIndirectExportNoOfShippingBills: '',
                };
            }

            setEpcgLicenseDetails(prev => ({
                ...prev,
                ...predefinedData
            }));
        }
    }, [epcgLicenseDetails.srNo]);


    const calculatedEpcgLicenseDetails = useMemo(() => {
        const {
            dutySavedValueAmountInr,
            hsCodeAsPerLicenseEoInr,
            descriptionAsPerLicenseEoUsd,
            dutySavedValueDutyUtilizedValue,
            licenseDate,
            averageExportImposedAsPerLicenseInr,
            averageExportNoOfYears,
            block2ndImposedEoPeriodExtensionIfAny,
            block2ndImposedEoPeriodExtensionYear,
            EarlyEoFullfillment1stEoDate,
        } = epcgLicenseDetails;

        const O = String((Number(hsCodeAsPerLicenseEoInr) * Number(dutySavedValueDutyUtilizedValue)) / Number(dutySavedValueAmountInr));
        const P = String((Number(descriptionAsPerLicenseEoUsd) * Number(dutySavedValueDutyUtilizedValue)) / Number(dutySavedValueAmountInr));
        const T = String(Number(averageExportImposedAsPerLicenseInr) * Number(averageExportNoOfYears));
        const W = String((Number(epcgLicenseDetails.averageExportFulfilledInr) / Number(T)) * 100);
        const X = licenseDate ? new Date(new Date(licenseDate).setFullYear(new Date(licenseDate).getFullYear() + 4 - 1)).toISOString().split('T')[0] : '';
        const AA = licenseDate ? new Date(new Date(licenseDate).setFullYear(new Date(licenseDate).getFullYear() + 6 - 1)).toISOString().split('T')[0] : '';
        const AB = String(Math.ceil((new Date(X).getTime() - new Date().getTime()) / (1000 * 3600 * 24)));
        const AC = String(Math.ceil((new Date(AA).getTime() - new Date().getTime()) / (1000 * 3600 * 24)));
        const AD = String(Number(O) * 0.5);
        const AE = String(Number(P) * 0.5);
        const AI = String((Number(epcgLicenseDetails.block1stDirectExportEoUsd) / Number(P)) * 100);
        const AJ = String(Number(dutySavedValueDutyUtilizedValue) * Number(AI));
        const AN = String((Number(epcgLicenseDetails.block1stIndirectExportEoUsd) / Number(P)) * 100);
        const AO = String(Number(dutySavedValueDutyUtilizedValue) * Number(AN));
        const AP = String(Number(epcgLicenseDetails.block1stDirectExportEoInr) + Number(epcgLicenseDetails.block1stIndirectExportEoInr));
        const AQ = String(Number(epcgLicenseDetails.block1stDirectExportEoUsd) + Number(epcgLicenseDetails.block1stIndirectExportEoUsd));
        const AR = String(Number(epcgLicenseDetails.block1stDirectExportNoOfShippingBills) + Number(epcgLicenseDetails.block1stIndirectExportNoOfShippingBills));
        const AS = String((Number(AQ) / Number(P)) * 100);
        const AT = String(Number(dutySavedValueDutyUtilizedValue) * Number(AS));
        const AU = String(Number(AD) - Number(AP));
        const AV = String((Number(AU) / Number(O)) * 100);
        const AW = String(Number(AE) - Number(AQ));
        const AX = String((Number(AW) / Number(P)) * 100);
        const AY = String(Number(dutySavedValueDutyUtilizedValue) * Number(AX));
        const AZ = licenseDate ? new Date(new Date(licenseDate).setFullYear(new Date(licenseDate).getFullYear() + 6 - 1)).toISOString().split('T')[0] : '';
        const BC = licenseDate ? (block2ndImposedEoPeriodExtensionYear === '1 years' ? new Date(new Date(licenseDate).setFullYear(new Date(licenseDate).getFullYear() + 7 - 1)).toISOString().split('T')[0] : new Date(new Date(licenseDate).setFullYear(new Date(licenseDate).getFullYear() + 8 - 1)).toISOString().split('T')[0]) : '';
        const BD = String(Math.ceil((new Date(AZ).getTime() - new Date().getTime()) / (1000 * 3600 * 24)));
        const BE = String(Math.ceil((new Date(BC).getTime() - new Date().getTime()) / (1000 * 3600 * 24)));
        const BF = String(Number(O) * 0.5);
        const BG = String(Number(P) * 0.5);
        const BK = String((Number(epcgLicenseDetails.block2ndDirectExportEoUsd) / Number(P)) * 100);
        const BL = String(Number(dutySavedValueDutyUtilizedValue) * Number(BK));
        const BP = String((Number(epcgLicenseDetails.block2ndIndirectExportEoUsd) / Number(P)) * 100);
        const BQ = String(Number(dutySavedValueDutyUtilizedValue) * Number(BP));
        const BR = String(Number(epcgLicenseDetails.block2ndDirectExportEoInr) + Number(epcgLicenseDetails.block2ndIndirectExportEoInr));
        const BS = String(Number(epcgLicenseDetails.block2ndDirectExportEoUsd) + Number(epcgLicenseDetails.block2ndIndirectExportEoUsd));
        const BT = String(Number(epcgLicenseDetails.block2ndDirectExportNoOfShippingBills) + Number(epcgLicenseDetails.block2ndIndirectExportNoOfShippingBills));
        const BU = String((Number(BS) / Number(P)) * 100);
        const BV = String(Number(dutySavedValueDutyUtilizedValue) * Number(BU));
        const BW = String(Number(BF) - Number(BR));
        const BX = String((Number(BW) / Number(O)) * 100);
        const BY = String(Number(BG) - Number(BS));
        const BZ = String((Number(BY) / Number(P)) * 100);
        const CA = String(Number(dutySavedValueDutyUtilizedValue) * Number(BZ));
        const CB = AZ;
        const CC = block2ndImposedEoPeriodExtensionIfAny;
        const CD = block2ndImposedEoPeriodExtensionYear;
        const CE = BC;
        const CF = BD;
        const CG = BE;
        const CH = String(Number(AD) + Number(BF));
        const CI = String(Number(AE) + Number(BG));
        const CJ = String(Number(epcgLicenseDetails.block1stDirectExportEoInr) + Number(epcgLicenseDetails.block2ndDirectExportEoInr));
        const CK = String(Number(epcgLicenseDetails.block1stDirectExportEoUsd) + Number(epcgLicenseDetails.block2ndDirectExportEoUsd));
        const CL = String(Number(epcgLicenseDetails.block1stDirectExportNoOfShippingBills) + Number(epcgLicenseDetails.block2ndDirectExportNoOfShippingBills));
        const CM = String(Number(AI) + Number(BK));
        const CN = String(Number(AJ) + Number(BL));
        const CO = String(Number(epcgLicenseDetails.block1stIndirectExportEoInr) + Number(epcgLicenseDetails.block2ndIndirectExportEoInr));
        const CP = String(Number(epcgLicenseDetails.block1stIndirectExportEoUsd) + Number(epcgLicenseDetails.block2ndIndirectExportEoUsd));
        const CQ = String(Number(epcgLicenseDetails.block1stIndirectExportNoOfShippingBills) + Number(epcgLicenseDetails.block2ndIndirectExportNoOfShippingBills));
        const CR = String(Number(AN) + Number(BP));
        const CS = String(Number(AO) + Number(BQ));
        const CT = String(Number(CJ) + Number(CO));
        const CU = String(Number(CK) + Number(CP));
        const CV = String(Number(CL) + Number(CQ));
        const CW = String(Number(CM) + Number(CR));
        const CX = String(Number(CN) + Number(CS));
        const CY = String(Number(O) - Number(CT));
        const CZ = String((Number(CY) / Number(O)) * 100);
        const DA = String(Number(P) - Number(CU));
        const DB = String((Number(DA) / Number(P)) * 100);
        const DC = String(Number(dutySavedValueDutyUtilizedValue) * Number(DB));
        const DF = (new Date(licenseDate).getTime() - new Date(EarlyEoFullfillment1stEoDate).getTime()) / (1000 * 3600 * 24 * 365) < 3;
        const DG = DF ? 'Yes' : 'No';

        return {
            ...epcgLicenseDetails,
            hsCodeAsPerEoFullfillmentSummaryEoInr: O,
            descriptionAsPerEoFullfillmentSummaryEoUsd: P,
            averageExportTotalAeoImposedInr: T,
            averageExportFulfilledPercent: W,
            block1stImposedBlockCompletionDate: X,
            block1stImposedBlockExtensionDate: AA,
            block1stImposedBlockBlanceDaysCompletionDate: AB,
            block1stImposedBlockBlanceDaysExtensionDate: AC,
            block1stImposedEoInr: AD,
            block1stImposedEoUsd: AE,
            block1stDirectExportPercent: AI,
            block1stDirectExportPropDutySaved: AJ,
            block1stIndirectExportPercent: AN,
            block1stIndirectExportPropDutySaved: AO,
            block1stTotalExportEoInr: AP,
            block1stTotalExportEoUsd: AQ,
            block1stTotalExportNoOfShippingBills: AR,
            block1stTotalExportPercent: AS,
            block1stTotalExportPropDutySaved: AT,
            block1stDifferentialEoEoInr: AU,
            block1stDifferentialEoEoInrPercent: AV,
            block1stDifferentialEoEoUsd: AW,
            block1stDifferentialEoEoUsdPercent: AX,
            block1stDifferentialEoPropDutySaved: AY,
            block2ndImposed2ndBlockEoPeriodCompletionDate: AZ,
            block2ndImposedEoPeriodExtensionDate: BC,
            block2ndImposedEoPeriodBalanceDaysCompletionDate: BD,
            block2ndImposedEoPeriodBalanceDaysExtensionDate: BE,
            block2ndImposedEoInr: BF,
            block2ndImposedEoUsd: BG,
            block2ndDirectExportPercent: BK,
            block2ndDirectExportPropDutySaved: BL,
            block2ndIndirectExportPercent: BP,
            block2ndIndirectExportPropDutySaved: BQ,
            block2ndTotalExportEoInr: BR,
            block2ndTotalExportEoUsd: BS,
            block2ndTotalExportNoOfShippingBills: BT,
            block2ndTotalExportPercent: BU,
            block2ndTotalExportPropDutySaved: BV,
            block2ndDifferentialEoEoInr: BW,
            block2ndDifferentialEoEoInrPercent: BX,
            block2ndDifferentialEoEoUsd: BY,
            block2ndDifferentialEoEoUsdPercent: BZ,
            block2ndDifferentialEoPropDutySaved: CA,
            totalEoPeriodImposedEoPeriodCompletionDate: CB,
            totalEoPeriodImposedEoPeriodExtensionIfAny: CC,
            totalEoPeriodImposedEoPeriodExtensionYear: CD,
            totalEoPeriodImposedEoPeriodExtensionDate: CE,
            totalEoPeriodImposedEoPeriodBalanceDaysCompletionDate: CF,
            totalEoPeriodImposedEoPeriodBalanceDaysExtensionDate: CG,
            totalEoPeriodImposedEoInr: CH,
            totalEoPeriodImposedEoUsd: CI,
            totalEOPeriodDirectExportEoInr: CJ,
            totalEOPeriodDirectExportEoUsd: CK,
            totalEOPeriodDirectExportNoOfShippingBills: CL,
            totalEOPeriodDirectExportPercent: CM,
            totalEOPeriodDirectExportPropDutySaved: CN,
            totalEOPeriodIndirectExportEoInr: CO,
            totalEOPeriodIndirectExportEoUsd: CP,
            totalEOPeriodIndirectExportNoOfShippingBills: CQ,
            totalEOPeriodIndirectExportPercent: CR,
            totalEOPeriodIndirectExportPropDutySaved: CS,
            totalEOPeriodTotalExportEoInr: CT,
            totalEOPeriodTotalExportEoUsd: CU,
            totalEOPeriodTotalExportNoOfShippingBills: CV,
            totalEOPeriodTotalExportPercent: CW,
            totalEOPeriodTotalExportPropDutySaved: CX,
            totalEoPeriodDifferentialEoEoInr: CY,
            totalEoPeriodDifferentialEoEoInrPercent: CZ,
            totalEoPeriodDifferentialEoEoUsd: DA,
            totalEoPeriodDifferentialEoEoUsdPercent: DB,
            totalEoPeriodDifferentialEoPropDutySaved: DC,
            EarlyEoFullfillmentEoPeriodWithin3yearsOrNot: String(DF),
            EarlyEoFullfillmentEarlyEoFullfillment: DG,
        };
    }, [
        epcgLicenseDetails.dutySavedValueAmountInr,
        epcgLicenseDetails.hsCodeAsPerLicenseEoInr,
        epcgLicenseDetails.descriptionAsPerLicenseEoUsd,
        epcgLicenseDetails.dutySavedValueDutyUtilizedValue,
        epcgLicenseDetails.licenseDate,
        epcgLicenseDetails.averageExportImposedAsPerLicenseInr,
        epcgLicenseDetails.averageExportNoOfYears,
        epcgLicenseDetails.block1stImposedBlockCompletionDate,
        epcgLicenseDetails.block1stImposedBlockExtension,
        epcgLicenseDetails.block1stImposedExtensionYearIfAny,
        epcgLicenseDetails.block2ndImposed2ndBlockEoPeriodCompletionDate,
        epcgLicenseDetails.block2ndImposedEoPeriodExtensionIfAny,
        epcgLicenseDetails.block2ndImposedEoPeriodExtensionYear,
        epcgLicenseDetails.EarlyEoFullfillment1stEoDate,
        epcgLicenseDetails.EarlyEoFullfillmentLastEoDate,
        epcgLicenseDetails.averageExportFulfilledInr,
        epcgLicenseDetails.block1stDirectExportEoUsd,
        epcgLicenseDetails.block1stIndirectExportEoUsd,
        epcgLicenseDetails.block1stDirectExportEoInr,
        epcgLicenseDetails.block1stIndirectExportEoInr,
        epcgLicenseDetails.block1stDirectExportNoOfShippingBills,
        epcgLicenseDetails.block1stIndirectExportNoOfShippingBills,
        epcgLicenseDetails.block2ndDirectExportEoUsd,
        epcgLicenseDetails.block2ndIndirectExportEoUsd,
        epcgLicenseDetails.block2ndDirectExportEoInr,
        epcgLicenseDetails.block2ndIndirectExportEoInr,
        epcgLicenseDetails.block2ndDirectExportNoOfShippingBills,
        epcgLicenseDetails.block2ndIndirectExportNoOfShippingBills,
    ]);

    useEffect(() => {
        setEpcgLicenseDetails({
            ...calculatedEpcgLicenseDetails,
            hsCodeAsPerEoFullfillmentSummaryEoInr: String(calculatedEpcgLicenseDetails.hsCodeAsPerEoFullfillmentSummaryEoInr),
            descriptionAsPerEoFullfillmentSummaryEoUsd: String(calculatedEpcgLicenseDetails.descriptionAsPerEoFullfillmentSummaryEoUsd),
            averageExportTotalAeoImposedInr: String(calculatedEpcgLicenseDetails.averageExportTotalAeoImposedInr),
            averageExportFulfilledPercent: String(calculatedEpcgLicenseDetails.averageExportFulfilledPercent),
            block1stImposedBlockBlanceDaysCompletionDate: String(calculatedEpcgLicenseDetails.block1stImposedBlockBlanceDaysCompletionDate),
            block1stImposedBlockBlanceDaysExtensionDate: String(calculatedEpcgLicenseDetails.block1stImposedBlockBlanceDaysExtensionDate),
            block1stImposedEoInr: String(calculatedEpcgLicenseDetails.block1stImposedEoInr),
            block1stImposedEoUsd: String(calculatedEpcgLicenseDetails.block1stImposedEoUsd),
            block1stDirectExportPercent: String(calculatedEpcgLicenseDetails.block1stDirectExportPercent),
            block1stDirectExportPropDutySaved: String(calculatedEpcgLicenseDetails.block1stDirectExportPropDutySaved),
            block1stIndirectExportPercent: String(calculatedEpcgLicenseDetails.block1stIndirectExportPercent),
            block1stIndirectExportPropDutySaved: String(calculatedEpcgLicenseDetails.block1stIndirectExportPropDutySaved),
            block1stTotalExportEoInr: String(calculatedEpcgLicenseDetails.block1stTotalExportEoInr),
            block1stTotalExportEoUsd: String(calculatedEpcgLicenseDetails.block1stTotalExportEoUsd),
            block1stTotalExportNoOfShippingBills: String(calculatedEpcgLicenseDetails.block1stTotalExportNoOfShippingBills),
            block1stTotalExportPercent: String(calculatedEpcgLicenseDetails.block1stTotalExportPercent),
            block1stTotalExportPropDutySaved: String(calculatedEpcgLicenseDetails.block1stTotalExportPropDutySaved),
            block1stDifferentialEoEoInr: String(calculatedEpcgLicenseDetails.block1stDifferentialEoEoInr),
            block1stDifferentialEoEoInrPercent: String(calculatedEpcgLicenseDetails.block1stDifferentialEoEoInrPercent),
            block1stDifferentialEoEoUsd: String(calculatedEpcgLicenseDetails.block1stDifferentialEoEoUsd),
            block1stDifferentialEoEoUsdPercent: String(calculatedEpcgLicenseDetails.block1stDifferentialEoEoUsdPercent),
            block1stDifferentialEoPropDutySaved: String(calculatedEpcgLicenseDetails.block1stDifferentialEoPropDutySaved),
            block2ndImposedEoPeriodBalanceDaysCompletionDate: String(calculatedEpcgLicenseDetails.block2ndImposedEoPeriodBalanceDaysCompletionDate),
            block2ndImposedEoPeriodBalanceDaysExtensionDate: String(calculatedEpcgLicenseDetails.block2ndImposedEoPeriodBalanceDaysExtensionDate),
            block2ndImposedEoInr: String(calculatedEpcgLicenseDetails.block2ndImposedEoInr),
            block2ndImposedEoUsd: String(calculatedEpcgLicenseDetails.block2ndImposedEoUsd),
            block2ndDirectExportPercent: String(calculatedEpcgLicenseDetails.block2ndDirectExportPercent),
            block2ndDirectExportPropDutySaved: String(calculatedEpcgLicenseDetails.block2ndDirectExportPropDutySaved),
            block2ndIndirectExportPercent: String(calculatedEpcgLicenseDetails.block2ndIndirectExportPercent),
            block2ndIndirectExportPropDutySaved: String(calculatedEpcgLicenseDetails.block2ndIndirectExportPropDutySaved),
            block2ndTotalExportEoInr: String(calculatedEpcgLicenseDetails.block2ndTotalExportEoInr),
            block2ndTotalExportEoUsd: String(calculatedEpcgLicenseDetails.block2ndTotalExportEoUsd),
            block2ndTotalExportNoOfShippingBills: String(calculatedEpcgLicenseDetails.block2ndTotalExportNoOfShippingBills),
            block2ndTotalExportPercent: String(calculatedEpcgLicenseDetails.block2ndTotalExportPercent),
            block2ndTotalExportPropDutySaved: String(calculatedEpcgLicenseDetails.block2ndTotalExportPropDutySaved),
            block2ndDifferentialEoEoInr: String(calculatedEpcgLicenseDetails.block2ndDifferentialEoEoInr),
            block2ndDifferentialEoEoInrPercent: String(calculatedEpcgLicenseDetails.block2ndDifferentialEoEoInrPercent),
            block2ndDifferentialEoEoUsd: String(calculatedEpcgLicenseDetails.block2ndDifferentialEoEoUsd),
            block2ndDifferentialEoEoUsdPercent: String(calculatedEpcgLicenseDetails.block2ndDifferentialEoEoUsdPercent),
            block2ndDifferentialEoPropDutySaved: String(calculatedEpcgLicenseDetails.block2ndDifferentialEoPropDutySaved),
            totalEoPeriodImposedEoPeriodBalanceDaysCompletionDate: String(calculatedEpcgLicenseDetails.totalEoPeriodImposedEoPeriodBalanceDaysCompletionDate),
            totalEoPeriodImposedEoPeriodBalanceDaysExtensionDate: String(calculatedEpcgLicenseDetails.totalEoPeriodImposedEoPeriodBalanceDaysExtensionDate),
            totalEoPeriodImposedEoInr: String(calculatedEpcgLicenseDetails.totalEoPeriodImposedEoInr),
            totalEoPeriodImposedEoUsd: String(calculatedEpcgLicenseDetails.totalEoPeriodImposedEoUsd),
            totalEOPeriodDirectExportEoInr: String(calculatedEpcgLicenseDetails.totalEOPeriodDirectExportEoInr),
            totalEOPeriodDirectExportEoUsd: String(calculatedEpcgLicenseDetails.totalEOPeriodDirectExportEoUsd),
            totalEOPeriodDirectExportNoOfShippingBills: String(calculatedEpcgLicenseDetails.totalEOPeriodDirectExportNoOfShippingBills),
            totalEOPeriodDirectExportPercent: String(calculatedEpcgLicenseDetails.totalEOPeriodDirectExportPercent),
            totalEOPeriodDirectExportPropDutySaved: String(calculatedEpcgLicenseDetails.totalEOPeriodDirectExportPropDutySaved),
            totalEOPeriodIndirectExportEoInr: String(calculatedEpcgLicenseDetails.totalEOPeriodIndirectExportEoInr),
            totalEOPeriodIndirectExportEoUsd: String(calculatedEpcgLicenseDetails.totalEOPeriodIndirectExportEoUsd),
            totalEOPeriodIndirectExportNoOfShippingBills: String(calculatedEpcgLicenseDetails.totalEOPeriodIndirectExportNoOfShippingBills),
            totalEOPeriodIndirectExportPercent: String(calculatedEpcgLicenseDetails.totalEOPeriodIndirectExportPercent),
            totalEOPeriodIndirectExportPropDutySaved: String(calculatedEpcgLicenseDetails.totalEOPeriodIndirectExportPropDutySaved),
            totalEOPeriodTotalExportEoInr: String(calculatedEpcgLicenseDetails.totalEOPeriodTotalExportEoInr),
            totalEOPeriodTotalExportEoUsd: String(calculatedEpcgLicenseDetails.totalEOPeriodTotalExportEoUsd),
            totalEOPeriodTotalExportNoOfShippingBills: String(calculatedEpcgLicenseDetails.totalEOPeriodTotalExportNoOfShippingBills),
            totalEOPeriodTotalExportPercent: String(calculatedEpcgLicenseDetails.totalEOPeriodTotalExportPercent),
            totalEOPeriodTotalExportPropDutySaved: String(calculatedEpcgLicenseDetails.totalEOPeriodTotalExportPropDutySaved),
            totalEoPeriodDifferentialEoEoInr: String(calculatedEpcgLicenseDetails.totalEoPeriodDifferentialEoEoInr),
            totalEoPeriodDifferentialEoEoInrPercent: String(calculatedEpcgLicenseDetails.totalEoPeriodDifferentialEoEoInrPercent),
            totalEoPeriodDifferentialEoEoUsd: String(calculatedEpcgLicenseDetails.totalEoPeriodDifferentialEoEoUsd),
            totalEoPeriodDifferentialEoEoUsdPercent: String(calculatedEpcgLicenseDetails.totalEoPeriodDifferentialEoEoUsdPercent),
            totalEoPeriodDifferentialEoPropDutySaved: String(calculatedEpcgLicenseDetails.totalEoPeriodDifferentialEoPropDutySaved),
            EarlyEoFullfillmentEoPeriodWithin3yearsOrNot: String(calculatedEpcgLicenseDetails.EarlyEoFullfillmentEoPeriodWithin3yearsOrNot),
            EarlyEoFullfillmentEarlyEoFullfillment: String(calculatedEpcgLicenseDetails.EarlyEoFullfillmentEarlyEoFullfillment),
        });
    }, [
        calculatedEpcgLicenseDetails.hsCodeAsPerEoFullfillmentSummaryEoInr,
        calculatedEpcgLicenseDetails.descriptionAsPerEoFullfillmentSummaryEoUsd,
        calculatedEpcgLicenseDetails.averageExportTotalAeoImposedInr,
        calculatedEpcgLicenseDetails.averageExportFulfilledPercent,
        calculatedEpcgLicenseDetails.block1stImposedBlockBlanceDaysCompletionDate,
        calculatedEpcgLicenseDetails.block1stImposedBlockBlanceDaysExtensionDate,
        calculatedEpcgLicenseDetails.block1stImposedEoInr,
        calculatedEpcgLicenseDetails.block1stImposedEoUsd,
        calculatedEpcgLicenseDetails.block1stDirectExportPercent,
        calculatedEpcgLicenseDetails.block1stDirectExportPropDutySaved,
        calculatedEpcgLicenseDetails.block1stIndirectExportPercent,
        calculatedEpcgLicenseDetails.block1stIndirectExportPropDutySaved,
        calculatedEpcgLicenseDetails.block1stTotalExportEoInr,
        calculatedEpcgLicenseDetails.block1stTotalExportEoUsd,
        calculatedEpcgLicenseDetails.block1stTotalExportNoOfShippingBills,
        calculatedEpcgLicenseDetails.block1stTotalExportPercent,
        calculatedEpcgLicenseDetails.block1stTotalExportPropDutySaved,
        calculatedEpcgLicenseDetails.block1stDifferentialEoEoInr,
        calculatedEpcgLicenseDetails.block1stDifferentialEoEoInrPercent,
        calculatedEpcgLicenseDetails.block1stDifferentialEoEoUsd,
        calculatedEpcgLicenseDetails.block1stDifferentialEoEoUsdPercent,
        calculatedEpcgLicenseDetails.block1stDifferentialEoPropDutySaved,
        calculatedEpcgLicenseDetails.block2ndImposedEoPeriodBalanceDaysCompletionDate,
        calculatedEpcgLicenseDetails.block2ndImposedEoPeriodBalanceDaysExtensionDate,
        calculatedEpcgLicenseDetails.block2ndImposedEoInr,
        calculatedEpcgLicenseDetails.block2ndImposedEoUsd,
        calculatedEpcgLicenseDetails.block2ndDirectExportPercent,
        calculatedEpcgLicenseDetails.block2ndDirectExportPropDutySaved,
        calculatedEpcgLicenseDetails.block2ndIndirectExportPercent,
        calculatedEpcgLicenseDetails.block2ndIndirectExportPropDutySaved,
        calculatedEpcgLicenseDetails.block2ndTotalExportEoInr,
        calculatedEpcgLicenseDetails.block2ndTotalExportEoUsd,
        calculatedEpcgLicenseDetails.block2ndTotalExportNoOfShippingBills,
        calculatedEpcgLicenseDetails.block2ndTotalExportPercent,
        calculatedEpcgLicenseDetails.block2ndTotalExportPropDutySaved,
        calculatedEpcgLicenseDetails.block2ndDifferentialEoEoInr,
        calculatedEpcgLicenseDetails.block2ndDifferentialEoEoInrPercent,
        calculatedEpcgLicenseDetails.block2ndDifferentialEoEoUsd,
        calculatedEpcgLicenseDetails.block2ndDifferentialEoEoUsdPercent,
        calculatedEpcgLicenseDetails.block2ndDifferentialEoPropDutySaved,
        calculatedEpcgLicenseDetails.totalEoPeriodImposedEoPeriodBalanceDaysCompletionDate,
        calculatedEpcgLicenseDetails.totalEoPeriodImposedEoPeriodBalanceDaysExtensionDate,
        calculatedEpcgLicenseDetails.totalEoPeriodImposedEoInr,
        calculatedEpcgLicenseDetails.totalEoPeriodImposedEoUsd,
        calculatedEpcgLicenseDetails.totalEOPeriodDirectExportEoInr,
        calculatedEpcgLicenseDetails.totalEOPeriodDirectExportEoUsd,
        calculatedEpcgLicenseDetails.totalEOPeriodDirectExportNoOfShippingBills,
        calculatedEpcgLicenseDetails.totalEOPeriodDirectExportPercent,
        calculatedEpcgLicenseDetails.totalEOPeriodDirectExportPropDutySaved,
        calculatedEpcgLicenseDetails.totalEOPeriodIndirectExportEoInr,
        calculatedEpcgLicenseDetails.totalEOPeriodIndirectExportEoUsd,
        calculatedEpcgLicenseDetails.totalEOPeriodIndirectExportNoOfShippingBills,
        calculatedEpcgLicenseDetails.totalEOPeriodIndirectExportPercent,
        calculatedEpcgLicenseDetails.totalEOPeriodIndirectExportPropDutySaved,
        calculatedEpcgLicenseDetails.totalEOPeriodTotalExportEoInr,
        calculatedEpcgLicenseDetails.totalEOPeriodTotalExportEoUsd,
        calculatedEpcgLicenseDetails.totalEOPeriodTotalExportNoOfShippingBills,
        calculatedEpcgLicenseDetails.totalEOPeriodTotalExportPercent,
        calculatedEpcgLicenseDetails.totalEOPeriodTotalExportPropDutySaved,
        calculatedEpcgLicenseDetails.totalEoPeriodDifferentialEoEoInr,
        calculatedEpcgLicenseDetails.totalEoPeriodDifferentialEoEoInrPercent,
        calculatedEpcgLicenseDetails.totalEoPeriodDifferentialEoEoUsd,
        calculatedEpcgLicenseDetails.totalEoPeriodDifferentialEoEoUsdPercent,
        calculatedEpcgLicenseDetails.totalEoPeriodDifferentialEoPropDutySaved,
        calculatedEpcgLicenseDetails.EarlyEoFullfillmentEoPeriodWithin3yearsOrNot,
        calculatedEpcgLicenseDetails.EarlyEoFullfillmentEarlyEoFullfillment,
    ]);

    return (
        <div className="flex items-center justify-center min-h-screen bg-[#f5f5f5]">
            <div className="text-center">
                <div className="text-6xl mb-4">🚧</div>
                <h1 className="text-4xl font-bold text-green-700 mb-2">Coming Soon</h1>
                <p className="text-gray-600 text-lg">This feature is under development</p>
            </div>
        </div>
    )

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
                                label="HS Code (INR)"
                                value={epcgLicenseDetails.hsCodeAsPerLicenseEoInr}
                                onChange={(e) =>
                                    setEpcgLicenseDetails({ ...epcgLicenseDetails, hsCodeAsPerLicenseEoInr: e.target.value })
                                }
                                type="number"
                            />
                            <InputField
                                label="Description (USD)"
                                value={epcgLicenseDetails.descriptionAsPerLicenseEoUsd}
                                onChange={(e) =>
                                    setEpcgLicenseDetails({ ...epcgLicenseDetails, descriptionAsPerLicenseEoUsd: e.target.value })
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
                                value={epcgLicenseDetails.dutySavedValueDutyUtilizedValue}
                                onChange={(e) =>
                                    setEpcgLicenseDetails({ ...epcgLicenseDetails, dutySavedValueDutyUtilizedValue: e.target.value })
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
                        </div>
                        <div className="bg-white p-4 rounded-md">
                            <div className="container text-center text-green-700 font-sans font-semibold text-lg">
                                Average Export (INR)
                            </div>
                            <InputField
                                label="Imposed As Per License (INR)"
                                value={epcgLicenseDetails.averageExportImposedAsPerLicenseInr}
                                onChange={(e) =>
                                    setEpcgLicenseDetails({ ...epcgLicenseDetails, averageExportImposedAsPerLicenseInr: e.target.value })
                                }
                                type="number"
                            />
                            <InputField
                                label="No Of Years"
                                value={epcgLicenseDetails.averageExportNoOfYears}
                                onChange={(e) =>
                                    setEpcgLicenseDetails({ ...epcgLicenseDetails, averageExportNoOfYears: e.target.value })
                                }
                                type="number"
                            />
                            <InputField
                                label="Total AEO Imposed (INR)"
                                value={epcgLicenseDetails.averageExportTotalAeoImposedInr}
                                onChange={(e) =>
                                    setEpcgLicenseDetails({ ...epcgLicenseDetails, averageExportTotalAeoImposedInr: e.target.value })
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
                            />
                        </div>
                        {/* <div className="bg-white p-4 rounded-md">
                            <div className="container text-center text-green-700 font-sans font-semibold text-lg">
                                Block 1st Direct Export
                            </div>
                            <InputField
                                label="EO (INR)"
                                value={epcgLicenseDetails.block1stDirectExportEoInr}
                                onChange={(e) =>
                                    setEpcgLicenseDetails({ ...epcgLicenseDetails, block1stDirectExportEoInr: e.target.value })
                                }
                                type="number"
                            />
                            <InputField
                                label="EO (USD)"
                                value={epcgLicenseDetails.block1stDirectExportEoUsd}
                                onChange={(e) =>
                                    setEpcgLicenseDetails({ ...epcgLicenseDetails, block1stDirectExportEoUsd: e.target.value })
                                }
                                type="number"
                            />
                            <InputField
                                label="No Of Shipping Bills"
                                value={epcgLicenseDetails.block1stDirectExportNoOfShippingBills}
                                onChange={(e) =>
                                    setEpcgLicenseDetails({ ...epcgLicenseDetails, block1stDirectExportNoOfShippingBills: e.target.value })
                                }
                                type="number"
                            />
                            <InputField
                                label="Percent"
                                value={epcgLicenseDetails.block1stDirectExportPercent}
                                onChange={(e) =>
                                    setEpcgLicenseDetails({ ...epcgLicenseDetails, block1stDirectExportPercent: e.target.value })
                                }
                                type="number"
                            />
                            <InputField
                                label="Prop Duty Saved"
                                value={epcgLicenseDetails.block1stDirectExportPropDutySaved}
                                onChange={(e) =>
                                    setEpcgLicenseDetails({ ...epcgLicenseDetails, block1stDirectExportPropDutySaved: e.target.value })
                                }
                                type="number"
                            />
                        </div>
                        <div className="bg-white p-4 rounded-md">
                            <div className="container text-center text-green-700 font-sans font-semibold text-lg">
                                Block 1st Indirect Export
                            </div>
                            <InputField
                                label="EO (INR)"
                                value={epcgLicenseDetails.block1stIndirectExportEoInr}
                                onChange={(e) =>
                                    setEpcgLicenseDetails({ ...epcgLicenseDetails, block1stIndirectExportEoInr: e.target.value })
                                }
                                type="number"
                            />
                            <InputField
                                label="EO (USD)"
                                value={epcgLicenseDetails.block1stIndirectExportEoUsd}
                                onChange={(e) =>
                                    setEpcgLicenseDetails({ ...epcgLicenseDetails, block1stIndirectExportEoUsd: e.target.value })
                                }
                                type="number"
                            />
                            <InputField
                                label="No Of Shipping Bills"
                                value={epcgLicenseDetails.block1stIndirectExportNoOfShippingBills}
                                onChange={(e) =>
                                    setEpcgLicenseDetails({ ...epcgLicenseDetails, block1stIndirectExportNoOfShippingBills: e.target.value })
                                }
                                type="number"
                            />
                            <InputField
                                label="Percent"
                                value={epcgLicenseDetails.block1stIndirectExportPercent}
                                onChange={(e) =>
                                    setEpcgLicenseDetails({ ...epcgLicenseDetails, block1stIndirectExportPercent: e.target.value })
                                }
                                type="number"
                            />
                            <InputField
                                label="Prop Duty Saved"
                                value={epcgLicenseDetails.block1stIndirectExportPropDutySaved}
                                onChange={(e) =>
                                    setEpcgLicenseDetails({ ...epcgLicenseDetails, block1stIndirectExportPropDutySaved: e.target.value })
                                }
                                type="number"
                            />
                        </div>
                        <div className="bg-white p-4 rounded-md">
                            <div className="container text-center text-green-700 font-sans font-semibold text-lg">
                                Block 1st Total Export
                            </div>
                            <InputField
                                label="EO (INR)"
                                value={epcgLicenseDetails.block1stTotalExportEoInr}
                                onChange={(e) =>
                                    setEpcgLicenseDetails({ ...epcgLicenseDetails, block1stTotalExportEoInr: e.target.value })
                                }
                                type="number"
                            />
                            <InputField
                                label="EO (USD)"
                                value={epcgLicenseDetails.block1stTotalExportEoUsd}
                                onChange={(e) =>
                                    setEpcgLicenseDetails({ ...epcgLicenseDetails, block1stTotalExportEoUsd: e.target.value })
                                }
                                type="number"
                            />
                            <InputField
                                label="No Of Shipping Bills"
                                value={epcgLicenseDetails.block1stTotalExportNoOfShippingBills}
                                onChange={(e) =>
                                    setEpcgLicenseDetails({ ...epcgLicenseDetails, block1stTotalExportNoOfShippingBills: e.target.value })
                                }
                                type="number"
                            />
                            <InputField
                                label="Percent"
                                value={epcgLicenseDetails.block1stTotalExportPercent}
                                onChange={(e) =>
                                    setEpcgLicenseDetails({ ...epcgLicenseDetails, block1stTotalExportPercent: e.target.value })
                                }
                                type="number"
                            />
                            <InputField
                                label="Prop Duty Saved"
                                value={epcgLicenseDetails.block1stTotalExportPropDutySaved}
                                onChange={(e) =>
                                    setEpcgLicenseDetails({ ...epcgLicenseDetails, block1stTotalExportPropDutySaved: e.target.value })
                                }
                                type="number"
                            />
                        </div>
                        <div className="bg-white p-4 rounded-md">
                            <div className="container text-center text-green-700 font-sans font-semibold text-lg">
                                Block 1st Differential EO
                            </div>
                            <InputField
                                label="EO (INR)"
                                value={epcgLicenseDetails.block1stDifferentialEoEoInr}
                                onChange={(e) =>
                                    setEpcgLicenseDetails({ ...epcgLicenseDetails, block1stDifferentialEoEoInr: e.target.value })
                                }
                                type="number"
                            />
                            <InputField
                                label="EO (INR) Percent"
                                value={epcgLicenseDetails.block1stDifferentialEoEoInrPercent}
                                onChange={(e) =>
                                    setEpcgLicenseDetails({ ...epcgLicenseDetails, block1stDifferentialEoEoInrPercent: e.target.value })
                                }
                                type="number"
                            />
                            <InputField
                                label="EO (USD)"
                                value={epcgLicenseDetails.block1stDifferentialEoEoUsd}
                                onChange={(e) =>
                                    setEpcgLicenseDetails({ ...epcgLicenseDetails, block1stDifferentialEoEoUsd: e.target.value })
                                }
                                type="number"
                            />
                            <InputField
                                label="EO (USD) Percent"
                                value={epcgLicenseDetails.block1stDifferentialEoEoUsdPercent}
                                onChange={(e) =>
                                    setEpcgLicenseDetails({ ...epcgLicenseDetails, block1stDifferentialEoEoUsdPercent: e.target.value })
                                }
                                type="number"
                            />
                            <InputField
                                label="Prop Duty Saved"
                                value={epcgLicenseDetails.block1stDifferentialEoPropDutySaved}
                                onChange={(e) =>
                                    setEpcgLicenseDetails({ ...epcgLicenseDetails, block1stDifferentialEoPropDutySaved: e.target.value })
                                }
                                type="number"
                            />
                        </div>

                        <div className="bg-white p-4 rounded-md">
                            <div className="container text-center text-green-700 font-sans font-semibold text-lg">
                                Block 2nd Imposed
                            </div>
                            <InputField
                                label="Block EO Period Completion Date"
                                value={epcgLicenseDetails.block2ndImposed2ndBlockEoPeriodCompletionDate}
                                onChange={(e) =>
                                    setEpcgLicenseDetails({ ...epcgLicenseDetails, block2ndImposed2ndBlockEoPeriodCompletionDate: e.target.value })
                                }
                                type="date"
                            />
                            <InputField
                                label="EO Period Extension If Any"
                                value={epcgLicenseDetails.block2ndImposedEoPeriodExtensionIfAny}
                                onChange={(e) =>
                                    setEpcgLicenseDetails({ ...epcgLicenseDetails, block2ndImposedEoPeriodExtensionIfAny: e.target.value })
                                }
                                options={['Yes', 'No']}
                                type="select"
                            />
                            <InputField
                                label="EO Period Extension Year"
                                value={epcgLicenseDetails.block2ndImposedEoPeriodExtensionYear}
                                onChange={(e) =>
                                    setEpcgLicenseDetails({ ...epcgLicenseDetails, block2ndImposedEoPeriodExtensionYear: e.target.value })
                                }
                                options={['1 years', '2 years']}
                                type="select"
                            />
                            <InputField
                                label="EO Period Extension Date"
                                value={epcgLicenseDetails.block2ndImposedEoPeriodExtensionDate}
                                onChange={(e) =>
                                    setEpcgLicenseDetails({ ...epcgLicenseDetails, block2ndImposedEoPeriodExtensionDate: e.target.value })
                                }
                                type="date"
                            />
                            <InputField
                                label="Balance Days Completion Date"
                                value={epcgLicenseDetails.block2ndImposedEoPeriodBalanceDaysCompletionDate}
                                onChange={(e) =>
                                    setEpcgLicenseDetails({ ...epcgLicenseDetails, block2ndImposedEoPeriodBalanceDaysCompletionDate: e.target.value })
                                }
                                type="number"
                            />
                            <InputField
                                label="Balance Days Extension Date"
                                value={epcgLicenseDetails.block2ndImposedEoPeriodBalanceDaysExtensionDate}
                                onChange={(e) =>
                                    setEpcgLicenseDetails({ ...epcgLicenseDetails, block2ndImposedEoPeriodBalanceDaysExtensionDate: e.target.value })
                                }
                                type="number"
                            />
                            <InputField
                                label="EO (INR)"
                                value={epcgLicenseDetails.block2ndImposedEoInr}
                                onChange={(e) =>
                                    setEpcgLicenseDetails({ ...epcgLicenseDetails, block2ndImposedEoInr: e.target.value })
                                }
                                type="number"
                            />
                            <InputField
                                label="EO (USD)"
                                value={epcgLicenseDetails.block2ndImposedEoUsd}
                                onChange={(e) =>
                                    setEpcgLicenseDetails({ ...epcgLicenseDetails, block2ndImposedEoUsd: e.target.value })
                                }
                                type="number"
                            />
                        </div>
                        <div className="bg-white p-4 rounded-md">
                            <div className="container text-center text-green-700 font-sans font-semibold text-lg">
                                Block 2nd Direct Export
                            </div>
                            <InputField
                                label="EO (INR)"
                                value={epcgLicenseDetails.block2ndDirectExportEoInr}
                                onChange={(e) =>
                                    setEpcgLicenseDetails({ ...epcgLicenseDetails, block2ndDirectExportEoInr: e.target.value })
                                }
                                type="number"
                            />
                            <InputField
                                label="EO (USD)"
                                value={epcgLicenseDetails.block2ndDirectExportEoUsd}
                                onChange={(e) =>
                                    setEpcgLicenseDetails({ ...epcgLicenseDetails, block2ndDirectExportEoUsd: e.target.value })
                                }
                                type="number"
                            />
                            <InputField
                                label="No Of Shipping Bills"
                                value={epcgLicenseDetails.block2ndDirectExportNoOfShippingBills}
                                onChange={(e) =>
                                    setEpcgLicenseDetails({ ...epcgLicenseDetails, block2ndDirectExportNoOfShippingBills: e.target.value })
                                }
                                type="number"
                            />
                            <InputField
                                label="Percent"
                                value={epcgLicenseDetails.block2ndDirectExportPercent}
                                onChange={(e) =>
                                    setEpcgLicenseDetails({ ...epcgLicenseDetails, block2ndDirectExportPercent: e.target.value })
                                }
                                type="number"
                            />
                            <InputField
                                label="Prop Duty Saved"
                                value={epcgLicenseDetails.block2ndDirectExportPropDutySaved}
                                onChange={(e) =>
                                    setEpcgLicenseDetails({ ...epcgLicenseDetails, block2ndDirectExportPropDutySaved: e.target.value })
                                }
                                type="number"
                            />
                        </div>
                        <div className="bg-white p-4 rounded-md">
                            <div className="container text-center text-green-700 font-sans font-semibold text-lg">
                                Block 2nd Indirect Export
                            </div>
                            <InputField
                                label="EO (INR)"
                                value={epcgLicenseDetails.block2ndIndirectExportEoInr}
                                onChange={(e) =>
                                    setEpcgLicenseDetails({ ...epcgLicenseDetails, block2ndIndirectExportEoInr: e.target.value })
                                }
                                type="number"
                            />
                            <InputField
                                label="EO (USD)"
                                value={epcgLicenseDetails.block2ndIndirectExportEoUsd}
                                onChange={(e) =>
                                    setEpcgLicenseDetails({ ...epcgLicenseDetails, block2ndIndirectExportEoUsd: e.target.value })
                                }
                                type="number"
                            />
                            <InputField
                                label="No Of Shipping Bills"
                                value={epcgLicenseDetails.block2ndIndirectExportNoOfShippingBills}
                                onChange={(e) =>
                                    setEpcgLicenseDetails({ ...epcgLicenseDetails, block2ndIndirectExportNoOfShippingBills: e.target.value })
                                }
                                type="number"
                            />
                            <InputField
                                label="Percent"
                                value={epcgLicenseDetails.block2ndIndirectExportPercent}
                                onChange={(e) =>
                                    setEpcgLicenseDetails({ ...epcgLicenseDetails, block2ndIndirectExportPercent: e.target.value })
                                }
                                type="number"
                            />
                            <InputField
                                label="Prop Duty Saved"
                                value={epcgLicenseDetails.block2ndIndirectExportPropDutySaved}
                                onChange={(e) =>
                                    setEpcgLicenseDetails({ ...epcgLicenseDetails, block2ndIndirectExportPropDutySaved: e.target.value })
                                }
                                type="number"
                            />
                        </div>
                        <div className="bg-white p-4 rounded-md">
                            <div className="container text-center text-green-700 font-sans font-semibold text-lg">
                                Block 2nd Total Export
                            </div>
                            <InputField
                                label="EO (INR)"
                                value={epcgLicenseDetails.block2ndTotalExportEoInr}
                                onChange={(e) =>
                                    setEpcgLicenseDetails({ ...epcgLicenseDetails, block2ndTotalExportEoInr: e.target.value })
                                }
                                type="number"
                            />
                            <InputField
                                label="EO (USD)"
                                value={epcgLicenseDetails.block2ndTotalExportEoUsd}
                                onChange={(e) =>
                                    setEpcgLicenseDetails({ ...epcgLicenseDetails, block2ndTotalExportEoUsd: e.target.value })
                                }
                                type="number"
                            />
                            <InputField
                                label="No Of Shipping Bills"
                                value={epcgLicenseDetails.block2ndTotalExportNoOfShippingBills}
                                onChange={(e) =>
                                    setEpcgLicenseDetails({ ...epcgLicenseDetails, block2ndTotalExportNoOfShippingBills: e.target.value })
                                }
                                type="number"
                            />
                            <InputField
                                label="Percent"
                                value={epcgLicenseDetails.block2ndTotalExportPercent}
                                onChange={(e) =>
                                    setEpcgLicenseDetails({ ...epcgLicenseDetails, block2ndTotalExportPercent: e.target.value })
                                }
                                type="number"
                            />
                            <InputField
                                label="Prop Duty Saved"
                                value={epcgLicenseDetails.block2ndTotalExportPropDutySaved}
                                onChange={(e) =>
                                    setEpcgLicenseDetails({ ...epcgLicenseDetails, block2ndTotalExportPropDutySaved: e.target.value })
                                }
                                type="number"
                            />
                        </div>
                        <div className="bg-white p-4 rounded-md">
                            <div className="container text-center text-green-700 font-sans font-semibold text-lg">
                                Block 2nd Differential EO
                            </div>
                            <InputField
                                label="EO (INR)"
                                value={epcgLicenseDetails.block2ndDifferentialEoEoInr}
                                onChange={(e) =>
                                    setEpcgLicenseDetails({ ...epcgLicenseDetails, block2ndDifferentialEoEoInr: e.target.value })
                                }
                                type="number"
                            />
                            <InputField
                                label="EO (INR) Percent"
                                value={epcgLicenseDetails.block2ndDifferentialEoEoInrPercent}
                                onChange={(e) =>
                                    setEpcgLicenseDetails({ ...epcgLicenseDetails, block2ndDifferentialEoEoInrPercent: e.target.value })
                                }
                                type="number"
                            />
                            <InputField
                                label="EO (USD)"
                                value={epcgLicenseDetails.block2ndDifferentialEoEoUsd}
                                onChange={(e) =>
                                    setEpcgLicenseDetails({ ...epcgLicenseDetails, block2ndDifferentialEoEoUsd: e.target.value })
                                }
                                type="number"
                            />
                            <InputField
                                label="EO (USD) Percent"
                                value={epcgLicenseDetails.block2ndDifferentialEoEoUsdPercent}
                                onChange={(e) =>
                                    setEpcgLicenseDetails({ ...epcgLicenseDetails, block2ndDifferentialEoEoUsdPercent: e.target.value })
                                }
                                type="number"
                            />
                            <InputField
                                label="Prop Duty Saved"
                                value={epcgLicenseDetails.block2ndDifferentialEoPropDutySaved}
                                onChange={(e) =>
                                    setEpcgLicenseDetails({ ...epcgLicenseDetails, block2ndDifferentialEoPropDutySaved: e.target.value })
                                }
                                type="number"
                            />
                        </div>
                        <div className="bg-white p-4 rounded-md">
                            <div className="container text-center text-green-700 font-sans font-semibold text-lg">
                                Total EO Period Imposed
                            </div>
                            <InputField
                                label="EO Period Completion Date"
                                value={epcgLicenseDetails.totalEoPeriodImposedEoPeriodCompletionDate}
                                onChange={(e) =>
                                    setEpcgLicenseDetails({ ...epcgLicenseDetails, totalEoPeriodImposedEoPeriodCompletionDate: e.target.value })
                                }
                                type="date"
                            />
                            <InputField
                                label="EO Period Extension If Any"
                                value={epcgLicenseDetails.totalEoPeriodImposedEoPeriodExtensionIfAny}
                                onChange={(e) =>
                                    setEpcgLicenseDetails({ ...epcgLicenseDetails, totalEoPeriodImposedEoPeriodExtensionIfAny: e.target.value })
                                }
                                options={['Yes', 'No']}
                                type="select"
                            />
                            <InputField
                                label="EO Period Extension Year"
                                value={epcgLicenseDetails.totalEoPeriodImposedEoPeriodExtensionYear}
                                onChange={(e) =>
                                    setEpcgLicenseDetails({ ...epcgLicenseDetails, totalEoPeriodImposedEoPeriodExtensionYear: e.target.value })
                                }
                                options={['1 years', '2 years']}
                                type="select"
                            />
                            <InputField
                                label="EO Period Extension Date"
                                value={epcgLicenseDetails.totalEoPeriodImposedEoPeriodExtensionDate}
                                onChange={(e) =>
                                    setEpcgLicenseDetails({ ...epcgLicenseDetails, totalEoPeriodImposedEoPeriodExtensionDate: e.target.value })
                                }
                                type="date"
                            />
                            <InputField
                                label="Balance Days Completion Date"
                                value={epcgLicenseDetails.totalEoPeriodImposedEoPeriodBalanceDaysCompletionDate}
                                onChange={(e) =>
                                    setEpcgLicenseDetails({ ...epcgLicenseDetails, totalEoPeriodImposedEoPeriodBalanceDaysCompletionDate: e.target.value })
                                }
                                type="number"
                            />
                            <InputField
                                label="Balance Days Extension Date"
                                value={epcgLicenseDetails.totalEoPeriodImposedEoPeriodBalanceDaysExtensionDate}
                                onChange={(e) =>
                                    setEpcgLicenseDetails({ ...epcgLicenseDetails, totalEoPeriodImposedEoPeriodBalanceDaysExtensionDate: e.target.value })
                                }
                                type="number"
                            />
                            <InputField
                                label="EO (INR)"
                                value={epcgLicenseDetails.totalEoPeriodImposedEoInr}
                                onChange={(e) =>
                                    setEpcgLicenseDetails({ ...epcgLicenseDetails, totalEoPeriodImposedEoInr: e.target.value })
                                }
                                type="number"
                            />
                            <InputField
                                label="EO (USD)"
                                value={epcgLicenseDetails.totalEoPeriodImposedEoUsd}
                                onChange={(e) =>
                                    setEpcgLicenseDetails({ ...epcgLicenseDetails, totalEoPeriodImposedEoUsd: e.target.value })
                                }
                                type="number"
                            />
                        </div>
                        <div className="bg-white p-4 rounded-md">
                            <div className="container text-center text-green-700 font-sans font-semibold text-lg">
                                Total EO Period Direct Export
                            </div>
                            <InputField
                                label="EO (INR)"
                                value={epcgLicenseDetails.totalEOPeriodDirectExportEoInr}
                                onChange={(e) =>
                                    setEpcgLicenseDetails({ ...epcgLicenseDetails, totalEOPeriodDirectExportEoInr: e.target.value })
                                }
                                type="number"
                            />
                            <InputField
                                label="EO (USD)"
                                value={epcgLicenseDetails.totalEOPeriodDirectExportEoUsd}
                                onChange={(e) =>
                                    setEpcgLicenseDetails({ ...epcgLicenseDetails, totalEOPeriodDirectExportEoUsd: e.target.value })
                                }
                                type="number"
                            />
                            <InputField
                                label="No Of Shipping Bills"
                                value={epcgLicenseDetails.totalEOPeriodDirectExportNoOfShippingBills}
                                onChange={(e) =>
                                    setEpcgLicenseDetails({ ...epcgLicenseDetails, totalEOPeriodDirectExportNoOfShippingBills: e.target.value })
                                }
                                type="number"
                            />
                            <InputField
                                label="Percent"
                                value={epcgLicenseDetails.totalEOPeriodDirectExportPercent}
                                onChange={(e) =>
                                    setEpcgLicenseDetails({ ...epcgLicenseDetails, totalEOPeriodDirectExportPercent: e.target.value })
                                }
                                type="number"
                            />
                            <InputField
                                label="Prop Duty Saved"
                                value={epcgLicenseDetails.totalEOPeriodDirectExportPropDutySaved}
                                onChange={(e) =>
                                    setEpcgLicenseDetails({ ...epcgLicenseDetails, totalEOPeriodDirectExportPropDutySaved: e.target.value })
                                }
                                type="number"
                            />
                        </div>
                        <div className="bg-white p-4 rounded-md">
                            <div className="container text-center text-green-700 font-sans font-semibold text-lg">
                                Total EO Period Indirect Export
                            </div>
                            <InputField
                                label="EO (INR)"
                                value={epcgLicenseDetails.totalEOPeriodIndirectExportEoInr}
                                onChange={(e) =>
                                    setEpcgLicenseDetails({ ...epcgLicenseDetails, totalEOPeriodIndirectExportEoInr: e.target.value })
                                }
                                type="number"
                            />
                            <InputField
                                label="EO (USD)"
                                value={epcgLicenseDetails.totalEOPeriodIndirectExportEoUsd}
                                onChange={(e) =>
                                    setEpcgLicenseDetails({ ...epcgLicenseDetails, totalEOPeriodIndirectExportEoUsd: e.target.value })
                                }
                                type="number"
                            />
                            <InputField
                                label="No Of Shipping Bills"
                                value={epcgLicenseDetails.totalEOPeriodIndirectExportNoOfShippingBills}
                                onChange={(e) =>
                                    setEpcgLicenseDetails({ ...epcgLicenseDetails, totalEOPeriodIndirectExportNoOfShippingBills: e.target.value })
                                }
                                type="number"
                            />
                            <InputField
                                label="Percent"
                                value={epcgLicenseDetails.totalEOPeriodIndirectExportPercent}
                                onChange={(e) =>
                                    setEpcgLicenseDetails({ ...epcgLicenseDetails, totalEOPeriodIndirectExportPercent: e.target.value })
                                }
                                type="number"
                            />
                            <InputField
                                label="Prop Duty Saved"
                                value={epcgLicenseDetails.totalEOPeriodIndirectExportPropDutySaved}
                                onChange={(e) =>
                                    setEpcgLicenseDetails({ ...epcgLicenseDetails, totalEOPeriodIndirectExportPropDutySaved: e.target.value })
                                }
                                type="number"
                            />
                        </div>
                        <div className="bg-white p-4 rounded-md">
                            <div className="container text-center text-green-700 font-sans font-semibold text-lg">
                                Total EO Period Total Export
                            </div>
                            <InputField
                                label="EO (INR)"
                                value={epcgLicenseDetails.totalEOPeriodTotalExportEoInr}
                                onChange={(e) =>
                                    setEpcgLicenseDetails({ ...epcgLicenseDetails, totalEOPeriodTotalExportEoInr: e.target.value })
                                }
                                type="number"
                            />
                            <InputField
                                label="EO (USD)"
                                value={epcgLicenseDetails.totalEOPeriodTotalExportEoUsd}
                                onChange={(e) =>
                                    setEpcgLicenseDetails({ ...epcgLicenseDetails, totalEOPeriodTotalExportEoUsd: e.target.value })
                                }
                                type="number"
                            />
                            <InputField
                                label="No Of Shipping Bills"
                                value={epcgLicenseDetails.totalEOPeriodTotalExportNoOfShippingBills}
                                onChange={(e) =>
                                    setEpcgLicenseDetails({ ...epcgLicenseDetails, totalEOPeriodTotalExportNoOfShippingBills: e.target.value })
                                }
                                type="number"
                            />
                            <InputField
                                label="Percent"
                                value={epcgLicenseDetails.totalEOPeriodTotalExportPercent}
                                onChange={(e) =>
                                    setEpcgLicenseDetails({ ...epcgLicenseDetails, totalEOPeriodTotalExportPercent: e.target.value })
                                }
                                type="number"
                            />
                            <InputField
                                label="Prop Duty Saved"
                                value={epcgLicenseDetails.totalEOPeriodTotalExportPropDutySaved}
                                onChange={(e) =>
                                    setEpcgLicenseDetails({ ...epcgLicenseDetails, totalEOPeriodTotalExportPropDutySaved: e.target.value })
                                }
                                type="number"
                            />
                        </div>
                        <div className="bg-white p-4 rounded-md">
                            <div className="container text-center text-green-700 font-sans font-semibold text-lg">
                                Total EO Period Differential EO
                            </div>
                            <InputField
                                label="EO (INR)"
                                value={epcgLicenseDetails.totalEoPeriodDifferentialEoEoInr}
                                onChange={(e) =>
                                    setEpcgLicenseDetails({ ...epcgLicenseDetails, totalEoPeriodDifferentialEoEoInr: e.target.value })
                                }
                                type="number"
                            />
                            <InputField
                                label="EO (INR) Percent"
                                value={epcgLicenseDetails.totalEoPeriodDifferentialEoEoInrPercent}
                                onChange={(e) =>
                                    setEpcgLicenseDetails({ ...epcgLicenseDetails, totalEoPeriodDifferentialEoEoInrPercent: e.target.value })
                                }
                                type="number"
                            />
                            <InputField
                                label="EO (USD)"
                                value={epcgLicenseDetails.totalEoPeriodDifferentialEoEoUsd}
                                onChange={(e) =>
                                    setEpcgLicenseDetails({ ...epcgLicenseDetails, totalEoPeriodDifferentialEoEoUsd: e.target.value })
                                }
                                type="number"
                            />
                            <InputField
                                label="EO (USD) Percent"
                                value={epcgLicenseDetails.totalEoPeriodDifferentialEoEoUsdPercent}
                                onChange={(e) =>
                                    setEpcgLicenseDetails({ ...epcgLicenseDetails, totalEoPeriodDifferentialEoEoUsdPercent: e.target.value })
                                }
                                type="number"
                            />
                            <InputField
                                label="Prop Duty Saved"
                                value={epcgLicenseDetails.totalEoPeriodDifferentialEoPropDutySaved}
                                onChange={(e) =>
                                    setEpcgLicenseDetails({ ...epcgLicenseDetails, totalEoPeriodDifferentialEoPropDutySaved: e.target.value })
                                }
                                type="number"
                            />
                        </div>
                        <div className="bg-white p-4 rounded-md">
                            <div className="container text-center text-green-700 font-sans font-semibold text-lg">
                                Early EO Fulfillment
                            </div>
                            <InputField
                                label="1st EO Date"
                                value={epcgLicenseDetails.EarlyEoFullfillment1stEoDate}
                                onChange={(e) =>
                                    setEpcgLicenseDetails({ ...epcgLicenseDetails, EarlyEoFullfillment1stEoDate: e.target.value })
                                }
                                type="date"
                            />
                            <InputField
                                label="Last EO Date"
                                value={epcgLicenseDetails.EarlyEoFullfillmentLastEoDate}
                                onChange={(e) =>
                                    setEpcgLicenseDetails({ ...epcgLicenseDetails, EarlyEoFullfillmentLastEoDate: e.target.value })
                                }
                                type="date"
                            />
                            <InputField
                                label="EO Period Within 3 Years Or Not"
                                value={epcgLicenseDetails.EarlyEoFullfillmentEoPeriodWithin3yearsOrNot}
                                onChange={(e) =>
                                    setEpcgLicenseDetails({ ...epcgLicenseDetails, EarlyEoFullfillmentEoPeriodWithin3yearsOrNot: e.target.value })
                                }
                                type="text"
                            />
                            <InputField
                                label="Early EO Fulfillment"
                                value={epcgLicenseDetails.EarlyEoFullfillmentEarlyEoFullfillment}
                                onChange={(e) =>
                                    setEpcgLicenseDetails({ ...epcgLicenseDetails, EarlyEoFullfillmentEarlyEoFullfillment: e.target.value })
                                }
                                options={['Yes', 'No']}
                                type="select"
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
                        </div> */}
                    </div>
                    <NewDataButtons
                        backLink=""
                        nextLink=""
                        handleSubmit={() => {
                            setTimeout(() => {
                                alert('EPCG License Summary Submitted Successfully');
                            }, 300);

                            // navigate('analytics')
                        }}
                        // buttonText='Go to Analytics'
                        buttonText='Submit'
                    />
                </div>
            </div>
        </div>
    );
};

export default EpcgLicenseSummary;