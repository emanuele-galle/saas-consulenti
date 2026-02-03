import Image from "next/image";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowRight } from "lucide-react";
import { StaggerContainer, StaggerItem } from "@/components/landing/animate-on-scroll";

interface FocusArticle {
  title: string;
  excerpt?: string;
  imageUrl?: string;
  linkUrl: string;
}

interface FocusOnData {
  title?: string;
  articles: FocusArticle[];
}

interface FocusOnSectionProps {
  focusOnData: FocusOnData;
}

export function FocusOnSection({ focusOnData }: FocusOnSectionProps) {
  const { articles } = focusOnData;

  if (!articles || articles.length === 0) {
    return null;
  }

  const title = focusOnData.title ?? "Focus On";

  return (
    <section className="bg-muted/50 py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <p className="mb-4 text-center text-sm font-medium uppercase tracking-[0.2em] text-muted-foreground">
          In evidenza
        </p>
        <h2 className="mb-16 text-center text-3xl font-bold text-foreground sm:text-4xl">
          {title}
        </h2>

        <StaggerContainer className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {articles.map((article, index) => (
            <StaggerItem key={index}>
              <a
                href={article.linkUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group block h-full"
              >
                <Card className="h-full overflow-hidden border-0 shadow-md transition-all group-hover:shadow-xl group-hover:-translate-y-1">
                  {article.imageUrl && (
                    <div className="relative aspect-video w-full overflow-hidden">
                      <Image
                        src={article.imageUrl}
                        alt={article.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    </div>
                  )}
                  <CardHeader className="pb-2">
                    <CardTitle className="line-clamp-2 text-base">
                      {article.title}
                    </CardTitle>
                  </CardHeader>
                  {article.excerpt && (
                    <CardContent className="pb-4">
                      <p className="line-clamp-3 text-sm text-muted-foreground">
                        {article.excerpt}
                      </p>
                    </CardContent>
                  )}
                  <CardContent className="pt-0">
                    <span className="inline-flex items-center gap-1 text-sm font-medium text-[var(--theme-color,#C21D17)] transition-colors">
                      Leggi di più
                      <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                    </span>
                  </CardContent>
                </Card>
              </a>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
