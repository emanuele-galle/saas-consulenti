"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useTRPC } from "@/lib/trpc";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { formatDateTime } from "@/lib/utils";
import {
  Mail,
  Phone,
  Calendar,
  User,
  MessageSquare,
  ExternalLink,
} from "lucide-react";

interface SubmissionDetailProps {
  submissionId: string | null;
  onClose: () => void;
}

export function SubmissionDetail({
  submissionId,
  onClose,
}: SubmissionDetailProps) {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const { data: submission, isLoading } = useQuery({
    ...trpc.submissions.getById.queryOptions({ id: submissionId ?? "" }),
    enabled: !!submissionId,
  });

  const handleClose = () => {
    // Invalidate list to update read status
    queryClient.invalidateQueries({ queryKey: trpc.submissions.list.queryKey() });
    onClose();
  };

  return (
    <Dialog open={!!submissionId} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Dettaglio Richiesta</DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <div className="py-8 text-center text-muted-foreground">
            Caricamento...
          </div>
        ) : submission ? (
          <div className="space-y-4">
            {/* Name & status */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <span className="font-semibold">
                  {submission.firstName} {submission.lastName}
                </span>
              </div>
              <div className="flex gap-2">
                {submission.isExistingClient && (
                  <Badge variant="secondary">Cliente esistente</Badge>
                )}
                <Badge variant={submission.isRead ? "outline" : "default"}>
                  {submission.isRead ? "Letto" : "Nuovo"}
                </Badge>
              </div>
            </div>

            <Separator />

            {/* Contact info */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <a
                  href={`mailto:${submission.email}`}
                  className="text-primary hover:underline"
                >
                  {submission.email}
                </a>
              </div>

              {submission.phone && (
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <a
                    href={`tel:${submission.phone}`}
                    className="text-primary hover:underline"
                  >
                    {submission.phone}
                  </a>
                </div>
              )}

              <div className="flex items-center gap-2 text-sm">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">
                  {formatDateTime(submission.createdAt)}
                </span>
              </div>
            </div>

            {/* Message */}
            {submission.message && (
              <>
                <Separator />
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm font-medium">
                    <MessageSquare className="h-4 w-4 text-muted-foreground" />
                    Messaggio
                  </div>
                  <p className="whitespace-pre-wrap rounded-lg bg-muted p-3 text-sm">
                    {submission.message}
                  </p>
                </div>
              </>
            )}

            {/* Consultant info */}
            <Separator />
            <div className="text-xs text-muted-foreground">
              Per: {submission.landingPage.consultant.firstName}{" "}
              {submission.landingPage.consultant.lastName}
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <Button asChild className="flex-1">
                <a
                  href={`mailto:${submission.email}?subject=Re: Richiesta di contatto&body=Gentile ${submission.firstName},%0D%0A%0D%0A`}
                >
                  <Mail className="mr-2 h-4 w-4" />
                  Rispondi via email
                </a>
              </Button>
              {submission.phone && (
                <Button variant="outline" asChild>
                  <a href={`tel:${submission.phone}`}>
                    <Phone className="mr-2 h-4 w-4" />
                    Chiama
                  </a>
                </Button>
              )}
            </div>
          </div>
        ) : (
          <div className="py-8 text-center text-muted-foreground">
            Richiesta non trovata
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
