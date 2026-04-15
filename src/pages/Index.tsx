import { useState } from "react";
import { Shield } from "lucide-react";
import InputSection from "@/components/InputSection";
import ResultDashboard from "@/components/ResultDashboard";
import { analyzePermissions, type AnalysisResult } from "@/services/api";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const { toast } = useToast();

  const handleAnalyze = async (
    input: { text: string; appName: string }
  ) => {
    setLoading(true);
    setResult(null);
    try {
      const data = await analyzePermissions(input);
      setResult(data);
    } catch (err) {
      toast({
        title: "Analysis Failed",
        description: err instanceof Error ? err.message : "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setResult(null);
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Subtle grid overlay */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(hsl(234 89% 59%) 1px, transparent 1px), linear-gradient(90deg, hsl(234 89% 59%) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      <div className="relative z-10 container max-w-4xl mx-auto px-4 py-12 space-y-10">
        {/* Header */}
        <header className="text-center space-y-6">
          <div className="flex flex-col items-center justify-center gap-4">
            <Shield className="w-16 h-16 text-primary" />
            <h1 className="text-3xl md:text-5xl font-bold font-mono text-foreground text-glow tracking-tighter">
              Permission Analyzer
            </h1>
          </div>
          <p className="text-muted-foreground text-sm max-w-md mx-auto">
            Analyze mobile app permissions & privacy policies using AI to uncover hidden data risks.
          </p>
        </header>

        {/* Input or Result */}
        {!result ? (
          <InputSection onSubmit={handleAnalyze} loading={loading} />
        ) : (
          <div className="space-y-6">
            <button
              onClick={handleReset}
              className="text-xs font-mono text-muted-foreground hover:text-primary transition-colors"
            >
              ← New Analysis
            </button>
            <ResultDashboard result={result} />
          </div>
        )}

        {/* Footer */}
        <footer className="text-center pt-8 border-t border-border">
          <p className="text-xs text-muted-foreground font-mono">
            © 2026 Permission Analyzer • Built by{" "}
            <a 
              href="https://github.com/rakavip2-bot" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              @rakavip2-bot
            </a>
          </p>
        </footer>
      </div>
    </div>
  );
};

export default Index;
