import { useState, useEffect } from "react";
import { useCookies } from "react-cookie";
import { useRecoilValue } from "recoil";
import { authAtom } from "../../atoms/authAtom";
import axios from "axios";
import { BACKEND_URL } from "../../Globle";
import Loading from "../components/Loading";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBuilding, faEnvelope, faPhone, faUser, faIndustry, faCogs, faMapMarkerAlt, faTag, faUsers, faPercent, faEdit, faTrash, faTimes, faPlus, faList, faSearch, faEye, faChevronDown, faIndianRupeeSign, faCalendarAlt, faFileAlt, faUpload, faDownload, faFilePdf, faFileWord, faFileImage } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import DocumentManagementModal from "../../components/DocumentManagementModal";

interface TurnoverData {
    id: string | null;
    tempId?: string; // For UI tracking
    financialYear: string;
    domesticTurnover: string;
    directExportTurnover: string;
    merchantExportTurnover: string;
}

interface ClientDocument {
    id: string;
    documentType: string;
    fileName: string;
    originalName: string;
    filePath: string;
    fileSize: number;
    mimeType: string;
    description?: string;
    uploadedDate: string;
    url: string;
    documentTypeName: string;
}

interface Client {
    id: string;
    customerName: string;
    resource: string;
    dgftCategory: string;
    gstCategory: string;
    mainCategory: string;
    industry: string;
    subIndustry: string;
    department: string;
    freshService: string;
    eodcService: string;
    basicService: string;
    otherDgftService: string;
    gstService: string;
    mobileNumber1: string;
    contactPersonName1: string;
    mobileNumber2: string;
    contactPersonName2: string;
    mailId1: string;
    mailId2: string;
    address: string;
    addedByUserId: string;
    uploadedDate: string;
    clientJoiningDate?: string;
    ReferanceClient: boolean;
    ReferanceClientId?: string;
    turnover?: TurnoverData[];
    documents?: ClientDocument[];
}


