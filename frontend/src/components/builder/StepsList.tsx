import { CheckCircle, Circle, Loader, MoveLeft, XCircle } from 'lucide-react';
import { Step } from '../../types';
import { useNavigate } from 'react-router-dom';

interface StepsListProps {
  steps: Step[];
  currentStep: number;
}

export default function StepsList({ steps, currentStep }: StepsListProps) {
  const getStatusIcon = (status: Step['status'], stepId: number) => {
    if (stepId === currentStep) {
      return <Loader className="w-5 h-5 text-blue-500 animate-spin" />;
    }
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'error':
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Circle className="w-5 h-5 text-gray-300" />;
    }
  };

  const navigate = useNavigate();

  return (
    <div className="w-80 bg-gray-50 h-full overflow-y-auto">
      <div className="p-4">
      <div className='cursor-pointer' onClick={()=>{
        navigate('/');
      }}>
       <MoveLeft /> 
      </div>
        <h2 className="text-xl font-semibold mb-6 text-gray-800">Build Progress</h2>
        <div className="space-y-4">
          {steps.map((step) => (
            <div
              key={step.id}
              className={`
                relative p-4 rounded-lg transition-all duration-200
                ${step.id === currentStep ? 'bg-blue-50 shadow-sm' : 'bg-white'}
              `}
            >
              <div className="flex items-start space-x-3">
                {getStatusIcon(step.status, step.id)}
                <div>
                  <h3 className="font-medium text-gray-900">{step.title}</h3>
                  <p className="text-sm text-gray-600 mt-1">{step.description}</p>
                </div>
              </div>
              {step.id !== steps.length && (
                <div className="absolute left-7 top-[52px] bottom-0 w-0.5 bg-gray-200" />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}