import { useState, useCallback } from "react";
import { FileText, Image, Upload, X, Loader2, Scan } from "lucide-react";
import { Button } from "@/components/ui/button";

interface InputSectionProps {
  onSubmit: (input: { type: "text"; text: string; appName: string } | { type: "image"; file: File; appName: string }) => void;
  loading: boolean;
}

const InputSection = ({ onSubmit, loading }: InputSectionProps) => {
  const [mode, setMode] = useState<"text" | "image">("text");
  const [text, setText] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [appName, setAppName] = useState("");

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const dropped = e.dataTransfer.files[0];
    if (dropped && dropped.type.startsWith("image/")) {
      setFile(dropped);
    }
  }, []);

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
    
    if (mode === "text" && text.trim()) {
      onSubmit({ type: "text", text: text.trim(), appName: appName.trim() });
    } else if (mode === "image" && file) {
      onSubmit({ type: "image", file, appName: appName.trim() });
    }
  };

  const canSubmit = isValidAppName(appName) && (mode === "text" ? text.trim().length > 0 : file !== null);

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

      {/* Tabs */}
      <div className="flex rounded-lg overflow-hidden cyber-border">
        <button
          onClick={() => setMode("text")}
          className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-mono transition-all ${
            mode === "text"
              ? "bg-primary/10 text-primary border-b-2 border-primary"
              : "bg-card text-muted-foreground hover:text-foreground"
          }`}
        >
          <FileText className="w-4 h-4" /> Paste Text
        </button>
        <button
          onClick={() => setMode("image")}
          className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-mono transition-all ${
            mode === "image"
              ? "bg-primary/10 text-primary border-b-2 border-primary"
              : "bg-card text-muted-foreground hover:text-foreground"
          }`}
        >
          <Image className="w-4 h-4" /> Upload Screenshot
        </button>
      </div>

      {/* Input area */}
      {mode === "text" ? (
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Paste the app's privacy policy or terms & conditions here..."
          className="w-full h-48 rounded-lg bg-card cyber-border p-4 text-sm text-card-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/50 resize-none font-mono"
        />
      ) : (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          className={`relative h-48 rounded-lg cyber-border flex flex-col items-center justify-center gap-3 transition-all cursor-pointer ${
            dragOver ? "bg-primary/10 border-primary/50" : "bg-card"
          }`}
          onClick={() => {
            const input = document.createElement("input");
            input.type = "file";
            input.accept = "image/*";
            input.onchange = (e) => {
              const f = (e.target as HTMLInputElement).files?.[0];
              if (f) setFile(f);
            };
            input.click();
          }}
        >
          {file ? (
            <div className="flex items-center gap-3">
              <Image className="w-8 h-8 text-primary" />
              <div>
                <p className="text-sm text-foreground">{file.name}</p>
                <p className="text-xs text-muted-foreground">
                  {(file.size / 1024).toFixed(1)} KB
                </p>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setFile(null);
                }}
                className="p-1 rounded hover:bg-secondary"
              >
                <X className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>
          ) : (
            <>
              <Upload className="w-8 h-8 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                Drag & drop a screenshot or <span className="text-primary underline">browse</span>
              </p>
            </>
          )}
        </div>
      )}

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
