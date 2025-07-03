import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '@mui/material/Card';
import Input  from "@mui/material/Input";
import { motion } from 'framer-motion';
import  Button  from "@mui/material/Button";

const EpcgLicenseFormTemp = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    srNo: '',
    partyName: '',
    licenseNo: '',
    licenseDate: '',
    dutySavedValueAmountInr: '',
    hsCodeAsPerLicenseEoInr: '',
    descriptionAsPerLicenseEoUsd: '',
    dutySavedValueDutyUtilizedValue: '',
    averageExportImposedAsPerLicenseInr: '',
    averageExportNoOfYears: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, you'd save this to your backend
    localStorage.setItem('epcgFormData', JSON.stringify(formData));
    navigate('/analytics');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto"
      >
        <Card className="p-6 shadow-lg">
          <h1 className="text-2xl font-bold mb-6">EPCG License Details</h1>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Sr. No</label>
                <Input
                  type="text"
                  name="srNo"
                  value={formData.srNo}
                  onChange={handleChange}
                  className="w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Party Name</label>
                <Input
                  type="text"
                  name="partyName"
                  value={formData.partyName}
                  onChange={handleChange}
                  className="w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">License No</label>
                <Input
                  type="text"
                  name="licenseNo"
                  value={formData.licenseNo}
                  onChange={handleChange}
                  className="w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">License Date</label>
                <Input
                  type="date"
                  name="licenseDate"
                  value={formData.licenseDate}
                  onChange={handleChange}
                  className="w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Duty Saved Value (INR)</label>
                <Input
                  type="number"
                  name="dutySavedValueAmountInr"
                  value={formData.dutySavedValueAmountInr}
                  onChange={handleChange}
                  className="w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">HS Code EO (INR)</label>
                <Input
                  type="number"
                  name="hsCodeAsPerLicenseEoInr"
                  value={formData.hsCodeAsPerLicenseEoInr}
                  onChange={handleChange}
                  className="w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Description EO (USD)</label>
                <Input
                  type="number"
                  name="descriptionAsPerLicenseEoUsd"
                  value={formData.descriptionAsPerLicenseEoUsd}
                  onChange={handleChange}
                  className="w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Duty Utilized Value</label>
                <Input
                  type="number"
                  name="dutySavedValueDutyUtilizedValue"
                  value={formData.dutySavedValueDutyUtilizedValue}
                  onChange={handleChange}
                  className="w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Average Export Imposed (INR)</label>
                <Input
                  type="number"
                  name="averageExportImposedAsPerLicenseInr"
                  value={formData.averageExportImposedAsPerLicenseInr}
                  onChange={handleChange}
                  className="w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Export Years</label>
                <Input
                  type="number"
                  name="averageExportNoOfYears"
                  value={formData.averageExportNoOfYears}
                  onChange={handleChange}
                  className="w-full"
                />
              </div>
            </div>
            <div className="flex justify-end mt-6">
              <Button type="submit">
                View Analytics
              </Button>
            </div>
          </form>
        </Card>
      </motion.div>
    </div>
  );
};

export default EpcgLicenseFormTemp;