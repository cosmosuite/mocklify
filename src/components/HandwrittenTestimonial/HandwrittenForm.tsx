import { useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../ui/tabs';
import { cn } from '../../lib/utils';
import { StepOne } from './StepOne';
import { StepTwo } from './StepTwo';
import type { HandwrittenFormData } from '../../types';

interface Props {
  formData: HandwrittenFormData;
  onChange: (field: keyof HandwrittenFormData, value: any) => void;
  onSubmit: (form: HandwrittenFormData) => void;
  isLoading?: boolean;
}

export function HandwrittenForm({ formData, onChange, onSubmit, isLoading }: Props) {
  const [step, setStep] = useState(1);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.productInfo) return;
    await onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-[#0F0F0F] p-6 rounded-xl shadow-sm border border-[#1F1F1F]">
      {/* Progress Steps */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center w-full">
          <div className={cn(
            "w-8 h-8 rounded-full flex items-center justify-center font-medium",
            step === 1 ? "bg-[#CCFC7E] text-black" : "bg-[#1F1F1F] text-gray-400"
          )}>
            1
          </div>
          <div className="flex-1 h-0.5 mx-2 bg-[#1F1F1F]" />
          <div className={cn(
            "w-8 h-8 rounded-full flex items-center justify-center font-medium",
            step === 2 ? "bg-[#CCFC7E] text-black" : "bg-[#1F1F1F] text-gray-400"
          )}>
            2
          </div>
        </div>
      </div>

      {step === 1 ? (
        <StepOne 
          formData={formData}
          onChange={onChange}
          onNext={() => setStep(2)}
        />
      ) : (
        <StepTwo 
          formData={formData}
          isLoading={isLoading}
          onChange={onChange}
          onBack={() => setStep(1)}
          onSubmit={handleSubmit}
        />
      )}
    </form>
  );
}