import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import Divider from "@mui/material/Divider";
import Box from "@mui/material/Box";
import LinearProgress from "@mui/material/LinearProgress";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import Paper from "@mui/material/Paper";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Area,
  AreaChart,
  RadialBarChart,
  RadialBar,
  ComposedChart,
  Legend
} from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, 
  TrendingUp, 
  TrendingDown,
  DollarSign, 
  Clock, 
  Percent, 
  Calendar,
  FileText,
  Users,
  Target,
  AlertCircle,
  CheckCircle,  Download,
  RefreshCw,
  Eye,
  Filter,
  BarChart3,
  Activity,
  Award,
  Building,
  CreditCard,
  Globe,
  PieChart as PieChartIcon,
  Shield
} from 'lucide-react';

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4'];
const GRADIENT_COLORS = [
  ['#667eea', '#764ba2'],
  ['#f093fb', '#f5576c'],
  ['#4facfe', '#00f2fe'],
  ['#43e97b', '#38f9d7'],
  ['#fa709a', '#fee140'],
  ['#a8edea', '#fed6e3']
];

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`analytics-tabpanel-${index}`}
      aria-labelledby={`analytics-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const EpcgAnalytics = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<any>(null);
  const [calculatedData, setCalculatedData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(0);
  const [selectedMetric, setSelectedMetric] = useState(null);

  useEffect(() => {
    setLoading(true);
    
    // Priority: localStorage > sessionStorage > fallback data
    let analyticsDataString = localStorage.getItem('epcgAnalyticsData');
    if (!analyticsDataString) {
      analyticsDataString = sessionStorage.getItem('epcgAnalyticsData');
    }    
    if (analyticsDataString) {
      const savedData = JSON.parse(analyticsDataString);
      setFormData(savedData);
      calculateMetrics(savedData);
    } else {
      // Enhanced fallback sample data with realistic values
      const sampleData = {
        srNo: 'EPCG-2024-001',
        partyName: 'Advanced Manufacturing Pvt Ltd',
        licenseNo: 'EPCG24001XYZ',
        licenseDate: '2024-01-15',
        fileNo: 'FILE-24-001',
        fileDate: '2024-01-10',
        licenseType: 'Import',
        bankGuaranteeAmountRs: '2500000',
        bankGuaranteeValidityFrom: '2024-01-15',
        bankGuaranteeValidityTo: '2025-01-15',
        bankGuaranteeSubmittedTo: 'State Bank of India',
        dutySavedValueAmountInr: '1250000',
        hsCodeEoInr: '2500000',
        descriptionEoUsd: '30000',
        dutyUtilizedValue: '1000000',
        hsCodeAsPerEoFullfillmentSummaryEoInr: '2000000',
        descriptionAsPerEoFullfillmentSummaryEoUsd: '24000',
        installationDate: '2024-03-01',
        hsCodeEoImposedAsPerLicense: '3000000',
        descriptionNoOfYears: '5',
        descriptionTotalAEOImposed: '15000000',
        averageExportFulfilledInr: '12000000',
        averageExportNoOfShippingBills: '75',
        averageExportFulfilledPercent: '80',
        block1stImposedBlockCompletionDate: '2028-01-14',
        block1stImposedBlockExtension: 'Yes',
        block1stImposedExtensionYearIfAny: '6 years',
        block1stImposedBlockExtensionDate: '2030-01-14',
        block1stImposedBlockBlanceDaysCompletionDate: '950',
        block1stImposedBlockBlanceDaysExtensionDate: '1680',
        block1stImposedEoInr: '1000000',
        block1stImposedEoUsd: '12000',
        block1stDirectExportEoInr: '300000',
        block1stDirectExportEoUsd: '4500',        // Enhanced array data for better visualization
        DocumentEpcgLicenseEoAsPerLicense: [
          { hsCodeEoInr: '1000000', descriptionEoUsd: '12000', category: 'Machinery' },
          { hsCodeEoInr: '800000', descriptionEoUsd: '9600', category: 'Equipment' },
          { hsCodeEoInr: '700000', descriptionEoUsd: '8400', category: 'Tools' }
        ],
        DocumentEpcgLicenseActualExport: [
          { hsCodeEoImposedAsPerLicense: '3000000', descriptionNoOfYears: '5', region: 'North America' },
          { hsCodeEoImposedAsPerLicense: '2000000', descriptionNoOfYears: '4', region: 'Europe' },
          { hsCodeEoImposedAsPerLicense: '1500000', descriptionNoOfYears: '3', region: 'Asia Pacific' }
        ]
      };
      
      setFormData(sampleData);
      calculateMetrics(sampleData);
    }
    
    setLoading(false);
  }, []);  const calculateMetrics = (data: any) => {
    const totalDutySaved = parseFloat(data.dutySavedValueAmountInr) || 0;
    const totalExportObligation = parseFloat(data.hsCodeAsPerEoFullfillmentSummaryEoInr) || parseFloat(data.hsCodeEoInr) || 0;
    const exportFulfilled = parseFloat(data.averageExportFulfilledInr) || 0;
    const remainingObligation = totalExportObligation - exportFulfilled;
    const fulfillmentPercentage = totalExportObligation ? ((exportFulfilled / totalExportObligation) * 100) : 0;
    const bankGuaranteeAmount = parseFloat(data.bankGuaranteeAmountRs) || 0;
    const dutyUtilized = parseFloat(data.dutyUtilizedValue) || 0;
    const utilizationRate = totalDutySaved ? ((dutyUtilized / totalDutySaved) * 100) : 0;

    // Calculate days remaining
    const completionDate = data.block1stImposedBlockCompletionDate;
    const daysRemaining = completionDate ? 
      Math.ceil((new Date(completionDate).getTime() - new Date().getTime()) / (1000 * 3600 * 24)) : 0;

    setCalculatedData({
      totalDutySaved,
      totalExportObligation,
      exportFulfilled,
      remainingObligation,
      fulfillmentPercentage,
      bankGuaranteeAmount,
      dutyUtilized,
      utilizationRate,
      daysRemaining,
      complianceStatus: fulfillmentPercentage >= 75 ? 'Compliant' : fulfillmentPercentage >= 50 ? 'Warning' : 'Critical'
    });
  };

  // Chart data preparation
  const chartData = useMemo(() => {
    if (!formData || !calculatedData) return null;

    const performanceData = [
      {
        name: 'Export Obligation',
        imposed: calculatedData.totalExportObligation / 1000000,
        fulfilled: calculatedData.exportFulfilled / 1000000,
        percentage: calculatedData.fulfillmentPercentage
      }
    ];

    const complianceData = [
      { name: 'Fulfilled', value: calculatedData.fulfillmentPercentage, color: COLORS[1] },
      { name: 'Remaining', value: 100 - calculatedData.fulfillmentPercentage, color: COLORS[3] }
    ];

    const timelineData = [
      { 
        period: 'Year 1-2', 
        target: calculatedData.totalExportObligation * 0.4 / 1000000, 
        actual: calculatedData.exportFulfilled * 0.6 / 1000000 
      },
      { 
        period: 'Year 3-4', 
        target: calculatedData.totalExportObligation * 0.6 / 1000000, 
        actual: calculatedData.exportFulfilled * 0.4 / 1000000 
      }
    ];

    const financialData = [
      { category: 'Duty Saved', amount: calculatedData.totalDutySaved / 1000000, icon: 'shield' },
      { category: 'Bank Guarantee', amount: calculatedData.bankGuaranteeAmount / 1000000, icon: 'credit-card' },
      { category: 'Export Value', amount: calculatedData.exportFulfilled / 1000000, icon: 'trending-up' }
    ];

    return {
      performanceData,
      complianceData,
      timelineData,
      financialData
    };
  }, [formData, calculatedData]);
  // Enhanced KPI Card Component
  const KPICard = ({ title, value, icon: Icon, trend, color, gradient }: any) => (
    <motion.div
      whileHover={{ y: -5, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.2 }}
    >
      <Card 
        sx={{ 
          background: `linear-gradient(135deg, ${gradient[0]}, ${gradient[1]})`,
          color: 'white',
          height: '100%',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <CardContent>
          <Box display="flex" justifyContent="space-between" alignItems="flex-start">
            <Box>
              <Typography variant="body2" sx={{ opacity: 0.8, fontSize: '0.75rem' }}>
                {title}
              </Typography>
              <Typography variant="h4" fontWeight="bold" sx={{ my: 1 }}>
                {value}
              </Typography>
              {trend && (
                <Box display="flex" alignItems="center" gap={0.5}>
                  {trend > 0 ? (
                    <TrendingUp size={16} />
                  ) : (
                    <TrendingDown size={16} />
                  )}
                  <Typography variant="caption">
                    {Math.abs(trend)}%
                  </Typography>
                </Box>
              )}
            </Box>
            <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', width: 48, height: 48 }}>
              <Icon size={24} />
            </Avatar>
          </Box>
        </CardContent>
      </Card>
    </motion.div>
  );

  // Overview Tab Component
  const OverviewTab = () => (
    <Grid container spacing={3}>
      {/* KPI Cards */}
      <Grid item xs={12}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={3}>
            <KPICard
              title="Total Duty Saved"
              value={`₹${(calculatedData?.totalDutySaved / 1000000).toFixed(2)}M`}
              icon={Shield}
              trend={15.2}
              gradient={GRADIENT_COLORS[0]}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <KPICard
              title="Export Obligation"
              value={`₹${(calculatedData?.totalExportObligation / 1000000).toFixed(2)}M`}
              icon={Target}
              trend={8.7}
              gradient={GRADIENT_COLORS[1]}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <KPICard
              title="Fulfillment Rate"
              value={`${calculatedData?.fulfillmentPercentage?.toFixed(1)}%`}
              icon={Activity}
              trend={calculatedData?.fulfillmentPercentage > 75 ? 12.3 : -5.2}
              gradient={GRADIENT_COLORS[2]}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <KPICard
              title="Days Remaining"
              value={calculatedData?.daysRemaining || 0}
              icon={Clock}
              gradient={GRADIENT_COLORS[3]}
            />
          </Grid>
        </Grid>
      </Grid>

      {/* Compliance Status */}
      <Grid item xs={12} md={4}>
        <Card sx={{ height: '100%' }}>
          <CardContent>
            <Box display="flex" alignItems="center" gap={2} mb={2}>
              <Avatar sx={{ bgcolor: calculatedData?.complianceStatus === 'Compliant' ? 'success.main' : 
                calculatedData?.complianceStatus === 'Warning' ? 'warning.main' : 'error.main' }}>
                {calculatedData?.complianceStatus === 'Compliant' ? <CheckCircle /> : <AlertCircle />}
              </Avatar>
              <Box>
                <Typography variant="h6">Compliance Status</Typography>
                <Chip 
                  label={calculatedData?.complianceStatus || 'Unknown'}
                  color={calculatedData?.complianceStatus === 'Compliant' ? 'success' : 
                    calculatedData?.complianceStatus === 'Warning' ? 'warning' : 'error'}
                  variant="outlined"
                />
              </Box>
            </Box>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={chartData?.complianceData || []}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={80}
                  dataKey="value"
                >
                  {chartData?.complianceData?.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <RechartsTooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </Grid>

      {/* Export Performance Chart */}
      <Grid item xs={12} md={8}>
        <Card sx={{ height: '100%' }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>Export Performance</Typography>
            <ResponsiveContainer width="100%" height={300}>
              <ComposedChart data={chartData?.performanceData || []}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <RechartsTooltip />
                <Legend />
                <Bar dataKey="imposed" fill={COLORS[0]} name="Imposed (₹Cr)" />
                <Bar dataKey="fulfilled" fill={COLORS[1]} name="Fulfilled (₹Cr)" />
                <Line type="monotone" dataKey="percentage" stroke={COLORS[2]} name="Percentage %" />
              </ComposedChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </Grid>

      {/* Financial Overview */}
      <Grid item xs={12}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>Financial Overview</Typography>
            <Grid container spacing={2}>
              {chartData?.financialData?.map((item: any, index: number) => (
                <Grid item xs={12} sm={4} key={index}>
                  <Box 
                    display="flex" 
                    alignItems="center" 
                    gap={2} 
                    p={2} 
                    borderRadius={2}
                    bgcolor="grey.50"
                  >
                    <Avatar sx={{ bgcolor: COLORS[index] }}>
                      {item.icon === 'shield' && <Shield />}
                      {item.icon === 'credit-card' && <CreditCard />}
                      {item.icon === 'trending-up' && <TrendingUp />}
                    </Avatar>
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        {item.category}
                      </Typography>
                      <Typography variant="h6" fontWeight="bold">
                        ₹{item.amount.toFixed(2)}M
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
  // Performance Tab Component
  const PerformanceTab = () => (
    <Grid container spacing={3}>
      {/* Timeline Chart */}
      <Grid item xs={12} md={8}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>Export Timeline Performance</Typography>
            <ResponsiveContainer width="100%" height={350}>
              <AreaChart data={chartData?.timelineData || []}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="period" />
                <YAxis />
                <RechartsTooltip />
                <Legend />
                <Area 
                  type="monotone" 
                  dataKey="target" 
                  stackId="1" 
                  stroke={COLORS[0]} 
                  fill={COLORS[0]} 
                  fillOpacity={0.6}
                  name="Target (₹Cr)"
                />
                <Area 
                  type="monotone" 
                  dataKey="actual" 
                  stackId="2" 
                  stroke={COLORS[1]} 
                  fill={COLORS[1]} 
                  fillOpacity={0.6}
                  name="Actual (₹Cr)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </Grid>

      {/* Progress Indicators */}
      <Grid item xs={12} md={4}>
        <Card sx={{ height: '100%' }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>Progress Indicators</Typography>
            <Box mb={3}>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                <Typography variant="body2">Export Fulfillment</Typography>
                <Typography variant="body2" fontWeight="bold">
                  {calculatedData?.fulfillmentPercentage?.toFixed(1)}%
                </Typography>
              </Box>
              <LinearProgress 
                variant="determinate" 
                value={calculatedData?.fulfillmentPercentage || 0} 
                sx={{ height: 8, borderRadius: 4 }}
                color={calculatedData?.fulfillmentPercentage > 75 ? 'success' : 
                  calculatedData?.fulfillmentPercentage > 50 ? 'warning' : 'error'}
              />
            </Box>
            
            <Box mb={3}>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                <Typography variant="body2">Duty Utilization</Typography>
                <Typography variant="body2" fontWeight="bold">
                  {calculatedData?.utilizationRate?.toFixed(1)}%
                </Typography>
              </Box>
              <LinearProgress 
                variant="determinate" 
                value={calculatedData?.utilizationRate || 0} 
                sx={{ height: 8, borderRadius: 4 }}
                color="primary"
              />
            </Box>

            <Box mb={3}>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                <Typography variant="body2">Time Completion</Typography>
                <Typography variant="body2" fontWeight="bold">
                  {calculatedData?.daysRemaining > 0 ? 
                    `${((365 - calculatedData.daysRemaining) / 365 * 100).toFixed(1)}%` : '100%'}
                </Typography>
              </Box>
              <LinearProgress 
                variant="determinate" 
                value={calculatedData?.daysRemaining > 0 ? 
                  ((365 - calculatedData.daysRemaining) / 365 * 100) : 100} 
                sx={{ height: 8, borderRadius: 4 }}
                color="secondary"
              />
            </Box>

            <Divider sx={{ my: 2 }} />
            
            <Box textAlign="center">
              <Typography variant="h6" color="primary" gutterBottom>
                {calculatedData?.daysRemaining || 0}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Days Remaining
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Grid>

      {/* Array Data Visualization */}
      <Grid item xs={12}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>License Details Breakdown</Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" gutterBottom>EO as per License</Typography>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={formData?.DocumentEpcgLicenseEoAsPerLicense || []}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="category" />
                    <YAxis />
                    <RechartsTooltip />
                    <Bar dataKey="hsCodeEoInr" fill={COLORS[0]} />
                  </BarChart>
                </ResponsiveContainer>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" gutterBottom>Actual Export by Region</Typography>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      dataKey="hsCodeEoImposedAsPerLicense"
                      data={formData?.DocumentEpcgLicenseActualExport || []}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      label={(entry) => entry.region}
                    >
                      {(formData?.DocumentEpcgLicenseActualExport || []).map((entry: any, index: number) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <RechartsTooltip />
                  </PieChart>
                </ResponsiveContainer>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );

  // Details Tab Component
  const DetailsTab = () => (
    <Grid container spacing={3}>
      {/* License Information */}
      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom display="flex" alignItems="center" gap={1}>
              <FileText size={20} />
              License Information
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" color="text.secondary">License No</Typography>
                <Typography variant="body1" fontWeight="bold">{formData?.licenseNo}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" color="text.secondary">License Date</Typography>
                <Typography variant="body1" fontWeight="bold">
                  {formData?.licenseDate ? new Date(formData.licenseDate).toLocaleDateString() : 'N/A'}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" color="text.secondary">File No</Typography>
                <Typography variant="body1" fontWeight="bold">{formData?.fileNo}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" color="text.secondary">License Type</Typography>
                <Chip label={formData?.licenseType} color="primary" variant="outlined" />
              </Grid>
              <Grid item xs={12}>
                <Typography variant="body2" color="text.secondary">Party Name</Typography>
                <Typography variant="body1" fontWeight="bold">{formData?.partyName}</Typography>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Grid>

      {/* Bank Guarantee Details */}
      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom display="flex" alignItems="center" gap={1}>
              <Building size={20} />
              Bank Guarantee Details
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography variant="body2" color="text.secondary">Bank Name</Typography>
                <Typography variant="body1" fontWeight="bold">{formData?.bankGuaranteeSubmittedTo}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" color="text.secondary">Amount</Typography>
                <Typography variant="body1" fontWeight="bold">
                  ₹{(parseFloat(formData?.bankGuaranteeAmountRs) / 1000000).toFixed(2)}M
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" color="text.secondary">Validity</Typography>
                <Typography variant="body1" fontWeight="bold">
                  {formData?.bankGuaranteeValidityFrom && formData?.bankGuaranteeValidityTo ?
                    `${new Date(formData.bankGuaranteeValidityFrom).toLocaleDateString()} - ${new Date(formData.bankGuaranteeValidityTo).toLocaleDateString()}` :
                    'N/A'}
                </Typography>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Grid>

      {/* Financial Summary */}
      <Grid item xs={12}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom display="flex" alignItems="center" gap={1}>
              <DollarSign size={20} />
              Financial Summary
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6} md={3}>
                <Box textAlign="center" p={2} bgcolor="grey.50" borderRadius={2}>
                  <Typography variant="h5" color="primary" fontWeight="bold">
                    ₹{(calculatedData?.totalDutySaved / 1000000).toFixed(2)}M
                  </Typography>
                  <Typography variant="body2" color="text.secondary">Duty Saved</Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Box textAlign="center" p={2} bgcolor="grey.50" borderRadius={2}>
                  <Typography variant="h5" color="success.main" fontWeight="bold">
                    ₹{(calculatedData?.exportFulfilled / 1000000).toFixed(2)}M
                  </Typography>
                  <Typography variant="body2" color="text.secondary">Export Fulfilled</Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Box textAlign="center" p={2} bgcolor="grey.50" borderRadius={2}>
                  <Typography variant="h5" color="warning.main" fontWeight="bold">
                    ₹{(calculatedData?.remainingObligation / 1000000).toFixed(2)}M
                  </Typography>
                  <Typography variant="body2" color="text.secondary">Remaining Obligation</Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Box textAlign="center" p={2} bgcolor="grey.50" borderRadius={2}>
                  <Typography variant="h5" color="info.main" fontWeight="bold">
                    {calculatedData?.fulfillmentPercentage?.toFixed(1)}%
                  </Typography>
                  <Typography variant="body2" color="text.secondary">Completion Rate</Typography>
                </Box>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Grid>

      {/* Export Data Arrays */}
      <Grid item xs={12}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>Detailed Export Data</Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" gutterBottom>EO as per License</Typography>
                <Box sx={{ maxHeight: 300, overflow: 'auto' }}>
                  {formData?.DocumentEpcgLicenseEoAsPerLicense?.map((item: any, index: number) => (
                    <Box key={index} display="flex" justifyContent="space-between" p={1} 
                         bgcolor={index % 2 === 0 ? 'grey.50' : 'white'} borderRadius={1} mb={1}>
                      <Typography variant="body2">{item.category || `Item ${index + 1}`}</Typography>
                      <Typography variant="body2" fontWeight="bold">
                        ₹{(parseFloat(item.hsCodeEoInr) / 1000000).toFixed(2)}M
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" gutterBottom>Actual Export by Region</Typography>
                <Box sx={{ maxHeight: 300, overflow: 'auto' }}>
                  {formData?.DocumentEpcgLicenseActualExport?.map((item: any, index: number) => (
                    <Box key={index} display="flex" justifyContent="space-between" p={1} 
                         bgcolor={index % 2 === 0 ? 'grey.50' : 'white'} borderRadius={1} mb={1}>
                      <Typography variant="body2">{item.region || `Region ${index + 1}`}</Typography>
                      <Typography variant="body2" fontWeight="bold">
                        ₹{(parseFloat(item.hsCodeEoImposedAsPerLicense) / 1000000).toFixed(2)}M
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
  if (loading || !formData || !calculatedData) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <Typography variant="h6">Loading analytics data...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
      p: 3 
    }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header */}
        <Paper elevation={2} sx={{ p: 3, mb: 3, borderRadius: 3 }}>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Box display="flex" alignItems="center" gap={2}>
              <IconButton 
                onClick={() => navigate('/datamanagement/newdata/report/epcg-lic-summary')}
                sx={{ bgcolor: 'primary.main', color: 'white', '&:hover': { bgcolor: 'primary.dark' } }}
              >
                <ArrowLeft size={20} />
              </IconButton>
              <Box>
                <Typography variant="h4" fontWeight="bold" color="primary">
                  EPCG License Analytics
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {formData?.partyName} - {formData?.licenseNo}
                </Typography>
              </Box>
            </Box>
            <Box display="flex" gap={1}>
              <Tooltip title="Export Analytics">
                <IconButton>
                  <Download />
                </IconButton>
              </Tooltip>              <Tooltip title="Refresh Data">
                <IconButton onClick={() => window.location.reload()}>
                  <RefreshCw />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>
        </Paper>

        {/* Tabbed Content */}
        <Paper elevation={2} sx={{ borderRadius: 3, overflow: 'hidden' }}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs 
              value={activeTab} 
              onChange={(e, newValue) => setActiveTab(newValue)}
              variant="fullWidth"
              sx={{
                '& .MuiTab-root': {
                  minHeight: 64,
                  textTransform: 'none',
                  fontSize: '1rem',
                  fontWeight: 500
                }
              }}
            >
              <Tab 
                icon={<BarChart3 size={20} />} 
                label="Overview" 
                iconPosition="start"
              />
              <Tab 
                icon={<Activity size={20} />} 
                label="Performance" 
                iconPosition="start"
              />
              <Tab 
                icon={<FileText size={20} />} 
                label="Details" 
                iconPosition="start"
              />
            </Tabs>
          </Box>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <TabPanel value={activeTab} index={0}>
                <OverviewTab />
              </TabPanel>
              <TabPanel value={activeTab} index={1}>
                <PerformanceTab />
              </TabPanel>
              <TabPanel value={activeTab} index={2}>
                <DetailsTab />
              </TabPanel>
            </motion.div>
          </AnimatePresence>
        </Paper>
      </motion.div>
    </Box>
  );
};

export default EpcgAnalytics;