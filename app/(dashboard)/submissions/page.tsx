"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useTRPC } from "@/lib/trpc";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { SubmissionDetail } from "@/components/dashboard/submission-detail";
import { generateCsv, downloadCsv } from "@/lib/export-csv";
import { formatDateTime } from "@/lib/utils";
import {
  Search,
  Download,
  Mail,
  MailOpen,
  Circle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

export default function SubmissionsPage() {
  const { data: session } = useSession();
  const isAdmin =
    session?.user?.role === "ADMIN" || session?.user?.role === "SUPERADMIN";
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [isReadFilter, setIsReadFilter] = useState<boolean | undefined>(
    undefined
  );
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [detailId, setDetailId] = useState<string | null>(null);

  const { data, isLoading } = useQuery(
    trpc.submissions.list.queryOptions({
      page,
      limit: 20,
      search: search || undefined,
      isRead: isReadFilter,
    })
  );

  const markAsReadMutation = useMutation(
    trpc.submissions.markAsRead.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: trpc.submissions.list.queryKey(),
        });
        setSelectedIds(new Set());
      },
    })
  );

  const markAsUnreadMutation = useMutation(
    trpc.submissions.markAsUnread.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: trpc.submissions.list.queryKey(),
        });
        setSelectedIds(new Set());
      },
    })
  );

  const { refetch: fetchExport } = useQuery({
    ...trpc.submissions.exportData.queryOptions({
      isRead: isReadFilter,
    }),
    enabled: false,
  });

  const handleSearch = () => {
    setSearch(searchInput);
    setPage(1);
  };

  const handleExport = async () => {
    const result = await fetchExport();
    if (!result.data) return;
    const csv = generateCsv(
      result.data.map((s) => ({
        data: formatDateTime(s.createdAt),
        nome: s.firstName,
        cognome: s.lastName,
        email: s.email,
        telefono: s.phone ?? "",
        messaggio: s.message ?? "",
        cliente_esistente: s.isExistingClient ? "Si" : "No",
        consulente: `${s.landingPage.consultant.firstName} ${s.landingPage.consultant.lastName}`,
        letto: s.isRead ? "Si" : "No",
      })),
      [
        { key: "data", label: "Data" },
        { key: "nome", label: "Nome" },
        { key: "cognome", label: "Cognome" },
        { key: "email", label: "Email" },
        { key: "telefono", label: "Telefono" },
        { key: "messaggio", label: "Messaggio" },
        { key: "cliente_esistente", label: "Cliente Esistente" },
        { key: "consulente", label: "Consulente" },
        { key: "letto", label: "Letto" },
      ]
    );
    downloadCsv(csv, `richieste-contatto-${new Date().toISOString().split("T")[0]}.csv`);
  };

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleSelectAll = () => {
    if (!data?.submissions) return;
    if (selectedIds.size === data.submissions.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(data.submissions.map((s) => s.id)));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Richieste di Contatto
          </h1>
          <p className="text-muted-foreground">
            Form compilati dai visitatori delle landing page
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={handleExport}>
          <Download className="mr-2 h-4 w-4" />
          Esporta CSV
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex flex-1 items-center gap-2">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Cerca per nome, email, messaggio..."
                  className="pl-9"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                />
              </div>
              <Button variant="outline" size="sm" onClick={handleSearch}>
                Cerca
              </Button>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant={isReadFilter === undefined ? "default" : "outline"}
                size="sm"
                onClick={() => {
                  setIsReadFilter(undefined);
                  setPage(1);
                }}
              >
                Tutti
              </Button>
              <Button
                variant={isReadFilter === false ? "default" : "outline"}
                size="sm"
                onClick={() => {
                  setIsReadFilter(false);
                  setPage(1);
                }}
              >
                <Circle className="mr-1 h-2 w-2 fill-current" />
                Non letti
              </Button>
              <Button
                variant={isReadFilter === true ? "default" : "outline"}
                size="sm"
                onClick={() => {
                  setIsReadFilter(true);
                  setPage(1);
                }}
              >
                Letti
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          {/* Bulk actions */}
          {selectedIds.size > 0 && (
            <div className="mb-3 flex items-center gap-2 rounded-lg bg-muted p-2">
              <span className="text-sm font-medium">
                {selectedIds.size} selezionati
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() =>
                  markAsReadMutation.mutate({
                    ids: Array.from(selectedIds),
                  })
                }
              >
                <MailOpen className="mr-1 h-3 w-3" />
                Segna come letto
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() =>
                  markAsUnreadMutation.mutate({
                    ids: Array.from(selectedIds),
                  })
                }
              >
                <Mail className="mr-1 h-3 w-3" />
                Segna come non letto
              </Button>
            </div>
          )}

          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <p className="text-muted-foreground">Caricamento...</p>
            </div>
          ) : data?.submissions.length === 0 ? (
            <div className="flex items-center justify-center py-12">
              <p className="text-muted-foreground">
                Nessuna richiesta trovata
              </p>
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-10">
                      <Checkbox
                        checked={
                          data?.submissions &&
                          selectedIds.size === data.submissions.length &&
                          data.submissions.length > 0
                        }
                        onCheckedChange={toggleSelectAll}
                      />
                    </TableHead>
                    <TableHead className="w-8"></TableHead>
                    <TableHead>Data</TableHead>
                    <TableHead>Nome</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead className="hidden md:table-cell">
                      Messaggio
                    </TableHead>
                    {isAdmin && <TableHead>Consulente</TableHead>}
                    <TableHead>Stato</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data?.submissions.map((sub) => (
                    <TableRow
                      key={sub.id}
                      className="cursor-pointer hover:bg-muted/50"
                      onClick={() => setDetailId(sub.id)}
                    >
                      <TableCell onClick={(e) => e.stopPropagation()}>
                        <Checkbox
                          checked={selectedIds.has(sub.id)}
                          onCheckedChange={() => toggleSelect(sub.id)}
                        />
                      </TableCell>
                      <TableCell>
                        {!sub.isRead && (
                          <Circle className="h-2 w-2 fill-primary text-primary" />
                        )}
                      </TableCell>
                      <TableCell className="text-sm whitespace-nowrap">
                        {formatDateTime(sub.createdAt)}
                      </TableCell>
                      <TableCell
                        className={
                          sub.isRead ? "text-muted-foreground" : "font-semibold"
                        }
                      >
                        {sub.firstName} {sub.lastName}
                      </TableCell>
                      <TableCell className="text-sm">{sub.email}</TableCell>
                      <TableCell className="hidden max-w-[200px] truncate md:table-cell text-sm text-muted-foreground">
                        {sub.message || "-"}
                      </TableCell>
                      {isAdmin && (
                        <TableCell className="text-sm">
                          {sub.landingPage.consultant.firstName}{" "}
                          {sub.landingPage.consultant.lastName}
                        </TableCell>
                      )}
                      <TableCell>
                        <Badge
                          variant={sub.isRead ? "outline" : "default"}
                          className="text-[10px]"
                        >
                          {sub.isRead ? "Letto" : "Nuovo"}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {data && data.pages > 1 && (
                <div className="flex items-center justify-between border-t pt-4 mt-4">
                  <p className="text-sm text-muted-foreground">
                    Pagina {page} di {data.pages} ({data.total} totali)
                  </p>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={page <= 1}
                      onClick={() => setPage((p) => p - 1)}
                    >
                      <ChevronLeft className="h-4 w-4" />
                      Precedente
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={page >= data.pages}
                      onClick={() => setPage((p) => p + 1)}
                    >
                      Successiva
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Detail dialog */}
      <SubmissionDetail
        submissionId={detailId}
        onClose={() => setDetailId(null)}
      />
    </div>
  );
}
