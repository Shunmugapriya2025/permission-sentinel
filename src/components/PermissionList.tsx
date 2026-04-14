import { useState } from "react";
import type { PermissionDetail } from "@/services/api";
import { Lock, AlertTriangle, HelpCircle, ShieldCheck, ChevronDown, ChevronUp } from "lucide-react";

interface PermissionListProps {
  permissions: PermissionDetail[];
}

const PermissionList = ({ permissions }: PermissionListProps) => {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const riskColor = (risk: string) => {
    const r = risk.toLowerCase();
    if (r === "high") return "text-destructive border-destructive/30 bg-destructive/10";
    if (r === "medium") return "text-warning border-warning/30 bg-warning/10";
    return "text-success border-success/30 bg-success/10";
  };

  const toggleExpand = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <div className="rounded-lg cyber-border bg-card p-5 space-y-4 animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
      <h3 className="text-xs font-mono text-primary tracking-widest flex items-center gap-2 uppercase">
        <Lock className="w-4 h-4" /> Permission Playbook
      </h3>
      
      <div className="space-y-3">
        {permissions.map((p, i) => {
          const isExpanded = expandedIndex === i;
          return (
            <div 
              key={i} 
              className={`rounded-lg border border-white/5 transition-all duration-300 overflow-hidden ${
                isExpanded ? "bg-secondary/40 shadow-inner" : "bg-secondary/20 hover:bg-secondary/30"
              }`}
            >
              <button 
                onClick={() => toggleExpand(i)}
                className="w-full flex items-center justify-between py-3 px-4 text-left"
              >
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-foreground">{p.name}</span>
                  <span className={`text-[10px] uppercase font-mono px-2 py-0.5 rounded border ${riskColor(p.risk)}`}>
                    {p.risk}
                  </span>
                </div>
                {isExpanded ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
              </button>

              {isExpanded && (
                <div className="px-4 pb-4 pt-1 space-y-4 animate-fade-in border-t border-white/5">
                  {/* Risk Section */}
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2 text-xs font-mono text-destructive uppercase tracking-tight">
                      <AlertTriangle className="w-3.5 h-3.5" /> Risk Explanation
                    </div>
                    <p className="text-sm text-card-foreground/80 pl-6 border-l-2 border-destructive/20 ml-1.5">
                      {p.risk_explanation || p.description || "Potentially high-impact data access."}
                    </p>
                  </div>

                  {/* Purpose Section */}
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2 text-xs font-mono text-primary uppercase tracking-tight">
                      <HelpCircle className="w-3.5 h-3.5" /> Why app needs this
                    </div>
                    <p className="text-sm text-card-foreground/80 pl-6 border-l-2 border-primary/20 ml-1.5">
                      {p.purpose || "Required for core app functionality."}
                    </p>
                  </div>

                  {/* Recommendation Section */}
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2 text-xs font-mono text-success uppercase tracking-tight">
                      <ShieldCheck className="w-3.5 h-3.5" /> Our Recommendation
                    </div>
                    <p className="text-sm text-card-foreground/80 pl-6 border-l-2 border-success/20 ml-1.5">
                      {p.recommendation || "Grant only while using the application."}
                    </p>
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {permissions.length === 0 && (
          <div className="py-8 text-center bg-secondary/10 rounded-lg border border-dashed border-white/5">
            <p className="text-muted-foreground text-sm font-mono tracking-tight">No critical permissions detected.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PermissionList;
