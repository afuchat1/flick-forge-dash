import { Link } from "react-router-dom";
import { ExternalLink } from "lucide-react";

interface ExternalLinksProps {
  externalIds: any;
  homepage?: string;
  keywords: any[];
  mediaType: "movie" | "tv";
}

const social = [
  { key: "imdb_id", label: "IMDb", url: (v: string) => `https://www.imdb.com/title/${v}` },
  { key: "facebook_id", label: "Facebook", url: (v: string) => `https://facebook.com/${v}` },
  { key: "instagram_id", label: "Instagram", url: (v: string) => `https://instagram.com/${v}` },
  { key: "twitter_id", label: "X / Twitter", url: (v: string) => `https://x.com/${v}` },
  { key: "wikidata_id", label: "Wikidata", url: (v: string) => `https://www.wikidata.org/wiki/${v}` },
];

/** Keywords/themes plus canonical outbound references for further research. */
const ExternalLinks = ({ externalIds = {}, homepage, keywords = [], mediaType }: ExternalLinksProps) => {
  const links = social.filter((s) => externalIds?.[s.key]);

  if (links.length === 0 && !homepage && keywords.length === 0) return null;

  return (
    <section className="space-y-4">
      {keywords.length > 0 && (
        <div className="space-y-2.5">
          <h2 className="section-title">Themes &amp; Keywords</h2>
          <div className="flex flex-wrap gap-1.5">
            {keywords.map((k) => (
              <Link key={k.id} to={`/search?q=${encodeURIComponent(k.name)}`} className="chip">
                {k.name}
              </Link>
            ))}
          </div>
        </div>
      )}

      {(links.length > 0 || homepage) && (
        <div className="space-y-2.5">
          <h2 className="section-title">Official Links</h2>
          <div className="flex flex-wrap gap-1.5">
            {homepage && (
              <a href={homepage} target="_blank" rel="noopener noreferrer" className="chip">
                <ExternalLink className="h-3 w-3" /> Official site
              </a>
            )}
            {links.map((s) => (
              <a
                key={s.key}
                href={s.url(externalIds[s.key])}
                target="_blank"
                rel="noopener noreferrer"
                className="chip"
              >
                <ExternalLink className="h-3 w-3" /> {s.label}
              </a>
            ))}
          </div>
        </div>
      )}
    </section>
  );
};

export default ExternalLinks;
