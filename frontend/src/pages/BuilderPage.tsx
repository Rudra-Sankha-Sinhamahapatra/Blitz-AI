import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import StepsList from '../components/builder/StepsList';
import FileExplorer from '../components/builder/FileExplorer';
import CodeEditor from '../components/builder/CodeEditor';
import PreviewPanel from '../components/builder/PreviewPanel';
import ViewToggle, { ViewMode } from '../components/builder/ViewToggle';
import PromptButton from '../components/builder/PromptButton';
import { Step, File } from '../types';

export default function BuilderPage() {
  const location = useLocation();
  const { prompt } = location.state || {};
  console.log(prompt)
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedFile, setSelectedFile] = useState<File | undefined>();
  const [viewMode, setViewMode] = useState<ViewMode>('code');

  const [steps, setSteps] = useState<Step[]>([
    {
      id: 1,
      title: 'Analyzing Requirements',
      description: 'Processing your website description...',
      status: 'completed'
    },
    {
      id: 2,
      title: 'Generating Structure',
      description: 'Creating project architecture...',
      status: 'in-progress'
    },
    {
      id: 3,
      title: 'Building Components',
      description: 'Crafting UI components...',
      status: 'pending'
    },
    {
      id: 4,
      title: 'Implementing Logic',
      description: 'Adding interactivity and functionality...',
      status: 'pending'
    },
    {
      id: 5,
      title: 'Optimizing',
      description: 'Optimizing for performance...',
      status: 'pending'
    }
  ]);

  const [files] = useState<File[]>([
    {
      id: '1',
      name: 'src',
      type: 'folder',
      isOpen: true,
      children: [
        {
          id: '2',
          name: 'components',
          type: 'folder',
          children: [
            {
              id: '3',
              name: 'Header.tsx',
              type: 'file',
              content: '// Header component code here'
            },
            {
              id: '4',
              name: 'Footer.tsx',
              type: 'file',
              content: '// Footer component code here'
            }
          ]
        },
        {
          id: '5',
          name: 'App.tsx',
          type: 'file',
          content: '// App component code here'
        }
      ]
    }
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev < steps.length) {
          return prev + 1;
        }
        clearInterval(interval);
        return prev;
      });
    }, 3000);

    return () => clearInterval(interval);
  }, [steps.length]);

  const handleImprovement = async (improvementPrompt: string) => {
    // Reset steps for new improvements
    const newSteps:Step[] = steps.map(step => ({
      ...step,
      status: step.id === 1 ? 'in-progress' : 'pending'
    }));
    setSteps(newSteps);
    setCurrentStep(1);
    
    // Here you would typically send the improvement prompt to your AI service
    // and handle the response
    console.log('Improvement prompt:', improvementPrompt);
  };

  const renderMainContent = () => {
    const codeView = selectedFile?.type === 'file' && (
      <CodeEditor file={selectedFile} />
    );
    const previewView = <PreviewPanel url="http://localhost:5173" />;

    switch (viewMode) {
      case 'preview':
        return previewView;
      case 'split':
        return (
          <div className="flex-1 flex">
            <div className="flex-1">{codeView}</div>
            <div className="flex-1">{previewView}</div>
          </div>
        );
      default:
        return codeView;
    }
  };

  return (
    <div className="h-screen flex bg-white dark:bg-gray-900">
      <StepsList steps={steps} currentStep={currentStep} />
      <div className="flex-1 flex">
        <FileExplorer
          files={files}
          onFileSelect={setSelectedFile}
          selectedFile={selectedFile}
        />
        {renderMainContent()}
      </div>
      <ViewToggle mode={viewMode} onChange={setViewMode} />
      <PromptButton onSubmit={handleImprovement} />
    </div>
  );
}