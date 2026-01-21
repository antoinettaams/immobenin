// components/publish/ProgressBar.tsx
"use client";
import React from 'react';

interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
  steps: { id: number; title: string }[];
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ 
  currentStep, 
  totalSteps, 
  steps 
}) => {
  const progressPercentage = ((currentStep - 1) / (totalSteps - 1)) * 100;

  return (
    <div className="w-full border-b border-gray-200 bg-white">
      <div className="max-w-5xl mx-auto px-8">
        {/* Barre de progression horizontale */}
        <div className="relative pt-8 pb-6">
          {/* Ligne de fond */}
          <div className="absolute top-8 left-0 right-0 h-1 bg-gray-200" />
          
          {/* Ligne de progression */}
          <div 
            className="absolute top-8 left-0 h-1 bg-brand transition-all duration-500 ease-out"
            style={{ width: `${progressPercentage}%` }}
          />
          
          {/* Points d'étape */}
          <div className="relative flex justify-between">
            {steps.map((step, index) => {
              const stepNumber = index + 1;
              const isActive = stepNumber === currentStep;
              const isCompleted = stepNumber < currentStep;
              
              return (
                <div key={step.id} className="relative flex flex-col items-center">
                  {/* Point */}
                  <div className={`
                    w-8 h-8 rounded-full border-2 flex items-center justify-center
                    z-10 transition-all duration-300
                    ${isCompleted 
                      ? 'bg-brand border-brand text-white' 
                      : isActive 
                        ? 'bg-white border-brand text-brand' 
                        : 'bg-white border-gray-300 text-gray-400'
                    }
                  `}>
                    {isCompleted ? (
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    ) : (
                      <span className="text-sm font-medium">{stepNumber}</span>
                    )}
                  </div>
                  
                  {/* Titre de l'étape */}
                  <div className={`
                    mt-3 text-sm font-medium whitespace-nowrap
                    transition-all duration-300
                    ${isActive || isCompleted 
                      ? 'text-gray-900' 
                      : 'text-gray-500'
                    }
                  `}>
                    {step.title}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};