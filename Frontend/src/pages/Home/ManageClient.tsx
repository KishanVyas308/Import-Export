import { useState, useEffect } from "react";
import { useCookies } from "react-cookie";
import { useRecoilValue } from "recoil";
import { authAtom } from "../../atoms/authAtom";
import axios from "axios";
import { BACKEND_URL } from "../../Globle";
import Loading from "../components/Loading";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBuilding, faEnvelope, faPhone, faUser, faIndustry, faCogs, faMapMarkerAlt, faTag, faUsers, faPercent, faEdit, faTrash, faTimes, faPlus, faList, faSearch, faEye, faChevronDown } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";


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

    if (options) {
        // Dropdown/Select component
        return (
            <div className={`relative ${className}`}>
                <FontAwesomeIcon
                    icon={icon}
                    className="absolute left-4 top-4 text-green-500 text-xl"
                />
                <select
                    className={`${baseClasses} appearance-none cursor-pointer`}
                    value={value}
                    onChange={onChange}
                    required={required}
                >
                    <option value="">{placeholder}</option>
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
                <FontAwesomeIcon
                    icon={icon}
                    className="absolute left-4 top-4 text-green-500 text-xl"
                />
                <textarea
                    placeholder={placeholder}
                    className={`${baseClasses} resize-none`}
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
            <FontAwesomeIcon
                icon={icon}
                className="absolute left-4 top-4 text-green-500 text-xl"
            />
            <input
                type={type}
                placeholder={placeholder}
                className={baseClasses}
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

    // Additional state for client management
    const [clients, setClients] = useState([]);
    const [showClientsList, setShowClientsList] = useState(false);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [editingClient, setEditingClient] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentView, setCurrentView] = useState("list"); // "add", "list"
    const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
    const [clientToDelete, setClientToDelete] = useState(null);

    const [cookies, setCookie] = useCookies(["token"]);
    const user = useRecoilValue(authAtom);

    const navigate = useNavigate();

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
            const clientsData = Array.isArray(res.data) ? res.data : (res.data.clients || []);
            setClients(clientsData);
            console.log("Clients set:", clientsData); // Debug log
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
    };

    // Handle edit client
    const handleEditClient = (client) => {
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
        setCurrentView("add");
    };

    // Handle update client
    const handleUpdateClient = async (e) => {
        e.preventDefault();

        if (!customerName || !mobileNumber1 || !mailId1) {
            alert("Please fill in all required fields");
            return;
        }

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

    const handleRegister = async (e) => {
        e.preventDefault();

        if (!customerName || !mobileNumber1 || !mailId1) {
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
                    <div className="max-w-6xl mx-auto">
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
                                                placeholder="customerName *"
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
                                                placeholder="mobileNumber1 *"
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
                                                placeholder="mailId1 *"
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
                                        </div>
                                        {/* Action Buttons */}
                                        <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200">
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    if (editingClient) {
                                                        setEditingClient(null);
                                                        clearForm();
                                                    } else {
                                                        handleGoback();
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
                                        <h2 className="text-2xl font-bold text-gray-800">All Clients</h2>

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

                                

                                    {/* Clients Table */}
                                    <div className="overflow-x-auto">
                                        <table className="min-w-full divide-y divide-gray-200">
                                            <thead className="bg-gray-50">
                                                <tr>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Client Name
                                                    </th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Contact
                                                    </th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Industry
                                                    </th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Services
                                                    </th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Actions
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody className="bg-white divide-y divide-gray-200">
                                                {filteredClients.length === 0 ? (
                                                    <tr>
                                                        <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                                                            {clients.length === 0 ? "No clients found" : "No clients match your search"}
                                                        </td>
                                                    </tr>
                                                ) : (
                                                    filteredClients.map((client, index) => (
                                                        <tr key={client.id || index} className="hover:bg-gray-50">
                                                            <td className="px-6 py-4 whitespace-nowrap">
                                                                <div className="flex items-center">
                                                                    <div className="flex-shrink-0 h-10 w-10">
                                                                        <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                                                                            <FontAwesomeIcon icon={faBuilding} className="text-green-600" />
                                                                        </div>
                                                                    </div>
                                                                    <div className="ml-4">
                                                                        <div className="text-sm font-medium text-gray-900">
                                                                            {client.customerName || "N/A"}
                                                                        </div>
                                                                        <div className="text-sm text-gray-500">
                                                                            {client.mainCategory || "N/A"}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap">
                                                                <div className="text-sm text-gray-900">{client.mailId1 || "N/A"}</div>
                                                                <div className="text-sm text-gray-500">{client.mobileNumber1 || "N/A"}</div>
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap">
                                                                <div className="text-sm text-gray-900">{client.industry || "N/A"}</div>
                                                                <div className="text-sm text-gray-500">{client.subIndustry || "N/A"}</div>
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap">
                                                                <div className="flex flex-wrap gap-1">
                                                                    {client.freshService && (
                                                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                                            Fresh
                                                                        </span>
                                                                    )}
                                                                    {client.gstService && (
                                                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                                            GST
                                                                        </span>
                                                                    )}
                                                                    {client.eodcService && (
                                                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                                                                            EODC
                                                                        </span>
                                                                    )}
                                                                </div>
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                                <div className="flex space-x-2">
                                                                    <button
                                                                        onClick={() => handleEditClient(client)}
                                                                        className="text-indigo-600 hover:text-indigo-900 p-2 rounded-lg hover:bg-indigo-50 transition-all"
                                                                        title="Edit Client"
                                                                    >
                                                                        <FontAwesomeIcon icon={faEdit} />
                                                                    </button>
                                                                    <button
                                                                        onClick={() => {
                                                                            setClientToDelete(client);
                                                                            setDeleteConfirmOpen(true);
                                                                        }}
                                                                        className="text-red-600 hover:text-red-900 p-2 rounded-lg hover:bg-red-50 transition-all"
                                                                        title="Delete Client"
                                                                    >
                                                                        <FontAwesomeIcon icon={faTrash} />
                                                                    </button>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    ))
                                                )}
                                            </tbody>
                                        </table>
                                    </div>

                                    {/* Pagination info */}
                                    {filteredClients.length > 0 && (
                                        <div className="mt-6 flex justify-between items-center">
                                            <div className="text-sm text-gray-700">
                                                Showing {filteredClients.length} of {clients.length} clients
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
                                            onClick={() => handleDeleteClient(clientToDelete.id)}
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
            </div>
        </div>
    );
};


export default ManageClient;