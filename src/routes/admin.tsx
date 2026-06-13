import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { motion } from "motion/react";
import { Search, Filter, Shield, Users, CheckCircle2, Clock, XCircle, ArrowLeft } from "lucide-react";
import { adminUsers } from "@/lib/mock-data";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: "Admin — NEBZ" }, { name: "robots", content: "noindex" }] }),
  component: Admin,
});

const statusStyles: Record<string, string> = {
  Verified: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20",
  Pending: "text-amber-400 bg-amber-400/10 border-amber-400/20",
  Rejected: "text-rose-400 bg-rose-400/10 border-rose-400/20",
};

function Admin() {
  const [q, setQ] = useState("");
  const [status, setStatus] = useState<string>("All");

  const filtered = useMemo(() => {
    return adminUsers.filter((u) => {
      const matchQ = [u.name, u.email, u.phone].some((v) => v.toLowerCase().includes(q.toLowerCase()));
      const matchS = status === "All" || u.status === status;
      return matchQ && matchS;
    });
  }, [q, status]);

  const counts = useMemo(() => ({
    total: adminUsers.length,
    verified: adminUsers.filter((u) => u.status === "Verified").length,
    pending: adminUsers.filter((u) => u.status === "Pending").length,
    rejected: adminUsers.filter((u) => u.status === "Rejected").length,
  }), []);

  return (
    <div className="min-h-screen">
      <header className="px-6 py-6 border-b border-border/40">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link to="/" className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-gradient-gold flex items-center justify-center">
                <span className="text-primary-foreground font-display font-bold text-sm">N</span>
              </div>
              <span className="font-display tracking-[0.3em] text-gradient-gold">NEBZ</span>
            </Link>
            <span className="hidden sm:inline-flex items-center gap-2 px-3 py-1 rounded-full glass-gold text-[10px] tracking-[0.25em] text-gold uppercase">
              <Shield className="h-3 w-3" /> Admin
            </span>
          </div>
          <Link to="/" className="inline-flex items-center gap-2 text-xs tracking-[0.2em] text-muted-foreground hover:text-gold uppercase">
            <ArrowLeft className="h-3.5 w-3.5" /> Exit
          </Link>
        </div>
      </header>

      <main className="px-6 py-10 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <p className="text-[10px] tracking-[0.4em] text-gold uppercase mb-2">Operations Console</p>
          <h1 className="font-display text-4xl text-foreground">User Management</h1>
          <p className="mt-2 text-sm text-muted-foreground">Monitor onboarding, verifications and package selections.</p>
        </motion.div>

        <div className="mt-8 grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "Total Users", val: counts.total, icon: Users },
            { label: "Verified", val: counts.verified, icon: CheckCircle2 },
            { label: "Pending", val: counts.pending, icon: Clock },
            { label: "Rejected", val: counts.rejected, icon: XCircle },
          ].map((s) => {
            const Icon = s.icon;
            return (
              <div key={s.label} className="glass shadow-luxury rounded-2xl p-5">
                <div className="flex items-center justify-between">
                  <p className="text-[10px] tracking-[0.25em] text-muted-foreground uppercase">{s.label}</p>
                  <Icon className="h-4 w-4 text-gold" />
                </div>
                <p className="mt-3 font-display text-3xl text-gradient-gold">{s.val}</p>
              </div>
            );
          })}
        </div>

        <div className="mt-8 glass shadow-luxury rounded-2xl overflow-hidden">
          <div className="p-5 border-b border-border/40 flex flex-col sm:flex-row gap-3 sm:items-center justify-between">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search by name, email, phone…"
                className="w-full rounded-lg bg-input/40 border border-border/60 pl-9 pr-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50 outline-none focus:border-gold/60 focus:ring-2 focus:ring-gold/20"
              />
            </div>
            <div className="flex items-center gap-2 text-xs">
              <Filter className="h-4 w-4 text-muted-foreground" />
              {["All", "Verified", "Pending", "Rejected"].map((s) => (
                <button
                  key={s}
                  onClick={() => setStatus(s)}
                  className={`px-3 py-1.5 rounded-full border tracking-wide transition-all ${
                    status === s
                      ? "bg-gradient-gold text-primary-foreground border-transparent"
                      : "border-border/60 text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-[10px] tracking-[0.2em] text-muted-foreground uppercase bg-secondary/30">
                  <th className="px-5 py-3">Name</th>
                  <th className="px-5 py-3">Phone</th>
                  <th className="px-5 py-3">Email</th>
                  <th className="px-5 py-3">Package</th>
                  <th className="px-5 py-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((u) => (
                  <tr key={u.id} className="border-t border-border/30 hover:bg-secondary/20 transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-gradient-gold flex items-center justify-center text-primary-foreground text-xs font-semibold">
                          {u.name.split(" ").map((p) => p[0]).join("").slice(0,2)}
                        </div>
                        <span className="font-medium text-foreground">{u.name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-muted-foreground">{u.phone}</td>
                    <td className="px-5 py-4 text-muted-foreground">{u.email}</td>
                    <td className="px-5 py-4 text-foreground/85">{u.package}</td>
                    <td className="px-5 py-4">
                      <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] tracking-[0.15em] uppercase ${statusStyles[u.status]}`}>
                        {u.status}
                      </span>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-5 py-12 text-center text-muted-foreground text-sm">
                      No users match your filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
