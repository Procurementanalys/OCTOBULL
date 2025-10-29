import React, { useState, useEffect, useCallback } from 'react';
import { SubmittedRequestItem, GroupedRequest } from '../types';
import { api } from '../services/api';
import RequestDetailsModal from './RequestDetailsModal';
import { GoogleGenAI } from '@google/genai';

// --- Start of AISummaryModal Component Definition ---
interface AISummaryModalProps {
  requests: GroupedRequest[];
  onClose: () => void;
}

const AISummaryModal: React.FC<AISummaryModalProps> = ({ requests, onClose }) => {
  const [summary, setSummary] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const generateSummary = async () => {
      // FIX: Per @google/genai guidelines, the API key must be read from process.env.API_KEY
      // and its existence is assumed. The explicit check for the key has been removed.
      if (requests.length === 0) {
        setSummary("There are no requests in the current filter to summarize.");
        setIsLoading(false);
        return;
      }
      
      try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        
        const sanitizedRequests = requests.map(req => ({
            id: req.id,
            date: req.date,
            store: req.store,
            status: req.status,
            itemCount: req.items.length,
            items: req.items.map(item => ({
                prodesc: item.prodesc,
                qty: item.qty
            }))
        }));

        const prompt = `
          You are an expert data analyst for a retail company. Below is a JSON array of special requests from various stores. 
          Please provide a concise summary. Your summary should be in plain text format and include:
          - A brief opening sentence.
          - The total number of unique request tickets.
          - A breakdown of requests by status (Pending, Ongoing, Completed, Rejected).
          - The top 3 most frequently requested items across all tickets.
          - The top 3 stores with the most request tickets.
          - One or two other notable insights or patterns you observe (e.g., common reasons, high quantity items, etc.).
          
          Keep the summary clear, professional, and easy to read.

          JSON Data: ${JSON.stringify(sanitizedRequests, null, 2)}
        `;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });
        
        setSummary(response.text);

      } catch (err) {
        console.error("AI summary generation failed", err);
        setError("Sorry, the AI summary could not be generated at this time.");
      } finally {
        setIsLoading(false);
      }
    };

    generateSummary();
  }, [requests]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4" onClick={onClose}>
      <div className="card p-8 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-cyan-400 bg-clip-text text-transparent flex items-center">
            <i className="fas fa-wand-magic-sparkles mr-3"></i>
            AI Request Summary
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-red-500 text-2xl">
            <i className="fas fa-times-circle"></i>
          </button>
        </div>
        
        <div className="flex-grow overflow-y-auto pr-4 -mr-4">
          {isLoading && (
            <div className="flex flex-col items-center justify-center h-full text-center">
                <div
                    style={{
                        border: '4px solid rgba(0, 0, 0, 0.1)',
                        borderTop: '4px solid #3498db',
                    }}
                    className="w-12 h-12 border-t-white rounded-full animate-spin"
                ></div>
                <p className="mt-4 text-gray-600 font-semibold">Generating AI insights...</p>
                <p className="text-sm text-gray-500">This might take a moment.</p>
            </div>
          )}
          {error && (
            <div className="flex items-center justify-center h-full text-center notification notification-error">
                <i className="fas fa-exclamation-triangle mr-3"></i> {error}
            </div>
          )}
          {!isLoading && !error && (
            <div 
              className="prose prose-sm max-w-none text-gray-800" 
              style={{ whiteSpace: 'pre-wrap', lineHeight: '1.6' }}
            >
              {summary}
            </div>
          )}
        </div>

        <div className="text-right mt-6 border-t pt-4">
            <button onClick={onClose} className="btn-danger text-white px-6 py-2 rounded-lg font-semibold shadow-lg">
                <i className="fas fa-times mr-2"></i>Close
            </button>
        </div>
      </div>
    </div>
  );
};
// --- End of AISummaryModal Component Definition ---


