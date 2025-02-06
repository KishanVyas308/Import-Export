import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from "@mui/material/Card";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from 'recharts';
import { motion } from 'framer-motion';
import { ArrowLeft, TrendingUp, DollarSign, Clock, Percent } from 'lucide-react';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const EpcgAnalytics = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<any>(null);
  const [calculatedData, setCalculatedData] = useState<any>(null);

  useEffect(() => {
    const savedData = {
      srNo: '1',
      partyName: 'Sample Company',
      licenseNo: 'EPCG2023001',
      licenseDate: '2023-01-01',
      fileNo: 'FILE2023001',
      fileDate: '2023-01-05',
      licenseType: 'Import',
      bankGuaranteeAmountRs: '1000000',
      bankGuaranteeValidityFrom: '2023-01-01',
      bankGuaranteeValidityTo: '2024-01-01',
      bankGuaranteeSubmittedTo: 'Sample Bank',
      dutySavedValueAmountInr: '500000',
      hsCodeAsPerLicenseEoInr: '1000000',
      descriptionAsPerLicenseEoUsd: '15000',
      dutySavedValueDutyUtilizedValue: '400000',
      hsCodeAsPerEoFullfillmentSummaryEoInr: '800000',
      descriptionAsPerEoFullfillmentSummaryEoUsd: '12000',
      installationDate: '2023-02-01',
      averageExportImposedAsPerLicenseInr: '2000000',
      averageExportNoOfYears: '5',
      averageExportTotalAeoImposedInr: '10000000',
      averageExportFulfilledInr: '8000000',
      averageExportNoOfShippingBills: '50',
      averageExportFulfilledPercent: '80',
      block1stImposedBlockCompletionDate: '2027-12-31',
      block1stImposedBlockExtension: 'No',
      block1stImposedExtensionYearIfAny: '5 years',
      block1stImposedBlockExtensionDate: '2029-12-31',
      block1stImposedBlockBlanceDaysCompletionDate: '365',
      block1stImposedBlockBlanceDaysExtensionDate: '730',
      block1stImposedEoInr: '400000',
      block1stImposedEoUsd: '6000',
      block1stDirectExportEoInr: '300000',
      block1stDirectExportEoUsd: '4500',
      block1stDirectExportNoOfShippingBills: '25',
      block1stDirectExportPercent: '37.5',
      block1stDirectExportPropDutySaved: '150000',
      block1stIndirectExportEoInr: '200000',
      block1stIndirectExportEoUsd: '3000',
      block1stIndirectExportNoOfShippingBills: '15',
      block1stIndirectExportPercent: '25',
      block1stIndirectExportPropDutySaved: '100000',
      block1stTotalExportEoInr: '500000',
      block1stTotalExportEoUsd: '7500',
      block1stTotalExportNoOfShippingBills: '40',
      block1stTotalExportPercent: '62.5',
      block1stTotalExportPropDutySaved: '250000',
      block1stDifferentialEoEoInr: '100000',
      block1stDifferentialEoEoInrPercent: '12.5',
      block1stDifferentialEoEoUsd: '1500',
      block1stDifferentialEoEoUsdPercent: '18.75',
      block1stDifferentialEoPropDutySaved: '75000',
      block2ndImposed2ndBlockEoPeriodCompletionDate: '2029-12-31',
      block2ndImposedEoPeriodExtensionIfAny: 'Yes',
      block2ndImposedEoPeriodExtensionYear: '2 years',
      block2ndImposedEoPeriodExtensionDate: '2031-12-31',
      block2ndImposedEoPeriodBalanceDaysCompletionDate: '730',
      block2ndImposedEoPeriodBalanceDaysExtensionDate: '1095',
      block2ndImposedEoInr: '400000',
      block2ndImposedEoUsd: '6000',
      block2ndDirectExportEoInr: '300000',
      block2ndDirectExportEoUsd: '4500',
      block2ndDirectExportNoOfShippingBills: '25',
      block2ndDirectExportPercent: '37.5',
      block2ndDirectExportPropDutySaved: '150000',
      block2ndIndirectExportEoInr: '200000',
      block2ndIndirectExportEoUsd: '3000',
      block2ndIndirectExportNoOfShippingBills: '15',
      block2ndIndirectExportPercent: '25',
      block2ndIndirectExportPropDutySaved: '100000',
      block2ndTotalExportEoInr: '500000',
      block2ndTotalExportEoUsd: '7500',
      block2ndTotalExportNoOfShippingBills: '40',
      block2ndTotalExportPercent: '62.5',
      block2ndTotalExportPropDutySaved: '250000',
      block2ndDifferentialEoEoInr: '100000',
      block2ndDifferentialEoEoInrPercent: '12.5',
      block2ndDifferentialEoEoUsd: '1500',
      block2ndDifferentialEoEoUsdPercent: '18.75',
      block2ndDifferentialEoPropDutySaved: '75000',
      totalEoPeriodImposedEoPeriodCompletionDate: '2029-12-31',
      totalEoPeriodImposedEoPeriodExtensionIfAny: 'Yes',
      totalEoPeriodImposedEoPeriodExtensionYear: '2 years',
      totalEoPeriodImposedEoPeriodExtensionDate: '2031-12-31',
      totalEoPeriodImposedEoPeriodBalanceDaysCompletionDate: '730',
      totalEoPeriodImposedEoPeriodBalanceDaysExtensionDate: '1095',
      totalEoPeriodImposedEoInr: '800000',
      totalEoPeriodImposedEoUsd: '12000',
      totalEOPeriodDirectExportEoInr: '600000',
      totalEOPeriodDirectExportEoUsd: '9000',
      totalEOPeriodDirectExportNoOfShippingBills: '50',
      totalEOPeriodDirectExportPercent: '75',
      totalEOPeriodDirectExportPropDutySaved: '300000',
      totalEOPeriodIndirectExportEoInr: '400000',
      totalEOPeriodIndirectExportEoUsd: '6000',
      totalEOPeriodIndirectExportNoOfShippingBills: '30',
      totalEOPeriodIndirectExportPercent: '50',
      totalEOPeriodIndirectExportPropDutySaved: '200000',
      totalEOPeriodTotalExportEoInr: '1000000',
      totalEOPeriodTotalExportEoUsd: '15000',
      totalEOPeriodTotalExportNoOfShippingBills: '80',
      totalEOPeriodTotalExportPercent: '125',
      totalEOPeriodTotalExportPropDutySaved: '500000',
      totalEoPeriodDifferentialEoEoInr: '200000',
      totalEoPeriodDifferentialEoEoInrPercent: '25',
      totalEoPeriodDifferentialEoEoUsd: '3000',
      totalEoPeriodDifferentialEoEoUsdPercent: '37.5',
      totalEoPeriodDifferentialEoPropDutySaved: '150000',
      EarlyEoFullfillment1stEoDate: '2023-01-01',
      EarlyEoFullfillmentLastEoDate: '2023-12-31',
      EarlyEoFullfillmentEoPeriodWithin3yearsOrNot: 'Yes',
      EarlyEoFullfillmentEarlyEoFullfillment: 'Yes',
      remarks: 'Sample remarks',
    };

    setFormData(savedData);
    calculateMetrics(savedData);
  }, []);

  const calculateMetrics = (data: any) => {
    const totalDutySaved = parseFloat(data.dutySavedValueAmountInr);
    const totalExportObligation = parseFloat(data.hsCodeAsPerLicenseEoInr);
    const exportFulfilled = parseFloat(data.averageExportFulfilledInr);
    const remainingObligation = totalExportObligation - exportFulfilled;

    setCalculatedData({
      totalDutySaved,
      totalExportObligation,
      exportFulfilled,
      remainingObligation,
    });
  };

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
    } = formData || {};

    const O = String((Number(hsCodeAsPerLicenseEoInr) * Number(dutySavedValueDutyUtilizedValue)) / Number(dutySavedValueAmountInr));
    const P = String((Number(descriptionAsPerLicenseEoUsd) * Number(dutySavedValueDutyUtilizedValue)) / Number(dutySavedValueAmountInr));
    const T = String(Number(averageExportImposedAsPerLicenseInr) * Number(averageExportNoOfYears));
    const W = String((Number(formData?.averageExportFulfilledInr) / Number(T)) * 100);
    const X = licenseDate ? new Date(new Date(licenseDate).setFullYear(new Date(licenseDate).getFullYear() + 4 - 1)).toISOString().split('T')[0] : '';
    const AA = licenseDate ? new Date(new Date(licenseDate).setFullYear(new Date(licenseDate).getFullYear() + 6 - 1)).toISOString().split('T')[0] : '';
    const AB = String(Math.ceil((new Date(X).getTime() - new Date().getTime()) / (1000 * 3600 * 24)));
    const AC = String(Math.ceil((new Date(AA).getTime() - new Date().getTime()) / (1000 * 3600 * 24)));
    const AD = String(Number(O) * 0.5);
    const AE = String(Number(P) * 0.5);
    const AI = String((Number(formData?.block1stDirectExportEoUsd) / Number(P)) * 100);
    const AJ = String(Number(dutySavedValueDutyUtilizedValue) * Number(AI));
    const AN = String((Number(formData?.block1stIndirectExportEoUsd) / Number(P)) * 100);
    const AO = String(Number(dutySavedValueDutyUtilizedValue) * Number(AN));
    const AP = String(Number(formData?.block1stDirectExportEoInr) + Number(formData?.block1stIndirectExportEoInr));
    const AQ = String(Number(formData?.block1stDirectExportEoUsd) + Number(formData?.block1stIndirectExportEoUsd));
    const AR = String(Number(formData?.block1stDirectExportNoOfShippingBills) + Number(formData?.block1stIndirectExportNoOfShippingBills));
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
    const BK = String((Number(formData?.block2ndDirectExportEoUsd) / Number(P)) * 100);
    const BL = String(Number(dutySavedValueDutyUtilizedValue) * Number(BK));
    const BP = String((Number(formData?.block2ndIndirectExportEoUsd) / Number(P)) * 100);
    const BQ = String(Number(dutySavedValueDutyUtilizedValue) * Number(BP));
    const BR = String(Number(formData?.block2ndDirectExportEoInr) + Number(formData?.block2ndIndirectExportEoInr));
    const BS = String(Number(formData?.block2ndDirectExportEoUsd) + Number(formData?.block2ndIndirectExportEoUsd));
    const BT = String(Number(formData?.block2ndDirectExportNoOfShippingBills) + Number(formData?.block2ndIndirectExportNoOfShippingBills));
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
    const CJ = String(Number(formData?.block1stDirectExportEoInr) + Number(formData?.block2ndDirectExportEoInr));
    const CK = String(Number(formData?.block1stDirectExportEoUsd) + Number(formData?.block2ndDirectExportEoUsd));
    const CL = String(Number(formData?.block1stDirectExportNoOfShippingBills) + Number(formData?.block2ndDirectExportNoOfShippingBills));
    const CM = String(Number(AI) + Number(BK));
    const CN = String(Number(AJ) + Number(BL));
    const CO = String(Number(formData?.block1stIndirectExportEoInr) + Number(formData?.block2ndIndirectExportEoInr));
    const CP = String(Number(formData?.block1stIndirectExportEoUsd) + Number(formData?.block2ndIndirectExportEoUsd));
    const CQ = String(Number(formData?.block1stIndirectExportNoOfShippingBills) + Number(formData?.block2ndIndirectExportNoOfShippingBills));
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
      ...formData,
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
      EarlyEoFullfillmentEoPeriodWithin3yearsOrNot: DG,
    };
  }, [formData]);

  const exportPerformanceData = [
    { name: 'Direct Export', value: parseFloat(formData?.totalEOPeriodDirectExportEoInr) || 0 },
    { name: 'Indirect Export', value: parseFloat(formData?.totalEOPeriodIndirectExportEoInr) || 0 },
  ];

  if (!formData || !calculatedData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto"
      >
        <div className="flex items-center justify-between mb-8">
          <Button 
            variant="outlined"
            onClick={() => navigate('/datamanagement/newdata/report/epcg-lic-summary')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Form
          </Button>
          <h1 className="text-3xl font-bold">EPCG License Analytics</h1>
        </div>

        {/* KPI Summary */}
        <Grid container spacing={3} className="mb-8">
          <Grid item xs={12} md={4}>
            <Card className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-100 rounded-full">
                  <DollarSign className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <Typography variant="body2" color="textSecondary">Total Duty Saved</Typography>
                  <Typography variant="h5" component="div">₹{calculatedData.totalDutySaved.toLocaleString()}</Typography>
                </div>
              </div>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Card className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-green-100 rounded-full">
                  <TrendingUp className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <Typography variant="body2" color="textSecondary">Export Obligation</Typography>
                  <Typography variant="h5" component="div">₹{calculatedData.totalExportObligation.toLocaleString()}</Typography>
                </div>
              </div>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Card className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-yellow-100 rounded-full">
                  <Clock className="w-6 h-6 text-yellow-600" />
                </div>
                <div>
                  <Typography variant="body2" color="textSecondary">Remaining Obligation</Typography>
                  <Typography variant="h5" component="div">₹{calculatedData.remainingObligation.toLocaleString()}</Typography>
                </div>
              </div>
            </Card>
          </Grid>
        </Grid>

        {/* Charts */}
        <Grid container spacing={3} className="mb-8">
          <Grid item xs={12} lg={6}>
            <Card className="p-6">
              <Typography variant="h6" component="div" className="mb-4">Export Performance</Typography>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={exportPerformanceData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={120}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {exportPerformanceData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </Grid>
          
          <Grid item xs={12} lg={6}>
            <Card className="p-6">
              <Typography variant="h6" component="div" className="mb-4">Duty Saved vs Utilized</Typography>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={[
                    { name: 'Duty Saved', value: parseFloat(formData.dutySavedValueAmountInr) },
                    { name: 'Duty Utilized', value: parseFloat(formData.dutySavedValueDutyUtilizedValue) },
                  ]}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="value" fill="#82ca9d" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </Grid>
        </Grid>

        {/* Additional Metrics */}
        <Grid container spacing={3} className="mb-8">
          <Grid item xs={12} md={6}>
            <Card className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-red-100 rounded-full">
                  <Percent className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <Typography variant="body2" color="textSecondary">Export Fulfilled Percent</Typography>
                  <Typography variant="h5" component="div">{formData.averageExportFulfilledPercent}%</Typography>
                </div>
              </div>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Card className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-purple-100 rounded-full">
                  <Clock className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <Typography variant="body2" color="textSecondary">Average Export No Of Years</Typography>
                  <Typography variant="h5" component="div">{formData.averageExportNoOfYears}</Typography>
                </div>
              </div>
            </Card>
          </Grid>
        </Grid>

        {/* Additional Charts */}
        <Grid container spacing={3} className="mb-8">
          <Grid item xs={12} lg={6}>
            <Card className="p-6">
              <Typography variant="h6" component="div" className="mb-4">Direct vs Indirect Export</Typography>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={[
                    { name: 'Direct Export', value: parseFloat(formData.totalEOPeriodDirectExportEoInr) },
                    { name: 'Indirect Export', value: parseFloat(formData.totalEOPeriodIndirectExportEoInr) },
                  ]}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="value" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </Grid>

          <Grid item xs={12} lg={6}>
            {/* <Card className="p-6">
              <Typography variant="h6" component="div" className="mb-4">Duty Saved vs Utilized</Typography>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={[
                    { name: 'Duty Saved', value: parseFloat(formData.dutySavedValueAmountInr) },
                    { name: 'Duty Utilized', value: parseFloat(formData.dutySavedValueDutyUtilizedValue) },
                  ]}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="value" fill="#82ca9d" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card> */}
          </Grid>
        </Grid>

      
      </motion.div>
    </div>
  );
};

export default EpcgAnalytics;