import React, { useEffect, useState } from "react";
import axios from "axios";
import { BACKEND_URL } from "../../../../Globle";
import { useCookies } from "react-cookie";
import ProcessMonatringHeader from "./ProcessMonatringHeader";
import Loading from "../../../components/Loading";
import { useRecoilValue } from "recoil";
import { authAtom, Role } from "../../../../atoms/authAtom";
import { useNavigate } from "react-router-dom";

interface User {
  id: string;
  contactPersonName: string;
  email: string;
  isOnline: boolean;
  role: string;
}

interface ShippingBill {
  id: string;
  addedByUserId: string;
  currentExportersName: string;
  isPart1Section1Completed: boolean;
  isPart1Section2Completed: boolean;
  isPart1Section3Completed: boolean;
  isPart2Section1Completed: boolean;
  isPart2Section2Completed: boolean;
  isPart2Section3Completed: boolean;
  isPart3Section1Completed: boolean;
  isPart3Section2Completed: boolean;
  isPart3Section3Completed: boolean;
  isPart4Section1Completed: boolean;
  isPart4Section2Completed: boolean;
  isPart4Section3Completed: boolean;
  isPart4Section4Completed: boolean;
  isPart4Section5Completed: boolean;
  isPart4Section6Completed: boolean;
  isPart5Completed: boolean;
}

