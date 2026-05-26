import Icon from "@/components/ui/icon";

const Index = () => {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">

      {/* NAV */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-5 border-b border-border bg-background/90 backdrop-blur-sm">
        <span className="font-syne font-extrabold text-lg tracking-tight text-foreground">
          play<span className="text-primary">tester</span>
        </span>
        <button className="font-inter text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
          Sign in
        </button>
      </nav>

      {/* HERO */}
      <section className="pt-40 pb-32 px-8 max-w-5xl mx-auto">
        <div className="animate-fade-in animate-delay-1">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-primary/30 bg-primary/5 mb-10">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            <span className="font-inter text-xs text-primary font-medium tracking-wide">
              Beta — early access open
            </span>
          </div>
        </div>

        <h1 className="font-syne text-6xl md:text-8xl font-extrabold leading-[0.95] tracking-tight mb-8 animate-fade-in animate-delay-2">
          Real players.<br />
          <span className="text-primary">Real feedback.</span>
        </h1>

        <p className="font-inter text-lg text-muted-foreground max-w-lg leading-relaxed mb-12 animate-fade-in animate-delay-3">
          Connect your game with testers who actually play it.
          Get structured reports, recordings, and ratings — without the noise.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 animate-fade-in animate-delay-4">
          <button className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground font-syne font-semibold text-sm rounded hover:bg-primary/90 transition-colors">
            Get early access
            <Icon name="ArrowRight" size={14} />
          </button>
          <button className="inline-flex items-center gap-2 px-6 py-3 border border-border text-foreground font-inter text-sm rounded hover:border-muted-foreground transition-colors">
            See how it works
          </button>
        </div>
      </section>

      {/* STATS ROW */}
      <section className="border-t border-border py-16 px-8">
        <div className="max-w-5xl mx-auto grid grid-cols-3 divide-x divide-border">
          {[
            { value: "2,400+", label: "Active testers" },
            { value: "48h", label: "Avg. feedback time" },
            { value: "94%", label: "Report completion" },
          ].map((stat) => (
            <div key={stat.label} className="text-center py-4 px-6">
              <div className="font-syne text-4xl font-bold text-foreground mb-1">{stat.value}</div>
              <div className="font-inter text-sm text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-28 px-8 max-w-5xl mx-auto">
        <p className="font-inter text-xs text-muted-foreground uppercase tracking-widest mb-4">How it works</p>
        <h2 className="font-syne text-4xl font-bold mb-16 max-w-md leading-tight">
          Three steps to real insights
        </h2>

        <div className="grid md:grid-cols-3 gap-px bg-border">
          {[
            {
              icon: "Upload",
              step: "01",
              title: "Upload your build",
              desc: "Share a link or upload your game. Supports PC, browser, and mobile.",
            },
            {
              icon: "Users",
              step: "02",
              title: "Match with testers",
              desc: "We match your game with testers from your target audience automatically.",
            },
            {
              icon: "FileText",
              step: "03",
              title: "Receive reports",
              desc: "Structured feedback, session recordings, and a score — ready in 48h.",
            },
          ].map((item) => (
            <div key={item.step} className="bg-card p-8 hover:bg-secondary/50 transition-colors group">
              <div className="flex items-start justify-between mb-8">
                <div className="w-10 h-10 rounded border border-border flex items-center justify-center group-hover:border-primary/50 transition-colors">
                  <Icon name={item.icon as "Upload"} size={18} className="text-primary" />
                </div>
                <span className="font-syne text-xs text-muted-foreground/40 font-semibold">{item.step}</span>
              </div>
              <h3 className="font-syne text-lg font-semibold mb-3">{item.title}</h3>
              <p className="font-inter text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA STRIP */}
      <section className="border-t border-border py-24 px-8">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          <div>
            <h2 className="font-syne text-3xl font-bold mb-2">Ready to test?</h2>
            <p className="font-inter text-sm text-muted-foreground">Join 300+ studios already using PlayTester.</p>
          </div>
          <button className="shrink-0 inline-flex items-center gap-2 px-7 py-3.5 bg-primary text-primary-foreground font-syne font-semibold text-sm rounded hover:bg-primary/90 transition-colors">
            Get early access
            <Icon name="ArrowRight" size={14} />
          </button>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-border py-8 px-8">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <span className="font-syne text-sm text-muted-foreground">
            play<span className="text-primary">tester</span> © 2026
          </span>
          <div className="flex gap-6">
            {["Privacy", "Terms", "Contact"].map((link) => (
              <button key={link} className="font-inter text-sm text-muted-foreground hover:text-foreground transition-colors">
                {link}
              </button>
            ))}
          </div>
        </div>
      </footer>

    </div>
  );
};

export default Index;
