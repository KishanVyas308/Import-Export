import React, { useEffect, useMemo, useState } from "react";
import Loading from "../../../../../../components/Loading";
import InputField, { SelectInputField } from "../../../../../../components/InputField";
import NewDataButtons from "../../NewDataButtons";
import { useCookies } from "react-cookie";
import axios from "axios";
import { BACKEND_URL } from "../../../../../../../Globle";
import { useRecoilValue } from "recoil";
import { authAtom } from "../../../../../../../atoms/authAtom";
import { fetchCustomers } from "../../../../../../utility/dataFetch";
import { CustomerDetail } from "../../../../../../utility/types/customerDetail";

const ShippingBillPage = () => {
  const [usdPrice, setUsdPrice] = useState("USD Price: -cant able to fetch-");
  const { user } = useRecoilValue(authAtom);
 

  const [exporterDetail, setExporterDetail] = useState<CustomerDetail[]>([]);
  const [currentExporterIndex, setCurrentExporterIndex] = useState<number | null>(null)

  const [basicSheet, setBasicSheet] = useState({
    companyName: "",
    srNo: "0",
    shippingBillNo: "0",
    shippingBillDate: "",
    exportersName: "",
    hsCodeAndDescription: "",
    epcgLicNo: "",
    cifValue: "0",
    freight: "0",
    insurance: "0",
    brc: "0",
    exchangeRateOrProprtionRatio: "1",
    cifValue2: "0",
    freight2: "0",
    insurance2: "0",
    brc2: "0",
    exchangeRate: "",
    product: "",
    remarks: "",
  });

  const [annexure1, setAnnexure1] = useState({
    srNo: "",
    shippingBillNo: "",
    shippingBillDate: "",
    shippingBillCifValueInDoller: "",
    brcValue: "",
    lowerOfSbAndBrc: "",
    shippingBillFreight: "",
    shippingBillInsurance: "",
    fobValueInDoller: "",
    ExchangeRatePerShippingBill: "",
    fobValueInRupees: "",
  });

  const [annexureA, setAnnexureA] = useState({
    srNo: basicSheet.srNo,
    productExportered: basicSheet.product, // Assuming product is in basicSheet
    shippingBillNumber: basicSheet.shippingBillNo,
    shippingBillDate: basicSheet.shippingBillDate,
    directExportsInRupees: annexure1.fobValueInRupees, // Assuming fobValueInRupees is in annexure1
    directExportsInDollars: annexure1.fobValueInDoller, // Assuming fobValueInDoller is in annexure1
    deemedExports: "0", // Default value
    thirdPartyExportsInRupees: "0", // Default value
    thirdPartyExportsInDollars: "0", // Default value
    byGroupCompany: "0", // Default value
    otherRWseries: "0", // Default value
    totalInRupees: annexure1.fobValueInRupees, // Using the same value from annexure1
    totalInDollars: annexure1.fobValueInDoller,
  });

  const [blockwiseSummary, setBlockwiseSummary] = useState({
    EOImposed: "0",
    DirectExport: "0",
    IndirectExport: "0",
    Total: "0",
    Excess: "0",
    EOFulfilled: "0",
    ExcessEo: "0",
  });

  const [loading, setLoading] = useState(false);

  const [cookies, setCookie] = useCookies(["token"]);


  //? Fetch all Exporter Detail
  useEffect(() => {
    setLoading(true);
    fetchCustomers(cookies.token).then((data) => {
      setExporterDetail(data);
      setLoading(false);
    });
    setLoading(false);
  }, []);



  const handleSubmit = async () => {
    setLoading(true);
    const jsonData = {
      basicSheet,
      addedByUserId: user.id
    };
    console.log(jsonData);

    const res1 = await axios.post(
      `${BACKEND_URL}/forms/directexport/basicsheet`,
      jsonData,
      {
        headers: {
          Authorization: cookies.token,
        },
      }
    );
    if (res1.status !== 200) {
      alert("Error in saving data");
      setLoading(false);
      return;
    }

    const annexure1Data = {
      annexure1,
      addedByUserId: user.id
    }
    console.log(annexure1Data);

    const res2 = await axios.post(
      `${BACKEND_URL}/forms/directexport/annexure1`,
      annexure1Data,
      {
        headers: {
          Authorization: cookies.token,
        },
      }
    );
    if (res2.status !== 200) {
      alert("Error in saving data");
      setLoading(false);
      return;
    }

    const annexureAData = {
      annexureA,
      addedByUserId: user.id
    }
    console.log(annexureAData);

    const res3 = await axios.post(
      `${BACKEND_URL}/forms/directexport/annexureA`,
      annexureAData,
      {
        headers: {
          Authorization: cookies.token,
        },
      }
    );

    if (res3.status !== 200) {
      alert("Error in saving data");
      setLoading(false);
      return;
    }
    alert("Data saved successfully");

    setLoading(false);
  };

  const getSummary = async () => {
    setLoading(true);
    const res = await axios.get(
      `${BACKEND_URL}/forms/directexport/summary`,
      {
        headers: {
          Authorization: cookies.token,
        },
      }
    );
    if (res.status !== 200) {
      alert("Error in fetching data");
      setLoading(false);
      return;
    }
    console.log(res.data);

    setBlockwiseSummary(res.data.summary);
    setLoading(false);
  }



  // UseMemo to update both basicSheet and annexure1 values based on basicSheet inputs
  useMemo(() => {
    const updatedBasicSheet = {
      cifValue2: (
        Number(basicSheet.cifValue) *
        Number(basicSheet.exchangeRateOrProprtionRatio)
      ).toString(),
      freight2: (
        Number(basicSheet.freight) *
        Number(basicSheet.exchangeRateOrProprtionRatio)
      ).toString(),
      insurance2: (
        Number(basicSheet.insurance) *
        Number(basicSheet.exchangeRateOrProprtionRatio)
      ).toString(),
      brc2: (
        Number(basicSheet.brc) * Number(basicSheet.exchangeRateOrProprtionRatio)
      ).toString(),
    };

    const cifValue2 =
      Number(basicSheet.cifValue) *
      Number(basicSheet.exchangeRateOrProprtionRatio);
    const brc2 =
      Number(basicSheet.brc) * Number(basicSheet.exchangeRateOrProprtionRatio);
    const lowerOfSbAndBrc = Math.min(cifValue2, brc2).toString();
    const shippingBillFreight =
      Number(basicSheet.freight) *
      Number(basicSheet.exchangeRateOrProprtionRatio);
    const shippingBillInsurance =
      Number(basicSheet.insurance) *
      Number(basicSheet.exchangeRateOrProprtionRatio);
    const fobValueInDoller = (
      Number(lowerOfSbAndBrc) -
      (shippingBillFreight + shippingBillInsurance)
    ).toString();
    const fobValueInRupees = (
      Number(fobValueInDoller) * Number(basicSheet.exchangeRate)
    ).toString();

    const updatedAnnexure1 = {
      srNo: basicSheet.srNo,
      shippingBillNo: basicSheet.shippingBillNo,
      shippingBillDate: basicSheet.shippingBillDate,
      shippingBillCifValueInDoller: cifValue2.toString(),
      brcValue: brc2.toString(),
      lowerOfSbAndBrc: lowerOfSbAndBrc,
      shippingBillFreight: shippingBillFreight.toString(),
      shippingBillInsurance: shippingBillInsurance.toString(),
      fobValueInDoller: fobValueInDoller,
      ExchangeRatePerShippingBill: basicSheet.exchangeRate,
      fobValueInRupees: fobValueInRupees,
    };

    const updatedAnnexureA = {
      srNo: basicSheet.srNo,
      productExportered: basicSheet.product,
      shippingBillNumber: basicSheet.shippingBillNo,
      shippingBillDate: basicSheet.shippingBillDate,
      directExportsInRupees: fobValueInRupees,
      directExportsInDollars: fobValueInDoller,
      totalInRupees:( Number(fobValueInRupees) + Number(annexureA.thirdPartyExportsInRupees)).toString(),
      totalInDollars: (Number(fobValueInDoller) + Number(annexureA.thirdPartyExportsInDollars)).toString(),
    };



    setBasicSheet((prevBasicSheet) => ({
      ...prevBasicSheet,
      ...updatedBasicSheet
    }));

    setAnnexure1((prevAnnexure) => ({
      ...prevAnnexure,
      ...updatedAnnexure1
    }));
    setAnnexureA((prevAnnexure) => ({
      ...prevAnnexure,
      ...updatedAnnexureA
    }));


  }, [
    basicSheet.cifValue,
    basicSheet.freight,
    basicSheet.insurance,
    basicSheet.brc,
    basicSheet.exchangeRateOrProprtionRatio,
    basicSheet.exchangeRate,
    basicSheet.srNo,
    basicSheet.shippingBillNo,
    basicSheet.shippingBillDate,
    basicSheet.exportersName,
    basicSheet.hsCodeAndDescription,
    basicSheet.epcgLicNo,
    basicSheet.product,
    basicSheet.srNo,
    annexureA.thirdPartyExportsInRupees,
    annexureA.thirdPartyExportsInDollars
  ]);

  //? On chang of current exporter index 
  useMemo(() => {
    if (currentExporterIndex !== null) {
      const selectedExporter = exporterDetail[currentExporterIndex];
      setBasicSheet((prev) => ({
        ...prev,
        exportersName: selectedExporter.customerName,
        exporterAddress: selectedExporter.mailId1,
        // type: selectedExporter.type,
        // adCode: selectedExporter.adCode,
        // cbName: selectedExporter.cbName,
        // forexBankAc: selectedExporter.forexBankAc.join(", "),
        // dbkBankAcNo: selectedExporter.dbkBankAcNo.join(", "),
      }));
      console.log(selectedExporter);


    }
  }, [currentExporterIndex]);


  const getUsdPrice = async () => {
    const res = await axios.get("https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/usd.json")

    console.log(res.data.usd.inr);
    setUsdPrice(res.data.usd.inr);
  }
  useEffect(() => {
    getUsdPrice();

  }, [])
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
    {loading && <Loading />}
    
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-center text-green-700 mb-2">Direct Export</h1>
        <div className="flex justify-center items-center space-x-2">
          <div className="px-4 py-2 bg-white rounded-lg shadow text-green-700 font-medium">
            {usdPrice ? `USD Price: ${usdPrice}` : "USD Price: Loading..."}
          </div>
         
        </div>
      </div>
        <div className="grid grid-cols-1 md:grid-cols-3 mt-2 gap-4">
          <div className="bg-white p-4 rounded-md">
            <div className="container text-center text-green-700 font-sans font-semibold text-xl">
              BasicSheet
            </div>
            <InputField
              label="Company Name"
              value={basicSheet.companyName}
              onChange={(e) =>
                setBasicSheet({ ...basicSheet, companyName: e.target.value })
              }
            />
            <InputField
              label="SR No"
              value={basicSheet.srNo}
              onChange={(e) =>
                setBasicSheet({ ...basicSheet, srNo: e.target.value })
              }
              type="number"
            />
            <InputField
              label="Shipping Bill No"
              value={basicSheet.shippingBillNo}
              onChange={(e) =>
                setBasicSheet({ ...basicSheet, shippingBillNo: e.target.value })
              }
              type="number"
            />
            <InputField
              label="Shipping Bill Date"
              value={basicSheet.shippingBillDate}
              onChange={(e) =>
                setBasicSheet({
                  ...basicSheet,
                  shippingBillDate: e.target.value,
                })
              }
              type="date"
            />
            <InputField
              label="Exporter's Name"
              type="select"
              options={exporterDetail.map((exporter) => exporter.customerName)}
              value={basicSheet.exportersName}
              onChange={(e) => {
                setBasicSheet({
                  ...basicSheet,
                  exportersName: e.target.value,
                })
                setCurrentExporterIndex(exporterDetail.findIndex((exporter) => exporter.customerName === e.target.value))
              }
              }
            />


            <InputField
              label="HS Code & Description"
              value={basicSheet.hsCodeAndDescription}
              onChange={(e) =>
                setBasicSheet({
                  ...basicSheet,
                  hsCodeAndDescription: e.target.value,
                })
              }
              type="select"
              options={["N", "Y"]}
            />  

            <InputField
              label="EPCG Lic. No."
              value={basicSheet.epcgLicNo}
              onChange={(e) =>
                setBasicSheet({ ...basicSheet, epcgLicNo: e.target.value })
              }
              type="select"
              options={["N", "Y"]}
            />
            <InputField
              label="CIF Value"
              value={basicSheet.cifValue}
              onChange={(e) =>
                setBasicSheet({ ...basicSheet, cifValue: e.target.value })
              }
              type="number"
            />
            <InputField
              label="Freight"
              value={basicSheet.freight}
              onChange={(e) =>
                setBasicSheet({ ...basicSheet, freight: e.target.value })
              }
              type="number"
            />
            <InputField
              label="Insurance"
              value={basicSheet.insurance}
              onChange={(e) =>
                setBasicSheet({ ...basicSheet, insurance: e.target.value })
              }
              type="number"
            />
            <InputField
              label="BRC"
              value={basicSheet.brc}
              onChange={(e) =>
                setBasicSheet({ ...basicSheet, brc: e.target.value })
              }
              type="number"
            />
            <InputField
              label="Exchange Rate or Proprtion Ratio"
              value={basicSheet.exchangeRateOrProprtionRatio}
              onChange={(e) =>
                setBasicSheet({
                  ...basicSheet,
                  exchangeRateOrProprtionRatio: e.target.value,
                })
              }
              type="number"
            />

            <InputField
              label="CIF Value 2"
              value={basicSheet.cifValue2}
              onChange={(e) =>
                setBasicSheet({ ...basicSheet, cifValue2: e.target.value })
              }
              type="number"
            />
            <InputField
              label="Freight 2"
              value={basicSheet.freight2}
              onChange={(e) =>
                setBasicSheet({ ...basicSheet, freight2: e.target.value })
              }
              type="number"
            />
            <InputField
              label="Insurance 2"
              value={basicSheet.insurance2}
              onChange={(e) =>
                setBasicSheet({ ...basicSheet, insurance2: e.target.value })
              }
              type="number"
            />
            <InputField
              label="BRC 2"
              value={basicSheet.brc2}
              onChange={(e) =>
                setBasicSheet({ ...basicSheet, brc2: e.target.value })
              }
              type="number"
            />

            <InputField
              label="Exchange Rate"
              value={basicSheet.exchangeRate}
              onChange={(e) =>
                setBasicSheet({ ...basicSheet, exchangeRate: e.target.value })
              }
              type="number"
            />
            <InputField
              label="Product"
              value={basicSheet.product}
              onChange={(e) =>
                setBasicSheet({ ...basicSheet, product: e.target.value })
              }
            />
            <InputField
              label="Remarks"
              value={basicSheet.remarks}
              onChange={(e) =>
                setBasicSheet({ ...basicSheet, remarks: e.target.value })
              }
            />
          </div>
          <div className="bg-white p-4 rounded-md">
            <div className="container text-center text-green-700 font-sans font-semibold text-xl">
              Annexure1
            </div>
            <InputField
              label="SR No"
              value={annexure1.srNo}
              onChange={(e) =>
                setAnnexure1({ ...annexure1, srNo: e.target.value })
              }
              type="number"
            />
            <InputField
              label="Shipping Bill No"
              value={annexure1.shippingBillNo}
              onChange={(e) =>
                setAnnexure1({ ...annexure1, shippingBillNo: e.target.value })
              }
              type="number"
            />
             <InputField
              label="Shipping Bill Date"
              value={annexure1.shippingBillDate}
              onChange={(e) =>
                setAnnexure1({
                  ...annexure1,
                  shippingBillDate: e.target.value,
                })
              }
              type="date"
            />
            <InputField
              label="Shipping Bill CIF Value (in Dollar)"
              value={annexure1.shippingBillCifValueInDoller}
              onChange={(e) =>
                setAnnexure1({
                  ...annexure1,
                  shippingBillCifValueInDoller: e.target.value,
                })
              }
              type="number"
            />
            <InputField
              label="BRC Value"
              value={annexure1.brcValue}
              onChange={(e) =>
                setAnnexure1({ ...annexure1, brcValue: e.target.value })
              }
              type="number"
            />
            <InputField
              label="Lower of SB and BRC"
              value={annexure1.lowerOfSbAndBrc}
              onChange={(e) =>
                setAnnexure1({ ...annexure1, lowerOfSbAndBrc: e.target.value })
              }
              type="number"
            />
            <InputField
              label="Shipping Bill Freight"
              value={annexure1.shippingBillFreight}
              onChange={(e) =>
                setAnnexure1({
                  ...annexure1,
                  shippingBillFreight: e.target.value,
                })
              }
              type="number"
            />
            <InputField
              label="Shipping Bill Insurance"
              value={annexure1.shippingBillInsurance}
              onChange={(e) =>
                setAnnexure1({
                  ...annexure1,
                  shippingBillInsurance: e.target.value,
                })
              }
              type="number"
            />
            <InputField
              label="FOB Value (in Dollar)"
              value={annexure1.fobValueInDoller}
              onChange={(e) =>
                setAnnexure1({ ...annexure1, fobValueInDoller: e.target.value })
              }
              type="number"
            />
            <InputField
              label="Exchange Rate as per Shipping Bill"
              value={annexure1.ExchangeRatePerShippingBill}
              onChange={(e) =>
                setAnnexure1({ ...annexure1, ExchangeRatePerShippingBill: e.target.value })
              }
              type="number"
            />
            
            <InputField
              label="FOB Value (in Rupees)"
              value={annexure1.fobValueInRupees}
              onChange={(e) =>
                setAnnexure1({ ...annexure1, fobValueInRupees: e.target.value })
              }
              type="number"
            />


          </div>
          <div className="bg-white p-4 rounded-md">
            <div className="container text-center text-green-700 font-sans font-semibold text-xl">
              AnnexureA
            </div>
            <InputField
              label="Sr No"
              value={annexureA.srNo}
              onChange={(e) =>
                setAnnexureA({ ...annexureA, srNo: e.target.value })
              }
              type="text"
            />
            <InputField
              label="Product Exported"
              value={annexureA.productExportered}
              onChange={(e) =>
                setAnnexureA({
                  ...annexureA,
                  productExportered: e.target.value,
                })
              }
              type="text"
            />
            <InputField
              label="Shipping Bill Number"
              value={annexureA.shippingBillNumber}
              onChange={(e) =>
                setAnnexureA({
                  ...annexureA,
                  shippingBillNumber: e.target.value,
                })
              }
              type="text"
            />
            <InputField
              label="Shipping Bill Date"
              value={annexureA.shippingBillDate}
              onChange={(e) =>
                setAnnexureA({
                  ...annexureA,
                  shippingBillDate: e.target.value,
                })
              }
              type="date"
            />
            <InputField
              label="Direct Exports in Rupees"
              value={annexureA.directExportsInRupees}
              onChange={(e) =>
                setAnnexureA({
                  ...annexureA,
                  directExportsInRupees: e.target.value,
                })
              }
              type="number"
            />
            <InputField
              label="Direct Exports in Dollars"
              value={annexureA.directExportsInDollars}
              onChange={(e) =>
                setAnnexureA({
                  ...annexureA,
                  directExportsInDollars: e.target.value,
                })
              }
              type="number"
            />
            <InputField
              label="Deemed Exports"
              value={annexureA.deemedExports}
              onChange={(e) =>
                setAnnexureA({
                  ...annexureA,
                  deemedExports: e.target.value,
                })
              }
              type="number"
            />
            <InputField
              label="Third Party Exports in Rupees"
              value={annexureA.thirdPartyExportsInRupees}
              onChange={(e) =>
                setAnnexureA({
                  ...annexureA,
                  thirdPartyExportsInRupees: e.target.value,
                })
              }
              type="number"
            />
            <InputField
              label="Third Party Exports in Dollars"
              value={annexureA.thirdPartyExportsInDollars}
              onChange={(e) =>
                setAnnexureA({
                  ...annexureA,
                  thirdPartyExportsInDollars: e.target.value,
                })
              }
              type="number"
            />
            <InputField
              label="By Group Company"
              value={annexureA.byGroupCompany}
              onChange={(e) =>
                setAnnexureA({
                  ...annexureA,
                  byGroupCompany: e.target.value,
                })
              }
              type="number"
            />
            <InputField
              label="Other RW Series"
              value={annexureA.otherRWseries}
              onChange={(e) =>
                setAnnexureA({
                  ...annexureA,
                  otherRWseries: e.target.value,
                })
              }
              type="number"
            />
            <InputField
              label="Total in Rupees"
              value={annexureA.totalInRupees}
              onChange={(e) =>
                setAnnexureA({
                  ...annexureA,
                  totalInRupees: e.target.value,
                })
              }
              type="number"
            />
            <InputField
              label="Total in Dollars"
              value={annexureA.totalInDollars}
              onChange={(e) =>
                setAnnexureA({
                  ...annexureA,
                  totalInDollars: e.target.value,
                })
              }
              type="number"
            />

            <NewDataButtons
              backLink={""}
              nextLink={""}
              handleSubmit={handleSubmit}
            />
          </div>
        </div>
     
      </div>
    </div>
  );
};

export default ShippingBillPage;