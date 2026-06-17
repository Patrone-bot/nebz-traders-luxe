import { createFileRoute, Link } from "@tanstack/react-router";
import { motion, useInView, useMotionValue, useSpring, useTransform } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { ArrowRight, TrendingUp, Cpu, Zap, Star, Globe, Users, Trophy, Sparkles, Heart, ShieldCheck } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { successStories } from "@/lib/mock-data";

import heroImg from "@/assets/story/hero.jpg";
import nebzBefore from "@/assets/story/nebz-before.png";
import nebzAfter from "@/assets/story/nebz-after2.jpg";
import nyathiraBefore from "@/assets/story/nyathira-before.png";
import nyathiraAfter from "@/assets/story/nyathira-after2.jpg";
import story1 from "@/assets/story/part-one.jpg";
import story2 from "@/assets/story/story2.jpg";
import story4 from "@/assets/story/story4.jpg";
import missionImg from "@/assets/story/last-image.jpg";
import pocketOptionLogoSrc from "@/assets/pocketoption.svg";

// Journey progression — re-use existing approved imagery in a cinematic sequence
const journeyImages = [story1, story2, story4, nebzAfter, nyathiraAfter, story1];


export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "CashoutFX — From Nothing to a Trading Empire" },
      { name: "description", content: "From a school dropout and a waitress to building a trading empire. Nebz & Nyathira help ordinary people begin their journey for free." },
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
  useEffect(() => { if (inView) mv.set(value); }, [inView, mv, value]);
  return <motion.span ref={ref}>{display}</motion.span>;
}

function HomePage() {
  return (
    <div className="relative min-h-screen overflow-x-hidden">
      <Navbar />
      <Hero />
      <Stats />
      <NebzTransformation />
      <NyathiraTransformation />
      <OurStory />
      <Automation />
      <Stories />
      <Mission />
      <PartnerBand />
      <FinalCTA />
      <Footer />
    </div>
  );
}

/* ---------- Official Pocket Option partner mark ---------- */
function PocketOptionLogo({ className = "h-6 sm:h-7" }: { className?: string }) {
  return (
    <img
      src={pocketOptionLogoSrc}
      alt="Pocket Option — Official Partner"
      className={`w-auto ${className} select-none`}
      draggable={false}
    />
  );
}

function PartnerBand() {
  return (
    <section className="relative py-10 px-6">
      <div className="mx-auto max-w-5xl">
        <div className="glass rounded-2xl border border-border/60 px-6 py-6 sm:px-10 sm:py-7 flex flex-col items-center gap-4 text-center">
          <div className="flex items-center gap-3">
            <ShieldCheck className="h-3.5 w-3.5 text-gold" />
            <p className="text-[10px] sm:text-[11px] tracking-[0.45em] text-gold uppercase">Official Partner</p>
          </div>
          <PocketOptionLogo className="h-7 sm:h-9" />
          <p className="text-[10px] tracking-[0.25em] text-muted-foreground uppercase">
            Verified Broker · Since 2019
          </p>
        </div>
      </div>
    </section>
  );
}

