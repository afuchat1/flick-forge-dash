import { getImageUrl } from "@/hooks/useTMDB";

interface Provider {
  provider_id: number;
  provider_name: string;
  logo_path: string;
}

interface StreamingProvidersProps {
  providers?: {
    flatrate?: Provider[];
    rent?: Provider[];
    buy?: Provider[];
    free?: Provider[];
  };
}

const StreamingProviders = ({ providers }: StreamingProvidersProps) => {
  if (!providers) return null;

  const allProviders = [
    ...(providers.flatrate || []),
    ...(providers.free || []),
    ...(providers.rent || []),
    ...(providers.buy || []),
  ];

  const uniqueProviders = allProviders.filter(
    (p, i, arr) => arr.findIndex((x) => x.provider_id === p.provider_id) === i
  );

  if (uniqueProviders.length === 0) return null;

  return (
    <div>
      <h3 className="text-xs text-muted-foreground mb-2">Available On</h3>
      <div className="flex flex-wrap gap-2">
        {uniqueProviders.slice(0, 8).map((provider) => (
          <div
            key={provider.provider_id}
            className="flex items-center gap-1.5 bg-card px-2 py-1 rounded-md"
          >
            <img
              src={getImageUrl(provider.logo_path, "w185")}
              alt={provider.provider_name}
              className="w-5 h-5 rounded"
            />
            <span className="text-[10px] font-medium">{provider.provider_name}</span>
          </div>
        ))}
      </div>
      {providers.flatrate && providers.flatrate.length > 0 && (
        <p className="text-[9px] text-muted-foreground mt-1">
          Stream: {providers.flatrate.map((p) => p.provider_name).join(", ")}
        </p>
      )}
      {providers.rent && providers.rent.length > 0 && (
        <p className="text-[9px] text-muted-foreground">
          Rent: {providers.rent.slice(0, 4).map((p) => p.provider_name).join(", ")}
        </p>
      )}
    </div>
  );
};

export default StreamingProviders;
