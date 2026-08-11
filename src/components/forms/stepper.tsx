import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export function Stepper({ steps, currentStep }: { steps: string[]; currentStep: number }) {
  return (
    <ol className="flex w-full items-center">
      {steps.map((step, index) => {
        const stepNumber = index + 1;
        const isComplete = stepNumber < currentStep;
        const isActive = stepNumber === currentStep;
        return (
          <li key={step} className={cn("flex items-center", index !== steps.length - 1 && "flex-1")}>
            <div className="flex flex-col items-center gap-2 text-center">
              <div
                className={cn(
                  "flex size-9 shrink-0 items-center justify-center rounded-full border-2 text-sm font-semibold transition-colors",
                  isComplete && "border-primary bg-primary text-primary-foreground",
                  isActive && "border-primary text-primary",
                  !isComplete && !isActive && "border-border text-muted-foreground"
                )}
              >
                {isComplete ? <Check className="size-4" /> : stepNumber}
              </div>
              <span
                className={cn(
                  "hidden max-w-24 text-xs font-medium sm:block",
                  isActive || isComplete ? "text-foreground" : "text-muted-foreground"
                )}
              >
                {step}
              </span>
            </div>
            {index !== steps.length - 1 && (
              <div className={cn("mx-2 h-0.5 flex-1 rounded", isComplete ? "bg-primary" : "bg-border")} />
            )}
          </li>
        );
      })}
    </ol>
  );
}
