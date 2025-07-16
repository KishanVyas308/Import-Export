import React, { useState } from 'react';
import Loading from '../../../../../../components/Loading';
import InputField from '../../../../../../components/InputField';
import NewDataButtons from '../../NewDataButtons';
import { BACKEND_URL } from '../../../../../../../Globle';
import axios from 'axios';
import { useCookies } from 'react-cookie';
import { authAtom } from '../../../../../../../atoms/authAtom';
import { useRecoilValue } from 'recoil';

const EInvoicePage = () => {
    const { user } = useRecoilValue(authAtom);
    const [loading, setLoading] = useState(false);
    const [cookies] = useCookies(['token']);
    const [eInvoiceDetails, setEInvoiceDetails] = useState({
        sellerName: '',
        sellerAddress: '',
        sellerPanNumber: '',
        sellerGstNumber: '',
        eInvoiceDetailQRCode: '',
        eInvoiceDetailIrnNo: '',
        eInvoiceDetailAckNo: '',
        eInvoiceDetailAckDate: '',
        eInvoiceDetailEWayBillNo: '',
        BuyerDetailBillToName: '',
        BuyerDetailBillToAddress: '',
        BuyerDetailBillToContactNumber: '',
        BuyerDetailBillToGstNumber: '',
        BuyerDetailShipToName: '',
        BuyerDetailShipToAddress: '',
        BuyerDetailShipToContactNumber: '',
        BuyerDetailShipToGstNumber: '',
        invoiceDetailNumber: '',
        invoiceDetailDate: '',
        invoiceDetailQuickResponseCode: '',
        productDetails: [
            {
                productDetailSrNo: '',
                productDetailDescription: '',
                productDetailHSN: '',
                productDetailTypeOfProductsUQC: '',
                productDetailQty: '',
                productDetailRateOfProduct: '',
                productDetailAmount: '',
                productDetailTaxPayableOnRcm: '',
            },
        ],
        subTotal: '',
        amountInWords: '',
        notes: '',
        bankDetailBankName: '',
        bankDetailAccountNumber: '',
        bankDetailIfscCode: '',
        taxCalculationTaxRate: '',
        taxCalculationIgstEitherCgstOrSgst: '',
        termsAndConditions: '',
        authorizedSignature: '',
    });

    const handleInputChange = (field, value) => {
        setEInvoiceDetails({ ...eInvoiceDetails, [field]: value });
    };

    const handleProductChange = (index, field, value) => {
        const updatedProducts = eInvoiceDetails.productDetails.map((product, i) =>
            i === index ? { ...product, [field]: value } : product
        );
        setEInvoiceDetails({ ...eInvoiceDetails, productDetails: updatedProducts });
    };

    const addProduct = () => {
        setEInvoiceDetails({
            ...eInvoiceDetails,
            productDetails: [
                ...eInvoiceDetails.productDetails,
                {
                    productDetailSrNo: '',
                    productDetailDescription: '',
                    productDetailHSN: '',
                    productDetailTypeOfProductsUQC: '',
                    productDetailQty: '',
                    productDetailRateOfProduct: '',
                    productDetailAmount: '',
                    productDetailTaxPayableOnRcm: '',
                },
            ],
        });
    };

    const removeProduct = (index) => {
        const updatedProducts = eInvoiceDetails.productDetails.filter((_, i) => i !== index);
        setEInvoiceDetails({ ...eInvoiceDetails, productDetails: updatedProducts });
    };

    const handleSubmit = async () => {
        setLoading(true);
        const jsonData = {
            ...eInvoiceDetails,
            productDetails: eInvoiceDetails.productDetails.map((product) =>
                Object.fromEntries(Object.entries(product).map(([key, value]) => [key, String(value)]))
            ),
            addedByUserId: user.id,
        };

        console.log('jsonData', jsonData);

        try {
            // const res = await axios.post(
            //     `${BACKEND_URL}/documentslist/einvoice`,
            //     jsonData,
            //     {
            //         headers: {
            //             Authorization: cookies.token,
            //         },
            //     }
            // );

            // alert(res.data.message);
        alert("CRUD for Not Avaliable");

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
                        E-Invoice
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 mt-2 gap-4">
                        <div className="bg-white p-4 rounded-md">
                            <div className="container text-center text-green-700 font-sans font-semibold text-lg">
                                Seller Details
                            </div>
                            <InputField
                                label="Seller Name"
                                value={eInvoiceDetails.sellerName}
                                onChange={(e) => handleInputChange('sellerName', e.target.value)}
                                type="text"
                            />
                            <InputField
                                label="Seller Address"
                                value={eInvoiceDetails.sellerAddress}
                                onChange={(e) => handleInputChange('sellerAddress', e.target.value)}
                                type="text"
                            />
                            <InputField
                                label="Seller PAN Number"
                                value={eInvoiceDetails.sellerPanNumber}
                                onChange={(e) => handleInputChange('sellerPanNumber', e.target.value)}
                                type="text"
                            />
                            <InputField
                                label="Seller GST Number"
                                value={eInvoiceDetails.sellerGstNumber}
                                onChange={(e) => handleInputChange('sellerGstNumber', e.target.value)}
                                type="text"
                            />
                        </div>
                        <div className="bg-white p-4 rounded-md">
                            <div className="container text-center text-green-700 font-sans font-semibold text-lg">
                                E-Invoice Details
                            </div>
                            <InputField
                                label="QR Code"
                                value={eInvoiceDetails.eInvoiceDetailQRCode}
                                onChange={(e) => handleInputChange('eInvoiceDetailQRCode', e.target.value)}
                                type="text"
                            />
                            <InputField
                                label="IRN No"
                                value={eInvoiceDetails.eInvoiceDetailIrnNo}
                                onChange={(e) => handleInputChange('eInvoiceDetailIrnNo', e.target.value)}
                                type="text"
                            />
                            <InputField
                                label="Ack No"
                                value={eInvoiceDetails.eInvoiceDetailAckNo}
                                onChange={(e) => handleInputChange('eInvoiceDetailAckNo', e.target.value)}
                                type="number"
                            />
                            <InputField
                                label="Ack Date"
                                value={eInvoiceDetails.eInvoiceDetailAckDate}
                                onChange={(e) => handleInputChange('eInvoiceDetailAckDate', e.target.value)}
                                type="date"
                            />
                            <InputField
                                label="E-Way Bill No"
                                value={eInvoiceDetails.eInvoiceDetailEWayBillNo}
                                onChange={(e) => handleInputChange('eInvoiceDetailEWayBillNo', e.target.value)}
                                type="number"
                            />
                        </div>
                        <div className="bg-white p-4 rounded-md">
                            <div className="container text-center text-green-700 font-sans font-semibold text-lg">
                                Buyer Details (Bill To)
                            </div>
                            <div className="container text-center text-green-700 font-sans font-semibold text-base">
                               Bill To
                            </div>
                            <InputField
                                label="Bill To Name"
                                value={eInvoiceDetails.BuyerDetailBillToName}
                                onChange={(e) => handleInputChange('BuyerDetailBillToName', e.target.value)}
                                type="text"
                            />
                            <InputField
                                label="Bill To Address"
                                value={eInvoiceDetails.BuyerDetailBillToAddress}
                                onChange={(e) => handleInputChange('BuyerDetailBillToAddress', e.target.value)}
                                type="text"
                            />
                            <InputField
                                label="Bill To Contact Number"
                                value={eInvoiceDetails.BuyerDetailBillToContactNumber}
                                onChange={(e) => handleInputChange('BuyerDetailBillToContactNumber', e.target.value)}
                                type="number"
                            />
                            <InputField
                                label="Bill To GST Number"
                                value={eInvoiceDetails.BuyerDetailBillToGstNumber}
                                onChange={(e) => handleInputChange('BuyerDetailBillToGstNumber', e.target.value)}
                                type="text"
                            />
                       
                           
                            <div className="container text-center text-green-700 font-sans font-semibold text-base">
                                 Ship To
                            </div>
                            <InputField
                                label="Ship To Name"
                                value={eInvoiceDetails.BuyerDetailShipToName}
                                onChange={(e) => handleInputChange('BuyerDetailShipToName', e.target.value)}
                                type="text"
                            />
                            <InputField
                                label="Ship To Address"
                                value={eInvoiceDetails.BuyerDetailShipToAddress}
                                onChange={(e) => handleInputChange('BuyerDetailShipToAddress', e.target.value)}
                                type="text"
                            />
                            <InputField
                                label="Ship To Contact Number"
                                value={eInvoiceDetails.BuyerDetailShipToContactNumber}
                                onChange={(e) => handleInputChange('BuyerDetailShipToContactNumber', e.target.value)}
                                type="number"
                            />
                            <InputField
                                label="Ship To GST Number"
                                value={eInvoiceDetails.BuyerDetailShipToGstNumber}
                                onChange={(e) => handleInputChange('BuyerDetailShipToGstNumber', e.target.value)}
                                type="text"
                            />
                        </div>
                        <div className="bg-white p-4 rounded-md">
                            <div className="container text-center text-green-700 font-sans font-semibold text-lg">
                                Invoice Details
                            </div>
                            <InputField
                                label="Invoice Number"
                                value={eInvoiceDetails.invoiceDetailNumber}
                                onChange={(e) => handleInputChange('invoiceDetailNumber', e.target.value)}
                                type="text"
                            />
                            <InputField
                                label="Invoice Date"
                                value={eInvoiceDetails.invoiceDetailDate}
                                onChange={(e) => handleInputChange('invoiceDetailDate', e.target.value)}
                                type="date"
                            />
                            <InputField
                                label="Quick Response Code"
                                value={eInvoiceDetails.invoiceDetailQuickResponseCode}
                                onChange={(e) => handleInputChange('invoiceDetailQuickResponseCode', e.target.value)}
                                type="number"
                            />
                        </div>
                        <div className="bg-white p-4 rounded-md">
                            <div className="container text-center text-green-700 font-sans font-semibold text-lg">
                                Product Details
                            </div>
                            {eInvoiceDetails.productDetails.map((product, index) => (
                                <div key={index} className="mb-4">
                                    <InputField
                                        label="Sr No"
                                        value={product.productDetailSrNo}
                                        onChange={(e) => handleProductChange(index, 'productDetailSrNo', e.target.value)}
                                        type="number"
                                    />
                                    <InputField
                                        label="Description"
                                        value={product.productDetailDescription}
                                        onChange={(e) => handleProductChange(index, 'productDetailDescription', e.target.value)}
                                        type="text"
                                    />
                                    <InputField
                                        label="HSN"
                                        value={product.productDetailHSN}
                                        onChange={(e) => handleProductChange(index, 'productDetailHSN', e.target.value)}
                                        type="number"
                                    />
                                    <InputField
                                        label="Type Of Products UQC"
                                        value={product.productDetailTypeOfProductsUQC}
                                        onChange={(e) => handleProductChange(index, 'productDetailTypeOfProductsUQC', e.target.value)}
                                        type="number"
                                    />
                                    <InputField
                                        label="Qty"
                                        value={product.productDetailQty}
                                        onChange={(e) => handleProductChange(index, 'productDetailQty', e.target.value)}
                                        type="text"
                                    />
                                    <InputField
                                        label="Rate Of Product"
                                        value={product.productDetailRateOfProduct}
                                        onChange={(e) => handleProductChange(index, 'productDetailRateOfProduct', e.target.value)}
                                        type="number"
                                    />
                                    <InputField
                                        label="Amount"
                                        value={product.productDetailAmount}
                                        onChange={(e) => handleProductChange(index, 'productDetailAmount', e.target.value)}
                                        type="number"
                                    />
                                    <InputField
                                        label="Tax Payable On RCM"
                                        value={product.productDetailTaxPayableOnRcm}
                                        onChange={(e) => handleProductChange(index, 'productDetailTaxPayableOnRcm', e.target.value)}
                                        type="text"
                                    />
                                    <button onClick={() => removeProduct(index)} className="bg-red-500 text-white p-2 rounded-md mt-2">
                                        Remove Product
                                    </button>
                                </div>
                            ))}
                            <button onClick={addProduct} className="bg-green-500 text-white p-2 rounded-md">
                                Add Product
                            </button>
                        </div>
                        <div className="bg-white p-4 rounded-md">
                            <div className="container text-center text-green-700 font-sans font-semibold text-lg">
                                Summary
                            </div>
                            <InputField
                                label="Sub Total of All"
                                value={eInvoiceDetails.subTotal}
                                onChange={(e) => handleInputChange('subTotal', e.target.value)}
                                type="number"
                            />
                            <InputField
                                label="Amount In Words"
                                value={eInvoiceDetails.amountInWords}
                                onChange={(e) => handleInputChange('amountInWords', e.target.value)}
                                type="text"
                            />
                            <InputField
                                label="Notes"
                                value={eInvoiceDetails.notes}
                                onChange={(e) => handleInputChange('notes', e.target.value)}
                                type="text"
                            />
                        </div>
                        <div className="bg-white p-4 rounded-md">
                            <div className="container text-center text-green-700 font-sans font-semibold text-lg">
                                Bank Details
                            </div>
                            <InputField
                                label="Bank Name"
                                value={eInvoiceDetails.bankDetailBankName}
                                onChange={(e) => handleInputChange('bankDetailBankName', e.target.value)}
                                type="text"
                            />
                            <InputField
                                label="Account Number"
                                value={eInvoiceDetails.bankDetailAccountNumber}
                                onChange={(e) => handleInputChange('bankDetailAccountNumber', e.target.value)}
                                type="number"
                            />
                            <InputField
                                label="IFSC Code"
                                value={eInvoiceDetails.bankDetailIfscCode}
                                onChange={(e) => handleInputChange('bankDetailIfscCode', e.target.value)}
                                type="text"
                            />
                        </div>
                        <div className="bg-white p-4 rounded-md">
                            <div className="container text-center text-green-700 font-sans font-semibold text-lg">
                                Tax Calculation
                            </div>
                            <InputField
                                label="Tax Rate"
                                value={eInvoiceDetails.taxCalculationTaxRate}
                                onChange={(e) => handleInputChange('taxCalculationTaxRate', e.target.value)}
                                type="number"
                            />
                            <InputField
                                label="IGST/CGST/SGST"
                                value={eInvoiceDetails.taxCalculationIgstEitherCgstOrSgst}
                                onChange={(e) => handleInputChange('taxCalculationIgstEitherCgstOrSgst', e.target.value)}
                                type="number"
                            />
                        </div>
                        <div className="bg-white p-4 rounded-md">
                            <div className="container text-center text-green-700 font-sans font-semibold text-lg">
                                Terms and Conditions
                            </div>
                            <InputField
                                label="Terms and Conditions"
                                value={eInvoiceDetails.termsAndConditions}
                                onChange={(e) => handleInputChange('termsAndConditions', e.target.value)}
                                type="text"
                            />
                            <InputField
                                label="Authorized Signature"
                                value={eInvoiceDetails.authorizedSignature}
                                onChange={(e) => handleInputChange('authorizedSignature', e.target.value)}
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

export default EInvoicePage;
