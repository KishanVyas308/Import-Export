import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Loading from "../../../../../components/Loading";
import { BACKEND_URL } from "../../../../../../Globle";
import { useCookies } from "react-cookie";
import NewDataButtons from "../../NewDataButtons";
import InputField from "../../../../../components/InputField";
import { useRecoilValue } from "recoil";
import { authAtom } from "../../../../../../atoms/authAtom";

const Part3 = () => {
  const [invsn, setInvsn] = useState(localStorage.getItem("part3invsn") || "");
  const [itemsn, setItemsn] = useState(localStorage.getItem("part3itemsn") || "");
  const [hsCd, setHsCd] = useState(localStorage.getItem("part3hsCd") || "");
  const [description, setDescription] = useState(localStorage.getItem("part3description") || "");
  const [quantity, setQuantity] = useState(localStorage.getItem("part3quantity") || "");
  const [uqc, setUqc] = useState(localStorage.getItem("part3uqc") || "");
  const [rate, setRate] = useState(localStorage.getItem("part3rate") || "");
  const [valueFc, setValueFc] = useState(localStorage.getItem("part3valueFc") || "");
  const [fobInr, setFobInr] = useState(localStorage.getItem("part3fobInr") || "");
  const [pmv, setPmv] = useState(localStorage.getItem("part3pmv") || "");
  const [dutyAmt, setDutyAmt] = useState(localStorage.getItem("part3dutyAmt") || "");
  const [cessRt, setCessRt] = useState(localStorage.getItem("part3cessRt") || "");
  const [cesamt, setCesamt] = useState(localStorage.getItem("part3cesamt") || "");
  const [dbkclmd, setDbkclmd] = useState(localStorage.getItem("part3dbkclmd") || "");
  const [igststat, setIgststat] = useState(localStorage.getItem("part3igststat") || "");
  const [igstValue, setIgstValue] = useState(localStorage.getItem("part3igstValue") || "");
  const [igstAmount, setIgstAmount] = useState(localStorage.getItem("part3igstAmount") || "");
  const [schcod, setSchcod] = useState(localStorage.getItem("part3schcod") || "");
  const [schemeDescription, setSchemeDescription] = useState(localStorage.getItem("part3schemeDescription") || "");
  const [sqcMsr, setSqcMsr] = useState(localStorage.getItem("part3sqcMsr") || "");
  const [sqcUqc, setSqcUqc] = useState(localStorage.getItem("part3sqcUqc") || "");
  const [stateOfOrigin, setStateOfOrigin] = useState(localStorage.getItem("part3stateOfOrigin") || "");
  const [districtOfOrigin, setDistrictOfOrigin] = useState(localStorage.getItem("part3districtOfOrigin") || "");
  const [ptAbroad, setPtAbroad] = useState(localStorage.getItem("part3ptAbroad") || "");
  const [compCess, setCompCess] = useState(localStorage.getItem("part3compCess") || "");
  const [endUse, setEndUse] = useState(localStorage.getItem("part3endUse") || "");
  const [ftaBenefitAvailed, setFtaBenefitAvailed] = useState(localStorage.getItem("part3ftaBenefitAvailed") || "");
  const [rewardBenefit, setRewardBenefit] = useState(localStorage.getItem("part3rewardBenefit") || "");
  const [thirdPartyItem, setThirdPartyItem] = useState(localStorage.getItem("part3thirdPartyItem") || "");
  const navigate = useNavigate();

  useEffect(() => { 
    localStorage.setItem("part3invsn", invsn);
    localStorage.setItem("part3itemsn", itemsn);
    localStorage.setItem("part3hsCd", hsCd);
    localStorage.setItem("part3description", description);
    localStorage.setItem("part3quantity", quantity);
    localStorage.setItem("part3uqc", uqc);
    localStorage.setItem("part3rate", rate);
    localStorage.setItem("part3valueFc", valueFc);
    localStorage.setItem("part3fobInr", fobInr);
    localStorage.setItem("part3pmv", pmv);
    localStorage.setItem("part3dutyAmt", dutyAmt);
    localStorage.setItem("part3cessRt", cessRt);
    localStorage.setItem("part3cesamt", cesamt);
    localStorage.setItem("part3dbkclmd", dbkclmd);
    localStorage.setItem("part3igststat", igststat);
    localStorage.setItem("part3igstValue", igstValue);
    localStorage.setItem("part3igstAmount", igstAmount);
    localStorage.setItem("part3schcod", schcod);
    localStorage.setItem("part3schemeDescription", schemeDescription);
    localStorage.setItem("part3sqcMsr", sqcMsr);
    localStorage.setItem("part3sqcUqc", sqcUqc);
    localStorage.setItem("part3stateOfOrigin", stateOfOrigin);
    localStorage.setItem("part3districtOfOrigin", districtOfOrigin);
    localStorage.setItem("part3ptAbroad", ptAbroad);
    localStorage.setItem("part3compCess", compCess);
    localStorage.setItem("part3endUse", endUse);
    localStorage.setItem("part3ftaBenefitAvailed", ftaBenefitAvailed);
    localStorage.setItem("part3rewardBenefit", rewardBenefit);
    localStorage.setItem("part3thirdPartyItem", thirdPartyItem);
  }, [
    invsn,
    itemsn,
    hsCd,
    description,
    quantity,
    uqc,
    rate,
    valueFc,
    fobInr,
    pmv,
    dutyAmt,
    cessRt,
    cesamt,
    dbkclmd,
    igststat,
    igstValue,
    igstAmount,
    schcod,
    schemeDescription,
    sqcMsr,
    sqcUqc,
    stateOfOrigin,
    districtOfOrigin,
    ptAbroad,
    compCess,
    endUse,
    ftaBenefitAvailed,
    rewardBenefit,
    thirdPartyItem,
  ]);

  const [cookies, setCookie] = useCookies(["token"]);
  const { user } = useRecoilValue(authAtom);

  const [loading, setLoading] = useState(false);

  const handleSubmitSection1 = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    const jsonData = {
      invsn: invsn,
      itemsn: itemsn,
      hsCd: hsCd,
      description: description,
      quantity: quantity,
      uqc: uqc,
      rate: rate,
      valueFc: valueFc,
      fobInr: fobInr,
      pmv: pmv,
      addedByUserId: user.id,
    };
    const response = await axios.post(
      `${BACKEND_URL}/documentslist/shippingbill/part3section1`,
      jsonData,
      {
        headers: {
          Authorization: cookies.token,
        },
      }
    );
    setLoading(false);
    alert(response.data.message);

    // Remove from local storage and reset state
    localStorage.removeItem("part3invsn");
    localStorage.removeItem("part3itemsn");
    localStorage.removeItem("part3hsCd");
    localStorage.removeItem("part3description");
    localStorage.removeItem("part3quantity");
    localStorage.removeItem("part3uqc");
    localStorage.removeItem("part3rate");
    localStorage.removeItem("part3valueFc");
    localStorage.removeItem("part3fobInr");
    localStorage.removeItem("part3pmv");

    setInvsn("");
    setItemsn("");
    setHsCd("");
    setDescription("");
    setQuantity("");
    setUqc("");
    setRate("");
    setValueFc("");
    setFobInr("");
    setPmv("");
  };

  const handleSubmitSection2 = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    const jsonData = {
      dutyAmt: dutyAmt,
      cessRt: cessRt,
      cesamt: cesamt,
      dbkclmd: dbkclmd,
      igststat: igststat,
      igstValue: igstValue,
      igstAmount: igstAmount,
      schcod: schcod,
      schemeDescription: schemeDescription,
      sqcMsr: sqcMsr,
      addedByUserId: user.id,
    };
    const response = await axios.post(
      `${BACKEND_URL}/documentslist/shippingbill/part3section2`,
      jsonData,
      {
        headers: {
          Authorization: cookies.token,
        },
      }
    );
    setLoading(false);
    alert(response.data.message);

    // Remove from local storage and reset state
    localStorage.removeItem("part3dutyAmt");
    localStorage.removeItem("part3cessRt");
    localStorage.removeItem("part3cesamt");
    localStorage.removeItem("part3dbkclmd");
    localStorage.removeItem("part3igststat");
    localStorage.removeItem("part3igstValue");
    localStorage.removeItem("part3igstAmount");
    localStorage.removeItem("part3schcod");
    localStorage.removeItem("part3schemeDescription");
    localStorage.removeItem("part3sqcMsr");

    setDutyAmt("");
    setCessRt("");
    setCesamt("");
    setDbkclmd("");
    setIgststat("");
    setIgstValue("");
    setIgstAmount("");
    setSchcod("");
    setSchemeDescription("");
    setSqcMsr("");
  };

  const handleSubmitSection3 = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    const jsonData = {
      sqcUqc: sqcUqc,
      stateOfOrigin: stateOfOrigin,
      districtOfOrigin: districtOfOrigin,
      ptAbroad: ptAbroad,
      compCess: compCess,
      endUse: endUse,
      ftaBenefitAvailed: ftaBenefitAvailed,
      rewardBenefit: rewardBenefit,
      thirdPartyItem: thirdPartyItem,
      addedByUserId: user.id,
    };
    const response = await axios.post(
      `${BACKEND_URL}/documentslist/shippingbill/part3section3`,
      jsonData,
      {
        headers: {
          Authorization: cookies.token,
        },
      }
    );
    setLoading(false);
    alert(response.data.message);

    // Remove from local storage and reset state
    localStorage.removeItem("part3sqcUqc");
    localStorage.removeItem("part3stateOfOrigin");
    localStorage.removeItem("part3districtOfOrigin");
    localStorage.removeItem("part3ptAbroad");
    localStorage.removeItem("part3compCess");
    localStorage.removeItem("part3endUse");
    localStorage.removeItem("part3ftaBenefitAvailed");
    localStorage.removeItem("part3rewardBenefit");
    localStorage.removeItem("part3thirdPartyItem");

    setSqcUqc("");
    setStateOfOrigin("");
    setDistrictOfOrigin("");
    setPtAbroad("");
    setCompCess("");
    setEndUse("");
    setFtaBenefitAvailed("");
    setRewardBenefit("");
    setThirdPartyItem("");
  };


  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  return (
    <div className="bg-[#e6e7e9] w-full h-full min-h-screen">
      <div className="container mx-auto px-4 py-8 ">
        {loading && <Loading />}

   

        <div className="container text-center text-green-700 font-sans font-semibold text-[24px]">
        Shipping Bill - Part 3
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 mt-2 gap-4">
          <div className="bg-white p-4 rounded-md">
            <div className="container text-center text-green-700 font-sans font-semibold text-xl">
              Section 1
            </div>
            <InputField label="invsn" value={invsn} onChange={(e) => setInvsn(e.target.value)} />
            <InputField label="itemsn" value={itemsn} onChange={(e) => setItemsn(e.target.value)} />
            <InputField label="hsCd" value={hsCd} onChange={(e) => setHsCd(e.target.value)} />
            <InputField label="description" value={description} onChange={(e) => setDescription(e.target.value)} />
            <InputField label="quantity" value={quantity} onChange={(e) => setQuantity(e.target.value)} />
            <InputField label="uqc" value={uqc} onChange={(e) => setUqc(e.target.value)} />
            <InputField label="rate" value={rate} onChange={(e) => setRate(e.target.value)} />
            <InputField label="valueFc" value={valueFc} onChange={(e) => setValueFc(e.target.value)} />
            <InputField label="fobInr" value={fobInr} onChange={(e) => setFobInr(e.target.value)} />
            <InputField label="pmv" value={pmv} onChange={(e) => setPmv(e.target.value)} />
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
            <InputField label="dutyAmt" value={dutyAmt} onChange={(e) => setDutyAmt(e.target.value)} />
            <InputField label="cessRt" value={cessRt} onChange={(e) => setCessRt(e.target.value)} />
            <InputField label="cesamt" value={cesamt} onChange={(e) => setCesamt(e.target.value)} />
            <InputField label="dbkclmd" value={dbkclmd} onChange={(e) => setDbkclmd(e.target.value)} />
            <InputField label="igststat" value={igststat} onChange={(e) => setIgststat(e.target.value)} />
            <InputField label="igstValue" value={igstValue} onChange={(e) => setIgstValue(e.target.value)} />
            <InputField label="igstAmount" value={igstAmount} onChange={(e) => setIgstAmount(e.target.value)} />
            <InputField label="schcod" value={schcod} onChange={(e) => setSchcod(e.target.value)} />
            <InputField label="schemeDescription" value={schemeDescription} onChange={(e) => setSchemeDescription(e.target.value)} />
            <InputField label="sqcMsr" value={sqcMsr} onChange={(e) => setSqcMsr(e.target.value)} />
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
            <InputField label="sqcUqc" value={sqcUqc} onChange={(e) => setSqcUqc(e.target.value)} />
            <InputField label="stateOfOrigin" value={stateOfOrigin} onChange={(e) => setStateOfOrigin(e.target.value)} />
            <InputField label="districtOfOrigin" value={districtOfOrigin} onChange={(e) => setDistrictOfOrigin(e.target.value)} />
            <InputField label="ptAbroad" value={ptAbroad} onChange={(e) => setPtAbroad(e.target.value)} />
            <InputField label="compCess" value={compCess} onChange={(e) => setCompCess(e.target.value)} />
            <InputField label="endUse" value={endUse} onChange={(e) => setEndUse(e.target.value)} />
            <InputField label="ftaBenefitAvailed" value={ftaBenefitAvailed} onChange={(e) => setFtaBenefitAvailed(e.target.value)} />
            <InputField label="rewardBenefit" value={rewardBenefit} onChange={(e) => setRewardBenefit(e.target.value)} />
            <InputField label="thirdPartyItem" value={thirdPartyItem} onChange={(e) => setThirdPartyItem(e.target.value)} />


            <NewDataButtons
              backLink={"/datamanagement/newdata/part2"}
              nextLink={"/datamanagement/newdata/part4"}
              handleSubmit={handleSubmitSection3}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Part3;
