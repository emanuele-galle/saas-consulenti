"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useTRPC } from "@/lib/trpc";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { SectionPanel } from "@/components/editor/section-panel";
import { SeoAnalyticsEditor } from "@/components/editor/seo-analytics-editor";
import { LivePreview } from "@/components/editor/live-preview";
import {
  ArrowLeft,
  Save,
  Globe,
  Loader2,
  PenSquare,
  Eye,
  ChevronDown,
  Search,
} from "lucide-react";

/**
 * Maps a section editor ID to the corresponding database column name.
 */
const SECTION_TO_DB_FIELD: Record<string, string> = {
  cover: "coverData",
  summary: "summaryData",
  map: "mapData",
  skills: "skillsData",
  experiences: "experiencesData",
  education: "educationData",
  interests: "interestsData",
  banner: "bannerData",
  focusOn: "focusOnData",
  testimonials: "testimonialsData",
  video: "videoData",
  portfolio: "portfolioData",
  quote: "quoteData",
};

function buildInitialSections(
  page: {
    coverData: unknown;
    summaryData: unknown;
    mapData: unknown;
    skillsData: unknown;
    experiencesData: unknown;
    educationData: unknown;
    interestsData: unknown;
    bannerData: unknown;
    focusOnData: unknown;
    testimonialsData: unknown;
    videoData: unknown;
    portfolioData: unknown;
    quoteData: unknown;
  } | undefined,
): Record<string, unknown> {
  if (!page) return {};
  return {
    cover: page.coverData ?? {},
    summary: page.summaryData ?? {},
    map: page.mapData ?? {},
    skills: page.skillsData ?? { skills: [] },
    experiences: page.experiencesData ?? { experiences: [] },
    education: page.educationData ?? { items: [] },
    interests: page.interestsData ?? { interests: [] },
    banner: page.bannerData ?? {},
    focusOn: page.focusOnData ?? { articles: [] },
    testimonials: page.testimonialsData ?? { testimonials: [] },
    video: page.videoData ?? {},
    portfolio: page.portfolioData ?? { items: [] },
    quote: page.quoteData ?? {},
  };
}

