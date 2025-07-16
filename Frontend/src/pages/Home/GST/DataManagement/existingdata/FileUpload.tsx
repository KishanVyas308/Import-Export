import React, { useEffect, useState } from "react";
import axios from "axios";
import * as XLSX from "xlsx";
import Loading from "../../../../components/Loading";
import { BACKEND_URL } from "../../../../../Globle";
import { useCookies } from "react-cookie";
import ExistingDataHeader from "./ExistingDataHeader";

const FileUpload = () => {
  const [file, setFile] = useState<any>(null);
  const [startLine, setStartLine] = useState("");
  const [endLine, setEndLine] = useState("");
  const [uploadAll, setUploadAll] = useState(true);
  const [sheetNames, setSheetNames] = useState([]);
  const [selectedSheetName, setSelectedSheetName] = useState("");
  const [sheetData, setSheetData] = useState([]);
  const [cookies] = useCookies(["token"]);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);

    if (selectedFile) {
      const reader = new FileReader();
      reader.onload = (event : any) => {
        const data = new Uint8Array(event.target.result);
        const workbook = XLSX.read(data, { type: "array" });

        // Extract sheet names
        const sheets : any = workbook.SheetNames;
        setSheetNames(sheets);

        // Automatically select the first sheet and read its data
        if (sheets.length > 0) {
          const firstSheet = workbook.Sheets[sheets[0]];
          const jsonData : any= XLSX.utils.sheet_to_json(firstSheet, { header: "A" });
          setSheetData(jsonData);
          setSelectedSheetName(sheets[0]);
        }
      };
      reader.readAsArrayBuffer(selectedFile);
    }
  };

  const handleSheetSelection = (sheetName) => {
    setSelectedSheetName(sheetName);

    const reader = new FileReader();
    reader.onload = (event : any) => {
      const data = new Uint8Array(event.target.result);
      const workbook = XLSX.read(data, { type: "array" });

      // Get data for selected sheet
      const worksheet = workbook.Sheets[sheetName];
      const jsonData : any = XLSX.utils.sheet_to_json(worksheet, { header: "A" });

      setSheetData(jsonData);
    };
    reader.readAsArrayBuffer(file);
  };

  const handleToggleChange = () => {
    setUploadAll(!uploadAll);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file || (!uploadAll && (!startLine || !endLine))) {
      alert("Please fill in all fields");
      return;
    }

    if (!uploadAll && Number(startLine) > Number(endLine)) {
      alert("Enter a valid starting and ending number");
      return;
    }

    if (!uploadAll && Number(startLine) <= 0) {
      alert("Invalid row number");
      return;
    }

    if (selectedSheetName === "") {
      alert("Select a sheet");
      return;
    }

    // Adjust startLine and endLine for 0-based index
    let start = uploadAll ? 7 : Number(startLine);
    let end = uploadAll ? sheetData.length : Number(endLine);

    if (start >= end || end > sheetData.length) {
      alert("Invalid range specified");
      return;
    }

    const range = getExcelCellRange(start, end);
    const reader = new FileReader();

    reader.onload = async (event:any) => {
      const data = new Uint8Array(event.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const worksheet = workbook.Sheets[selectedSheetName];

      const sheetJsonData = XLSX.utils.sheet_to_json(worksheet, {
        range: range,
        skipHidden: false,
        header: "A",
      });

      if (sheetJsonData.length === 0) {
        alert("No data found in the specified range");
        return;
      }

      setLoading(true);
      const formData = new FormData();
      formData.append("sheetJsonData", JSON.stringify(sheetJsonData));
      formData.append("companyName", sheetData[0]["A"]); // Assuming company name is in the first cell

      try {
        const response = await axios.post(`${BACKEND_URL}/ex/upload`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            "Authorization": cookies.token,
          },
        });
        setLoading(false);
        alert(response.data.message);
        
      } catch (error) {
        setLoading(false);
        alert("Failed to upload data");
      }
    };

    reader.readAsArrayBuffer(file);
  };

  const getExcelCellRange = (startRow, endRow) => {
    const startCell = `A${startRow}`;
    const endCell = `R${endRow}`; // Adjust 'R' based on your sheet's last column
    return `${startCell}:${endCell}`;
  };

  const handleStartLineChange = (e) => {
    setStartLine(e.target.value);
  };

  const handleEndLineChange = (e) => {
    setEndLine(e.target.value);
  };

  useEffect(() => {
    window.scrollTo({top: 0, behavior: 'smooth'});
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {loading && <Loading />}
      <ExistingDataHeader backLink="" nextLink="" />
      
      <div className="mx-auto p-6">
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">Excel Data Upload</h1>
          
          <div className="space-y-6">
            <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
              <label className="block text-gray-700 font-medium mb-2">
                Select Excel File
              </label>
              <input
                type="file"
                accept=".xlsx, .xls"
                onChange={handleFileChange}
                className="block w-full text-sm text-gray-500
                    file:mr-4 file:py-2.5 file:px-4
                    file:rounded-md file:border-0
                    file:text-sm file:font-semibold
                    file:bg-green-500 file:text-white
                    hover:file:bg-green-600 cursor-pointer
                  "
              />
            </div>

            {sheetNames.length > 0 && (
              <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
                <h2 className="text-lg font-medium text-gray-700 mb-3">
                  Select a Sheet
                </h2>
                <div className="flex flex-wrap gap-3">
                  {sheetNames.map((sheetName) => (
                    <button
                      key={sheetName}
                      type="button"
                      onClick={() => handleSheetSelection(sheetName)}
                      className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                        selectedSheetName === sheetName
                          ? "bg-green-600 text-white"
                          : "bg-green-100 text-green-800 hover:bg-green-500 hover:text-white"
                      }`}
                    >
                      {sheetName}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
              <div className="flex items-center space-x-3 mb-4">
                <input
                  id="uploadAll"
                  type="checkbox"
                  checked={uploadAll}
                  onChange={handleToggleChange}
                  className="h-5 w-5 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                />
                <label htmlFor="uploadAll" className="text-gray-700 font-medium cursor-pointer">
                  Upload All Rows
                </label>
              </div>

              {!uploadAll && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">
                      Start Line
                    </label>
                    <input
                      type="number"
                      value={startLine}
                      onChange={handleStartLineChange}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="Enter start line"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">
                      End Line
                    </label>
                    <input
                      type="number"
                      value={endLine}
                      onChange={handleEndLineChange}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="Enter end line"
                    />
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={handleSubmit}
              className="px-6 py-3 bg-green-500 text-white font-medium rounded-md hover:bg-green-600 transition-colors focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-50 shadow-sm"
            >
              Upload Data
            </button>
          </div>
        </div>

        {selectedSheetName && sheetData.length > 0 && (
          <div className="bg-white rounded-lg shadow-md p-6 overflow-hidden">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              Preview: {selectedSheetName}
            </h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 border border-gray-200">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                      Row
                    </th>
                    {Object.keys(sheetData[7] || {}).map((key) => (
                      <th
                        key={key}
                        className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b"
                      >
                        {key}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {sheetData.map((row, index) => (
                    <tr key={index} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                      <td className="py-2 px-4 text-sm text-gray-700 border-b">
                        {index + 1}
                      </td>
                      {Object.values(row).map((value, i) => (
                        <td
                          key={i}
                          className="py-2 px-4 text-sm text-gray-700 border-b"
                        >
                          {value ? String(value) : "-"}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FileUpload;