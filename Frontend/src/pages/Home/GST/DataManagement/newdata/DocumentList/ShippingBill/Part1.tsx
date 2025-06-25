import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Loading from "../../../../../../components/Loading";
import { BACKEND_URL } from "../../../../../../../Globle";
import { useCookies } from "react-cookie";
import InputField from "../../../../../../components/InputField";
import NewDataButtons from "../../NewDataButtons";
import { useRecoilValue } from "recoil";
import { authAtom } from "../../../../../../../atoms/authAtom";

const Part1 = () => {
  const [exportersName, setExportersName] = useState(localStorage.getItem("part1exportersName") || "");
  const [exportersAddress, setExportersAddress] = useState(localStorage.getItem("part1exportersAddress") || "");
  const [type, setType] = useState(localStorage.getItem("part1type") || "");
  const [adCode, setAdCode] = useState(localStorage.getItem("part1adCode") || "");
  const [rbiWaiverNo, setRbiWaiverNo] = useState(localStorage.getItem("part1rbiWaiverNo") || "");
  const [rbiWaiverDt, setRbiWaiverDt] = useState(localStorage.getItem("part1rbiWaiverDt") || "");
  const [cbName, setCbName] = useState(localStorage.getItem("part1cbName") || "");
  const [aeo, setAeo] = useState(localStorage.getItem("part1aeo") || "");
  const [consigneeName, setConsigneeName] = useState(localStorage.getItem("part1consigneeName") || "");
  const [consigneeAddress, setConsigneeAddress] = useState(localStorage.getItem("part1consigneeAddress") || "");
  const [gstinType, setGstinType] = useState(localStorage.getItem("part1gstinType") || "");
  const [forexBankAcNo, setForexBankAcNo] = useState(localStorage.getItem("part1forexBankAcNo") || "");
  const [dbkBankAcNo, setDbkBankAcNo] = useState(localStorage.getItem("part1dbkBankAcNo") || "");
  const [ifscNo, setIfscNo] = useState(localStorage.getItem("part1ifscNo") || "");
  const [mode, setMode] = useState(localStorage.getItem("part1mode") || "");
  const [assess, setAssess] = useState(localStorage.getItem("part1assess") || "");
  const [exmn, setExmn] = useState(localStorage.getItem("part1exmn") || "");
  const [jobbing, setJobbing] = useState(localStorage.getItem("part1jobbing") || "");
  const [meis, setMeis] = useState(localStorage.getItem("part1meis") || "");
  const [dbk, setDbk] = useState(localStorage.getItem("part1dbk") || "");
  const [pkgs, setPkgs] = useState(localStorage.getItem("part1pkgs") || "");
  const [grossWeight, setGrossWeight] = useState(localStorage.getItem("part1grossWeight") || "");
  const [volWeight, setVolWeight] = useState(localStorage.getItem("part1volWeight") || "");
  const [packType, setPackType] = useState(localStorage.getItem("part1packType") || "");
  const [ieCode, setIeCode] = useState(localStorage.getItem("part1ieCode") || "");
  const [pan, setPan] = useState(localStorage.getItem("part1pan") || "");
  const [vesselName, setVesselName] = useState(localStorage.getItem("part1vesselName") || "");
  const [portDischarge, setPortDischarge] = useState(localStorage.getItem("part1portDischarge") || "");
  const [exchRate, setExchRate] = useState(localStorage.getItem("part1exchRate") || "");
  const [fobValue, setFobValue] = useState(localStorage.getItem("part1fobValue") || "");
  const [freight, setFreight] = useState(localStorage.getItem("part1freight") || "");
  const [insurance, setInsurance] = useState(localStorage.getItem("part1insurance") || "");
  const [discount, setDiscount] = useState(localStorage.getItem("part1discount") || "");
  const [commission, setCommission] = useState(localStorage.getItem("part1commission") || "");
  const [deductions, setDeductions] = useState(localStorage.getItem("part1deductions") || "");
  const [pc, setPc] = useState(localStorage.getItem("part1pc") || "");
  const [duty, setDuty] = useState(localStorage.getItem("part1duty") || "");
  const [cess, setCess] = useState(localStorage.getItem("part1cess") || "");
  const [dbkClaim, setDbkClaim] = useState(localStorage.getItem("part1dbkClaim") || "");
  const [igstAmt, setIgstAmt] = useState(localStorage.getItem("part1igstAmt") || "");
  const [cessAmt, setCessAmt] = useState(localStorage.getItem("part1cessAmt") || "");
  const [igstValue, setIgstValue] = useState(localStorage.getItem("part1igstValue") || "");
  const [rodtepAmt, setRodtepAmt] = useState(localStorage.getItem("part1rodtepAmt") || "");
  const [rosctlAmt, setRosctlAmt] = useState(localStorage.getItem("part1rosctlAmt") || "");
  const [mawbNo, setMawbNo] = useState(localStorage.getItem("part1mawbNo") || "");
  const [hawbNo, setHawbNo] = useState(localStorage.getItem("part1hawbNo") || "");
  const [loading, setLoading] = useState(false);

  const [cookies, setCookie] = useCookies(["token"]);
  const { user } = useRecoilValue(authAtom);




  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  async function handleSubmitSection1(e) {
    e.preventDefault();
    setLoading(true);
    const jsonData = {
      exportersName: exportersName,
      exportersAddress: exportersAddress,
      type: type,
      adCode: adCode,
      rbiWaiverNo: rbiWaiverNo,
      rbiWaiverDt: rbiWaiverDt,
      cbName: cbName,
      aeo: aeo,
      consigneeName: consigneeName,
      consigneeAddress: consigneeAddress,
      gstinType: gstinType,
      forexBankAcNo: forexBankAcNo,
      dbkBankAcNo: dbkBankAcNo,
      ifscNo: ifscNo,
      mode: mode,
      assess: assess,
      addedByUserId: user.id,
    };

    console.log(jsonData);

    localStorage.setItem("part1exportersName", "");
    localStorage.setItem("part1exportersAddress", "");
    localStorage.setItem("part1type", "");
    localStorage.setItem("part1adCode", "");
    localStorage.setItem("part1rbiWaiverNo", "");
    localStorage.setItem("part1rbiWaiverDt", "");
    localStorage.setItem("part1cbName", "");
    localStorage.setItem("part1aeo", "");
    localStorage.setItem("part1consigneeName", "");
    localStorage.setItem("part1consigneeAddress", "");
    localStorage.setItem("part1gstinType", "");
    localStorage.setItem("part1forexBankAcNo", "");
    localStorage.setItem("part1dbkBankAcNo", "");
    localStorage.setItem("part1ifscNo", "");
    localStorage.setItem("part1mode", "");
    localStorage.setItem("part1assess", "");

    setExportersName("");
    setExportersAddress("");
    setType("");
    setAdCode("");
    setRbiWaiverNo("");
    setRbiWaiverDt("");
    setCbName("");
    setAeo("");
    setConsigneeName("");
    setConsigneeAddress("");
    setGstinType("");
    setForexBankAcNo("");
    setDbkBankAcNo("");
    setIfscNo("");
    setMode("");
    setAssess("");


    
    const response = await axios.post(
      `${BACKEND_URL}/documentslist/shippingbill/part1section1`,
      jsonData,
      {
        headers: {
          Authorization: cookies.token,
          
        },
      }
    );
    setLoading(false);
    alert(response.data.message);
  }

  async function handleSubmitSection2(e) {
    e.preventDefault();
    setLoading(true);
    const jsonData = {
      exmn: exmn,
      jobbing: jobbing,
      meis: meis,
      dbk: dbk,
      pkgs: pkgs,
      grossWeight: grossWeight,
      volWeight: volWeight,
      packType: packType,
      ieCode: ieCode,
      pan: pan,
      vesselName: vesselName,
      portDischarge: portDischarge,
      exchRate: exchRate,
      fobValue: fobValue,
      freight: freight,
      insurance: insurance,
      addedByUserId: user.id,
    };

    localStorage.setItem("part1exmn", "");
    localStorage.setItem("part1jobbing", "");
    localStorage.setItem("part1meis", "");
    localStorage.setItem("part1dbk", "");
    localStorage.setItem("part1pkgs", "");
    localStorage.setItem("part1grossWeight", "");
    localStorage.setItem("part1volWeight", "");
    localStorage.setItem("part1packType", "");
    localStorage.setItem("part1ieCode", "");
    localStorage.setItem("part1pan", "");
    localStorage.setItem("part1vesselName", "");
    localStorage.setItem("part1portDischarge", "");
    localStorage.setItem("part1exchRate", "");
    localStorage.setItem("part1fobValue", "");
    localStorage.setItem("part1freight", "");
    localStorage.setItem("part1insurance", "");

    setExmn("");
    setJobbing("");
    setMeis("");
    setDbk("");
    setPkgs("");
    setGrossWeight("");
    setVolWeight("");
    setPackType("");
    setIeCode("");
    setPan("");
    setVesselName("");
    setPortDischarge("");
    setExchRate("");
    setFobValue("");
    setFreight("");
    setInsurance("");



    try {
      
      const response = await axios.post(
        `${BACKEND_URL}/documentslist/shippingbill/part1section2`,
        jsonData,
        {
          headers: {
            Authorization: cookies.token,
          },
        }
      );
      
      alert(response.data.message);
    } catch (error) {
      alert(error.response.data.message);
    }
    setLoading(false);
   
  }



  async function handleSubmitSection3(e) {
    e.preventDefault();
    setLoading(true);
    const jsonData = {
      discount: discount,
      commission: commission,
      deductions: deductions,
      pc: pc,
      duty: duty,
      cess: cess,
      dbkClaim: dbkClaim,
      igstAmt: igstAmt,
      cessAmt: cessAmt,
      igstValue: igstValue,
      rodtepAmt: rodtepAmt,
      rosctlAmt: rosctlAmt,
      mawbNo: mawbNo,
      hawbNo: hawbNo,
      addedByUserId: user.id,
    };

    localStorage.setItem("part1discount", "");
    localStorage.setItem("part1commission", "");
    localStorage.setItem("part1deductions", "");
    localStorage.setItem("part1pc", "");
    localStorage.setItem("part1duty", "");
    localStorage.setItem("part1cess", "");
    localStorage.setItem("part1dbkClaim", "");
    localStorage.setItem("part1igstAmt", "");
    localStorage.setItem("part1cessAmt", "");
    localStorage.setItem("part1igstValue", "");
    localStorage.setItem("part1rodtepAmt", "");
    localStorage.setItem("part1rosctlAmt", "");
    localStorage.setItem("part1mawbNo", "");
    localStorage.setItem("part1hawbNo", "");

    setDiscount("");
    setCommission("");
    setDeductions("");
    setPc("");
    setDuty("");
    setCess("");
    setDbkClaim("");
    setIgstAmt("");
    setCessAmt("");
    setIgstValue("");
    setRodtepAmt("");
    setRosctlAmt("");
    setMawbNo("");
    setHawbNo("");

    const response = await axios.post(
      `${BACKEND_URL}/documentslist/shippingbill/part1section3`,
      jsonData,
      {
        headers: {
          Authorization: cookies.token,
        },
      }
    );
    setLoading(false);
    alert(response.data.message);
  }

  return (
    <div className="bg-[#e6e7e9] w-full h-full min-h-screen">
      <div className="container mx-auto px-4 py-8 ">
        {loading && <Loading />}

     


        <div className="container text-center text-green-700 font-sans font-semibold text-[24px]">
          Shipping Bill - Part 1
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 mt-2 gap-4">
          <div className="bg-white p-4 rounded-md">
            <div className="container text-center text-green-700 font-sans font-semibold text-xl">
              Section 1
            </div>
            <InputField
              label="Exporters Name"
              value={exportersName}
              onChange={(e) => {
          setExportersName(e.target.value);
          localStorage.setItem("part1exportersName", e.target.value);
              }}
            />
            <InputField
              label="Exporters Address"
              value={exportersAddress}
              onChange={(e) => {
          setExportersAddress(e.target.value);
          localStorage.setItem("part1exportersAddress", e.target.value);
              }}
            />
            <InputField
              label="Type"
              value={type}
              onChange={(e) => {
          setType(e.target.value);
          localStorage.setItem("part1type", e.target.value);
              }}
            />
            <InputField
              label="AD Code"
              value={adCode}
              onChange={(e) => {
          setAdCode(e.target.value);
          localStorage.setItem("part1adCode", e.target.value);
              }}
            />
            <InputField
              label="RBI Waiver No"
              value={rbiWaiverNo}
              onChange={(e) => {
          setRbiWaiverNo(e.target.value);
          localStorage.setItem("part1rbiWaiverNo", e.target.value);
              }}
            />
            <InputField
              label="RBI Waiver Date"
              value={rbiWaiverDt}
              onChange={(e) => {
          setRbiWaiverDt(e.target.value);
          localStorage.setItem("part1rbiWaiverDt", e.target.value);
              }}
            />
            <InputField
              label="CB Name"
              value={cbName}
              onChange={(e) => {
          setCbName(e.target.value);
          localStorage.setItem("part1cbName", e.target.value);
              }}
            />
            <InputField
              label="AEO"
              value={aeo}
              onChange={(e) => {
          setAeo(e.target.value);
          localStorage.setItem("part1aeo", e.target.value);
              }}
            />
            <InputField
              label="Consignee Name"
              value={consigneeName}
              onChange={(e) => {
          setConsigneeName(e.target.value);
          localStorage.setItem("part1consigneeName", e.target.value);
              }}
            />
            <InputField
              label="Consignee Address"
              value={consigneeAddress}
              onChange={(e) => {
          setConsigneeAddress(e.target.value);
          localStorage.setItem("part1consigneeAddress", e.target.value);
              }}
            />
            <InputField
              label="GSTIN Type"
              value={gstinType}
              onChange={(e) => {
          setGstinType(e.target.value);
          localStorage.setItem("part1gstinType", e.target.value);
              }}
            />
            <InputField
              label="Forex Bank AC No"
              value={forexBankAcNo}
              onChange={(e) => {
          setForexBankAcNo(e.target.value);
          localStorage.setItem("part1forexBankAcNo", e.target.value);
              }}
            />
            <InputField
              label="DBK Bank AC No"
              value={dbkBankAcNo}
              onChange={(e) => {
          setDbkBankAcNo(e.target.value);
          localStorage.setItem("part1dbkBankAcNo", e.target.value);
              }}
            />
            <InputField
              label="IFSC No"
              value={ifscNo}
              onChange={(e) => {
          setIfscNo(e.target.value);
          localStorage.setItem("part1ifscNo", e.target.value);
              }}
            />
            <InputField
              label="Mode"
              value={mode}
              onChange={(e) => {
          setMode(e.target.value);
          localStorage.setItem("part1mode", e.target.value);
              }}
            />
            <InputField
              label="Assess"
              value={assess}
              onChange={(e) => {
          setAssess(e.target.value);
          localStorage.setItem("part1assess", e.target.value);
              }}
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
              label="Exmn"
              value={exmn}
              onChange={(e) => {
          setExmn(e.target.value);
          localStorage.setItem("part1exmn", e.target.value);
              }}
            />
            <InputField
              label="Jobbing"
              value={jobbing}
              onChange={(e) => {
          setJobbing(e.target.value);
          localStorage.setItem("part1jobbing", e.target.value);
              }}
            />
            <InputField
              label="Meis"
              value={meis}
              onChange={(e) => {
          setMeis(e.target.value);
          localStorage.setItem("part1meis", e.target.value);
              }}
            />
            <InputField
              label="DBK"
              value={dbk}
              onChange={(e) => {
          setDbk(e.target.value);
          localStorage.setItem("part1dbk", e.target.value);
              }}
            />
            <InputField
              label="Pkgs"
              value={pkgs}
              onChange={(e) => {
          setPkgs(e.target.value);
          localStorage.setItem("part1pkgs", e.target.value);
              }}
            />
            <InputField
              label="Gross Weight"
              value={grossWeight}
              onChange={(e) => {
          setGrossWeight(e.target.value);
          localStorage.setItem("part1grossWeight", e.target.value);
              }}
            />
            <InputField
              label="Vol Weight"
              value={volWeight}
              onChange={(e) => {
          setVolWeight(e.target.value);
          localStorage.setItem("part1volWeight", e.target.value);
              }}
            />
            <InputField
              label="Pack Type"
              value={packType}
              onChange={(e) => {
          setPackType(e.target.value);
          localStorage.setItem("part1packType", e.target.value);
              }}
            />
            <InputField
              label="IE Code"
              value={ieCode}
              onChange={(e) => {
          setIeCode(e.target.value);
          localStorage.setItem("part1ieCode", e.target.value);
              }}
            />
            <InputField
              label="Pan"
              value={pan}
              onChange={(e) => {
          setPan(e.target.value);
          localStorage.setItem("part1pan", e.target.value);
              }}
            />
            <InputField
              label="Vessel Name"
              value={vesselName}
              onChange={(e) => {
          setVesselName(e.target.value);
          localStorage.setItem("part1vesselName", e.target.value);
              }}
            />
            <InputField
              label="Port Discharge"
              value={portDischarge}
              onChange={(e) => {
          setPortDischarge(e.target.value);
          localStorage.setItem("part1portDischarge", e.target.value);
              }}
            />
            <InputField
              label="Exch Rate"
              value={exchRate}
              onChange={(e) => {
          setExchRate(e.target.value);
          localStorage.setItem("part1exchRate", e.target.value);
              }}
            />
            <InputField
              label="Fob Value"
              value={fobValue}
              onChange={(e) => {
          setFobValue(e.target.value);
          localStorage.setItem("part1fobValue", e.target.value);
              }}
            />
            <InputField
              label="Freight"
              value={freight}
              onChange={(e) => {
          setFreight(e.target.value);
          localStorage.setItem("part1freight", e.target.value);
              }}
            />
            <InputField
              label="Insurance"
              value={insurance}
              onChange={(e) => {
          setInsurance(e.target.value);
          localStorage.setItem("part1insurance", e.target.value);
              }}
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
              label="Discount"
              value={discount}
              onChange={(e) => {
          setDiscount(e.target.value);
          localStorage.setItem("part1discount", e.target.value);
              }}
            />
            <InputField
              label="Commission"
              value={commission}
              onChange={(e) => {
          setCommission(e.target.value);
          localStorage.setItem("part1commission", e.target.value);
              }}
            />
            <InputField
              label="Deductions"
              value={deductions}
              onChange={(e) => {
          setDeductions(e.target.value);
          localStorage.setItem("part1deductions", e.target.value);
              }}
            />
            <InputField
              label="PC"
              value={pc}
              onChange={(e) => {
          setPc(e.target.value);
          localStorage.setItem("part1pc", e.target.value);
              }}
            />
            <InputField
              label="Duty"
              value={duty}
              onChange={(e) => {
          setDuty(e.target.value);
          localStorage.setItem("part1duty", e.target.value);
              }}
            />
            <InputField
              label="Cess"
              value={cess}
              onChange={(e) => {
          setCess(e.target.value);
          localStorage.setItem("part1cess", e.target.value);
              }}
            />
            <InputField
              label="DBK Claim"
              value={dbkClaim}
              onChange={(e) => {
          setDbkClaim(e.target.value);
          localStorage.setItem("part1dbkClaim", e.target.value);
              }}
            />
            <InputField
              label="IGST Amt"
              value={igstAmt}
              onChange={(e) => {
          setIgstAmt(e.target.value);
          localStorage.setItem("part1igstAmt", e.target.value);
              }}
            />
            <InputField
              label="Cess Amt"
              value={cessAmt}
              onChange={(e) => {
          setCessAmt(e.target.value);
          localStorage.setItem("part1cessAmt", e.target.value);
              }}
            />
            <InputField
              label="IGST Value"
              value={igstValue}
              onChange={(e) => {
          setIgstValue(e.target.value);
          localStorage.setItem("part1igstValue", e.target.value);
              }}
            />
            <InputField
              label="Rodtep Amt"
              value={rodtepAmt}
              onChange={(e) => {
          setRodtepAmt(e.target.value);
          localStorage.setItem("part1rodtepAmt", e.target.value);
              }}
            />
            <InputField
              label="Rosctl Amt"
              value={rosctlAmt}
              onChange={(e) => {
          setRosctlAmt(e.target.value);
          localStorage.setItem("part1rosctlAmt", e.target.value);
              }}
            />
            <InputField
              label="Mawb No"
              value={mawbNo}
              onChange={(e) => {
          setMawbNo(e.target.value);
          localStorage.setItem("part1mawbNo", e.target.value);
              }}
            />
            <InputField
              label="Hawb No"
              value={hawbNo}
              onChange={(e) => {
          setHawbNo(e.target.value);
          localStorage.setItem("part1hawbNo", e.target.value);
              }}
            />

            <NewDataButtons
              backLink={"/datamanagement"}
              nextLink={"/datamanagement/newdata/part2"}
              handleSubmit={handleSubmitSection3}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Part1;