interface AdminDashboardProps {
  onLogout: () => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ onLogout }) => {
    const [allRequests, setAllRequests] = useState<GroupedRequest[]>([]);
    const [filteredRequests, setFilteredRequests] = useState<GroupedRequest[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [selectedRequest, setSelectedRequest] = useState<GroupedRequest | null>(null);
    const [showAISummary, setShowAISummary] = useState(false); // State for AI modal

    const groupRequestsById = (requests: SubmittedRequestItem[]): GroupedRequest[] => {
        const groupedMap = new Map<string, GroupedRequest>();
        requests.forEach(req => {
            if (!req.id) return;
            if (!groupedMap.has(req.id)) {
                groupedMap.set(req.id, {
                    id: req.id,
                    date: req.date,
                    store: req.store,
                    email: req.email,
                    status: req.status,
                    items: []
                });
            }
            const group = groupedMap.get(req.id)!;
            group.items.push(req);
            // Ensure the group status reflects the status of its items
            group.status = req.status; 
        });
        return Array.from(groupedMap.values()).sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    };

    const loadAdminData = useCallback(async () => {
        try {
            const response = await api.getRequests();
            const grouped = groupRequestsById(response.data || []);
            setAllRequests(grouped);
            setFilteredRequests(grouped);
        } catch (error) {
            console.error("Failed to load admin data", error);
            alert("Failed to load admin data.");
        }
    }, []);

    useEffect(() => {
        loadAdminData();
    }, [loadAdminData]);

    useEffect(() => {
        let filtered = allRequests;

        if (statusFilter) {
            filtered = filtered.filter(r => r.status === statusFilter);
        }

        if (searchTerm) {
            const lowercasedFilter = searchTerm.toLowerCase();
            filtered = filtered.filter(req => {
                return (
                    req.id.toLowerCase().includes(lowercasedFilter) ||
                    req.store.toLowerCase().includes(lowercasedFilter) ||
                    req.status.toLowerCase().includes(lowercasedFilter) ||
                    req.items.some(item => item.prodesc.toLowerCase().includes(lowercasedFilter))
                );
            });
        }

        setFilteredRequests(filtered);
    }, [searchTerm, statusFilter, allRequests]);
    
    const handleUpdateStatus = async (request: GroupedRequest, newStatus: string) => {
        try {
            // Update status for all items in the request
            const promises = request.items.map(item => api.updateStatus(item.row, newStatus));
            await Promise.all(promises);
            await loadAdminData();
        } catch (error) {
            console.error("Failed to update status", error);
            alert("Failed to update status.");
        }
    };
    
    const getStatusComponent = (status: GroupedRequest['status']) => {
        let statusClass = 'status-pending';
        let statusIcon = '⏳';

        if (status === 'Ongoing') {
          statusClass = 'status-ongoing';
          statusIcon = '🔄';
        } else if (status === 'Completed') {
          statusClass = 'status-completed';
          statusIcon = '✅';
        } else if (status === 'Rejected') {
          statusClass = 'status-rejected';
          statusIcon = '❌';
        }
        return (
            <span className={`status-badge ${statusClass}`}>
                {statusIcon} {status}
            </span>
        );
    };

    return (
        <>
            <div className="card p-8 rounded-2xl shadow-2xl w-full mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                    <div>
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">🐂 OCTOBULL Admin</h1>
                        <p className="text-gray-600 text-sm">Dashboard Request Management</p>
                    </div>
                    <div className="flex gap-3 flex-wrap justify-center">
                        <button onClick={() => setShowAISummary(true)} className="btn-ai px-6 py-2 rounded-lg font-semibold shadow-lg">
                            <i className="fas fa-wand-magic-sparkles mr-2"></i>AI Summary
                        </button>
                        <button onClick={loadAdminData} className="btn-info text-white px-6 py-2 rounded-lg font-semibold shadow-lg">
                            <i className="fas fa-sync-alt mr-2"></i>Refresh
                        </button>
                        <button onClick={onLogout} className="btn-danger text-white px-6 py-2 rounded-lg font-semibold shadow-lg">
                            <i className="fas fa-sign-out-alt mr-2"></i>Logout
                        </button>
                    </div>
                </div>

                <div className="flex flex-col md:flex-row gap-3 mb-6">
                    <div className="relative flex-1">
                        <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                        <input value={searchTerm} onChange={e => setSearchTerm(e.target.value)} type="text" placeholder="🔍 Cari Ticket / Store / Item / Status" className="input-enhanced border rounded-lg px-10 py-3 w-full" />
                    </div>
                    <div className="relative">
                        <i className="fas fa-filter absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="input-enhanced border rounded-lg px-10 py-3 pr-8 appearance-none w-full md:w-auto">
                            <option value="">Filter Status</option>
                            <option value="Pending">⏳ Pending</option>
                            <option value="Ongoing">🔄 Ongoing</option>
                            <option value="Completed">✅ Completed</option>
                            <option value="Rejected">❌ Rejected</option>
                        </select>
                    </div>
                </div>

                <div className="table-enhanced overflow-x-auto">
                    <table className="w-full text-left min-w-[1024px]">
                        <thead>
                            <tr>
                                <th className="px-4 py-3"><i className="fas fa-ticket-alt mr-2"></i>Ticket ID</th>
                                <th className="px-4 py-3"><i className="fas fa-calendar mr-2"></i>Tanggal</th>
                                <th className="px-4 py-3"><i className="fas fa-store mr-2"></i>Store</th>
                                <th className="px-4 py-3"><i className="fas fa-box mr-2"></i>Items</th>
                                <th className="px-4 py-3"><i className="fas fa-info-circle mr-2"></i>Status</th>
                                <th className="px-4 py-3"><i className="fas fa-envelope mr-2"></i>Email</th>
                                <th className="px-4 py-3"><i className="fas fa-cog mr-2"></i>Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white">
                            {filteredRequests.map(req => (
                                <tr key={req.id} className="border-b hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50">
                                    <td className="px-4 py-3">
                                       <button onClick={() => setSelectedRequest(req)} className="font-bold text-purple-600 hover:underline">
                                           #{req.id}
                                       </button>
                                    </td>
                                    <td className="px-4 py-3">{new Date(req.date).toLocaleString('id-ID')}</td>
                                    <td className="px-4 py-3 font-semibold">{req.store}</td>
                                    <td className="px-4 py-3"><span className="bg-gray-200 text-gray-800 px-3 py-1 rounded-full font-semibold">{req.items.length} item(s)</span></td>
                                    <td className="px-4 py-3">{getStatusComponent(req.status)}</td>
                                    <td className="px-4 py-3 text-sm text-gray-600">{req.email}</td>
                                    <td className="px-4 py-3">
                                        <select value={req.status} onChange={(e) => handleUpdateStatus(req, e.target.value)} className="input-enhanced border rounded-lg px-3 py-2 font-semibold cursor-pointer appearance-none bg-gray-50">
                                            <option value="Pending">Pending</option>
                                            <option value="Ongoing">Ongoing</option>
                                            <option value="Completed">Completed</option>
                                            <option value="Rejected">Rejected</option>
                                        </select>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            {selectedRequest && <RequestDetailsModal request={selectedRequest} onClose={() => setSelectedRequest(null)} />}
            {showAISummary && <AISummaryModal requests={filteredRequests} onClose={() => setShowAISummary(false)} />}
        </>
    );
};

export default AdminDashboard;