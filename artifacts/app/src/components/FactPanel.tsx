import { ReactNode } from "react";

interface Fact {
  label: string;
  value: ReactNode;
}

interface FactPanelProps {
  title?: string;
  facts: Fact[];
  columns?: 1 | 2;
}

/**
 * Documentation-grade fact table. Every known attribute of a title
 * is rendered here so nothing about a movie/show is left undocumented.
 */
const FactPanel = ({ title, facts, columns = 2 }: FactPanelProps) => {
  const rows = facts.filter((f) => f.value !== null && f.value !== undefined && f.value !== "");
  if (rows.length === 0) return null;

  return (
    <section className="space-y-3">
      {title && <h2 className="section-title">{title}</h2>}
      <div
        className={`fact-panel overflow-hidden ${
          columns === 2 ? "md:grid md:grid-cols-2 md:gap-x-0" : ""
        }`}
      >
        {rows.map((f) => (
          <div key={f.label} className="fact-row md:border-b md:border-border/60">
            <span className="fact-label pt-0.5">{f.label}</span>
            <span className="fact-value">{f.value}</span>
          </div>
        ))}
      </div>
    </section>
  );
};

export default FactPanel;
