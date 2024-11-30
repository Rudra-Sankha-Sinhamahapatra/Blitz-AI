import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import StepsList from '../builder/StepsList';
import FileExplorer from '../builder/FileExplorer';
import CodeEditor from '../builder/CodeEditor';
import { Step, File } from '../../types';

export default function BuilderPage() {
  const location = useLocation();
  const { prompt } = location.state || {};
  console.log(prompt);
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedFile, setSelectedFile] = useState<File | undefined>();

  const [steps] = useState<Step[]>([
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

  return (
    <div className="h-screen flex bg-white dark:bg-gray-900">
      <StepsList steps={steps} currentStep={currentStep} />
      <div className="flex-1 flex">
        <FileExplorer
          files={files}
          onFileSelect={setSelectedFile}
          selectedFile={selectedFile}
        />
        {selectedFile?.type === 'file' && (
          <CodeEditor file={selectedFile} />
        )}
      </div>
    </div>
  );
}