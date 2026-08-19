import { FileText } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { formatRelativeTime } from '../../utils/formatDate';

const RecentDocuments = ({ documents = [] }) => {
  const navigate = useNavigate();
  const { workspaceId } = useParams();

  return (
    <div className="rounded-xl border border-gray-100 bg-white p-5">
      <h3 className="mb-4 flex items-center gap-2 text-base font-semibold text-gray-900">
        📄 Recent Documents
      </h3>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {documents.length === 0 && (
          <p className="col-span-2 py-6 text-center text-sm text-gray-400">No documents yet.</p>
        )}
        {documents.map((doc) => (
          <div
            key={doc._id}
            onClick={() => navigate(`/workspaces/${workspaceId}/documents/${doc._id}`)}
            className="flex cursor-pointer items-start gap-3 rounded-lg border border-gray-100 p-3 hover:border-primary-200 hover:bg-primary-50/40"
          >
            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-primary-50 text-primary-600">
              <FileText size={18} />
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-gray-900">{doc.title}</p>
              <p className="text-xs text-gray-400">Edited {formatRelativeTime(doc.updatedAt)}</p>
              {doc.tags?.[0] && (
                <span className="mt-1 inline-block rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-medium text-gray-600">
                  {doc.tags[0]}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentDocuments;
