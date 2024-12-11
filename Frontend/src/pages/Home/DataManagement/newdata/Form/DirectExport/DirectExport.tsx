import React, { useEffect, useMemo, useState } from "react";
import Loading from "../../../../../components/Loading";
import NewDataHeaderComponent from "../../NewDataHeaderComponent";
import InputField, { SelectInputField } from "../../../../../components/InputField";
import NewDataButtons from "../../NewDataButtons";
import { useCookies } from "react-cookie";
import axios from "axios";
import { BACKEND_URL } from "../../../../../../Globle";
import { useRecoilValue } from "recoil";
import { authAtom } from "../../../../../../atoms/authAtom";

const ShippingBillPage = () => {
  const [usdPrice, setUsdPrice] = useState("USD Price: -cant able to fetch-");
  const { user } = useRecoilValue(authAtom);
  interface ExporterDetail {
    addedByUserId: string,
    customerName : string,
    firmPan : string,
    gstNo : string,
    id : string,
    iecNo : string,
    iemUdyam : string,
    industryCategory : string,
    mailId1 : string,
    mailId2 : string,
    mailId3 : string,
    mobileNumber1 : string,
    mobileNumber2 : string,
    mobileNumber3 : string,
    subIndustryCategory : string
  }

  const [exporterDetail, setExporterDetail] = useState<ExporterDetail[]>([]);
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
    const fetchExporterDetail = async () => {
      setLoading(true);
      const res = await axios.get(`${BACKEND_URL}/getdata/allexpoters`, {
        headers: {
          Authorization: cookies.token,
        },
      });
      if (res.status !== 200) {
        alert("Error in fetching data");
        setLoading(false);
        return;
      }
     
      console.log(res.data);

      setExporterDetail(res.data);
      setLoading(false);
    };
    fetchExporterDetail();
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
    // const updatedBasicSheet = {
    //   cifValue2: (
    //     Number(basicSheet.cifValue) *
    //     Number(basicSheet.exchangeRateOrProprtionRatio)
    //   ).toString(),
    //   freight2: (
    //     Number(basicSheet.freight) *
    //     Number(basicSheet.exchangeRateOrProprtionRatio)
    //   ).toString(),
    //   insurance2: (
    //     Number(basicSheet.insurance) *
    //     Number(basicSheet.exchangeRateOrProprtionRatio)
    //   ).toString(),
    //   brc2: (
    //     Number(basicSheet.brc) * Number(basicSheet.exchangeRateOrProprtionRatio)
    //   ).toString(),
    // };

    const cifValue2 =
      Number(basicSheet.cifValue) *
      Number(basicSheet.exchangeRateOrProprtionRatio);
    const brcValue =
      Number(basicSheet.brc) * Number(basicSheet.exchangeRateOrProprtionRatio);
    const lowerOfSbAndBrc = Math.min(cifValue2, brcValue).toString();
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
      brcValue: brcValue.toString(),
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
      deemedExports: "0",
      thirdPartyExportsInRupees: "0",
      thirdPartyExportsInDollars: "0",
      byGroupCompany: "0",
      otherRWseries: "0",
      totalInRupees: fobValueInRupees,
      totalInDollars: fobValueInDoller,
    };



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
    basicSheet.srNo
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
    <div className="bg-[#e6e7e9] w-full h-full min-h-screen">
      <div className="container mx-auto px-4 py-8 ">
        {loading && <Loading />}

        <NewDataHeaderComponent
          backLink={"/datamanagement"}
          nextLink={"/datamanagement/newdata/part2"}
        />

        <div className="container text-center text-green-700 font-sans font-semibold text-[24px]">
          Direct Export
        </div>

        <div>{
          usdPrice && <div className="text-center text-green-700 font-sans font-semibold text-[px]">USD Price: {usdPrice}</div>
        }</div>

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


            <SelectInputField
              label="HS Code & Description"
              value={basicSheet.hsCodeAndDescription}
              onChange={(e) =>
                setBasicSheet({
                  ...basicSheet,
                  hsCodeAndDescription: e.target.value,
                })
              }
              options={["Y", "N"]}
            />  

            <SelectInputField
              label="EPCG Lic. No."
              value={basicSheet.epcgLicNo}
              onChange={(e) =>
                setBasicSheet({ ...basicSheet, epcgLicNo: e.target.value })
              }
              options={["Y", "N"]}
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
        <div className="grid grid-cols-1 md:grid-cols-3 mt-2 gap-4">
          <div className="bg-white p-4 rounded-md">
            <div className="container text-center text-green-700 font-sans font-semibold text-xl">
              Summary
            </div>

            <InputField
              label="EO Imposed"
              value={blockwiseSummary.EOImposed}
              onChange={(e) =>
                setBlockwiseSummary({ ...blockwiseSummary, EOImposed: e.target.value })
              }

              type="number"
            />

            <InputField
              label="Direct Export"
              value={blockwiseSummary.DirectExport}
              onChange={(e) =>
                setBlockwiseSummary({ ...blockwiseSummary, DirectExport: e.target.value })
              }
              type="number"
            />
            <InputField
              label="Indirect Export"
              value={blockwiseSummary.IndirectExport}
              onChange={(e) =>
                setBlockwiseSummary({ ...blockwiseSummary, IndirectExport: e.target.value })
              }
              type="number"
            />
            <InputField
              label="Total"
              value={blockwiseSummary.Total}
              onChange={(e) =>
                setBlockwiseSummary({ ...blockwiseSummary, Total: e.target.value })
              }
              type="number"
            />
            <InputField
              label="Excess"
              value={blockwiseSummary.Excess}
              onChange={(e) =>
                setBlockwiseSummary({ ...blockwiseSummary, Excess: e.target.value })
              }
              type="number"
            />
            <InputField
              label="EO Fulfilled"
              value={blockwiseSummary.EOFulfilled}
              onChange={(e) =>
                setBlockwiseSummary({ ...blockwiseSummary, EOFulfilled: e.target.value })
              }
              type="number"
            />
            <InputField
              label="Excess EO"
              value={blockwiseSummary.ExcessEo}
              onChange={(e) =>
                setBlockwiseSummary({ ...blockwiseSummary, ExcessEo: e.target.value })
              }
              type="number"
            />
            <button
              onClick={getSummary}
              className="bg-green-500 text-white p-2 rounded-md"
            >
              Get Summary
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShippingBillPage;