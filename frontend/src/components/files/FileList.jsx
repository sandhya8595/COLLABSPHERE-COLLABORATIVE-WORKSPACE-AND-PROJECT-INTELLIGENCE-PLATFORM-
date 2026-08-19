import { Folder, FileText, FileImage, File as FileIcon, Lock, Trash2 } from 'lucide-react';
import { formatRelativeTime } from '../../utils/formatDate';
import { formatFileSize } from '../../utils/validators';

const getFileIcon = (file) => {
  if (file.isFolder) return Folder;
  if (file.mimeType?.startsWith('image/')) return FileImage;
  if (file.mimeType === 'application/pdf') return FileText;
  return FileIcon;
};

const FileList = ({ files = [], onOpenFolder, onSelectFile, onDeleteFile }) => {
  return (
    <div className="overflow-hidden rounded-xl border border-gray-100 bg-white">
      <div className="grid grid-cols-12 gap-4 border-b border-gray-100 px-4 py-2.5 text-xs font-semibold uppercase tracking-wide text-gray-400">
        <span className="col-span-5">Name</span>
        <span className="col-span-3">Owner</span>
        <span className="col-span-3">Last Modified</span>
        <span className="col-span-1 text-right">Actions</span>
      </div>

      {files.length === 0 && (
        <p className="py-12 text-center text-sm text-gray-400">This folder is empty.</p>
      )}

      {files.map((file) => {
        const Icon = getFileIcon(file);
        return (
          <div
            key={file._id}
            onClick={() => (file.isFolder ? onOpenFolder(file) : onSelectFile(file))}
            className="group grid cursor-pointer grid-cols-12 gap-4 border-b border-gray-50 px-4 py-3 text-sm last:border-0 hover:bg-gray-50"
          >
            <div className="col-span-5 flex items-center gap-2.5">
              <Icon
                size={18}
                className={file.isFolder ? 'text-amber-500' : 'text-primary-500'}
              />
              <span className="truncate font-medium text-gray-800">{file.originalName}</span>
              {file.isLocked && <Lock size={12} className="text-gray-400" />}
              {!file.isFolder && (
                <span className="text-xs text-gray-400">{formatFileSize(file.size)}</span>
              )}
            </div>
            <div className="col-span-3 flex items-center gap-1.5 text-gray-500">
              {file.owner?.firstName} {file.owner?.lastName?.charAt(0)}.
            </div>
            <div className="col-span-3 flex items-center text-gray-400">
              {formatRelativeTime(file.updatedAt)}
            </div>
            <div className="col-span-1 flex items-center justify-end">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteFile(file);
                }}
                className="rounded p-1 text-gray-400 opacity-0 transition-opacity hover:bg-red-50 hover:text-red-600 group-hover:opacity-100"
                title={`Delete ${file.isFolder ? 'folder' : 'file'}`}
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default FileList;
