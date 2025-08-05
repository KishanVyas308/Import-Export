import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faTimes, 
  faUpload, 
  faDownload, 
  faEye, 
  faEdit, 
  faTrash, 
  faFilePdf, 
  faFileWord, 
  faFileImage, 
  faFileAlt,
  faPlus,
  faSave,
  faFolder,
  faCloud,
  faCheckCircle,
  faExclamationTriangle
} from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import { BACKEND_URL } from '../Globle';

interface ClientDocument {
  id: string;
  documentType: string;
  fileName: string;
  originalName: string;
  filePath: string;
  fileSize: number;
  mimeType: string;
  uploadedDate: string;
  url: string;
  documentTypeName: string;
}

interface DocumentModalProps {
  isOpen: boolean;
  onClose: () => void;
  clientId: string;
  clientName: string;
  token: string;
  onDocumentUpdate: () => void;
}

const DOCUMENT_TYPES = [
  { key: 'FIRM_PAN', label: 'Firm Pan' },
  { key: 'IEC_CERTIFICATE', label: 'IEC Certificate' },
  { key: 'RCMC_CERTIFICATE', label: 'RCMC Certificate' },
  { key: 'UDYAM_CERTIFICATE', label: 'Udyam Certificate' },
  { key: 'GST_CERTIFICATE', label: 'GST Certificate' },
  { key: 'PARTNERSHIP_DEED', label: 'Partnership Deed / MOA' }
];

