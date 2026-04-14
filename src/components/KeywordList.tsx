import type { RiskyKeyword } from "@/services/api";
import { AlertTriangle } from "lucide-react";

interface KeywordListProps {
  keywords: RiskyKeyword[];
}

const KeywordList = ({ keywords }: KeywordListProps) => {
  return (
    <div className="rounded-lg cyber-border bg-card p-5 space-y-3 animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
      <h3 className="text-sm font-mono text-primary flex items-center gap-2">
        <AlertTriangle className="w-4 h-4" /> RISKY KEYWORDS
      </h3>
      <div className="flex flex-wrap gap-2">
        {keywords.map((k, i) => (
          <div
            key={i}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-destructive/10 border border-destructive/20 text-sm"
          >
            <span className="text-destructive font-mono font-medium">{k.keyword}</span>
            <span className="text-muted-foreground text-xs">({k.category})</span>
          </div>
        ))}
        {keywords.length === 0 && (
          <p className="text-muted-foreground text-sm">No risky keywords found.</p>
        )}
      </div>
    </div>
  );
};

export default KeywordList;
