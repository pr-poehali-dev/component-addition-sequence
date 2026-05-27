import { useState, useEffect, useRef } from "react";
import Icon from "@/components/ui/icon";

interface MainItem {
  icon: string;
  label: string;
  badge?: string | number;
  trailing?: "plus";
}

interface SectionItem {
  icon: string;
  label: string;
  badge?: string | number;
  trailing?: "plus" | "caret";
  children?: { label: string; badge?: string | number }[];
}

interface Section {
  key: string;
  title: string;
  items: SectionItem[];
}

const mainItems: MainItem[] = [
  { icon: "Home", label: "Home" },
  { icon: "Bell", label: "Updates", badge: 44 },
  { icon: "Inbox", label: "Inbox", badge: 20 },
  { icon: "ClipboardList", label: "My tasks", trailing: "plus" },
];

const sections: Section[] = [
  {
    key: "workspace",
    title: "WORKSPACE",
    items: [
      { icon: "Layers", label: "Projects", trailing: "caret" },
      { icon: "CheckSquare", label: "Tasks", trailing: "plus" },
      { icon: "LayoutGrid", label: "Views", trailing: "caret" },
      { icon: "Users", label: "Teams", badge: 48 },
      { icon: "FileText", label: "Reports" },
    ],
  },
  {
    key: "projects",
    title: "PROJECTS",
    items: [
      { icon: "Square", label: "Thoughts™", trailing: "caret" },
      { icon: "Square", label: "Jammio™", trailing: "caret" },
      {
        icon: "Square",
        label: "Create™ AI",
        trailing: "caret",
        children: [
          { label: "March", badge: 99 },
          { label: "April", badge: 99 },
        ],
      },
      {
        icon: "Square",
        label: "Consumex™",
        trailing: "caret",
        children: [
          { label: "January", badge: 12 },
          { label: "February", badge: 23 },
          { label: "March", badge: 23 },
          { label: "April", badge: 23 },
        ],
      },
      { icon: "Square", label: "Tuesday™", trailing: "caret" },
    ],
  },
];

const projectIconColors: Record<string, string> = {
  "Thoughts™": "text-orange-500",
  "Jammio™": "text-fuchsia-500",
  "Create™ AI": "text-emerald-500",
  "Consumex™": "text-sky-500",
  "Tuesday™": "text-violet-400",
};

const collapsedIcons = [
  { icon: "Home", label: "Home" },
  { icon: "Search", label: "Search" },
  { icon: "Bell", label: "Updates" },
  { icon: "Inbox", label: "Inbox" },
  { icon: "MessageCircle", label: "Chat" },
  { icon: "ClipboardList", label: "My tasks" },
  { icon: "Users", label: "Teams" },
  { icon: "Layers", label: "Projects" },
];

type Theme = "light" | "dark" | "system";

