import { Sparkles, ThumbsUp, ThumbsDown, Wallet, Clock, Tv, AlertTriangle, Loader2 } from "lucide-react";
import { useWatchVerdict, type VerdictInput } from "@/hooks/useWatchVerdict";
import { hasEngagera } from "@/lib/engagera";

interface Props {
  input: VerdictInput | null;
}

const toneFor = (verdict: string) => {
  const v = verdict.toLowerCase();
  if (v.includes("skip")) return "text-destructive border-destructive/40 bg-destructive/10";
  if (v.includes("wait")) return "text-amber-400 border-amber-500/40 bg-amber-500/10";
  return "text-primary border-primary/40 bg-primary/10";
};

const Bullets = ({
  title,
  items,
  icon: Icon,
  accent,
}: {
  title: string;
  items: string[];
  icon: typeof ThumbsUp;
  accent: string;
}) => {
  if (!items.length) return null;
  return (
    <div className="space-y-1.5">
      <p className={`flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide ${accent}`}>
        <Icon className="h-3.5 w-3.5" /> {title}
      </p>
      <ul className="space-y-1">
        {items.map((item, i) => (
          <li key={i} className="flex gap-2 text-[13px] leading-relaxed text-foreground/80">
            <span className={`mt-[7px] h-1 w-1 shrink-0 rounded-full ${accent.replace("text-", "bg-")}`} />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

const AIVerdict = ({ input }: Props) => {
  const { data, isLoading } = useWatchVerdict(input);

  if (!hasEngagera()) return null;

  if (isLoading) {
    return (
      <section className="space-y-3">
        <h2 className="section-title">Should You Watch This?</h2>
        <div className="fact-panel flex items-center gap-2 p-4 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin text-primary" />
          AI is weighing this title up for you…
        </div>
      </section>
    );
  }

  if (!data?.one_liner && !data?.verdict) return null;

  const meta = [
    { icon: Wallet, label: "Value for money", value: data.value_for_money },
    { icon: Tv, label: "Best way to watch", value: data.best_way_to_watch },
    { icon: Clock, label: "Time commitment", value: data.time_commitment },
  ].filter((m) => m.value);

  return (
    <section className="space-y-3">
      <h2 className="section-title">Should You Watch This?</h2>

      <div className="fact-panel space-y-5 p-4 md:p-5">
        <div className="flex flex-wrap items-center gap-3">
          {data.verdict && (
            <span className={`rounded-full border px-3 py-1 text-sm font-bold ${toneFor(data.verdict)}`}>
              {data.verdict}
            </span>
          )}
          {data.score > 0 && (
            <div className="flex min-w-[140px] flex-1 items-center gap-2">
              <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
                <div className="h-full rounded-full bg-primary" style={{ width: `${data.score}%` }} />
              </div>
              <span className="text-xs font-semibold text-muted-foreground">{data.score}/100 worth it</span>
            </div>
          )}
          <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
            <Sparkles className="h-3 w-3 text-primary" /> AI verdict
          </span>
        </div>

        {data.one_liner && (
          <p className="max-w-3xl text-[15px] font-medium leading-relaxed text-foreground/90">{data.one_liner}</p>
        )}

        {meta.length > 0 && (
          <div className="grid gap-3 sm:grid-cols-3">
            {meta.map(({ icon: Icon, label, value }) => (
              <div key={label} className="rounded-lg border border-border/70 bg-card/40 p-3">
                <p className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                  <Icon className="h-3.5 w-3.5 text-primary" /> {label}
                </p>
                <p className="mt-1 text-[13px] leading-relaxed text-foreground/85">{value}</p>
              </div>
            ))}
          </div>
        )}

        <div className="grid gap-5 sm:grid-cols-2">
          <Bullets title="Watch it if" items={data.watch_if} icon={ThumbsUp} accent="text-primary" />
          <Bullets title="Skip it if" items={data.skip_if} icon={ThumbsDown} accent="text-muted-foreground" />
          <Bullets title="What works" items={data.strengths} icon={ThumbsUp} accent="text-emerald-400" />
          <Bullets title="What doesn't" items={data.weaknesses} icon={ThumbsDown} accent="text-amber-400" />
        </div>

        {data.content_notes.length > 0 && (
          <div className="rounded-lg border border-border/70 bg-card/40 p-3">
            <p className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
              <AlertTriangle className="h-3.5 w-3.5 text-amber-400" /> Heads up
            </p>
            <p className="mt-1 text-[13px] leading-relaxed text-foreground/80">{data.content_notes.join(" · ")}</p>
          </div>
        )}

        <p className="text-[11px] text-muted-foreground">
          AI-generated guidance based on public data — always your call.
        </p>
      </div>
    </section>
  );
};

export default AIVerdict;
