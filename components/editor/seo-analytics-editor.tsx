"use client";

import { useState, useEffect } from "react";
import { useTRPC } from "@/lib/trpc";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Save, Search, BarChart3 } from "lucide-react";

interface SeoAnalyticsEditorProps {
  landingPageId: string;
  metaTitle?: string | null;
  metaDescription?: string | null;
  ga4MeasurementId?: string | null;
  gscVerificationTag?: string | null;
  slug: string;
}

export function SeoAnalyticsEditor({
  landingPageId,
  metaTitle: initialTitle,
  metaDescription: initialDescription,
  ga4MeasurementId: initialGa4,
  gscVerificationTag: initialGsc,
  slug,
}: SeoAnalyticsEditorProps) {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const [metaTitle, setMetaTitle] = useState(initialTitle ?? "");
  const [metaDescription, setMetaDescription] = useState(
    initialDescription ?? ""
  );
  const [ga4MeasurementId, setGa4MeasurementId] = useState(
    initialGa4 ?? ""
  );
  const [gscVerificationTag, setGscVerificationTag] = useState(
    initialGsc ?? ""
  );

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- syncing state with prop changes
    setMetaTitle(initialTitle ?? "");
    setMetaDescription(initialDescription ?? "");
    setGa4MeasurementId(initialGa4 ?? "");
    setGscVerificationTag(initialGsc ?? "");
  }, [initialTitle, initialDescription, initialGa4, initialGsc]);

  const mutation = useMutation(
    trpc.landingPages.updateSeo.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: trpc.landingPages.getById.queryKey({ id: landingPageId }),
        });
        toast.success("Impostazioni SEO salvate!");
      },
      onError: (error) => {
        toast.error(`Errore: ${error.message}`);
      },
    })
  );

  const handleSave = () => {
    mutation.mutate({
      landingPageId,
      metaTitle: metaTitle || undefined,
      metaDescription: metaDescription || undefined,
      ga4MeasurementId: ga4MeasurementId || undefined,
      gscVerificationTag: gscVerificationTag || undefined,
    });
  };

  // SERP Preview
  const previewTitle = metaTitle || `Consulente - MediaCom`;
  const previewDesc =
    metaDescription || "Pagina personale del consulente presso MediaCom Italia.";
  const previewUrl = `mediacom-consulenti.it/${slug}`;

  return (
    <div className="space-y-6">
      {/* SEO Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-sm font-semibold">
          <Search className="h-4 w-4" />
          SEO
        </div>

        <div className="space-y-2">
          <Label htmlFor="metaTitle">
            Meta Title
            <span className="ml-2 text-xs text-muted-foreground">
              ({metaTitle.length}/60)
            </span>
          </Label>
          <Input
            id="metaTitle"
            value={metaTitle}
            onChange={(e) => setMetaTitle(e.target.value)}
            placeholder="Titolo per i motori di ricerca"
            maxLength={60}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="metaDescription">
            Meta Description
            <span className="ml-2 text-xs text-muted-foreground">
              ({metaDescription.length}/160)
            </span>
          </Label>
          <Textarea
            id="metaDescription"
            value={metaDescription}
            onChange={(e) => setMetaDescription(e.target.value)}
            placeholder="Descrizione per i motori di ricerca"
            maxLength={160}
            rows={3}
          />
        </div>

        {/* SERP Preview */}
        <div className="rounded-lg border bg-white p-4">
          <p className="text-xs text-muted-foreground mb-2">Anteprima Google</p>
          <div className="space-y-0.5">
            <p className="text-[13px] text-green-700 truncate">{previewUrl}</p>
            <p className="text-lg text-blue-700 font-medium leading-tight truncate">
              {previewTitle}
            </p>
            <p className="text-sm text-gray-600 line-clamp-2">
              {previewDesc}
            </p>
          </div>
        </div>
      </div>

      <Separator />

      {/* Analytics Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-sm font-semibold">
          <BarChart3 className="h-4 w-4" />
          Analytics & Verifica
        </div>

        <div className="space-y-2">
          <Label htmlFor="ga4">Google Analytics 4 Measurement ID</Label>
          <Input
            id="ga4"
            value={ga4MeasurementId}
            onChange={(e) => setGa4MeasurementId(e.target.value)}
            placeholder="G-XXXXXXXXXX"
          />
          <p className="text-xs text-muted-foreground">
            Lo trovi in GA4 &gt; Amministratore &gt; Flussi di dati
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="gsc">Google Search Console Verification Tag</Label>
          <Input
            id="gsc"
            value={gscVerificationTag}
            onChange={(e) => setGscVerificationTag(e.target.value)}
            placeholder="Codice di verifica Google"
          />
          <p className="text-xs text-muted-foreground">
            Metodo &quot;Tag HTML&quot; dalla Search Console
          </p>
        </div>
      </div>

      <Button
        onClick={handleSave}
        disabled={mutation.isPending}
        className="w-full"
      >
        <Save className="mr-2 h-4 w-4" />
        {mutation.isPending ? "Salvataggio..." : "Salva Impostazioni SEO"}
      </Button>
    </div>
  );
}
