import { Code2, Layout, SplitSquareVertical } from 'lucide-react';

export type ViewMode = 'code' | 'preview' | 'split';

interface ViewToggleProps {
  mode: ViewMode;
  onChange: (mode: ViewMode) => void;
}

export default function ViewToggle({ mode, onChange }: ViewToggleProps) {
  return (
    <div className="fixed bottom-4 right-4 bg-white dark:bg-gray-800 rounded-full shadow-lg p-1 flex space-x-1 z-50">
      <button
        onClick={() => onChange('code')}
        className={`p-2 rounded-full transition-colors ${
          mode === 'code'
            ? 'bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400'
            : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
        }`}
        title="Code View"
      >
        <Code2 className="w-5 h-5" />
      </button>
      <button
        onClick={() => onChange('split')}
        className={`p-2 rounded-full transition-colors ${
          mode === 'split'
            ? 'bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400'
            : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
        }`}
        title="Split View"
      >
        <SplitSquareVertical className="w-5 h-5" />
      </button>
      <button
        onClick={() => onChange('preview')}
        className={`p-2 rounded-full transition-colors ${
          mode === 'preview'
            ? 'bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400'
            : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
        }`}
        title="Preview"
      >
        <Layout className="w-5 h-5" />
      </button>
    </div>
  );
}