const DocumentManagementModal: React.FC<DocumentModalProps> = ({
  isOpen,
  onClose,
  clientId,
  clientName,
  token,
  onDocumentUpdate
}) => {
  const [documents, setDocuments] = useState<ClientDocument[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedDocumentType, setSelectedDocumentType] = useState('');
  const [editingDocument, setEditingDocument] = useState<ClientDocument | null>(null);
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [viewingDocument, setViewingDocument] = useState<ClientDocument | null>(null);

  // Fetch documents when modal opens
  useEffect(() => {
    if (isOpen && clientId) {
      fetchDocuments();
    }
  }, [isOpen, clientId]);

  const fetchDocuments = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${BACKEND_URL}/documents/client/${clientId}`, {
        headers: { Authorization: token }
      });
      setDocuments(response.data.documents || []);
    } catch (error) {
      console.error('Failed to fetch documents:', error);
      alert('Failed to fetch documents');
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const uploadDocument = async () => {
    if (!selectedFile || !selectedDocumentType) {
      alert('Please select a file and document type');
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('document', selectedFile);
      formData.append('documentType', selectedDocumentType);

      const response = await axios.post(
        `${BACKEND_URL}/documents/upload/${clientId}`,
        formData,
        {
          headers: {
            Authorization: token,
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      alert(response.data.message);
      setSelectedFile(null);
      setSelectedDocumentType('');
      setShowUploadForm(false);
      fetchDocuments();
      onDocumentUpdate();
    } catch (error) {
      console.error('Upload failed:', error);
      alert('Failed to upload document');
    } finally {
      setUploading(false);
    }
  };

  const replaceDocument = async (documentToReplace: ClientDocument, newFile: File) => {
    setUploading(true);
    try {
      // First delete the old document
      await axios.delete(`${BACKEND_URL}/documents/${documentToReplace.id}`, {
        headers: { Authorization: token }
      });

      // Then upload the new document
      const formData = new FormData();
      formData.append('document', newFile);
      formData.append('documentType', documentToReplace.documentType);

      const response = await axios.post(
        `${BACKEND_URL}/documents/upload/${clientId}`,
        formData,
        {
          headers: {
            Authorization: token,
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      alert('Document replaced successfully!');
      setEditingDocument(null);
      fetchDocuments();
      onDocumentUpdate();
    } catch (error) {
      console.error('Replace failed:', error);
      alert('Failed to replace document');
    } finally {
      setUploading(false);
    }
  };

  const deleteDocument = async (documentId: string) => {
    if (!confirm('Are you sure you want to delete this document?')) return;

    setLoading(true);
    try {
      const response = await axios.delete(`${BACKEND_URL}/documents/${documentId}`, {
        headers: { Authorization: token }
      });

      alert(response.data.message);
      fetchDocuments();
      onDocumentUpdate();
    } catch (error) {
      console.error('Delete failed:', error);
      alert('Failed to delete document');
    } finally {
      setLoading(false);
    }
  };

  const getFileIcon = (mimeType: string) => {
    if (mimeType.includes('pdf')) return faFilePdf;
    if (mimeType.includes('word') || mimeType.includes('document')) return faFileWord;
    if (mimeType.includes('image')) return faFileImage;
    return faFileAlt;
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getDocumentUrl = (documentUrl: string) => {
    // Remove /api/v1 from BACKEND_URL for document access since document URLs already include /api/uploads
    const baseUrl1 = BACKEND_URL.replace('/api/v1', '');
    const baseUrl = baseUrl1.replace('/v1', '');
    return `${baseUrl}${documentUrl}`;
  };

  const openDocument = (document: ClientDocument) => {
    // Show document in modal viewer instead of opening in new tab
    setViewingDocument(document);
  };

  if (!isOpen) return null;

  return (
    <div>
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes slideUp {
          from { transform: translateY(20px) scale(0.95); opacity: 0; }
          to { transform: translateY(0) scale(1); opacity: 1; }
        }
        
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
        
        .animate-slideUp {
          animation: slideUp 0.3s ease-out;
        }
        
        .animate-blob {
          animation: blob 7s infinite;
        }
        
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
      
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn">
        <div className="bg-white rounded-3xl shadow-2xl w-full max-w-7xl max-h-[95vh] overflow-hidden transform animate-slideUp">
        {/* Modern Header with Gradient */}
        <div className="relative bg-gradient-to-r from-green-500 to-green-600 text-white p-6 overflow-hidden">
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
          
          <div className="relative z-10 flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="bg-white/20 p-3 rounded-xl backdrop-blur-sm">
                <FontAwesomeIcon icon={faFolder} size="lg" className="text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold tracking-tight">Document Management</h2>
                <p className="text-green-100 mt-1 text-sm">
                  <FontAwesomeIcon icon={faCloud} className="mr-2" />
                  Client: <span className="font-semibold">{clientName}</span>
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="bg-white/20 hover:bg-white/30 backdrop-blur-sm p-2 rounded-xl transition-all duration-300 hover:scale-110 group"
            >
              <FontAwesomeIcon icon={faTimes} className="text-white group-hover:rotate-90 transition-transform duration-300" />
            </button>
          </div>
        </div>

        {/* Content with Modern Design */}
        <div className="p-8 overflow-y-auto max-h-[calc(95vh-200px)] bg-gradient-to-br from-gray-50 to-white">
          {loading && (
            <div className="flex justify-center items-center py-16">
              <div className="relative">
                <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200"></div>
                <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent absolute top-0"></div>
              </div>
            </div>
          )}

          {/* Modern Upload Form */}
          {showUploadForm && (
            <div className="bg-white rounded-xl p-6 mb-6 border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="flex items-center mb-4">
                <div className="bg-gradient-to-r from-green-500 to-green-600 p-2 rounded-lg mr-3">
                  <FontAwesomeIcon icon={faUpload} className="text-white text-lg" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-800">Upload New Document</h3>
                  <p className="text-gray-600 text-sm mt-0.5">Add a new document to this client's portfolio</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
                <div className="space-y-2">
                  <label className="flex items-center text-xs font-semibold text-gray-700 mb-2">
                    <FontAwesomeIcon icon={faFileAlt} className="mr-2 text-green-500" />
                    Document Type
                  </label>
                  <div className="relative">
                    <select
                      value={selectedDocumentType}
                      onChange={(e) => setSelectedDocumentType(e.target.value)}
                      className="w-full p-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500/30 focus:border-green-500 transition-all duration-300 bg-white shadow-sm hover:shadow-md text-sm"
                    >
                      <option value="">Select Document Type</option>
                      {DOCUMENT_TYPES.map(type => {
                        const existingDoc = documents.find(doc => doc.documentType === type.key);
                        return (
                          <option 
                            key={type.key} 
                            value={type.key}
                            disabled={!!existingDoc}
                          >
                            {type.label} {existingDoc ? '(Already exists)' : ''}
                          </option>
                        );
                      })}
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="flex items-center text-xs font-semibold text-gray-700 mb-2">
                    <FontAwesomeIcon icon={faCloud} className="mr-2 text-green-500" />
                    Select File
                  </label>
                  <div className="relative">
                    <input
                      type="file"
                      onChange={handleFileSelect}
                      accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.gif,.webp"
                      className="w-full p-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500/30 focus:border-green-500 transition-all duration-300 bg-white shadow-sm hover:shadow-md file:mr-3 file:py-1 file:px-3 file:border-0 file:rounded-md file:bg-green-50 file:text-green-600 file:font-medium hover:file:bg-green-100 text-sm"
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={uploadDocument}
                  disabled={uploading || !selectedFile || !selectedDocumentType}
                  className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-lg hover:from-green-600 hover:to-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 font-semibold text-sm shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  <FontAwesomeIcon icon={faUpload} className={uploading ? "animate-bounce" : ""} />
                  {uploading ? 'Uploading...' : 'Upload Document'}
                </button>
                <button
                  onClick={() => {
                    setShowUploadForm(false);
                    setSelectedFile(null);
                    setSelectedDocumentType('');
                  }}
                  className="flex items-center gap-2 bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600 transition-all duration-300 font-semibold text-sm shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  <FontAwesomeIcon icon={faTimes} />
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* Modern Add Document Button */}
          {!showUploadForm && (
            <div className="text-center mb-6">
              <button
                onClick={() => setShowUploadForm(true)}
                className="group bg-gradient-to-r from-green-500 to-green-600 text-white px-8 py-3 rounded-xl hover:from-green-600 hover:to-green-700 transition-all duration-300 font-semibold text-base shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 hover:scale-105"
              >
                <FontAwesomeIcon icon={faPlus} className="mr-2 group-hover:rotate-90 transition-transform duration-300" />
                Add New Document
              </button>
            </div>
          )}

          {/* Modern Empty State */}
          {!loading && documents.length === 0 && (
            <div className="text-center py-16">
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-8 max-w-md mx-auto">
                <div className="bg-gradient-to-r from-green-500 to-green-600 p-4 rounded-xl inline-flex mb-4">
                  <FontAwesomeIcon icon={faFolder} size="2x" className="text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-3">No Documents Yet</h3>
                <p className="text-gray-600 text-base mb-4">
                  Start building your client's document portfolio by uploading their first document
                </p>
                <button
                  onClick={() => setShowUploadForm(true)}
                  className="bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  <FontAwesomeIcon icon={faPlus} className="mr-2" />
                  Get Started
                </button>
              </div>
            </div>
          )}

          {/* Modern Documents Grid */}
          {!loading && documents.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-800">Document Portfolio</h3>
                <div className="flex items-center bg-white rounded-lg px-3 py-1.5 shadow-sm border">
                  <FontAwesomeIcon icon={faCheckCircle} className="text-green-500 mr-1.5" />
                  <span className="text-xs font-semibold text-gray-700">{documents.length} Documents</span>
                </div>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                {documents.map((doc) => (
                  <div key={doc.id} className="group bg-white rounded-xl p-4 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-green-200 transform hover:-translate-y-1">
                    {/* Document Header */}
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className="bg-gradient-to-br from-green-500 to-green-600 p-3 rounded-xl">
                          <FontAwesomeIcon 
                            icon={getFileIcon(doc.mimeType)} 
                            size="lg" 
                            className="text-white" 
                          />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-bold text-base text-gray-800 mb-1">{doc.documentTypeName}</h4>
                          <p className="text-xs text-gray-600 truncate max-w-32" title={doc.originalName}>
                            {doc.originalName}
                          </p>
                          <div className="flex items-center mt-1">
                            <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-0.5 rounded-md">
                              {formatFileSize(doc.fileSize)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Upload Date */}
                    <div className="mb-3 p-2 bg-gray-50 rounded-lg">
                      <p className="text-xs text-gray-500 flex items-center">
                        <FontAwesomeIcon icon={faCloud} className="mr-1.5 text-green-500" />
                        Uploaded: {new Date(doc.uploadedDate).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </p>
                    </div>

                    {/* Action Buttons */}
                    <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => openDocument(doc)}
                      className="flex items-center justify-center gap-1.5 bg-blue-500 text-white px-3 py-2 rounded-lg text-xs font-semibold hover:bg-blue-600 transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                    >
                      <FontAwesomeIcon icon={faEye} />
                      View
                    </button>
                    <a
                      href={`${getDocumentUrl(doc.url)}?token=${encodeURIComponent(token)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-1.5 bg-blue-500 text-white px-3 py-2 rounded-lg text-xs font-semibold hover:bg-blue-600 transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                    >
                      <FontAwesomeIcon icon={faEye} />
                      View in New Tab
                    </a>
                      <a
                        href={`${getDocumentUrl(doc.url)}?token=${encodeURIComponent(token)}`}
                        download={doc.originalName}
                        className="flex items-center justify-center gap-1.5 bg-green-500 text-white px-3 py-2 rounded-lg text-xs font-semibold hover:bg-green-600 transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                      >
                        <FontAwesomeIcon icon={faDownload} />
                        Download
                      </a>
                      <button
                        onClick={() => setEditingDocument(doc)}
                        className="flex items-center justify-center gap-1.5 bg-amber-500 text-white px-3 py-2 rounded-lg text-xs font-semibold hover:bg-amber-600 transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                      >
                        <FontAwesomeIcon icon={faEdit} />
                        Replace
                      </button>
                      <button
                        onClick={() => deleteDocument(doc.id)}
                        className="flex items-center justify-center gap-1.5 bg-red-500 text-white px-3 py-2 rounded-lg text-xs font-semibold hover:bg-red-600 transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                      >
                        <FontAwesomeIcon icon={faTrash} />
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Modern Replace Document Modal */}
          {editingDocument && (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-70 flex items-center justify-center p-4 animate-fadeIn">
              <div className="bg-white rounded-2xl p-6 w-full max-w-lg shadow-2xl transform animate-slideUp">
                <div className="text-center mb-4">
                  <div className="bg-gradient-to-r from-amber-500 to-orange-600 p-3 rounded-xl inline-flex mb-3">
                    <FontAwesomeIcon icon={faEdit} size="lg" className="text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-800 mb-1">Replace Document</h3>
                  <p className="text-gray-600 text-sm">Update: <span className="font-semibold">{editingDocument.documentTypeName}</span></p>
                </div>
                
                <div className="bg-gray-50 rounded-xl p-3 mb-4">
                  <p className="text-xs text-gray-500 flex items-center">
                    <FontAwesomeIcon icon={faExclamationTriangle} className="mr-2 text-amber-500" />
                    Current file: <span className="font-semibold ml-1">{editingDocument.originalName}</span>
                  </p>
                </div>
                
                <div className="mb-4">
                  <label className="flex items-center text-xs font-semibold text-gray-700 mb-2">
                    <FontAwesomeIcon icon={faCloud} className="mr-2 text-green-500" />
                    Select New File
                  </label>
                  <input
                    type="file"
                    onChange={handleFileSelect}
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.gif,.webp"
                    className="w-full p-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500/30 focus:border-green-500 transition-all duration-300 bg-white shadow-sm hover:shadow-md file:mr-3 file:py-1 file:px-3 file:border-0 file:rounded-md file:bg-green-50 file:text-green-600 file:font-medium hover:file:bg-green-100 text-sm"
                  />
                </div>
                
                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      if (selectedFile) {
                        replaceDocument(editingDocument, selectedFile);
                      } else {
                        alert('Please select a file to replace with');
                      }
                    }}
                    disabled={!selectedFile || uploading}
                    className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-green-500 to-green-600 text-white px-4 py-3 rounded-lg hover:from-green-600 hover:to-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 font-semibold text-sm shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                  >
                    <FontAwesomeIcon icon={faSave} className={uploading ? "animate-spin" : ""} />
                    {uploading ? 'Replacing...' : 'Replace Document'}
                  </button>
                  <button
                    onClick={() => {
                      setEditingDocument(null);
                      setSelectedFile(null);
                    }}
                    className="flex items-center justify-center gap-2 bg-gray-500 text-white px-4 py-3 rounded-lg hover:bg-gray-600 transition-all duration-300 font-semibold text-sm shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                  >
                    <FontAwesomeIcon icon={faTimes} />
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Modern Document Viewer Modal */}
          {viewingDocument && (
            <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-80 flex items-center justify-center p-4 animate-fadeIn">
              <div className="bg-white rounded-3xl w-full max-w-7xl max-h-[95vh] overflow-hidden flex flex-col shadow-2xl transform animate-slideUp">
                {/* Modern Viewer Header */}
                <div className="bg-gradient-to-r from-slate-800 to-slate-900 text-white p-6 flex justify-between items-center">
                  <div className="flex items-center space-x-4">
                    <div className="bg-white/20 p-3 rounded-2xl backdrop-blur-sm">
                      <FontAwesomeIcon icon={getFileIcon(viewingDocument.mimeType)} size="lg" className="text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold">{viewingDocument.documentTypeName}</h3>
                      <p className="text-slate-300 text-sm">{viewingDocument.originalName}</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <a
                      href={`${getDocumentUrl(viewingDocument.url)}?token=${encodeURIComponent(token)}`}
                      download={viewingDocument.originalName}
                      className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-xl transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                    >
                      <FontAwesomeIcon icon={faDownload} />
                      Download
                    </a>
                    <button
                      onClick={() => setViewingDocument(null)}
                      className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-xl transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                    >
                      <FontAwesomeIcon icon={faTimes} />
                      Close
                    </button>
                  </div>
                </div>

                {/* Document Content with Modern Styling */}
                <div className="flex-1 overflow-hidden  bg-gray-50">
                  {viewingDocument.mimeType.includes('pdf') ? (
                    <iframe
                      src={`${getDocumentUrl(viewingDocument.url)}?token=${encodeURIComponent(token)}`}
                      className="w-full h-full border-0 min-h-[70vh]"
                      title={viewingDocument.originalName}
                    />
                  ) : viewingDocument.mimeType.includes('image') ? (
                    <div className="h-full flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-8">
                      <div className="bg-white rounded-2xl shadow-2xl p-4 max-w-full max-h-full">
                        <img
                          src={`${getDocumentUrl(viewingDocument.url)}?token=${encodeURIComponent(token)}`}
                          alt={viewingDocument.originalName}
                          className="max-w-full max-h-full object-contain rounded-xl"
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="h-full flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-8">
                      <div className="text-center bg-white rounded-3xl p-12 shadow-2xl max-w-md">
                        <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6 rounded-2xl inline-flex mb-6">
                          <FontAwesomeIcon icon={getFileIcon(viewingDocument.mimeType)} size="3x" className="text-white" />
                        </div>
                        <h4 className="text-2xl font-bold text-gray-800 mb-4">Preview Not Available</h4>
                        <p className="text-gray-600 mb-6 text-lg">
                          This file type <span className="font-semibold">({viewingDocument.mimeType})</span> cannot be previewed in the browser.
                        </p>
                        <a
                          href={`${getDocumentUrl(viewingDocument.url)}?token=${encodeURIComponent(token)}`}
                          download={viewingDocument.originalName}
                          className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                        >
                          <FontAwesomeIcon icon={faDownload} />
                          Download to View
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modern Footer */}
        <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-8 py-6 flex justify-end border-t border-gray-200">
          <button
            onClick={onClose}
            className="bg-gradient-to-r from-gray-600 to-gray-700 text-white px-8 py-3 rounded-xl hover:from-gray-700 hover:to-gray-800 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            <FontAwesomeIcon icon={faTimes} className="mr-2" />
            Close
          </button>
        </div>
      </div>
    </div>
    </div>
  );
};

export default DocumentManagementModal;
