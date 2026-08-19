import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Plus, FileText } from 'lucide-react';
import { documentService } from '../services/document.service';
import { formatRelativeTime } from '../utils/formatDate';
import Loader from '../components/common/Loader';
import toast from 'react-hot-toast';

const DocumentsPage = () => {
  const { workspaceId } = useParams();
  const navigate = useNavigate();
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    documentService
      .getAll(workspaceId)
      .then((res) => setDocuments(res.data.documents))
      .finally(() => setLoading(false));
  }, [workspaceId]);

  const handleCreate = async () => {
    try {
      const res = await documentService.create({ title: 'Untitled Document', workspaceId });
      navigate(res.data.document._id);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create document.');
    }
  };

  if (loading) return <Loader />;

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Documents</h1>
        <button
          onClick={handleCreate}
          className="flex items-center gap-1.5 rounded-lg bg-primary-600 px-4 py-2 text-sm font-semibold text-white hover:bg-primary-700"
        >
          <Plus size={16} />
          New Document
        </button>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {documents.length === 0 && (
          <p className="col-span-full py-12 text-center text-gray-400">
            No documents yet. Create your first one.
          </p>
        )}
        {documents.map((doc) => (
          <div
            key={doc._id}
            onClick={() => navigate(doc._id)}
            className="flex cursor-pointer items-start gap-3 rounded-xl border border-gray-100 bg-white p-4 hover:border-primary-200 hover:shadow-md"
          >
            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-primary-50 text-primary-600">
              <FileText size={18} />
            </div>
            <div className="min-w-0">
              <p className="truncate font-semibold text-gray-900">{doc.title}</p>
              <p className="text-xs text-gray-400">Edited {formatRelativeTime(doc.updatedAt)}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DocumentsPage;
