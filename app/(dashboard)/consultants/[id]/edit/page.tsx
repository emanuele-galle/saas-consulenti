"use client";

import { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useTRPC } from "@/lib/trpc";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  ConsultantForm,
  type ConsultantFormData,
} from "@/components/dashboard/consultant-form";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Shield, Trash2 } from "lucide-react";

export default function EditConsultantPage() {
  const params = useParams();
  const router = useRouter();
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const id = params.id as string;
  const profileImageRef = useRef<string | undefined>(undefined);
  const profileImagePositionRef = useRef<string | undefined>(undefined);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedRole, setSelectedRole] = useState<string | null>(null);

  const { data: consultant, isLoading } = useQuery(
    trpc.consultants.getById.queryOptions({ id })
  );

  // Initialize the refs when consultant data loads
  useEffect(() => {
    if (consultant && profileImageRef.current === undefined) {
      profileImageRef.current = consultant.profileImage ?? undefined;
    }
    if (consultant && profileImagePositionRef.current === undefined) {
      profileImagePositionRef.current = consultant.profileImagePosition ?? undefined;
    }
  }, [consultant]);

  const updateMutation = useMutation(
    trpc.consultants.update.mutationOptions({
      onSuccess: () => {
        toast.success("Consulente aggiornato con successo");
        queryClient.invalidateQueries();
        router.push("/consultants");
      },
      onError: (error) => {
        toast.error(error.message || "Errore nell'aggiornamento");
      },
    })
  );

  const updateRoleMutation = useMutation(
    trpc.users.updateRole.mutationOptions({
      onSuccess: () => {
        toast.success("Ruolo aggiornato");
        queryClient.invalidateQueries({
          queryKey: trpc.consultants.getById.queryKey({ id }),
        });
        setSelectedRole(null);
      },
      onError: (error) => {
        toast.error(error.message);
      },
    })
  );

  const deleteMutation = useMutation(
    trpc.consultants.delete.mutationOptions({
      onSuccess: () => {
        toast.success("Consulente eliminato");
        router.push("/consultants");
      },
      onError: (error) => {
        toast.error(error.message);
      },
    })
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-muted-foreground">Caricamento...</p>
      </div>
    );
  }

  if (!consultant) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-muted-foreground">Consulente non trovato</p>
      </div>
    );
  }

  function handleSubmit(data: ConsultantFormData) {
    updateMutation.mutate({
      id,
      firstName: data.firstName,
      lastName: data.lastName,
      title: data.title,
      role: data.role,
      network: data.network,
      bio: data.bio,
      profileImage: profileImageRef.current,
      profileImagePosition: profileImagePositionRef.current,
      email: data.consultantEmail,
      phone: data.phone,
      mobile: data.mobile,
      address: data.address,
      cap: data.cap,
      city: data.city,
      province: data.province,
      efpa: data.efpa,
      efpaEsg: data.efpaEsg,
      sustainableAdvisor: data.sustainableAdvisor,
      linkedinUrl: data.linkedinUrl,
      facebookUrl: data.facebookUrl,
      twitterUrl: data.twitterUrl,
      instagramUrl: data.instagramUrl,
      tiktokUrl: data.tiktokUrl,
      youtubeUrl: data.youtubeUrl,
      websiteUrl: data.websiteUrl,
      themeColor: data.themeColor,
    });
  }

  function roleBadge(userRole: string) {
    switch (userRole) {
      case "SUPERADMIN":
        return <Badge variant="destructive">Super Admin</Badge>;
      case "ADMIN":
        return <Badge variant="default">Admin</Badge>;
      default:
        return <Badge variant="secondary">Consulente</Badge>;
    }
  }

  const currentUserRole = consultant.user.role;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Modifica Consulente
        </h1>
        <p className="text-muted-foreground">
          {consultant.title ? `${consultant.title} ` : ""}
          {consultant.firstName} {consultant.lastName}
        </p>
      </div>

      {/* Account Management Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Gestione Account
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium">Ruolo attuale:</span>
            {roleBadge(currentUserRole)}
          </div>

          {currentUserRole !== "SUPERADMIN" && (
            <div className="flex items-center gap-3">
              <Select
                value={selectedRole || currentUserRole}
                onValueChange={setSelectedRole}
              >
                <SelectTrigger className="w-[200px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="CONSULTANT">Consulente</SelectItem>
                  <SelectItem value="ADMIN">Admin</SelectItem>
                </SelectContent>
              </Select>
              <Button
                size="sm"
                disabled={
                  !selectedRole ||
                  selectedRole === currentUserRole ||
                  updateRoleMutation.isPending
                }
                onClick={() => {
                  if (selectedRole && selectedRole !== currentUserRole) {
                    updateRoleMutation.mutate({
                      userId: consultant.user.id,
                      role: selectedRole as "ADMIN" | "CONSULTANT",
                    });
                  }
                }}
              >
                {updateRoleMutation.isPending
                  ? "Aggiornamento..."
                  : "Cambia Ruolo"}
              </Button>
            </div>
          )}

          <Separator />

          <div>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => setShowDeleteDialog(true)}
            >
              <Trash2 className="h-4 w-4" />
              Elimina Consulente
            </Button>
            <p className="text-xs text-muted-foreground mt-1">
              Elimina definitivamente l&apos;account e tutti i dati associati
            </p>
          </div>
        </CardContent>
      </Card>

      <ConsultantForm
        defaultValues={{
          email: consultant.user.email,
          firstName: consultant.firstName,
          lastName: consultant.lastName,
          title: consultant.title ?? undefined,
          role: consultant.role,
          network: consultant.network ?? undefined,
          bio: consultant.bio ?? undefined,
          consultantEmail: consultant.email,
          phone: consultant.phone ?? undefined,
          mobile: consultant.mobile ?? undefined,
          address: consultant.address ?? undefined,
          cap: consultant.cap ?? undefined,
          city: consultant.city ?? undefined,
          province: consultant.province ?? undefined,
          efpa: consultant.efpa,
          efpaEsg: consultant.efpaEsg,
          sustainableAdvisor: consultant.sustainableAdvisor,
          linkedinUrl: consultant.linkedinUrl ?? undefined,
          facebookUrl: consultant.facebookUrl ?? undefined,
          twitterUrl: consultant.twitterUrl ?? undefined,
          instagramUrl: consultant.instagramUrl ?? undefined,
          tiktokUrl: consultant.tiktokUrl ?? undefined,
          youtubeUrl: consultant.youtubeUrl ?? undefined,
          websiteUrl: consultant.websiteUrl ?? undefined,
          themeColor: consultant.themeColor ?? undefined,
        }}
        profileImageUrl={consultant.profileImage}
        profileImagePosition={consultant.profileImagePosition}
        onProfileImageChange={(url) => {
          profileImageRef.current = url;
        }}
        onProfileImagePositionChange={(pos) => {
          profileImagePositionRef.current = pos;
        }}
        onSubmit={handleSubmit}
        isLoading={updateMutation.isPending}
        isEdit
      />

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Conferma eliminazione</AlertDialogTitle>
            <AlertDialogDescription>
              Sei sicuro di voler eliminare{" "}
              <strong>
                {consultant.firstName} {consultant.lastName}
              </strong>
              ? Questa azione eliminera il suo account utente, la landing page e
              tutti i dati associati. L&apos;operazione non e reversibile.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annulla</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => deleteMutation.mutate({ id })}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? "Eliminazione..." : "Elimina"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
