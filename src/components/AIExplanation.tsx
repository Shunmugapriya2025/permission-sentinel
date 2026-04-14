import { Brain } from "lucide-react";

interface AIExplanationProps {
  explanation: string;
}

const AIExplanation = ({ explanation }: AIExplanationProps) => {
  return (
    <div className="rounded-lg cyber-border bg-card p-5 space-y-3 animate-fade-in-up" style={{ animationDelay: "0.4s" }}>
      <h3 className="text-sm font-mono text-accent flex items-center gap-2">
        <Brain className="w-4 h-4" /> AI EXPLANATION
      </h3>
      <p className="text-sm text-card-foreground leading-relaxed">{explanation}</p>
    </div>
  );
};

export default AIExplanation;
