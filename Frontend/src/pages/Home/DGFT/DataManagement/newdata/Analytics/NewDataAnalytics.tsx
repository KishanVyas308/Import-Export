import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BACKEND_URL } from '../../../../../../Globle';
import { useCookies } from 'react-cookie';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import Loading from '../../../../../components/Loading';

const NewDataAnalytics = () => {
    enum Mode {
        Document = 'document',
        Form = 'form'
    }
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [data, setData] = useState<any>([]);
    const [mode, setMode] = useState<Mode>(Mode.Document);
    const [selectedOption, setSelectedOption] = useState('EPCG License');
    const [cookies] = useCookies(['token']);
    const [selectedMain, setSelectedMain] = useState<string | null>(null);
    const [selectedItem, setSelectedItem] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    useEffect(() => {
        if (mode === Mode.Form) {
            setSelectedOption('Direct Export');
        }
        if (mode === Mode.Document) {
            setSelectedOption('EPCG License');
        }
    }, [mode]);
    console.log('selectedOption', selectedOption);
    console.log('mode', mode);

    const documentList = {
        'EPCG License': 'epcglicense',
        'Advance License': 'advancelicense',
        'Shipping Bill': 'shippingbill',
        'Invoice': 'invoice',
        'E - BRC': 'ebrc',
        'E - Way Bill': 'ewaybill',
        'Subsidy': 'subsidy'
    };

    const form = {
        'Direct Export': 'directexport',
        'Indirect Export': 'indirectexport'
    };

    const fetchData = async () => {
        try {
            setLoading(true);
            const endpoint = mode === Mode.Document ? documentList[selectedOption] : form[selectedOption];
            console.log('endpoint', endpoint);

            const res = await axios.get(`${BACKEND_URL}/dataAnalytics/${endpoint}`, {
                params: {
                    startDate,
                    endDate,
                },
                headers: {
                    Authorization: cookies.token,
                },
            });
            console.log(res.data);
            setData(res.data);
            setLoading(false);
        } catch (err) {
            console.error('Error fetching data', err);
            alert('Error fetching data');
            setLoading(false);
        }
    };

    const generatePDF = () => {
        const doc: any = new jsPDF();
        doc.autoTable({
            head: [['ID', 'Sr No', 'Shipping Bill No', 'Shipping Bill Date', 'Uploaded Date']],
            body: data.map(item => [item.id, item.srNo, item.shippingBillNo, item.shippingBillDate, (item.uploadedDate).split('T')[0]]),
        });
        doc.save('data.pdf');
    };

    const generateExcel = () => {
        const workbook = XLSX.utils.book_new();

        const addSheetToWorkbook = (sheetData, sheetName) => {
            const worksheet = XLSX.utils.json_to_sheet(sheetData);
            XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
        };
        Object.entries(data).forEach(([key, value]) => {
            addSheetToWorkbook(value, key.replace(/([A-Z])/g, ' $1').trim());
        });

        XLSX.writeFile(workbook, `${selectedOption}.xlsx`);
    };


    return (
        <div className="bg-[#e6e7e9] w-full h-full min-h-screen">
            <div className="container mx-auto px-4 py-8 ">
                {loading && <Loading />}
                
                <h1 className="text-2xl mb-4">Filter Data</h1>
                <div className="grid grid-cols-2 gap-4">
                    <select
                        className="border p-2"
                        value={mode}
                        onChange={(e) => setMode(e.target.value as Mode)}
                    >
                        <option value={Mode.Document}>Document</option>
                        <option value={Mode.Form}>Form</option>
                    </select>
                    <select
                        className="border p-2"
                        value={selectedOption}
                        onChange={(e) => setSelectedOption(e.target.value)}
                    >
                        {mode === Mode.Document
                            ? Object.entries(documentList).map(([key, value]) => (
                                <option key={key} value={key}>{key}</option>
                            ))
                            : Object.entries(form).map(([key, value]) => (
                                <option key={key} value={key}>{key}</option>
                            ))}
                    </select>
                    <input
                        type="date"
                        className="border p-2"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        placeholder="Start Date"
                    />
                    <input
                        type="date"
                        className="border p-2"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        placeholder="End Date"
                    />
                </div>
                <button
                    onClick={fetchData}
                    className="bg-green-500 text-white p-2 mt-4"
                >
                    Fetch Data
                </button>

                {/* <button
                    onClick={generatePDF}
                    className="bg-blue-500 text-white p-2 mt-4 ml-2"
                >
                    Generate PDF
                </button> */}
                <button
                    onClick={generateExcel}
                    className="bg-yellow-500 text-white p-2 mt-4 ml-2"
                >
                    Generate Excel
                </button>

                <div className="mt-8 grid grid-cols-3 gap-4">
                    
                    {Object.entries(data).map(([key, value]: any) => (
                        <div key={key} className=" ">
                            <h2 className="text-2xl font-semibold border rounded-lg p-4 shadow-md bg-white cursor-pointer" onClick={() => setSelectedMain(key)}>
                                {key.replace(/([A-Z])/g, ' $1').trim()}
                            </h2>

                        </div>
                    ))}
                </div>
                <div className='mt-8'>

                    {Object.entries(data).map(([key, value]: any) => (
                        <div key={key} className=" grid grid-cols-3 gap-3">

                            {selectedMain === key && Array.isArray(value) && value.map((item: any, index: number) => (
                                <div key={index} className="border rounded-lg p-4 shadow-md bg-white cursor-pointer" onClick={() => setSelectedItem(item)}>
                                    <div className="flex justify-between">
                                    <strong className="text-gray-700">{key.replace(/([A-Z])/g, ' $1').trim()} {index + 1}</strong>
                                    {item.uploadedDate && (
                                         
                                            <span className="text-gray-900">{(item.uploadedDate).split('T')[0]}</span>
                                        )}
                                        </div>
                                </div>
                            ))}
                        </div>
                    ))}
                </div>

                <div>


                    {selectedItem && (
                        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 ">
                            <div className="bg-white p-8 rounded-lg shadow-lg max-w-xl w-full max-h-[90%] overflow-y-auto">
                                <h2 className="text-2xl font-semibold mb-4">Item Details</h2>
                                {Object.entries(selectedItem).map(([itemKey, itemValue]: any) => (
                                    <div key={itemKey} className="flex justify-between py-2">
                                        <strong className="text-gray-700">{itemKey.replace(/([A-Z])/g, ' $1').trim()}:</strong>
                                        <span className="text-gray-900">{itemValue}</span>
                                    </div>
                                ))}
                                <button
                                    onClick={() => setSelectedItem(null)}
                                    className="bg-red-500 text-white p-2 mt-4"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>



        </div>
    );
};

export default NewDataAnalytics;
