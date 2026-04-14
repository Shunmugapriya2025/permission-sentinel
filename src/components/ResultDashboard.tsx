import type { AnalysisResult } from "@/services/api";
import RiskCard from "./RiskCard";
import StatsPanel from "./StatsPanel";
import PermissionList from "./PermissionList";
import KeywordList from "./KeywordList";
import Recommendations from "./Recommendations";
import AIExplanation from "./AIExplanation";
import RiskBreakdown from "./RiskBreakdown";
import { Copy, Check, FileText, X, AlertOctagon } from "lucide-react";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface ResultDashboardProps {
  result: AnalysisResult;
}

const ResultDashboard = ({ result }: ResultDashboardProps) => {
  const [copied, setCopied] = useState(false);
  const [activeModal, setActiveModal] = useState<string | null>(null);

  const handleCopy = () => {
    navigator.clipboard.writeText(JSON.stringify(result, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full max-w-3xl mx-auto space-y-5">
       {/* Suspicious App Warning */}
       {result.app_status_flag === "SUSPICIOUS_APP" && (
        <div className="w-full bg-warning/10 border border-warning/30 rounded-lg p-4 flex items-start gap-4 animate-shake">
          <div className="bg-warning/20 p-2 rounded">
            <AlertOctagon className="w-5 h-5 text-warning" />
          </div>
          <div className="space-y-1">
            <h4 className="text-sm font-mono font-bold text-warning uppercase">App Name Not Recognized</h4>
            <p className="text-xs text-warning/80 leading-relaxed font-mono">
              The app name "{result.app_name}" is not a well-known application. 
              Please verify that this is the correct official name before trusting the analysis results for this app.
            </p>
          </div>
        </div>
      )}

      {/* Header with copy */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-mono text-primary text-glow">
            ▸ ANALYSIS REPORT
          </h2>
          {result.app_name && (
            <p className="text-xs font-mono text-muted-foreground mt-0.5">
              App: <span className="text-foreground">{result.app_name}</span>
            </p>
          )}
          {result.detected_content_type && (
            <div className="flex items-center gap-1.5 mt-2">
              <span className="text-[10px] font-mono bg-primary/10 text-primary border border-primary/20 px-2 py-0.5 rounded uppercase tracking-tighter">
                {result.detected_content_type} DETECTED
              </span>
            </div>
          )}
        </div>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 text-xs font-mono text-muted-foreground hover:text-primary transition-colors px-3 py-1.5 rounded cyber-border"
        >
          {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
          {copied ? "Copied" : "Copy JSON"}
        </button>
      </div>

      <RiskCard 
        level={result.risk_level} 
        score={result.risk_score} 
        summary={result.summary} 
      />

      <StatsPanel 
        stats={result.stats} 
        onCardClick={(label) => setActiveModal(label)} 
      />

      {/* Risk Breakdown Section */}
      <RiskBreakdown 
        breakdown={result.risk_breakdown} 
        totalPercentage={result.risk_percentage} 
      />

      {/* OCR preview if image */}
      {result.ocr_extracted_text_preview && (
        <div className="rounded-lg cyber-border bg-card p-5 space-y-2 animate-fade-in-up">
          <h3 className="text-sm font-mono text-accent flex items-center gap-2">
            <FileText className="w-4 h-4" /> OCR EXTRACTED TEXT
          </h3>
          <p className="text-xs font-mono text-muted-foreground leading-relaxed bg-secondary/50 p-3 rounded max-h-32 overflow-y-auto">
            {result.ocr_extracted_text_preview}
          </p>
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-5">
        <PermissionList permissions={result.permissions_detected} />
        <KeywordList keywords={result.risky_keywords_detected} />
      </div>

      <Recommendations items={result.recommendations} />
      <AIExplanation explanation={result.ai_explanation} />

      {/* Detail Modals */}
      <Dialog open={activeModal !== null} onOpenChange={(open) => !open && setActiveModal(null)}>
        <DialogContent className="max-w-2xl bg-card border-primary/20 p-0 overflow-hidden">
          <DialogHeader className="p-6 border-b border-border bg-secondary/20">
            <DialogTitle className="font-mono text-primary flex items-center gap-2 tracking-widest uppercase">
              {activeModal} - FULL DETAILS
            </DialogTitle>
          </DialogHeader>
          
          <div className="p-6 max-h-[60vh] overflow-y-auto font-mono text-sm space-y-4">
             {activeModal === "Permissions" && (
                <div className="space-y-4">
                  {result.permissions_detected.map((p, i) => (
                    <div key={i} className="p-4 rounded border border-border bg-background/50 space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-foreground font-bold">{p.name}</span>
                        <span className={`text-[10px] px-2 py-0.5 rounded ${
                          p.risk === 'high' ? 'bg-destructive/20 text-destructive' : 'bg-warning/20 text-warning'
                        } uppercase`}>{p.risk} Risk</span>
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        {p.description || "Access to sensitive system resources."}
                      </p>
                    </div>
                  ))}
                  {result.permissions_detected.length === 0 && <p className="text-center py-4 opacity-50">No permissions detected.</p>}
                </div>
             )}

             {activeModal === "Keywords" && (
                <div className="grid grid-cols-1 gap-3">
                  {result.risky_keywords_detected.map((k, i) => (
                    <div key={i} className="p-3 rounded border border-primary/10 bg-primary/5 flex justify-between items-center">
                      <span className="text-primary font-bold">{k.keyword}</span>
                      <span className="text-[10px] text-muted-foreground italic">{k.category}</span>
                    </div>
                  ))}
                  {result.risky_keywords_detected.length === 0 && <p className="text-center py-4 opacity-50">No risky keywords detected.</p>}
                </div>
             )}

             {activeModal === "Patterns" && (
                <div className="space-y-3">
                   {result.risk_breakdown.patterns.length > 0 ? (
                      result.risk_breakdown.patterns.map((p, i) => (
                        <div key={i} className="p-3 rounded border border-border bg-destructive/5 text-xs text-foreground italic flex justify-between">
                            <span>"{p.name}"</span>
                            <span className="text-destructive">{p.percentage}% contrib.</span>
                        </div>
                      ))
                   ) : (
                      <div className="text-center py-8 opacity-50">
                        <FileText className="w-8 h-8 mx-auto mb-2 opacity-20" />
                        <p>No risky patterns detected in the analyzed text.</p>
                      </div>
                   )}
                </div>
             )}

             {activeModal === "Words Analyzed" && (
                <div className="space-y-4">
                   <p className="text-xs text-muted-foreground leading-relaxed bg-secondary/20 p-4 rounded italic">
                      The analyzer processed {result.stats.words_analyzed} words to determine the risk level. 
                      You can review the extracted text preview below.
                   </p>
                   <div className="p-4 rounded border border-border bg-background text-xs leading-relaxed max-h-64 overflow-y-auto whitespace-pre-wrap">
                      {result.ocr_extracted_text_preview || "Privacy policy text content analysis complete."}
                   </div>
                </div>
             )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ResultDashboard;
