import { BarChart3, FileText, Key, Search } from "lucide-react";

interface StatsPanelProps {
  stats: {
    words_analyzed: number;
    permissions_count: number;
    keywords_count: number;
    patterns_count: number;
  };
  onCardClick?: (label: string) => void;
}

const StatsPanel = ({ stats, onCardClick }: StatsPanelProps) => {
  const items = [
    { icon: FileText, label: "Words Analyzed", value: stats.words_analyzed },
    { icon: Key, label: "Permissions", value: stats.permissions_count },
    { icon: Search, label: "Keywords", value: stats.keywords_count },
    { icon: BarChart3, label: "Patterns", value: stats.patterns_count },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 animate-fade-in-up" style={{ animationDelay: "0.05s" }}>
      {items.map(({ icon: Icon, label, value }) => (
        <button 
          key={label} 
          onClick={() => onCardClick?.(label)}
          className="rounded-lg cyber-border bg-card p-4 text-center space-y-1 transition-all hover:bg-primary/5 hover:border-primary/50 group active:scale-95"
        >
          <Icon className="w-5 h-5 text-primary mx-auto transition-transform group-hover:scale-110" />
          <div className="text-xl font-bold font-mono text-foreground">{value}</div>
          <div className="text-xs text-muted-foreground">{label}</div>
        </button>
      ))}
    </div>
  );
};

export default StatsPanel;
