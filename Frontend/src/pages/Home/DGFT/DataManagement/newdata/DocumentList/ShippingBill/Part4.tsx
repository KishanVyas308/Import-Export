import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Loading from "../../../../../../components/Loading";
import { BACKEND_URL } from "../../../../../../../Globle";
import { useCookies } from "react-cookie";
import NewDataButtons from "../../NewDataButtons";
import InputField from "../../../../../../components/InputField";
import { useRecoilValue } from "recoil";
import { authAtom } from "../../../../../../../atoms/authAtom";

const Part4 = () => {
  const [invSno, setInvSno] = useState(localStorage.getItem("part4invSno") || "");
  const [itemsn, setItemsn] = useState(localStorage.getItem("part4itemsn") || "");
  const [dbkSno, setDbkSno] = useState(localStorage.getItem("part4dbkSno") || "");
  const [qtyWt, setQtyWt] = useState(localStorage.getItem("part4qtyWt") || "");
  const [value, setValue] = useState(localStorage.getItem("part4value") || "");
  const [rate, setRate] = useState(localStorage.getItem("part4rate") || "");
  const [dbkAmt, setDbkAmt] = useState(localStorage.getItem("part4dbkAmt") || "");
  const [stalev, setStalev] = useState(localStorage.getItem("part4stalev") || "");
  const [cenlev, setCenlev] = useState(localStorage.getItem("part4cenlev") || "");
  const [rosctlAmt, setRosctlAmt] = useState(localStorage.getItem("part4rosctlAmt") || "");
  const [invSnoB, setInvSnoB] = useState(localStorage.getItem("part4invSnoB") || "");
  const [itemSnoB, setItemSnoB] = useState(localStorage.getItem("part4itemSnoB") || "");
  const [licenseNo, setLicenseNo] = useState(localStorage.getItem("part4licenseNo") || "");
  const [descnExportItem, setDescnExportItem] = useState(localStorage.getItem("part4descnExportItem") || "");
  const [expSno, setExpSno] = useState(localStorage.getItem("part4expSno") || "");
  const [expqty, setExpqty] = useState(localStorage.getItem("part4expqty") || "");
  const [uqc, setUqc] = useState(localStorage.getItem("part4uqc") || "");
  const [fobValue, setFobValue] = useState(localStorage.getItem("part4fobValue") || "");
  const [sion, setSion] = useState(localStorage.getItem("part4sion") || "");
  const [descnImportItem, setDescnImportItem] = useState(localStorage.getItem("part4descnImportItem") || "");
  const [impSno, setImpSno] = useState(localStorage.getItem("part4impSno") || "");
  const [impqt, setImpqt] = useState(localStorage.getItem("part4impqt") || "");
  const [uqcB, setUqcB] = useState(localStorage.getItem("part4uqcB") || "");
  const [indigImp, setIndigImp] = useState(localStorage.getItem("part4indigImp") || "");
  const [beNo, setBeNo] = useState(localStorage.getItem("part4beNo") || "");
  const [beDate, setBeDate] = useState(localStorage.getItem("part4beDate") || "");
  const [portCode, setPortCode] = useState(localStorage.getItem("part4portCode") || "");
  const [descnImportedGoods, setDescnImportedGoods] = useState(localStorage.getItem("part4descnImportedGoods") || "");
  const [qtyImp, setQtyImp] = useState(localStorage.getItem("part4qtyImp") || "");
  const [qtyUsed, setQtyUsed] = useState(localStorage.getItem("part4qtyUsed") || "");
  const [invsn, setInvsn] = useState(localStorage.getItem("part4invsn") || "");
  const [itmsn, setItmsn] = useState(localStorage.getItem("part4itmsn") || "");
  const [info, setInfo] = useState(localStorage.getItem("part4info") || "");
  const [qualifier, setQualifier] = useState(localStorage.getItem("part4qualifier") || "");
  const [infoCd, setInfoCd] = useState(localStorage.getItem("part4infoCd") || "");
  const [infoText, setInfoText] = useState(localStorage.getItem("part4infoText") || "");
  const [infoMsr, setInfoMsr] = useState(localStorage.getItem("part4infoMsr") || "");
  const [itmsno, setItmsno] = useState(localStorage.getItem("part4itmsno") || "");
  const [cSno, setCSno] = useState(localStorage.getItem("part4cSno") || "");
  const [name, setName] = useState(localStorage.getItem("part4name") || "");
  const [code, setCode] = useState(localStorage.getItem("part4code") || "");
  const [percentage, setPercentage] = useState(localStorage.getItem("part4percentage") || "");
  const [yieldPct, setYieldPct] = useState(localStorage.getItem("part4yieldPct") || "");
  const [ing, setIng] = useState(localStorage.getItem("part4ing") || "");
  const [controlType, setControlType] = useState(localStorage.getItem("part4controlType") || "");
  const [location, setLocation] = useState(localStorage.getItem("part4location") || "");
  const [stDt, setStDt] = useState(localStorage.getItem("part4stDt") || "");
  const [endDt, setEndDt] = useState(localStorage.getItem("part4endDt") || "");
  const [resCd, setResCd] = useState(localStorage.getItem("part4resCd") || "");
  const [resText, setResText] = useState(localStorage.getItem("part4resText") || "");
  const [doctypcd, setDoctypcd] = useState(localStorage.getItem("part4doctypcd") || "");
  const [icegateId, setIcegateId] = useState(localStorage.getItem("part4icegateId") || "");
  const [irn, setIrn] = useState(localStorage.getItem("part4irn") || "");
  const [partyCd, setPartyCd] = useState(localStorage.getItem("part4partyCd") || "");
  const [issuePla, setIssuePla] = useState(localStorage.getItem("part4issuePla") || "");
  const [issDt, setIssDt] = useState(localStorage.getItem("part4issDt") || "");
  const [expDt, setExpDt] = useState(localStorage.getItem("part4expDt") || "");
  const [sno, setSno] = useState(localStorage.getItem("part4sno") || "");
  const [invoiceNo, setInvoiceNo] = useState(localStorage.getItem("part4invoiceNo") || "");
  const [invoiceAmount, setInvoiceAmount] = useState(localStorage.getItem("part4invoiceAmount") || "");
  const [currency, setCurrency] = useState(localStorage.getItem("part4currency") || "");
  const [container, setContainer] = useState(localStorage.getItem("part4container") || "");
  const [seal, setSeal] = useState(localStorage.getItem("part4seal") || "");
  const [date, setDate] = useState(localStorage.getItem("part4date") || "");
  const [ar4Number, setAr4Number] = useState(localStorage.getItem("part4ar4Number") || "");
  const [ar4Date, setAr4Date] = useState(localStorage.getItem("part4ar4Date") || "");
  const [commissionerate, setCommissionerate] = useState(localStorage.getItem("part4commissionerate") || "");
  const [division, setDivision] = useState(localStorage.getItem("part4division") || "");
  const [range, setRange] = useState(localStorage.getItem("part4range") || "");
  const [iec, setIec] = useState(localStorage.getItem("part4iec") || "");
  const [exporterName, setExporterName] = useState(localStorage.getItem("part4exporterName") || "");
  const [address, setAddress] = useState(localStorage.getItem("part4address") || "");
  const [gstnId, setGstnId] = useState(localStorage.getItem("part4gstnId") || "");
  const [gstnType, setGstnType] = useState(localStorage.getItem("part4gstnType") || "");
  const [type, setType] = useState(localStorage.getItem("part4type") || "");
  const [manufactCd, setManufactCd] = useState(localStorage.getItem("part4manufactCd") || "");
  const [sourceState, setSourceState] = useState(localStorage.getItem("part4sourceState") || "");
  const [transCy, setTransCy] = useState(localStorage.getItem("part4transCy") || "");
  const [invs, setInvs] = useState(localStorage.getItem("part4invs") || "");
  const [quantity, setQuantity] = useState(localStorage.getItem("part4quantity") || "");
  const [noOfUnits, setNoOfUnits] = useState(localStorage.getItem("part4noOfUnits") || "");
  const [beSiteId, setBeSiteId] = useState(localStorage.getItem("part4beSiteId") || "");
  const [beNumber, setBeNumber] = useState(localStorage.getItem("part4beNumber") || "");
  const [beInvSno, setBeInvSno] = useState(localStorage.getItem("part4beInvSno") || "");
  const [beItemS, setBeItemS] = useState(localStorage.getItem("part4beItemS") || "");
  const [beQty, setBeQty] = useState(localStorage.getItem("part4beQty") || "");
  const [beUqc, setBeUqc] = useState(localStorage.getItem("part4beUqc") || "");

  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const [cookies, setCookie] = useCookies(["token"]);
  const { user } = useRecoilValue(authAtom);

  useEffect(() => {
    localStorage.setItem("part4invSno", invSno);
    localStorage.setItem("part4itemsn", itemsn);
    localStorage.setItem("part4dbkSno", dbkSno);
    localStorage.setItem("part4qtyWt", qtyWt);
    localStorage.setItem("part4value", value);
    localStorage.setItem("part4rate", rate);
    localStorage.setItem("part4dbkAmt", dbkAmt);
    localStorage.setItem("part4stalev", stalev);
    localStorage.setItem("part4cenlev", cenlev);
    localStorage.setItem("part4rosctlAmt", rosctlAmt);
    localStorage.setItem("part4invSnoB", invSnoB);
    localStorage.setItem("part4itemSnoB", itemSnoB);
    localStorage.setItem("part4licenseNo", licenseNo);
    localStorage.setItem("part4descnExportItem", descnExportItem);
    localStorage.setItem("part4expSno", expSno);
    localStorage.setItem("part4expqty", expqty);
    localStorage.setItem("part4uqc", uqc);
    localStorage.setItem("part4fobValue", fobValue);
    localStorage.setItem("part4sion", sion);
    localStorage.setItem("part4descnImportItem", descnImportItem);
    localStorage.setItem("part4impSno", impSno);
    localStorage.setItem("part4impqt", impqt);
    localStorage.setItem("part4uqcB", uqcB);
    localStorage.setItem("part4indigImp", indigImp);
    localStorage.setItem("part4beNo", beNo);
    localStorage.setItem("part4beDate", beDate);
    localStorage.setItem("part4portCode", portCode);
    localStorage.setItem("part4descnImportedGoods", descnImportedGoods);
    localStorage.setItem("part4qtyImp", qtyImp);
    localStorage.setItem("part4qtyUsed", qtyUsed);
    localStorage.setItem("part4invsn", invsn);
    localStorage.setItem("part4itmsn", itmsn);
    localStorage.setItem("part4info", info);
    localStorage.setItem("part4qualifier", qualifier);
    localStorage.setItem("part4infoCd", infoCd);
    localStorage.setItem("part4infoText", infoText);
    localStorage.setItem("part4infoMsr", infoMsr);
    localStorage.setItem("part4itmsno", itmsno);
    localStorage.setItem("part4cSno", cSno);
    localStorage.setItem("part4name", name);
    localStorage.setItem("part4code", code);
    localStorage.setItem("part4percentage", percentage);
    localStorage.setItem("part4yieldPct", yieldPct);
    localStorage.setItem("part4ing", ing);
    localStorage.setItem("part4controlType", controlType);
    localStorage.setItem("part4location", location);
    localStorage.setItem("part4stDt", stDt);
    localStorage.setItem("part4endDt", endDt);
    localStorage.setItem("part4resCd", resCd);
    localStorage.setItem("part4resText", resText);
    localStorage.setItem("part4doctypcd", doctypcd);
    localStorage.setItem("part4icegateId", icegateId);
    localStorage.setItem("part4irn", irn);
    localStorage.setItem("part4partyCd", partyCd);
    localStorage.setItem("part4issuePla", issuePla);
    localStorage.setItem("part4issDt", issDt);
    localStorage.setItem("part4expDt", expDt);
    localStorage.setItem("part4sno", sno);
    localStorage.setItem("part4invoiceNo", invoiceNo);
    localStorage.setItem("part4invoiceAmount", invoiceAmount);
    localStorage.setItem("part4currency", currency);
    localStorage.setItem("part4container", container);
    localStorage.setItem("part4seal", seal);
    localStorage.setItem("part4date", date);
    localStorage.setItem("part4ar4Number", ar4Number);
    localStorage.setItem("part4ar4Date", ar4Date);
    localStorage.setItem("part4commissionerate", commissionerate);
    localStorage.setItem("part4division", division);
    localStorage.setItem("part4range", range);
    localStorage.setItem("part4iec", iec);
    localStorage.setItem("part4exporterName", exporterName);
    localStorage.setItem("part4address", address);
    localStorage.setItem("part4gstnId", gstnId);
    localStorage.setItem("part4gstnType", gstnType);
    localStorage.setItem("part4type", type);
    localStorage.setItem("part4manufactCd", manufactCd);
    localStorage.setItem("part4sourceState", sourceState);
    localStorage.setItem("part4transCy", transCy);
    localStorage.setItem("part4invs", invs);
    localStorage.setItem("part4quantity", quantity);
    localStorage.setItem("part4noOfUnits", noOfUnits);
    localStorage.setItem("part4beSiteId", beSiteId);
    localStorage.setItem("part4beNumber", beNumber);
    localStorage.setItem("part4beInvSno", beInvSno);
    localStorage.setItem("part4beItemS", beItemS);
    localStorage.setItem("part4beQty", beQty);
    localStorage.setItem("part4beUqc", beUqc);
  }, [
    invSno, itemsn, dbkSno, qtyWt, value, rate, dbkAmt, stalev, cenlev, rosctlAmt, invSnoB, itemSnoB, licenseNo, descnExportItem, expSno, expqty, uqc, fobValue, sion, descnImportItem, impSno, impqt, uqcB, indigImp, beNo, beDate, portCode, descnImportedGoods, qtyImp, qtyUsed, invsn, itmsn, info, qualifier, infoCd, infoText, infoMsr, itmsno, cSno, name, code, percentage, yieldPct, ing, controlType, location, stDt, endDt, resCd, resText, doctypcd, icegateId, irn, partyCd, issuePla, issDt, expDt, sno, invoiceNo, invoiceAmount, currency, container, seal, date, ar4Number, ar4Date, commissionerate, division, range, iec, exporterName, address, gstnId, gstnType, type, manufactCd, sourceState, transCy, invs, quantity, noOfUnits, beSiteId, beNumber, beInvSno, beItemS, beQty, beUqc
  ]);
  const handleSubmitSection1 = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    const jsonData = {
      invSno: invSno,
      itemsn: itemsn,
      dbkSno: dbkSno,
      qtyWt: qtyWt,
      value: value,
      rate: rate,
      dbkAmt: dbkAmt,
      stalev: stalev,
      cenlev: cenlev,
      rosctlAmt: rosctlAmt,
      invSnoB: invSnoB,
      itemSnoB: itemSnoB,
      licenseNo: licenseNo,
      descnExportItem: descnExportItem,
      addedByUserId: user.id,
    };
    const response = await axios.post(
      `${BACKEND_URL}/documentslist/shippingbill/part4section1`,
      jsonData,
      {
        headers: {
          Authorization: cookies.token,
        },
      }
    );
    setLoading(false);
    alert(response.data.message);
    // Clear local storage and state
    localStorage.removeItem("part4invSno");
    localStorage.removeItem("part4itemsn");
    localStorage.removeItem("part4dbkSno");
    localStorage.removeItem("part4qtyWt");
    localStorage.removeItem("part4value");
    localStorage.removeItem("part4rate");
    localStorage.removeItem("part4dbkAmt");
    localStorage.removeItem("part4stalev");
    localStorage.removeItem("part4cenlev");
    localStorage.removeItem("part4rosctlAmt");
    localStorage.removeItem("part4invSnoB");
    localStorage.removeItem("part4itemSnoB");
    localStorage.removeItem("part4licenseNo");
    localStorage.removeItem("part4descnExportItem");
    setInvSno("");
    setItemsn("");
    setDbkSno("");
    setQtyWt("");
    setValue("");
    setRate("");
    setDbkAmt("");
    setStalev("");
    setCenlev("");
    setRosctlAmt("");
    setInvSnoB("");
    setItemSnoB("");
    setLicenseNo("");
    setDescnExportItem("");
  };

  const handleSubmitSection2 = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    const jsonData = {
      expSno: expSno,
      expqty: expqty,
      uqc: uqc,
      fobValue: fobValue,
      sion: sion,
      descnImportItem: descnImportItem,
      impSno: impSno,
      impqt: impqt,
      uqcB: uqcB,
      indigImp: indigImp,
      beNo: beNo,
      beDate: beDate,
      portCode: portCode,
      descnImportedGoods: descnImportedGoods,
      addedByUserId: user.id,
    };
    const response = await axios.post(
      `${BACKEND_URL}/documentslist/shippingbill/part4section2`,
      jsonData,
      {
        headers: {
          Authorization: cookies.token,
        },
      }
    );
    setLoading(false);
    alert(response.data.message);
    // Clear local storage and state
    localStorage.removeItem("part4expSno");
    localStorage.removeItem("part4expqty");
    localStorage.removeItem("part4uqc");
    localStorage.removeItem("part4fobValue");
    localStorage.removeItem("part4sion");
    localStorage.removeItem("part4descnImportItem");
    localStorage.removeItem("part4impSno");
    localStorage.removeItem("part4impqt");
    localStorage.removeItem("part4uqcB");
    localStorage.removeItem("part4indigImp");
    localStorage.removeItem("part4beNo");
    localStorage.removeItem("part4beDate");
    localStorage.removeItem("part4portCode");
    localStorage.removeItem("part4descnImportedGoods");
    setExpSno("");
    setExpqty("");
    setUqc("");
    setFobValue("");
    setSion("");
    setDescnImportItem("");
    setImpSno("");
    setImpqt("");
    setUqcB("");
    setIndigImp("");
    setBeNo("");
    setBeDate("");
    setPortCode("");
    setDescnImportedGoods("");
  };

  const handleSubmitSection3 = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    const jsonData = {
      qtyImp: qtyImp,
      qtyUsed: qtyUsed,
      invsn: invsn,
      itmsn: itmsn,
      info: info,
      qualifier: qualifier,
      infoCd: infoCd,
      infoText: infoText,
      infoMsr: infoMsr,
      itmsno: itmsno,
      cSno: cSno,
      name: name,
      code: code,
      percentage: percentage,
      addedByUserId: user.id,
    };
    const response = await axios.post(
      `${BACKEND_URL}/documentslist/shippingbill/part4section3`,
      jsonData,
      {
        headers: {
          Authorization: cookies.token,
        },
      }
    );
    setLoading(false);
    alert(response.data.message);
    // Clear local storage and state
    localStorage.removeItem("part4qtyImp");
    localStorage.removeItem("part4qtyUsed");
    localStorage.removeItem("part4invsn");
    localStorage.removeItem("part4itmsn");
    localStorage.removeItem("part4info");
    localStorage.removeItem("part4qualifier");
    localStorage.removeItem("part4infoCd");
    localStorage.removeItem("part4infoText");
    localStorage.removeItem("part4infoMsr");
    localStorage.removeItem("part4itmsno");
    localStorage.removeItem("part4cSno");
    localStorage.removeItem("part4name");
    localStorage.removeItem("part4code");
    localStorage.removeItem("part4percentage");
    setQtyImp("");
    setQtyUsed("");
    setInvsn("");
    setItmsn("");
    setInfo("");
    setQualifier("");
    setInfoCd("");
    setInfoText("");
    setInfoMsr("");
    setItmsno("");
    setCSno("");
    setName("");
    setCode("");
    setPercentage("");
  };

  const handleSubmitSection4 = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    const jsonData = {
      yieldPct: yieldPct,
      ing: ing,
      controlType: controlType,
      location: location,
      stDt: stDt,
      endDt: endDt,
      resCd: resCd,
      resText: resText,
      docypcd: doctypcd,
      icegateId: icegateId,
      irn: irn,
      partyCd: partyCd,
      issuePla: issuePla,
      issDt: issDt,
      expDt: expDt,
      addedByUserId: user.id,
    };
    const response = await axios.post(
      `${BACKEND_URL}/documentslist/shippingbill/part4section4`,
      jsonData,
      {
        headers: {
          Authorization: cookies.token,
        },
      }
    );
    setLoading(false);
    alert(response.data.message);
    // Clear local storage and state
    localStorage.removeItem("part4yieldPct");
    localStorage.removeItem("part4ing");
    localStorage.removeItem("part4controlType");
    localStorage.removeItem("part4location");
    localStorage.removeItem("part4stDt");
    localStorage.removeItem("part4endDt");
    localStorage.removeItem("part4resCd");
    localStorage.removeItem("part4resText");
    localStorage.removeItem("part4doctypcd");
    localStorage.removeItem("part4icegateId");
    localStorage.removeItem("part4irn");
    localStorage.removeItem("part4partyCd");
    localStorage.removeItem("part4issuePla");
    localStorage.removeItem("part4issDt");
    localStorage.removeItem("part4expDt");
    setYieldPct("");
    setIng("");
    setControlType("");
    setLocation("");
    setStDt("");
    setEndDt("");
    setResCd("");
    setResText("");
    setDoctypcd("");
    setIcegateId("");
    setIrn("");
    setPartyCd("");
    setIssuePla("");
    setIssDt("");
    setExpDt("");
  };

  const handleSubmitSection5 = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    const jsonData = {
      sno: sno,
      invoiceNo: invoiceNo,
      invoiceAmount: invoiceAmount,
      currency: currency,
      container: container,
      seal: seal,
      date: date,
      ar4Number: ar4Number,
      ar4Date: ar4Date,
      commissionerate: commissionerate,
      division: division,
      range: range,
      iec: iec,
      exporterName: exporterName,
      address: address,
      addedByUserId: user.id,
    };
    const response = await axios.post(
      `${BACKEND_URL}/documentslist/shippingbill/part4section5`,
      jsonData,
      {
        headers: {
          Authorization: cookies.token,
        },
      }
    );
    setLoading(false);
    alert(response.data.message);
    // Clear local storage and state
    localStorage.removeItem("part4sno");
    localStorage.removeItem("part4invoiceNo");
    localStorage.removeItem("part4invoiceAmount");
    localStorage.removeItem("part4currency");
    localStorage.removeItem("part4container");
    localStorage.removeItem("part4seal");
    localStorage.removeItem("part4date");
    localStorage.removeItem("part4ar4Number");
    localStorage.removeItem("part4ar4Date");
    localStorage.removeItem("part4commissionerate");
    localStorage.removeItem("part4division");
    localStorage.removeItem("part4range");
    localStorage.removeItem("part4iec");
    localStorage.removeItem("part4exporterName");
    localStorage.removeItem("part4address");
    setSno("");
    setInvoiceNo("");
    setInvoiceAmount("");
    setCurrency("");
    setContainer("");
    setSeal("");
    setDate("");
    setAr4Number("");
    setAr4Date("");
    setCommissionerate("");
    setDivision("");
    setRange("");
    setIec("");
    setExporterName("");
    setAddress("");
  };

  const handleSubmitSection6 = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    const jsonData = {
      gstnId: gstnId,
      gstnType: gstnType,
      type: type,
      manufactCd: manufactCd,
      sourceState: sourceState,
      transCy: transCy,
      invs: invs,
      quantity: quantity,
      noOfUnits: noOfUnits,
      beSiteId: beSiteId,
      beNumber: beNumber,
      beInvSno: beInvSno,
      beItemS: beItemS,
      beQty: beQty,
      beUqc: beUqc,
      addedByUserId: user.id,
    };
    const response = await axios.post(
      `${BACKEND_URL}/documentslist/shippingbill/part4section6`,
      jsonData,
      {
        headers: {
          Authorization: cookies.token,
        },
      }
    );
    setLoading(false);
    alert(response.data.message);
    // Clear local storage and state
    localStorage.removeItem("part4gstnId");
    localStorage.removeItem("part4gstnType");
    localStorage.removeItem("part4type");
    localStorage.removeItem("part4manufactCd");
    localStorage.removeItem("part4sourceState");
    localStorage.removeItem("part4transCy");
    localStorage.removeItem("part4invs");
    localStorage.removeItem("part4quantity");
    localStorage.removeItem("part4noOfUnits");
    localStorage.removeItem("part4beSiteId");
    localStorage.removeItem("part4beNumber");
    localStorage.removeItem("part4beInvSno");
    localStorage.removeItem("part4beItemS");
    localStorage.removeItem("part4beQty");
    localStorage.removeItem("part4beUqc");
    setGstnId("");
    setGstnType("");
    setType("");
    setManufactCd("");
    setSourceState("");
    setTransCy("");
    setInvs("");
    setQuantity("");
    setNoOfUnits("");
    setBeSiteId("");
    setBeNumber("");
    setBeInvSno("");
    setBeItemS("");
    setBeQty("");
    setBeUqc("");
  };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  return (
    <div className="bg-[#e6e7e9] w-full h-full min-h-screen">
      <div className="container mx-auto px-4 py-8 ">
        {loading && <Loading />}

       


        <div className="container text-center text-green-700 font-sans font-semibold text-[24px]">
        Shipping Bill - Part 4
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 mt-2 gap-4">
          <div className="bg-white p-4 rounded-md">
            <div className="container text-center text-green-700 font-sans font-semibold text-xl">
              Section 1
            </div>
            <InputField
              label="invSno"
              value={invSno}
              onChange={(e) => setInvSno(e.target.value)}
            />
            <InputField
              label="itemsn"
              value={itemsn}
              onChange={(e) => setItemsn(e.target.value)}
            />
            <InputField
              label="dbkSno"
              value={dbkSno}
              onChange={(e) => setDbkSno(e.target.value)}
            />
            <InputField
              label="qtyWt"
              value={qtyWt}
              onChange={(e) => setQtyWt(e.target.value)}
            />
            <InputField
              label="value"
              value={value}
              onChange={(e) => setValue(e.target.value)}
            />
            <InputField
              label="rate"
              value={rate}
              onChange={(e) => setRate(e.target.value)}
            />
            <InputField
              label="dbkAmt"
              value={dbkAmt}
              onChange={(e) => setDbkAmt(e.target.value)}
            />
            <InputField
              label="stalev"
              value={stalev}
              onChange={(e) => setStalev(e.target.value)}
            />
            <InputField
              label="cenlev"
              value={cenlev}
              onChange={(e) => setCenlev(e.target.value)}
            />
            <InputField
              label="rosctlAmt"
              value={rosctlAmt}
              onChange={(e) => setRosctlAmt(e.target.value)}
            />
            <InputField
              label="invSnoB"
              value={invSnoB}
              onChange={(e) => setInvSnoB(e.target.value)}
            />
            <InputField
              label="itemSnoB"
              value={itemSnoB}
              onChange={(e) => setItemSnoB(e.target.value)}
            />
            <InputField
              label="licenseNo"
              value={licenseNo}
              onChange={(e) => setLicenseNo(e.target.value)}
            />
            <InputField
              label="descnExportItem"
              value={descnExportItem}
              onChange={(e) => setDescnExportItem(e.target.value)}
            />
            <NewDataButtons
              backLink={""}
              nextLink={""}
              handleSubmit={handleSubmitSection1}
            />
          </div>
          <div className="bg-white p-4 rounded-md">
            <div className="container text-center text-green-700 font-sans font-semibold text-xl">
              Section 2
            </div>
            <InputField
              label="expSno"
              value={expSno}
              onChange={(e) => setExpSno(e.target.value)}
            />
            <InputField
              label="expqty"
              value={expqty}
              onChange={(e) => setExpqty(e.target.value)}
            />
            <InputField
              label="uqc"
              value={uqc}
              onChange={(e) => setUqc(e.target.value)}
            />
            <InputField
              label="fobValue"
              value={fobValue}
              onChange={(e) => setFobValue(e.target.value)}
            />
            <InputField
              label="sion"
              value={sion}
              onChange={(e) => setSion(e.target.value)}
            />
            <InputField
              label="descnImportItem"
              value={descnImportItem}
              onChange={(e) => setDescnImportItem(e.target.value)}
            />
            <InputField
              label="impSno"
              value={impSno}
              onChange={(e) => setImpSno(e.target.value)}
            />
            <InputField
              label="impqt"
              value={impqt}
              onChange={(e) => setImpqt(e.target.value)}
            />
            <InputField
              label="uqcB"
              value={uqcB}
              onChange={(e) => setUqcB(e.target.value)}
            />
            <InputField
              label="indigImp"
              value={indigImp}
              onChange={(e) => setIndigImp(e.target.value)}
            />
            <InputField
              label="beNo"
              value={beNo}
              onChange={(e) => setBeNo(e.target.value)}
            />
            <InputField
              label="beDate"
              value={beDate}
              onChange={(e) => setBeDate(e.target.value)}
            />
            <InputField
              label="portCode"
              value={portCode}
              onChange={(e) => setPortCode(e.target.value)}
            />
            <InputField
              label="descnImportedGoods"
              value={descnImportedGoods}
              onChange={(e) => setDescnImportedGoods(e.target.value)}
            />
            <NewDataButtons
              backLink={""}
              nextLink={""}
              handleSubmit={handleSubmitSection2}
            />
          </div>
          <div className="bg-white p-4 rounded-md">
            <div className="container text-center text-green-700 font-sans font-semibold text-xl">
              Section 3
            </div>
            <InputField
              label="qtyImp"
              value={qtyImp}
              onChange={(e) => setQtyImp(e.target.value)}
            />
            <InputField
              label="qtyUsed"
              value={qtyUsed}
              onChange={(e) => setQtyUsed(e.target.value)}
            />
            <InputField
              label="invsn"
              value={invsn}
              onChange={(e) => setInvsn(e.target.value)}
            />
            <InputField
              label="itmsn"
              value={itmsn}
              onChange={(e) => setItmsn(e.target.value)}
            />
            <InputField
              label="info"
              value={info}
              onChange={(e) => setInfo(e.target.value)}
            />
            <InputField
              label="qualifier"
              value={qualifier}
              onChange={(e) => setQualifier(e.target.value)}
            />
            <InputField
              label="infoCd"
              value={infoCd}
              onChange={(e) => setInfoCd(e.target.value)}
            />
            <InputField
              label="infoText"
              value={infoText}
              onChange={(e) => setInfoText(e.target.value)}
            />
            <InputField
              label="infoMsr"
              value={infoMsr}
              onChange={(e) => setInfoMsr(e.target.value)}
            />
            <InputField
              label="itmsno"
              value={itmsno}
              onChange={(e) => setItmsno(e.target.value)}
            />
            <InputField
              label="cSno"
              value={cSno}
              onChange={(e) => setCSno(e.target.value)}
            />
            <InputField
              label="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <InputField
              label="code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
            />
            <InputField
              label="percentage"
              value={percentage}
              onChange={(e) => setPercentage(e.target.value)}
            />
            <NewDataButtons
              backLink={""}
              nextLink={""}
              handleSubmit={handleSubmitSection3}
            />
          </div>
          <div className="bg-white p-4 rounded-md">
            <div className="container text-center text-green-700 font-sans font-semibold text-xl">
              Section 4
            </div>
            <InputField
              label="yieldPct"
              value={yieldPct}
              onChange={(e) => setYieldPct(e.target.value)}
            />
            <InputField
              label="ing"
              value={ing}
              onChange={(e) => setIng(e.target.value)}
            />
            <InputField
              label="controlType"
              value={controlType}
              onChange={(e) => setControlType(e.target.value)}
            />
            <InputField
              label="location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
            <InputField
              label="stDt"
              value={stDt}
              onChange={(e) => setStDt(e.target.value)}
            />
            <InputField
              label="endDt"
              value={endDt}
              onChange={(e) => setEndDt(e.target.value)}
            />
            <InputField
              label="resCd"
              value={resCd}
              onChange={(e) => setResCd(e.target.value)}
            />
            <InputField
              label="resText"
              value={resText}
              onChange={(e) => setResText(e.target.value)}
            />
            <InputField
              label="doctypcd"
              value={doctypcd}
              onChange={(e) => setDoctypcd(e.target.value)}
            />
            <InputField
              label="icegateId"
              value={icegateId}
              onChange={(e) => setIcegateId(e.target.value)}
            />
            <InputField
              label="irn"
              value={irn}
              onChange={(e) => setIrn(e.target.value)}
            />
            <InputField
              label="partyCd"
              value={partyCd}
              onChange={(e) => setPartyCd(e.target.value)}
            />
            <InputField
              label="issuePla"
              value={issuePla}
              onChange={(e) => setIssuePla(e.target.value)}
            />
            <InputField
              label="issDt"
              value={issDt}
              onChange={(e) => setIssDt(e.target.value)}
            />
            <InputField
              label="expDt"
              value={expDt}
              onChange={(e) => setExpDt(e.target.value)}
            />
            <NewDataButtons
              backLink={""}
              nextLink={""}
              handleSubmit={handleSubmitSection4}
            />
            
          </div>
          <div className="bg-white p-4 rounded-md">
            <div className="container text-center text-green-700 font-sans font-semibold text-xl">
              Section 5
            </div>
            <InputField
              label="sno"
              value={sno}
              onChange={(e) => setSno(e.target.value)}
            />
            <InputField
              label="invoiceNo"
              value={invoiceNo}
              onChange={(e) => setInvoiceNo(e.target.value)}
            />
            <InputField
              label="invoiceAmount"
              value={invoiceAmount}
              onChange={(e) => setInvoiceAmount(e.target.value)}
            />
            <InputField
              label="currency"
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
            />
            <InputField
              label="container"
              value={container}
              onChange={(e) => setContainer(e.target.value)}
            />
            <InputField
              label="seal"
              value={seal}
              onChange={(e) => setSeal(e.target.value)}
            />
            <InputField
              label="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
            <InputField
              label="ar4Number"
              value={ar4Number}
              onChange={(e) => setAr4Number(e.target.value)}
            />
            <InputField
              label="ar4Date"
              value={ar4Date}
              onChange={(e) => setAr4Date(e.target.value)}
            />
            <InputField
              label="commissionerate"
              value={commissionerate}
              onChange={(e) => setCommissionerate(e.target.value)}
            />
            <InputField
              label="division"
              value={division}
              onChange={(e) => setDivision(e.target.value)}
            />
            <InputField
              label="range"
              value={range}
              onChange={(e) => setRange(e.target.value)}
            />
            <InputField
              label="iec"
              value={iec}
              onChange={(e) => setIec(e.target.value)}
            />
            <InputField
              label="exporterName"
              value={exporterName}
              onChange={(e) => setExporterName(e.target.value)}
            />
            <InputField
              label="address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
           <NewDataButtons
              backLink={""}
              nextLink={""}
              handleSubmit={handleSubmitSection5}
            />
          </div>
          <div className="bg-white p-4 rounded-md">
            <div className="container text-center text-green-700 font-sans font-semibold text-xl">
              Section 6
            </div>
            <InputField
              label="gstnId"
              value={gstnId}
              onChange={(e) => setGstnId(e.target.value)}
            />
            <InputField
              label="gstnType"
              value={gstnType}
              onChange={(e) => setGstnType(e.target.value)}
            />
            <InputField
              label="type"
              value={type}
              onChange={(e) => setType(e.target.value)}
            />
            <InputField
              label="manufactCd"
              value={manufactCd}
              onChange={(e) => setManufactCd(e.target.value)}
            />
            <InputField
              label="sourceState"
              value={sourceState}
              onChange={(e) => setSourceState(e.target.value)}
            />
            <InputField
              label="transCy"
              value={transCy}
              onChange={(e) => setTransCy(e.target.value)}
            />
            <InputField
              label="invs"
              value={invs}
              onChange={(e) => setInvs(e.target.value)}
            />
            <InputField
              label="quantity"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
            />
            <InputField
              label="noOfUnits"
              value={noOfUnits}
              onChange={(e) => setNoOfUnits(e.target.value)}
            />
            <InputField
              label="beSiteId"
              value={beSiteId}
              onChange={(e) => setBeSiteId(e.target.value)}
            />
            <InputField
              label="beNumber"
              value={beNumber}
              onChange={(e) => setBeNumber(e.target.value)}
            />
            <InputField
              label="beInvSno"
              value={beInvSno}
              onChange={(e) => setBeInvSno(e.target.value)}
            />
            <InputField
              label="beItemS"
              value={beItemS}
              onChange={(e) => setBeItemS(e.target.value)}
            />
            <InputField
              label="beQty"
              value={beQty}
              onChange={(e) => setBeQty(e.target.value)}
            />
            <InputField
              label="beUqc"
              value={beUqc}
              onChange={(e) => setBeUqc(e.target.value)}
            />

            <NewDataButtons
              backLink={"/datamanagement/newdata/part3"}
              nextLink={"/datamanagement/newdata/part5"}
              handleSubmit={handleSubmitSection6}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Part4;
