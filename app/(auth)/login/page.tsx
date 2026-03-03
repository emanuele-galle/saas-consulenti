"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError("Credenziali non valide");
      } else {
        router.push(callbackUrl);
        router.refresh();
      }
    } catch {
      setError("Errore durante il login");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen">
      {/* Left: Brand Panel */}
      <div className="hidden flex-col justify-between bg-gradient-to-br from-[#C21D17] via-[#9B1610] to-[#6B0F0A] p-12 text-white lg:flex lg:w-1/2">
        <div>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20">
              <span className="text-xl font-bold">M</span>
            </div>
            <span className="text-xl font-bold">MediaCom</span>
          </div>
        </div>
        <div className="space-y-6">
          <h1 className="text-4xl font-bold leading-tight">
            Piattaforma Landing Page
            <br />
            Consulenti
          </h1>
          <p className="max-w-md text-lg text-white/80">
            Gestisci le landing page personalizzate dei consulenti del Gruppo
            MediaCom. Crea, pubblica e monitora le performance.
          </p>
        </div>
        <p className="text-sm text-white/50">
          &copy; {new Date().getFullYear()} MediaCom srls
        </p>
      </div>

      {/* Right: Login Form */}
      <div className="flex w-full items-center justify-center bg-white px-6 lg:w-1/2">
        <div className="w-full max-w-sm space-y-8">
          {/* Mobile logo */}
          <div className="text-center lg:hidden">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#C21D17]">
              <span className="text-xl font-bold text-white">M</span>
            </div>
            <h2 className="text-xl font-bold text-foreground">
              Saas Consulenti
            </h2>
          </div>

          <div className="hidden lg:block">
            <h2 className="text-2xl font-bold text-foreground">
              Accedi
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Inserisci le tue credenziali per accedere alla piattaforma
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
                {error}
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="email@mediacomsrls.it"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Link
                  href="/forgot-password"
                  className="text-xs text-muted-foreground hover:text-foreground hover:underline"
                >
                  Password dimenticata?
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-[#C21D17] hover:bg-[#9B1610]"
              disabled={loading}
            >
              {loading ? "Accesso in corso..." : "Accedi"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
