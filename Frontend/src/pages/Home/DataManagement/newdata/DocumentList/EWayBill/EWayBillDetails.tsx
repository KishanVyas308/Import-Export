
import React, { useState } from 'react';
import { useRecoilValue } from 'recoil';
import axios from 'axios';
import { useCookies } from 'react-cookie';
import { authAtom } from '../../../../../../atoms/authAtom';
import { BACKEND_URL } from '../../../../../../Globle';
import InputField from '../../../../../components/InputField';
import NewDataButtons from '../../NewDataButtons';
import Loading from '../../../../../components/Loading';

const EWayBillDetails = () => {

    const { user } = useRecoilValue(authAtom);
    const [cookies] = useCookies(['token']);
    const [loading, setLoading] = useState(false);
    const [ewayBillDetails, setEwayBillDetails] = useState({
        ewaybillNo: '',
        ewaybillGeneratedDate: '',
        ewaybillValidUpto: '',
        ewaybillValidFrom: '',
        ewaybillModeOfTransportation: '',
        ewaybillApproxDistance: '',
        ewaybillDocumentType: '',
        ewaybillDocumentNumber: '',
        ewaybillDocumentDate: '',
        ewaybillSupplyType: '',
        ewaybillSubType: '',
        ewaybillTransactionType: '',
        supplierGstin: '',
        supplierName: '',
        supplierState: '',
        supplierDispatchFromAddress: '',
        recipientGstin: '',
        recipientName: '',
        recipientState: '',
        recipientShipToAddress: '',
        goodDetailsHsnCode: '',
        goodDetailsProductNameAndDescription: '',
        goodDetailsQuantity: '',
        goodDetailsUnit: '',
        goodDetailsTaxRate: '',
        goodDetailsTotalTaxableAmount: '',
        goodDetailsCgstAmount: '',
        goodDetailsSgstAmount: '',
        goodDetailsIgstAmount: '',
        goodDetailsCessAmount: '',
        goodDetailsOtherAmount: '',
        goodDetailsTotalInvoiceAmount: '',
        transporterGstnOrEnrolmentId: '',
        lrNoAndDate: '',
        multiVehicleInfo: '',
        vehicleType: '',
        vehicleNo: '',
    });

    const handleSubmit = async () => {
        setLoading(true);
        const jsonData = {
            ...ewayBillDetails,
            addedByUserId: user.id,
        };

        try {
            const res = await axios.post(
                `${BACKEND_URL}/documentslist/ewaybilldetails`,
                jsonData,
                {
                    headers: {
                        Authorization: cookies.token,
                    },
                }
            );

            if (res.status === 200) {
                alert('Data saved successfully');
            } else {
                alert('Error in saving data');
            }
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
                        E-Way Bill
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 mt-2 gap-4">
                        <div className="bg-white p-4 rounded-md">
                            <div className="container text-center text-green-700 font-sans font-semibold text-lg">
                                E-Way Bill Details - Basic Details
                            </div>
                            <InputField
                                label="E-Way Bill No"
                                value={ewayBillDetails.ewaybillNo}
                                onChange={(e) =>
                                    setEwayBillDetails({ ...ewayBillDetails, ewaybillNo: e.target.value })
                                }
                                type="number"
                            />
                            <InputField
                                label="Generated Date"
                                value={ewayBillDetails.ewaybillGeneratedDate}
                                onChange={(e) =>
                                    setEwayBillDetails({ ...ewayBillDetails, ewaybillGeneratedDate: e.target.value })
                                }
                                type="date"
                            />
                            <InputField
                                label="Valid Upto"
                                value={ewayBillDetails.ewaybillValidUpto}
                                onChange={(e) =>
                                    setEwayBillDetails({ ...ewayBillDetails, ewaybillValidUpto: e.target.value })
                                }
                                type="date"
                            />
                            <InputField
                                label="Valid From"
                                value={ewayBillDetails.ewaybillValidFrom}
                                onChange={(e) =>
                                    setEwayBillDetails({ ...ewayBillDetails, ewaybillValidFrom: e.target.value })
                                }
                                type="date"
                            />
                            <InputField
                                label="Mode of Transportation"
                                value={ewayBillDetails.ewaybillModeOfTransportation}
                                onChange={(e) =>
                                    setEwayBillDetails({ ...ewayBillDetails, ewaybillModeOfTransportation: e.target.value })
                                }
                                options={["Ship", "Air", "Road", "Rail" ]}
                                type="slect"
                            />
                            <InputField
                                label="Approx Distance"
                                value={ewayBillDetails.ewaybillApproxDistance}
                                onChange={(e) =>
                                    setEwayBillDetails({ ...ewayBillDetails, ewaybillApproxDistance: e.target.value })
                                }
                                type="text"
                            />

                        </div>
                        <div className="bg-white p-4 rounded-md">
                            <div className="container text-center text-green-700 font-sans font-semibold text-lg">
                            E-Way Bill Details - Documents Details 
                            </div>
                            <InputField
                                label="Document Type"
                                value={ewayBillDetails.ewaybillDocumentType}
                                onChange={(e) =>
                                    setEwayBillDetails({ ...ewayBillDetails, ewaybillDocumentType: e.target.value })
                                }
                                options={["Tax Invoice", "Delivery Challan" ]}
                                type="select"
                            />
                            <InputField
                                label="Document Number"
                                value={ewayBillDetails.ewaybillDocumentNumber}
                                onChange={(e) =>
                                    setEwayBillDetails({ ...ewayBillDetails, ewaybillDocumentNumber: e.target.value })
                                }
                                type="text"
                            />
                            <InputField
                                label="Document Date"
                                value={ewayBillDetails.ewaybillDocumentDate}
                                onChange={(e) =>
                                    setEwayBillDetails({ ...ewayBillDetails, ewaybillDocumentDate: e.target.value })
                                }
                                type="date"
                            />
                            <InputField
                                label="Supply Type"
                                value={ewayBillDetails.ewaybillSupplyType}
                                onChange={(e) =>
                                    setEwayBillDetails({ ...ewayBillDetails, ewaybillSupplyType: e.target.value })
                                }
                                options={["Outward", "Inward" ]}
                                type="select"
                            />
                            <InputField
                                label="Sub Type"
                                value={ewayBillDetails.ewaybillSubType}
                                onChange={(e) =>
                                    setEwayBillDetails({ ...ewayBillDetails, ewaybillSubType: e.target.value })
                                }
                                options={["Supply", "Export", "Job Work", "For Own Use"]}
                                type="select"
                            />
                            <InputField
                                label="Transaction Type"
                                value={ewayBillDetails.ewaybillTransactionType}
                                onChange={(e) =>
                                    setEwayBillDetails({ ...ewayBillDetails, ewaybillTransactionType: e.target.value })
                                }
                                options={["Regular", "Bill To Ship To", "Bill From Dispatch From", "Combination" ]}
                                type="select"
                            />
                        </div>
                        <div className="bg-white p-4 rounded-md">
                            <div className="container text-center text-green-700 font-sans font-semibold text-lg">
                                Address Details
                            </div>
                            <div className="container text-center text-green-700 font-sans font-semibold text-base">
                                Supplier
                            </div>
                            <InputField
                                label="GSTIN"
                                value={ewayBillDetails.supplierGstin}
                                onChange={(e) =>
                                    setEwayBillDetails({ ...ewayBillDetails, supplierGstin: e.target.value })
                                }
                                type="text"
                            />
                            <InputField
                                label="Name"
                                value={ewayBillDetails.supplierName}
                                onChange={(e) =>
                                    setEwayBillDetails({ ...ewayBillDetails, supplierName: e.target.value })
                                }
                                type="text"
                            />
                            <InputField
                                label="State"
                                value={ewayBillDetails.supplierState}
                                onChange={(e) =>
                                    setEwayBillDetails({ ...ewayBillDetails, supplierState: e.target.value })
                                }
                                options={["Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal" ]}
                                type="select"
                            />
                            <InputField
                                label="Dispatch From Address"
                                value={ewayBillDetails.supplierDispatchFromAddress}
                                onChange={(e) =>
                                    setEwayBillDetails({ ...ewayBillDetails, supplierDispatchFromAddress: e.target.value })
                                }
                                type="text"
                            />
                            <div className="container text-center text-green-700 font-sans font-semibold text-base">
                                Recipient
                            </div>
                            <InputField
                                label="GSTIN"
                                value={ewayBillDetails.recipientGstin}
                                onChange={(e) =>
                                    setEwayBillDetails({ ...ewayBillDetails, recipientGstin: e.target.value })
                                }
                                type="text"
                            />
                            <InputField
                                label="Name"
                                value={ewayBillDetails.recipientName}
                                onChange={(e) =>
                                    setEwayBillDetails({ ...ewayBillDetails, recipientName: e.target.value })
                                }
                                type="text"
                            />
                            <InputField
                                label="State"
                                value={ewayBillDetails.recipientState}
                                onChange={(e) =>
                                    setEwayBillDetails({ ...ewayBillDetails, recipientState: e.target.value })
                                }
                                options={["Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal" ]}
                                type="select"
                            />
                            <InputField
                                label="Ship To Address"
                                value={ewayBillDetails.recipientShipToAddress}
                                onChange={(e) =>
                                    setEwayBillDetails({ ...ewayBillDetails, recipientShipToAddress: e.target.value })
                                }
                                type="text"
                            />
                        </div>
                        <div className="bg-white p-4 rounded-md">
                            <div className="container text-center text-green-700 font-sans font-semibold text-lg">
                                Goods Details
                            </div>
                            <InputField
                                label="HSN Code"
                                value={ewayBillDetails.goodDetailsHsnCode}
                                onChange={(e) =>
                                    setEwayBillDetails({ ...ewayBillDetails, goodDetailsHsnCode: e.target.value })
                                }
                                type="number"
                            />
                            <InputField
                                label="Product Name and Description"
                                value={ewayBillDetails.goodDetailsProductNameAndDescription}
                                onChange={(e) =>
                                    setEwayBillDetails({ ...ewayBillDetails, goodDetailsProductNameAndDescription: e.target.value })
                                }
                                type="text"
                            />
                            <InputField
                                label="Quantity"
                                value={ewayBillDetails.goodDetailsQuantity}
                                onChange={(e) =>
                                    setEwayBillDetails({ ...ewayBillDetails, goodDetailsQuantity: e.target.value })
                                }
                                type="text"
                            />
                            <InputField
                                label="Unit"
                                value={ewayBillDetails.goodDetailsUnit}
                                onChange={(e) =>
                                    setEwayBillDetails({ ...ewayBillDetails, goodDetailsUnit: e.target.value })
                                }
                                type="number"
                            />
                            <InputField
                                label="Tax Rate"
                                value={ewayBillDetails.goodDetailsTaxRate}
                                onChange={(e) =>
                                    setEwayBillDetails({ ...ewayBillDetails, goodDetailsTaxRate: e.target.value })
                                }
                                type="number"
                            />
                            <InputField
                                label="Total Taxable Amount"
                                value={ewayBillDetails.goodDetailsTotalTaxableAmount}
                                onChange={(e) =>
                                    setEwayBillDetails({ ...ewayBillDetails, goodDetailsTotalTaxableAmount: e.target.value })
                                }
                                type="number"
                            />
                            <InputField
                                label="CGST Amount"
                                value={ewayBillDetails.goodDetailsCgstAmount}
                                onChange={(e) =>
                                    setEwayBillDetails({ ...ewayBillDetails, goodDetailsCgstAmount: e.target.value })
                                }
                                type="number"
                            />
                            <InputField
                                label="SGST Amount"
                                value={ewayBillDetails.goodDetailsSgstAmount}
                                onChange={(e) =>
                                    setEwayBillDetails({ ...ewayBillDetails, goodDetailsSgstAmount: e.target.value })
                                }
                                type="number"
                            />
                            <InputField
                                label="IGST Amount"
                                value={ewayBillDetails.goodDetailsIgstAmount}
                                onChange={(e) =>
                                    setEwayBillDetails({ ...ewayBillDetails, goodDetailsIgstAmount: e.target.value })
                                }
                                type="number"
                            />
                            <InputField
                                label="Cess Amount"
                                value={ewayBillDetails.goodDetailsCessAmount}
                                onChange={(e) =>
                                    setEwayBillDetails({ ...ewayBillDetails, goodDetailsCessAmount: e.target.value })
                                }
                                type="number"
                            />
                            <InputField
                                label="Other Amount"
                                value={ewayBillDetails.goodDetailsOtherAmount}
                                onChange={(e) =>
                                    setEwayBillDetails({ ...ewayBillDetails, goodDetailsOtherAmount: e.target.value })
                                }
                                type="number"
                            />
                            <InputField
                                label="Total Invoice Amount"
                                value={ewayBillDetails.goodDetailsTotalInvoiceAmount}
                                onChange={(e) =>
                                    setEwayBillDetails({ ...ewayBillDetails, goodDetailsTotalInvoiceAmount: e.target.value })
                                }
                                type="number"
                            />
                        </div>
                        <div className="bg-white p-4 rounded-md">
                            <div className="container text-center text-green-700 font-sans font-semibold text-lg">
                                Transportation Details
                            </div>
                            <InputField
                                label="Transporter GSTN or Enrolment ID"
                                value={ewayBillDetails.transporterGstnOrEnrolmentId}
                                onChange={(e) =>
                                    setEwayBillDetails({ ...ewayBillDetails, transporterGstnOrEnrolmentId: e.target.value })
                                }
                                type="text"
                            />
                            <InputField
                                label="LR No and Date"
                                value={ewayBillDetails.lrNoAndDate}
                                onChange={(e) =>
                                    setEwayBillDetails({ ...ewayBillDetails, lrNoAndDate: e.target.value })
                                }
                                type="number"
                            />
                            <div className="container text-center text-green-700 font-sans font-semibold text-lg">
                                Vehicle Details
                            </div>
                            <InputField
                                label="Multi Vehicle Info"
                                value={ewayBillDetails.multiVehicleInfo}
                                onChange={(e) =>
                                    setEwayBillDetails({ ...ewayBillDetails, multiVehicleInfo: e.target.value })
                                }
                                type="text"
                            />
                            <InputField
                                label="Vehicle Type"
                                value={ewayBillDetails.vehicleType}
                                onChange={(e) =>
                                    setEwayBillDetails({ ...ewayBillDetails, vehicleType: e.target.value })
                                }
                                type="text"
                            />
                            <InputField
                                label="Vehicle No"
                                value={ewayBillDetails.vehicleNo}
                                onChange={(e) =>
                                    setEwayBillDetails({ ...ewayBillDetails, vehicleNo: e.target.value })
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

export default EWayBillDetails;