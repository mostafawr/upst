import type { Metadata } from "next";

interface PageMetadataInput {
  title: string;
  description: string;
  path: `/${string}` | "/";
}

export function pageMetadata({
  title,
  description,
  path,
}: PageMetadataInput): Metadata {
  const socialTitle = `${title} — UPSTACK`;

  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      title: socialTitle,
      description,
      url: path,
      siteName: "UPSTACK",
      images: [
        {
          url: "/og.png",
          width: 1200,
          height: 630,
          alt: "UPSTACK — Systems That Sell",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: socialTitle,
      description,
      images: ["/og.png"],
    },
  };
}
