import { useState } from "react";
import FileUpload from "./pages/Home/GST/DataManagement/existingdata/FileUpload";
import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Part1 from "./pages/Home/GST/DataManagement/newdata/DocumentList/ShippingBill/Part1";
import Part2 from "./pages/Home/GST/DataManagement/newdata/DocumentList/ShippingBill/Part2";
import Part3 from "./pages/Home/GST/DataManagement/newdata/DocumentList/ShippingBill/Part3";
import Part4 from "./pages/Home/GST/DataManagement/newdata/DocumentList/ShippingBill/Part4";
import Part5 from "./pages/Home/GST/DataManagement/newdata/DocumentList/ShippingBill/Part5";

import HomePage from "./pages/Home/HomPage";
import Signin from "./pages/auth/SIgnin";
import ProtectedRoute from "./pages/components/ProtectedRoute";
import Register from "./pages/auth/Register";
import DataManagementPage from "./pages/Home/GST/DataManagement/DataManagementPage";
import DownloadDataPage from "./pages/Home/GST/DataManagement/DownloadData/DownloadDataPage";

import Admin from "./pages/Home/GST/ProcessMonatring/Admin";
import NewDataAnalytics from "./pages/Home/GST/DataManagement/newdata/Analytics/NewDataAnalytics";
import DirectExport from "./pages/Home/GST/DataManagement/newdata/Form/DirectExport/DirectExport";
import IndirectExport from "./pages/Home/GST/DataManagement/newdata/Form/IndirectExport/IndirectExport";
import Invoice from "./pages/Home/GST/DataManagement/newdata/DocumentList/Invoice/Invoice";
import EWayBillDetails from "./pages/Home/GST/DataManagement/newdata/DocumentList/EWayBill/EWayBillDetails";

import NotFound from "./pages/NotFound";
import UnderDevelopment from "./pages/UnderConstruction";
import EPCGLicensePage from "./pages/Home/GST/DataManagement/newdata/DocumentList/EPCGLicense/EPCGLicensePage";

import EBRCPage from "./pages/Home/GST/DataManagement/newdata/DocumentList/EBRC/EBRCpage";
import AdvanceLicensePage from "./pages/Home/GST/DataManagement/newdata/DocumentList/AdvanceLicense/AdvanceLicensePage";
import EInvoicePage from "./pages/Home/GST/DataManagement/newdata/DocumentList/EInvoice/EInvoicePage";
import ShippingBillLayout from "./Layouts/ShippingBillLayout";
import NewDataLayout from "./Layouts/NewDataLayout";
import EpcgLicenseSummary from "./pages/Home/GST/DataManagement/newdata/Report/EpcgLicenseSummary";
import EpcgAnalytics from "./pages/Home/GST/DataManagement/newdata/Report/EPCGLicenceSummary/EpcgAnalytics";
import GstHomePage from "./pages/Home/GST/GstHomePage";
import ManageClient from "./pages/Home/ManageClient";

