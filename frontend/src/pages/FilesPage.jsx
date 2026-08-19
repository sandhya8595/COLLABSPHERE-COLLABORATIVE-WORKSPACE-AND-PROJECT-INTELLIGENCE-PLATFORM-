import { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fileService } from '../services/file.service';
import FileExplorer from '../components/files/FileExplorer';
import FileDetailsPanel from '../components/files/FileDetailsPanel';
import UploadDropzone from '../components/files/UploadDropzone';
import Modal from '../components/common/Modal';
import Loader from '../components/common/Loader';
import toast from 'react-hot-toast';

const FilesPage = () => {
  const { workspaceId } = useParams();
  const [files, setFiles] = useState([]);
  const [breadcrumbs, setBreadcrumbs] = useState([]);
  const [currentFolder, setCurrentFolder] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [versions, setVersions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFolderModalOpen, setIsFolderModalOpen] = useState(false);
  const [folderName, setFolderName] = useState('');
  const [showDropzone, setShowDropzone] = useState(false);
  const fileInputRef = useRef(null);

  const loadFiles = (folderId = null) => {
    setLoading(true);
    fileService
      .list(workspaceId, folderId)
      .then((res) => setFiles(res.data.files))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (workspaceId) loadFiles(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [workspaceId]);

  const handleOpenFolder = (folder) => {
    setBreadcrumbs((prev) => [...prev, folder]);
    setCurrentFolder(folder._id);
    loadFiles(folder._id);
  };

  const handleNavigateBreadcrumb = (crumb) => {
    if (!crumb) {
      setBreadcrumbs([]);
      setCurrentFolder(null);
      loadFiles(null);
      return;
    }
    const idx = breadcrumbs.findIndex((b) => b._id === crumb._id);
    setBreadcrumbs(breadcrumbs.slice(0, idx + 1));
    setCurrentFolder(crumb._id);
    loadFiles(crumb._id);
  };

  const handleSelectFile = async (file) => {
    setSelectedFile(file);
    const res = await fileService.getDetails(file._id);
    setVersions(res.data.versions);
  };

  const handleCreateFolder = async () => {
    if (!folderName.trim()) return;
    try {
      await fileService.createFolder({ name: folderName.trim(), workspaceId, folderId: currentFolder });
      toast.success('Folder created.');
      setFolderName('');
      setIsFolderModalOpen(false);
      loadFiles(currentFolder);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create folder.');
    }
  };

  const handleFilesSelected = async (fileList) => {
    for (const file of fileList) {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('workspaceId', workspaceId);
      if (currentFolder) formData.append('folderId', currentFolder);

      try {
        await fileService.upload(formData);
      } catch (err) {
        toast.error(err.response?.data?.message || `Failed to upload ${file.name}.`);
      }
    }
    toast.success('Upload complete.');
    setShowDropzone(false);
    loadFiles(currentFolder);
  };

  const handleShare = async (file) => {
    const email = window.prompt('Share with (email):');
    if (!email) return;
    // In a full implementation, resolve email -> userId first.
    toast('Sharing requires resolving the recipient by email on the backend.', { icon: 'ℹ️' });
  };

  const handleDeleteFile = async (file) => {
    const itemType = file.isFolder ? 'folder' : 'file';
    if (!window.confirm(`Are you sure you want to delete this ${itemType} "${file.originalName}"?`)) {
      return;
    }

    try {
      await fileService.remove(file._id);
      toast.success(`${itemType === 'folder' ? 'Folder' : 'File'} deleted successfully.`);
      if (selectedFile?._id === file._id) {
        setSelectedFile(null);
      }
      loadFiles(currentFolder);
    } catch (err) {
      toast.error(err.response?.data?.message || `Failed to delete ${itemType}.`);
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="flex gap-6">
      <div className="flex-1">
        <h1 className="mb-6 text-2xl font-bold text-gray-900">Files</h1>

        <FileExplorer
          files={files}
          breadcrumbs={breadcrumbs}
          onNavigateBreadcrumb={handleNavigateBreadcrumb}
          onOpenFolder={handleOpenFolder}
          onSelectFile={handleSelectFile}
          onDeleteFile={handleDeleteFile}
          onNewFolder={() => setIsFolderModalOpen(true)}
          onUploadClick={() => fileInputRef.current?.click()}
        />

        <input
          ref={fileInputRef}
          type="file"
          multiple
          className="hidden"
          onChange={(e) => e.target.files.length && handleFilesSelected(Array.from(e.target.files))}
        />

        <div className="mt-6">
          <UploadDropzone onFilesSelected={handleFilesSelected} />
        </div>
      </div>

      {selectedFile && (
        <FileDetailsPanel
          file={selectedFile}
          versions={versions}
          onClose={() => setSelectedFile(null)}
          onShare={handleShare}
          onDelete={handleDeleteFile}
        />
      )}

      <Modal isOpen={isFolderModalOpen} onClose={() => setIsFolderModalOpen(false)} title="New Folder">
        <div className="space-y-4">
          <input
            value={folderName}
            onChange={(e) => setFolderName(e.target.value)}
            placeholder="Folder name"
            className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-primary-500"
          />
          <button
            onClick={handleCreateFolder}
            className="w-full rounded-lg bg-primary-600 py-2.5 text-sm font-semibold text-white hover:bg-primary-700"
          >
            Create Folder
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default FilesPage;
