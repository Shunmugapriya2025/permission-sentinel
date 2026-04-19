
interface RiskDistributionProps {
  summary?: {
    low: number;
    medium: number;
    high: number;
  };
}

const RiskDistribution = ({ summary }: RiskDistributionProps) => {
  if (!summary) return null;

  const { low, medium, high } = summary;

  return (
    <div className="w-full space-y-3 p-4 rounded-xl cyber-border bg-card/50 backdrop-blur-sm">
      <div className="flex justify-between items-center mb-1">
        <h3 className="text-[10px] font-mono font-bold text-primary tracking-[0.2em] uppercase opacity-80">
          Risk Severity Distribution
        </h3>
        <span className="text-[10px] font-mono text-muted-foreground opacity-60">
          Normalized Sensitivity
        </span>
      </div>

      <div className="h-3 w-full flex rounded-full overflow-hidden border border-white/5 bg-background shadow-inner">
        {low > 0 && (
          <div 
            style={{ width: `${low}%` }} 
            className="h-full bg-emerald-500/80 transition-all duration-1000 ease-out relative group"
            title={`Low Risk: ${low}%`}
          >
            <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        )}
        {medium > 0 && (
          <div 
            style={{ width: `${medium}%` }} 
            className="h-full bg-amber-500/80 transition-all duration-1000 ease-out relative group border-x border-black/10"
            title={`Medium Risk: ${medium}%`}
          >
            <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        )}
        {high > 0 && (
          <div 
            style={{ width: `${high}%` }} 
            className="h-full bg-rose-600/80 transition-all duration-1000 ease-out relative group"
            title={`High Risk: ${high}%`}
          >
            <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        )}
      </div>

      <div className="flex justify-between gap-2 pt-1">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
          <span className="text-[9px] font-mono text-muted-foreground uppercase tracking-widest">
            Low: <span className="text-foreground font-bold">{low}%</span>
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]" />
          <span className="text-[9px] font-mono text-muted-foreground uppercase tracking-widest">
            Medium: <span className="text-foreground font-bold">{medium}%</span>
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-rose-600 shadow-[0_0_8px_rgba(225,29,72,0.5)]" />
          <span className="text-[9px] font-mono text-muted-foreground uppercase tracking-widest">
            High: <span className="text-foreground font-bold">{high}%</span>
          </span>
        </div>
      </div>
    </div>
  );
};

export default RiskDistribution;
