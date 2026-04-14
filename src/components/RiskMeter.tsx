interface RiskMeterProps {
  level: "Low" | "Medium" | "High";
  score: number;
}

const RiskMeter = ({ level, score }: RiskMeterProps) => {
  // Map score to visual percentage based on thresholds:
  // 0-4 (Low)    -> 0%  to 33%
  // 5-9 (Medium) -> 34% to 66%
  // 10+ (High)   -> 67% to 100% (cap at score 15 for 100%)
  
  let displayPercentage = 0;
  if (score <= 4) {
    // 0-4 maps to 0-33%
    displayPercentage = Math.round((score / 4) * 33);
  } else if (score <= 9) {
    // 5-9 maps to 34-66%. Let score 5 (first Medium) start at 50% (Center of Medium label).
    // Mapping: 5->50, 9->66
    displayPercentage = Math.round(50 + ((score - 5) / 4) * 16);
  } else {
    // 10+ maps to 67-100%. Let score 10 (first High) start at 83% (Center of High label).
    // Mapping: 10->83, 15->100
    displayPercentage = Math.min(100, Math.round(83 + (Math.min(5, score - 10) / 5) * 17));
  }
  const colorClass =
    level === "Low"
      ? "bg-success"
      : level === "Medium"
      ? "bg-warning"
      : "bg-destructive";
  const glowClass =
    level === "Low"
      ? "shadow-[0_0_15px_hsl(145,70%,45%,0.4)]"
      : level === "Medium"
      ? "shadow-[0_0_15px_hsl(45,100%,55%,0.4)]"
      : "shadow-[0_0_15px_hsl(0,80%,55%,0.4)]";

  return (
    <div className="w-full space-y-3">
      <div className="grid grid-cols-3 text-[10px] font-mono text-muted-foreground tracking-tighter">
        <span className="text-left">LOW</span>
        <span className="text-center">MEDIUM</span>
        <span className="text-right">HIGH</span>
      </div>
      <div className="relative h-3 rounded-full bg-secondary overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-1000 ease-out ${colorClass} ${glowClass}`}
          style={{ width: `${displayPercentage}%` }}
        />
      </div>
      <div className="text-center font-mono text-sm text-muted-foreground">
        Risk Level: <span className="text-foreground font-semibold">{displayPercentage}%</span>
      </div>
    </div>
  );
};

export default RiskMeter;