function App() {
  return (
    <Router>
      <Routes>
        {/* <Route path="/">
            <Home />
            </Route> */}
        <Route path="/signin" element={<Signin />} />
        <Route path="/register" element={<Register />} />

        <Route path="/" element={<ProtectedRoute element={<HomePage />} />} />

        <Route path="/manage-client" element={<ProtectedRoute element={<ManageClient />} />} />

        <Route path="/gst" element={<ProtectedRoute element={<GstHomePage />} />} />
        <Route path="/dgft" element={<ProtectedRoute element={<UnderDevelopment />} />} />

        <Route
          path="/gst/datamanagement"
          element={<ProtectedRoute element={<DataManagementPage />} />}
        />
        <Route
          path="/gst/datamanagement/newdata"
          element={<ProtectedRoute element={<NewDataLayout />} />}
        >
          <Route path="data">
            <Route path="client-master" />
            <Route path="other-details" />
          </Route>
          <Route path="form">
            <Route path="shipping-bill" />
            <Route path="invoice" />
            <Route path="e-invoice" />
            <Route path="e-brc" />
            <Route path="e-way-bill" />
            <Route path="epcg-lic" />
            <Route path="advance-lic" />
            <Route path="direct-export" element={<ProtectedRoute element={<DirectExport/>} />} />
            <Route path="indirect-export" element={<ProtectedRoute element={<IndirectExport />} />} />
          </Route>
          <Route path="documents">
            <Route path="epcg-lic" element={<ProtectedRoute element={<EPCGLicensePage />} />} />
            <Route path="advance-lic" element={<ProtectedRoute element={<AdvanceLicensePage />} />} />
            <Route path="shipping-bill" element={ <ProtectedRoute element={ <ShippingBillLayout />} />}>
              <Route
                path="part1"
                element={<ProtectedRoute element={<Part1 />} />}
              />
              <Route
                path="part2"
                element={<ProtectedRoute element={<Part2 />} />}
              />
              <Route
                path="part3"
                element={<ProtectedRoute element={<Part3 />} />}
              />
              <Route
                path="part4"
                element={<ProtectedRoute element={<Part4 />} />}
              />
              <Route
                path="part5"
                element={<ProtectedRoute element={<Part5 />} />}
              />
            </Route>
            <Route path="invoice" element={<ProtectedRoute element={<Invoice />} />} />
            <Route path="e-invoice" element={<ProtectedRoute element={<EInvoicePage />} />} />
            <Route path="e-brc" element={<ProtectedRoute element={<EBRCPage />} />} />
            <Route path="e-way-bill" element={<ProtectedRoute element={<EWayBillDetails />} />} />
            <Route path="subsidy" />
          </Route>          <Route path="report">
            <Route path="epcg-lic-summary" element={<ProtectedRoute element={<EpcgLicenseSummary />} />} />
            <Route path="epcg-analytics" element={<ProtectedRoute element={<EpcgAnalytics />} />} />
            <Route path="advance-lic-summary" />
            <Route path="party-wise-epcg-lic-summary" />
            <Route path="party-wise-advance-lic-summary" />
          </Route>
        </Route>

        {/* Data analitics */}
        {/* <Route
          path="/datamanagement/newdata/dataanalytics"
          element={<ProtectedRoute element={<NewDataAnalytics />} />}
        /> */}
        {/* <Route
          path="/datamanagement/directExport"
          element={<ProtectedRoute element={<DirectExport />} />}
        /> */}
        {/* <Route
          path="/datamanagement/indirectExport"
          element={<ProtectedRoute element={<IndirectExport />} />}
        /> */}
        {/* <Route
          path="/datamanagement/advance-license"
          element={<ProtectedRoute element={<AdvanceLicensePage />} />}
        /> */}
        <Route
          path="/gst/datamanagement/existingdata"
          element={<ProtectedRoute element={<FileUpload />} />}
        />

        {/* <Route
          path="/datamanagement/invoice"
          element={<ProtectedRoute element={<Invoice />} />}
        /> */}
        {/* <Route
          path="/datamanagement/e-invoice"
          element={<ProtectedRoute element={<EInvoicePage />} />}
        /> */}
        {/* <Route
          path="/datamanagement/e-way-bill"
          element={<ProtectedRoute element={<EWayBillDetails />} />}
        /> */}
        {/* <Route
          path="/datamanagement/epcg-license"
          element={<ProtectedRoute element={<EPCGLicensePage />} />}
        /> */}
        {/* <Route
          path="/datamanagement/ebrc"
          element={<ProtectedRoute element={<EBRCPage />} />}
        /> */}

        {/* //? data management section */}

        <Route
          path="/gst/datamanagement/downloaddata"
          element={<ProtectedRoute element={<DownloadDataPage />} />}
        />

        {/* //? process monitoring section */}
        <Route path="/gst/admin" element={<ProtectedRoute element={<Admin />} />} />
        {/* <Route path="/datamanagement/*" element={<UnderDevelopment />} /> */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
