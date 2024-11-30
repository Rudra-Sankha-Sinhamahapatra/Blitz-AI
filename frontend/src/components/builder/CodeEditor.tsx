import { File } from '../../types';

interface CodeEditorProps {
  file: File;
}

export default function CodeEditor({ file }: CodeEditorProps) {
  return (
    <div className="flex-1 bg-gray-50 dark:bg-gray-800/50 p-4">
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm h-full border border-gray-200 dark:border-gray-700">
        <div className="border-b border-gray-200 dark:border-gray-700 px-4 py-2 flex items-center">
          <span className="text-sm font-medium text-gray-600 dark:text-gray-300">{file.name}</span>
        </div>
        <pre className="p-4 text-sm font-mono overflow-auto text-gray-800 dark:text-gray-200">
          <code>{file.content || ''}</code>
        </pre>
      </div>
    </div>
  );
}