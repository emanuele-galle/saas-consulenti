import Image from "next/image";
import { CheckCircle2, Quote } from "lucide-react";

interface SummaryData {
  bio?: string;
  highlights?: string[];
  quote?: string;
  imageUrl?: string;
}

interface SummarySectionProps {
  summaryData: SummaryData;
}

export function SummarySection({ summaryData }: SummarySectionProps) {
  const { bio, highlights, quote, imageUrl } = summaryData;

  if (!bio && (!highlights || highlights.length === 0) && !quote) {
    return null;
  }

  return (
    <section className="py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <p className="mb-4 text-center text-sm font-medium uppercase tracking-[0.2em] text-muted-foreground">
          Chi sono
        </p>
        <h2 className="mb-16 text-center text-3xl font-bold text-foreground sm:text-4xl">
          La mia storia
        </h2>

        <div className={`mx-auto ${imageUrl ? "max-w-6xl" : "max-w-3xl"}`}>
          <div className={imageUrl ? "flex flex-col gap-12 md:flex-row md:items-start" : ""}>
            {imageUrl && (
              <div className="shrink-0 md:w-2/5">
                <div className="relative aspect-[3/4] w-full overflow-hidden rounded-2xl shadow-xl">
                  <Image
                    src={imageUrl}
                    alt="Chi sono"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            )}

            <div className="flex-1">
              {bio && (
                <div className="mb-8 space-y-4">
                  {bio.split("\n").map((paragraph, index) => (
                    <p
                      key={index}
                      className="text-base leading-relaxed text-muted-foreground"
                    >
                      {paragraph}
                    </p>
                  ))}
                </div>
              )}

              {quote && (
                <div className="my-8 rounded-xl border-l-4 border-[var(--theme-color,#C21D17)] bg-muted/50 py-6 pl-6 pr-4">
                  <Quote className="mb-2 h-6 w-6 text-[var(--theme-color,#C21D17)] opacity-40" />
                  <p className="text-lg font-medium italic leading-relaxed text-foreground sm:text-xl">
                    &ldquo;{quote}&rdquo;
                  </p>
                </div>
              )}

              {highlights && highlights.length > 0 && (
                <ul className="space-y-3">
                  {highlights.map((item, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[var(--theme-color,#C21D17)]" />
                      <span className="text-sm text-foreground">{item}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