const App: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [cookies] = useCookies(["token"]);
  const [modalUserId, setModalUserId] = useState<string | null>(null);
  const [allUsersShippingBill, setAllUsersShippingBill] = useState<ShippingBill[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedDetail, setSelectedDetail] = useState<any | null>(null);
  const [selectedUserDirectExportsDetail, setSelectedUserDirectExportsDetail] = useState<any[]>([]);
  const [selectedUserShippingBillDetail, setSelectedUserShippingBillDetail] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeModal, setActiveModal] = useState<"userDetail" | "exportDetail" | null>(null);

  const currentUser = useRecoilValue(authAtom);
  const navigate = useNavigate();

  // Fetch all users initially
  useEffect(() => {
    if (currentUser.user.role !== Role.ADMIN) {
      alert("You are not authorized to view this page");
      navigate("/");
      return;
    }
    
    const fetchUsers = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(
          `${BACKEND_URL}/manageUser/getallusers`,
          {
            headers: {
              Authorization: cookies.token,
            },
          }
        );

        setUsers(response.data);

        // Fetch all users shipping bill
        const shippingBillResponse = await axios.get(
          `${BACKEND_URL}/manageUserShippingBill/getAllUsersShippingBill`,
          {
            headers: {
              Authorization: cookies.token,
            },
          }
        );

        setAllUsersShippingBill(shippingBillResponse.data);
      } catch (error) {
        console.error("Failed to fetch users", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, [cookies.token, currentUser.user.role, navigate]);

  const handleOnOpenUserDetail = async (userId: string) => {
    setIsLoading(true);
    setModalUserId(userId);
    setActiveModal("userDetail");

    try {
      const directexportsRes = await axios.get(
        `${BACKEND_URL}/manageUser/usercompleteddirectexports/${userId}`,
        {
          headers: {
            Authorization: cookies.token,
          },
        }
      );
      setSelectedUserDirectExportsDetail(directexportsRes.data);

      const shippingBillResponse = await axios.get(
        `${BACKEND_URL}/manageUserShippingBill/usercompletedshippingbills/${userId}`,
        {
          headers: {
            Authorization: cookies.token,
          },
        }
      );
      setSelectedUserShippingBillDetail(shippingBillResponse.data);
    } catch (error) {
      console.error("Failed to fetch user details", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOnOpenDetailedView = (detail: any) => {
    setSelectedDetail(detail);
    setActiveModal("exportDetail");
  };

  const closeModals = () => {
    setModalUserId(null);
    setSelectedDetail(null);
    setActiveModal(null);
  };

  const filteredUsers = users.filter(
    (user) =>
      user.role === "USER" &&
      (user.contactPersonName.toLowerCase().includes(searchTerm.toLowerCase()) ||
       user.email.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const getUserShippingBills = (userId: string) => {
    return allUsersShippingBill.filter(bill => bill.addedByUserId === userId);
  };

  const getCompletionPercentage = (userId: string) => {
    const userBills = getUserShippingBills(userId);
    if (!userBills.length) return 0;
    
    let totalSections = 0;
    let completedSections = 0;
    
    userBills.forEach(bill => {
      // Count all sections
      const sections = [
        bill.isPart1Section1Completed, bill.isPart1Section2Completed, bill.isPart1Section3Completed,
        bill.isPart2Section1Completed, bill.isPart2Section2Completed, bill.isPart2Section3Completed,
        bill.isPart3Section1Completed, bill.isPart3Section2Completed, bill.isPart3Section3Completed,
        bill.isPart4Section1Completed, bill.isPart4Section2Completed, bill.isPart4Section3Completed,
        bill.isPart4Section4Completed, bill.isPart4Section5Completed, bill.isPart4Section6Completed,
        bill.isPart5Completed
      ];
      
      totalSections += sections.length;
      completedSections += sections.filter(Boolean).length;
    });
    
    return Math.round((completedSections / totalSections) * 100);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <ProcessMonatringHeader searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      
      {/* Main Content */}
      <div className=" mx-auto px-4 sm:px-8 lg:px-12">
        {/* <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">User Monitoring Dashboard</h1>
          <p className="mt-2 text-gray-600">Track user progress and shipping bill completion status</p>
          
          
        </div>
         */}
        {isLoading && !activeModal ? (
          <div className="flex items-center justify-center h-64">
            <Loading />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredUsers.map((user) => (
              <div
                key={user.id}
                className={`bg-white rounded-xl  border-2 ${user.isOnline ? "border-green-500" : ""} shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden`}
              >
                <div className="p-6">
                  {/* User Card Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h2 className="text-xl font-semibold text-gray-800 truncate">{user.contactPersonName}</h2>
                      <p className="text-gray-500 text-sm mt-1 truncate">{user.email}</p>
                    </div>
                    <div className="flex items-center">
                      <span
                        className={`h-3 w-3 rounded-full ${
                          user.isOnline ? "bg-green-500" : "bg-red-500"
                        }`}
                      ></span>
                      <span className="ml-2 text-xs font-medium text-gray-500">
                        {user.isOnline ? "Online" : "Offline"}
                      </span>
                    </div>
                  </div>
                  
                  {/* Progress Circle */}
                  <div className="flex justify-center mb-4">
                    <div className="relative w-24 h-24">
                      <svg className="w-24 h-24" viewBox="0 0 100 100">
                        <circle
                          className="text-gray-200"
                          strokeWidth="8"
                          stroke="currentColor"
                          fill="transparent"
                          r="45"
                          cx="50"
                          cy="50"
                        />
                        <circle
                          className="text-blue-600"
                          strokeWidth="8"
                          strokeDasharray={`${2 * Math.PI * 45}`}
                          strokeDashoffset={`${2 * Math.PI * 45 * (1 - getCompletionPercentage(user.id) / 100)}`}
                          strokeLinecap="round"
                          stroke="currentColor"
                          fill="transparent"
                          r="45"
                          cx="50"
                          cy="50"
                        />
                      </svg>
                      <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
                        <span className="text-xl font-semibold text-gray-700">{getCompletionPercentage(user.id)}%</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Shipping Bills Summary */}
                  <div className="space-y-2 mb-4">
                    <h3 className="font-medium text-gray-700">Shipping Bills: {getUserShippingBills(user.id).length}</h3>
                    
                    {getUserShippingBills(user.id).map((bill, index) => (
                      <div key={bill.id} className="bg-gray-50 p-3 rounded-lg">
                        <div className="flex justify-between items-center mb-2">
                          <h4 className="font-medium text-gray-700 text-sm truncate" title={bill.currentExportersName}>
                            {bill.currentExportersName}
                          </h4>
                          <span className="text-xs font-medium bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                            Bill #{index + 1}
                          </span>
                        </div>
                        
                        {/* Progress Bars */}
                        <div className="space-y-1.5">
                          <ProgressSection
                            label="Part 1"
                            sections={[
                              bill.isPart1Section1Completed,
                              bill.isPart1Section2Completed,
                              bill.isPart1Section3Completed
                            ]}
                          />
                          
                          <ProgressSection
                            label="Part 2"
                            sections={[
                              bill.isPart2Section1Completed,
                              bill.isPart2Section2Completed,
                              bill.isPart2Section3Completed
                            ]}
                          />
                          
                          <ProgressSection
                            label="Part 3"
                            sections={[
                              bill.isPart3Section1Completed,
                              bill.isPart3Section2Completed,
                              bill.isPart3Section3Completed
                            ]}
                          />
                          
                          <ProgressSection
                            label="Part 4"
                            sections={[
                              bill.isPart4Section1Completed,
                              bill.isPart4Section2Completed,
                              bill.isPart4Section3Completed,
                              bill.isPart4Section4Completed,
                              bill.isPart4Section5Completed,
                              bill.isPart4Section6Completed
                            ]}
                          />
                          
                          <ProgressSection
                            label="Part 5"
                            sections={[bill.isPart5Completed]}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {/* View Details Button */}
                  <button
                    onClick={() => handleOnOpenUserDetail(user.id)}
                    className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200 flex items-center justify-center"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                      <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                    </svg>
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {/* User Detail Modal */}
        {activeModal === "userDetail" && modalUserId && (
          <div className="fixed inset-0 z-50 overflow-auto bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-6xl max-h-[90vh] overflow-auto">
              <div className="sticky top-0 bg-white z-10 px-6 py-4 border-b flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-800">
                  {users.find(u => u.id === modalUserId)?.contactPersonName}'s Details
                </h2>
                <button
                  onClick={closeModals}
                  className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              {isLoading ? (
                <div className="flex items-center justify-center h-64">
                  <Loading />
                </div>
              ) : (
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-4 flex items-center text-gray-800">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Completed Direct Exports ({selectedUserDirectExportsDetail.length})
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                    {selectedUserDirectExportsDetail
                      .sort((a, b) => new Date(b.basicSheet.uploadedDate).getTime() - new Date(a.basicSheet.uploadedDate).getTime())
                      .map((detail, index) => (
                        <div 
                          key={index} 
                          onClick={() => handleOnOpenDetailedView(detail)}
                          className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 cursor-pointer p-4"
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-semibold text-gray-800">{detail.basicSheet.companyName}</h4>
                              <p className="text-sm text-gray-600 mt-1">SB No: {detail.basicSheet.shippingBillNo}</p>
                            </div>
                            <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
                              {new Date(detail.basicSheet.uploadedDate).toLocaleDateString('en-GB')}
                            </span>
                          </div>
                          
                          <div className="mt-3 pt-3 border-t border-gray-100">
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-600">CIF Value:</span>
                              <span className="font-medium text-gray-800">{detail.basicSheet.cifValue}</span>
                            </div>
                            <div className="flex justify-between text-sm mt-1">
                              <span className="text-gray-600">HS Code:</span>
                              <span className="font-medium text-gray-800">{detail.basicSheet.hsCodeAndDescription}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
        
        {/* Export Detail Modal */}
        {activeModal === "exportDetail" && selectedDetail && (
          <div className="fixed inset-0 z-50 overflow-auto bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-6xl max-h-[90vh] overflow-auto">
              <div className="sticky top-0 bg-white z-10 px-6 py-4 border-b flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-800">
                  Export Details: {selectedDetail.basicSheet.companyName}
                </h2>
                <button
                  onClick={() => setSelectedDetail(null)}
                  className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="p-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Basic Sheet */}
                  <div className="bg-gray-50 p-5 rounded-xl shadow-sm">
                    <h3 className="text-lg font-semibold mb-4 text-gray-800 border-b pb-2">Basic Sheet</h3>
                    <div className="space-y-3">
                      <DetailRow label="Company Name" value={selectedDetail.basicSheet.companyName} />
                      <DetailRow label="Uploaded Date" value={new Date(selectedDetail.basicSheet.uploadedDate).toLocaleDateString('en-GB')} />
                      <DetailRow label="Shipping Bill No" value={selectedDetail.basicSheet.shippingBillNo} />
                      <DetailRow label="Shipping Bill Date" value={selectedDetail.basicSheet.shippingBillDate} />
                      <DetailRow label="Exporters Name" value={selectedDetail.basicSheet.exportersName} />
                      <DetailRow label="HS Code" value={selectedDetail.basicSheet.hsCodeAndDescription} />
                      <DetailRow label="EPCG Lic No" value={selectedDetail.basicSheet.epcgLicNo} />
                      <DetailRow label="CIF Value" value={selectedDetail.basicSheet.cifValue} />
                      <DetailRow label="Freight" value={selectedDetail.basicSheet.freight} />
                      <DetailRow label="Insurance" value={selectedDetail.basicSheet.insurance} />
                      <DetailRow label="BRC" value={selectedDetail.basicSheet.brc} />
                      <DetailRow label="Exchange Rate" value={selectedDetail.basicSheet.exchangeRateOrProprtionRatio} />
                      <DetailRow label="Product" value={selectedDetail.basicSheet.product} />
                      <DetailRow label="Remarks" value={selectedDetail.basicSheet.remarks} />
                    </div>
                  </div>
                  
                  {/* Annexure 1 */}
                  <div className="bg-gray-50 p-5 rounded-xl shadow-sm">
                    <h3 className="text-lg font-semibold mb-4 text-gray-800 border-b pb-2">Annexure 1</h3>
                    <div className="space-y-3">
                      <DetailRow label="Shipping Bill No" value={selectedDetail.Annexure1.shippingBillNo} />
                      <DetailRow label="Shipping Bill Date" value={selectedDetail.Annexure1.shippingBillDate} />
                      <DetailRow label="CIF Value (USD)" value={selectedDetail.Annexure1.shippingBillCifValueInDoller} />
                      <DetailRow label="BRC Value" value={selectedDetail.Annexure1.brcValue} />
                      <DetailRow label="Lower of SB and BRC" value={selectedDetail.Annexure1.lowerOfSbAndBrc} />
                      <DetailRow label="Shipping Bill Freight" value={selectedDetail.Annexure1.shippingBillFreight} />
                      <DetailRow label="Shipping Bill Insurance" value={selectedDetail.Annexure1.shippingBillInsurance} />
                      <DetailRow label="FOB Value (USD)" value={selectedDetail.Annexure1.fobValueInDoller} />
                      <DetailRow label="Exchange Rate" value={selectedDetail.Annexure1.ExchangeRatePerShippingBill} />
                      <DetailRow label="FOB Value (INR)" value={selectedDetail.Annexure1.fobValueInRupees} />
                    </div>
                  </div>
                  
                  {/* Annexure A */}
                  <div className="bg-gray-50 p-5 rounded-xl shadow-sm">
                    <h3 className="text-lg font-semibold mb-4 text-gray-800 border-b pb-2">Annexure A</h3>
                    <div className="space-y-3">
                      <DetailRow label="Product Exported" value={selectedDetail.AnnexureA.productExportered} />
                      <DetailRow label="Shipping Bill Number" value={selectedDetail.AnnexureA.shippingBillNumber} />
                      <DetailRow label="Shipping Bill Date" value={selectedDetail.AnnexureA.shippingBillDate} />
                      <DetailRow label="Direct Exports (INR)" value={selectedDetail.AnnexureA.directExportsInRupees} />
                      <DetailRow label="Direct Exports (USD)" value={selectedDetail.AnnexureA.directExportsInDollars} />
                      <DetailRow label="Deemed Exports" value={selectedDetail.AnnexureA.deemedExports} />
                      <DetailRow label="Third Party Exports (INR)" value={selectedDetail.AnnexureA.thirdPartyExportsInRupees} />
                      <DetailRow label="Third Party Exports (USD)" value={selectedDetail.AnnexureA.thirdPartyExportsInDollars} />
                      <DetailRow label="By Group Company" value={selectedDetail.AnnexureA.byGroupCompany} />
                      <DetailRow label="Other RW Series" value={selectedDetail.AnnexureA.otherRWseries} />
                      <DetailRow label="Total (INR)" value={selectedDetail.AnnexureA.totalInRupees} />
                      <DetailRow label="Total (USD)" value={selectedDetail.AnnexureA.totalInDollars} />
                    </div>
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

// Helper Components
interface DetailRowProps {
  label: string;
  value: string | number;
}

const DetailRow: React.FC<DetailRowProps> = ({ label, value }) => {
  return (
    <div className="flex justify-between items-center">
      <span className="text-sm text-gray-600">{label}:</span>
      <span className="text-sm font-medium text-gray-800">{value || "—"}</span>
    </div>
  );
};

interface ProgressSectionProps {
  label: string;
  sections: boolean[];
}

const ProgressSection: React.FC<ProgressSectionProps> = ({ label, sections }) => {
  const completedCount = sections.filter(Boolean).length;
  const totalCount = sections.length;
  
  return (
    <div>
      <div className="flex justify-between items-center mb-1">
        <span className="text-xs font-medium text-gray-600">{label}</span>
        <span className="text-xs text-gray-500">{completedCount}/{totalCount}</span>
      </div>
      <div className="flex space-x-1">
        {sections.map((isCompleted, index) => (
          <div key={index} className="flex-1 h-1.5 rounded-full" title={`Section ${index + 1}`}>
            <div 
              className={`h-full rounded-full ${isCompleted ? "bg-green-500" : "bg-red-400"}`}
              style={{ width: "100%" }}
            ></div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;