import React, { useState } from 'react';
import { MessageSquarePlus, X } from 'lucide-react';
import Button from '../ui/Button';

interface PromptButtonProps {
  onSubmit: (prompt: string) => void;
}

export default function PromptButton({ onSubmit }: PromptButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setIsLoading(true);
    await onSubmit(prompt);
    setIsLoading(false);
    setPrompt('');
    setIsOpen(false);
  };

  return (
    <>
      {!isOpen ? (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-20 right-4 p-3 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-all duration-200 z-50"
          title="Improve with AI"
        >
          <MessageSquarePlus className="w-6 h-6" />
        </button>
      ) : (
        <div className="fixed bottom-20 right-4 w-96 bg-white dark:bg-gray-800 rounded-lg shadow-xl p-4 z-50">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Improve Your Website</h3>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <form onSubmit={handleSubmit}>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe what you'd like to improve..."
              className="w-full h-32 p-3 text-sm border border-gray-200 dark:border-gray-700 rounded-lg
                       bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100
                       focus:ring-2 focus:ring-blue-500 focus:border-transparent
                       transition-all duration-200 resize-none mb-3
                       placeholder:text-gray-400 dark:placeholder:text-gray-500"
            />
            <div className="flex justify-end">
              <Button
                type="submit"
                isLoading={isLoading}
                size="sm"
              >
                Apply Changes
              </Button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}