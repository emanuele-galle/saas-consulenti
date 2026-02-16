import Image from "next/image";
import { getVideoEmbedUrl } from "@/lib/video-utils";
import type { SectionBackground } from "@/components/editor/section-background-editor";

interface SectionBackgroundWrapperProps {
  background?: SectionBackground;
  children: React.ReactNode;
}

export function SectionBackgroundWrapper({ background, children }: SectionBackgroundWrapperProps) {
  if (!background || background.type === "default") {
    return <>{children}</>;
  }

  if (background.type === "color") {
    return (
      <div className="section-custom-bg" style={{ backgroundColor: background.color }}>
        {children}
      </div>
    );
  }

  if (background.type === "image" && background.imageUrl) {
    const opacity = (background.overlayOpacity ?? 40) / 100;
    return (
      <div className="section-custom-bg relative">
        <div className="absolute inset-0 overflow-hidden">
          <Image
            src={background.imageUrl}
            alt=""
            fill
            className="object-cover"
            unoptimized
          />
          <div
            className="absolute inset-0"
            style={{ backgroundColor: `rgba(0,0,0,${opacity})` }}
          />
        </div>
        <div className="relative z-10">{children}</div>
      </div>
    );
  }

  if (background.type === "video" && background.videoUrl) {
    const embedUrl = getVideoEmbedUrl(background.videoUrl);
    if (!embedUrl) return <>{children}</>;

    const opacity = (background.overlayOpacity ?? 50) / 100;
    return (
      <div className="section-custom-bg relative overflow-hidden">
        <div className="absolute inset-0">
          <iframe
            src={embedUrl}
            className="absolute left-1/2 top-1/2 h-[56.25vw] min-h-full w-[177.78vh] min-w-full -translate-x-1/2 -translate-y-1/2"
            allow="autoplay; fullscreen"
            style={{ border: 0, pointerEvents: "none" }}
            title="Background video"
          />
          <div
            className="absolute inset-0"
            style={{ backgroundColor: `rgba(0,0,0,${opacity})` }}
          />
        </div>
        <div className="relative z-10">{children}</div>
      </div>
    );
  }

  return <>{children}</>;
}
