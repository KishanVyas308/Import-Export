import React, { useEffect, useMemo, useState } from 'react';
import { useRecoilValue } from 'recoil';
import axios from 'axios';
import { useCookies } from 'react-cookie';
import { authAtom } from '../../../../../../atoms/authAtom';
import { BACKEND_URL } from '../../../../../../Globle';
import InputField from '../../../../../components/InputField';
import NewDataButtons from '../../NewDataButtons';
import Loading from '../../../../../components/Loading';
import Divider from '../../../../../components/Divider';
import { fetchCustomers } from '../../../../../utility/dataFetch';
import { CustomerDetail } from '../../../../../utility/types/customerDetail';

const EPCGLicensePage = () => {

    const { user } = useRecoilValue(authAtom);
    const [cookies] = useCookies(['token']);
    const [loading, setLoading] = useState(false);
    const [customerNames, setCustomerNames] = useState<CustomerDetail[]>([]);

    // State to manage EPCG License details
    const [epcgLicenseDetails, setEpcgLicenseDetails] = useState({
        srNo: '',
        customerName: '',
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
        dutyUtilizedValue: '',
        remarks: '',
    });

    // State to manage multiple hsCodeEo and descriptionEo
    const [hsCodeEoList, setHsCodeEoList] = useState([{ hsCodeEoInr: '', descriptionEoUsd: '' }]);

    // State to manage multiple averageExport fields
    const [averageExportList, setAverageExportList] = useState([{ hsCodeEoImposedAsPerLicense: '', descriptionNoOfYears: '', descriptionTotalAEOImposed: '' }]);

    useEffect(() => {
        setLoading(true);
        fetchCustomers(cookies.token).then((data) => {
            setCustomerNames(data);
            setLoading(false);
        });

        setLoading(false);
    }, [cookies.token]);


    const changeTotalImposed = (index: number, value: string) => {
        const list = [...averageExportList];
        const hsCodeEoImposedAsPerLicense = parseFloat(list[index].hsCodeEoImposedAsPerLicense) || 0;
        const descriptionNoOfYears = parseFloat(list[index].descriptionNoOfYears) || 0;
        list[index].descriptionTotalAEOImposed = (hsCodeEoImposedAsPerLicense * descriptionNoOfYears).toString();
        setAverageExportList(list);
    }

    const handleAddHsCodeEo = () => {
        setHsCodeEoList([...hsCodeEoList, { hsCodeEoInr: '', descriptionEoUsd: '' }]);
    };

    const handleRemoveHsCodeEo = (index: number) => {
        const list = [...hsCodeEoList];
        list.splice(index, 1);
        setHsCodeEoList(list);
    };

    const handleAddAverageExport = () => {
        setAverageExportList([...averageExportList, { hsCodeEoImposedAsPerLicense: '', descriptionNoOfYears: '', descriptionTotalAEOImposed: '' }]);
    };

    const handleRemoveAverageExport = (index: number) => {
        const list = [...averageExportList];
        list.splice(index, 1);
        setAverageExportList(list);
    };

    const handleSubmit = async () => {
        setLoading(true);
        const jsonData = {
            ...epcgLicenseDetails,
            DocumentEpcgLicenseEoAsPerLicense: hsCodeEoList,
            DocumentEpcgLicenseActualExport: averageExportList,
            addedByUserId: user.id,
        };

        console.log('jsonData', jsonData);

        try {

            console.log('Submitting EPCG License data:', jsonData);
            
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
                            options={customerNames.map((customer) => customer.customerName)}
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
                    </div>
                    <div className="bg-white p-4 rounded-md">
                        <div className="container text-center text-green-700 font-sans font-semibold text-lg">
                            EO (As per License)
                        </div>
                        <InputField
                            label="Duty Utilized Value"
                            value={epcgLicenseDetails.dutyUtilizedValue}
                            onChange={(e) =>
                                setEpcgLicenseDetails({ ...epcgLicenseDetails, dutyUtilizedValue: e.target.value })
                            }
                            type="text"
                        />
                        <Divider />
                        {hsCodeEoList.map((item, index) => (
                            <div key={index}>
                                <InputField
                                    label="HS Code EO"
                                    value={item.hsCodeEoInr}
                                    onChange={(e) => {
                                        const list = [...hsCodeEoList];
                                        list[index].hsCodeEoInr = e.target.value;
                                        setHsCodeEoList(list);
                                    }}
                                    type="number"
                                />
                                <InputField
                                    label="Description EO"
                                    value={item.descriptionEoUsd}
                                    onChange={(e) => {
                                        const list = [...hsCodeEoList];
                                        list[index].descriptionEoUsd = e.target.value;
                                        setHsCodeEoList(list);
                                    }}
                                    type="number"
                                />
                                <button
                                    className="bg-red-500 text-white px-2 py-1 rounded mt-2"
                                    onClick={() => handleRemoveHsCodeEo(index)}
                                >
                                    Remove
                                </button>
                            </div>
                        ))}
                        <button
                            className="bg-blue-500 text-white px-4 py-2 rounded mt-4"
                            onClick={handleAddHsCodeEo}
                        >
                            Add
                        </button>
                    </div>
                    <div className="bg-white p-4 rounded-md">
                        <div className="container text-center text-green-700 font-sans font-semibold text-lg">
                            Average Export (INR)
                        </div>
                        {averageExportList.map((item, index) => (
                            <div key={index}>
                                <InputField
                                    label="Average Export (INR)"
                                    value={item.hsCodeEoImposedAsPerLicense}
                                    onChange={(e) => {
                                        const list = [...averageExportList];
                                        list[index].hsCodeEoImposedAsPerLicense = e.target.value;
                                        changeTotalImposed(index, e.target.value);
                                        setAverageExportList(list);
                                    }}
                                    type="number"
                                />
                                <InputField
                                    label="No Of Years"
                                    value={item.descriptionNoOfYears}
                                    onChange={(e) => {
                                        const list = [...averageExportList];
                                        list[index].descriptionNoOfYears = e.target.value;
                                        changeTotalImposed(index, e.target.value);
                                        setAverageExportList(list);
                                    }}
                                    type="number"
                                />
                                <InputField
                                    label="Total AEO Imposed (INR)"
                                    value={item.descriptionTotalAEOImposed}
                                    onChange={(e) => {
                                        const list = [...averageExportList];
                                        list[index].descriptionTotalAEOImposed = e.target.value;
                                        setAverageExportList(list);
                                    }}
                                    type="number"
                                />
                                <button
                                    className="bg-red-500 text-white px-2 py-1 rounded mt-2"
                                    onClick={() => handleRemoveAverageExport(index)}
                                >
                                    Remove
                                </button>
                            </div>
                        ))}
                        <button
                            className="bg-blue-500 text-white px-4 py-2 rounded mt-4"
                            onClick={handleAddAverageExport}
                        >
                            Add
                        </button>
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
    );
};

export default EPCGLicensePage;