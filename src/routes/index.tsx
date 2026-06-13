import { createFileRoute, Link } from "@tanstack/react-router";
import { motion, useInView, useMotionValue, useSpring, useTransform } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { ArrowRight, TrendingUp, Cpu, Zap, Star, Globe, Users, Trophy, Sparkles } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { successStories } from "@/lib/mock-data";
import nebzHero from "@/assets/nebz-hero.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "NEBZ — The Evolution of Trading Excellence" },
      { name: "description", content: "Join Nebz, world-class forex trader, and 20,000+ traders mastering the markets with discipline and consistency." },
      { property: "og:title", content: "NEBZ — The Evolution of Trading Excellence" },
      { property: "og:description", content: "Eight years of experience. Twenty thousand strong. One movement." },
    ],
  }),
  component: HomePage,
});

function AnimatedCounter({ value, suffix = "", duration = 2 }: { value: number; suffix?: string; duration?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });
  const mv = useMotionValue(0);
  const sv = useSpring(mv, { duration: duration * 1000, bounce: 0 });
  const display = useTransform(sv, (v) => Math.floor(v).toLocaleString() + suffix);

  useEffect(() => {
    if (inView) mv.set(value);
  }, [inView, mv, value]);

  return <motion.span ref={ref}>{display}</motion.span>;
}

function HomePage() {
  return (
    <div className="relative min-h-screen overflow-x-hidden">
      <Navbar />
      <Hero />
      <Stats />
      <Journey />
      <Stories />
      <FinalCTA />
      <Footer />
    </div>
  );
}

