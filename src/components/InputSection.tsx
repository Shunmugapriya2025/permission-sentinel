import { useState, useEffect, useRef, useCallback } from "react";
import { FileText, Loader2, Scan, Image, X, Upload, ClipboardPaste } from "lucide-react";
import { Button } from "@/components/ui/button";

interface InputSectionProps {
  onSubmit: (input: { text?: string; image?: File; appName: string }) => void;
  loading: boolean;
}

const InputSection = ({ onSubmit, loading }: InputSectionProps) => {
  const [mode, setMode] = useState<"text" | "image">("text");
  const [text, setText] = useState("");
  const [appName, setAppName] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isValidAppName = (name: string) => {
    const n = name.trim();
    if (n.length < 2) return false;
    if (/^[^a-zA-Z]+$/.test(n)) return false;
    if (/^[. ]+$/.test(n)) return false;
    return true;
  };

  const setImage = useCallback((file: File) => {
    if (!file.type.startsWith("image/")) return;
    setImageFile(file);
    const url = URL.createObjectURL(file);
    setImagePreview(url);
  }, []);

  const clearImage = () => {
    setImageFile(null);
    if (imagePreview) URL.revokeObjectURL(imagePreview);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // Paste screenshot anywhere on the page when in image mode
  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      if (mode !== "image") return;
      const items = e.clipboardData?.items;
      if (!items) return;
      for (const item of Array.from(items)) {
        if (item.type.startsWith("image/")) {
          const file = item.getAsFile();
          if (file) setImage(file);
          break;
        }
      }
    };
    window.addEventListener("paste", handlePaste);
    return () => window.removeEventListener("paste", handlePaste);
  }, [mode, setImage]);

  // Drag and drop
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };
  const handleDragLeave = () => setIsDragging(false);
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) setImage(file);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setImage(file);
  };

  const handleSubmit = () => {
    if (!isValidAppName(appName)) return;
    if (mode === "image" && imageFile) {
      onSubmit({ image: imageFile, appName: appName.trim() });
    } else if (mode === "text" && text.trim()) {
      onSubmit({ text: text.trim(), appName: appName.trim() });
    }
  };

  const canSubmit =
    isValidAppName(appName) &&
    (mode === "text" ? text.trim().length > 0 : imageFile !== null);

  const switchMode = (m: "text" | "image") => {
    setMode(m);
    clearImage();
    setText("");
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-5">
      {/* App Name */}
      <div className="space-y-1.5">
        <label className="text-xs font-mono text-primary tracking-widest uppercase">
          App Name <span className="text-primary/50">(required)</span>
        </label>
        <input
          id="app-name-input"
          type="text"
          value={appName}
          onChange={(e) => setAppName(e.target.value)}
          placeholder="e.g. WhatsApp, TikTok, Instagram..."
          className="w-full rounded-lg bg-card cyber-border px-4 py-2.5 text-sm text-card-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/50 font-mono"
        />
      </div>

      {/* Mode Toggle */}
      <div className="flex rounded-lg overflow-hidden cyber-border bg-card">
        <button
          onClick={() => switchMode("text")}
          className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-mono transition-colors ${
            mode === "text"
              ? "bg-primary/10 text-primary border-b-2 border-primary"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <FileText className="w-4 h-4" />
          Paste Text
        </button>
        <button
          onClick={() => switchMode("image")}
          className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-mono transition-colors ${
            mode === "image"
              ? "bg-primary/10 text-primary border-b-2 border-primary"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <Image className="w-4 h-4" />
          Screenshot
        </button>
      </div>

      {/* Text Mode */}
      {mode === "text" && (
        <textarea
          id="policy-text-input"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Paste the app's privacy policy or permissions list here..."
          className="w-full h-48 rounded-lg bg-card cyber-border p-4 text-sm text-card-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/50 resize-none font-mono"
        />
      )}

      {/* Image Mode */}
      {mode === "image" && (
        <div>
          {!imageFile ? (
            <div
              id="screenshot-drop-zone"
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`w-full h-48 rounded-lg cyber-border flex flex-col items-center justify-center gap-3 cursor-pointer transition-all select-none ${
                isDragging
                  ? "bg-primary/10 border-primary scale-[1.01]"
                  : "bg-card hover:bg-primary/5"
              }`}
            >
              <div className="flex flex-col items-center gap-2 pointer-events-none">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Upload className="w-5 h-5 text-primary" />
                </div>
                <p className="text-sm font-mono text-muted-foreground text-center">
                  Drop screenshot here or{" "}
                  <span className="text-primary underline underline-offset-2">browse</span>
                </p>
                <div className="flex items-center gap-1.5 text-xs font-mono text-muted-foreground/60">
                  <ClipboardPaste className="w-3 h-3" />
                  Or press <kbd className="px-1.5 py-0.5 rounded bg-muted text-foreground font-mono text-xs">Ctrl+V</kbd> to paste
                </div>
                <p className="text-[10px] font-mono text-muted-foreground/40">
                  PNG, JPG, WEBP supported
                </p>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileInput}
              />
            </div>
          ) : (
            <div className="relative rounded-lg cyber-border overflow-hidden bg-card">
              <img
                src={imagePreview!}
                alt="Policy screenshot preview"
                className="w-full max-h-56 object-contain bg-black/20"
              />
              {/* Overlay info bar */}
              <div className="flex items-center justify-between px-3 py-2 bg-card/90 backdrop-blur-sm border-t border-border">
                <div className="flex items-center gap-2 min-w-0">
                  <Image className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                  <span className="text-xs font-mono text-muted-foreground truncate max-w-[220px]">
                    {imageFile.name}
                  </span>
                  <span className="text-[10px] font-mono text-muted-foreground/50 flex-shrink-0">
                    ({(imageFile.size / 1024).toFixed(0)} KB)
                  </span>
                </div>
                <button
                  onClick={clearImage}
                  className="flex items-center gap-1 text-[10px] font-mono text-muted-foreground hover:text-destructive transition-colors flex-shrink-0"
                >
                  <X className="w-3 h-3" />
                  Remove
                </button>
              </div>
              <div className="px-3 py-1.5 bg-primary/5 border-t border-primary/10">
                <p className="text-[10px] font-mono text-primary/70">
                  ✦ Gemini Vision will extract text from this image, then analyze it for privacy risks
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Submit */}
      <Button
        id="analyze-btn"
        onClick={handleSubmit}
        disabled={!canSubmit || loading}
        className="w-full h-12 text-sm font-mono bg-primary text-primary-foreground hover:bg-primary/90 glow-primary disabled:opacity-40 disabled:shadow-none"
      >
        {loading ? (
          <span className="flex items-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin" />
            {mode === "image" ? "Extracting & Analyzing with AI..." : "Analyzing with AI..."}
          </span>
        ) : (
          <span className="flex items-center gap-2">
            <Scan className="w-4 h-4" />
            {mode === "image" ? "Extract Text & Analyze" : "Analyze Permissions"}
          </span>
        )}
      </Button>
    </div>
  );
};

export default InputSection;
