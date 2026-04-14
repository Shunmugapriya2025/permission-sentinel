import { RiskBreakdown as RiskBreakdownType } from "@/services/api";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  ResponsiveContainer, 
  Cell, 
  Tooltip,
  CartesianGrid
} from "recharts";

interface RiskBreakdownProps {
  breakdown: RiskBreakdownType;
  totalPercentage: number;
}

const RiskBreakdown = ({ breakdown, totalPercentage }: RiskBreakdownProps) => {
  const chartData = [
    { name: "Permissions", value: breakdown.totals.permissions, color: "#ef4444" },
    { name: "Keywords", value: breakdown.totals.keywords, color: "#f59e0b" },
    { name: "Patterns", value: breakdown.totals.patterns, color: "#3b82f6" },
  ];

  const categories = [
    { label: "Permissions", value: breakdown.totals.permissions, color: "bg-destructive", items: breakdown.permissions },
    { label: "Keywords", value: breakdown.totals.keywords, color: "bg-warning", items: breakdown.keywords },
    { label: "Patterns", value: breakdown.totals.patterns, color: "bg-primary", items: breakdown.patterns },
  ];

  return (
    <div className="w-full rounded-lg cyber-border bg-card p-6 space-y-8 animate-fade-in-up">
      <div className="flex items-center justify-between border-b border-border pb-4">
        <h3 className="text-lg font-mono text-primary text-glow uppercase tracking-widest">
          ▸ Risk Categorization (Total: {totalPercentage}%)
        </h3>
      </div>

      {/* Main Bar Chart */}
      <div className="h-[200px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.1)" />
            <XAxis 
              dataKey="name" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10, fontFamily: 'monospace' }}
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10, fontFamily: 'monospace' }}
              unit="%"
            />
            <Tooltip 
              cursor={{ fill: 'rgba(255,255,255,0.05)' }}
              contentStyle={{ 
                backgroundColor: 'hsl(var(--card))', 
                borderColor: 'hsl(var(--primary) / 0.2)',
                fontSize: '11px',
                fontFamily: 'monospace'
              }}
            />
            <Bar dataKey="value" radius={[4, 4, 0, 0]} barSize={40}>
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Detailed Item List Breakdown */}
      <div className="grid md:grid-cols-3 gap-6 pt-4 border-t border-border">
        {categories.map((cat) => (
          <div key={`${cat.label}-details`} className="space-y-4">
            <h4 className="text-[10px] font-mono text-muted-foreground uppercase tracking-[0.2em] border-l-2 border-primary pl-2">
              {cat.label} Detail
            </h4>
            
            <div className="space-y-3">
              {cat.items.length > 0 ? (
                cat.items.map((item, idx) => (
                  <div key={idx} className="space-y-1.5 group cursor-default">
                    <div className="flex justify-between text-[11px] font-mono">
                      <span className="text-foreground truncate max-w-[120px]" title={item.name}>
                        {item.name}
                      </span>
                      <span className={cat.color.replace('bg-', 'text-')}>
                        {item.percentage}%
                      </span>
                    </div>
                    <div className="h-1 w-full bg-secondary rounded-full overflow-hidden">
                       <div 
                         className={`h-full rounded-full ${cat.color} transition-all duration-1000 delay-300 opacity-60 group-hover:opacity-100`}
                         style={{ width: `${item.percentage}%` }}
                       />
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-[10px] font-mono text-muted-foreground italic">
                  No risky {cat.label.toLowerCase()} detected
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RiskBreakdown;
