import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Zap, Globe, Wand2, Menu } from 'lucide-react';
import Button from '../components/ui/Button';


export function Home() {
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    if (prompt.trim()) {
      navigate('/builder', { state: { prompt } });
    }
  };

  const features = [
    {
      icon: <Sparkles className="w-6 h-6 text-purple-500" />,
      title: 'AI-Powered Generation',
      description: 'Transform your ideas into working websites with natural language'
    },
    {
      icon: <Zap className="w-6 h-6 text-yellow-500" />,
      title: 'Instant Preview',
      description: 'See your website come to life in real-time as it\'s being built'
    },
    {
      icon: <Globe className="w-6 h-6 text-green-500" />,
      title: 'Production Ready',
      description: 'Get clean, optimized code ready for deployment'
    }
  ];

  return (
    <div className="min-h-screen bg-transparent">
        <div className="absolute top-4 left-4">
        <button
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          <Menu className="w-6 h-6 text-gray-800 dark:text-gray-200" />
        </button>
      </div>
      <div className="max-w-6xl mx-auto px-4 py-20">
        <div className="text-center mb-16 relative">
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-blue-600 dark:bg-blue-500 rounded-2xl shadow-lg relative">
              <div className="absolute inset-0 rounded-2xl bg-blue-600 dark:bg-blue-500 animate-glow-pulse" />
              <Zap className="w-16 h-16 text-white relative z-10" />
            </div>
          </div>
          <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 text-transparent bg-clip-text">
            Blitz AI
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Transform your ideas into beautiful, functional websites with the power of AI.
            Just describe what you want, and watch the magic happen.
          </p>
        </div>

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
        <div className="grid md:grid-cols-3 gap-8 mt-20">
          {features.map((feature, index) => (
            <div
              key={index}
              className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md 
                         transition-all duration-200 border border-gray-100 dark:border-gray-700"
            >
              <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg w-fit mb-4">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
                {feature.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-300">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
