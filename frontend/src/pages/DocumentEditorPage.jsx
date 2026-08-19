import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { History } from 'lucide-react';
import DocumentOutline from '../components/documents/DocumentOutline';
import DocumentEditor from '../components/documents/DocumentEditor';
import CommentsPanel from '../components/documents/CommentsPanel';
import VersionHistory from '../components/documents/VersionHistory';
import Loader from '../components/common/Loader';
import { documentService } from '../services/document.service';
import { useSocket } from '../hooks/useSocket';
import { useAuth } from '../hooks/useAuth';
import toast from 'react-hot-toast';

const DocumentEditorPage = () => {
  const { documentId } = useParams();
  const { socket } = useSocket();
  const { user } = useAuth();

  const [document, setDocument] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showVersions, setShowVersions] = useState(false);
  const [versions, setVersions] = useState([]);

  useEffect(() => {
    documentService
      .getById(documentId)
      .then((res) => setDocument(res.data.document))
      .finally(() => setLoading(false));
  }, [documentId]);

  const handleShowVersions = async () => {
    const res = await documentService.getVersionHistory(documentId);
    setVersions(res.data.versions);
    setShowVersions(true);
  };

  const handleRestore = async (versionId) => {
    const res = await documentService.restoreVersion(documentId, versionId);
    setDocument(res.data.document);
    setShowVersions(false);
    toast.success('Document restored.');
  };

  const handleTitleChange = async (e) => {
    const title = e.target.value;
    if (title && title !== document.title) {
      const res = await documentService.updateMeta(documentId, { title });
      setDocument(res.data.document);
    }
  };

  if (loading) return <Loader />;
  if (!document) return <p className="py-12 text-center text-gray-400">Document not found.</p>;

  return (
    <div className="-m-6 flex h-[calc(100vh-64px)] flex-col">
      <div className="flex items-center justify-between border-b border-gray-100 bg-white px-6 py-3">
        <input
          defaultValue={document.title}
          onBlur={handleTitleChange}
          className="border-none bg-transparent text-lg font-semibold text-gray-900 outline-none"
        />
        <button
          onClick={handleShowVersions}
          className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100"
        >
          <History size={15} />
          Version History
        </button>
      </div>

      <div className="flex flex-1 overflow-hidden bg-white">
        <DocumentOutline outline={document.outline} />
        <div className="flex-1 overflow-y-auto">
          <DocumentEditor
            documentId={documentId}
            initialContentHtml={document.contentHtml || ''}
            socket={socket}
            currentUser={user}
          />
        </div>
        <CommentsPanel comments={[]} />
      </div>

      {showVersions && (
        <VersionHistory
          versions={versions}
          onRestore={handleRestore}
          onClose={() => setShowVersions(false)}
        />
      )}
    </div>
  );
};

export default DocumentEditorPage;
