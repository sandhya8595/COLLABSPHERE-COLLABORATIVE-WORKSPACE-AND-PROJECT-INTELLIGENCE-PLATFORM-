import { useCallback, useRef, useState } from 'react';
import { UploadCloud } from 'lucide-react';

const UploadDropzone = ({ onFilesSelected }) => {
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef(null);

  const handleDrop = useCallback(
    (e) => {
      e.preventDefault();
      setIsDragging(false);
      const files = Array.from(e.dataTransfer.files);
      if (files.length) onFilesSelected(files);
    },
    [onFilesSelected]
  );

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragging(true);
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
      onClick={() => inputRef.current?.click()}
      className={`flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed p-10 transition-colors ${
        isDragging ? 'border-primary-400 bg-primary-50' : 'border-gray-200 bg-white hover:border-gray-300'
      }`}
    >
      <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary-50 text-primary-600">
        <UploadCloud size={22} />
      </div>
      <p className="font-semibold text-gray-700">Drop files here</p>
      <p className="mt-1 text-sm text-gray-400">
        Drag and drop documents, images, or folders here to upload them.
      </p>
      <input
        ref={inputRef}
        type="file"
        multiple
        className="hidden"
        onChange={(e) => e.target.files.length && onFilesSelected(Array.from(e.target.files))}
      />
    </div>
  );
};

export default UploadDropzone;
