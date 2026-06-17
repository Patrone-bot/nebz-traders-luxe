import { Loader2 } from "lucide-react";

export function AuthSessionLoader() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6">
      <div className="text-center">
        <div className="relative mx-auto h-12 w-12">
          <div className="absolute inset-0 rounded-full bg-gold/10 blur-md" />
          <Loader2 className="relative h-12 w-12 text-gold animate-spin" />
        </div>
        <p className="mt-6 text-xs tracking-[0.25em] text-muted-foreground uppercase">
          Checking your session...
        </p>
      </div>
    </div>
  );
}
