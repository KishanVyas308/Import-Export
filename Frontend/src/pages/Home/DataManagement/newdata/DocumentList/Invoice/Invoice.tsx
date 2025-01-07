import React, { useState } from 'react'
import InputField from '../../../../../components/InputField';
import NewDataButtons from '../../NewDataButtons';
import axios from 'axios';
import { BACKEND_URL } from '../../../../../../Globle';
import { useCookies } from 'react-cookie';
import { useRecoilValue } from 'recoil';
import { authAtom } from '../../../../../../atoms/authAtom';
import Loading from '../../../../../components/Loading';
import NewDataHeaderComponent from '../../NewDataHeaderComponent';

const Invoice = () => {

  const [cookies, setCookie] = useCookies(["token"]);
  const { user } = useRecoilValue(authAtom);
  const [loading, setLoading] = useState(false);


  const [invoice, setInvoice] = useState({
    sellerName: '',
    sellerAddress: '',
    sellerPanNumber: '',
    sellerGstNumber: '',
    buyerBillToName: '',
    buyerBillToAddress: '',
    buyerContactNumber: '',
    buyerGstNumber: '',
    buyerShipToName: '',
    buyerShipToAddress: '',
    buyerShipToContactNumber: '',
    buyerShipToGstNumber: '',
    invoiceNumber: '',
    invoiceDate: '',
    quickResponseCode: '',
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
    bankName: '',
    accountNumber: '',
    ifscCode: '',
    taxRate: '',
    igst: '',
    termsAndConditions: '',
    authorizedSignature: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInvoice((prevInvoice) => ({
      ...prevInvoice,
      [name]: value,
    }));
  };

  const handleProductChange = (index, field, value) => {
    const updatedProducts = invoice.productDetails.map((product, i) =>
      i === index ? { ...product, [field]: value } : product
    );
    setInvoice((prevInvoice) => ({
      ...prevInvoice,
      productDetails: updatedProducts,
    }));
  };

  const addProduct = () => {
    setInvoice((prevInvoice) => ({
      ...prevInvoice,
      productDetails: [
        ...prevInvoice.productDetails,
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
    }));
  };

  const removeProduct = (index) => {
    const updatedProducts = invoice.productDetails.filter((_, i) => i !== index);
    setInvoice((prevInvoice) => ({
      ...prevInvoice,
      productDetails: updatedProducts,
    }));
  };

  const handleSubmit = async () => {
    setLoading(true);

    const jsonData = {
      ...invoice,
      productDetails: invoice.productDetails.map((product) =>
        Object.fromEntries(Object.entries(product).map(([key, value]) => [key, String(value)]))
      ),
      addedByUserId: user.id,
    };

    try {
      const res = await axios.post(
        `${BACKEND_URL}/documentslist/invoice`,
        jsonData,
        {
          headers: {
            Authorization: cookies.token,
          },
        }
      );

      alert(res.data.message)
      // Handle form submission
      console.log(res);
      setLoading(false);
    } catch (error) {
      alert('Error in saving data');
      setLoading(false);
    }
    setLoading(false);
  };

  return (
    <div className="bg-[#e6e7e9] w-full h-full min-h-screen">
      <div className="container mx-auto px-4 py-8 ">
        {loading && <Loading />}
        <NewDataHeaderComponent
          backLink={"/datamanagement"}
          nextLink={"/datamanagement/newdata/part2"}
        />
        <div className="container mx-auto px-4 py-8">
          <div className="container text-center text-green-700 font-sans font-semibold text-[24px]">
            Invoice
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 mt-2 gap-4">
            <div className="bg-white p-4 rounded-md">
              <div className="container text-center text-green-700 font-sans font-semibold text-xl">
                Seller Details
              </div>
              <InputField label="Seller Name" value={invoice.sellerName} onChange={(e) => {
                setInvoice((prevInvoice) => ({
                  ...prevInvoice,
                  sellerName: e.target.value,
                }));
              }} />
              <InputField label="Seller Address" value={invoice.sellerAddress} onChange={(e) => {
                setInvoice((prevInvoice) => ({
                  ...prevInvoice,
                  sellerAddress: e.target.value,
                }));
              }} />
              <InputField label="Seller PAN Number" value={invoice.sellerPanNumber} onChange={(e) => {
                setInvoice((prevInvoice) => ({
                  ...prevInvoice,
                  sellerPanNumber: e.target.value,
                }));
              }} />
              <InputField label="Seller GST Number" value={invoice.sellerGstNumber} onChange={(e) => {
                setInvoice((prevInvoice) => ({
                  ...prevInvoice,
                  sellerGstNumber: e.target.value,
                }));
              }} />
            </div>
            <div className="bg-white p-4 rounded-md">
              <div className="container text-center text-green-700 font-sans font-semibold text-xl">
                Buyer Details
              </div>
              <div className="container text-center text-green-700 font-sans font-semibold text-base">
                Bill to
              </div>
              <InputField label="Name" value={invoice.buyerBillToName} onChange={(e) => {
                setInvoice((prevInvoice) => ({
                  ...prevInvoice,
                  buyerBillToName: e.target.value,
                }));
              }} />
              <InputField label="Address" value={invoice.buyerBillToAddress} onChange={(e) => {
                setInvoice((prevInvoice) => ({
                  ...prevInvoice,
                  buyerBillToAddress: e.target.value,
                }));
              }} />
              <InputField label="Contact Number" value={invoice.buyerContactNumber} onChange={(e) => {
                setInvoice((prevInvoice) => ({
                  ...prevInvoice,
                  buyerContactNumber: e.target.value,
                }));
              }} />
              <InputField label="GST Number" value={invoice.buyerGstNumber} onChange={(e) => {
                setInvoice((prevInvoice) => ({
                  ...prevInvoice,
                  buyerGstNumber: e.target.value,
                }));
              }} />
              <div className="container text-center text-green-700 font-sans font-semibold text-base">
                If Ship To Applicable
              </div>
              <InputField label="Name" value={invoice.buyerShipToName} onChange={(e) => {
                setInvoice((prevInvoice) => ({
                  ...prevInvoice,
                  buyerShipToName: e.target.value,
                }));
              }} />
              <InputField label="Address" value={invoice.buyerShipToAddress} onChange={(e) => {
                setInvoice((prevInvoice) => ({
                  ...prevInvoice,
                  buyerShipToAddress: e.target.value,
                }));
              }} />
              <InputField label="Contact Number" value={invoice.buyerShipToContactNumber} onChange={(e) => {
                setInvoice((prevInvoice) => ({
                  ...prevInvoice,
                  buyerShipToContactNumber: e.target.value,
                }));
              }} />
              <InputField label="GST Number" value={invoice.buyerShipToGstNumber} onChange={(e) => {
                setInvoice((prevInvoice) => ({
                  ...prevInvoice,
                  buyerShipToGstNumber: e.target.value,
                }));
              }} />
            </div>
            <div className="bg-white p-4 rounded-md">
              <div className="container text-center text-green-700 font-sans font-semibold text-xl">
                Invoice Details
              </div>
              <InputField label="Number" value={invoice.invoiceNumber} onChange={(e) => {
                setInvoice((prevInvoice) => ({
                  ...prevInvoice,
                  invoiceNumber: e.target.value,
                }));
              }} />
              <InputField label="Date" value={invoice.invoiceDate} onChange={(e) => {
                setInvoice((prevInvoice) => ({
                  ...prevInvoice,
                  invoiceDate: e.target.value,
                }));
              }} type="date" />
              <InputField label="Quick Response Code" value={invoice.quickResponseCode} onChange={(e) => {
                setInvoice((prevInvoice) => ({
                  ...prevInvoice,
                  quickResponseCode: e.target.value,
                }));
              }} />

            </div>
            <div className="bg-white p-4 rounded-md">
              <div className="container text-center text-green-700 font-sans font-semibold text-xl">
                Product Details
              </div>

              {invoice.productDetails.map((product, index) => (
                <div key={index} className="mb-4">
                  <InputField label="Sr No" value={product.productDetailSrNo} onChange={(e) => handleProductChange(index, 'productDetailSrNo', e.target.value)} />
                  <InputField label="Description" value={product.productDetailDescription} onChange={(e) => handleProductChange(index, 'productDetailDescription', e.target.value)} />
                  <InputField label="HSN" value={product.productDetailHSN} onChange={(e) => handleProductChange(index, 'productDetailHSN', e.target.value)} />
                  <InputField label="Type Of Products UQC" value={product.productDetailTypeOfProductsUQC} onChange={(e) => handleProductChange(index, 'productDetailTypeOfProductsUQC', e.target.value)} />
                  <InputField label="Qty" value={product.productDetailQty} onChange={(e) => handleProductChange(index, 'productDetailQty', e.target.value)} />
                  <InputField label="Rate Of Product" value={product.productDetailRateOfProduct} onChange={(e) => handleProductChange(index, 'productDetailRateOfProduct', e.target.value)} />
                  <InputField label="Amount" value={product.productDetailAmount} onChange={(e) => handleProductChange(index, 'productDetailAmount', e.target.value)} />
                  <InputField label="Tax Payable On RCM" value={product.productDetailTaxPayableOnRcm} onChange={(e) => handleProductChange(index, 'productDetailTaxPayableOnRcm', e.target.value)} />
                  <button onClick={() => removeProduct(index)} className="bg-red-500 text-white p-2 rounded-md mt-2">
                    Remove Product
                  </button>
                </div>
              ))}
              <button onClick={addProduct} className="bg-green-500 text-white p-2 rounded-md">
                Add Product
              </button>
              <InputField label="Sub Total" value={invoice.subTotal} onChange={(e) => {
                setInvoice((prevInvoice) => ({
                  ...prevInvoice,
                  subTotal: e.target.value,
                }));
              }} />
              <div className='py-2'>
                <hr className="border-t-2 border-gray-300" />
              </div>
              <InputField label="Amount In Words" value={invoice.amountInWords} onChange={(e) => {
                setInvoice((prevInvoice) => ({
                  ...prevInvoice,
                  amountInWords: e.target.value,
                }));
              }} />
              <InputField label="Notes" value={invoice.notes} onChange={(e) => {
                setInvoice((prevInvoice) => ({
                  ...prevInvoice,
                  notes: e.target.value,
                }));
              }} />
            </div>
            <div className="bg-white p-4 rounded-md">
              <div className="container text-center text-green-700 font-sans font-semibold text-xl">
                Bank Details
              </div>
              <InputField label="Bank Name" value={invoice.bankName} onChange={(e) => {
                setInvoice((prevInvoice) => ({
                  ...prevInvoice,
                  bankName: e.target.value,
                }));
              }} />
              <InputField label="Account Number" value={invoice.accountNumber} onChange={(e) => {
                setInvoice((prevInvoice) => ({
                  ...prevInvoice,
                  accountNumber: e.target.value,
                }));
              }} />
              <InputField label="IFSC Code" value={invoice.ifscCode} onChange={(e) => {
                setInvoice((prevInvoice) => ({
                  ...prevInvoice,
                  ifscCode: e.target.value,
                }));
              }} />

            </div>
            <div className="bg-white p-4 rounded-md">
              <div className="container text-center text-green-700 font-sans font-semibold text-xl">
                Tax Calculation
              </div>
              <InputField label="Rate of Tax" value={invoice.taxRate} onChange={(e) => {
                setInvoice((prevInvoice) => ({
                  ...prevInvoice,
                  taxRate: e.target.value,
                }));
              }} />
              <InputField label="IGST Either CGST & SGST
" value={invoice.igst} onChange={(e) => {
                  setInvoice((prevInvoice) => ({
                    ...prevInvoice,
                    igst: e.target.value,
                  }));
                }} />

              <div className='py-2'>
                <hr className="border-t-2 border-gray-300" />
              </div>

              <InputField label="Terms And Conditions" value={invoice.termsAndConditions} onChange={(e) => {
                setInvoice((prevInvoice) => ({
                  ...prevInvoice,
                  termsAndConditions: e.target.value,
                }));
              }} />
              <InputField label="Authorized Signature" value={invoice.authorizedSignature} onChange={(e) => {
                setInvoice((prevInvoice) => ({
                  ...prevInvoice,
                  authorizedSignature: e.target.value,
                }));
              }} />
            </div>
          </div>
          <NewDataButtons backLink="" nextLink="" handleSubmit={handleSubmit} />
        </div>
      </div>
    </div>
  );
};

export default Invoice;
