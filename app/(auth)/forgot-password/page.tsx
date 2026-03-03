"use client";

import { useState } from "react";
import Link from "next/link";
import { useTRPC } from "@/lib/trpc";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Mail } from "lucide-react";

export default function ForgotPasswordPage() {
  const trpc = useTRPC();
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  const resetMutation = useMutation(
    trpc.users.requestReset.mutationOptions({
      onSuccess: () => setSent(true),
      onError: () => setSent(true), // Don't reveal if email exists
    })
  );

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    resetMutation.mutate({ email });
  }

  if (sent) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4">
        <div className="w-full max-w-sm space-y-6 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
            <Mail className="h-6 w-6 text-green-600" />
          </div>
          <h1 className="text-xl font-bold">Controlla la tua email</h1>
          <p className="text-sm text-muted-foreground">
            Se l&apos;indirizzo <strong>{email}</strong> e&apos; associato a un account,
            riceverai un link per reimpostare la password.
          </p>
          <Link href="/login">
            <Button variant="outline" className="mt-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Torna al login
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#C21D17]">
            <span className="text-xl font-bold text-white">G</span>
          </div>
          <h1 className="text-2xl font-bold">Password dimenticata?</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Inserisci la tua email per ricevere il link di reset.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="email@mediacomsrls.it"
              required
            />
          </div>
          <Button
            type="submit"
            className="w-full bg-[#C21D17] hover:bg-[#9B1610]"
            disabled={resetMutation.isPending}
          >
            {resetMutation.isPending ? "Invio in corso..." : "Invia link di reset"}
          </Button>
        </form>

        <div className="text-center">
          <Link href="/login" className="text-sm text-muted-foreground hover:underline">
            <ArrowLeft className="mr-1 inline h-3 w-3" />
            Torna al login
          </Link>
        </div>
      </div>
    </div>
  );
}
