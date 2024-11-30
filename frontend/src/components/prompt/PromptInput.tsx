import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Wand2 } from 'lucide-react';
import Button from '../ui/Button';

export default function PromptInput() {
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setIsLoading(true);
    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 800));
    navigate('/builder', { state: { prompt } });
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-3xl mx-auto">
      <div className="relative">
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Describe your dream website in detail..."
          className="w-full h-40 p-4 text-lg border-2 border-gray-200 rounded-xl
                     focus:ring-2 focus:ring-blue-500 focus:border-transparent
                     transition-all duration-200 resize-none
                     placeholder:text-gray-400"
        />
        <div className="absolute bottom-4 right-4 flex space-x-2">
          <Button
            type="submit"
            isLoading={isLoading}
            icon={<Wand2 className="w-4 h-4" />}
            size="lg"
          >
            Generate Website
          </Button>
        </div>
      </div>
    </form>
  );
}