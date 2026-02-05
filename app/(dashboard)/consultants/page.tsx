"use client";

import { useState } from "react";
import Link from "next/link";
import { useTRPC } from "@/lib/trpc";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Plus, Search, ExternalLink, Edit, Eye, Trash2 } from "lucide-react";
import { toast } from "sonner";

export default function ConsultantsPage() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery(
    trpc.consultants.list.queryOptions({
      search: search || undefined,
      page,
      limit: 20,
    })
  );

  const deleteMutation = useMutation(
    trpc.consultants.delete.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: trpc.consultants.list.queryKey(),
        });
        setDeleteId(null);
        toast.success("Consulente eliminato");
      },
      onError: (error) => {
        toast.error(error.message);
      },
    })
  );

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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Consulenti</h1>
          <p className="text-muted-foreground">
            Gestisci i consulenti e le loro landing page
          </p>
        </div>
        <Link href="/consultants/new">
          <Button>
            <Plus className="h-4 w-4" />
            Nuovo Consulente
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Cerca per nome, email, citta..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                className="pl-10"
              />
            </div>
            {data && (
              <p className="text-sm text-muted-foreground">
                {data.total} consulenti totali
              </p>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <p className="text-muted-foreground">Caricamento...</p>
            </div>
          ) : data?.consultants.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <p className="text-muted-foreground">Nessun consulente trovato</p>
              <Link href="/consultants/new" className="mt-4">
                <Button variant="outline">
                  <Plus className="h-4 w-4" />
                  Aggiungi il primo consulente
                </Button>
              </Link>
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>Ruolo</TableHead>
                    <TableHead>Citta</TableHead>
                    <TableHead>Landing Page</TableHead>
                    <TableHead>Visite</TableHead>
                    <TableHead className="text-right">Azioni</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data?.consultants.map((consultant) => (
                    <TableRow key={consultant.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">
                            {consultant.title ? `${consultant.title} ` : ""}
                            {consultant.firstName} {consultant.lastName}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {consultant.email}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          {roleBadge(consultant.user.role)}
                          {consultant.network && (
                            <p className="text-xs text-muted-foreground mt-1">
                              {consultant.network}
                            </p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        {consultant.city
                          ? `${consultant.city} (${consultant.province})`
                          : "-"}
                      </TableCell>
                      <TableCell>
                        {consultant.landingPage ? (
                          <Badge
                            variant={
                              consultant.landingPage.status === "PUBLISHED"
                                ? "success"
                                : "secondary"
                            }
                          >
                            {consultant.landingPage.status === "PUBLISHED"
                              ? "Pubblicata"
                              : consultant.landingPage.status === "DRAFT"
                                ? "Bozza"
                                : "Archiviata"}
                          </Badge>
                        ) : (
                          <Badge variant="outline">Non creata</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        {consultant.landingPage?.views ?? 0}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          {consultant.landingPage && (
                            <>
                              <Link
                                href={`/editor/${consultant.landingPage.id}`}
                              >
                                <Button variant="ghost" size="icon" title="Editor">
                                  <Edit className="h-4 w-4" />
                                </Button>
                              </Link>
                              <Link
                                href={`/${consultant.landingPage.slug}`}
                                target="_blank"
                              >
                                <Button variant="ghost" size="icon" title="Anteprima">
                                  <ExternalLink className="h-4 w-4" />
                                </Button>
                              </Link>
                            </>
                          )}
                          <Link href={`/consultants/${consultant.id}/edit`}>
                            <Button variant="ghost" size="icon" title="Dettaglio">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </Link>
                          <Button
                            variant="ghost"
                            size="icon"
                            title="Elimina"
                            onClick={() => setDeleteId(consultant.id)}
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {data && data.pages > 1 && (
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

      <AlertDialog
        open={!!deleteId}
        onOpenChange={(open) => {
          if (!open) setDeleteId(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Conferma eliminazione</AlertDialogTitle>
            <AlertDialogDescription>
              Sei sicuro di voler eliminare questo consulente? Questa azione
              eliminera anche il suo account utente, la landing page e tutti i
              dati associati. L&apos;operazione non e reversibile.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annulla</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => {
                if (deleteId) {
                  deleteMutation.mutate({ id: deleteId });
                }
              }}
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
