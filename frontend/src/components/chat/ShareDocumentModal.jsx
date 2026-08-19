import { useEffect, useState } from 'react';
import { FileText, Search, X, Check } from 'lucide-react';
import { documentService } from '../../services/document.service';
import Modal from '../common/Modal';
import Loader from '../common/Loader';

const ShareDocumentModal = ({ isOpen, onClose, workspaceId, onSelectDocument }) => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedDocId, setSelectedDocId] = useState(null);

  useEffect(() => {
    if (isOpen && workspaceId) {
      setLoading(true);
      documentService
        .getAll(workspaceId)
        .then((res) => {
          setDocuments(res.data?.documents || res.documents || []);
        })
        .catch(() => {})
        .finally(() => setLoading(false));
    }
  }, [isOpen, workspaceId]);

  const filteredDocs = documents.filter((doc) =>
    doc.title?.toLowerCase().includes(search.toLowerCase())
  );

  const handleConfirm = () => {
    const doc = documents.find((d) => d._id === selectedDocId);
    if (doc) {
      onSelectDocument(doc);
      onClose();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Share Workspace Document" size="md">
      <div className="space-y-4 p-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-2.5 text-gray-400" size={16} />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search documents..."
            className="w-full rounded-lg border border-gray-200 py-2 pl-9 pr-4 text-sm focus:border-primary-500 focus:outline-none"
          />
        </div>

        {/* List */}
        <div className="max-h-60 space-y-1.5 overflow-y-auto pr-1">
          {loading ? (
            <div className="py-8"><Loader /></div>
          ) : filteredDocs.length === 0 ? (
            <p className="py-8 text-center text-sm text-gray-400">No documents found.</p>
          ) : (
            filteredDocs.map((doc) => {
              const isSelected = selectedDocId === doc._id;
              return (
                <button
                  key={doc._id}
                  type="button"
                  onClick={() => setSelectedDocId(doc._id)}
                  className={`flex w-full items-center justify-between rounded-lg border p-3 text-left transition-all ${
                    isSelected
                      ? 'border-primary-500 bg-primary-50 text-primary-900'
                      : 'border-gray-100 bg-white hover:border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-primary-100 p-2 text-primary-600">
                      <FileText size={18} />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{doc.title}</p>
                      <p className="text-xs text-gray-400">
                        Category: {doc.category || 'General'}
                      </p>
                    </div>
                  </div>
                  {isSelected && <Check size={18} className="text-primary-600" />}
                </button>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-2 border-t border-gray-100 pt-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={!selectedDocId}
            className="rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700 disabled:opacity-40"
          >
            Attach Document
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ShareDocumentModal;