function Hero() {
  return (
    <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-32 px-6">
      {/* Background ambience */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-1/4 -left-32 h-96 w-96 rounded-full bg-gold/10 blur-[120px]" />
        <div className="absolute bottom-0 right-0 h-[500px] w-[500px] rounded-full bg-gold-deep/10 blur-[140px]" />
      </div>

      <div className="mx-auto max-w-7xl grid lg:grid-cols-12 gap-12 items-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="lg:col-span-7 order-2 lg:order-1"
        >
          <div className="inline-flex items-center gap-2 glass-gold rounded-full px-4 py-1.5 mb-8">
            <Sparkles className="h-3.5 w-3.5 text-gold" />
            <span className="text-[11px] tracking-[0.3em] text-gold uppercase">Est. 2017 · Eight Years Strong</span>
          </div>

          <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl xl:text-8xl leading-[1.02] text-foreground">
            The Evolution of <br />
            <span className="text-gradient-gold italic">Trading Excellence.</span>
          </h1>

          <p className="mt-8 max-w-xl text-base sm:text-lg text-muted-foreground leading-relaxed">
            Eight years of experience navigating the markets through discipline, innovation,
            and consistency. Join an exclusive movement of traders shaped by precision.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row gap-4">
            <Link
              to="/get-started"
              className="group inline-flex items-center justify-center gap-3 rounded-full bg-gradient-gold px-8 py-4 text-sm font-semibold tracking-[0.25em] text-primary-foreground shadow-gold-glow hover:scale-[1.02] transition-transform"
            >
              GET STARTED
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              to="/login"
              className="inline-flex items-center justify-center gap-2 rounded-full glass border border-border/70 px-8 py-4 text-sm font-semibold tracking-[0.25em] text-foreground hover:border-gold/60 transition-colors"
            >
              LOGIN
            </Link>
          </div>

          <div className="mt-12 flex items-center gap-6">
            <div className="flex -space-x-2">
              {[1,2,3,4].map((i) => (
                <div key={i} className="h-8 w-8 rounded-full border-2 border-background bg-gradient-to-br from-gold via-gold-deep to-charcoal" />
              ))}
            </div>
            <div>
              <div className="flex items-center gap-0.5 text-gold">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-3.5 w-3.5 fill-current" />
                ))}
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">Trusted by 20,000+ traders globally</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: "easeOut", delay: 0.1 }}
          className="lg:col-span-5 order-1 lg:order-2 relative"
        >
          <div className="relative aspect-[3/4] max-w-md mx-auto">
            <div className="absolute -inset-4 bg-gradient-gold opacity-20 blur-3xl rounded-full" />
            <div className="relative h-full rounded-3xl overflow-hidden glass shadow-luxury">
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/10 to-transparent z-10" />
              <img
                src={nebzHero}
                alt="Nebz — Forex trader and mentor"
                width={1080}
                height={1440}
                className="h-full w-full object-cover"
              />
              <div className="absolute bottom-6 left-6 right-6 z-20">
                <p className="text-[10px] tracking-[0.4em] text-gold uppercase">Founder</p>
                <p className="font-display text-2xl text-foreground mt-1">Nebz</p>
                <p className="text-xs text-muted-foreground">Forex Strategist · Mentor</p>
              </div>
              {/* Floating stat card */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6, duration: 0.7 }}
                className="absolute -left-6 top-12 z-20 glass shadow-luxury rounded-xl px-4 py-3 hidden sm:block"
              >
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-gold" />
                  <div>
                    <p className="text-[9px] tracking-[0.25em] text-muted-foreground uppercase">Today</p>
                    <p className="text-sm font-semibold text-foreground">+$12,480.50</p>
                  </div>
                </div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8, duration: 0.7 }}
                className="absolute -right-6 bottom-32 z-20 glass-gold shadow-luxury rounded-xl px-4 py-3 hidden sm:block"
              >
                <p className="text-[9px] tracking-[0.25em] text-gold uppercase">Win Rate</p>
                <p className="text-sm font-semibold text-foreground">92.4%</p>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function Stats() {
  const items = [
    { value: 8, suffix: "+", label: "Years Experience", icon: Trophy },
    { value: 20000, suffix: "+", label: "Community Members", icon: Users },
    { value: 100, suffix: "+", label: "Countries Reached", icon: Globe },
    { value: 5000, suffix: "+", label: "Success Stories", icon: Star },
  ];

  return (
    <section className="relative py-20 px-6">
      <div className="absolute inset-x-0 top-0 h-px hairline-gold opacity-40" />
      <div className="mx-auto max-w-7xl grid grid-cols-2 lg:grid-cols-4 gap-5">
        {items.map((it, i) => {
          const Icon = it.icon;
          return (
            <motion.div
              key={it.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: i * 0.08, duration: 0.5 }}
              className="group glass shadow-luxury rounded-2xl p-6 sm:p-8 relative overflow-hidden hover:border-gold/40 transition-all"
            >
              <div className="absolute -top-12 -right-12 h-28 w-28 rounded-full bg-gold/5 group-hover:bg-gold/10 transition-colors blur-2xl" />
              <Icon className="h-5 w-5 text-gold mb-4" />
              <p className="font-display text-4xl sm:text-5xl text-gradient-gold">
                <AnimatedCounter value={it.value} suffix={it.suffix} />
              </p>
              <p className="mt-2 text-xs sm:text-sm tracking-[0.15em] text-muted-foreground uppercase">{it.label}</p>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}

function Journey() {
  const steps = [
    { title: "Manual Trading", desc: "The foundation. Years of chart-by-chart precision and learning the language of price action.", icon: TrendingUp, year: "2017" },
    { title: "Automated Trading", desc: "Codified discipline. Algorithms that execute the rules emotion cannot keep.", icon: Cpu, year: "2021" },
    { title: "Binary Trading", desc: "Refined edge. High-conviction setups delivered with surgical timing.", icon: Zap, year: "2024" },
  ];

  return (
    <section id="journey" className="relative py-24 px-6">
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p className="text-[10px] tracking-[0.4em] text-gold uppercase mb-3">The Journey</p>
          <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl text-foreground">
            An Evolution, Not <span className="italic text-gradient-gold">a Shortcut.</span>
          </h2>
          <p className="mt-5 max-w-2xl mx-auto text-muted-foreground">
            Three deliberate eras shaped a trader the markets respect.
          </p>
        </motion.div>

        <div className="relative">
          {/* connecting line */}
          <div className="hidden lg:block absolute top-20 left-[12%] right-[12%] h-px bg-gradient-to-r from-transparent via-gold/40 to-transparent" />

          <div className="grid lg:grid-cols-3 gap-6 lg:gap-10">
            {steps.map((s, i) => {
              const Icon = s.icon;
              return (
                <motion.div
                  key={s.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ delay: i * 0.15, duration: 0.6 }}
                  className="relative"
                >
                  <div className="glass shadow-luxury rounded-2xl p-8 h-full hover:border-gold/40 transition-all group">
                    <div className="flex items-center justify-between mb-6">
                      <div className="h-14 w-14 rounded-2xl glass-gold flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Icon className="h-6 w-6 text-gold" />
                      </div>
                      <span className="font-display text-3xl text-gradient-gold opacity-60">{s.year}</span>
                    </div>
                    <div className="text-[10px] tracking-[0.3em] text-muted-foreground uppercase">Phase 0{i+1}</div>
                    <h3 className="font-display text-2xl text-foreground mt-2">{s.title}</h3>
                    <p className="mt-4 text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

function Stories() {
  const [feed, setFeed] = useState(successStories);
  useEffect(() => {
    const t = setInterval(() => {
      setFeed((prev) => {
        const next = [...prev];
        const first = next.shift();
        if (first) next.push({ ...first, time: "just now" });
        return next;
      });
    }, 4000);
    return () => clearInterval(t);
  }, []);

  return (
    <section id="stories" className="relative py-24 px-6">
      <div className="mx-auto max-w-7xl">
        <div className="flex items-end justify-between flex-wrap gap-6 mb-12">
          <div>
            <p className="text-[10px] tracking-[0.4em] text-gold uppercase mb-3">Live Community Feed</p>
            <h2 className="font-display text-4xl sm:text-5xl text-foreground">
              Real Wins. <span className="italic text-gradient-gold">Real Members.</span>
            </h2>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full rounded-full bg-gold opacity-75 animate-ping" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-gold" />
            </span>
            LIVE · Updating now
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {feed.slice(0, 9).map((s, i) => (
            <motion.div
              key={s.name + s.time + i}
              layout
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: (i % 3) * 0.05 }}
              className="glass shadow-luxury rounded-2xl p-6 hover:border-gold/40 transition-all"
            >
              <div className="flex items-start gap-3">
                <div className="h-11 w-11 rounded-full bg-gradient-gold flex items-center justify-center text-primary-foreground font-semibold text-sm shrink-0">
                  {s.name.split(" ").map(p => p[0]).join("")}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-semibold text-foreground truncate">{s.name}</p>
                    <p className="text-[10px] text-muted-foreground shrink-0">{s.time}</p>
                  </div>
                  <p className="text-[11px] text-muted-foreground">{s.location}</p>
                  <div className="flex items-center gap-0.5 mt-2 text-gold">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className="h-3 w-3 fill-current" />
                    ))}
                  </div>
                  <p className="mt-3 text-sm text-foreground/85 leading-relaxed">{s.text}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FinalCTA() {
  return (
    <section className="relative py-24 px-6">
      <div className="mx-auto max-w-6xl">
        <div className="relative glass-gold shadow-luxury rounded-3xl p-12 sm:p-20 text-center overflow-hidden">
          <div className="absolute inset-0 -z-10">
            <div className="absolute -top-32 left-1/2 -translate-x-1/2 h-80 w-[120%] bg-gradient-gold opacity-20 blur-3xl rounded-full" />
          </div>
          <p className="text-[10px] tracking-[0.4em] text-gold uppercase mb-5">Your Move</p>
          <h2 className="font-display text-5xl sm:text-6xl lg:text-7xl text-foreground leading-tight">
            Start Your Journey <span className="italic text-gradient-gold">Today.</span>
          </h2>
          <p className="mt-6 max-w-xl mx-auto text-muted-foreground">
            The markets reward those who show up prepared. Join 20,000+ members who chose precision over chance.
          </p>
          <Link
            to="/get-started"
            className="mt-10 inline-flex items-center gap-3 rounded-full bg-gradient-gold px-10 py-4 text-sm font-semibold tracking-[0.3em] text-primary-foreground shadow-gold-glow hover:scale-[1.03] transition-transform"
          >
            GET STARTED
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
