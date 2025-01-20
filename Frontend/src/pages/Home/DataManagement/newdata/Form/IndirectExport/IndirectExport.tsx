import React, { useEffect, useMemo, useState } from "react";
import Loading from "../../../../../components/Loading";
import InputField, { SelectInputField } from "../../../../../components/InputField";
import NewDataButtons from "../../NewDataButtons";
import { useCookies } from "react-cookie";
import axios from "axios";
import { BACKEND_URL } from "../../../../../../Globle";
import { useRecoilValue } from "recoil";
import { authAtom } from "../../../../../../atoms/authAtom";

const IndirectExport = () => {
  const [usdPrice, setUsdPrice] = useState("USD Price: -cant able to fetch-");
  const { user } = useRecoilValue(authAtom);
  const [basicSheet, setBasicSheet] = useState(() => {
    const saved = localStorage.getItem("indirectexport_basicSheet");
    return saved ? JSON.parse(saved) : {
      companyName: "",
      srNo: "0",
      shippingBillNo: "0",
      shippingBillDate: "",
      thirdPartyExporter: "",
      hsCodeAndDescription: "",
      epcgLicNo: "",
      cifValue: "0",
      freight: "0",
      insurance: "0",
      brc: "0",
      exchangeRate: "0.0000",
      cifValue2: "0",
      freight2: "0",
      insurance2: "0",
      brc2: "0",
      exchangeRate2: "0.0000",
      invoiceNo: "",
      invoiceDate: "",
      basicAmount: "",
      invoiceValue: "",
      bankPaymentReceivedDate: "",
      amountReceived: "",
      amountRealised: "",
      qtyAsPerInvoiceAndSbMatch: "",
      epcgLicNoInTaxInvoice: "",
      lorryReceiptOrEwayBill: "",
      bankStatement: "",
      product: "",
      remarks: "",
    };
  });

  const [annexure1, setAnnexure1] = useState(() => {
    const saved = localStorage.getItem("indirectexport_annexure1");
    return saved ? JSON.parse(saved) : {
      srNo: "",
      shippingBillNo: "",
      shippingBillDate: "",
      shippingBillCifValue: "",
      brcValue: "",
      lowerOfSbAndBrc: "",
      shippingBillFreight: "",
      shippingBillInsurance: "",
      fobValueInDollars: "",
      exchangeRatePerShippingBill: "",
      fobValueInRupees: "",
    };
  });

  const [annexure2, setAnnexure2] = useState(() => {
    const saved = localStorage.getItem("indirectexport_annexure2");
    return saved ? JSON.parse(saved) : {
      srNo: "",
      shippingBillNo: "",
      shippingBillDate: "",
      taxInvoiceBillNo: "",
      taxInvoiceDate: "",
      taxInvoiceBasicAmount: "",
      taxInvoiceTax: "",
      taxInvoiceInvoiceValue: "",
      paymentDetailsDate: "",
      paymentDetailsAmountReceived: "",
      paymentDetailsAmountRealised: "",
      lowerOfInvoiceAndBankStatement: "",
      proportionateAmountOf6ForInRs: "",
      exchangeRatePerShippingBill: "",
      forInUsd: "",
    };
  });

  const [calculationSheet, setCalculationSheet] = useState(() => {
    const saved = localStorage.getItem("indirectexport_calculationSheet");
    return saved ? JSON.parse(saved) : {
      srNo: "",
      sameProductOrService: "",
      shippingBillNo: "",
      shippingBillDate: "",
      fobValueRealizationProceedsRs: "",
      fobValueRealizationProceedsUs: "",
      fobValueAnnexure1Rs: "",
      fobValueAnnexure1Us: "",
      fobValueAnnexure2Rs: "",
      fobValueAnnexure2Us: "",
      fobValueLowerOf5_6_7Rs: "",
      fobValueLowerOf5_6_7Us: "",
    };
  });

  const [newDeptSheet, setNewDeptSheet] = useState(() => {
    const saved = localStorage.getItem("indirectexport_newDeptSheet");
    return saved ? JSON.parse(saved) : {
      srNo: "",
      shippingBillNo: "",
      shippingBillDate: "",
      invoiceNo: "",
      invoiceDate: "",
      amountRealisedAsPerBrcUs: "",
      amountRealisedAsPerBrcExchRate: "",
      amountRealisedAsPerBrcRs: "",
      amountRealisedInBankRs: "",
      amountLessOfCol6And7Rs: "",
      convertedIntoUsd: "",
    };
  });

  const [annexureA, setAnnexureA] = useState(() => {
    const saved = localStorage.getItem("indirectexport_annexureA");
    return saved ? JSON.parse(saved) : {
      srNo: "",
      sameProductOrService: "",
      shippingBillNo: "",
      shippingBillDate: "",
      directExportsRs: "",
      directExportsUs: "",
      deemedExports: "0.00",
      thirdPartyExportsRs: "0.00",
      thirdPartyExportsUs: "0.00",
      byGroupCompany: "0.00",
      otherRnDServicesOrRoyalty: "0.00",
      totalRs: "",
      totalUs: "",
    };
  });

  useEffect(() => {
    localStorage.setItem("indirectexport_basicSheet", JSON.stringify(basicSheet));
  }, [basicSheet]);

  useEffect(() => {
    localStorage.setItem("indirectexport_annexure1", JSON.stringify(annexure1));
  }, [annexure1]);

  useEffect(() => {
    localStorage.setItem("indirectexport_annexure2", JSON.stringify(annexure2));
  }, [annexure2]);

  useEffect(() => {
    localStorage.setItem("indirectexport_calculationSheet", JSON.stringify(calculationSheet));
  }, [calculationSheet]);

  useEffect(() => {
    localStorage.setItem("indirectexport_newDeptSheet", JSON.stringify(newDeptSheet));
  }, [newDeptSheet]);

  useEffect(() => {
    localStorage.setItem("indirectexport_annexureA", JSON.stringify(annexureA));
  }, [annexureA]);

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
  const handleSubmit = async () => {
    setLoading(true);
    const jsonData = {
      basicSheet,
      annexure1,
      annexureA,
      annexure2,
      calculationSheet,
      newDeptSheet,
      addedByUserId: user.id
    };
    console.log(jsonData);



    const res = await axios.post(
      `${BACKEND_URL}/forms/indirectexport/alldata`,
      jsonData,
      {
        headers: {
          Authorization: cookies.token,
        },
      }
    );
    alert(res.data.message);
    if (res.status === 200) {

      setBasicSheet({
        companyName: "",
        srNo: "0",
        shippingBillNo: "0",
        shippingBillDate: "",
        thirdPartyExporter: "",
        hsCodeAndDescription: "",
        epcgLicNo: "",
        cifValue: "0",
        freight: "0",
        insurance: "0",
        brc: "0",
        exchangeRate: "0.0000",
        cifValue2: "0",
        freight2: "0",
        insurance2: "0",
        brc2: "0",
        exchangeRate2: "0.0000",
        invoiceNo: "",
        invoiceDate: "",
        basicAmount: "",
        invoiceValue: "",
        bankPaymentReceivedDate: "",
        amountReceived: "",
        amountRealised: "",
        qtyAsPerInvoiceAndSbMatch: "",
        epcgLicNoInTaxInvoice: "",
        lorryReceiptOrEwayBill: "",
        bankStatement: "",
        product: "",
        remarks: "",
      });

      setAnnexure1({
        srNo: "",
        shippingBillNo: "",
        shippingBillDate: "",
        shippingBillCifValue: "",
        brcValue: "",
        lowerOfSbAndBrc: "",
        shippingBillFreight: "",
        shippingBillInsurance: "",
        fobValueInDollars: "",
        exchangeRatePerShippingBill: "",
        fobValueInRupees: "",
      });

      setAnnexure2({
        srNo: "",
        shippingBillNo: "",
        shippingBillDate: "",
        taxInvoiceBillNo: "",
        taxInvoiceDate: "",
        taxInvoiceBasicAmount: "",
        taxInvoiceTax: "",
        taxInvoiceInvoiceValue: "",
        paymentDetailsDate: "",
        paymentDetailsAmountReceived: "",
        paymentDetailsAmountRealised: "",
        lowerOfInvoiceAndBankStatement: "",
        proportionateAmountOf6ForInRs: "",
        exchangeRatePerShippingBill: "",
        forInUsd: "",
      });

      setCalculationSheet({
        srNo: "",
        sameProductOrAlternativeProductService: "",
        shippingBillNo: "",
        shippingBillDate: "",
        fobValueRealizationProceedsRs: "",
        fobValueRealizationProceedsUs: "",
        fobValueAnnexure1Rs: "",
        fobValueAnnexure1Us: "",
        fobValueAnnexure2Rs: "",
        fobValueAnnexure2Us: "",
        fobValueLowerOf5_6_7Rs: "",
        fobValueLowerOf5_6_7Us: "",
      });

      setNewDeptSheet({
        srNo: "",
        shippingBillNo: "",
        shippingBillDate: "",
        invoiceNo: "",
        invoiceDate: "",
        amountRealisedAsPerBrcUs: "",
        amountRealisedAsPerBrcExchRate: "",
        amountRealisedAsPerBrcRs: "",
        amountRealisedInBankRs: "",
        amountLessOfCol6And7Rs: "",
        convertedIntoUsd: "",
      });

      setAnnexureA({
        srNo: "",
        sameProductOrService: "",
        shippingBillNo: "",
        shippingBillDate: "",
        directExportsRs: "",
        directExportsUs: "",
        deemedExports: "0.00",
        thirdPartyExportsRs: "0.00",
        thirdPartyExportsUs: "0.00",
        byGroupCompany: "0.00",
        otherRnDServicesOrRoyalty: "0.00",
        totalRs: "",
        totalUs: "",
      });

      // remove all state from local storage
      localStorage.removeItem("indirectexport_basicSheet");
      localStorage.removeItem("indirectexport_annexure1");
      localStorage.removeItem("indirectexport_annexure2");
      localStorage.removeItem("indirectexport_calculationSheet");
      localStorage.removeItem("indirectexport_newDeptSheet");
      localStorage.removeItem("indirectexport_annexureA");
    }
    setLoading(false);
  };

  // const getSummary = async () => {
  //   setLoading(true);
  //   const res = await axios.get(
  //     `${BACKEND_URL}/directexport/summary`,
  //     {
  //       headers: {
  //         Authorization: cookies.token,
  //       },
  //     }
  //   );
  //   if (res.status !== 200) {
  //     alert("Error in fetching data");
  //     setLoading(false);
  //     return;
  //   }
  //   console.log(res.data);

  //   setBlockwiseSummary(res.data.summary);
  //   setLoading(false);
  // }



  useMemo(() => {
    

    const cifValue2 =
      Number(basicSheet.cifValue) *
      Number(basicSheet.exchangeRate);
    const brcValue =
      Number(basicSheet.brc) * Number(basicSheet.exchangeRate);
    const lowerOfSbAndBrc = Math.min(Number(basicSheet.cifValue2), Number(basicSheet.brc2)).toString();
    const shippingBillFreight =
      Number(basicSheet.freight) *
      Number(basicSheet.exchangeRate);
    const shippingBillInsurance =
      Number(basicSheet.insurance) *
      Number(basicSheet.exchangeRate);
    const fobValueInDoller = (
      Number(lowerOfSbAndBrc) -
      (shippingBillFreight + shippingBillInsurance)
    ).toString();
    const fobValueInRupees = (
      Number(fobValueInDoller) * Number(basicSheet.exchangeRate2)
    ).toString();

    console.log("Fob Value in Rupees", fobValueInRupees);
    console.log("Fob Value in Dollar", fobValueInDoller);
    
    
    const updatedBasicSheet = {
      cifValue2: cifValue2.toString(),
      freight2: Number(basicSheet.freight) *  Number(basicSheet.exchangeRate),
      insurance2: Number(basicSheet.insurance) *  Number(basicSheet.exchangeRate),
      brc2: brcValue.toString(),
    }


    const updatedAnnexure1 = {
      srNo: basicSheet.srNo,
      shippingBillNo: basicSheet.shippingBillNo,
      shippingBillDate: basicSheet.shippingBillDate,
      shippingBillCifValue: basicSheet.cifValue2,
      brcValue: basicSheet.brc2,
      lowerOfSbAndBrc: lowerOfSbAndBrc,
      shippingBillFreight: basicSheet.freight2,
      shippingBillInsurance: basicSheet.insurance2,
      fobValueInDollars: fobValueInDoller,
      exchangeRatePerShippingBill: basicSheet.exchangeRate2,
      fobValueInRupees: fobValueInRupees,
    };



    const taxInvoiceTax = Number(basicSheet.invoiceValue) - Number(basicSheet.basicAmount);
    const lowerOfInvoiceAndBankStatement = (Math.min( Number(basicSheet.invoiceValue), Number(basicSheet.amountRealised))).toString();
    const proportionateAmountOf6ForInRs = ((Number(lowerOfInvoiceAndBankStatement) * Number(basicSheet.basicAmount)) / Number(basicSheet.invoiceValue)).toString();

    const updatedAnnexure2 = {
      srNo: basicSheet.srNo,
      shippingBillNo: basicSheet.shippingBillNo,
      shippingBillDate: basicSheet.shippingBillDate,
      taxInvoiceBillNo: basicSheet.invoiceNo,
      taxInvoiceDate: basicSheet.invoiceDate,
      taxInvoiceBasicAmount: basicSheet.basicAmount,
      taxInvoiceTax: taxInvoiceTax,
      taxInvoiceInvoiceValue: basicSheet.invoiceValue,
      paymentDetailsDate: basicSheet.bankPaymentReceivedDate,
      paymentDetailsAmountReceived: basicSheet.amountReceived,
      paymentDetailsAmountRealised: basicSheet.amountRealised,
      lowerOfInvoiceAndBankStatement: lowerOfInvoiceAndBankStatement,
      proportionateAmountOf6ForInRs: proportionateAmountOf6ForInRs,
      exchangeRatePerShippingBill: basicSheet.exchangeRate2,
      forInUsd: (Number(proportionateAmountOf6ForInRs) / Number(basicSheet.exchangeRate2)).toString(),
    }



    const updatedCalculationSheet = {
      srNo: basicSheet.srNo,
      sameProductOrService: basicSheet.product,
      shippingBillNo: basicSheet.shippingBillNo,
      shippingBillDate: basicSheet.shippingBillDate,
      fobValueRealizationProceedsRs: newDeptSheet.amountLessOfCol6And7Rs,
      fobValueRealizationProceedsUs: newDeptSheet.convertedIntoUsd,
      fobValueAnnexure1Rs: fobValueInRupees,
      fobValueAnnexure1Us: fobValueInDoller,
      fobValueAnnexure2Rs: proportionateAmountOf6ForInRs,
      fobValueAnnexure2Us: (Number(proportionateAmountOf6ForInRs) / Number(basicSheet.exchangeRate2)).toString(),
      fobValueLowerOf5_6_7Rs: Math.min(Number(newDeptSheet.amountLessOfCol6And7Rs), Number(fobValueInRupees), Number(proportionateAmountOf6ForInRs)),
      fobValueLowerOf5_6_7Us: Math.min(Number(newDeptSheet.convertedIntoUsd), Number(fobValueInDoller), (Number(proportionateAmountOf6ForInRs) / Number(basicSheet.exchangeRate))),
    }

    const amountLessOfCol6And7Rs = Math.min((Number(basicSheet.brc2) * Number(basicSheet.exchangeRate2)), Number(basicSheet.amountRealised));

    const updatedNewDeptSheet = {
      srNo: basicSheet.srNo,
      shippingBillNo: basicSheet.shippingBillNo,
      shippingBillDate: basicSheet.shippingBillDate,
      invoiceNo: basicSheet.invoiceNo,
      invoiceDate: basicSheet.invoiceDate,
      amountRealisedAsPerBrcUs: basicSheet.brc2,
      amountRealisedAsPerBrcExchRate: (Number(basicSheet.exchangeRate2)).toString(),
      amountRealisedAsPerBrcRs: (Number(basicSheet.brc2) * Number(basicSheet.exchangeRate2)).toString(),
      amountRealisedInBankRs: basicSheet.amountRealised,
      amountLessOfCol6And7Rs: (amountLessOfCol6And7Rs).toString(),
      convertedIntoUsd: (amountLessOfCol6And7Rs / Number(basicSheet.exchangeRate2)).toString(),
    }

    const updatedAnnexureA = {
      srNo: basicSheet.srNo,
      sameProductOrService: basicSheet.product,
      shippingBillNo: basicSheet.shippingBillNo,
      shippingBillDate: basicSheet.shippingBillDate,
      directExportsRs: updatedCalculationSheet.fobValueLowerOf5_6_7Rs,
      directExportsUs: updatedCalculationSheet.fobValueLowerOf5_6_7Us,
      thirdPartyExportsRs: updatedCalculationSheet.fobValueLowerOf5_6_7Rs,
      thirdPartyExportsUs: updatedCalculationSheet.fobValueLowerOf5_6_7Us,
      totalRs: (updatedCalculationSheet.fobValueLowerOf5_6_7Rs),
      totalUs: updatedCalculationSheet.fobValueLowerOf5_6_7Us,
    };




    setBasicSheet((prevSheet) => ({
      ...prevSheet,
      ...updatedBasicSheet,
    }));

    setAnnexure1((prevAnnexure) => ({
      ...prevAnnexure,
      ...updatedAnnexure1,
    }));

    setAnnexure2((prevAnnexure2) => ({
      ...prevAnnexure2,
      ...updatedAnnexure2,
    }));

    setCalculationSheet((prevCalculationSheet) => ({
      ...prevCalculationSheet,
      ...updatedCalculationSheet,
    }));

    setNewDeptSheet((prevNewDeptSheet) => ({
      ...prevNewDeptSheet,
      ...updatedNewDeptSheet,
    }));

    setAnnexureA((prevAnnexureA) => ({
      ...prevAnnexureA,
      ...updatedAnnexureA,
    }));


  }, [
    basicSheet.cifValue,
    basicSheet.exchangeRate,
    basicSheet.brc,
    basicSheet.cifValue,
    basicSheet.cifValue2,
    basicSheet.brc2,
    basicSheet.freight,
    basicSheet.insurance,
    basicSheet.invoiceValue,
    basicSheet.basicAmount,
    basicSheet.amountRealised,
    basicSheet.amountReceived,
    basicSheet.bankPaymentReceivedDate,
    basicSheet.invoiceDate,
    basicSheet.invoiceNo,
    basicSheet.product,
    basicSheet.remarks,
    basicSheet.srNo,
    basicSheet.shippingBillDate,
    basicSheet.shippingBillNo,
    basicSheet.exchangeRate2,
    newDeptSheet.amountLessOfCol6And7Rs,
    newDeptSheet.convertedIntoUsd,
    newDeptSheet.amountRealisedInBankRs,
    newDeptSheet.amountRealisedAsPerBrcExchRate,
    newDeptSheet.amountRealisedAsPerBrcRs,
    newDeptSheet.amountRealisedAsPerBrcUs,
    newDeptSheet.invoiceDate,
    newDeptSheet.invoiceNo,
    newDeptSheet.shippingBillDate,
    newDeptSheet.shippingBillNo,
    calculationSheet.fobValueAnnexure1Rs,
    calculationSheet.fobValueAnnexure1Us,
    calculationSheet.fobValueAnnexure2Rs,
    calculationSheet.fobValueAnnexure2Us,
    calculationSheet.fobValueLowerOf5_6_7Rs,
    calculationSheet.fobValueLowerOf5_6_7Us,
    calculationSheet.fobValueRealizationProceedsRs,
    calculationSheet.fobValueRealizationProceedsUs,
    calculationSheet.sameProductOrService,
    calculationSheet.shippingBillDate,
    calculationSheet.shippingBillNo,
    annexure1.brcValue,
    annexure1.exchangeRatePerShippingBill,
    annexure1.fobValueInDollars,
    annexure1.fobValueInRupees,
    annexure1.lowerOfSbAndBrc,
    annexure1.shippingBillCifValue,
    annexure1.shippingBillDate,
    annexure1.shippingBillFreight,
    annexure1.shippingBillInsurance,
    annexure1.shippingBillNo,
    annexure1.srNo,
    annexure2.exchangeRatePerShippingBill,
    annexure2.forInUsd,
    annexure2.lowerOfInvoiceAndBankStatement,
    annexure2.paymentDetailsAmountReceived,
    annexure2.paymentDetailsAmountRealised,
    annexure2.paymentDetailsDate,
    annexure2.proportionateAmountOf6ForInRs,
    annexure2.srNo,
    annexure2.taxInvoiceBasicAmount,
    

    
  ]);


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

        <div className="container text-center text-green-700 font-sans font-semibold text-[24px]">
          Indirect Export
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
                setBasicSheet({ ...basicSheet, shippingBillDate: e.target.value })
              }
              type="date"
            />
            <InputField
              label="Third Party Exporter"
              value={basicSheet.thirdPartyExporter}
              onChange={(e) =>
                setBasicSheet({
                  ...basicSheet,
                  thirdPartyExporter: e.target.value,
                })
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
              label="Exchange Rate"
              value={basicSheet.exchangeRate}
              onChange={(e) =>
                setBasicSheet({ ...basicSheet, exchangeRate: e.target.value })
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
              label="Exchange Rate 2"
              value={basicSheet.exchangeRate2}
              onChange={(e) =>
                setBasicSheet({ ...basicSheet, exchangeRate2: e.target.value })
              }
              type="number"
            />
            <InputField
              label="Invoice No"
              value={basicSheet.invoiceNo}
              onChange={(e) =>
                setBasicSheet({ ...basicSheet, invoiceNo: e.target.value })
              }
              type="text"
            />
            <InputField
              label="Invoice Date"
              value={basicSheet.invoiceDate}
              onChange={(e) =>
                setBasicSheet({ ...basicSheet, invoiceDate: e.target.value })
              }
              type="date"
            />
            <InputField
              label="Basic Amount"
              value={basicSheet.basicAmount}
              onChange={(e) =>
                setBasicSheet({ ...basicSheet, basicAmount: e.target.value })
              }
              type="number"
            />
            <InputField
              label="Invoice Value"
              value={basicSheet.invoiceValue}
              onChange={(e) =>
                setBasicSheet({ ...basicSheet, invoiceValue: e.target.value })
              }
              type="number"
            />
            <InputField
              label="Bank Payment Received Date"
              value={basicSheet.bankPaymentReceivedDate}
              onChange={(e) =>
                setBasicSheet({
                  ...basicSheet,
                  bankPaymentReceivedDate: e.target.value,
                })
              }
              type="date"
            />
            <InputField
              label="Amount Received"
              value={basicSheet.amountReceived}
              onChange={(e) =>
                setBasicSheet({ ...basicSheet, amountReceived: e.target.value })
              }
              type="number"
            />
            <InputField
              label="Amount Realised"
              value={basicSheet.amountRealised}
              onChange={(e) =>
                setBasicSheet({ ...basicSheet, amountRealised: e.target.value })
              }
              type="number"
            />
            <InputField
              label="Qty as per Invoice and SB Match"
              value={basicSheet.qtyAsPerInvoiceAndSbMatch}
              onChange={(e) =>
                setBasicSheet({
                  ...basicSheet,
                  qtyAsPerInvoiceAndSbMatch: e.target.value,
                })
              }
              type="select"
              options={["N", "Y"]}
            />
            <InputField
              label="EPCG Lic No in Tax Invoice"
              value={basicSheet.epcgLicNoInTaxInvoice}
              onChange={(e) =>
                setBasicSheet({
                  ...basicSheet,
                  epcgLicNoInTaxInvoice: e.target.value,
                })
              }
              type="select"
              options={["N", "Y"]}
            />
            <InputField
              label="Lorry Receipt or Eway Bill"
              value={basicSheet.lorryReceiptOrEwayBill}
              onChange={(e) =>
                setBasicSheet({
                  ...basicSheet,
                  lorryReceiptOrEwayBill: e.target.value,
                })
              }
              type="select"
              options={["N", "Y"]}
            />
            <InputField
              label="Bank Statement"
              value={basicSheet.bankStatement}
              onChange={(e) =>
                setBasicSheet({ ...basicSheet, bankStatement: e.target.value })
              }
              type="select"
              options={["N", "Y"]}
            />
            <InputField
              label="Product"
              value={basicSheet.product}
              onChange={(e) =>
                setBasicSheet({ ...basicSheet, product: e.target.value })
              }
              type="text"
            />
            <InputField
              label="Remarks"
              value={basicSheet.remarks}
              onChange={(e) =>
                setBasicSheet({ ...basicSheet, remarks: e.target.value })
              }
              type="text"
            />

          </div>
          <div className="bg-white p-4 rounded-md">
            <div className="container text-center text-green-700 font-sans font-semibold text-xl">
              Annexure1
            </div>
            <InputField
              label="Sr No"
              value={annexure1.srNo}
              onChange={(e) =>
                setAnnexure1({ ...annexure1, srNo: e.target.value })
              }
              type="text"
            />
            <InputField
              label="Shipping Bill No"
              value={annexure1.shippingBillNo}
              onChange={(e) =>
                setAnnexure1({ ...annexure1, shippingBillNo: e.target.value })
              }
              type="text"
            />
            <InputField
              label="Shipping Bill Date"
              value={annexure1.shippingBillDate}
              onChange={(e) =>
                setAnnexure1({ ...annexure1, shippingBillDate: e.target.value })
              }
              type="date"

            />
            <InputField
              label="Shipping Bill CIF Value"
              value={annexure1.shippingBillCifValue}
              onChange={(e) =>
                setAnnexure1({
                  ...annexure1,
                  shippingBillCifValue: e.target.value,
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
                setAnnexure1({
                  ...annexure1,
                  lowerOfSbAndBrc: e.target.value,
                })
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
              label="FOB Value in Dollars"
              value={annexure1.fobValueInDollars}
              onChange={(e) =>
                setAnnexure1({
                  ...annexure1,
                  fobValueInDollars: e.target.value,
                })
              }
              type="number"
            />
            <InputField
              label="Exchange Rate per Shipping Bill"
              value={annexure1.exchangeRatePerShippingBill}
              onChange={(e) =>
                setAnnexure1({
                  ...annexure1,
                  exchangeRatePerShippingBill: e.target.value,
                })
              }
              type="number"
            />
            <InputField
              label="FOB Value in Rupees"
              value={annexure1.fobValueInRupees}
              onChange={(e) =>
                setAnnexure1({
                  ...annexure1,
                  fobValueInRupees: e.target.value,
                })
              }
              type="number"
            />
          </div>
          <div className="bg-white p-4 rounded-md">
            <div className="container text-center text-green-700 font-sans font-semibold text-xl">
              Annexure2
            </div>
            <InputField
              label="Sr No"
              value={annexure2.srNo}
              onChange={(e) =>
                setAnnexure2({ ...annexure2, srNo: e.target.value })
              }
              type="text"
            />
            <InputField
              label="Shipping Bill No"
              value={annexure2.shippingBillNo}
              onChange={(e) =>
                setAnnexure2({ ...annexure2, shippingBillNo: e.target.value })
              }
              type="text"
            />
            <InputField
              label="Shipping Bill Date"
              value={annexure2.shippingBillDate}
              onChange={(e) =>
                setAnnexure2({ ...annexure2, shippingBillDate: e.target.value })
              }
              type="date"
            />
            <InputField
              label="Tax Invoice Bill No"
              value={annexure2.taxInvoiceBillNo}
              onChange={(e) =>
                setAnnexure2({ ...annexure2, taxInvoiceBillNo: e.target.value })
              }
              type="text"
            />
            <InputField
              label="Tax Invoice Date"
              value={annexure2.taxInvoiceDate}
              onChange={(e) =>
                setAnnexure2({ ...annexure2, taxInvoiceDate: e.target.value })
              }
              type="date"
            />
            <InputField
              label="Tax Invoice Basic Amount"
              value={annexure2.taxInvoiceBasicAmount}
              onChange={(e) =>
                setAnnexure2({
                  ...annexure2,
                  taxInvoiceBasicAmount: e.target.value,
                })
              }
              type="number"
            />
            <InputField
              label="Tax Invoice Tax"
              value={annexure2.taxInvoiceTax}
              onChange={(e) =>
                setAnnexure2({ ...annexure2, taxInvoiceTax: e.target.value })
              }
              type="number"
            />
            <InputField
              label="Tax Invoice Invoice Value"
              value={annexure2.taxInvoiceInvoiceValue}
              onChange={(e) =>
                setAnnexure2({
                  ...annexure2,
                  taxInvoiceInvoiceValue: e.target.value,
                })
              }
              type="number"
            />
            <InputField
              label="Payment Details Date"
              value={annexure2.paymentDetailsDate}
              onChange={(e) =>
                setAnnexure2({
                  ...annexure2,
                  paymentDetailsDate: e.target.value,
                })
              }
              type="date"
            />
            <InputField
              label="Payment Details Amount Received"
              value={annexure2.paymentDetailsAmountReceived}
              onChange={(e) =>
                setAnnexure2({
                  ...annexure2,
                  paymentDetailsAmountReceived: e.target.value,
                })
              }
              type="number"
            />
            <InputField
              label="Payment Details Amount Realised"
              value={annexure2.paymentDetailsAmountRealised}
              onChange={(e) =>
                setAnnexure2({
                  ...annexure2,
                  paymentDetailsAmountRealised: e.target.value,
                })
              }
              type="number"
            />
            <InputField
              label="Lower of Invoice and Bank Statement"
              value={annexure2.lowerOfInvoiceAndBankStatement}
              onChange={(e) =>
                setAnnexure2({
                  ...annexure2,
                  lowerOfInvoiceAndBankStatement: e.target.value,
                })
              }
              type="number"
            />
            <InputField
              label="Proportionate Amount of 6 for in Rs"
              value={annexure2.proportionateAmountOf6ForInRs}
              onChange={(e) =>
                setAnnexure2({
                  ...annexure2,
                  proportionateAmountOf6ForInRs: e.target.value,
                })
              }
              type="number"
            />
            <InputField
              label="Exchange Rate per Shipping Bill"
              value={annexure2.exchangeRatePerShippingBill}
              onChange={(e) =>
                setAnnexure2({
                  ...annexure2,
                  exchangeRatePerShippingBill: e.target.value,
                })
              }
              type="number"
            />
            <InputField
              label="For in USD"
              value={annexure2.forInUsd}
              onChange={(e) =>
                setAnnexure2({ ...annexure2, forInUsd: e.target.value })
              }
              type="number"
            />



          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 mt-2 gap-4">
          <div className="bg-white p-4 rounded-md">
            <div className="container text-center text-green-700 font-sans font-semibold text-xl">
              calculationSheet
            </div>
            <InputField
              label="Sr No"
              value={calculationSheet.srNo}
              onChange={(e) =>
                setCalculationSheet({ ...calculationSheet, srNo: e.target.value })
              }
              type="text"
            />
            <InputField
              label="Same Product / Alternative Product / Services"
              value={calculationSheet.sameProductOrAlternativeProductService}
              onChange={(e) =>
                setCalculationSheet({ ...calculationSheet, sameProductOrAlternativeProductService: e.target.value })
              }
              type="text"
            />
           
            <InputField
              label="Shipping Bill No"
              value={calculationSheet.shippingBillNo}
              onChange={(e) =>
                setCalculationSheet({ ...calculationSheet, shippingBillNo: e.target.value })
              }
              type="text"
            />
            <InputField
              label="Shipping Bill Date"
              value={calculationSheet.shippingBillDate}
              onChange={(e) =>
                setCalculationSheet({ ...calculationSheet, shippingBillDate: e.target.value })
              }
              type="date"
            />
            <InputField
              label="FOB Value Realization Proceeds Rs"
              value={calculationSheet.fobValueRealizationProceedsRs}
              onChange={(e) =>
                setCalculationSheet({ ...calculationSheet, fobValueRealizationProceedsRs: e.target.value })
              }
              type="number"
            />
            <InputField
              label="FOB Value Realization Proceeds Us"
              value={calculationSheet.fobValueRealizationProceedsUs}
              onChange={(e) =>
                setCalculationSheet({ ...calculationSheet, fobValueRealizationProceedsUs: e.target.value })
              }
              type="number"
            />

            <InputField
              label="FOB Value Annexure1 Rs"
              value={calculationSheet.fobValueAnnexure1Rs}
              onChange={(e) =>
                setCalculationSheet({ ...calculationSheet, fobValueAnnexure1Rs: e.target.value })
              }
              type="number"
            />
            <InputField
              label="FOB Value Annexure1 Us"
              value={calculationSheet.fobValueAnnexure1Us}
              onChange={(e) =>
                setCalculationSheet({ ...calculationSheet, fobValueAnnexure1Us: e.target.value })
              }
              type="number"
            />
            <InputField
              label="FOB Value Annexure2 Rs"
              value={calculationSheet.fobValueAnnexure2Rs}
              onChange={(e) =>
                setCalculationSheet({ ...calculationSheet, fobValueAnnexure2Rs: e.target.value })
              }
              type="number"
            />
            <InputField
              label="FOB Value Annexure2 Us"
              value={calculationSheet.fobValueAnnexure2Us}
              onChange={(e) =>
                setCalculationSheet({ ...calculationSheet, fobValueAnnexure2Us: e.target.value })
              }
              type="number"
            />
            <InputField
              label="FOB Value Lower of 5 6 7 Rs"
              value={calculationSheet.fobValueLowerOf5_6_7Rs}
              onChange={(e) =>
                setCalculationSheet({ ...calculationSheet, fobValueLowerOf5_6_7Rs: e.target.value })
              }
              type="number"
            />
            <InputField
              label="FOB Value Lower of 5 6 7 Us"
              value={calculationSheet.fobValueLowerOf5_6_7Us}
              onChange={(e) =>
                setCalculationSheet({ ...calculationSheet, fobValueLowerOf5_6_7Us: e.target.value })
              }
              type="number"
            />

          </div>
          <div className="bg-white p-4 rounded-md">
            <div className="container text-center text-green-700 font-sans font-semibold text-xl">
              newDeptSheet
            </div>
            <InputField
              label="Sr No"
              value={newDeptSheet.srNo}
              onChange={(e) =>
                setNewDeptSheet({ ...newDeptSheet, srNo: e.target.value })
              }
              type="text"
            />
            <InputField
              label="Shipping Bill No"
              value={newDeptSheet.shippingBillNo}
              onChange={(e) =>
                setNewDeptSheet({ ...newDeptSheet, shippingBillNo: e.target.value })
              }
              type="text"
            />
            <InputField
              label="Shipping Bill Date"
              value={newDeptSheet.shippingBillDate}
              onChange={(e) =>
                setNewDeptSheet({ ...newDeptSheet, shippingBillDate: e.target.value })
              }
              type="date"
            />
            <InputField
              label="Invoice No"
              value={newDeptSheet.invoiceNo}
              onChange={(e) =>
                setNewDeptSheet({ ...newDeptSheet, invoiceNo: e.target.value })
              }
              type="text"
            />
            <InputField
              label="Invoice Date"
              value={newDeptSheet.invoiceDate}
              onChange={(e) =>
                setNewDeptSheet({ ...newDeptSheet, invoiceDate: e.target.value })
              }
              type="date"
            />
            <InputField
              label="Amount Realised as per BRC Us"
              value={newDeptSheet.amountRealisedAsPerBrcUs}
              onChange={(e) =>
                setNewDeptSheet({ ...newDeptSheet, amountRealisedAsPerBrcUs: e.target.value })
              }
              type="number"
            />
            <InputField
              label="Amount Realised as per BRC Exch Rate"
              value={newDeptSheet.amountRealisedAsPerBrcExchRate}
              onChange={(e) =>
                setNewDeptSheet({ ...newDeptSheet, amountRealisedAsPerBrcExchRate: e.target.value })
              }
              type="number"

            />
            <InputField
              label="Amount Realised as per BRC Rs"
              value={newDeptSheet.amountRealisedAsPerBrcRs}
              onChange={(e) =>
                setNewDeptSheet({ ...newDeptSheet, amountRealisedAsPerBrcRs: e.target.value })
              }
              type="number"
            />
            <InputField
              label="Amount Realised in Bank Rs"
              value={newDeptSheet.amountRealisedInBankRs}
              onChange={(e) =>
                setNewDeptSheet({ ...newDeptSheet, amountRealisedInBankRs: e.target.value })
              }
              type="number"
            />
            <InputField
              label="Amount Less of Col 6 and 7 Rs"
              value={newDeptSheet.amountLessOfCol6And7Rs}
              onChange={(e) =>
                setNewDeptSheet({ ...newDeptSheet, amountLessOfCol6And7Rs: e.target.value })
              }
              type="number"
            />
            <InputField
              label="Converted into USD"
              value={newDeptSheet.convertedIntoUsd}
              onChange={(e) =>
                setNewDeptSheet({ ...newDeptSheet, convertedIntoUsd: e.target.value })
              }
              type="number"
            />
          </div>
          <div className="bg-white p-4 rounded-md">
            <div className="container text-center text-green-700 font-sans font-semibold text-xl">
              annexureA
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
              label="Same Product or Service"
              value={annexureA.sameProductOrService}
              onChange={(e) =>
                setAnnexureA({ ...annexureA, sameProductOrService: e.target.value })
              }
              type="text"
            />
            <InputField
              label="Shipping Bill No"
              value={annexureA.shippingBillNo}
              onChange={(e) =>
                setAnnexureA({ ...annexureA, shippingBillNo: e.target.value })
              }
              type="text"
            />
            <InputField
              label="Shipping Bill Date"
              value={annexureA.shippingBillDate}
              onChange={(e) =>
                setAnnexureA({ ...annexureA, shippingBillDate: e.target.value })
              }
              type="date"
            />

            <InputField
              label="Direct Exports Rs"
              value={annexureA.directExportsRs}
              onChange={(e) =>
                setAnnexureA({ ...annexureA, directExportsRs: e.target.value })
              }
              type="number"
            />
            <InputField
              label="Direct Exports Us"
              value={annexureA.directExportsUs}
              onChange={(e) =>
                setAnnexureA({ ...annexureA, directExportsUs: e.target.value })
              }
              type="number"
            />

            <InputField
              label="Deemed Exports"
              value={annexureA.deemedExports}
              onChange={(e) =>
                setAnnexureA({ ...annexureA, deemedExports: e.target.value })
              }
              type="number"
            />
            <InputField
              label="Third Party Exports Rs"
              value={annexureA.thirdPartyExportsRs}
              onChange={(e) =>
                setAnnexureA({ ...annexureA, thirdPartyExportsRs: e.target.value })
              }
              type="number"

            />
            <InputField
              label="Third Party Exports Us"
              value={annexureA.thirdPartyExportsUs}
              onChange={(e) =>
                setAnnexureA({ ...annexureA, thirdPartyExportsUs: e.target.value })
              }
              type="number"
            />
            <InputField
              label="By Group Company"
              value={annexureA.byGroupCompany}
              onChange={(e) =>
                setAnnexureA({ ...annexureA, byGroupCompany: e.target.value })
              }
              type="number"
            />
            <InputField
              label="Other RW series"
              value={annexureA.otherRnDServicesOrRoyalty}
              onChange={(e) =>
                setAnnexureA({ ...annexureA, otherRnDServicesOrRoyalty: e.target.value })
              }
              type="number"
            />
            <InputField
              label="Total in Rs"
              value={annexureA.totalRs}
              onChange={(e) =>
                setAnnexureA({ ...annexureA, totalRs: e.target.value })
              }
              type="number"
            />
            <InputField
              label="Total in Us"
              value={annexureA.totalUs}
              onChange={(e) =>
                setAnnexureA({ ...annexureA, totalUs: e.target.value })
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
        {/* <div className="grid grid-cols-1 md:grid-cols-3 mt-2 gap-4">
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
        </div> */}
      </div>
    </div>
  );
};

export default IndirectExport;
