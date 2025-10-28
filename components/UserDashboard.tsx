
import React, { useState, useEffect, useCallback } from 'react';
import { User, MasterItem, RequestItem, SubmittedRequestItem, GroupedRequest } from '../types';
import { api } from '../services/api';
import RequestDetailsModal from './RequestDetailsModal';

interface UserDashboardProps {
  user: User;
  onLogout: () => void;
}

const UserDashboard: React.FC<UserDashboardProps> = ({ user, onLogout }) => {
    const [masterItems, setMasterItems] = useState<MasterItem[]>([]);
    const [filteredItems, setFilteredItems] = useState<MasterItem[]>([]);
    const [itemSearch, setItemSearch] = useState('');
    const [showItemList, setShowItemList] = useState(false);

    const [itemCode, setItemCode] = useState('');
    const [qty, setQty] = useState('');
    const [reason, setReason] = useState('');

    const [requestItems, setRequestItems] = useState<RequestItem[]>([]);
    const [userRequests, setUserRequests] = useState<GroupedRequest[]>([]);
    
    const [selectedRequest, setSelectedRequest] = useState<GroupedRequest | null>(null);

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
            groupedMap.get(req.id)!.items.push(req);
        });
        return Array.from(groupedMap.values()).sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    };

    const loadUserRequests = useCallback(async () => {
        try {
            const response = await api.getRequests();
            const myRequests = response.data.filter(r => r.email === user.email);
            setUserRequests(groupRequestsById(myRequests));
        } catch (error) {
            console.error("Failed to load tracking data", error);
            alert("Failed to load tracking data.");
        }
    }, [user.email]);

    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                const masterData = await api.getMasterData();
                setMasterItems(masterData.items);
            } catch (error) {
                console.error("Failed to load master data", error);
                alert("Failed to load item master data. Please refresh.");
            }
            await loadUserRequests();
        };

        fetchInitialData();
    }, [loadUserRequests]);

    useEffect(() => {
        if (!itemSearch) {
            setShowItemList(false);
            setFilteredItems([]);
            return;
        }
        const filtered = masterItems
            .filter(it => it.desc.toLowerCase().includes(itemSearch.toLowerCase()))
            .slice(0, 10);
        setFilteredItems(filtered);
        setShowItemList(filtered.length > 0);
    }, [itemSearch, masterItems]);
    
    const handleSelectItem = (item: MasterItem) => {
        setItemSearch(item.desc);
        setItemCode(item.code);
        setShowItemList(false);
    };

    const handleAddItem = () => {
        if (!itemCode || !qty) {
            alert("⚠️ Lengkapi data item!");
            return;
        }
        setRequestItems([...requestItems, { code: itemCode, name: itemSearch, qty, reason }]);
        setItemSearch('');
        setItemCode('');
        setQty('');
        setReason('');
    };

    const handleRemoveItem = (index: number) => {
        setRequestItems(requestItems.filter((_, i) => i !== index));
    };

    const handleSubmitRequest = async () => {
        if (requestItems.length === 0) {
            alert("⚠️ Belum ada item!");
            return;
        }
        try {
            // FIX: Pass the entire requestItems array, including the 'name' property, to the API.
            const itemsToSubmit = requestItems;
            const response = await api.submitRequest(user.storeName, user.email, itemsToSubmit);
            alert("✅ " + response.message);
            setRequestItems([]);
            await loadUserRequests();
        } catch (error) {
            console.error("Failed to submit request", error);
            alert("Failed to submit request.");
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
        <div className="card p-8 rounded-2xl shadow-2xl w-full max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">🐂 OCTOBULL</h1>
                    <p className="text-gray-600 text-sm">Welcome, {user.storeName}</p>
                </div>
                <button onClick={onLogout} className="btn-danger text-white px-6 py-2 rounded-lg font-semibold shadow-lg">
                    <i className="fas fa-sign-out-alt mr-2"></i>Logout
                </button>
            </div>

            <div className="section-header"><i className="fas fa-clipboard-list"></i>Form Special Request</div>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-3 mb-6">
                <div className="md:col-span-2 relative">
                    <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 z-10"></i>
                    <input value={itemSearch} onChange={(e) => setItemSearch(e.target.value)} type="text" placeholder="🔍 Cari nama item..." className="input-enhanced border rounded-lg p-3 pl-10 w-full" />
                    {showItemList && (
                        <div className="dropdown-menu absolute z-20 bg-white border rounded-lg mt-1 w-full">
                            {filteredItems.map(it => (
                                <div key={it.code} onClick={() => handleSelectItem(it)} className="px-4 py-3 hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 cursor-pointer border-b last:border-b-0 transition-all">
                                    <i className="fas fa-box text-purple-500 mr-2"></i>{it.desc}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
                <div className="relative">
                    <i className="fas fa-barcode absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                    <input value={itemCode} readOnly type="text" placeholder="Kode" className="input-enhanced border rounded-lg p-3 pl-10 w-full bg-gray-100" />
                </div>
                <div className="relative">
                    <i className="fas fa-hashtag absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                    <input value={qty} onChange={(e) => setQty(e.target.value)} type="number" placeholder="Qty" className="input-enhanced border rounded-lg p-3 pl-10 w-full" />
                </div>
                <div className="relative">
                    <i className="fas fa-comment-dots absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                    <input value={reason} onChange={(e) => setReason(e.target.value)} type="text" placeholder="Alasan" className="input-enhanced border rounded-lg p-3 pl-10 w-full" />
                </div>
            </div>

            <button onClick={handleAddItem} className="btn-info text-white px-6 py-3 rounded-lg mb-6 font-semibold shadow-lg">
                <i className="fas fa-plus-circle mr-2"></i>Tambah Item
            </button>

            {requestItems.length > 0 && (
                <>
                <div className="table-enhanced mb-8">
                    <table className="w-full">
                        <thead>
                            <tr>
                                <th className="px-4 py-3 text-left"><i className="fas fa-barcode mr-2"></i>Item Code</th>
                                <th className="px-4 py-3 text-left"><i className="fas fa-box mr-2"></i>Item Name</th>
                                <th className="px-4 py-3 text-left"><i className="fas fa-sort-numeric-up mr-2"></i>Qty</th>
                                <th className="px-4 py-3 text-left"><i className="fas fa-comment mr-2"></i>Reason</th>
                                <th className="px-4 py-3 text-center"><i className="fas fa-cog mr-2"></i>Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white">
                            {requestItems.map((item, index) => (
                                <tr key={index} className="border-b hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50">
                                    <td className="px-4 py-3 font-mono">{item.code}</td>
                                    <td className="px-4 py-3">{item.name}</td>
                                    <td className="px-4 py-3"><span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full font-semibold">{item.qty}</span></td>
                                    <td className="px-4 py-3">{item.reason}</td>
                                    <td className="px-4 py-3 text-center">
                                        <button onClick={() => handleRemoveItem(index)} className="text-red-600 hover:text-red-800 font-semibold hover:scale-110 transition-transform">
                                            <i className="fas fa-trash-alt mr-1"></i>Hapus
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <button onClick={handleSubmitRequest} className="btn-success text-white px-8 py-4 rounded-lg mb-8 font-bold text-lg shadow-xl">
                    <i className="fas fa-paper-plane mr-2"></i>Kirim Request
                </button>
                </>
            )}

            <div className="section-header mt-8"><i className="fas fa-chart-line"></i>Tracking Request Anda</div>

            <div className="table-enhanced">
                <table className="w-full">
                    <thead>
                        <tr>
                            <th className="px-4 py-3 text-left"><i className="fas fa-ticket-alt mr-2"></i>Ticket ID</th>
                            <th className="px-4 py-3 text-left"><i className="fas fa-calendar mr-2"></i>Tanggal</th>
                            <th className="px-4 py-3 text-left"><i className="fas fa-box mr-2"></i>Jumlah Item</th>
                            <th className="px-4 py-3 text-left"><i className="fas fa-info-circle mr-2"></i>Status</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white">
                        {userRequests.map(req => (
                            <tr key={req.id} className="border-b hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50">
                                <td className="px-4 py-3">
                                    <button onClick={() => setSelectedRequest(req)} className="font-bold text-purple-600 hover:underline">
                                        #{req.id}
                                    </button>
                                </td>
                                <td className="px-4 py-3">{new Date(req.date).toLocaleString('id-ID')}</td>
                                <td className="px-4 py-3"><span className="bg-gray-200 text-gray-800 px-3 py-1 rounded-full font-semibold">{req.items.length} item(s)</span></td>
                                <td className="px-4 py-3">{getStatusComponent(req.status)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
        {selectedRequest && <RequestDetailsModal request={selectedRequest} onClose={() => setSelectedRequest(null)} />}
        </>
    );
};

export default UserDashboard;
