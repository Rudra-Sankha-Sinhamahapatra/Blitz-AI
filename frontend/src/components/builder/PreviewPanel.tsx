import { ExternalLink } from 'lucide-react';

interface PreviewPanelProps {
  url: string;
}

export default function PreviewPanel({ url }: PreviewPanelProps) {
  return (
    <div className="flex-1 bg-gray-50 dark:bg-gray-800/50 p-4">
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm h-full border border-gray-200 dark:border-gray-700 flex flex-col">
        <div className="border-b border-gray-200 dark:border-gray-700 px-4 py-2 flex items-center justify-between">
          <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Preview</span>
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300"
          >
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
        <div className="flex-1 bg-white dark:bg-gray-900">
          <iframe
            src={url}
            className="w-full h-full border-0"
            title="Website Preview"
          />
        </div>
      </div>
    </div>
  );
}