import  { useState } from 'react';
import { File as FileIcon, Folder } from 'lucide-react';
import { File } from '../../types';

interface FileExplorerProps {
  files: File[];
  onFileSelect: (file: File) => void;
  selectedFile?: File;
}

interface FileItemProps {
  file: File;
  depth?: number;
  onFileSelect: (file: File) => void;
  selectedFile?: File;
}

function FileItem({ file, depth = 0, onFileSelect, selectedFile }: FileItemProps) {
  const [isOpen, setIsOpen] = useState(file.isOpen);
  const isFolder = file.type === 'folder';
  const isSelected = selectedFile?.id === file.id;

  const handleClick = () => {
    if (isFolder) {
      setIsOpen(!isOpen);
    } else {
      onFileSelect(file);
    }
  };

  return (
    <div>
      <div
        className={`
          flex items-center px-4 py-2 cursor-pointer text-sm
          ${isSelected ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300' : 'hover:bg-gray-50 dark:hover:bg-gray-800/50'}
          transition-colors duration-150
        `}
        style={{ paddingLeft: `${depth * 16 + 16}px` }}
        onClick={handleClick}
      >
        <div className="flex items-center min-w-0">
          {isFolder ? (
            <Folder className="w-4 h-4 text-blue-500 dark:text-blue-400 mr-2 shrink-0" />
          ) : (
            <FileIcon className="w-4 h-4 text-gray-500 dark:text-gray-400 mr-2 shrink-0" />
          )}
          <span className="truncate text-gray-700 dark:text-gray-200">{file.name}</span>
        </div>
      </div>
      {isFolder && isOpen && file.children?.map((child) => (
        <FileItem
          key={child.id}
          file={child}
          depth={depth + 1}
          onFileSelect={onFileSelect}
          selectedFile={selectedFile}
        />
      ))}
    </div>
  );
}

export default function FileExplorer({ files, onFileSelect, selectedFile }: FileExplorerProps) {
  return (
    <div className="w-64 border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-sm font-medium text-gray-800 dark:text-gray-200">Project Files</h2>
      </div>
      <div className="overflow-y-auto">
        {files.map((file) => (
          <FileItem
            key={file.id}
            file={file}
            onFileSelect={onFileSelect}
            selectedFile={selectedFile}
          />
        ))}
      </div>
    </div>
  );
}