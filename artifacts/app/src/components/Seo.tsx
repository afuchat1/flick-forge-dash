import { Helmet } from "react-helmet-async";

const SITE_URL = "https://movies.afuchat.com";
const SITE_NAME = "AfuChat Movies";

interface SeoProps {
  title: string;
  description?: string;
  path: string;
  image?: string | null;
  type?: "website" | "video.movie" | "video.tv_show" | "profile";
  jsonLd?: Record<string, unknown> | null;
}

const Seo = ({ title, description, path, image, type = "website", jsonLd }: SeoProps) => {
  const url = `${SITE_URL}${path}`;
  const desc = description?.trim().slice(0, 155);

  return (
    <Helmet>
      <title>{title}</title>
      {desc && <meta name="description" content={desc} />}
      <link rel="canonical" href={url} />

      <meta property="og:type" content={type} />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:title" content={title} />
      <meta property="og:url" content={url} />
      {desc && <meta property="og:description" content={desc} />}
      {image && <meta property="og:image" content={image} />}

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:url" content={url} />
      {desc && <meta name="twitter:description" content={desc} />}
      {image && <meta name="twitter:image" content={image} />}

      {jsonLd && (
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      )}
    </Helmet>
  );
};

export default Seo;
export { SITE_URL, SITE_NAME };
