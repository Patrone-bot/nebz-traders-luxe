import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion } from "motion/react";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? "py-3" : "py-5"
      }`}
    >
      <div className={`mx-auto max-w-7xl px-6 transition-all duration-500`}>
        <div
          className={`flex items-center justify-between rounded-full px-4 sm:px-6 py-3 transition-all duration-500 ${
            scrolled ? "glass shadow-luxury" : "border border-transparent"
          }`}
        >
          <Link to="/" className="flex items-center gap-2 group">
            <div className="h-8 w-8 rounded-full bg-gradient-gold flex items-center justify-center shadow-gold-glow">
              <span className="text-primary-foreground font-display font-bold text-sm">CFX</span>
            </div>
            <span className="text-lg sm:text-xl font-display font-semibold tracking-[0.25em] text-gradient-gold">
              CashoutFX

            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-8 text-sm tracking-wide text-muted-foreground">
            <Link to="/" className="hover:text-gold transition-colors" activeProps={{ className: "text-gold" }} activeOptions={{ exact: true }}>Home</Link>
            <a href="/#journey" className="hover:text-gold transition-colors">Journey</a>
            <a href="/#stories" className="hover:text-gold transition-colors">Community</a>
            <Link to="/login" className="hover:text-gold transition-colors">Login</Link>
          </nav>

          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="hidden sm:inline-flex text-xs sm:text-sm tracking-widest text-muted-foreground hover:text-gold transition-colors"
            >
              LOGIN
            </Link>
            <Link
              to="/get-started"
              className="inline-flex items-center gap-2 rounded-full bg-gradient-gold px-4 sm:px-5 py-2 text-xs sm:text-sm font-semibold tracking-widest text-primary-foreground shadow-gold-glow hover:scale-[1.03] transition-transform"
            >
              GET STARTED
            </Link>
          </div>
        </div>
      </div>
    </motion.header>
  );
}
