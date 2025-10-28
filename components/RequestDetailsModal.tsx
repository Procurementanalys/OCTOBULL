
import React from 'react';
import { GroupedRequest } from '../types';

interface RequestDetailsModalProps {
  request: GroupedRequest;
  onClose: () => void;
}

const RequestDetailsModal: React.FC<RequestDetailsModalProps> = ({ request, onClose }) => {
  if (!request) return null;
  
  const getStatusClass = (status: string) => {
    switch (status) {
      case 'Ongoing': return 'status-ongoing';
      case 'Completed': return 'status-completed';
      case 'Rejected': return 'status-rejected';
      default: return 'status-pending';
    }
  };
  
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Ongoing': return '🔄';
      case 'Completed': return '✅';
      case 'Rejected': return '❌';
      default: return '⏳';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4" onClick={onClose}>
      <div className="card p-8 rounded-2xl shadow-2xl w-full max-w-3xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Detail Request: #{request.id}
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-red-500 text-2xl">
            <i className="fas fa-times-circle"></i>
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 text-sm">
            <div className="bg-gray-100 p-3 rounded-lg"><strong className="text-gray-600">Store:</strong> {request.store}</div>
            <div className="bg-gray-100 p-3 rounded-lg"><strong className="text-gray-600">Tanggal:</strong> {new Date(request.date).toLocaleString('id-ID')}</div>
            <div className="bg-gray-100 p-3 rounded-lg flex items-center justify-center">
              <span className={`status-badge ${getStatusClass(request.status)}`}>
                {getStatusIcon(request.status)} {request.status}
              </span>
            </div>
        </div>

        <div className="table-enhanced">
          <table className="w-full">
            <thead>
              <tr>
                <th className="px-4 py-3 text-left"><i className="fas fa-barcode mr-2"></i>Item Code</th>
                <th className="px-4 py-3 text-left"><i className="fas fa-box mr-2"></i>Item Name</th>
                <th className="px-4 py-3 text-left"><i className="fas fa-sort-numeric-up mr-2"></i>Qty</th>
                <th className="px-4 py-3 text-left"><i className="fas fa-comment mr-2"></i>Reason</th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {request.items.map((item, index) => (
                <tr key={index} className="border-b last:border-b-0">
                  <td className="px-4 py-3 font-mono">{item.procode}</td>
                  <td className="px-4 py-3">{item.prodesc}</td>
                  <td className="px-4 py-3">
                    <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full font-semibold">{item.qty}</span>
                  </td>
                  <td className="px-4 py-3">{item.reason}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="text-right mt-6">
            <button onClick={onClose} className="btn-danger text-white px-6 py-2 rounded-lg font-semibold shadow-lg">
                <i className="fas fa-times mr-2"></i>Tutup
            </button>
        </div>
      </div>
    </div>
  );
};

export default RequestDetailsModal;