const useTheme = () => {
  const [theme, setTheme] = useState<Theme>(() => {
    return (localStorage.getItem("theme") as Theme) ?? "system";
  });
  const [systemIsDark, setSystemIsDark] = useState<boolean>(() =>
    typeof window !== "undefined" && window.matchMedia("(prefers-color-scheme: dark)").matches
  );

  useEffect(() => {
    const root = document.documentElement;
    const apply = (t: Theme) => {
      if (t === "system") {
        const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
        setSystemIsDark(prefersDark);
        root.classList.toggle("dark", prefersDark);
      } else {
        root.classList.toggle("dark", t === "dark");
      }
    };
    apply(theme);
    localStorage.setItem("theme", theme);

    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = () => {
      setSystemIsDark(mq.matches);
      if (theme === "system") apply("system");
    };
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, [theme]);

  return { theme, setTheme, systemIsDark };
};

interface SidebarProps {
  activeItem?: string;
  onItemClick?: (label: string) => void;
}

const SIDEBAR_STORAGE_KEY = "sidebar:expanded";

const Sidebar = ({ activeItem = "Tasks", onItemClick }: SidebarProps) => {
  const [expanded, setExpanded] = useState<boolean>(() => {
    if (typeof window === "undefined") return true;
    const stored = localStorage.getItem(SIDEBAR_STORAGE_KEY);
    return stored === null ? true : stored === "true";
  });
  const [hoverOpen, setHoverOpen] = useState(false);
  const [active, setActive] = useState(activeItem);
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    workspace: true,
    projects: true,
  });
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({
    "Tuesday™": true,
    "Create™ AI": true,
  });
  const [themeMenuOpen, setThemeMenuOpen] = useState(false);
  const themeRef = useRef<HTMLDivElement>(null);
  const hoverTimer = useRef<number | null>(null);
  const { theme, setTheme, systemIsDark } = useTheme();

  useEffect(() => {
    localStorage.setItem(SIDEBAR_STORAGE_KEY, String(expanded));
  }, [expanded]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (themeRef.current && !themeRef.current.contains(e.target as Node)) {
        setThemeMenuOpen(false);
      }
    };
    if (themeMenuOpen) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [themeMenuOpen]);

  const handleClick = (label: string) => {
    setActive(label);
    onItemClick?.(label);
  };

  const toggleSection = (key: string) => {
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const toggleItem = (label: string) => {
    setOpenItems((prev) => ({ ...prev, [label]: !prev[label] }));
  };

  const openHover = () => {
    if (hoverTimer.current) {
      window.clearTimeout(hoverTimer.current);
      hoverTimer.current = null;
    }
    setHoverOpen(true);
  };
  const closeHoverWithDelay = () => {
    if (hoverTimer.current) window.clearTimeout(hoverTimer.current);
    hoverTimer.current = window.setTimeout(() => setHoverOpen(false), 150);
  };

  const themes: { value: Theme; icon: string; label: string }[] = [
    { value: "light", icon: "Sun", label: "Светлая тема" },
    { value: "dark", icon: "Moon", label: "Тёмная тема" },
    { value: "system", icon: "Monitor", label: "Системная" },
  ];
  const currentTheme = themes.find((t) => t.value === theme)!;

  const renderBadge = (badge?: string | number) =>
    badge !== undefined ? (
      <span className="font-inter text-xs text-muted-foreground/80 underline underline-offset-2 decoration-muted-foreground/40">
        {badge}
      </span>
    ) : null;

  const renderTrailing = (trailing?: SectionItem["trailing"], isOpen?: boolean) => {
    if (trailing === "plus")
      return <Icon name="Plus" size={13} className="text-muted-foreground/60" />;
    if (trailing === "caret")
      return (
        <Icon
          name={isOpen ? "ChevronUp" : "ChevronDown"}
          size={13}
          className="text-muted-foreground/60"
        />
      );
    return null;
  };

  // ===== Узкая полоса иконок (всегда видна, когда expanded === false) =====
  const collapsedRail = (
    <aside
      onMouseEnter={openHover}
      onMouseLeave={closeHoverWithDelay}
      className="relative flex flex-col h-screen border-r border-border bg-card w-[52px] shrink-0"
    >
      <div className="flex items-center justify-center h-14 shrink-0">
        <button
          onClick={() => {
            setHoverOpen(false);
            setExpanded(true);
          }}
          className="w-8 h-8 flex items-center justify-center text-foreground hover:bg-secondary rounded-md transition-colors"
          title="Развернуть"
        >
          <Icon name="Layers" size={18} />
        </button>
      </div>

      <div className="flex-1 flex flex-col items-center gap-1 px-1 pt-2 overflow-y-auto">
        {collapsedIcons.map((it) => {
          const isActive = active === it.label;
          return (
            <button
              key={it.label}
              onClick={() => handleClick(it.label)}
              title={it.label}
              className={`
                w-9 h-9 flex items-center justify-center rounded-md transition-colors
                ${isActive
                  ? "bg-secondary text-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary/60"
                }
              `}
            >
              <Icon name={it.icon as "Home"} size={17} />
            </button>
          );
        })}
      </div>

      <div className="flex flex-col items-center gap-1 px-1 py-3 shrink-0">
        <button
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          title={currentTheme.label}
          className="w-9 h-9 flex items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-secondary/60 transition-colors"
        >
          <Icon name={currentTheme.icon as "Sun"} size={17} />
        </button>
        <button
          className="w-9 h-9 flex items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-secondary/60 transition-colors"
          title="Аккаунт"
        >
          <Icon name="User" size={17} />
        </button>
        <button
          className="w-9 h-9 flex items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-secondary/60 transition-colors"
          title="Настройки"
        >
          <Icon name="SlidersHorizontal" size={17} />
        </button>
        <div className="w-7 h-7 rounded-md bg-gradient-to-br from-pink-400 via-yellow-300 to-cyan-300 mt-1" />
      </div>
    </aside>
  );

  // ===== Развёрнутая панель (используется и как inline, и как overlay) =====
  const renderPanel = (variant: "inline" | "overlay") => (
    <div
      className={`
        flex flex-col h-screen bg-card w-64 shrink-0
        ${variant === "inline"
          ? "border-r border-border"
          : "fixed top-0 left-[52px] z-50 border border-border rounded-r-xl shadow-2xl animate-fade-in"
        }
      `}
      onMouseEnter={variant === "overlay" ? openHover : undefined}
      onMouseLeave={variant === "overlay" ? closeHoverWithDelay : undefined}
    >
      {/* HEADER */}
      <div className="flex items-center h-14 px-3 gap-2 shrink-0">
        <div className="w-6 h-6 rounded-md bg-gradient-to-br from-pink-400 via-yellow-300 to-cyan-300 shrink-0" />
        <button className="flex items-center gap-1 font-inter text-sm font-semibold text-foreground hover:bg-secondary/50 rounded-md px-1.5 py-1 transition-colors flex-1 min-w-0">
          <span className="truncate">Starline™ AI</span>
          <Icon name="ChevronDown" size={13} className="text-muted-foreground shrink-0" />
        </button>
        <button
          onClick={() => {
            if (variant === "overlay") {
              setHoverOpen(false);
              setExpanded(true);
            } else {
              setExpanded(false);
            }
          }}
          className="w-7 h-7 flex items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors shrink-0"
          title={variant === "overlay" ? "Закрепить" : "Свернуть"}
        >
          <Icon name={variant === "overlay" ? "PanelLeftOpen" : "PanelLeftClose"} size={15} />
        </button>
      </div>

      {/* COMMAND */}
      <div className="px-3 pb-2 shrink-0">
        <div className="flex items-center gap-2 bg-secondary/50 hover:bg-secondary transition-colors rounded-md px-2.5 py-1.5 cursor-text">
          <Icon name="Command" size={13} className="text-muted-foreground" />
          <span className="font-inter text-sm text-muted-foreground flex-1">Command</span>
          <span className="font-inter text-xs text-muted-foreground/70">/</span>
        </div>
      </div>

      {/* NAV */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden px-2 pb-3">
        <div className="flex flex-col gap-0.5 pb-2">
          {mainItems.map((item) => {
            const isActive = active === item.label;
            return (
              <button
                key={item.label}
                onClick={() => handleClick(item.label)}
                className={`
                  group flex items-center gap-2.5 w-full px-2 py-1.5 rounded-md transition-colors
                  ${isActive
                    ? "bg-secondary text-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary/60"
                  }
                `}
              >
                <Icon name={item.icon as "Home"} size={16} className="shrink-0" />
                <span className="font-inter text-sm flex-1 text-left truncate">{item.label}</span>
                {renderBadge(item.badge)}
                {renderTrailing(item.trailing)}
              </button>
            );
          })}
        </div>

        {sections.map((section) => {
          const isOpen = openSections[section.key];
          return (
            <div key={section.key} className="pt-3 mt-1 border-t border-border">
              <div className="flex items-center gap-1.5 px-2 py-1 mb-0.5">
                <button
                  onClick={() => toggleSection(section.key)}
                  className="flex items-center gap-1.5 flex-1 text-left"
                >
                  <Icon
                    name={isOpen ? "ChevronDown" : "ChevronRight"}
                    size={11}
                    className="text-muted-foreground"
                  />
                  <span className="font-inter text-[11px] font-semibold tracking-widest text-muted-foreground">
                    {section.title}
                  </span>
                </button>
                <button className="text-muted-foreground/60 hover:text-foreground transition-colors">
                  <Icon name="MoreHorizontal" size={13} />
                </button>
                <button className="text-muted-foreground/60 hover:text-foreground transition-colors">
                  <Icon name="Plus" size={13} />
                </button>
              </div>

              {isOpen && (
                <div className="flex flex-col gap-0.5">
                  {section.items.map((item) => {
                    const isActive = active === item.label;
                    const hasChildren = !!item.children?.length;
                    const isItemOpen = openItems[item.label];
                    const iconColor = section.key === "projects"
                      ? projectIconColors[item.label] ?? "text-muted-foreground"
                      : "";
                    return (
                      <div key={item.label}>
                        <div
                          className={`
                            group flex items-center gap-2.5 w-full px-2 py-1.5 rounded-md cursor-pointer transition-colors
                            ${isActive
                              ? "bg-secondary text-foreground"
                              : "text-muted-foreground hover:text-foreground hover:bg-secondary/60"
                            }
                          `}
                          onClick={() => handleClick(item.label)}
                        >
                          <Icon
                            name={item.icon as "Layers"}
                            size={16}
                            className={`shrink-0 ${iconColor}`}
                            fallback="Square"
                          />
                          <span className="font-inter text-sm flex-1 text-left truncate">
                            {item.label}
                          </span>
                          {renderBadge(item.badge)}
                          {item.trailing === "caret" && hasChildren ? (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleItem(item.label);
                              }}
                              className="text-muted-foreground/60 hover:text-foreground"
                            >
                              <Icon
                                name={isItemOpen ? "ChevronUp" : "ChevronDown"}
                                size={13}
                              />
                            </button>
                          ) : (
                            renderTrailing(item.trailing, isItemOpen)
                          )}
                        </div>

                        {hasChildren && isItemOpen && (
                          <div className="flex flex-col gap-0.5 mt-0.5 mb-1">
                            {item.children!.map((sub) => {
                              const isSubActive = active === sub.label;
                              return (
                                <button
                                  key={sub.label}
                                  onClick={() => handleClick(sub.label)}
                                  className={`
                                    flex items-center w-full pl-8 pr-2 py-1.5 rounded-md transition-colors
                                    ${isSubActive
                                      ? "bg-secondary text-foreground"
                                      : "text-muted-foreground hover:text-foreground hover:bg-secondary/60"
                                    }
                                  `}
                                >
                                  <span className="font-inter text-sm flex-1 text-left truncate">
                                    {sub.label}
                                  </span>
                                  {renderBadge(sub.badge)}
                                </button>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* В overlay показываем превью и Upgrade Plan как на референсе */}
      {variant === "overlay" && (
        <div className="px-3 pb-3 shrink-0 flex flex-col gap-2">
          <div className="relative w-full h-24 rounded-md overflow-hidden border border-border bg-gradient-to-br from-secondary to-secondary/50">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-9 h-9 rounded-full bg-background/80 backdrop-blur flex items-center justify-center">
                <Icon name="Play" size={14} className="text-foreground translate-x-0.5" />
              </div>
            </div>
            <div className="absolute top-2 left-2 right-2 flex flex-col gap-1 opacity-40">
              <div className="h-1 w-1/2 rounded bg-foreground/60" />
              <div className="h-1 w-1/3 rounded bg-foreground/40" />
            </div>
          </div>
          <button className="w-full flex items-center justify-center gap-2 bg-foreground text-background font-inter text-sm font-semibold rounded-md py-2.5 hover:opacity-90 transition-opacity">
            <Icon name="ArrowUpCircle" size={15} />
            Upgrade Plan
          </button>
        </div>
      )}

      {/* Низ панели в inline-режиме */}
      {variant === "inline" && (
        <div className="shrink-0 border-t border-border px-2 py-2 relative" ref={themeRef}>
          <div className="flex items-center justify-between gap-1">
            <button
              onClick={() => setThemeMenuOpen((v) => !v)}
              title={currentTheme.label}
              className="w-8 h-8 flex items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-secondary/60 transition-colors"
            >
              <Icon name={currentTheme.icon as "Sun"} size={16} />
            </button>
            <button
              className="w-8 h-8 flex items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-secondary/60 transition-colors"
              title="Аккаунт"
            >
              <Icon name="User" size={16} />
            </button>
            <button
              className="w-8 h-8 flex items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-secondary/60 transition-colors"
              title="Настройки"
            >
              <Icon name="SlidersHorizontal" size={16} />
            </button>
            <div className="flex-1" />
            <div className="w-7 h-7 rounded-md bg-gradient-to-br from-pink-400 via-yellow-300 to-cyan-300" />
          </div>

          {themeMenuOpen && (
            <div className="absolute bottom-12 left-2 z-50 min-w-[220px] py-1.5 bg-popover text-popover-foreground border border-border rounded-lg shadow-lg">
              {themes.map(({ value, icon, label }) => {
                const isActive = theme === value;
                const showSystemHint = value === "system";
                return (
                  <button
                    key={value}
                    onClick={() => {
                      setTheme(value);
                      setThemeMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-3 px-3 py-2 hover:bg-secondary/70 transition-colors text-left"
                  >
                    <Icon name={icon as "Sun"} size={16} className="shrink-0 text-muted-foreground" />
                    <span className="font-inter text-sm font-medium flex-1">
                      {label}
                      {showSystemHint && (
                        <span className="text-muted-foreground font-normal ml-1.5">
                          ({systemIsDark ? "тёмная" : "светлая"})
                        </span>
                      )}
                    </span>
                    {isActive && (
                      <Icon name="Check" size={15} className="text-primary shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );

  if (expanded) {
    return renderPanel("inline");
  }

  return (
    <>
      {collapsedRail}
      {hoverOpen && renderPanel("overlay")}
    </>
  );
};

export default Sidebar;
