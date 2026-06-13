import { Link } from "@tanstack/react-router";

export function Footer() {
  return (
    <footer className="relative border-t border-border/50 mt-24">
      <div className="absolute inset-x-0 top-0 h-px hairline-gold" />
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid gap-10 md:grid-cols-4">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2">
              <div className="h-9 w-9 rounded-full bg-gradient-gold flex items-center justify-center">
                <span className="text-primary-foreground font-display font-bold">N</span>
              </div>
              <span className="font-display text-xl tracking-[0.3em] text-gradient-gold">NEBZ</span>
            </div>
            <p className="mt-5 max-w-md text-sm text-muted-foreground leading-relaxed">
              The Evolution of Trading Excellence. Eight years of mastering the markets through
              discipline, innovation, and consistency.
            </p>
          </div>
          <div>
            <h4 className="text-xs tracking-[0.25em] text-gold uppercase">Explore</h4>
            <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
              <li><Link to="/" className="hover:text-foreground transition">Home</Link></li>
              <li><Link to="/get-started" className="hover:text-foreground transition">Get Started</Link></li>
              <li><Link to="/login" className="hover:text-foreground transition">Login</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-xs tracking-[0.25em] text-gold uppercase">Reach</h4>
            <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
              <li>Nairobi · Lagos · Dubai</li>
              <li>contact@nebz.trade</li>
              <li>Mon–Sun · 24/7 Support</li>
            </ul>
          </div>
        </div>
        <div className="mt-14 pt-8 border-t border-border/40 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} Nebz Trading. All rights reserved.</p>
          <p className="tracking-wider">Trading involves risk. Past performance is not indicative of future results.</p>
        </div>
      </div>
    </footer>
  );
}
