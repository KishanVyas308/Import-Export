import React, { useState } from 'react';
import InputField from '../../../../../components/InputField';
import NewDataButtons from '../../NewDataButtons';
import Loading from '../../../../../components/Loading';
import axios from 'axios';
import { useCookies } from 'react-cookie';
import { useRecoilValue } from 'recoil';
import { authAtom } from '../../../../../../atoms/authAtom';
import { BACKEND_URL } from '../../../../../../Globle';

const EBRCPage = () => {
    const { user } = useRecoilValue(authAtom);
    const [cookies] = useCookies(['token']);
    const [loading, setLoading] = useState(false);
    const [ebrcDetails, setEbrcDetails] = useState({
        firmName: '',
        address: '',
        iec: '',
        shippingBillNo: '',
        shippingBillDate: '',
        shippingBillPort: '',
        bankName: '',
        bankFileNoAndUploadedDate: '',
        billIdNo: '',
        bankRealisationCertificateNo: '',
        dateOfRealisationOfMoneyByBank: '',
        realisedValueInForeignCurrency: '',
        currencyOfRealisation: '',
        dateTimeOfPrinting: '',
    });

    const handleSubmit = async () => {
        setLoading(true);
        const jsonData = {
            ...ebrcDetails,
            addedByUserId: user.id,
        };

        try {
            const res = await axios.post(
                `${BACKEND_URL}/documentslist/ebrc`,
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
                        EBRC Details
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 mt-2 gap-4">
                        <div className="bg-white p-4 rounded-md">
                            <InputField
                                label="Firm's Name"
                                value={ebrcDetails.firmName}
                                onChange={(e) =>
                                    setEbrcDetails({ ...ebrcDetails, firmName: e.target.value })
                                }
                                type="text"
                            />
                            <InputField
                                label="Address"
                                value={ebrcDetails.address}
                                onChange={(e) =>
                                    setEbrcDetails({ ...ebrcDetails, address: e.target.value })
                                }
                                type="text"
                            />
                            <InputField
                                label="IEC"
                                value={ebrcDetails.iec}
                                onChange={(e) =>
                                    setEbrcDetails({ ...ebrcDetails, iec: e.target.value })
                                }
                                type="number"
                            />
                            <InputField
                                label="Shipping Bill No."
                                value={ebrcDetails.shippingBillNo}
                                onChange={(e) =>
                                    setEbrcDetails({ ...ebrcDetails, shippingBillNo: e.target.value })
                                }
                                type="number"
                            />
                            <InputField
                                label="Shipping Bill Date"
                                value={ebrcDetails.shippingBillDate}
                                onChange={(e) =>
                                    setEbrcDetails({ ...ebrcDetails, shippingBillDate: e.target.value })
                                }
                                type="date"
                            />
                            <InputField
                                label="Shipping Bill Port"
                                value={ebrcDetails.shippingBillPort}
                                onChange={(e) =>
                                    setEbrcDetails({ ...ebrcDetails, shippingBillPort: e.target.value })
                                }
                                type="text"
                            />
                        </div>
                        <div className="bg-white p-4 rounded-md">
                            <InputField
                                label="Bank's Name"
                                value={ebrcDetails.bankName}
                                onChange={(e) =>
                                    setEbrcDetails({ ...ebrcDetails, bankName: e.target.value })
                                }
                                type="text"
                            />
                            <InputField
                                label="Bank's File No. & Uploaded Date"
                                value={ebrcDetails.bankFileNoAndUploadedDate}
                                onChange={(e) =>
                                    setEbrcDetails({ ...ebrcDetails, bankFileNoAndUploadedDate: e.target.value })
                                }
                                type="text"
                            />
                            <InputField
                                label="Bill ID No."
                                value={ebrcDetails.billIdNo}
                                onChange={(e) =>
                                    setEbrcDetails({ ...ebrcDetails, billIdNo: e.target.value })
                                }
                                type="text"
                            />
                            <InputField
                                label="Bank Realisation Certificate No."
                                value={ebrcDetails.bankRealisationCertificateNo}
                                onChange={(e) =>
                                    setEbrcDetails({ ...ebrcDetails, bankRealisationCertificateNo: e.target.value })
                                }
                                type="text"
                            />
                            <InputField
                                label="Date of Realisation of Money by Bank"    
                                value={ebrcDetails.dateOfRealisationOfMoneyByBank}
                                onChange={(e) =>
                                    setEbrcDetails({ ...ebrcDetails, dateOfRealisationOfMoneyByBank: e.target.value })
                                }
                                type="date"
                            />
                            <InputField
                                label="Realised Value in Foreign Currency"
                                value={ebrcDetails.realisedValueInForeignCurrency}
                                onChange={(e) =>
                                    setEbrcDetails({ ...ebrcDetails, realisedValueInForeignCurrency: e.target.value })
                                }
                                type="number"
                            />
                        </div>
                        <div className="bg-white p-4 rounded-md">
                            <InputField
                                label="Currency of Realisation"
                                value={ebrcDetails.currencyOfRealisation}
                                onChange={(e) =>
                                    setEbrcDetails({ ...ebrcDetails, currencyOfRealisation: e.target.value })
                                }
                                type="text"
                            />
                            <InputField
                                label="Date & Time of Printing"
                                value={ebrcDetails.dateTimeOfPrinting}
                                onChange={(e) =>
                                    setEbrcDetails({ ...ebrcDetails, dateTimeOfPrinting: e.target.value })
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

export default EBRCPage;