export default function EditorPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  // Fetch landing page data
  const landingPageQuery = useQuery(
    trpc.landingPages.getById.queryOptions({ id: params.id }),
  );

  // Compute initial sections from fetched data
  const initialSections = useMemo(
    () => buildInitialSections(landingPageQuery.data),
    [landingPageQuery.data],
  );

  // Local overrides: only tracks sections that the user has edited
  const [sectionOverrides, setSectionOverrides] = useState<Record<string, unknown>>({});
  const [previewRefreshKey, setPreviewRefreshKey] = useState(0);
  const [mobileTab, setMobileTab] = useState<"editor" | "preview">("editor");
  const [seoOpen, setSeoOpen] = useState(false);

  // Merge initial data with user overrides
  const sections = useMemo(
    () => ({ ...initialSections, ...sectionOverrides }),
    [initialSections, sectionOverrides],
  );

  const hasData = Object.keys(initialSections).length > 0;

  // Debounce timer ref for auto-save
  const autoSaveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pendingSavesRef = useRef<Set<string>>(new Set());
  const sectionsRef = useRef(sections);

  // Keep sectionsRef in sync (inside an effect to avoid updating refs during render)
  useEffect(() => {
    sectionsRef.current = sections;
  }, [sections]);

  // Section update mutation
  const updateSectionMutation = useMutation(
    trpc.landingPages.updateSection.mutationOptions({
      onSuccess: () => {
        setPreviewRefreshKey((prev) => prev + 1);
      },
      onError: (error) => {
        toast.error(`Errore nel salvataggio: ${error.message}`);
      },
    }),
  );

  // Status update mutation
  const updateStatusMutation = useMutation(
    trpc.landingPages.updateStatus.mutationOptions({
      onSuccess: (_data, variables) => {
        queryClient.invalidateQueries({
          queryKey: trpc.landingPages.getById.queryKey({ id: params.id }),
        });
        if (variables.status === "PUBLISHED") {
          toast.success("Landing page pubblicata con successo!");
        } else {
          toast.success("Landing page salvata come bozza.");
        }
      },
      onError: (error) => {
        toast.error(`Errore: ${error.message}`);
      },
    }),
  );

  // Save a single section to the server
  const saveSection = useCallback(
    (sectionId: string, data: unknown) => {
      const dbField = SECTION_TO_DB_FIELD[sectionId];
      if (!dbField) return;

      updateSectionMutation.mutate({
        landingPageId: params.id,
        section: dbField as Parameters<
          typeof updateSectionMutation.mutate
        >[0]["section"],
        data,
      });
    },
    [params.id, updateSectionMutation],
  );

  // Handle section change from editor with debounced auto-save
  const handleSectionChange = useCallback(
    (sectionId: string, data: unknown) => {
      setSectionOverrides((prev) => ({ ...prev, [sectionId]: data }));
      pendingSavesRef.current.add(sectionId);

      // Debounce: save after 1.5s of inactivity
      if (autoSaveTimerRef.current) {
        clearTimeout(autoSaveTimerRef.current);
      }

      autoSaveTimerRef.current = setTimeout(() => {
        const currentSections = sectionsRef.current;
        for (const id of pendingSavesRef.current) {
          saveSection(id, currentSections[id]);
        }
        pendingSavesRef.current.clear();
      }, 1500);
    },
    [saveSection],
  );

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (autoSaveTimerRef.current) {
        clearTimeout(autoSaveTimerRef.current);
      }
    };
  }, []);

  function handleSaveAll(): void {
    // Flush pending changes immediately
    if (autoSaveTimerRef.current) {
      clearTimeout(autoSaveTimerRef.current);
    }

    for (const sectionId of Object.keys(SECTION_TO_DB_FIELD)) {
      if (sections[sectionId] !== undefined) {
        saveSection(sectionId, sections[sectionId]);
      }
    }
    pendingSavesRef.current.clear();
    toast.success("Tutte le sezioni sono state salvate.");
  }

  function handlePublish(): void {
    handleSaveAll();
    updateStatusMutation.mutate({
      landingPageId: params.id,
      status: "PUBLISHED",
    });
  }

  function handleSaveDraft(): void {
    handleSaveAll();
    updateStatusMutation.mutate({
      landingPageId: params.id,
      status: "DRAFT",
    });
  }

  // Loading state
  if (landingPageQuery.isLoading) {
    return (
      <div className="flex h-[calc(100vh-8rem)] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  // Error state
  if (landingPageQuery.error) {
    return (
      <div className="flex h-[calc(100vh-8rem)] flex-col items-center justify-center gap-4">
        <p className="text-muted-foreground">
          Impossibile caricare la landing page.
        </p>
        <Button variant="outline" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
          Torna indietro
        </Button>
      </div>
    );
  }

  const landingPage = landingPageQuery.data;
  if (!landingPage) return null;

  const consultantName = [
    landingPage.consultant.title,
    landingPage.consultant.firstName,
    landingPage.consultant.lastName,
  ]
    .filter(Boolean)
    .join(" ");

  const isSaving = updateSectionMutation.isPending || updateStatusMutation.isPending;

  return (
    <div className="-m-6 flex h-[calc(100vh-4rem)] flex-col">
      {/* Top Bar */}
      <div className="flex items-center justify-between border-b bg-background px-4 py-3">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.push("/consultants")}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-base font-semibold">{consultantName}</h1>
            <p className="text-xs text-muted-foreground">
              /{landingPage.slug}
              {landingPage.status === "DRAFT" && (
                <span className="ml-2 rounded bg-yellow-100 px-1.5 py-0.5 text-xs font-medium text-yellow-800">
                  Bozza
                </span>
              )}
              {landingPage.status === "PUBLISHED" && (
                <span className="ml-2 rounded bg-green-100 px-1.5 py-0.5 text-xs font-medium text-green-800">
                  Pubblicata
                </span>
              )}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {isSaving && (
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <Loader2 className="h-3 w-3 animate-spin" />
              Salvataggio...
            </span>
          )}
          <Button variant="outline" size="sm" onClick={handleSaveDraft}>
            <Save className="h-4 w-4" />
            Salva come bozza
          </Button>
          <Button size="sm" onClick={handlePublish}>
            <Globe className="h-4 w-4" />
            Pubblica
          </Button>
        </div>
      </div>

      {/* Mobile Tab Toggle */}
      <div className="flex border-b lg:hidden">
        <button
          type="button"
          className={`flex flex-1 items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium transition-colors ${
            mobileTab === "editor"
              ? "border-b-2 border-primary text-primary"
              : "text-muted-foreground"
          }`}
          onClick={() => setMobileTab("editor")}
        >
          <PenSquare className="h-4 w-4" />
          Editor
        </button>
        <button
          type="button"
          className={`flex flex-1 items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium transition-colors ${
            mobileTab === "preview"
              ? "border-b-2 border-primary text-primary"
              : "text-muted-foreground"
          }`}
          onClick={() => setMobileTab("preview")}
        >
          <Eye className="h-4 w-4" />
          Anteprima
        </button>
      </div>

      {/* Split View */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Panel - Editor */}
        <div
          className={`w-full shrink-0 overflow-y-auto border-r bg-background p-4 lg:w-[400px] lg:max-w-[35vw] ${
            mobileTab !== "editor" ? "hidden lg:block" : ""
          }`}
        >
          {hasData && (
            <>
              <SectionPanel
                sections={sections}
                onSectionChange={handleSectionChange}
                consultantAddress={landingPage.consultant ? {
                  address: landingPage.consultant.address,
                  cap: landingPage.consultant.cap,
                  city: landingPage.consultant.city,
                  province: landingPage.consultant.province,
                } : undefined}
              />

              {/* SEO & Analytics Collapsible */}
              <div className="mt-4 overflow-hidden rounded-lg border">
                <button
                  type="button"
                  className="flex w-full items-center justify-between px-4 py-3 text-left text-sm font-medium hover:bg-muted/50 transition-colors"
                  onClick={() => setSeoOpen(!seoOpen)}
                >
                  <span className="flex items-center gap-2">
                    <Search className="h-4 w-4" />
                    SEO & Analytics
                  </span>
                  <ChevronDown
                    className={`h-4 w-4 text-muted-foreground transition-transform duration-200 ${seoOpen ? "rotate-180" : ""}`}
                  />
                </button>
                {seoOpen && (
                  <div className="border-t px-4 pb-4 pt-3">
                    <SeoAnalyticsEditor
                      landingPageId={params.id}
                      metaTitle={landingPage.metaTitle}
                      metaDescription={landingPage.metaDescription}
                      ga4MeasurementId={landingPage.ga4MeasurementId}
                      gscVerificationTag={landingPage.gscVerificationTag}
                      slug={landingPage.slug}
                    />
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        {/* Right Panel - Preview */}
        <div
          className={`flex-1 overflow-hidden ${
            mobileTab !== "preview" ? "hidden lg:block" : ""
          }`}
        >
          <LivePreview
            slug={landingPage.slug}
            refreshKey={previewRefreshKey}
          />
        </div>
      </div>
    </div>
  );
}