interface FormInputProps {
    icon: any;
    type?: string;
    placeholder: string;
    value: string | number;
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
    required?: boolean;
    options?: { label: string; value: string }[] | null;
    rows?: number | null;
    className?: string;
}
// Reusable Input Component
const FormInput = ({
    icon,
    type = "text",
    placeholder,
    value,
    onChange,
    required = false,
    options = null,
    rows = null,
    className = ""
}: FormInputProps) => {
    const baseClasses = "pl-12 pr-4 py-2 w-full border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-300 text-lg";
    const hasValue = value !== undefined && value !== "";

    if (options) {
        // Dropdown/Select component
        return (
            <div className={`relative ${className}`}>
                <label className={`absolute text-sm font-medium ${hasValue ? 'text-green-600' : 'text-gray-500'} -top-2.5 left-4 bg-white px-1 transition-all duration-200`}>
                    {placeholder}{required ? " *" : ""}
                </label>
                <FontAwesomeIcon
                    icon={icon}
                    className="absolute left-4 top-4 text-green-500 text-xl"
                />
                <select
                    className={`${baseClasses} pt-3`}
                    value={value}
                    onChange={onChange}
                    required={required}
                    
                >
                    <option value=""></option>
                    {options.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
                <FontAwesomeIcon
                    icon={faChevronDown}
                    className="absolute right-4 top-4 text-gray-400 pointer-events-none"
                />
            </div>
        );
    }

    if (rows) {
        // Textarea component
        return (
            <div className={`relative ${className}`}>
                <label className={`absolute text-sm font-medium ${hasValue ? 'text-green-600' : 'text-gray-500'} -top-2.5 left-4 bg-white px-1 transition-all duration-200`}>
                    {placeholder}{required ? " *" : ""}
                </label>
                <FontAwesomeIcon
                    icon={icon}
                    className="absolute left-4 top-4 text-green-500 text-xl"
                />
                <textarea
                    className={`${baseClasses} resize-none pt-3`}
                    rows={rows}
                    value={value}
                    onChange={onChange}
                    required={required}
                />
            </div>
        );
    }

    // Regular input component
    return (
        <div className={`relative ${className}`}>
            <label className={`absolute text-sm font-medium ${hasValue ? 'text-green-600' : 'text-gray-500'} -top-2.5 left-4 bg-white px-1 transition-all duration-200`}>
                {placeholder}{required ? " *" : ""}
            </label>
            <FontAwesomeIcon
                icon={icon}
                className="absolute left-4 top-4 text-green-500 text-xl"
            />
            <input
                type={type}
                className={`${baseClasses} pt-3`}
                value={value}
                onChange={onChange}
                required={required}
            />
        </div>
    );
};

const ManageClient = () => {
    const [loading, setLoading] = useState(false);
    const [customerName, setCustomerName] = useState("");
    const [resource, setResource] = useState("");
    const [dgftCategory, setDgftCategory] = useState("");
    const [gstCategory, setGstCategory] = useState("");
    const [mainCategory, setMainCategory] = useState("");
    const [industry, setIndustry] = useState("");
    const [subIndustry, setSubIndustry] = useState("");
    const [department, setDepartment] = useState("");
    const [freshService, setFreshService] = useState("");
    const [eodcService, setEodcService] = useState("");
    const [basicService, setBasicService] = useState("");
    const [otherDgftService, setOtherDgftService] = useState("");
    const [gstService, setGstService] = useState("");
    const [mobileNumber1, setMobileNumber1] = useState("");
    const [contactPersonName1, setContactPersonName1] = useState("");
    const [mobileNumber2, setMobileNumber2] = useState("");
    const [contactPersonName2, setContactPersonName2] = useState("");
    const [mailId1, setMailId1] = useState("");
    const [mailId2, setMailId2] = useState("");
    const [address, setAddress] = useState("");
    const [clientJoiningDate, setClientJoiningDate] = useState("");

    // Reference client state
    const [referenceClient, setReferenceClient] = useState(false);
    const [referenceClientId, setReferenceClientId] = useState("");

    // Turnover data state
    const [turnoverData, setTurnoverData] = useState<TurnoverData[]>([
        {
            id: null,
            tempId: Date.now().toString(),
            financialYear: "",
            domesticTurnover: "",
            directExportTurnover: "",
            merchantExportTurnover: ""
        }
    ]);

    // Additional state for client management
    const [clients, setClients] = useState<Client[]>([]);
    const [showClientsList, setShowClientsList] = useState(false);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [editingClient, setEditingClient] = useState<Client | null>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentView, setCurrentView] = useState("list"); // "add", "list"
    const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
    const [clientToDelete, setClientToDelete] = useState<Client | null>(null);
    const [showTurnoverSection, setShowTurnoverSection] = useState(false);

    // Document modal state
    const [documentModalOpen, setDocumentModalOpen] = useState(false);
    const [selectedClientForDocuments, setSelectedClientForDocuments] = useState<Client | null>(null);

    const [cookies, setCookie] = useCookies(["token"]);
    const user = useRecoilValue(authAtom);

    const navigate = useNavigate();

    // Turnover management functions
    const addTurnoverRow = () => {
        setTurnoverData([
            ...turnoverData,
            {
                id: null,
                tempId: Date.now().toString(),
                financialYear: "",
                domesticTurnover: "",
                directExportTurnover: "",
                merchantExportTurnover: ""
            }
        ]);
    };

    const removeTurnoverRow = (index: number) => {
        if (turnoverData.length > 1) {
            const newData = turnoverData.filter((_, i) => i !== index);
            setTurnoverData(newData);
        }
    };

    const updateTurnoverData = (index: number, field: string, value: string) => {
        const newData = [...turnoverData];
        newData[index] = { ...newData[index], [field]: value };
        setTurnoverData(newData);
    };

    // Helper function to calculate total turnover for a single entry
    const calculateTotalTurnover = (data: TurnoverData): number => {
        const domestic = parseFloat(data.domesticTurnover) || 0;
        const directExport = parseFloat(data.directExportTurnover) || 0;
        const merchantExport = parseFloat(data.merchantExportTurnover) || 0;
        return domestic + directExport + merchantExport;
    };

    // Helper function to calculate grand total turnover
    const calculateGrandTotalTurnover = (): number => {
        return turnoverData.reduce((total, data) => total + calculateTotalTurnover(data), 0);
    };

    // Helper function to format currency
    const formatCurrency = (amount: number): string => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(amount);
    };

    // Helper function to get all unique financial years from clients data
    const getAllFinancialYears = (): string[] => {
        const years = new Set<string>();
        clients.forEach(client => {
            if (client.turnover) {
                client.turnover.forEach(t => {
                    if (t.financialYear) {
                        years.add(t.financialYear);
                    }
                });
            }
        });
        return Array.from(years).sort();
    };

    // Helper function to get turnover data for a specific client and year
    const getTurnoverForYear = (client: Client, year: string) => {
        if (!client.turnover) return null;
        return client.turnover.find(t => t.financialYear === year);
    };

    // Helper function to calculate grand total for a client
    const calculateClientGrandTotal = (client: Client): number => {
        if (!client.turnover) return 0;
        return client.turnover.reduce((total, turnover) => {
            const domestic = parseFloat(turnover.domesticTurnover) || 0;
            const directExport = parseFloat(turnover.directExportTurnover) || 0;
            const merchantExport = parseFloat(turnover.merchantExportTurnover) || 0;
            return total + domestic + directExport + merchantExport;
        }, 0);
    };

    // Handle reference client selection
    const handleReferenceClientChange = (clientId: string) => {
        setReferenceClientId(clientId);
        
        if (clientId) {
            const selectedClient = clients.find(client => client.id === clientId);
            if (selectedClient) {
                // Auto-populate all fields except customerName (and turnover data)
                setResource(selectedClient.resource || "");
                setDgftCategory(selectedClient.dgftCategory || "");
                setGstCategory(selectedClient.gstCategory || "");
                setMainCategory(selectedClient.mainCategory || "");
                setIndustry(selectedClient.industry || "");
                setSubIndustry(selectedClient.subIndustry || "");
                setDepartment(selectedClient.department || "");
                setFreshService(selectedClient.freshService || "");
                setEodcService(selectedClient.eodcService || "");
                setBasicService(selectedClient.basicService || "");
                setOtherDgftService(selectedClient.otherDgftService || "");
                setGstService(selectedClient.gstService || "");
                setMobileNumber1(selectedClient.mobileNumber1 || "");
                setContactPersonName1(selectedClient.contactPersonName1 || "");
                setMobileNumber2(selectedClient.mobileNumber2 || "");
                setContactPersonName2(selectedClient.contactPersonName2 || "");
                setMailId1(selectedClient.mailId1 || "");
                setMailId2(selectedClient.mailId2 || "");
                setAddress(selectedClient.address || "");
                setClientJoiningDate(selectedClient.clientJoiningDate ? new Date(selectedClient.clientJoiningDate).toISOString().split('T')[0] : "");
                
                // Note: Turnover data is NOT copied - user enters it manually
            }
        }
    };

    // Fetch all clients
    const fetchClients = async () => {
        setLoading(true);
        try {
            const res = await axios.get(`${BACKEND_URL}/admin/exporter`, {
                headers: {
                    Authorization: cookies.token,
                },
            });
            console.log("API Response:", res.data); // Debug log
            // Handle both array response and object with clients property
            let clientsData = Array.isArray(res.data) ? res.data : (res.data.clients || []);
            
            // Fetch document counts for each client
            const clientsWithDocuments = await Promise.all(
                clientsData.map(async (client) => {
                    try {
                        const docRes = await axios.get(`${BACKEND_URL}/documents/client/${client.id}`, {
                            headers: { Authorization: cookies.token }
                        });
                        return {
                            ...client,
                            documents: docRes.data.documents || []
                        };
                    } catch (error) {
                        console.warn(`Failed to fetch documents for client ${client.id}:`, error);
                        return {
                            ...client,
                            documents: []
                        };
                    }
                })
            );
            
            setClients(clientsWithDocuments);
            console.log("Clients set:", clientsWithDocuments); // Debug log
        } catch (error) {
            console.error("Failed to fetch clients:", error);
            alert("Failed to fetch clients");
        } finally {
            setLoading(false);
        }
    };

    // Load clients on component mount and when view changes
    useEffect(() => {
        if (currentView === "list") {
            fetchClients();
        }
    }, [currentView]);

    // Load clients immediately on component mount
    useEffect(() => {
        fetchClients();
    }, []);

    // Clear form fields
    const clearForm = () => {
        setCustomerName("");
        setResource("");
        setDgftCategory("");
        setGstCategory("");
        setMainCategory("");
        setIndustry("");
        setSubIndustry("");
        setDepartment("");
        setFreshService("");
        setEodcService("");
        setBasicService("");
        setOtherDgftService("");
        setGstService("");
        setMobileNumber1("");
        setContactPersonName1("");
        setMobileNumber2("");
        setContactPersonName2("");
        setMailId1("");
        setMailId2("");
        setAddress("");
        setClientJoiningDate("");
        setTurnoverData([
            {
                id: null,
                tempId: Date.now().toString(),
                financialYear: "",
                domesticTurnover: "",
                directExportTurnover: "",
                merchantExportTurnover: ""
            }
        ]);
        setShowTurnoverSection(false);
        setReferenceClient(false);
        setReferenceClientId("");
    };

    // Handle edit client
    const handleEditClient = (client: Client) => {
        setEditingClient(client);
        setCustomerName(client.customerName || "");
        setResource(client.resource || "");
        setDgftCategory(client.dgftCategory || "");
        setGstCategory(client.gstCategory || "");
        setMainCategory(client.mainCategory || "");
        setIndustry(client.industry || "");
        setSubIndustry(client.subIndustry || "");
        setDepartment(client.department || "");
        setFreshService(client.freshService || "");
        setEodcService(client.eodcService || "");
        setBasicService(client.basicService || "");
        setOtherDgftService(client.otherDgftService || "");
        setGstService(client.gstService || "");
        setMobileNumber1(client.mobileNumber1 || "");
        setContactPersonName1(client.contactPersonName1 || "");
        setMobileNumber2(client.mobileNumber2 || "");
        setContactPersonName2(client.contactPersonName2 || "");
        setMailId1(client.mailId1 || "");
        setMailId2(client.mailId2 || "");
        setAddress(client.address || "");
        setClientJoiningDate(client.clientJoiningDate ? new Date(client.clientJoiningDate).toISOString().split('T')[0] : "");
        
        // Set reference client fields
        setReferenceClient(client.ReferanceClient || false);
        setReferenceClientId(client.ReferanceClientId || "");
        
        // Set turnover data if available
        if (client.turnover && client.turnover.length > 0) {
            // Add tempId to existing turnover data for UI tracking
            const turnoverWithTempId = client.turnover.map((item, index) => ({
                ...item,
                tempId: item.tempId || `existing-${item.id || index}-${Date.now()}`
            }));
            setTurnoverData(turnoverWithTempId);
            setShowTurnoverSection(true);
        } else {
            setTurnoverData([
                {
                    id: null,
                    tempId: Date.now().toString(),
                    financialYear: "",
                    domesticTurnover: "",
                    directExportTurnover: "",
                    merchantExportTurnover: ""
                }
            ]);
            setShowTurnoverSection(false);
        }
        
        setCurrentView("add");
    };

    // Handle update client
    const handleUpdateClient = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!customerName) {
            alert("Please fill in all required fields");
            return;
        }

        if (!editingClient) return;

        setLoading(true);
        try {
            const res = await axios.put(
                `${BACKEND_URL}/admin/exporter/${editingClient.id}`,
                {
                    customerName,
                    resource,
                    dgftCategory,
                    gstCategory,
                    mainCategory,
                    industry,
                    subIndustry,
                    department,
                    freshService,
                    eodcService,
                    basicService,
                    otherDgftService,
                    gstService,
                    mobileNumber1,
                    contactPersonName1,
                    mobileNumber2,
                    contactPersonName2,
                    mailId1,
                    mailId2,
                    address,
                    clientJoiningDate: clientJoiningDate || null,
                    ReferanceClient: referenceClient,
                    ReferanceClientId: referenceClient ? referenceClientId : null,
                    turnoverData: showTurnoverSection ? turnoverData.map(({ tempId, ...rest }) => rest) : [],
                },
                {
                    headers: {
                        Authorization: cookies.token,
                    },
                }
            );

            alert(res.data.message || "Client updated successfully");
            setEditingClient(null);
            clearForm();
            setCurrentView("list");
            fetchClients();
        } catch (error) {
            alert("Update failed. Please try again.");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    // Handle delete client
    const handleDeleteClient = async (clientId) => {
        setLoading(true);
        try {
            const res = await axios.delete(`${BACKEND_URL}/admin/exporter/${clientId}`, {
                headers: {
                    Authorization: cookies.token,
                },
            });

            alert(res.data.message || "Client deleted successfully");
            fetchClients();
            setDeleteConfirmOpen(false);
            setClientToDelete(null);
        } catch (error) {
            alert("Delete failed. Please try again.");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    // Filter clients based on search term
    const filteredClients = clients.filter(client =>
        client.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.mailId1?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.mobileNumber1?.includes(searchTerm)
    );

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!customerName) {
            alert("Please fill in all required fields");
            return;
        }

        setLoading(true);
        try {
            const res = await axios.post(
                `${BACKEND_URL}/admin/exporter`,
                {
                    customerName,
                    resource,
                    dgftCategory,
                    gstCategory,
                    mainCategory,
                    industry,
                    subIndustry,
                    department,
                    freshService,
                    eodcService,
                    basicService,
                    otherDgftService,
                    gstService,
                    mobileNumber1,
                    contactPersonName1,
                    mobileNumber2,
                    contactPersonName2,
                    mailId1,
                    mailId2,
                    address,
                    addedByUserId: user.user.id,
                    clientJoiningDate: clientJoiningDate || null,
                    ReferanceClient: referenceClient,
                    ReferanceClientId: referenceClient ? referenceClientId : null,
                    turnoverData: showTurnoverSection ? turnoverData.map(({ tempId, ...rest }) => rest) : [],
                },
                {
                    headers: {
                        Authorization: cookies.token,
                    },
                }
            );

            alert(res.data.message);
            clearForm();
            setCurrentView("list");
            fetchClients();
        } catch (error) {
            alert("Registration failed. Please try again.");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden relative">
            {loading && <Loading />}

            {/* Background decorative elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
                <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-green-400 rounded-full mix-blend-multiply filter blur-3xl opacity-5 animate-blob"></div>
                <div className="absolute bottom-1/3 left-1/3 w-96 h-96 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-5 animate-blob animation-delay-4000"></div>

                {/* Curved lines */}
                <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
                    <path d="M0,100 Q300,150 600,100 T1200,100" fill="none" stroke="rgba(34, 197, 94, 0.05)" strokeWidth="3" />
                    <path d="M0,300 Q300,350 600,300 T1200,300" fill="none" stroke="rgba(34, 197, 94, 0.03)" strokeWidth="2" />
                    <path d="M0,500 Q300,550 600,500 T1200,500" fill="none" stroke="rgba(34, 197, 94, 0.02)" strokeWidth="1" />
                </svg>
            </div>

            <div className="relative z-10">
                {/* Header Section */}
                <div className="bg-gradient-to-r from-green-500 to-green-600 shadow-lg mx-6 mt-6 rounded-lg">
                    <div className="relative">
                        {/* Decorative pattern */}
                        <div className="absolute inset-0 opacity-10">
                            <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                                <defs>
                                    <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                                        <path d="M 20 0 L 0 0 0 20" fill="none" stroke="white" strokeWidth="1" />
                                    </pattern>
                                </defs>
                                <rect width="100%" height="100%" fill="url(#grid)" />
                            </svg>
                        </div>

                        <div className="flex flex-wrap justify-between items-center p-6">
                            <div className="flex items-center space-x-4">
                                <button
                                    onClick={() => navigate(-1)}
                                    className="flex items-center space-x-2 bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                    </svg>
                                    <span>Back</span>
                                </button>
                                <div className="h-8 w-1 bg-white/20 rounded-full"></div>
                                <h1 className="text-3xl font-bold text-white">Client Management</h1>
                            </div>

                            <div className="flex items-center space-x-4">
                                <button
                                    onClick={() => {
                                        setCurrentView("add");
                                        setEditingClient(null);
                                        clearForm();
                                    }}
                                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-300 z-30 ${currentView === "add"
                                            ? "bg-white/20 text-white"
                                            : "bg-white/10 hover:bg-white/20 text-white/80 hover:text-white"
                                        }`}
                                >
                                    <FontAwesomeIcon icon={faPlus} />
                                    <span>Add Client</span>
                                </button>
                                <button
                                    onClick={() => setCurrentView("list")}
                                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-300 z-30 ${currentView === "list"
                                            ? "bg-white/20 text-white"
                                            : "bg-white/10 hover:bg-white/20 text-white/80 hover:text-white"
                                        }`}
                                >
                                    <FontAwesomeIcon icon={faList} />
                                    <span>View All Clients</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="mx-auto">
                        {currentView === "add" ? (
                            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                                <div className="p-8">
                                    <h2 className="text-2xl font-bold text-gray-800 mb-6">
                                        {editingClient ? "Update Client" : "Add New Client"}
                                    </h2>

                                    <form onSubmit={editingClient ? handleUpdateClient : handleRegister} className="space-y-6">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            {/* customerName */}

                                            <FormInput
                                                icon={faBuilding}
                                                placeholder="customerName"
                                                value={customerName}
                                                onChange={(e) => setCustomerName(e.target.value)}
                                                required
                                            />

                                            {/* resource */}
                                            <FormInput
                                                icon={faTag}
                                                placeholder="resource"
                                                value={resource}
                                                onChange={(e) => setResource(e.target.value)}
                                            />

                                            {/* dgftCategory */}
                                            <FormInput
                                                icon={faTag}
                                                placeholder="dgftCategory"
                                                value={dgftCategory}
                                                onChange={(e) => setDgftCategory(e.target.value)}
                                            />

                                            {/* gstCategory */}
                                            <FormInput
                                                icon={faPercent}
                                                placeholder="gstCategory"
                                                value={gstCategory}
                                                onChange={(e) => setGstCategory(e.target.value)}
                                            />

                                            {/* mainCategory */}
                                            <FormInput
                                                icon={faTag}
                                                placeholder="mainCategory"
                                                value={mainCategory}
                                                onChange={(e) => setMainCategory(e.target.value)}
                                                options={[
                                                    { label: "A", value: "A" },
                                                    { label: "B", value: "B" },
                                                    { label: "C", value: "C" },
                                                    { label: "D", value: "D" },
                                                    { label: "E", value: "E" },
                                                ]}
                                            />

                                            {/* industry */}
                                            <FormInput
                                                icon={faIndustry}
                                                placeholder="industry"
                                                value={industry}
                                                onChange={(e) => setIndustry(e.target.value)}
                                            />

                                            {/* subIndustry */}
                                            <FormInput
                                                icon={faIndustry}
                                                placeholder="subIndustry"
                                                value={subIndustry}
                                                onChange={(e) => setSubIndustry(e.target.value)}
                                            />

                                            {/* department */}
                                            <FormInput
                                                icon={faUsers}
                                                placeholder="department"
                                                value={department}
                                                onChange={(e) => setDepartment(e.target.value)}
                                            />

                                            {/* freshService */}
                                            <FormInput
                                                icon={faCogs}
                                                placeholder="freshService"
                                                value={freshService}
                                                onChange={(e) => setFreshService(e.target.value)}
                                            />

                                            {/* eodcService */}
                                            <FormInput
                                                icon={faCogs}
                                                placeholder="eodcService"
                                                value={eodcService}
                                                onChange={(e) => setEodcService(e.target.value)}
                                            />

                                            {/* basicService */}
                                            <FormInput
                                                icon={faCogs}
                                                placeholder="basicService"
                                                value={basicService}
                                                onChange={(e) => setBasicService(e.target.value)}
                                            />

                                            {/* otherDgftService */}
                                            <FormInput
                                                icon={faCogs}
                                                placeholder="otherDgftService"
                                                value={otherDgftService}
                                                onChange={(e) => setOtherDgftService(e.target.value)}
                                            />

                                            {/* gstService */}
                                            <FormInput
                                                icon={faPercent}
                                                placeholder="gstService"
                                                value={gstService}
                                                onChange={(e) => setGstService(e.target.value)}
                                            />

                                            {/* mobileNumber1 */}
                                            <FormInput
                                                icon={faPhone}
                                                placeholder="mobileNumber1"
                                                value={mobileNumber1}
                                                onChange={(e) => setMobileNumber1(e.target.value)}
                                             
                                            />

                                            {/* contactPersonName1 */}
                                            <FormInput
                                                icon={faUser}
                                                placeholder="contactPersonName1"
                                                value={contactPersonName1}
                                                onChange={(e) => setContactPersonName1(e.target.value)}
                                            />

                                            {/* mobileNumber2 */}
                                            <FormInput
                                                icon={faPhone}
                                                placeholder="mobileNumber2"
                                                value={mobileNumber2}
                                                onChange={(e) => setMobileNumber2(e.target.value)}
                                            />

                                            {/* contactPersonName2 */}
                                            <FormInput
                                                icon={faUser}
                                                placeholder="contactPersonName2"
                                                value={contactPersonName2}
                                                onChange={(e) => setContactPersonName2(e.target.value)}
                                            />

                                            {/* mailId1 */}
                                            <FormInput
                                                icon={faEnvelope}
                                                type="email"
                                                placeholder="mailId1"
                                                value={mailId1}
                                                onChange={(e) => setMailId1(e.target.value)}
                                          
                                            />

                                            {/* mailId2 */}
                                            <FormInput
                                                icon={faEnvelope}
                                                type="email"
                                                placeholder="mailId2"
                                                value={mailId2}
                                                onChange={(e) => setMailId2(e.target.value)}
                                            />

                                            {/* address */}
                                            <FormInput
                                                icon={faMapMarkerAlt}
                                                placeholder="address"
                                                value={address}
                                                onChange={(e) => setAddress(e.target.value)}
                                                rows={4}
                                                className="md:col-span-2"
                                            />

                                            {/* clientJoiningDate */}
                                            <FormInput
                                                icon={faCalendarAlt}
                                                type="date"
                                                placeholder="Client Joining Date"
                                                value={clientJoiningDate}
                                                onChange={(e) => setClientJoiningDate(e.target.value)}
                                            />
                                        </div>

                                        {/* Reference Client Section */}
                                        <div className="mt-8 pt-6 border-t border-gray-200">
                                            <h3 className="text-lg font-semibold text-gray-700 mb-4">Reference Client (Optional)</h3>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                {/* Reference Client Yes/No */}
                                                <FormInput
                                                    icon={faUser}
                                                    placeholder="Is this a reference client?"
                                                    value={referenceClient ? "yes" : "no"}
                                                    onChange={(e) => {
                                                        const isReference = e.target.value === "yes";
                                                        setReferenceClient(isReference);
                                                        if (!isReference) {
                                                            setReferenceClientId("");
                                                        }
                                                    }}
                                                    options={[
                                                        { label: "No", value: "no" },
                                                        { label: "Yes", value: "yes" }
                                                    ]}
                                                />

                                                {/* Reference Client Dropdown */}
                                                {referenceClient && (
                                                    <FormInput
                                                        icon={faBuilding}
                                                        placeholder="Select Reference Client"
                                                        value={referenceClientId}
                                                        onChange={(e) => handleReferenceClientChange(e.target.value)}
                                                        options={[
                                                            ...clients
                                                                .filter(client => client.id !== editingClient?.id) // Exclude current client when editing
                                                                .map(client => ({
                                                                    label: client.customerName || "Unnamed Client",
                                                                    value: client.id
                                                                }))
                                                        ]}
                                                    />
                                                )}
                                            </div>
                                        </div>

                                        {/* Turnover Section */}
                                        <div className="mt-8 pt-6 border-t border-gray-200">
                                            <div className="flex items-center justify-between mb-4">
                                                <h3 className="text-lg font-semibold text-gray-700">Turnover Information (Optional)</h3>
                                                <button
                                                    type="button"
                                                    onClick={() => setShowTurnoverSection(!showTurnoverSection)}
                                                    className="flex items-center space-x-2 text-green-600 hover:text-green-700 transition-colors"
                                                >
                                                    <FontAwesomeIcon icon={faIndianRupeeSign} />
                                                    <span>{showTurnoverSection ? "Hide" : "Add"} Turnover Data</span>
                                                </button>
                                            </div>

                                            {showTurnoverSection && (
                                                <div className="space-y-4">
                                                    {turnoverData.map((data, index) => (
                                                        <div key={data.tempId || data.id || index} className="bg-gray-50 p-4 rounded-lg">
                                                            <div className="flex items-center justify-between mb-4">
                                                                <h4 className="font-medium text-gray-700">Turnover Entry {index + 1}</h4>
                                                                {turnoverData.length > 1 && (
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => removeTurnoverRow(index)}
                                                                        className="text-red-600 hover:text-red-700 transition-colors"
                                                                    >
                                                                        <FontAwesomeIcon icon={faTrash} />
                                                                    </button>
                                                                )}
                                                            </div>
                                                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                                                <FormInput
                                                                    icon={faIndianRupeeSign}
                                                                    placeholder="Financial Year (e.g., 23-24)"
                                                                    value={data.financialYear}
                                                                    onChange={(e) => updateTurnoverData(index, 'financialYear', e.target.value)}
                                                                />
                                                                <FormInput
                                                                    icon={faIndianRupeeSign}
                                                                    placeholder="₹ Domestic Turnover"
                                                                    value={data.domesticTurnover}
                                                                    onChange={(e) => updateTurnoverData(index, 'domesticTurnover', e.target.value)}
                                                                />
                                                                <FormInput
                                                                    icon={faIndianRupeeSign}
                                                                    placeholder="₹ Direct Export Turnover"
                                                                    value={data.directExportTurnover}
                                                                    onChange={(e) => updateTurnoverData(index, 'directExportTurnover', e.target.value)}
                                                                />
                                                                <FormInput
                                                                    icon={faIndianRupeeSign}
                                                                    placeholder="₹ Merchant Export Turnover"
                                                                    value={data.merchantExportTurnover}
                                                                    onChange={(e) => updateTurnoverData(index, 'merchantExportTurnover', e.target.value)}
                                                                />
                                                            </div>
                                                            
                                                            {/* Total Turnover Display for this entry */}
                                                            <div className="mt-4 pt-3 border-t border-gray-300">
                                                                <div className="flex justify-between items-center">
                                                                    <span className="font-medium text-gray-700">Total Turnover ({data.financialYear || 'Current Year'}):</span>
                                                                    <span className="font-bold text-green-600 text-lg">
                                                                        {formatCurrency(calculateTotalTurnover(data))}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                    <button
                                                        type="button"
                                                        onClick={addTurnoverRow}
                                                        className="flex items-center space-x-2 text-green-600 hover:text-green-700 transition-colors"
                                                    >
                                                        <FontAwesomeIcon icon={faPlus} />
                                                        <span>Add Another Year</span>
                                                    </button>
                                                    
                                                    {/* Grand Total Turnover Display */}
                                                    {turnoverData.length > 0 && (
                                                        <div className="mt-6 p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-lg border-2 border-green-200">
                                                            <div className="flex justify-between items-center">
                                                                <span className="text-xl font-bold text-green-800">Grand Total Turnover:</span>
                                                                <span className="text-2xl font-bold text-green-600">
                                                                    {formatCurrency(calculateGrandTotalTurnover())}
                                                                </span>
                                                            </div>
                                                            <div className="text-sm text-green-600 mt-1">
                                                                Sum of all years' turnover data
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                        {/* Action Buttons */}
                                        <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200">
                                            <button
                                                type="button"                                                        onClick={() => {
                                                            if (editingClient) {
                                                                setEditingClient(null);
                                                                clearForm();
                                                            } else {
                                                                navigate(-1);
                                                            }
                                                        }}
                                                className="flex-1 py-3 px-6 bg-gray-500 hover:bg-gray-600 text-white rounded-lg font-medium transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg"
                                            >
                                                {editingClient ? "Cancel Edit" : "Cancel"}
                                            </button>
                                            <button
                                                type="submit"
                                                className="flex-1 py-3 px-6 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg"
                                            >
                                                {editingClient ? "Update Client" : "Register Client"}
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        ) : (
                            /* Clients List View */
                            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                                <div className="p-8">
                                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                                        <div>
                                            <h2 className="text-2xl font-bold text-gray-800">All Clients - Excel View</h2>
                                            <p className="text-sm text-gray-600 mt-1">Complete client database in spreadsheet format</p>
                                        </div>

                                        <div className="flex items-center space-x-4">
                                            {/* Export Button */}
                                            <button
                                                onClick={() => {
                                                    const financialYears = getAllFinancialYears();
                                                    
                                                    // Build dynamic headers based on financial years
                                                    const baseHeaders = [
                                                        'Sr. No.', 'Customer Name', 'Resource', 'DGFT Category', 'GST Category', 
                                                        'Main Category', 'Industry', 'Sub Industry', 'Department', 
                                                        'Fresh Services', 'EODC Services', 'Basic Services', 'Other DGFT Services', 
                                                        'GST Services', 'Mo. No.', 'Contact Person-1', 'Mo. No. 2', 
                                                        'Contact Person-2', 'Mail id', 'Mail ID 2', 'Address'
                                                    ];
                                                    
                                                    // Add dynamic turnover columns for each financial year
                                                    const turnoverHeaders: string[] = [];
                                                    financialYears.forEach(year => {
                                                        turnoverHeaders.push(`Domestic ${year}`);
                                                        turnoverHeaders.push(`Direct Export ${year}`);
                                                        turnoverHeaders.push(`Merchant Export ${year}`);
                                                        turnoverHeaders.push(`Total Turnover ${year}`);
                                                    });
                                                    
                                                    const endHeaders = ['Grand Total Turnover', 'Client Joining Date', 'Reference Client'];
                                                    const headers = [...baseHeaders, ...turnoverHeaders, ...endHeaders];
                                                    
                                                    const csvContent = [
                                                        headers.join(','),
                                                        ...filteredClients.map((client, index) => {
                                                            const baseData = [
                                                                index + 1,
                                                                `"${client.customerName || ''}"`,
                                                                `"${client.resource || ''}"`,
                                                                `"${client.dgftCategory || ''}"`,
                                                                `"${client.gstCategory || ''}"`,
                                                                `"${client.mainCategory || ''}"`,
                                                                `"${client.industry || ''}"`,
                                                                `"${client.subIndustry || ''}"`,
                                                                `"${client.department || ''}"`,
                                                                `"${client.freshService || ''}"`,
                                                                `"${client.eodcService || ''}"`,
                                                                `"${client.basicService || ''}"`,
                                                                `"${client.otherDgftService || ''}"`,
                                                                `"${client.gstService || ''}"`,
                                                                `"${client.mobileNumber1 || ''}"`,
                                                                `"${client.contactPersonName1 || ''}"`,
                                                                `"${client.mobileNumber2 || ''}"`,
                                                                `"${client.contactPersonName2 || ''}"`,
                                                                `"${client.mailId1 || ''}"`,
                                                                `"${client.mailId2 || ''}"`,
                                                                `"${client.address || ''}"`
                                                            ];
                                                            
                                                            // Add turnover data for each year
                                                            const turnoverData: string[] = [];
                                                            financialYears.forEach(year => {
                                                                const turnover = getTurnoverForYear(client, year);
                                                                if (turnover) {
                                                                    const domestic = parseFloat(turnover.domesticTurnover) || 0;
                                                                    const directExport = parseFloat(turnover.directExportTurnover) || 0;
                                                                    const merchantExport = parseFloat(turnover.merchantExportTurnover) || 0;
                                                                    const total = domestic + directExport + merchantExport;
                                                                    
                                                                    turnoverData.push(domestic.toString());
                                                                    turnoverData.push(directExport.toString());
                                                                    turnoverData.push(merchantExport.toString());
                                                                    turnoverData.push(total.toString());
                                                                } else {
                                                                    turnoverData.push('0', '0', '0', '0');
                                                                }
                                                            });
                                                            
                                                            const endData = [
                                                                calculateClientGrandTotal(client).toString(),
                                                                client.clientJoiningDate ? new Date(client.clientJoiningDate).toLocaleDateString('en-IN') : '',
                                                                client.ReferanceClient ? 'Yes' : 'No'
                                                            ];
                                                            
                                                            return [...baseData, ...turnoverData, ...endData].join(',');
                                                        })
                                                    ].join('\n');
                                                    
                                                    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
                                                    const link = document.createElement('a');
                                                    const url = URL.createObjectURL(blob);
                                                    link.setAttribute('href', url);
                                                    link.setAttribute('download', `clients_export_${new Date().toISOString().split('T')[0]}.csv`);
                                                    link.style.visibility = 'hidden';
                                                    document.body.appendChild(link);
                                                    link.click();
                                                    document.body.removeChild(link);
                                                }}
                                                className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                </svg>
                                                <span>Export Excel</span>
                                            </button>

                                            {/* Search Bar */}
                                            <div className="relative w-full sm:w-96">
                                                <FontAwesomeIcon
                                                    icon={faSearch}
                                                    className="absolute left-3 top-4 text-gray-400"
                                                />
                                                <input
                                                    type="text"
                                                    placeholder="Search clients..."
                                                    className="pl-10 p-3 w-full border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                                                    value={searchTerm}
                                                    onChange={(e) => setSearchTerm(e.target.value)}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                

                                    {/* Excel-like Clients Table */}
                                    <div className="overflow-x-auto shadow-lg rounded-lg border border-gray-200">
                                        <table className="min-w-full divide-y divide-gray-200 table-fixed" style={{ minWidth: `${3500 + (getAllFinancialYears().length * 512)}px` }}>
                                            <thead className="bg-gradient-to-r from-gray-50 to-gray-100 sticky top-0 z-10">
                                                <tr className="divide-x divide-gray-200">
                                                    <th className="w-16 px-2 py-3 text-center text-xs font-bold text-gray-700 border-r border-gray-300">
                                                        Sr. No.
                                                    </th>
                                                    <th className="w-40 px-3 py-3 text-left text-xs font-bold text-gray-700 border-r border-gray-300">
                                                        Customer Name
                                                    </th>
                                                    <th className="w-24 px-3 py-3 text-left text-xs font-bold text-gray-700 border-r border-gray-300">
                                                        Resource
                                                    </th>
                                                    <th className="w-28 px-3 py-3 text-left text-xs font-bold text-gray-700 border-r border-gray-300">
                                                        DGFT Category
                                                    </th>
                                                    <th className="w-24 px-3 py-3 text-left text-xs font-bold text-gray-700 border-r border-gray-300">
                                                        GST Category
                                                    </th>
                                                    <th className="w-24 px-3 py-3 text-left text-xs font-bold text-gray-700 border-r border-gray-300">
                                                        Main Category
                                                    </th>
                                                    <th className="w-32 px-3 py-3 text-left text-xs font-bold text-gray-700 border-r border-gray-300">
                                                        Industry
                                                    </th>
                                                    <th className="w-32 px-3 py-3 text-left text-xs font-bold text-gray-700 border-r border-gray-300">
                                                        Sub Industry
                                                    </th>
                                                    <th className="w-24 px-3 py-3 text-left text-xs font-bold text-gray-700 border-r border-gray-300">
                                                        Department
                                                    </th>
                                                    <th className="w-24 px-3 py-3 text-left text-xs font-bold text-gray-700 border-r border-gray-300">
                                                        Fresh Services
                                                    </th>
                                                    <th className="w-24 px-3 py-3 text-left text-xs font-bold text-gray-700 border-r border-gray-300">
                                                        EODC Services
                                                    </th>
                                                    <th className="w-24 px-3 py-3 text-left text-xs font-bold text-gray-700 border-r border-gray-300">
                                                        Basic Services
                                                    </th>
                                                    <th className="w-32 px-3 py-3 text-left text-xs font-bold text-gray-700 border-r border-gray-300">
                                                        Other DGFT Services
                                                    </th>
                                                    <th className="w-24 px-3 py-3 text-left text-xs font-bold text-gray-700 border-r border-gray-300">
                                                        GST Services
                                                    </th>
                                                    <th className="w-32 px-3 py-3 text-left text-xs font-bold text-gray-700 border-r border-gray-300">
                                                        Mo. No.
                                                    </th>
                                                    <th className="w-32 px-3 py-3 text-left text-xs font-bold text-gray-700 border-r border-gray-300">
                                                        Contact Person-1
                                                    </th>
                                                    <th className="w-32 px-3 py-3 text-left text-xs font-bold text-gray-700 border-r border-gray-300">
                                                        Mo. No. 2
                                                    </th>
                                                    <th className="w-32 px-3 py-3 text-left text-xs font-bold text-gray-700 border-r border-gray-300">
                                                        Contact Person-2
                                                    </th>
                                                    <th className="w-48 px-3 py-3 text-left text-xs font-bold text-gray-700 border-r border-gray-300">
                                                        Mail id
                                                    </th>
                                                    <th className="w-48 px-3 py-3 text-left text-xs font-bold text-gray-700 border-r border-gray-300">
                                                        Mail ID 2
                                                    </th>
                                                    <th className="w-64 px-3 py-3 text-left text-xs font-bold text-gray-700 border-r border-gray-300">
                                                        Address
                                                    </th>
                                                    
                                                    {/* Dynamic Financial Year Columns */}
                                                    {getAllFinancialYears().map(year => (
                                                        <>
                                                            <th key={`domestic-${year}`} className="w-32 px-3 py-3 text-center text-xs font-bold text-gray-700 border-r border-gray-300">
                                                                Domestic {year}
                                                            </th>
                                                            <th key={`direct-${year}`} className="w-32 px-3 py-3 text-center text-xs font-bold text-gray-700 border-r border-gray-300">
                                                                Direct Export {year}
                                                            </th>
                                                            <th key={`merchant-${year}`} className="w-32 px-3 py-3 text-center text-xs font-bold text-gray-700 border-r border-gray-300">
                                                                Merchant Export {year}
                                                            </th>
                                                            <th key={`total-${year}`} className="w-32 px-3 py-3 text-center text-xs font-bold text-gray-700 border-r border-gray-300 bg-green-50">
                                                                Total Turnover {year}
                                                            </th>
                                                        </>
                                                    ))}
                                                    
                                                    <th className="w-36 px-3 py-3 text-center text-xs font-bold text-gray-700 border-r border-gray-300 bg-yellow-50">
                                                        Grand Total Turnover
                                                    </th>
                                                    <th className="w-28 px-3 py-3 text-left text-xs font-bold text-gray-700 border-r border-gray-300">
                                                        Client Joining Date
                                                    </th>
                                                    <th className="w-28 px-3 py-3 text-left text-xs font-bold text-gray-700 border-r border-gray-300">
                                                        Reference Client
                                                    </th>
                                                    <th className="w-24 px-3 py-3 text-center text-xs font-bold text-gray-700 border-r border-gray-300">
                                                        Documents
                                                    </th>
                                                    <th className="w-20 px-3 py-3 text-center text-xs font-bold text-gray-700">
                                                        Actions
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody className="bg-white divide-y divide-gray-200">
                                                {filteredClients.length === 0 ? (
                                                    <tr>
                                                        <td colSpan={24 + (getAllFinancialYears().length * 4)} className="px-6 py-12 text-center">
                                                            <div className="flex flex-col items-center space-y-3">
                                                                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                                                                    <FontAwesomeIcon icon={faSearch} className="text-gray-400 text-2xl" />
                                                                </div>
                                                                <div className="text-gray-500 text-lg font-medium">
                                                                    {clients.length === 0 ? "No clients found" : "No clients match your search"}
                                                                </div>
                                                                <div className="text-gray-400 text-sm">
                                                                    {clients.length === 0 ? "Start by adding your first client" : "Try adjusting your search criteria"}
                                                                </div>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ) : (
                                                    filteredClients.map((client, index) => (
                                                        <tr key={client.id || index} className="hover:bg-blue-50 transition-colors duration-200 divide-x divide-gray-200">
                                                            {/* Sr. No. */}
                                                            <td className="px-2 py-2 text-center text-xs text-gray-900 border-r border-gray-200 bg-gray-50 font-medium">
                                                                {index + 1}
                                                            </td>
                                                            
                                                            {/* Customer Name */}
                                                            <td className="px-3 py-2 text-xs text-gray-900 border-r border-gray-200 font-medium">
                                                                <div className="truncate" title={client.customerName}>
                                                                    <button
                                                                        onClick={() => {
                                                                            setSelectedClientForDocuments(client);
                                                                            setDocumentModalOpen(true);
                                                                        }}
                                                                        className="text-blue-600 hover:text-blue-800 hover:underline cursor-pointer"
                                                                    >
                                                                        {client.customerName || "-"}
                                                                    </button>
                                                                </div>
                                                            </td>
                                                            
                                                            {/* Resource */}
                                                            <td className="px-3 py-2 text-xs text-gray-700 border-r border-gray-200">
                                                                <div className="truncate" title={client.resource}>
                                                                    {client.resource || "-"}
                                                                </div>
                                                            </td>
                                                            
                                                            {/* DGFT Category */}
                                                            <td className="px-3 py-2 text-xs text-gray-700 border-r border-gray-200">
                                                                <div className="truncate" title={client.dgftCategory}>
                                                                    {client.dgftCategory || "-"}
                                                                </div>
                                                            </td>
                                                            
                                                            {/* GST Category */}
                                                            <td className="px-3 py-2 text-xs text-gray-700 border-r border-gray-200">
                                                                <div className="truncate" title={client.gstCategory}>
                                                                    {client.gstCategory || "-"}
                                                                </div>
                                                            </td>
                                                            
                                                            {/* Main Category */}
                                                            <td className="px-3 py-2 text-xs text-gray-700 border-r border-gray-200">
                                                                <div className="flex justify-center">
                                                                    {client.mainCategory ? (
                                                                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-blue-100 text-blue-800 font-medium">
                                                                            {client.mainCategory}
                                                                        </span>
                                                                    ) : "-"}
                                                                </div>
                                                            </td>
                                                            
                                                            {/* Industry */}
                                                            <td className="px-3 py-2 text-xs text-gray-700 border-r border-gray-200">
                                                                <div className="truncate" title={client.industry}>
                                                                    {client.industry || "-"}
                                                                </div>
                                                            </td>
                                                            
                                                            {/* Sub Industry */}
                                                            <td className="px-3 py-2 text-xs text-gray-700 border-r border-gray-200">
                                                                <div className="truncate" title={client.subIndustry}>
                                                                    {client.subIndustry || "-"}
                                                                </div>
                                                            </td>
                                                            
                                                            {/* Department */}
                                                            <td className="px-3 py-2 text-xs text-gray-700 border-r border-gray-200">
                                                                <div className="truncate" title={client.department}>
                                                                    {client.department || "-"}
                                                                </div>
                                                            </td>
                                                                             {/* Fresh Services */}
                                            <td className="px-3 py-2 text-xs text-gray-700 border-r border-gray-200">
                                                <div className="truncate" title={client.freshService}>
                                                    {client.freshService || "-"}
                                                </div>
                                            </td>
                                            
                                            {/* EODC Services */}
                                            <td className="px-3 py-2 text-xs text-gray-700 border-r border-gray-200">
                                                <div className="truncate" title={client.eodcService}>
                                                    {client.eodcService || "-"}
                                                </div>
                                            </td>
                                            
                                            {/* Basic Services */}
                                            <td className="px-3 py-2 text-xs text-gray-700 border-r border-gray-200">
                                                <div className="truncate" title={client.basicService}>
                                                    {client.basicService || "-"}
                                                </div>
                                            </td>
                                                            
                                                            {/* Other DGFT Services */}
                                                            <td className="px-3 py-2 text-xs text-gray-700 border-r border-gray-200">
                                                                <div className="truncate" title={client.otherDgftService}>
                                                                    {client.otherDgftService || "-"}
                                                                </div>
                                                            </td>
                                                            
                                                            {/* GST Services */}
                                                            <td className="px-3 py-2 text-xs text-gray-700 border-r border-gray-200">
                                                                <div className="truncate" title={client.gstService}>
                                                                    {client.gstService || "-"}
                                                                </div>
                                                            </td>
                                                            
                                                            {/* Mo. No. */}
                                                            <td className="px-3 py-2 text-xs text-gray-700 border-r border-gray-200">
                                                                <div className="truncate" title={client.mobileNumber1}>
                                                                    {client.mobileNumber1 || "-"}
                                                                </div>
                                                            </td>
                                                            
                                                            {/* Contact Person-1 */}
                                                            <td className="px-3 py-2 text-xs text-gray-700 border-r border-gray-200">
                                                                <div className="truncate" title={client.contactPersonName1}>
                                                                    {client.contactPersonName1 || "-"}
                                                                </div>
                                                            </td>
                                                            
                                                            {/* Mo. No. 2 */}
                                                            <td className="px-3 py-2 text-xs text-gray-700 border-r border-gray-200">
                                                                <div className="truncate" title={client.mobileNumber2}>
                                                                    {client.mobileNumber2 || "-"}
                                                                </div>
                                                            </td>
                                                            
                                                            {/* Contact Person-2 */}
                                                            <td className="px-3 py-2 text-xs text-gray-700 border-r border-gray-200">
                                                                <div className="truncate" title={client.contactPersonName2}>
                                                                    {client.contactPersonName2 || "-"}
                                                                </div>
                                                            </td>
                                                            
                                                            {/* Mail id */}
                                                            <td className="px-3 py-2 text-xs text-gray-700 border-r border-gray-200">
                                                                <div className="truncate" title={client.mailId1}>
                                                                    {client.mailId1 || "-"}
                                                                </div>
                                                            </td>
                                                            
                                                            {/* Mail ID 2 */}
                                                            <td className="px-3 py-2 text-xs text-gray-700 border-r border-gray-200">
                                                                <div className="truncate" title={client.mailId2}>
                                                                    {client.mailId2 || "-"}
                                                                </div>
                                                            </td>
                                                            
                                                            {/* Address */}
                                                            <td className="px-3 py-2 text-xs text-gray-700 border-r border-gray-200">
                                                                <div className="truncate" title={client.address}>
                                                                    {client.address || "-"}
                                                                </div>
                                                            </td>
                                                            
                                                            {/* Dynamic Financial Year Columns */}
                                                            {getAllFinancialYears().map(year => {
                                                                const turnover = getTurnoverForYear(client, year);
                                                                const domestic = turnover ? parseFloat(turnover.domesticTurnover) || 0 : 0;
                                                                const directExport = turnover ? parseFloat(turnover.directExportTurnover) || 0 : 0;
                                                                const merchantExport = turnover ? parseFloat(turnover.merchantExportTurnover) || 0 : 0;
                                                                const total = domestic + directExport + merchantExport;
                                                                
                                                                return (
                                                                    <>
                                                                        <td key={`domestic-${client.id}-${year}`} className="px-3 py-2 text-xs text-gray-700 border-r border-gray-200 text-right">
                                                                            {domestic > 0 ? `₹${domestic.toLocaleString('en-IN')}` : "-"}
                                                                        </td>
                                                                        <td key={`direct-${client.id}-${year}`} className="px-3 py-2 text-xs text-gray-700 border-r border-gray-200 text-right">
                                                                            {directExport > 0 ? `₹${directExport.toLocaleString('en-IN')}` : "-"}
                                                                        </td>
                                                                        <td key={`merchant-${client.id}-${year}`} className="px-3 py-2 text-xs text-gray-700 border-r border-gray-200 text-right">
                                                                            {merchantExport > 0 ? `₹${merchantExport.toLocaleString('en-IN')}` : "-"}
                                                                        </td>
                                                                        <td key={`total-${client.id}-${year}`} className="px-3 py-2 text-xs text-gray-900 border-r border-gray-200 text-right font-semibold bg-green-50">
                                                                            {total > 0 ? `₹${total.toLocaleString('en-IN')}` : "-"}
                                                                        </td>
                                                                    </>
                                                                );
                                                            })}
                                                            
                                                            {/* Grand Total Turnover */}
                                                            <td className="px-3 py-2 text-xs text-gray-900 border-r border-gray-200 text-right font-bold bg-yellow-50">
                                                                {calculateClientGrandTotal(client) > 0 
                                                                    ? `₹${calculateClientGrandTotal(client).toLocaleString('en-IN')}` 
                                                                    : "-"
                                                                }
                                                            </td>
                                                            
                                                            {/* Client Joining Date */}
                                                            <td className="px-3 py-2 text-xs text-gray-700 border-r border-gray-200">
                                                                <div className="truncate">
                                                                    {client.clientJoiningDate 
                                                                        ? new Date(client.clientJoiningDate).toLocaleDateString('en-IN')
                                                                        : "-"
                                                                    }
                                                                </div>
                                                            </td>
                                                            
                                                            {/* Reference Client */}
                                                            <td className="px-3 py-2 text-xs text-gray-700 border-r border-gray-200 text-center">
                                                                {client.ReferanceClient ? (
                                                                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-green-100 text-green-800 font-medium">
                                                                        Yes
                                                                    </span>
                                                                ) : (
                                                                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-gray-100 text-gray-800">
                                                                        No
                                                                    </span>
                                                                )}
                                                            </td>
                                                            
                                                            {/* Documents */}
                                                            <td className="px-3 py-2 text-xs text-gray-700 border-r border-gray-200 text-center">
                                                                <button
                                                                    onClick={() => {
                                                                        setSelectedClientForDocuments(client);
                                                                        setDocumentModalOpen(true);
                                                                    }}
                                                                    className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded hover:bg-blue-200 transition-colors"
                                                                    title="View Documents"
                                                                >
                                                                    <FontAwesomeIcon icon={faFileAlt} />
                                                                    {client.documents?.length || 0}
                                                                </button>
                                                            </td>
                                                            
                                                            {/* Actions */}
                                                            <td className="px-3 py-2 text-center border-r border-gray-200">
                                                                <div className="flex justify-center space-x-1">
                                                                    <button
                                                                        onClick={() => handleEditClient(client)}
                                                                        className="inline-flex items-center justify-center w-6 h-6 text-indigo-600 hover:text-white hover:bg-indigo-600 rounded transition-all duration-200"
                                                                        title="Edit Client"
                                                                    >
                                                                        <FontAwesomeIcon icon={faEdit} className="text-xs" />
                                                                    </button>
                                                                    <button
                                                                        onClick={() => {
                                                                            setClientToDelete(client);
                                                                            setDeleteConfirmOpen(true);
                                                                        }}
                                                                        className="inline-flex items-center justify-center w-6 h-6 text-red-600 hover:text-white hover:bg-red-600 rounded transition-all duration-200"
                                                                        title="Delete Client"
                                                                    >
                                                                        <FontAwesomeIcon icon={faTrash} className="text-xs" />
                                                                    </button>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    ))
                                                )}
                                            </tbody>
                                        </table>
                                    </div>

                                    {/* Statistics and Pagination info */}
                                    {filteredClients.length > 0 && (
                                        <div className="mt-6 bg-gray-50 rounded-lg p-4">
                                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
                                                <div className="flex flex-wrap gap-6 text-sm text-gray-700">
                                                    <div className="flex items-center space-x-2">
                                                        <FontAwesomeIcon icon={faBuilding} className="text-green-600" />
                                                        <span>Total Clients: <span className="font-semibold">{clients.length}</span></span>
                                                    </div>
                                                    <div className="flex items-center space-x-2">
                                                        <FontAwesomeIcon icon={faSearch} className="text-blue-600" />
                                                        <span>Filtered: <span className="font-semibold">{filteredClients.length}</span></span>
                                                    </div>
                                                    <div className="flex items-center space-x-2">
                                                        <FontAwesomeIcon icon={faUser} className="text-purple-600" />
                                                        <span>Reference Clients: <span className="font-semibold">{clients.filter(c => c.ReferanceClient).length}</span></span>
                                                    </div>
                                                    <div className="flex items-center space-x-2">
                                                        <FontAwesomeIcon icon={faIndianRupeeSign} className="text-yellow-600" />
                                                        <span>With Turnover: <span className="font-semibold">{clients.filter(c => c.turnover && c.turnover.length > 0).length}</span></span>
                                                    </div>
                                                </div>
                                                <div className="text-sm text-gray-500">
                                                    Last updated: {new Date().toLocaleDateString('en-IN')} {new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Delete Confirmation Modal */}
                {deleteConfirmOpen && (
                    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
                        <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
                            <div className="mt-3 text-center">
                                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
                                    <FontAwesomeIcon icon={faTrash} className="h-6 w-6 text-red-600" />
                                </div>
                                <h3 className="text-lg font-medium text-gray-900 mt-4">Delete Client</h3>
                                <div className="mt-2 px-7 py-3">
                                    <p className="text-sm text-gray-500">
                                        Are you sure you want to delete "{clientToDelete?.customerName}"? This action cannot be undone.
                                    </p>
                                </div>
                                <div className="items-center px-4 py-3 flex justify-end">
                                    <div className="flex space-x-4">
                                        <button
                                            onClick={() => {
                                                setDeleteConfirmOpen(false);
                                                setClientToDelete(null);
                                            }}
                                            className="px-4 py-2 bg-gray-500 text-white text-base font-medium rounded-md shadow-sm hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-300"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            onClick={() => clientToDelete && handleDeleteClient(clientToDelete.id)}
                                            className="px-4 py-2 bg-red-600 text-white text-base font-medium rounded-md shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Document Management Modal */}
                {documentModalOpen && selectedClientForDocuments && (
                    <DocumentManagementModal
                        isOpen={documentModalOpen}
                        onClose={() => {
                            setDocumentModalOpen(false);
                            setSelectedClientForDocuments(null);
                        }}
                        clientId={selectedClientForDocuments.id}
                        clientName={selectedClientForDocuments.customerName}
                        token={cookies.token}
                        onDocumentUpdate={fetchClients}
                    />
                )}
            </div>
        </div>
    );
};


export default ManageClient;