import React, { useEffect, useState } from "react";
import axios from "axios";
import { useTable, usePagination } from "react-table";
import { BACKEND_URL } from "../../../../../Globle";
import { useCookies } from "react-cookie";
import { read, utils, writeFile } from "xlsx"; // For Excel-like functionality
import jsPDF from "jspdf";
import "jspdf-autotable";

// Define the ExcelDataFinal interface
interface ExcelDataFinal {
  id: string;
  companyName: string;
  srNo: string;
  shippingBillNo: string;
  shippingBillDate: string;
  thirdPartyExporter: string;
  hsCodeAndDescription: string;
  epcgLicNo: string;
  cifValue: string;
  freight: string;
  insurance: string;
  brc: string;
  exchangeRate: string;
  cifValue2: string;
  freight2: string;
  insurance2: string;
  brc2: string;
  exchangeRate2: string;
  product: string;
  remarks: string;
}

const DownloadDataPage: React.FC = () => {
  const [data, setData] = useState<ExcelDataFinal[]>([]);
  const [cookies] = useCookies(["token"]);

  useEffect(() => {
    // Fetch data from the backend API
    axios
      .get(`${BACKEND_URL}/ex/getall`, {
        headers: {
          Authorization: cookies.token,
        },
      })
      .then((response) => setData(response.data))
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  const columns = React.useMemo(
    () => [
      { Header: "ID", accessor: "id" },
      { Header: "Company Name", accessor: "companyName" },
      { Header: "SR No", accessor: "srNo" },
      { Header: "Shipping Bill No", accessor: "shippingBillNo" },
      { Header: "Shipping Bill Date", accessor: "shippingBillDate" },
      { Header: "Third Party Exporter", accessor: "thirdPartyExporter" },
      { Header: "HS Code and Description", accessor: "hsCodeAndDescription" },
      { Header: "EPCG LIC No", accessor: "epcgLicNo" },
      { Header: "CIF Value", accessor: "cifValue" },
      { Header: "Freight", accessor: "freight" },
      { Header: "Insurance", accessor: "insurance" },
      { Header: "BRC", accessor: "brc" },
      { Header: "Exchange Rate", accessor: "exchangeRate" },
      { Header: "CIF Value2", accessor: "cifValue2" },
      { Header: "Freight2", accessor: "freight2" },
      { Header: "Insurance2", accessor: "insurance2" },
      { Header: "BRC2", accessor: "brc2" },
      { Header: "Exchange Rate2", accessor: "exchangeRate2" },
      { Header: "Product", accessor: "product" },
      { Header: "Remarks", accessor: "remarks" },
    ],
    []
  );

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable<any>({
      columns,
      data,
    });

  // Function to update a specific cell value
  const updateCell = (rowId: string, columnId: string, value: string) => {
    const updatedData = data.map((row) =>
      row.id === rowId ? { ...row, [columnId]: value } : row
    );
    setData(updatedData);

    // Send update to backend
    axios
      .post(
        `${BACKEND_URL}/ex/update`, // Use appropriate API endpoint
        { id: rowId, [columnId]: value },
        {
          headers: {
            Authorization: cookies.token,
          },
        }
      )
      .then(() => console.log("Data updated successfully"))
      .catch((error) => console.error("Error updating data:", error));
  };

  // Function to download the table as an Excel sheet
  const downloadExcel = () => {
    const worksheet = utils.json_to_sheet(data);
    const workbook = utils.book_new();
    utils.book_append_sheet(workbook, worksheet, "Sheet1");
    writeFile(workbook, "table-data.xlsx");
  };

  // Function to download the table as a PDF
  // Function to download the table as a PDF
  const downloadPDF = () => {
    const doc : any = new jsPDF("landscape");

    const tableData = data.map((item) => [
      item.id,
      item.companyName,
      item.srNo,
      item.shippingBillNo,
      item.shippingBillDate,
      item.thirdPartyExporter,
      item.hsCodeAndDescription,
      item.epcgLicNo,
      item.cifValue,
      item.freight,
      item.insurance,
      item.brc,
      item.exchangeRate,
      item.cifValue2,
      item.freight2,
      item.insurance2,
      item.brc2,
      item.exchangeRate2,
      item.product,
      item.remarks,
    ]);

    doc.autoTable({
      head: [
        [
          "ID",
          "Company Name",
          "SR No",
          "Shipping Bill No",
          "Shipping Bill Date",
          "Third Party Exporter",
          "HS Code and Description",
          "EPCG LIC No",
          "CIF Value",
          "Freight",
          "Insurance",
          "BRC",
          "Exchange Rate",
          "CIF Value2",
          "Freight2",
          "Insurance2",
          "BRC2",
          "Exchange Rate2",
          "Product",
          "Remarks",
        ],
      ],
      body: tableData,
      startY: 20, // Start position of the table from the top
      styles: { fontSize: 7 }, // Smaller font size for more compact data
      headStyles: { fillColor: [100, 100, 255] }, // Blue color for headers
      theme: "grid", // Show grid lines
      columnStyles: {
        0: { cellWidth: 12 },
        1: { cellWidth: 20 },
        2: { cellWidth: 10 },
        3: { cellWidth: 20 },
        4: { cellWidth: 20 },
        5: { cellWidth: 20 },
        6: { cellWidth: 12 }, // Adjusted to fit description
        7: { cellWidth: 12 },
        8: { cellWidth: 12 },
        9: { cellWidth: 12 },
        10: { cellWidth: 12 },
        11: { cellWidth: 12 },
        12: { cellWidth: 12 },
        13: { cellWidth: 12 },
        14: { cellWidth: 12 },
        15: { cellWidth: 12 },
        16: { cellWidth: 12 },
        17: { cellWidth: 12 },
        18: { cellWidth: 20 },
        19: { cellWidth: 20 }, // Remarks might need more space
      },
      margin: { horizontal: 5 }, // Horizontal margin
      didDrawPage: function (data) {
        // Optional: Add header and footer for each page
        doc.text("Test Table", data.settings.margin.left, 10);
        let str = "Page no . " + doc.internal.getNumberOfPages();
        doc.setFontSize(6);
        doc.text(
          str,
          data.settings.margin.left,
          doc.internal.pageSize.height - 10
        );
      },
    });

    doc.save("table-data.pdf");
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Excel Data Table</h1>

      {/* Table UI */}
      <table
        {...getTableProps()}
        className="min-w-full table-auto border-collapse"
      >
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()} className="bg-gray-300">
              {headerGroup.headers.map((column) => (
                <th
                  {...column.getHeaderProps()}
                  className="px-4 py-2 border border-gray-400 text-left font-bold text-xs"
                >
                  {column.render("Header")}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {rows.map((row) => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()} className="hover:bg-gray-100">
                {row.cells.map((cell) => (
                  <td
                    {...cell.getCellProps()}
                    className="px-4 py-2 border border-gray-400 text-sm"
                    contentEditable
                    suppressContentEditableWarning
                    onBlur={(e) =>
                      {updateCell(
                        row.values.id,
                        cell.column.id,
                        e.target.textContent || ""
                      );
                    console.log(row.values.id, cell.column.id, e.target.textContent || "");
                    }
                    }
                  >
                    {cell.render("Cell")}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* Button to download Excel */}
      <button
        onClick={downloadExcel}
        className="mt-4 bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-700 transition"
      >
        Download as Excel
      </button>

      {/* Button to download PDF */}
      <button
        onClick={downloadPDF}
        className="mt-4 ml-2 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
      >
        Download as PDF
      </button>
    </div>
  );
};

export default DownloadDataPage;
