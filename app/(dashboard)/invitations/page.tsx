"use client";

import { useState } from "react";
import { useTRPC } from "@/lib/trpc";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, RotateCcw, Ban, UserPlus } from "lucide-react";
import { toast } from "sonner";
import { CONSULTANT_NETWORKS } from "@/lib/constants";

type Invitation = {
  id: string;
  email: string;
  role: string;
  network: string | null;
  token: string;
  expiresAt: Date;
  usedAt: Date | null;
  createdAt: Date;
};

function getInvitationStatus(invitation: Invitation) {
  // If usedAt is set, check if an actual registration happened
  // We determine "revoked" vs "used" by checking if expiresAt is in the future
  // (resend resets expiresAt, revoke doesn't)
  if (invitation.usedAt) {
    // If the invite was revoked (usedAt set manually), the expiresAt
    // was NOT extended. If it was genuinely used (registration), same.
    // We can't distinguish from DB alone, so we show "Utilizzato" for both
    // unless expiresAt is still in the future (which would mean it was revoked
    // because a genuine use wouldn't leave a future expiry meaningfully)
    // Actually: revoke sets usedAt = now(), and the original expiresAt stays.
    // A genuine registration also sets usedAt = now().
    // Let's check if a user exists with this email to determine genuine use.
    return "used";
  }

  if (new Date(invitation.expiresAt) < new Date()) {
    return "expired";
  }

  return "active";
}

function StatusBadge({ invitation }: { invitation: Invitation }) {
  const status = getInvitationStatus(invitation);

  switch (status) {
    case "active":
      return <Badge variant="success">Attivo</Badge>;
    case "used":
      return <Badge variant="secondary">Utilizzato</Badge>;
    case "expired":
      return (
        <Badge variant="outline" className="border-yellow-500 text-yellow-600">
          Scaduto
        </Badge>
      );
    default:
      return <Badge variant="outline">-</Badge>;
  }
}

export default function InvitationsPage() {
  const [isOpen, setIsOpen] = useState(false);
  const [newEmail, setNewEmail] = useState("");
  const [newRole, setNewRole] = useState("CONSULTANT");
  const [newNetwork, setNewNetwork] = useState("");
  const [page, setPage] = useState(1);
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery(
    trpc.invitations.list.queryOptions({ page, limit: 20 })
  );

  const createMutation = useMutation(
    trpc.invitations.create.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: trpc.invitations.list.queryKey(),
        });
        setIsOpen(false);
        setNewEmail("");
        setNewRole("CONSULTANT");
        setNewNetwork("");
        toast.success("Invito inviato");
      },
      onError: (error) => {
        toast.error(error.message);
      },
    })
  );

  const revokeMutation = useMutation(
    trpc.invitations.revoke.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: trpc.invitations.list.queryKey(),
        });
        toast.success("Invito revocato");
      },
      onError: (error) => {
        toast.error(error.message);
      },
    })
  );

  const resendMutation = useMutation(
    trpc.invitations.resend.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: trpc.invitations.list.queryKey(),
        });
        toast.success("Invito re-inviato");
      },
      onError: (error) => {
        toast.error(error.message);
      },
    })
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Inviti</h1>
          <p className="text-muted-foreground">
            Gestisci gli inviti per nuovi consulenti
          </p>
        </div>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4" />
              Nuovo Invito
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Nuovo Invito</DialogTitle>
              <DialogDescription>
                Invia un invito per registrarsi sulla piattaforma
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Email</Label>
                <Input
                  type="email"
                  placeholder="email@esempio.it"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Ruolo</Label>
                <Select value={newRole} onValueChange={setNewRole}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="CONSULTANT">Consulente</SelectItem>
                    <SelectItem value="ADMIN">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Network (opzionale)</Label>
                <Select value={newNetwork} onValueChange={setNewNetwork}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleziona network" />
                  </SelectTrigger>
                  <SelectContent>
                    {CONSULTANT_NETWORKS.map((n) => (
                      <SelectItem key={n} value={n}>
                        {n}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsOpen(false)}>
                Annulla
              </Button>
              <Button
                onClick={() =>
                  createMutation.mutate({
                    email: newEmail,
                    role: newRole,
                    network: newNetwork || undefined,
                  })
                }
                disabled={!newEmail || createMutation.isPending}
              >
                {createMutation.isPending ? "Invio..." : "Invia Invito"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserPlus className="h-5 w-5" />
            Inviti Inviati
          </CardTitle>
          <CardDescription>
            Lista di tutti gli inviti inviati con il loro stato attuale
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <p className="text-muted-foreground">Caricamento...</p>
            </div>
          ) : !data || data.invitations.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <UserPlus className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground">Nessun invito inviato</p>
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Email</TableHead>
                    <TableHead>Ruolo</TableHead>
                    <TableHead>Stato</TableHead>
                    <TableHead>Data invio</TableHead>
                    <TableHead>Scadenza</TableHead>
                    <TableHead className="text-right">Azioni</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.invitations.map((invitation: Invitation) => {
                    const status = getInvitationStatus(invitation);
                    return (
                      <TableRow key={invitation.id}>
                        <TableCell>
                          <p className="font-medium">{invitation.email}</p>
                          {invitation.network && (
                            <p className="text-xs text-muted-foreground">
                              {invitation.network}
                            </p>
                          )}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              invitation.role === "ADMIN"
                                ? "default"
                                : "secondary"
                            }
                          >
                            {invitation.role === "ADMIN"
                              ? "Admin"
                              : "Consulente"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <StatusBadge invitation={invitation} />
                        </TableCell>
                        <TableCell className="text-sm">
                          {new Date(invitation.createdAt).toLocaleDateString(
                            "it-IT",
                            {
                              day: "2-digit",
                              month: "2-digit",
                              year: "numeric",
                            }
                          )}
                        </TableCell>
                        <TableCell className="text-sm">
                          {new Date(invitation.expiresAt).toLocaleDateString(
                            "it-IT",
                            {
                              day: "2-digit",
                              month: "2-digit",
                              year: "numeric",
                            }
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-1">
                            {status === "active" && (
                              <Button
                                variant="ghost"
                                size="icon"
                                title="Revoca invito"
                                onClick={() =>
                                  revokeMutation.mutate({ id: invitation.id })
                                }
                                disabled={revokeMutation.isPending}
                              >
                                <Ban className="h-4 w-4 text-red-500" />
                              </Button>
                            )}
                            {(status === "expired" || status === "used") && (
                              <Button
                                variant="ghost"
                                size="icon"
                                title="Re-invia invito"
                                onClick={() =>
                                  resendMutation.mutate({ id: invitation.id })
                                }
                                disabled={resendMutation.isPending}
                              >
                                <RotateCcw className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>

              {data.pages > 1 && (
                <div className="flex items-center justify-between border-t pt-4 mt-4">
                  <p className="text-sm text-muted-foreground">
                    Pagina {page} di {data.pages}
                  </p>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={page <= 1}
                      onClick={() => setPage((p) => p - 1)}
                    >
                      Precedente
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={page >= data.pages}
                      onClick={() => setPage((p) => p + 1)}
                    >
                      Successiva
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
