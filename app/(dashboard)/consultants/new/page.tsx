"use client";

import { useRef } from "react";
import { useRouter } from "next/navigation";
import { useTRPC } from "@/lib/trpc";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  ConsultantForm,
  type ConsultantFormData,
} from "@/components/dashboard/consultant-form";

export default function NewConsultantPage() {
  const router = useRouter();
  const trpc = useTRPC();
  const profileImageRef = useRef<string | null>(null);
  const profileImagePositionRef = useRef<string | null>(null);

  const createMutation = useMutation(
    trpc.consultants.create.mutationOptions({
      onSuccess: () => {
        toast.success("Consulente creato con successo");
        router.push("/consultants");
      },
      onError: (error) => {
        toast.error(error.message || "Errore nella creazione");
      },
    })
  );

  function handleSubmit(data: ConsultantFormData) {
    createMutation.mutate({
      ...data,
      password: data.password || "temppass2026!",
      consultantEmail: data.consultantEmail || data.email,
      linkedinUrl: data.linkedinUrl || "",
      facebookUrl: data.facebookUrl || "",
      twitterUrl: data.twitterUrl || "",
      profileImage: profileImageRef.current || undefined,
      profileImagePosition: profileImagePositionRef.current || undefined,
    });
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Nuovo Consulente
        </h1>
        <p className="text-muted-foreground">
          Crea un nuovo profilo consulente con la relativa landing page
        </p>
      </div>
      <ConsultantForm
        onSubmit={handleSubmit}
        onProfileImageChange={(url) => { profileImageRef.current = url; }}
        onProfileImagePositionChange={(pos) => { profileImagePositionRef.current = pos; }}
        isLoading={createMutation.isPending}
      />
    </div>
  );
}
