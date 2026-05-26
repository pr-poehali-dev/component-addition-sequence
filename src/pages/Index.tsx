import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import Icon from "@/components/ui/icon";

const pageContent: Record<string, React.ReactNode> = {
  Dashboard: (
    <div>
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-primary/30 bg-primary/5 mb-6">
          <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
          <span className="font-inter text-xs text-primary font-medium tracking-wide">Beta — early access open</span>
        </div>
        <h1 className="font-syne text-5xl font-extrabold leading-[0.95] tracking-tight mb-4">
          Real players.<br />
          <span className="text-primary">Real feedback.</span>
        </h1>
        <p className="font-inter text-base text-muted-foreground max-w-lg leading-relaxed">
          Connect your game with testers who actually play it. Get structured reports, recordings, and ratings — without the noise.
        </p>
      </div>

      <div className="flex gap-3 mb-12">
        <button className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground font-syne font-semibold text-sm rounded hover:bg-primary/90 transition-colors">
          Get early access
          <Icon name="ArrowRight" size={14} />
        </button>
        <button className="inline-flex items-center gap-2 px-5 py-2.5 border border-border text-foreground font-inter text-sm rounded hover:border-muted-foreground transition-colors">
          See how it works
        </button>
      </div>

      <div className="grid grid-cols-3 gap-px bg-border rounded-lg overflow-hidden mb-12">
        {[
          { value: "2,400+", label: "Active testers" },
          { value: "48h", label: "Avg. feedback time" },
          { value: "94%", label: "Report completion" },
        ].map((stat) => (
          <div key={stat.label} className="bg-card text-center py-6 px-4">
            <div className="font-syne text-3xl font-bold text-foreground mb-1">{stat.value}</div>
            <div className="font-inter text-xs text-muted-foreground">{stat.label}</div>
          </div>
        ))}
      </div>

      <div>
        <p className="font-inter text-xs text-muted-foreground uppercase tracking-widest mb-4">How it works</p>
        <div className="grid grid-cols-3 gap-px bg-border rounded-lg overflow-hidden">
          {[
            { icon: "Upload", step: "01", title: "Upload your build", desc: "Share a link or upload your game. Supports PC, browser, and mobile." },
            { icon: "Users", step: "02", title: "Match with testers", desc: "We match your game with testers from your target audience automatically." },
            { icon: "FileText", step: "03", title: "Receive reports", desc: "Structured feedback, session recordings, and a score — ready in 48h." },
          ].map((item) => (
            <div key={item.step} className="bg-card p-6 hover:bg-secondary/50 transition-colors group">
              <div className="flex items-start justify-between mb-6">
                <div className="w-9 h-9 rounded border border-border flex items-center justify-center group-hover:border-primary/50 transition-colors">
                  <Icon name={item.icon as "Upload"} size={16} className="text-primary" />
                </div>
                <span className="font-syne text-xs text-muted-foreground/40 font-semibold">{item.step}</span>
              </div>
              <h3 className="font-syne text-base font-semibold mb-2">{item.title}</h3>
              <p className="font-inter text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  ),
};

const placeholderPage = (title: string) => (
  <div className="flex flex-col items-center justify-center h-64 text-center">
    <div className="w-12 h-12 rounded-full border border-border flex items-center justify-center mb-4">
      <Icon name="Construction" size={20} className="text-muted-foreground" />
    </div>
    <h2 className="font-syne text-xl font-bold mb-2">{title}</h2>
    <p className="font-inter text-sm text-muted-foreground">Coming soon — we're building this section.</p>
  </div>
);

const Index = () => {
  const [activePage, setActivePage] = useState("Dashboard");

  const content = pageContent[activePage] ?? placeholderPage(activePage);

  return (
    <div className="flex h-screen bg-background text-foreground overflow-hidden">
      <Sidebar activeItem={activePage} onItemClick={setActivePage} />

      <main className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto px-8 py-10">
          {content}
        </div>
      </main>
    </div>
  );
};

export default Index;