function Hero() {
  return (
    <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-32 px-6">
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
            <span className="text-[11px] tracking-[0.3em] text-gold uppercase">A True Story · Eight Years In</span>
          </div>

          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl xl:text-7xl leading-[1.02] text-foreground">
            From School Dropout <br />
            <span className="text-muted-foreground">& Waitress —</span> <br />
            <span className="text-gradient-gold italic">to a Trading Empire.</span>
          </h1>

          <p className="mt-8 max-w-xl text-base sm:text-lg text-muted-foreground leading-relaxed">
            We started with nothing. Trading changed our lives. Today we help ordinary
            people begin their journey — for free.
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

          <div className="mt-10 flex items-center gap-3">
            <span className="text-[10px] tracking-[0.4em] text-muted-foreground uppercase">Official Partner</span>
            <span className="h-px w-6 bg-border" />
            <PocketOptionLogo className="h-5" />
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
              <div className="absolute inset-0 z-10 bg-gradient-to-t from-background via-background/40 to-transparent" />
              <div className="absolute inset-0 z-10 mix-blend-overlay bg-gradient-to-br from-gold/25 via-transparent to-gold-deep/30" />
              <div className="absolute inset-0 z-10 ring-1 ring-inset ring-gold/20" />
              <img
                src={heroImg}
                alt="Nebz and Nyathira"
                className="h-full w-full object-cover saturate-[1.05] contrast-[1.05]"
                style={{ filter: "brightness(0.85)" }}
              />
              <div className="absolute bottom-6 left-6 right-6 z-20">
                <p className="text-[10px] tracking-[0.4em] text-gold uppercase">Founders</p>
                <p className="font-display text-2xl text-foreground mt-1">Nebz &amp; Nyathira</p>
                <p className="text-xs text-muted-foreground">Forex Strategist · Mentor</p>
              </div>
              <motion.div
                initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
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
                initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
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
    { value: 365, suffix: "", label: "Free Daily Guidance", icon: Star },
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

function CinematicImage({ src, alt, tall = false, dim = "0.82" }: { src: string; alt: string; tall?: boolean; dim?: string }) {
  return (
    <div className={`relative overflow-hidden rounded-2xl glass shadow-luxury ${tall ? "aspect-[3/4]" : "aspect-[4/5]"}`}>
      <div className="absolute inset-0 z-10 bg-gradient-to-t from-background via-background/30 to-transparent" />
      <div className="absolute inset-0 z-10 mix-blend-overlay bg-gradient-to-br from-gold/20 via-transparent to-gold-deep/25" />
      <div className="absolute inset-0 z-10 ring-1 ring-inset ring-gold/15" />
      <svg className="absolute inset-0 z-[5] w-full h-full opacity-[0.08]" viewBox="0 0 400 400" preserveAspectRatio="none">
        <path d="M0,300 L60,260 L120,280 L180,200 L240,220 L300,140 L360,160 L400,80" stroke="currentColor" strokeWidth="1" fill="none" className="text-gold" />
      </svg>
      <img src={src} alt={alt} className="h-full w-full object-cover" style={{ filter: `brightness(${dim}) saturate(1.05) contrast(1.05)` }} />
    </div>
  );
}

/* ---------- Transformation card primitive ---------- */
function TransformCard({
  src, alt, label, lines, tone,
}: { src: string; alt: string; label: string; lines: string[]; tone: "before" | "after" }) {
  const accent = tone === "after" ? "text-gold" : "text-muted-foreground";
  return (
    <div className="flex flex-col">
      <CinematicImage src={src} alt={alt} tall dim={tone === "after" ? "0.9" : "0.7"} />
      <div className="mt-4 sm:mt-5">
        <p className={`text-[10px] tracking-[0.4em] uppercase ${accent}`}>{label}</p>
        <div className="mt-3 space-y-1.5">
          {lines.map((l) => (
            <p key={l} className={`text-sm sm:text-base leading-snug ${tone === "after" ? "text-foreground" : "text-muted-foreground"}`}>
              {l}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}

function ProgressionIndicator({ label }: { label: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 sm:gap-3 py-2 self-center">
      <span className="h-10 w-px sm:h-16 bg-gradient-to-b from-transparent via-gold to-gold/40" />
      <div className="glass-gold rounded-full h-7 w-7 sm:h-10 sm:w-10 flex items-center justify-center shrink-0">
        <ArrowRight className="h-3 w-3 sm:h-4 sm:w-4 text-gold" />
      </div>
      <span className="h-10 w-px sm:h-16 bg-gradient-to-b from-gold/40 via-gold to-transparent" />
      <p className="hidden sm:block mt-1 text-[10px] tracking-[0.3em] text-gold uppercase whitespace-nowrap [writing-mode:horizontal-tb]">{label}</p>
    </div>
  );
}

/* ---------- A. Nebz Transformation ---------- */
function NebzTransformation() {
  return (
    <section className="relative py-24 px-6">
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.6 }}
          className="text-center mb-14 sm:mb-16"
        >
          <p className="text-[10px] tracking-[0.4em] text-gold uppercase mb-3">The Transformation · Nebz</p>
          <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl text-foreground leading-[1.05]">
            From Doubted <span className="italic text-gradient-gold">to Decided.</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-[1fr_auto_1fr] gap-2 sm:gap-6 lg:gap-10 items-stretch">
          <TransformCard
            src={nebzBefore}
            alt="Nebz before"
            label="Before"
            tone="before"
            lines={["School dropout with $0 to his name.", "\n", "\n", "\n"]}
          />
          <ProgressionIndicator label="8 YEARS OF WORK" />
          <TransformCard
            src={nebzAfter}
            alt="Nebz after"
            label="After"
            tone="after"
            lines={["Today he proves that your past does not decide your future.", "\n", "\n", "\n"]}
          />

        </div>

        <motion.p
          initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="mt-14 text-center font-display text-2xl sm:text-3xl text-foreground italic"
        >
          &ldquo;If I did it, <span className="text-gradient-gold">you can do it too.</span>&rdquo;
        </motion.p>
      </div>
    </section>
  );
}

/* ---------- Journey ---------- */
function OurStory() {
  const stages = [
    { n: "01", title: "Less Than $100 & A Dream.", caption: "We didn’t start with mentors, capital, or any special skill. We only had less than $100, our faith in God, and the belief that with Him, anything was possible.", img: journeyImages[0] },
    { n: "02", title: "The Price Of Believing.", caption: "We took risks, trusted the wrong people, lost money to scams and fake strategies. But every setback became a lesson that pushed us closer to success.", img: journeyImages[1] },
    { n: "03", title: "From Survival To Success.", caption: "The small steps, mistakes, and lessons slowly became the foundation of a life we once only dreamed about.", img: journeyImages[2] },
    { n: "04", title: "Building Something Bigger.", caption: "We stopped chasing opportunities and started creating them. Our experience turned into systems, businesses, and solutions impacting traders worldwide.", img: journeyImages[3] },
    { n: "05", title: "Beyond What We Imagined.", caption: "What started with less than $100 grew into a multimillion dollar success story. Today our mission is helping others believe that their beginning doesn’t define their future.", img: journeyImages[4] },
    { n: "06", title: "A Mission Beyond Ourselves.", caption: "God changed our story from impossible to possible. Now our purpose is to open doors for others and prove that where you start does not determine where you can finish.", img: journeyImages[5] },

  ];
  return (
    <section id="story" className="relative py-24 px-6">
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p className="text-[10px] tracking-[0.4em] text-gold uppercase mb-3">The Journey</p>
          <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl text-foreground">
            A Journey, <span className="italic text-gradient-gold">Not a Shortcut.</span>
          </h2>
        </motion.div>

        <div className="space-y-16 sm:space-y-20 lg:space-y-28">
          {stages.map((s, i) => (
            <motion.div
              key={s.n}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.8 }}
              className={`grid lg:grid-cols-12 gap-8 sm:gap-10 items-center ${i % 2 ? "lg:[&>div:first-child]:order-2" : ""}`}
            >
              <div className="lg:col-span-6">
                <CinematicImage src={s.img} alt={s.title} />
              </div>
              <div className="lg:col-span-6">
                <p className="font-display text-7xl text-gradient-gold opacity-60 leading-none">{s.n}</p>
                <h3 className="mt-4 font-display text-3xl sm:text-4xl text-foreground">{s.title}</h3>
                <p className="mt-5 text-base sm:text-lg text-muted-foreground leading-relaxed max-w-xl">
                  &ldquo;{s.caption}&rdquo;
                </p>
                <div className="mt-6 h-px w-24 hairline-gold opacity-60" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- B. Nyathira Transformation ---------- */
function NyathiraTransformation() {
  return (
    <section className="relative py-24 px-6">
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.6 }}
          className="mb-14 max-w-3xl"
        >
          <p className="text-[10px] tracking-[0.4em] text-gold uppercase mb-3">MORE THAN A TRANSFORMATION</p>
          <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl text-foreground">
            From Waitress to <span className="italic text-gradient-gold">Inspiring Thousands.</span>
          </h2>

        </motion.div>

        <div className="grid grid-cols-[1fr_auto_1fr] gap-2 sm:gap-6 lg:gap-10 items-stretch">
          <TransformCard
            src={nyathiraBefore}
            alt="Nyathira before"
            label="Before"
            tone="before"
            lines={["Earning -200$\\month.", "\n"]}

          />
          <ProgressionIndicator label="Systems Built" />
          <TransformCard
            src={nyathiraAfter}
            alt="Nyathira after"
            label="After"
            tone="after"
            lines={["Today she proves that your beginning does not decide your future.", "\n", "\n"]}

          />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ delay: 0.15, duration: 0.7 }}
          className="mt-14 max-w-3xl mx-auto text-center"
        >
          <p className="text-base sm:text-lg text-foreground/90 leading-relaxed italic whitespace-pre-wrap">
            &ldquo;Manual trading became the hardest chapter of my journey. The sleepless nights, emotions, mistakes, and pressure almost made me walk away from everything.{"\n\n\n"}
            But instead of giving up, I turned my biggest struggle into innovation. We developed an automated trading robot built from years of experience, designed to follow our strategy with discipline and precision.{"\n\n\n"}
            What was created to solve our own biggest challenge has now become technology helping <span className="text-gradient-gold not-italic">thousands</span> of traders around the world.&rdquo;
          </p>

        </motion.div>
      </div>
    </section>
  );
}

function Automation() {
  return (
    <section className="relative py-24 px-6">
      <div className="mx-auto max-w-5xl">
        <div className="relative glass shadow-luxury rounded-3xl p-8 sm:p-16 overflow-hidden">
          <div className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-gold/10 blur-3xl" />
          <Cpu className="h-6 w-6 text-gold mb-5" />
          <p className="text-[10px] tracking-[0.4em] text-gold uppercase mb-4">THE AUTOMATION BREAKTHROUGH</p>
          <h3 className="font-display text-3xl sm:text-4xl lg:text-5xl text-foreground leading-tight max-w-3xl whitespace-pre-wrap">
            The problem every trader faces{"\n"}became the solution we created{"\n"}&nbsp; <span className="italic text-gradient-gold">turning experience into automation.</span>
          </h3>
          <p className="mt-6 max-w-2xl text-muted-foreground leading-relaxed whitespace-pre-wrap">
            We knew the struggle because we lived it. The emotions, second guessing, sleepless nights, and hours staring at charts made manual trading one of our biggest challenges.{"\n\n\n"}
            Instead of accepting that reality, we spent years turning our experience into an automated trading robot designed to follow our strategy with patience and discipline.{"\n\n\n"}
            What started as our solution is now helping traders around the world trade differently..
          </p>

          <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { i: TrendingUp, t: "Strategy" },
              { i: Cpu, t: "Automation" },
              { i: Zap, t: "Execution" },
              { i: Heart, t: "Community" },
            ].map(({ i: Icon, t }) => (
              <div key={t} className="glass-gold rounded-xl p-4 flex items-center gap-2">
                <Icon className="h-4 w-4 text-gold" />
                <span className="text-xs tracking-[0.2em] text-foreground uppercase">{t}</span>
              </div>
            ))}
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

function Mission() {
  return (
    <section className="relative py-24 px-6">
      <div className="mx-auto max-w-7xl grid lg:grid-cols-12 gap-12 items-center">
        <div className="lg:col-span-5">
          <CinematicImage src={missionImg} alt="Mission" />
        </div>
        <div className="lg:col-span-7">
          <p className="text-[10px] tracking-[0.4em] text-gold uppercase mb-3">Our Mission</p>
          <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl text-foreground leading-[1.05] whitespace-pre-wrap">
            God Changed Our Story.{"\n"}
            <span className="italic text-gradient-gold">Now We Help Others Rewrite Theirs.</span>
          </h2>
          <p className="mt-7 max-w-xl text-base sm:text-lg text-muted-foreground leading-relaxed">
            We know what it feels like to start with nothing, to fail, and to almost give up. That’s why we built this community — to share the lessons, tools, and opportunities we wish we had when we started..
          </p>

        </div>
      </div>
    </section>
  );
}

function FinalCTA() {
  return (
    <section className="relative py-24 px-6">
      <div className="mx-auto max-w-6xl">
        <div className="relative glass-gold shadow-luxury rounded-3xl p-10 sm:p-20 text-center overflow-hidden">
          <div className="absolute inset-0 -z-10">
            <div className="absolute -top-32 left-1/2 -translate-x-1/2 h-80 w-[120%] bg-gradient-gold opacity-20 blur-3xl rounded-full" />
          </div>
          <p className="text-[10px] tracking-[0.4em] text-gold uppercase mb-5">YOUR TURN</p>
          <h2 className="font-display text-4xl sm:text-6xl lg:text-7xl text-foreground leading-tight whitespace-pre-wrap">
            Every Story Has A Beginning{"\n"}&nbsp;<span className="italic text-gradient-gold">This Could Be Yours.</span>
          </h2>
          <p className="mt-6 max-w-xl mx-auto text-muted-foreground">
            We once wished someone would show us the way. Today we’re opening that door for you. Join thousands taking their first step.
          </p>

          <Link
            to="/get-started"
            className="mt-10 inline-flex items-center gap-3 rounded-full bg-gradient-gold px-10 py-4 text-sm font-semibold tracking-[0.3em] text-primary-foreground shadow-gold-glow hover:scale-[1.03] transition-transform"
          >
            BEGIN YOUR JOURNEY

            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
