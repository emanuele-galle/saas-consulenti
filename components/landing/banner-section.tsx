import Image from "next/image";
import { InlineVideo } from "@/components/landing/inline-video";

interface BannerData {
  imageUrl?: string;
  altText?: string;
  linkUrl?: string;
  videoUrl?: string;
}

interface BannerSectionProps {
  bannerData: BannerData;
}

export function BannerSection({ bannerData }: BannerSectionProps) {
  const { imageUrl, altText, linkUrl } = bannerData;

  if (!imageUrl) {
    return null;
  }

  const alt = altText ?? "Banner promozionale";

  const imageElement = (
    <div
      className="group relative aspect-[3/1] w-full overflow-hidden rounded-3xl"
      style={{
        boxShadow:
          "0 4px 16px rgba(0,0,0,0.08), 0 12px 40px rgba(0,0,0,0.06), 0 24px 80px rgba(0,0,0,0.04)",
        transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
      }}
    >
      <Image
        src={imageUrl}
        alt={alt}
        fill
        className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        unoptimized
      />
      {/* Hover gradient overlay */}
      <div
        className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background:
            "linear-gradient(to top, rgba(0,0,0,0.35) 0%, transparent 50%, transparent 100%)",
        }}
      />
      {linkUrl && (
        <div
          className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          style={{
            background: "rgba(194,29,23,0.08)",
          }}
        />
      )}
    </div>
  );

  return (
    <section className="section-warm py-8 lg:py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {linkUrl ? (
          <a
            href={linkUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group block"
          >
            {imageElement}
          </a>
        ) : (
          imageElement
        )}

        {bannerData.videoUrl && (
          <InlineVideo url={bannerData.videoUrl} />
        )}
      </div>
    </section>
  );
}
