import { Lightbulb } from "lucide-react";

interface RecommendationsProps {
  items: string[];
}

const Recommendations = ({ items }: RecommendationsProps) => {
  return (
    <div className="rounded-lg cyber-border bg-card p-5 space-y-3 animate-fade-in-up" style={{ animationDelay: "0.3s" }}>
      <h3 className="text-sm font-mono text-primary flex items-center gap-2">
        <Lightbulb className="w-4 h-4" /> RECOMMENDATIONS
      </h3>
      <ul className="space-y-2">
        {items.map((item, i) => (
          <li key={i} className="flex items-start gap-2 text-sm text-card-foreground">
            <span className="text-primary mt-0.5">▹</span>
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Recommendations;
