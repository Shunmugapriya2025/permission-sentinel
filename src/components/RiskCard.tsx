import { Shield, ShieldAlert, ShieldCheck } from "lucide-react";
import RiskMeter from "./RiskMeter";

interface RiskCardProps {
  level: "Low" | "Medium" | "High";
  score: number;
  summary: string;
}

const RiskCard = ({ level, score, summary }: RiskCardProps) => {
  const config = {
    Low: {
      icon: ShieldCheck,
      label: "LOW RISK",
      border: "border-success/30",
      bg: "bg-success/5",
      textColor: "text-success",
      glow: "shadow-[0_0_30px_hsl(145,70%,45%,0.1)]",
    },
    Medium: {
      icon: Shield,
      label: "MEDIUM RISK",
      border: "border-warning/30",
      bg: "bg-warning/5",
      textColor: "text-warning",
      glow: "shadow-[0_0_30px_hsl(45,100%,55%,0.1)]",
    },
    High: {
      icon: ShieldAlert,
      label: "HIGH RISK",
      border: "border-destructive/30",
      bg: "bg-destructive/5",
      textColor: "text-destructive",
      glow: "shadow-[0_0_30px_hsl(0,80%,55%,0.1)]",
    },
  }[level];

  const Icon = config.icon;

  return (
    <div
      className={`rounded-lg ${config.border} ${config.bg} ${config.glow} p-6 space-y-4 animate-fade-in-up`}
    >
      <div className="flex items-center gap-3">
        <Icon className={`w-8 h-8 ${config.textColor} animate-pulse-glow`} />
        <h2 className={`text-2xl font-bold font-mono ${config.textColor}`}>
          {config.label} ({
            score <= 4 ? Math.round((score / 4) * 33) :
            score <= 9 ? Math.round(50 + ((score - 5) / 4) * 16) :
            Math.min(100, Math.round(83 + (Math.min(5, score - 10) / 5) * 17))
          }%)
        </h2>
      </div>
      <RiskMeter level={level} score={score} />
      <p className="text-card-foreground text-sm leading-relaxed">{summary}</p>
    </div>
  );
};

export default RiskCard;
