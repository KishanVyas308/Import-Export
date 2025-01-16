import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Loading from "../../../../../components/Loading";
import { BACKEND_URL } from "../../../../../../Globle";
import { useCookies } from "react-cookie";
import InputField from "../../../../../components/InputField";
import NewDataButtons from "../../NewDataButtons";
import { useRecoilValue } from "recoil";
import { authAtom } from "../../../../../../atoms/authAtom";

const Part2 = () => {
  const [sNo, setSNo] = useState(localStorage.getItem("part2sNo") || "");
  const [invoiceNo, setInvoiceNo] = useState(localStorage.getItem("part2invoiceNo") || "");
  const [invoiceDt, setInvoiceDt] = useState(localStorage.getItem("part2invoiceDt") || "");
  const [poNo, setPoNo] = useState(localStorage.getItem("part2poNo") || "");
  const [poDt, setPoDt] = useState(localStorage.getItem("part2poDt") || "");
  const [locNo, setLocNo] = useState(localStorage.getItem("part2locNo") || "");
  const [locDt, setLocDt] = useState(localStorage.getItem("part2locDt") || "");
  const [contractNo, setContractNo] = useState(localStorage.getItem("part2contractNo") || "");
  const [contractDt, setContractDt] = useState(localStorage.getItem("part2contractDt") || "");
  const [adCode, setAdCode] = useState(localStorage.getItem("part2adCode") || "");
  const [invTerm, setInvTerm] = useState(localStorage.getItem("part2invTerm") || "");
  const [exporterName, setExporterName] = useState(localStorage.getItem("part2exporterName") || "");
  const [exporterAddress, setExporterAddress] = useState(localStorage.getItem("part2exporterAddress") || "");
  const [buyerName, setBuyerName] = useState(localStorage.getItem("part2buyerName") || "");
  const [buyerAddress, setBuyerAddress] = useState(localStorage.getItem("part2buyerAddress") || "");
  const [thirdPartyName, setThirdPartyName] = useState(localStorage.getItem("part2thirdPartyName") || "");
  const [thirdPartyAddress, setThirdPartyAddress] = useState(localStorage.getItem("part2thirdPartyAddress") || "");
  const [buyerAeoStatus, setBuyerAeoStatus] = useState(localStorage.getItem("part2buyerAeoStatus") || "");
  const [invoiceValue, setInvoiceValue] = useState(localStorage.getItem("part2invoiceValue") || "");
  const [fobValue, setFobValue] = useState(localStorage.getItem("part2fobValue") || "");
  const [freight, setFreight] = useState(localStorage.getItem("part2freight") || "");
  const [insurance, setInsurance] = useState(localStorage.getItem("part2insurance") || "");
  const [discount, setDiscount] = useState(localStorage.getItem("part2discount") || "");
  const [commission, setCommission] = useState(localStorage.getItem("part2commission") || "");
  const [deduct, setDeduct] = useState(localStorage.getItem("part2deduct") || "");
  const [pc, setPc] = useState(localStorage.getItem("part2pc") || "");
  const [exchangeRate, setExchangeRate] = useState(localStorage.getItem("part2exchangeRate") || "");
  const [itemSno, setItemSno] = useState(localStorage.getItem("part2itemSno") || "");
  const [hsCd, setHsCd] = useState(localStorage.getItem("part2hsCd") || "");
  const [description, setDescription] = useState(localStorage.getItem("part2description") || "");
  const [quantity, setQuantity] = useState(localStorage.getItem("part2quantity") || "");
  const [uqc, setUqc] = useState(localStorage.getItem("part2uqc") || "");
  const [rate, setRate] = useState(localStorage.getItem("part2rate") || "");
  const [valueFc, setValueFc] = useState(localStorage.getItem("part2valueFc") || "");

  useEffect(() => {
    localStorage.setItem("part2sNo", sNo);
    localStorage.setItem("part2invoiceNo", invoiceNo);
    localStorage.setItem("part2invoiceDt", invoiceDt);
    localStorage.setItem("part2poNo", poNo);
    localStorage.setItem("part2poDt", poDt);
    localStorage.setItem("part2locNo", locNo);
    localStorage.setItem("part2locDt", locDt);
    localStorage.setItem("part2contractNo", contractNo);
    localStorage.setItem("part2contractDt", contractDt);
    localStorage.setItem("part2adCode", adCode);
    localStorage.setItem("part2invTerm", invTerm);
    localStorage.setItem("part2exporterName", exporterName);
    localStorage.setItem("part2exporterAddress", exporterAddress);
    localStorage.setItem("part2buyerName", buyerName);
    localStorage.setItem("part2buyerAddress", buyerAddress);
    localStorage.setItem("part2thirdPartyName", thirdPartyName);
    localStorage.setItem("part2thirdPartyAddress", thirdPartyAddress);
    localStorage.setItem("part2buyerAeoStatus", buyerAeoStatus);
    localStorage.setItem("part2invoiceValue", invoiceValue);
    localStorage.setItem("part2fobValue", fobValue);
    localStorage.setItem("part2freight", freight);
    localStorage.setItem("part2insurance", insurance);
    localStorage.setItem("part2discount", discount);
    localStorage.setItem("part2commission", commission);
    localStorage.setItem("part2deduct", deduct);
    localStorage.setItem("part2pc", pc);
    localStorage.setItem("part2exchangeRate", exchangeRate);
    localStorage.setItem("part2itemSno", itemSno);
    localStorage.setItem("part2hsCd", hsCd);
    localStorage.setItem("part2description", description);
    localStorage.setItem("part2quantity", quantity);
    localStorage.setItem("part2uqc", uqc);
    localStorage.setItem("part2rate", rate);
    localStorage.setItem("part2valueFc", valueFc);
  }, [
    sNo, invoiceNo, invoiceDt, poNo, poDt, locNo, locDt, contractNo, contractDt, adCode, invTerm, exporterName, exporterAddress,
    buyerName, buyerAddress, thirdPartyName, thirdPartyAddress, buyerAeoStatus, invoiceValue, fobValue, freight, insurance,
    discount, commission, deduct, pc, exchangeRate, itemSno, hsCd, description, quantity, uqc, rate, valueFc
  ]);
  const [loading, setLoading] = useState(false);

  const [cookies, setCookie] = useCookies(["token"]);
  const { user } = useRecoilValue(authAtom);
  const navigate = useNavigate();

  const handleSubmitSection1 = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    const jsonData = {
      sNo: sNo,
      invoiceNo: invoiceNo,
      invoiceDt: invoiceDt,
      poNo: poNo,
      poDt: poDt,
      locNo: locNo,
      locDt: locDt,
      contractNo: contractNo,
      contractDt: contractDt,
      adCode: adCode,
      invTerm: invTerm,
      exporterName: exporterName,
      addedByUserId: user.id,
    };
    const response = await axios.post(
      `${BACKEND_URL}/documentslist/shippingbill/part2section1`,
      jsonData,
      {
        headers: {
          Authorization: cookies.token,
        },
      }
    );
    setLoading(false);
    alert(response.data.message);
    // Clear localStorage and state
    localStorage.removeItem("part2sNo");
    localStorage.removeItem("part2invoiceNo");
    localStorage.removeItem("part2invoiceDt");
    localStorage.removeItem("part2poNo");
    localStorage.removeItem("part2poDt");
    localStorage.removeItem("part2locNo");
    localStorage.removeItem("part2locDt");
    localStorage.removeItem("part2contractNo");
    localStorage.removeItem("part2contractDt");
    localStorage.removeItem("part2adCode");
    localStorage.removeItem("part2invTerm");
    localStorage.removeItem("part2exporterName");
    setSNo("");
    setInvoiceNo("");
    setInvoiceDt("");
    setPoNo("");
    setPoDt("");
    setLocNo("");
    setLocDt("");
    setContractNo("");
    setContractDt("");
    setAdCode("");
    setInvTerm("");
    setExporterName("");
  };

  const handleSubmitSection2 = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    const jsonData = {
      exporterAddress: exporterAddress,
      buyerName: buyerName,
      buyerAddress: buyerAddress,
      thirdPartyName: thirdPartyName,
      thirdPartyAddress: thirdPartyAddress,
      buyerAeoStatus: buyerAeoStatus,
      invoiceValue: invoiceValue,
      fobValue: fobValue,
      freight: freight,
      insurance: insurance,
      discount: discount,
      commission: commission,
      addedByUserId: user.id,
    };
    const response = await axios.post(
      `${BACKEND_URL}/documentslist/shippingbill/part2section2`,
      jsonData,
      {
        headers: {
          Authorization: cookies.token,
        },
      }
    );
    setLoading(false);
    alert(response.data.message);
    // Clear localStorage and state
    localStorage.removeItem("part2exporterAddress");
    localStorage.removeItem("part2buyerName");
    localStorage.removeItem("part2buyerAddress");
    localStorage.removeItem("part2thirdPartyName");
    localStorage.removeItem("part2thirdPartyAddress");
    localStorage.removeItem("part2buyerAeoStatus");
    localStorage.removeItem("part2invoiceValue");
    localStorage.removeItem("part2fobValue");
    localStorage.removeItem("part2freight");
    localStorage.removeItem("part2insurance");
    localStorage.removeItem("part2discount");
    localStorage.removeItem("part2commission");
    setExporterAddress("");
    setBuyerName("");
    setBuyerAddress("");
    setThirdPartyName("");
    setThirdPartyAddress("");
    setBuyerAeoStatus("");
    setInvoiceValue("");
    setFobValue("");
    setFreight("");
    setInsurance("");
    setDiscount("");
    setCommission("");
  };

  const handleSubmitSection3 = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    const jsonData = {
      deduct: deduct,
      pc: pc,
      exchangeRate: exchangeRate,
      itemSno: itemSno,
      hsCd: hsCd,
      description: description,
      quantity: quantity,
      uqc: uqc,
      rate: rate,
      valueFc: valueFc,
      addedByUserId: user.id,
    };
    const response = await axios.post(
      `${BACKEND_URL}/documentslist/shippingbill/part2section3`,
      jsonData,
      {
        headers: {
          Authorization: cookies.token,
        },
      }
    );
    setLoading(false);
    alert(response.data.message);
    // Clear localStorage and state
    localStorage.removeItem("part2deduct");
    localStorage.removeItem("part2pc");
    localStorage.removeItem("part2exchangeRate");
    localStorage.removeItem("part2itemSno");
    localStorage.removeItem("part2hsCd");
    localStorage.removeItem("part2description");
    localStorage.removeItem("part2quantity");
    localStorage.removeItem("part2uqc");
    localStorage.removeItem("part2rate");
    localStorage.removeItem("part2valueFc");
    setDeduct("");
    setPc("");
    setExchangeRate("");
    setItemSno("");
    setHsCd("");
    setDescription("");
    setQuantity("");
    setUqc("");
    setRate("");
    setValueFc("");
  };


  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  return (
    <div className="bg-[#e6e7e9] w-full h-full min-h-screen">
      <div className="container mx-auto px-4 py-8 ">
        {loading && <Loading />}


        <div className="container text-center text-green-700 font-sans font-semibold text-[24px]">
        Shipping Bill - Part 2
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 mt-2 gap-4">
          <div className="bg-white p-4 rounded-md">
            <div className="container text-center text-green-700 font-sans font-semibold text-xl">
              Section 1
            </div>
            <InputField
              label="S No"
              value={sNo}
              onChange={(e) => setSNo(e.target.value)}
            />
            <InputField
              label="Invoice No"
              value={invoiceNo}
              onChange={(e) => setInvoiceNo(e.target.value)}
            />
            <InputField
              label="Invoice Dt"
              value={invoiceDt}
              onChange={(e) => setInvoiceDt(e.target.value)}
            />
            <InputField
              label="PO No"
              value={poNo}
              onChange={(e) => setPoNo(e.target.value)}
            />
            <InputField
              label="PO Dt"
              value={poDt}
              onChange={(e) => setPoDt(e.target.value)}
            />
            <InputField
              label="Loc No"
              value={locNo}
              onChange={(e) => setLocNo(e.target.value)}
            />
            <InputField
              label="Loc Dt"
              value={locDt}
              onChange={(e) => setLocDt(e.target.value)}
            />
            <InputField
              label="Contract No"
              value={contractNo}
              onChange={(e) => setContractNo(e.target.value)}
            />
            <InputField
              label="Contract Dt"
              value={contractDt}
              onChange={(e) => setContractDt(e.target.value)}
            />
            <InputField
              label="AD Code"
              value={adCode}
              onChange={(e) => setAdCode(e.target.value)}
            />
            <InputField
              label="Inv Term"
              value={invTerm}
              onChange={(e) => setInvTerm(e.target.value)}
            />
            <InputField
              label="Exporter Name"
              value={exporterName}
              onChange={(e) => setExporterName(e.target.value)}
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
              label="Exporter Address"
              value={exporterAddress}
              onChange={(e) => setExporterAddress(e.target.value)}
            />
            <InputField
              label="Buyer Name"
              value={buyerName}
              onChange={(e) => setBuyerName(e.target.value)}
            />
            <InputField
              label="Buyer Address"
              value={buyerAddress}
              onChange={(e) => setBuyerAddress(e.target.value)}
            />
            <InputField
              label="Third Party Name"
              value={thirdPartyName}
              onChange={(e) => setThirdPartyName(e.target.value)}
            />
            <InputField
              label="Third Party Address"
              value={thirdPartyAddress}
              onChange={(e) => setThirdPartyAddress(e.target.value)}
            />
            <InputField
              label="Buyer AEO Status"
              value={buyerAeoStatus}
              onChange={(e) => setBuyerAeoStatus(e.target.value)}
            />
            <InputField
              label="Invoice Value"
              value={invoiceValue}
              onChange={(e) => setInvoiceValue(e.target.value)}
            />
            <InputField
              label="FOB Value"
              value={fobValue}
              onChange={(e) => setFobValue(e.target.value)}
            />
            <InputField
              label="Freight"
              value={freight}
              onChange={(e) => setFreight(e.target.value)}
            />
            <InputField
              label="Insurance"
              value={insurance}
              onChange={(e) => setInsurance(e.target.value)}
            />
            <InputField
              label="Discount"
              value={discount}
              onChange={(e) => setDiscount(e.target.value)}
            />
            <InputField
              label="Commission"
              value={commission}
              onChange={(e) => setCommission(e.target.value)}
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
              label="Deduct"
              value={deduct}
              onChange={(e) => setDeduct(e.target.value)}
            />
            <InputField
              label="PC"
              value={pc}
              onChange={(e) => setPc(e.target.value)}
            />
            <InputField
              label="Exchange Rate"
              value={exchangeRate}
              onChange={(e) => setExchangeRate(e.target.value)}
            />
            <InputField
              label="Item Sno"
              value={itemSno}
              onChange={(e) => setItemSno(e.target.value)}
            />
            <InputField
              label="HS Cd"
              value={hsCd}
              onChange={(e) => setHsCd(e.target.value)}
            />
            <InputField
              label="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <InputField
              label="Quantity"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
            />
            <InputField
              label="UQC"
              value={uqc}
              onChange={(e) => setUqc(e.target.value)}
            />
            <InputField
              label="Rate"
              value={rate}
              onChange={(e) => setRate(e.target.value)}
            />
            <InputField
              label="Value Fc"
              value={valueFc}
              onChange={(e) => setValueFc(e.target.value)}
            />

            <NewDataButtons
              backLink={"/datamanagement/newdata/part1"}
              nextLink={"/datamanagement/newdata/part3"}
              handleSubmit={handleSubmitSection3}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Part2;
