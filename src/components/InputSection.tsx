import { useState } from "react";
import { FileText, Loader2, Scan } from "lucide-react";
import { Button } from "@/components/ui/button";

interface InputSectionProps {
  onSubmit: (input: { text: string; appName: string }) => void;
  loading: boolean;
}

const InputSection = ({ onSubmit, loading }: InputSectionProps) => {
  const [text, setText] = useState("");
  const [appName, setAppName] = useState("");

  const isValidAppName = (name: string) => {
    const n = name.trim();
    if (n.length < 2) return false;
    // Reject if only symbols or only numbers
    if (/^[^a-zA-Z]+$/.test(n)) return false;
    // Reject common garbage patterns
    if (/^[. ]+$/.test(n)) return false;
    return true;
  };

  const handleSubmit = () => {
    if (!isValidAppName(appName)) return;
    
    if (text.trim()) {
      onSubmit({ text: text.trim(), appName: appName.trim() });
    }
  };

  const canSubmit = isValidAppName(appName) && text.trim().length > 0;

  return (
    <div className="w-full max-w-2xl mx-auto space-y-5">
      {/* App Name Field */}
      <div className="space-y-1.5">
        <label className="text-xs font-mono text-primary tracking-widest uppercase">
          App Name <span className="text-primary/50">(required)</span>
        </label>
        <input
          type="text"
          value={appName}
          onChange={(e) => setAppName(e.target.value)}
          placeholder="e.g. WhatsApp, TikTok, Instagram..."
          className="w-full rounded-lg bg-card cyber-border px-4 py-2.5 text-sm text-card-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/50 font-mono"
        />
      </div>

      {/* Mode Indicator (Static since we only have text now) */}
      <div className="flex rounded-lg overflow-hidden cyber-border bg-primary/10 text-primary">
        <div className="flex-1 flex items-center justify-center gap-2 py-3 text-sm font-mono border-b-2 border-primary">
          <FileText className="w-4 h-4" /> Paste Privacy Policy Text
        </div>
      </div>

      {/* Input area */}
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Paste the app's privacy policy or terms & conditions here..."
        className="w-full h-48 rounded-lg bg-card cyber-border p-4 text-sm text-card-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/50 resize-none font-mono"
      />

      {/* Submit */}
      <Button
        onClick={handleSubmit}
        disabled={!canSubmit || loading}
        className="w-full h-12 text-sm font-mono bg-primary text-primary-foreground hover:bg-primary/90 glow-primary disabled:opacity-40 disabled:shadow-none"
      >
        {loading ? (
          <span className="flex items-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin" /> Analyzing with AI...
          </span>
        ) : (
          <span className="flex items-center gap-2">
            <Scan className="w-4 h-4" /> Analyze Permissions
          </span>
        )}
      </Button>
    </div>
  );
};

export default InputSection;

