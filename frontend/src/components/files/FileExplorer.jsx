import { ChevronRight, Home, FolderPlus, Upload } from 'lucide-react';
import FileList from './FileList';

const FileExplorer = ({
  files,
  breadcrumbs,
  onNavigateBreadcrumb,
  onOpenFolder,
  onSelectFile,
  onDeleteFile,
  onNewFolder,
  onUploadClick,
}) => {
  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-sm text-gray-500">
          <button onClick={() => onNavigateBreadcrumb(null)} className="hover:text-primary-600">
            <Home size={14} />
          </button>
          {breadcrumbs.map((crumb) => (
            <span key={crumb._id} className="flex items-center gap-1.5">
              <ChevronRight size={13} className="text-gray-300" />
              <button
                onClick={() => onNavigateBreadcrumb(crumb)}
                className="hover:text-primary-600"
              >
                {crumb.originalName}
              </button>
            </span>
          ))}
        </div>

        <div className="flex gap-2">
          <button
            onClick={onNewFolder}
            className="flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50"
          >
            <FolderPlus size={15} />
            New Folder
          </button>
          <button
            onClick={onUploadClick}
            className="flex items-center gap-1.5 rounded-lg bg-primary-600 px-3 py-2 text-sm font-semibold text-white hover:bg-primary-700"
          >
            <Upload size={15} />
            Upload File
          </button>
        </div>
      </div>

      <FileList
        files={files}
        onOpenFolder={onOpenFolder}
        onSelectFile={onSelectFile}
        onDeleteFile={onDeleteFile}
      />
    </div>
  );
};

export default FileExplorer;
