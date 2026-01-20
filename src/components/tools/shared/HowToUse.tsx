import CodeOutput from './CodeOutput';

export interface HowToStep {
  title: string;
  description: string;
  example?: string;
}

interface HowToUseProps {
  title?: string;
  steps: HowToStep[];
}

export default function HowToUse({ title = 'How to Use', steps }: HowToUseProps) {
  return (
    <div className="space-y-6">
      <h2 className="text-xl sm:text-2xl font-bold text-white">{title}</h2>
      
      <div className="space-y-6">
        {steps.map((step, index) => (
          <div key={index} className="space-y-3">
            <div className="flex gap-4">
              <div className="
                flex-shrink-0 w-8 h-8 rounded-full
                bg-cyan-400/20 border border-cyan-400/50
                flex items-center justify-center
                text-cyan-300 font-semibold text-sm
              ">
                {index + 1}
              </div>
              <div className="flex-1 space-y-2">
                <h3 className="text-lg font-semibold text-white">{step.title}</h3>
                <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                  {step.description}
                </p>
                {step.example && (
                  <div className="mt-3">
                    <CodeOutput code={step.example} language="text" />
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
